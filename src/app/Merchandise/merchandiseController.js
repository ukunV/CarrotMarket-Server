const jwtMiddleware = require("../../../config/jwtMiddleware");
const merchandiseProvider = require("../../app/Merchandise/merchandiseProvider");
const merchandiseService = require("../../app/Merchandise/merchandiseService");
const baseResponse = require("../../../config/baseResponseStatus");
const { response, errResponse } = require("../../../config/response");

const regexEmail = require("regex-email");
const { emit } = require("nodemon");

/**
 * API No. 1
 * API Name : 동네별 최신순 판매 상품 조회
 * [GET] /merchandise/:location
 */
exports.getAllMerchandiseById = async function (req, res) {
  const locationId = req.params.locationId;

  const result = await merchandiseProvider.getAllMerchandiseById(locationId);
  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 2
 * API Name : 상품 조회
 * [GET] /merchandise/:merchandiseId
 */
exports.getMerchandiseById = async function (req, res) {
  const merchandiseId = req.params.merchandiseId;

  const result = await merchandiseProvider.getMerchandiseById(merchandiseId);
  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 3
 * API Name : 전체 카테고리 조회
 * [GET] /merchandise/category
 */
exports.getMerchandiseCategory = async function (req, res) {
  const result = await merchandiseProvider.getMerchandiseCategory();

  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 4
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
