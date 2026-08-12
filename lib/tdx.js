/**
 * tdx.js — TDX API 認證與請求模組
 *
 * 使用方式：
 *   const tdx = require('./tdx.js');
 *   const data = await tdx.get('/Bus/Route/City/Taipei');
 *
 * 自動處理：
 *   - OAuth2 client_credentials token 取得與快取
 *   - Token 過期前自動刷新（expires_in - 60s buffer）
 *   - 401 時自動重試一次（重新取 token）
 */

const https = require('https');

const TDX_CLIENT_ID = process.env.TDX_CLIENT_ID || '';
const TDX_CLIENT_SECRET = process.env.TDX_CLIENT_SECRET || '';
const TOKEN_URL = 'https://tdx.transportdata.tw/auth/realms/TDXConnect/protocol/openid-connect/token';
const API_BASE = 'https://tdx.transportdata.tw/api/basic/v2';

let _token = null;
let _tokenExpiresAt = 0; // unix ms

// ─── OAuth2 Token ────────────────────────────────────────────────

function _postForm(urlStr, body) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlStr);
    const bodyStr = Object.entries(body)
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      .join('&');

    const opts = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(bodyStr),
        'User-Agent': 'taipei-bus-skill',
      },
    };

    const req = https.request(opts, res => {
      let data = '';
      res.on('data', c => (data += c));
      res.on('end', () => {
        if (res.statusCode !== 200) {
          return reject(new Error(`TDX token error ${res.statusCode}: ${data}`));
        }
        try {
          resolve(JSON.parse(data));
        } catch {
          reject(new Error(`TDX token JSON parse error: ${data}`));
        }
      });
    });
    req.on('error', reject);
    req.write(bodyStr);
    req.end();
  });
}

async function getToken() {
  if (!TDX_CLIENT_ID || !TDX_CLIENT_SECRET) {
    throw new Error('TDX_CLIENT_ID / TDX_CLIENT_SECRET 環境變數未設定');
  }

  // 如果 token 有效期還有 >60s，直接回傳
  if (_token && Date.now() < _tokenExpiresAt - 60_000) {
    return _token;
  }

  const tok = await _postForm(TOKEN_URL, {
    grant_type: 'client_credentials',
    client_id: TDX_CLIENT_ID,
    client_secret: TDX_CLIENT_SECRET,
  });

  _token = tok.access_token;
  _tokenExpiresAt = Date.now() + tok.expires_in * 1000;
  return _token;
}

// ─── HTTP GET ────────────────────────────────────────────────────

function _httpsGet(urlStr, token) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlStr);
    const opts = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'User-Agent': 'taipei-bus-skill',
      },
    };

    const req = https.request(opts, res => {
      let data = '';
      res.on('data', c => (data += c));
      res.on('end', () => {
        if (res.statusCode === 401) {
          // Token 過期，清除並拋出特定錯誤
          _token = null;
          _tokenExpiresAt = 0;
          return reject(new Error('TDX_TOKEN_EXPIRED'));
        }
        if (res.statusCode !== 200) {
          return reject(new Error(`TDX API ${res.statusCode}: ${data}`));
        }
        try {
          resolve(JSON.parse(data));
        } catch {
          resolve([]); // 空內容視為 []
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

/**
 * TDX API GET 請求
 * @param {string} path — 例如 '/Bus/Route/City/Taipei?$top=5'
 * @param {object} opts — { retry?: boolean }
 */
async function tdxGet(apiPath, opts = {}) {
  const retry = opts.retry !== false;
  let token;

  try {
    token = await getToken();
    return await _httpsGet(API_BASE + apiPath, token);
  } catch (err) {
    if (err.message === 'TDX_TOKEN_EXPIRED' && retry) {
      _token = null;
      _tokenExpiresAt = 0;
      token = await getToken();
      return await _httpsGet(API_BASE + apiPath, token);
    }
    throw err;
  }
}

// ─── 公開 API ────────────────────────────────────────────────────

/**
 * 取得所有公車路線（精簡，無 StopOfRoute）
 * @returns {Promise<RouteRecord[]>}
 */
async function getRoutes() {
  return tdxGet('/Bus/Route/City/Taipei?$top=500');
}

/**
 * 依 RouteUID 取得站序（Tdx 版 StopOfRoute）
 * TDX StopOfRoute 的 Stops 是巢狀陣列：entry.Stops[]
 * @param {string} routeUid — 例如 'TPE10132'
 * @param {number} [direction] — 0=去程 1=返程
 * @returns {Promise<StopRecord[]>} — 攤平的 stop 陣列，含座標
 */
async function getStopsOfRoute(routeUid, direction) {
  const filter = `RouteUID eq '${routeUid}'${direction !== undefined ? ` and Direction eq ${direction}` : ''}`;
  const params = encodeURIComponent(filter);
  const raw = await tdxGet(`/Bus/StopOfRoute/City/Taipei?$filter=${params}`);
  // TDX StopOfRoute: [{ RouteUID, Direction, Stops: [...], ... }]
  // Direction 0=去程 1=返程
  const entry = raw.find(e => direction === undefined || e.Direction === direction);
  if (!entry) return [];
  // 巢狀 Stops[] → 攤平
  return (entry.Stops || []).map(s => ({
    StopUID: s.StopUID,
    StopID: s.StopID,
    StopName: s.StopName?.Zh_tw || s.StopName?.En || s.StopID,
    StopNameEn: s.StopName?.En || '',
    StopSequence: s.StopSequence,
    StopPosition: s.StopPosition || null,
    // TDX StopOfRoute 的 StationID 在 Stops[] 內
    StationID: s.StationID || null,
    // 額外複製上層 Direction
    Direction: entry.Direction,
    RouteUID: entry.RouteUID,
    RouteName: entry.RouteName?.Zh_tw || '',
  }));
}

/**
 * 依 RouteUID 查詢 ETA（到站預估）
 * @param {string} routeUid
 * @param {number} [direction]
 * @returns {Promise<ETARecord[]>}
 */
async function getETA(routeUid, direction) {
  const filters = [`RouteUID eq '${routeUid}'`];
  if (direction !== undefined) filters.push(`Direction eq ${direction}`);
  const params = encodeURIComponent(filters.join(' and '));
  return tdxGet(`/Bus/EstimatedTimeOfArrival/City/Taipei?$filter=${params}`);
}

/**
 * 即時公車位置（RealTimeNearStop）
 * @param {string} [routeUid] — 可選，篩特定路線
 * @param {number} [direction]
 * @returns {Promise<BusLiveRecord[]>}
 */
async function getLiveBuses(routeUid, direction) {
  const filters = [];
  if (routeUid) filters.push(`RouteUID eq '${routeUid}'`);
  if (direction !== undefined) filters.push(`Direction eq ${direction}`);
  const params = filters.length ? encodeURIComponent(filters.join(' and ')) : '';
  const q = params ? `?$filter=${params}` : '';
  return tdxGet(`/Bus/RealTimeNearStop/City/Taipei${q}`);
}

// ─── 工具 ────────────────────────────────────────────────────────

/**
 * 將 EstimateTime（秒）轉為易讀文字
 * @param {number|null} seconds
 * @returns {string}
 */
function formatETA(seconds) {
  if (!seconds) return '末班已過';
  if (seconds < 60) return `${seconds}秒`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m >= 60) {
    const h = Math.floor(m / 60);
    const mm = m % 60;
    return s > 0 ? `${h}小時${mm}分` : `${h}小時${mm}分`;
  }
  return s > 0 ? `${m}分${s}秒` : `${m}分`;
}

/**
 * 檢查 TDX 憑證是否已設定
 */
function isConfigured() {
  return Boolean(TDX_CLIENT_ID && TDX_CLIENT_SECRET);
}

module.exports = { getRoutes, getStopsOfRoute, getETA, getLiveBuses, formatETA, isConfigured };
