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
 * [GET] /merchandise/:locationId/on-sale
 * Path Variable: locationId
 */
exports.getAllMerchandise = async function (req, res) {
  const { userId } = req.verifiedToken;
  const { bodyId } = req.body;
  const { locationId } = req.params;

  // Request Error
  if (!userId) return res.send(errResponse(baseResponse.ID_NOT_MATCHING)); // 2005

  if (userId !== bodyId)
    return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH)); // 2006

  const checkLocationExist = await merchandiseProvider.checkLocationExist(
    locationId
  );

  if (checkLocationExist === 0)
    return res.send(errResponse(baseResponse.LOCATION_IS_NOT_EXIST)); // 2009

  const result = await merchandiseProvider.getAllMerchandise(locationId);

  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 9
 * API Name : 상품 조회 API
 * [GET] /merchandise/:merchandiseId/detail
 * Path Variable: merchandiseId
 */
exports.getMerchandise = async function (req, res) {
  const { userId } = req.verifiedToken;
  const { bodyId } = req.body;
  const { merchandiseId } = req.query;

  // Request Error
  if (!userId) return res.send(errResponse(baseResponse.ID_NOT_MATCHING)); // 2005

  if (userId !== bodyId)
    return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH)); // 2006

  const checkMerchandiseExist = await merchandiseProvider.checkMerchandiseExist(
    merchandiseId
  );

  if (checkMerchandiseExist === 0)
    return res.send(errResponse(baseResponse.MERCHANDISE_IS_NOT_EXIST)); // 2010

  const checkMerchandiseIsDeleted =
    await merchandiseProvider.checkMerchandiseIsDeleted(merchandiseId);

  if (checkMerchandiseIsDeleted === 0)
    return res.send(errResponse(baseResponse.MERCHANDISE_IS_DELETED)); // 2011

  const result = await merchandiseProvider.getMerchandise(merchandiseId);

  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 10
 * API Name : 전체 카테고리 조회 API
 * [GET] /merchandise/all-category
 */
exports.getCategory = async function (req, res) {
  const { userId } = req.verifiedToken;
  const { bodyId } = req.body;

  // Request Error
  if (!userId) return res.send(errResponse(baseResponse.ID_NOT_MATCHING)); // 2005

  if (userId !== bodyId)
    return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH)); // 2006

  const result = await merchandiseProvider.getCategory();

  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 11
 * API Name : 카테고리별 최신순 판매상품 조회 API
 * [GET] /merchandise/:locationId/category
 * path variable: locationId
 * query string: categoryId
 */
exports.getCategoryMerchandise = async function (req, res) {
  const { userId } = req.verifiedToken;
  const { bodyId } = req.body;
  const { locationId } = req.params;
  const { categoryId } = req.query;

  // Request Error
  if (!userId) return res.send(errResponse(baseResponse.ID_NOT_MATCHING)); // 2005

  if (userId !== bodyId)
    return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH)); // 2006

  const checkLocationExist = await merchandiseProvider.checkLocationExist(
    locationId
  );

  if (checkLocationExist === 0)
    return res.send(errResponse(baseResponse.LOCATION_IS_NOT_EXIST)); // 2009

  const checkCategoryExist = await merchandiseProvider.checkCategoryExist(
    categoryId
  );

  if (checkCategoryExist === 0)
    return res.send(errResponse(baseResponse.CATEGORY_IS_NOT_EXIST)); // 2012

  const result = await merchandiseProvider.getCategoryMerchandise(
    locationId,
    categoryId
  );

  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 12
 * API Name : 판매상품 생성 API
 * [POST] /merchandise
 */
exports.createMerchandise = async function (req, res) {
  const { userId } = req.verifiedToken;
  const { bodyId } = req.body;

  const { image_arr, categoryId, title, contents, price } = req.body;

  // Request Error
  if (!userId) return res.send(errResponse(baseResponse.ID_NOT_MATCHING)); // 2005

  if (userId !== bodyId)
    return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH)); // 2006

  const checkCategoryExist = await merchandiseProvider.checkCategoryExist(
    categoryId
  );

  if (checkCategoryExist === 0)
    return res.send(errResponse(baseResponse.CATEGORY_IS_NOT_EXIST)); // 2012

  const result = await merchandiseService.createMerchandise(
    categoryId,
    userId,
    title,
    contents,
    price,
    image_arr
  );

  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 13
 * API Name : 판매상품 삭제 API
 * [PATCH] /merchandise/:merchandiseId/status
 */
exports.deleteMerchandise = async function (req, res) {
  const { userId } = req.verifiedToken;
  const { bodyId } = req.body;

  const { merchandiseId } = req.params;

  // Request Error
  if (!userId) return res.send(errResponse(baseResponse.ID_NOT_MATCHING)); // 2005

  if (userId !== bodyId)
    return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH)); // 2006

  const checkMerchandiseExist = await merchandiseProvider.checkMerchandiseExist(
    merchandiseId
  );

  if (checkMerchandiseExist === 0)
    return res.send(errResponse(baseResponse.MERCHANDISE_IS_NOT_EXIST)); // 2010

  const checkMerchandiseIsDeleted =
    await merchandiseProvider.checkMerchandiseIsDeleted(merchandiseId);

  if (checkMerchandiseIsDeleted === 0)
    return res.send(errResponse(baseResponse.MERCHANDISE_IS_DELETED)); // 2011

  const result = await merchandiseService.deleteMerchandise(merchandiseId);

  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 14
 * API Name : 판매상품 끌어올기기 API
 * [PATCH] /merchandise/:merchandiseId/pull-up
 */
exports.pullUpMerchandise = async function (req, res) {
  const { userId } = req.verifiedToken;
  const { bodyId } = req.body;

  const { merchandiseId } = req.params;

  const { price } = req.body;

  // Request Error
  if (!userId) return res.send(errResponse(baseResponse.ID_NOT_MATCHING)); // 2005

  if (userId !== bodyId)
    return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH)); // 2006

  const checkMerchandiseExist = await merchandiseProvider.checkMerchandiseExist(
    merchandiseId
  );

  if (checkMerchandiseExist === 0)
    return res.send(errResponse(baseResponse.MERCHANDISE_IS_NOT_EXIST)); // 2010

  const checkMerchandiseIsDeleted =
    await merchandiseProvider.checkMerchandiseIsDeleted(merchandiseId);

  if (checkMerchandiseIsDeleted === 0)
    return res.send(errResponse(baseResponse.MERCHANDISE_IS_DELETED)); // 2011

  const checkPullUpPossible = await merchandiseProvider.checkPullUpPossible(
    merchandiseId
  );

  if (checkPullUpPossible[0] === "c") {
    if (checkPullUpPossible[1] < 3)
      return res.send(errResponse(baseResponse.CREATE_AFTER_3_DAYS)); // 2013
  } else {
    if (checkPullUpPossible[1] < 3)
      return res.send(errResponse(baseResponse.PULL_UP_IMPOSSIBLE)); // 2014
  }

  const result = await merchandiseService.pullUpMerchandise(
    price,
    merchandiseId
  );

  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 13
 * API Name : 상품 수정
 * [PATCH] /merchandise/:merchandiseId/detail
 */
// exports.updateMerchandise = async function (req, res) {
//   const { userId } = req.verifiedToken;
//   const { bodyId } = req.body;
//   const { merchandiseId } = req.params;

//   const { image_arr, categoryId, title, contents, price } = req.body;

//   // Request Error
//   if (!userId) return res.send(errResponse(baseResponse.ID_NOT_MATCHING)); // 2005

//   if (userId !== bodyId)
//     return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH)); // 2006

//   const checkCategoryExist = await merchandiseProvider.checkCategoryExist(
//     categoryId
//   );

//   if (checkCategoryExist === 0)
//     return res.send(errResponse(baseResponse.CATEGORY_IS_NOT_EXIST)); // 2012

//   const result = await merchandiseService.updateMerchandise(
//     categoryId,
//     userId,
//     title,
//     contents,
//     price,
//     image_arr
//   );

//   return res.send(response(baseResponse.SUCCESS, result));
// };

/**
 * API No. 14
 * API Name : 상품 사진 삭제 API
 * [PATCH] /merchandise/:merchandiseId/image
 */
// exports.updateMerchandise = async function (req, res) {
//   const { userId } = req.verifiedToken;
//   const { bodyId } = req.body;
//   const { merchandiseId } = req.params;
//   const { imageId } = req.body;

//   // Request Error
//   if (!userId) return res.send(errResponse(baseResponse.ID_NOT_MATCHING)); // 2005

//   if (userId !== bodyId)
//     return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH)); // 2006

//   const checkMerchandiseExist = await merchandiseProvider.checkMerchandiseExist(
//     merchandiseId
//   );

//   if (checkMerchandiseExist === 0)
//     return res.send(errResponse(baseResponse.MERCHANDISE_IS_NOT_EXIST)); // 2010

//   const checkMerchandiseIsDeleted =
//     await merchandiseProvider.checkMerchandiseIsDeleted(merchandiseId);

//   if (checkMerchandiseIsDeleted === 0)
//     return res.send(errResponse(baseResponse.MERCHANDISE_IS_DELETED)); // 2011

//   // 이미지 id로 존재하는 이미지 인지 validation

//   const result = await merchandiseService.updateMerchandise(imageId);

//   return res.send(response(baseResponse.SUCCESS, result));
// };

/**
 * API No.
 * API Name : 상품 상태 수정
 * [PATCH] /merchandise/:merchandiseId/status
 */
// exports.updateMerchandiseStatus = async function (req, res) {
//   const { status, id } = req.body;

//   const params = [status, id];
//   const result = await merchandiseService.updateMerchandiseStatus(params);

//   return res.send(response(baseResponse.SUCCESS, result));
// };
