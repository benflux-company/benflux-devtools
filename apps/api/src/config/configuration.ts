export default () => ({
  port: parseInt(process.env.PORT || '4000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',

  database: {
    url: process.env.DATABASE_URL,
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'fallback-secret-change-in-production',
    expiresIn: '1h',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret',
    refreshExpiresIn: '7d',
  },

  github: {
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackUrl: process.env.GITHUB_CALLBACK_URL || 'http://localhost:4000/api/auth/github/callback',
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
