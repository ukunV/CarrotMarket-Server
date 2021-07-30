const jwtMiddleware = require("../../../config/jwtMiddleware");
const badgeProvider = require("../../app/Badge/badgeProvider");
const badgeService = require("../../app/Badge/badgeService");
const baseResponse = require("../../../config/baseResponseStatus");
const { response, errResponse } = require("../../../config/response");

const regexEmail = require("regex-email");
const { emit } = require("nodemon");

/**
 * API No. 20
 * API Name : 획득 배지 조회 API
 * [GET] /badge/:selectedId/acheived
 */
exports.getBadge = async function (req, res) {
  const { userId } = req.verifiedToken;
  const { bodyId } = req.body;

  const { selectedId } = req.params;

  // Request Error
  if (!userId) return res.send(errResponse(baseResponse.ID_NOT_MATCHING)); // 2005

  if (userId !== bodyId)
    return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH)); // 2006

  const checkUserExist = await badgeProvider.checkUserExist(selectedId);

  if (checkUserExist === 0)
    return res.send(errResponse(baseResponse.USER_IS_NOT_EXIST)); // 2007

  const result = await badgeProvider.getBadge(selectedId);

  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 21
 * API Name : 배지 상세내용 조회 API
 * [GET] /badge/:badgeId/detail
 */
exports.getBadgeDetail = async function (req, res) {
  const { userId } = req.verifiedToken;
  const { bodyId } = req.body;

  const { badgeId } = req.params;

  // Request Error
  if (!userId) return res.send(errResponse(baseResponse.ID_NOT_MATCHING)); // 2005

  if (userId !== bodyId)
    return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH)); // 2006

  const checkBadgeExist = await badgeProvider.checkBadgeExist(badgeId);

  if (checkBadgeExist === 0)
    return res.send(errResponse(baseResponse.BADGE_IS_NOT_EXIST)); // 2017

  const result = await badgeProvider.getBadgeDetail(badgeId);

  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 22
 * API Name : 대표 배지 변경 API
 * [PATCH] /badge/:badgeId/main
 */
exports.updateMainBadge = async function (req, res) {
  const { userId } = req.verifiedToken;
  const { bodyId } = req.body;

  const { badgeId } = req.params;

  // Request Error
  if (!userId) return res.send(errResponse(baseResponse.ID_NOT_MATCHING)); // 2005

  if (userId !== bodyId)
    return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH)); // 2006

  const checkBadgeExist = await badgeProvider.checkBadgeExist(badgeId);

  if (checkBadgeExist === 0)
    return res.send(errResponse(baseResponse.BADGE_IS_NOT_EXIST)); // 2017

  const checkIsGold = await badgeProvider.checkIsGold(badgeId);

  if (checkIsGold === 0)
    return res.send(errResponse(baseResponse.BADGE_IS_NOT_GOLD)); // 2018

  const checkIsAcheived = await badgeProvider.checkIsAcheived(userId, badgeId);

  if (checkIsAcheived === 0)
    return res.send(errResponse(baseResponse.BADGE_IS_NOT_ACHEIVED)); // 2019

  const checkAlreadyMain = await badgeProvider.checkAlreadyMain(
    userId,
    badgeId
  );

  if (checkAlreadyMain === 1)
    return res.send(errResponse(baseResponse.BADGE_IS_ALREADY_MAIN)); // 2020

  const result = await badgeService.updateMainBadge(userId, badgeId);

  return res.send(response(baseResponse.SUCCESS, result));
};
