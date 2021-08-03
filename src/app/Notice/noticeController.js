const jwtMiddleware = require("../../../config/jwtMiddleware");
const noticeProvider = require("../../app/Notice/noticeProvider");
const noticeService = require("../../app/Notice/noticeService");
const baseResponse = require("../../../config/baseResponseStatus");
const { response, errResponse } = require("../../../config/response");

const regexEmail = require("regex-email");
const { emit } = require("nodemon");

/**
 * API No. 30
 * API Name : 알림 목록 조회 API
 * [GET] /notice/list
 */
exports.getNotice = async function (req, res) {
  const { userId } = req.verifiedToken;
  const { bodyId } = req.body;

  // Request Error
  if (!userId) return res.send(errResponse(baseResponse.ID_NOT_MATCHING)); // 2005

  if (userId !== bodyId)
    return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH)); // 2006

  const checkUserExist = noticeProvider.checkUserExist(userId);

  if (checkUserExist === 0)
    return res.send(errResponse(baseResponse.USER_IS_NOT_EXIST)); // 2026

  const result = await noticeProvider.getNotice(userId);

  return res.send(response(baseResponse.SUCCESS, result));
};
