module.exports = function (app) {
  const review = require("./reviewController");
  const jwtMiddleware = require("../../../config/jwtMiddleware");

  // 5. 후기 조회 API
  app.get("/review/:selectedId", jwtMiddleware, review.getReview);

  // 6. 후기 등록 API
  app.post("/review", jwtMiddleware, review.createReview);

  // 7. 후기 상태 변경 API
  app.patch("/review", jwtMiddleware, review.updateReviewStatus);
};
