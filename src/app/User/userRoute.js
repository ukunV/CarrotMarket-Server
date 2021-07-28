module.exports = function (app) {
  const user = require("./userController");
  const jwtMiddleware = require("../../../config/jwtMiddleware");

  // 1. 로그인 API (비회원일 경우 회원가입 후 로그인)
  app.post("/login", user.createUser);

  // 2. 나의 당근 조회 API
  app.get("/user", jwtMiddleware, user.getMyCarrot);

  // 3. 회원 프로필 조회 API
  app.get("/user/:selectId/profile", jwtMiddleware, user.getUserProfile);

  // 4. 회원 프로필 수정 API
  app.patch("/user/profile", jwtMiddleware, user.updateUserProfile);
};
