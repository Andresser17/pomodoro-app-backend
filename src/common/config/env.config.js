const config = {
  port: 3600,
  appEndpoint: "http://localhost:3600",
  apiEndpoint: "http://localhost:3600",
  jwtSecret: "myS33!!creeeT",
  jwtExpirationInSeconds: 36000,
  environment: "dev",
  permissionLevels: {
    NORMAL_USER: 1,
    PAID_USER: 4,
    ADMIN: 2048,
  },
};

export default config;
