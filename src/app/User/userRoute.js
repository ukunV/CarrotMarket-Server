module.exports = function (app) {
  const user = require("./userController");
  const jwtMiddleware = require("../../../config/jwtMiddleware");
  const passport = require("passport");

  // // 0. 카카오 로그인 API
  // app.post("/user/kakao-login", user.kakaoLogin);
  // app.get("/kakao", passport.authenticate("kakao-login"));
  // app.get(
  //   "/auth/kakao/callback",
  //   passport.authenticate("kakao-login", {
  //     successRedirect: "/",
  //     failureRedirect: "/",
  //   }),
  //   (req, res) => {
  //     res.redirect("/");
  //   }
  // );

  // 1. 로그인 API (비회원일 경우 회원가입 후 로그인)
  app.post("/user/login", user.createUser);

  // 2. 나의 당근 조회 API
  app.get("/user/my-carrot", jwtMiddleware, user.getMyCarrot);

  // 3. 회원 프로필 조회 API
  app.get("/user/:selectedId/profile", jwtMiddleware, user.getUserProfile);

  // 4. 회원 프로필 수정 API
  app.patch("/user/profile", jwtMiddleware, user.updateUserProfile);
};
