const jwtMiddleware = require("../../../config/jwtMiddleware");
const reviewProvider = require("../../app/Review/reviewProvider");
const reviewService = require("../../app/Review/reviewService");
const baseResponse = require("../../../config/baseResponseStatus");
const { response, errResponse } = require("../../../config/response");

const regexEmail = require("regex-email");
const { emit } = require("nodemon");

/**
 * API No. 5
 * API Name : 후기 조회 API
 * [GET] /review/:selectId
 */
exports.getReview = async function (req, res) {
  const { userId } = req.verifiedToken;
  const { bodyId } = req.body;
  const { selectId } = req.params;

  // Request Error
  if (!userId) return res.send(errResponse(baseResponse.ID_NOT_MATCHING)); // 2005

  if (userId !== bodyId)
    return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH)); // 2006

  const result = await reviewProvider.getReview(selectId);

  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 6
 * API Name : 후기 등록 API
 * [POST] /review
 */
exports.createReview = async function (req, res) {
  const { userId } = req.verifiedToken;
  const { bodyId } = req.body;
  const { authorId, contents } = req.body;

  // Request Error
  if (!userId) return res.send(errResponse(baseResponse.ID_NOT_MATCHING)); // 2005

  if (userId !== bodyId)
    return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH)); // 2006

  const result = await reviewService.createReview(userId, authorId, contents);

  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 7
 * API Name : 후기 상태 변경 API
 * [PATCH] /review
 */
exports.updateReviewStatus = async function (req, res) {
  const { userId } = req.verifiedToken;
  const { bodyId, reviewId } = req.body;

  // Request Error
  if (!userId) return res.send(errResponse(baseResponse.ID_NOT_MATCHING)); // 2005

  if (userId !== bodyId)
    return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH)); // 2006

  const result = await reviewService.updateReviewStatus(reviewId);

  return res.send(response(baseResponse.SUCCESS, result));
};
