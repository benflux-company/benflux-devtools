export default () => ({
  port: parseInt(process.env.PORT || '4000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',

  database: {
    url: process.env.DATABASE_URL,
  },

  // Shared secret with benflux-auth: verifies the X-Benflux-* identity
  // headers the gateway attaches after a successful session check.
  gateway: {
    hmacSecret: process.env.GATEWAY_HMAC_SECRET,
  },

  auth: {
    publicUrl: process.env.AUTH_PUBLIC_URL || 'https://auth.benfluxgroup.com',
    apiUrl: process.env.AUTH_API_URL || 'https://auth.benfluxgroup.com',
  },

  // GitHub API automation (PR/issue tracking for weekly challenges) — not
  // related to login, which is handled entirely by benflux-auth.
  github: {
    token: process.env.GITHUB_TOKEN,
    owner: process.env.GITHUB_OWNER || 'benflux-company',
    repo: process.env.GITHUB_REPO || 'benflux-devtools',
  },

  app: {
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  },

  bfc: {
    weeklyPool: 100,
    usdRate: 0.05, // 1 BFC = $0.05 USD  →  100 BFC = $5 USD
    minWithdrawal: 50,
    rejectScoreThreshold: 60,
  },
});
