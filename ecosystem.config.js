module.exports = {
  apps: [{
    name: "warning-bot",
    script: "index.js",
    watch: true,
    ignore_watch: ["node_modules", "data"],
    env: {
      NODE_ENV: "production",
    },
    exp_backoff_restart_delay: 100,
    max_memory_restart: "300M",
    autorestart: true,
    restart_delay: 4000,
    error_file: "logs/error.log",
    out_file: "logs/output.log",
    log_file: "logs/combined.log",
    time: true
  }]
}; 