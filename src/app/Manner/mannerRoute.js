module.exports = function (app) {
  const manner = require("./mannerController");
  const jwtMiddleware = require("../../../config/jwtMiddleware");

  // 18. 매너 조회 API
  app.get("/manner/:selectedId", jwtMiddleware, manner.getManner);

  // 18. 매너 추가 API
  app.post("/manner/:selectedId", jwtMiddleware, manner.createManner);
};
