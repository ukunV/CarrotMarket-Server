const jwtMiddleware = require("../../../config/jwtMiddleware");
const badgeProvider = require("../../app/Badge/badgeProvider");
const badgeService = require("../../app/Badge/badgeService");
const baseResponse = require("../../../config/baseResponseStatus");
const { response, errResponse } = require("../../../config/response");

const regexEmail = require("regex-email");
const { emit } = require("nodemon");

/**
 * API No. 1
 * API Name : 획득 배지 조회
 * [GET] /badge
 */
exports.getBadgeByUserId = async function (req, res) {
  const userId = req.verifiedToken.userId;

  const result = await badgeProvider.getBadgeByUserId(userId);
  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 2
 * API Name : 배지 상세내용 조회
 * [GET] /badge/:badgeId
 */
exports.getBadgeDescriptionByBadgeId = async function (req, res) {
  const badgeId = req.params.badgeId;

  const result = await badgeProvider.getBadgeDescriptionByBadgeId(badgeId);
  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 3
 * API Name : 획득 배지 추가
 * [POST] /badge
 */
exports.createBadgeAcheived = async function (req, res) {
  const { badgeId, userId } = req.body;

  const result = await badgeService.createBadgeAcheived(badgeId, userId);
  return res.send(result);
};

/**
 * API No. 4
 * API Name : 대표 배지 변경
 * [POST] /badge
 */
