const jwtMiddleware = require("../../../config/jwtMiddleware");
const mannerProvider = require("../../app/Manner/mannerProvider");
const mannerService = require("../../app/Manner/mannerService");
const baseResponse = require("../../../config/baseResponseStatus");
const { response, errResponse } = require("../../../config/response");

const regexEmail = require("regex-email");
const { emit } = require("nodemon");

/**
 * API No. 18
 * API Name : 매너 조회 API
 * [GET] /manner/:selectedId
 * Path Variable: selectedId
 */
exports.getManner = async function (req, res) {
  const { userId } = req.verifiedToken;
  const { bodyId } = req.body;

  const { selectedId } = req.params;

  // Request Error
  if (!userId) return res.send(errResponse(baseResponse.ID_NOT_MATCHING)); // 2005

  if (userId !== bodyId)
    return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH)); // 2006

  const checkUserExist = await mannerProvider.checkUserExist(selectedId);

  if (checkUserExist === 0)
    return res.send(errResponse(baseResponse.USER_IS_NOT_EXIST)); // 2007

  const result = await mannerProvider.getManner(selectedId);

  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 19
 * API Name : 매너 추가 API
 * [POST] /manner/:selectedId
 * Path Variable: selectedId
 */
exports.createManner = async function (req, res) {
  const { userId } = req.verifiedToken;
  const { bodyId } = req.body;

  const { selectedId } = req.params;
  const { mannerId_arr } = req.body;

  // Request Error
  if (!userId) return res.send(errResponse(baseResponse.ID_NOT_MATCHING)); // 2005

  if (userId !== bodyId)
    return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH)); // 2006

  const checkUserExist = await mannerProvider.checkUserExist(selectedId);

  if (checkUserExist === 0)
    return res.send(errResponse(baseResponse.USER_IS_NOT_EXIST)); // 2007

  const checkMannerExist = await mannerProvider.checkMannerExist(mannerId_arr);

  if (checkMannerExist === 0)
    return res.send(errResponse(baseResponse.MANNER_IS_NOT_EXIST)); // 2016

  const result = await mannerService.createManner(selectedId, mannerId_arr);

  return res.send(response(baseResponse.SUCCESS, result));
};
