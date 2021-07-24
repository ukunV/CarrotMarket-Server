const jwtMiddleware = require("../../../config/jwtMiddleware");
const reviewProvider = require("../../app/Review/reviewProvider");
const reviewService = require("../../app/Review/reviewService");
const baseResponse = require("../../../config/baseResponseStatus");
const { response, errResponse } = require("../../../config/response");

const regexEmail = require("regex-email");
const { emit } = require("nodemon");

/**
 * API No.
 * API Name : 후기 조회
 * [POST] /review
 */
exports.getReviewByUserId = async function (req, res) {
  const userId = req.body.userId;

  const result = await reviewProvider.getReviewByUserId(userId);
  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No.
 * API Name : 후기 등록
 * [POST] /review
 */
exports.getReviewByUserId = async function (req, res) {
  const userId = req.params.userId;
  const authorId = req.verifiedToken.userId;
  const contents = req.body.contents;

  const params = [userId, authorId, contents];
  const result = await reviewService.createReview(params);
  return res.send(response(baseResponse.SUCCESS, result));
};
