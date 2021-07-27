const jwtMiddleware = require("../../../config/jwtMiddleware");
const merchandiseProvider = require("../../app/Merchandise/merchandiseProvider");
const merchandiseService = require("../../app/Merchandise/merchandiseService");
const baseResponse = require("../../../config/baseResponseStatus");
const { response, errResponse } = require("../../../config/response");

const regexEmail = require("regex-email");
const { emit } = require("nodemon");

/**
 * API No. 8
 * API Name : 동네별 최신순 판매 상품 조회 API
 * [GET] /merchandise/:locationId
 * Path Variable: locationId
 */
exports.getAllMerchandise = async function (req, res) {
  const { userId } = req.verifiedToken;
  const { bodyId } = req.body;
  const { locationId } = req.params;

  // Request Validation
  if (userId !== bodyId) res.send(errResponse(baseResponse.USER_ID_NOT_MATCH)); // 2005

  const result = await merchandiseProvider.getAllMerchandise(locationId);

  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 9
 * API Name : 상품 조회 API
 * [GET] /merchandise
 * query string: merchandiseId
 * 상태가 판매중이 아닌 경우
 */
exports.getMerchandise = async function (req, res) {
  const { userId } = req.verifiedToken;
  const { bodyId } = req.body;
  const { merchandiseId } = req.query;

  // Request Validation
  if (userId !== bodyId) res.send(errResponse(baseResponse.USER_ID_NOT_MATCH)); // 2005

  // Response Validation
  const checkIsDeleted = await merchandiseProvider.checkIsDeleted(
    merchandiseId
  );
  if (checkIsDeleted === 0)
    res.send(errResponse(baseResponse.MERCHANDISE_IS_DELETED)); // 3002

  const checkExist = await merchandiseProvider.checkExist(merchandiseId);
  if (checkExist === 0)
    res.send(errResponse(baseResponse.MERCHANDISE_IS_NOT_EXIST)); // 3003

  const result = await merchandiseProvider.getMerchandise(merchandiseId);

  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No.
 * API Name : 전체 카테고리 조회
 * [GET] /merchandise/category
 */
exports.getMerchandiseCategory = async function (req, res) {
  const result = await merchandiseProvider.getMerchandiseCategory();

  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No.
 * API Name : 카테고리별 최신순 판매상품 조회 (수정필요)
 * [GET] /merchandise/location/:categoryId
 * path variable: categoryId
 * body: location
 */
exports.getCategoryById = async function (req, res) {
  const locationId = req.body.locationId;
  const categoryId = req.params.categoryId;

  const params = [locationId, categoryId];
  const result = await merchandiseProvider.getCategoryById(params);

  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No.
 * API Name : 판매 상품 생성
 * [POST] /merchandise
 */
// exports.createMerchandise = async function (req, res) {
//   const { categoryId, userId, title, contents, price } = req.body;

//   const params1 = [categoryId, userId, title, contents, price];
//   const result = await merchandiseService.createMerchandise(params1);

//   const params2 = []

//   return res.send(result);
// };

/**
 * API No.
 * API Name : 상품 수정
 * [PATCH]
 */

/**
 * API No.
 * API Name : 상품 상태 수정
 * [PATCH] /merchandise
 */
exports.updateMerchandiseStatus = async function (req, res) {
  const { status, id } = req.body;

  const params = [status, id];
  const result = await merchandiseService.updateMerchandiseStatus(params);

  return res.send(response(baseResponse.SUCCESS, result));
};
