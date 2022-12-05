module.exports = {
  apps: [
    {
      name: "client1",
      instances: "1",
      exec_mode: "fork",
      script: "npm run go", // your script
      env: {
        DEBUG_LEVEL: "info",
        MIN_HERO_ENERGY_PERCENTAGE: "50",
        LOGIN: "user:USER:PASSWORD",
        TELEGRAM_KEY: "TELEGRAM_KEY",
        NETWORK: "POLYGON",
        VERSION: 22112406,
        MIN_HERO_ENERGY_PERCENTAGE: 50,
        ALERT_SHIELD: 50

      },
    },
  ],
};