module.exports = {
  apps: [
    {
      name: "fitnessplus_backend",
      cwd: "/var/pm2/apps/fitnessplus_backend",
      script: "index.js",
      log_date_format: "YYYY-MM-DD HH:mm Z",

      env: {
        DATABASE_URL: "",
        JWT_SECRET_ACCESS: "",
        JWT_SECRET_REFRESH: "",
        RESEND_API_KEY: "",
        FRONTEND_URL: "",
        PORT: 3005,
      },
    },
  ],
};
