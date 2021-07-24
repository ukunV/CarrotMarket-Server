module.exports = function (app) {
  const badge = require("./badgeController");
  const jwtMiddleware = require("../../../config/jwtMiddleware");

  app.get("/badge", badge.getBadgeByUserId);
  app.get("/badge/:badgeId", badge.getBadgeDescriptionByBadgeId);
  app.post("/badge", badge.createBadgeAcheived);
};
