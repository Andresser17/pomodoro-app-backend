const authConfig = {
  secret: "bezkoder-secret-key",
  // Production
  // jwtExpiration: 3600,
  // jwtRefreshExpiration: 86400,

  // Development
  jwtExpiration: 360000,
  jwtRefreshExpiration: 8640000,

  // Test jwt
  // jwtExpiration: 60,
  // jwtRefreshExpiration: 3600,
};

export default authConfig;
