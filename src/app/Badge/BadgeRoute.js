module.exports = function (app) {
  const badge = require("./badgeController");
  const jwtMiddleware = require("../../../config/jwtMiddleware");

  // 20. 획득 배지 조회 API
  app.get("/badge/:selectedId/acheived", jwtMiddleware, badge.getBadge);

  // 21. 배지 상세내용 조회 API
  app.get("/badge/:badgeId/detail", jwtMiddleware, badge.getBadgeDetail);

  // 22. 대표 배지 변경 API
  app.patch("/badge/:badgeId/main", jwtMiddleware, badge.updateMainBadge);
};
