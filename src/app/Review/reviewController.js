const jwtMiddleware = require("../../../config/jwtMiddleware");
const reviewProvider = require("../../app/Review/reviewProvider");
const reviewService = require("../../app/Review/reviewService");
const baseResponse = require("../../../config/baseResponseStatus");
const { response, errResponse } = require("../../../config/response");

const regexEmail = require("regex-email");
const { emit } = require("nodemon");

// Regex
const regPage = /^[0-9]/g;
const regSize = /^[0-9]/g;
const regNum = /^[0-9]/g;

/**
 * API No. 5
 * API Name : 후기 조회 API
 * [GET] /review/:selectedId
 * Path Variable: selectedId
 * query string: page, size
 */
exports.getReview = async function (req, res) {
  const { userId } = req.verifiedToken;
  const { bodyId } = req.body;

  const { selectedId } = req.params;

  let { page, size } = req.query;

  // Request Error
  if (!userId) return res.send(errResponse(baseResponse.ID_NOT_MATCHING)); // 2005

  if (userId !== bodyId)
    return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH)); // 2006

  if (!regNum.test(selectedId) || selectedId < 1)
    return res.send(errResponse(baseResponse.SELECT_ID_FORM_IS_NOT_CORRECT)); // 2031

  const checkUserExist = reviewProvider.checkUserExist(userId);

  if (checkUserExist === 0)
    return res.send(errResponse(baseResponse.USER_IS_NOT_EXIST)); // 2026

  if (!page) return res.send(response(baseResponse.PAGE_IS_EMPTY)); // 2027

  if (!regPage.test(page) & (page < 1))
    return res.send(response(baseResponse.PAGE_FORM_IS_NOT_CORRECT)); // 2028

  if (!size) return res.send(response(baseResponse.SIZE_IS_EMPTY)); // 2029

  if (!regSize.test(size) & (size < 1))
    return res.send(response(baseResponse.SIZE_FORM_IS_NOT_CORRECT)); // 2030

  page = size * (page - 1);

  const result = await reviewProvider.getReview(selectedId, page, size);

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

  const checkUserExist = reviewProvider.checkUserExist(userId);

  if (checkUserExist === 0)
    return res.send(errResponse(baseResponse.USER_IS_NOT_EXIST)); // 2026

  if (!regNum.test(authorId))
    return res.send(errResponse(baseResponse.AUTHOR_ID_FORM_IS_NOT_CORRECT)); // 2038

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
  const { bodyId } = req.body;

  const { reviewId } = req.body;

  // Request Error
  if (!userId) return res.send(errResponse(baseResponse.ID_NOT_MATCHING)); // 2005

  if (userId !== bodyId)
    return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH)); // 2006

  const checkUserExist = reviewProvider.checkUserExist(userId);

  if (checkUserExist === 0)
    return res.send(errResponse(baseResponse.USER_IS_NOT_EXIST)); // 2026

  if (!regNum.test(reviewId))
    return res.send(errResponse(baseResponse.REVIEW_ID_FORM_IS_NOT_CORRECT)); // 2039

  const result = await reviewService.updateReviewStatus(reviewId);

  return res.send(response(baseResponse.SUCCESS, result));
};
