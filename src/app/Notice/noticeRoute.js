module.exports = function (app) {
  const notice = require("./noticeController");
  const jwtMiddleware = require("../../../config/jwtMiddleware");

  // 30. 알림 목록 조회 API
  app.get("/notice/list", jwtMiddleware, notice.getNotice);
};
