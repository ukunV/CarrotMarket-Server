const jwtMiddleware = require("../../../config/jwtMiddleware");
const mannerProvider = require("../../app/Manner/mannerProvider");
const mannerService = require("../../app/Manner/mannerService");
const baseResponse = require("../../../config/baseResponseStatus");
const { response, errResponse } = require("../../../config/response");

const regexEmail = require("regex-email");
const { emit } = require("nodemon");

/**
 * API No. 1
 * API Name : 획득 매너 조회
 * [GET] /manner
 */
exports.getMannerByUserId = async function (req, res) {
  const userId = req.verifiedToken.userId;

  const result = await mannerProvider.getMannerByUserId(userId);
  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 2
 * API Name : 획득 매너 추가
 * [POST] /manner
 */
exports.createMannerAcheived = async function (req, res) {
  const { userId, mannerId } = req.body;

  const result = await mannerService.createMannerAcheived(userId, mannerId);
  return res.send(result);
};
