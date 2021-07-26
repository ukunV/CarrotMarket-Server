module.exports = function (app) {
  const review = require("./reviewController");
  const jwtMiddleware = require("../../../config/jwtMiddleware");

  // 5. 후기 조회 API
  app.get("/review/:selectId", jwtMiddleware, review.getReview);

  // 6. 후기 등록 API
  app.post("/review", jwtMiddleware, review.createReview);

  // 6. 후기 등록 API
  app.patch("/review", jwtMiddleware, review.updateReviewStatus);
};
