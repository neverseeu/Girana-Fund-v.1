import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3001;

app.use(express.json());

// CORS for dev
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// ==================== LOGO PROXY ====================
// Fetches company logos from multiple sources with fallback chain
// Caches results in memory for performance

const logoCache = new Map<string, { data: Buffer; contentType: string; timestamp: number }>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

const LOGO_SOURCES = [
  (domain: string) => `https://logo.clearbit.com/${domain}`,
  (domain: string) => `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
  (domain: string) => `https://icon.horse/icon/${domain}`,
  (domain: string) => `https://favicon.im/${domain}`,
];

app.get('/api/logo/:domain', async (req, res) => {
  const { domain } = req.params;
  const size = parseInt(req.query.size as string) || 128;

  // Check cache
  const cached = logoCache.get(domain);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    res.set('Content-Type', cached.contentType);
    res.set('Cache-Control', 'public, max-age=86400');
    return res.send(cached.data);
  }

  // Try each source
  for (const getUrl of LOGO_SOURCES) {
    try {
      const url = getUrl(domain);
      const response = await fetch(url, {
        signal: AbortSignal.timeout(5000),
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });

      if (response.ok) {
        const contentType = response.headers.get('content-type') || 'image/png';
        const arrayBuffer = await response.arrayBuffer();
        const data = Buffer.from(arrayBuffer);

        // Only cache if we got actual image data (> 100 bytes)
        if (data.length > 100) {
          logoCache.set(domain, { data, contentType, timestamp: Date.now() });
          res.set('Content-Type', contentType);
          res.set('Cache-Control', 'public, max-age=86400');
          return res.send(data);
        }
      }
    } catch {
      continue;
    }
  }

  // Generate SVG fallback letter
  const letter = domain.charAt(0).toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <rect width="${size}" height="${size}" rx="${size / 2}" fill="#1a1a1a"/>
    <rect x="1" y="1" width="${size - 2}" height="${size - 2}" rx="${size / 2 - 1}" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
    <text x="50%" y="54%" font-family="Inter, system-ui, sans-serif" font-size="${size * 0.4}" font-weight="700" fill="white" text-anchor="middle" dominant-baseline="middle">${letter}</text>
  </svg>`;

  res.set('Content-Type', 'image/svg+xml');
  res.set('Cache-Control', 'public, max-age=86400');
  res.send(svg);
});

// ==================== PORTFOLIO API ====================
app.get('/api/portfolio', (req, res) => {
  res.json({
    success: true,
    data: [
      { name: 'Espresso', category: 'Infrastructure', url: 'https://www.espressosys.com/', domain: 'espressosys.com' },
      { name: 'Fetch.ai', category: 'Agentic AI', url: 'https://fetch.ai/', domain: 'fetch.ai' },
      { name: 'Nym', category: 'Data Privacy', url: 'https://nymtech.net/', domain: 'nymtech.net' },
      { name: 'Zama', category: 'Cryptography', url: 'https://zama.ai/', domain: 'zama.ai' },
      { name: 'Helium', category: 'DePIN', url: 'https://www.helium.com/', domain: 'helium.com' },
      { name: 'Scroll', category: 'ZK Layer', url: 'https://scroll.io/', domain: 'scroll.io' },
      { name: 'LayerZero', category: 'Cross-chain', url: 'https://layerzero.network/', domain: 'layerzero.network' },
      { name: 'Gauntlet', category: 'Tokenomics', url: 'https://gauntlet.network/', domain: 'gauntlet.network' },
    ],
  });
});

// ==================== HEALTH ====================
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// ==================== TELEGRAM NOTIFICATIONS ====================
const TELEGRAM_BOT_TOKEN = '8715802112:AAFcufzTV2r_4JBFl1CDP6MjQ-onCqVE2so';
const TELEGRAM_CHAT_ID = '-5042990329';

const telegramRateLimit = new Map();

app.post('/api/telegram', async (req, res) => {
  try {
    const ip = req.ip || req.connection?.remoteAddress || 'unknown';
    const now = Date.now();
    const lastRequest = telegramRateLimit.get(ip) || 0;
    
    // Strict Rate Limit: 1 request per minute per IP
    if (now - lastRequest < 60000) {
      return res.status(429).json({ error: 'Too many requests. Please wait a minute.' });
    }
    telegramRateLimit.set(ip, now);

    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Text is required' });
    
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: text,
        parse_mode: 'HTML',
      }),
    });
    
    if (!response.ok) throw new Error('Telegram API error');
    res.json({ success: true });
  } catch (error) {
    console.error('Telegram error:', error);
    res.status(500).json({ success: false, error: 'Failed to send message' });
  }
});

// ==================== PRODUCTION STATIC ====================
if (process.env.NODE_ENV === 'production') {
  const distPath = path.resolve(__dirname, '../dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

if (process.env.NODE_ENV !== 'production' && process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`✓ Girana.Fund API server running on port ${PORT}`);
    console.log(`  Logo proxy:   http://localhost:${PORT}/api/logo/:domain`);
    console.log(`  Portfolio:    http://localhost:${PORT}/api/portfolio`);
    console.log(`  Health:       http://localhost:${PORT}/api/health`);
  });
}

export default app;
