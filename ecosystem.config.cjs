// ==============================================================================
// STATIQONE PM2 Cluster Configuration
// Target: Hostinger VPS Multi-Core Node.js Runtime
// ==============================================================================

module.exports = {
  apps: [
    {
      name: 'statiqone-backend',
      script: './authsystem/backend/src/server.js',
      instances: 'max',
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'development',
        PORT: 4000,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 4000,
      },
      error_file: '/var/log/pm2/statiqone-backend-error.log',
      out_file: '/var/log/pm2/statiqone-backend-out.log',
      merge_logs: true,
      time: true,
      listen_timeout: 8000,
      kill_timeout: 5000,
    },
  ],
};
