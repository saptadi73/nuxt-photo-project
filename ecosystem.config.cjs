module.exports = {
  apps: [
    {
      name: 'nuxt-app',
      script: './.output/server/index.mjs',
      instances: 1,
      exec_mode: 'cluster',
      env_production: {
        NODE_ENV: 'production',
        HOST: '0.0.0.0',
        PORT: 3000,
        NUXT_PUBLIC_API_BASE_URL: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'
      }
    }
  ]
};
