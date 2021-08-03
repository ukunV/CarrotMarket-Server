const jwtMiddleware = require("../../../config/jwtMiddleware");
const noticeProvider = require("../../app/Notice/noticeProvider");
const noticeService = require("../../app/Notice/noticeService");
const baseResponse = require("../../../config/baseResponseStatus");
const { response, errResponse } = require("../../../config/response");

const regexEmail = require("regex-email");
const { emit } = require("nodemon");

// Regex
const regPage = /^[0-9]/g;
const regSize = /^[0-9]/g;

/**
 * API No. 30
 * API Name : 알림 목록 조회 API
 * [GET] /notice/list
 * query string: page, size
 */
exports.getNotice = async function (req, res) {
  const { userId } = req.verifiedToken;
  const { bodyId } = req.body;

  let { page, size } = req.query;

  // Request Error
  if (!userId) return res.send(errResponse(baseResponse.ID_NOT_MATCHING)); // 2005

  if (userId !== bodyId)
    return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH)); // 2006

  const checkUserExist = noticeProvider.checkUserExist(userId);

  if (checkUserExist === 0)
    return res.send(errResponse(baseResponse.USER_IS_NOT_EXIST)); // 2026

  if (!page) return res.send(response(baseResponse.PAGE_IS_EMPTY)); // 2027

  if (!regPage.test(page) & (page < 1))
    return res.send(response(baseResponse.PAGE_FORM_IS_NOT_CORRECT)); // 2028

  if (!size) return res.send(response(baseResponse.SIZE_IS_EMPTY)); // 2029

  if (!regSize.test(size) & (size < 1))
    return res.send(response(baseResponse.SIZE_FORM_IS_NOT_CORRECT)); // 2030

  page = size * (page - 1);

  const result = await noticeProvider.getNotice(userId, page, size);

  return res.send(response(baseResponse.SUCCESS, result));
};
