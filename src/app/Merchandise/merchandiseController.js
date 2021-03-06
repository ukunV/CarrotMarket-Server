const jwtMiddleware = require("../../../config/jwtMiddleware");
const merchandiseProvider = require("../../app/Merchandise/merchandiseProvider");
const merchandiseService = require("../../app/Merchandise/merchandiseService");
const baseResponse = require("../../../config/baseResponseStatus");
const { response, errResponse } = require("../../../config/response");

const regexEmail = require("regex-email");
const { emit } = require("nodemon");

// Regex
const regPage = /^[0-9]/g;
const regSize = /^[0-9]/g;
const regNum = /^[0-9]/g;

/**
 * API No. 8
 * API Name : 동네별 최신순 판매 상품(거래중) 조회 API
 * [GET] /merchandise/:locationId/on-sale
 * Path Variable: locationId
 * query string: page, size
 */
exports.getAllMerchandise = async function (req, res) {
  const { userId } = req.verifiedToken;
  const { bodyId } = req.body;

  const { locationId } = req.params;

  let { page, size } = req.query;

  // Request Error
  if (!userId) return res.send(errResponse(baseResponse.ID_NOT_MATCHING)); // 2005

  if (userId !== bodyId)
    return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH)); // 2006

  const checkUserExist = merchandiseProvider.checkUserExist(userId);

  if (checkUserExist === 0)
    return res.send(errResponse(baseResponse.USER_IS_NOT_EXIST)); // 2026

  if (!regNum.test(locationId) || locationId < 1)
    return res.send(errResponse(baseResponse.LOCATION_ID_FORM_IS_NOT_CORRECT)); // 2033

  const checkLocationExist = await merchandiseProvider.checkLocationExist(
    locationId
  );

  if (checkLocationExist === 0)
    return res.send(errResponse(baseResponse.LOCATION_IS_NOT_EXIST)); // 2009

  if (!page) return res.send(response(baseResponse.PAGE_IS_EMPTY)); // 2027

  if (!regPage.test(page) & (page < 1))
    return res.send(response(baseResponse.PAGE_FORM_IS_NOT_CORRECT)); // 2028

  if (!size) return res.send(response(baseResponse.SIZE_IS_EMPTY)); // 2029

  if (!regSize.test(size) & (size < 1))
    return res.send(response(baseResponse.SIZE_FORM_IS_NOT_CORRECT)); // 2030

  page = size * (page - 1);

  const result = await merchandiseProvider.getAllMerchandise(
    locationId,
    page,
    size
  );

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

  const { merchandiseId } = req.params;

  // Request Error
  if (!userId) return res.send(errResponse(baseResponse.ID_NOT_MATCHING)); // 2005

  if (userId !== bodyId)
    return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH)); // 2006

  const checkUserExist = merchandiseProvider.checkUserExist(userId);

  if (checkUserExist === 0)
    return res.send(errResponse(baseResponse.USER_IS_NOT_EXIST)); // 2026

  if (!regNum.test(merchandiseId) || merchandiseId < 1)
    return res.send(
      errResponse(baseResponse.MERCHANDISE_ID_FORM_IS_NOT_CORRECT)
    ); // 2032

  const checkMerchandiseExist = await merchandiseProvider.checkMerchandiseExist(
    merchandiseId
  );

  if (checkMerchandiseExist === 0)
    return res.send(errResponse(baseResponse.MERCHANDISE_IS_NOT_EXIST)); // 2010

  const checkMerchandiseIsDeleted =
    await merchandiseProvider.checkMerchandiseIsDeleted(merchandiseId);

  if (checkMerchandiseIsDeleted === 0)
    return res.send(errResponse(baseResponse.MERCHANDISE_IS_DELETED)); // 2011

  const checkHost = await merchandiseProvider.checkHost(userId, merchandiseId);
  const checkIsHided = await merchandiseProvider.checkIsHided(merchandiseId);

  if (checkHost === "false" && checkIsHided === 0)
    return res.send(errResponse(baseResponse.USERID_IS_NOT_HOST)); // 2015

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

  const checkUserExist = merchandiseProvider.checkUserExist(userId);

  if (checkUserExist === 0)
    return res.send(errResponse(baseResponse.USER_IS_NOT_EXIST)); // 2026

  const result = await merchandiseProvider.getCategory();

  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 11
 * API Name : 카테고리별 최신순 판매상품(거래중) 조회 API
 * [GET] /merchandise/:locationId/category
 * path variable: locationId
 * query string: categoryId, page, size
 */
exports.getCategoryMerchandise = async function (req, res) {
  const { userId } = req.verifiedToken;
  const { bodyId } = req.body;

  const { locationId } = req.params;
  const { categoryId } = req.query;

  const { page, size } = req.query;

  // Request Error
  if (!userId) return res.send(errResponse(baseResponse.ID_NOT_MATCHING)); // 2005

  if (userId !== bodyId)
    return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH)); // 2006

  const checkUserExist = merchandiseProvider.checkUserExist(userId);

  if (checkUserExist === 0)
    return res.send(errResponse(baseResponse.USER_IS_NOT_EXIST)); // 2026

  if (!regNum.test(locationId) || locationId < 1)
    return res.send(errResponse(baseResponse.LOCATION_ID_FORM_IS_NOT_CORRECT)); // 2033

  const checkLocationExist = await merchandiseProvider.checkLocationExist(
    locationId
  );

  if (checkLocationExist === 0)
    return res.send(errResponse(baseResponse.LOCATION_IS_NOT_EXIST)); // 2009

  if (!regNum.test(categoryId) || categoryId < 1)
    return res.send(errResponse(baseResponse.CATEGORY_ID_FORM_IS_NOT_CORRECT)); // 2034

  const checkCategoryExist = await merchandiseProvider.checkCategoryExist(
    categoryId
  );

  if (checkCategoryExist === 0)
    return res.send(errResponse(baseResponse.CATEGORY_IS_NOT_EXIST)); // 2012

  if (!page) return res.send(response(baseResponse.PAGE_IS_EMPTY)); // 2027

  if (!regPage.test(page) & (page < 1))
    return res.send(response(baseResponse.PAGE_FORM_IS_NOT_CORRECT)); // 2028

  if (!size) return res.send(response(baseResponse.SIZE_IS_EMPTY)); // 2029

  if (!regSize.test(size) & (size < 1))
    return res.send(response(baseResponse.SIZE_FORM_IS_NOT_CORRECT)); // 2030

  page = size * (page - 1);

  const result = await merchandiseProvider.getCategoryMerchandise(
    locationId,
    categoryId,
    page,
    size
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

  const checkUserExist = merchandiseProvider.checkUserExist(userId);

  if (checkUserExist === 0)
    return res.send(errResponse(baseResponse.USER_IS_NOT_EXIST)); // 2026

  if (!regNum.test(categoryId) || categoryId < 1)
    return res.send(errResponse(baseResponse.CATEGORY_ID_FORM_IS_NOT_CORRECT)); // 2034

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
 * [PATCH] /merchandise/:merchandiseId
 * Path Variable: merchandiseId
 */
exports.deleteMerchandise = async function (req, res) {
  const { userId } = req.verifiedToken;
  const { bodyId } = req.body;

  const { merchandiseId } = req.params;

  // Request Error
  if (!userId) return res.send(errResponse(baseResponse.ID_NOT_MATCHING)); // 2005

  if (userId !== bodyId)
    return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH)); // 2006

  const checkUserExist = merchandiseProvider.checkUserExist(userId);

  if (checkUserExist === 0)
    return res.send(errResponse(baseResponse.USER_IS_NOT_EXIST)); // 2026

  if (!regNum.test(merchandiseId) || merchandiseId < 1)
    return res.send(
      errResponse(baseResponse.MERCHANDISE_ID_FORM_IS_NOT_CORRECT)
    ); // 2032

  const checkMerchandiseExist = await merchandiseProvider.checkMerchandiseExist(
    merchandiseId
  );

  if (checkMerchandiseExist === 0)
    return res.send(errResponse(baseResponse.MERCHANDISE_IS_NOT_EXIST)); // 2010

  const checkMerchandiseIsDeleted =
    await merchandiseProvider.checkMerchandiseIsDeleted(merchandiseId);

  if (checkMerchandiseIsDeleted === 0)
    return res.send(errResponse(baseResponse.MERCHANDISE_IS_DELETED)); // 2011

  const checkHost = await merchandiseProvider.checkHost(userId, merchandiseId);

  if (checkHost === "false")
    return res.send(errResponse(baseResponse.USERID_IS_NOT_HOST)); // 2015

  const result = await merchandiseService.deleteMerchandise(merchandiseId);

  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 14
 * API Name : 판매상품 끌어올기기 API
 * [PATCH] /merchandise/:merchandiseId/pull-up
 * Path Variable: merchandiseId
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

  const checkUserExist = merchandiseProvider.checkUserExist(userId);

  if (checkUserExist === 0)
    return res.send(errResponse(baseResponse.USER_IS_NOT_EXIST)); // 2026

  if (!regNum.test(merchandiseId) || merchandiseId < 1)
    return res.send(
      errResponse(baseResponse.MERCHANDISE_ID_FORM_IS_NOT_CORRECT)
    ); // 2032

  const checkMerchandiseExist = await merchandiseProvider.checkMerchandiseExist(
    merchandiseId
  );

  if (checkMerchandiseExist === 0)
    return res.send(errResponse(baseResponse.MERCHANDISE_IS_NOT_EXIST)); // 2010

  const checkMerchandiseIsDeleted =
    await merchandiseProvider.checkMerchandiseIsDeleted(merchandiseId);

  if (checkMerchandiseIsDeleted === 0)
    return res.send(errResponse(baseResponse.MERCHANDISE_IS_DELETED)); // 2011

  const checkHost = await merchandiseProvider.checkHost(userId, merchandiseId);

  if (checkHost === "false")
    return res.send(errResponse(baseResponse.USERID_IS_NOT_HOST)); // 2015

  const checkIsHided = await merchandiseProvider.checkIsHided(merchandiseId);

  if (checkIsHided === 0)
    return res.send(errResponse(baseResponse.MERCHANDISE_HIDE_ON)); // 2024

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
 * API No. 15
 * API Name : 판매상품 상태 변경 API
 * [PATCH] /merchandise/:merchandiseId/status
 * Path Variable: merchandiseId
 */
exports.updateMerchandiseStatus = async function (req, res) {
  const { userId } = req.verifiedToken;
  const { bodyId } = req.body;

  const { merchandiseId } = req.params;

  const { status } = req.body;

  // Request Error
  if (!userId) return res.send(errResponse(baseResponse.ID_NOT_MATCHING)); // 2005

  if (userId !== bodyId)
    return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH)); // 2006

  const checkUserExist = merchandiseProvider.checkUserExist(userId);

  if (checkUserExist === 0)
    return res.send(errResponse(baseResponse.USER_IS_NOT_EXIST)); // 2026

  if (!regNum.test(merchandiseId) || merchandiseId < 1)
    return res.send(
      errResponse(baseResponse.MERCHANDISE_ID_FORM_IS_NOT_CORRECT)
    ); // 2032

  const checkMerchandiseExist = await merchandiseProvider.checkMerchandiseExist(
    merchandiseId
  );

  if (checkMerchandiseExist === 0)
    return res.send(errResponse(baseResponse.MERCHANDISE_IS_NOT_EXIST)); // 2010

  const checkMerchandiseIsDeleted =
    await merchandiseProvider.checkMerchandiseIsDeleted(merchandiseId);

  if (checkMerchandiseIsDeleted === 0)
    return res.send(errResponse(baseResponse.MERCHANDISE_IS_DELETED)); // 2011

  const checkHost = await merchandiseProvider.checkHost(userId, merchandiseId);

  if (checkHost === "false")
    return res.send(errResponse(baseResponse.USERID_IS_NOT_HOST)); // 2015

  const checkIsHided = await merchandiseProvider.checkIsHided(merchandiseId);

  if (checkIsHided === 0)
    return res.send(errResponse(baseResponse.MERCHANDISE_HIDE_ON)); // 2024

  if (!(status in [1, 2, 3]))
    return res.send(errResponse(baseResponse.STATUS_IS_NOT_VALID)); // 2021

  const result = await merchandiseService.updateMerchandiseStatus(
    status,
    merchandiseId
  );

  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 16
 * API Name : 내 판매상품 조회 API
 * (status - 판매중/예약중 : 1, 거래완료 : 0)
 * [GET] /merchandise/my-merchandise
 * query string: status
 */
exports.getMyMerchandise = async function (req, res) {
  const { userId } = req.verifiedToken;
  const { bodyId } = req.body;

  const { status } = req.query;

  // Request Error
  if (!userId) return res.send(errResponse(baseResponse.ID_NOT_MATCHING)); // 2005

  if (userId !== bodyId)
    return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH)); // 2006

  const checkUserExist = merchandiseProvider.checkUserExist(userId);

  if (checkUserExist === 0)
    return res.send(errResponse(baseResponse.USER_IS_NOT_EXIST)); // 2026

  if (!(status in [0, 1]))
    return res.send(errResponse(baseResponse.STATUS_IS_NOT_VALID)); // 2021

  let condition = "";

  switch (status) {
    case "0":
      condition += "and m.status = 0";
      break;
    case "1":
      condition += "and m.status in (1, 2)";
      break;
  }

  const result = await merchandiseProvider.getMyMerchandise(userId, condition);

  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 17
 * API Name : 판매상품 수정 API
 * [PATCH] /merchandise/:merchandiseId/detail
 * Path Variable: merchandiseId
 */
exports.updateMerchandise = async function (req, res) {
  const { userId } = req.verifiedToken;
  const { bodyId } = req.body;

  const { merchandiseId } = req.params;

  const { image_arr, categoryId, title, contents, price } = req.body;

  // Request Error
  if (!userId) return res.send(errResponse(baseResponse.ID_NOT_MATCHING)); // 2005

  if (userId !== bodyId)
    return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH)); // 2006

  const checkUserExist = merchandiseProvider.checkUserExist(userId);

  if (checkUserExist === 0)
    return res.send(errResponse(baseResponse.USER_IS_NOT_EXIST)); // 2026

  if (!regNum.test(merchandiseId) || merchandiseId < 1)
    return res.send(
      errResponse(baseResponse.MERCHANDISE_ID_FORM_IS_NOT_CORRECT)
    ); // 2032

  const checkMerchandiseExist = await merchandiseProvider.checkMerchandiseExist(
    merchandiseId
  );

  if (checkMerchandiseExist === 0)
    return res.send(errResponse(baseResponse.MERCHANDISE_IS_NOT_EXIST)); // 2010

  const checkHost = await merchandiseProvider.checkHost(userId, merchandiseId);

  if (checkHost === "false")
    return res.send(errResponse(baseResponse.USERID_IS_NOT_HOST)); // 2015

  if (!regNum.test(categoryId) || categoryId < 1)
    return res.send(errResponse(baseResponse.CATEGORY_ID_FORM_IS_NOT_CORRECT)); // 2034

  const checkCategoryExist = await merchandiseProvider.checkCategoryExist(
    categoryId
  );

  if (checkCategoryExist === 0)
    return res.send(errResponse(baseResponse.CATEGORY_IS_NOT_EXIST)); // 2012

  const result = await merchandiseService.updateMerchandise(
    merchandiseId,
    categoryId,
    title,
    contents,
    price,
    image_arr
  );

  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 26
 * API Name : 판매상품 숨기기 API
 * [PATCH] /merchandise/:merchandiseId/hide-on
 * Path Variable: merchandiseId
 */
exports.updateMerchandiseHideOn = async function (req, res) {
  const { userId } = req.verifiedToken;
  const { bodyId } = req.body;

  const { merchandiseId } = req.params;

  // Request Error
  if (!userId) return res.send(errResponse(baseResponse.ID_NOT_MATCHING)); // 2005

  if (userId !== bodyId)
    return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH)); // 2006

  const checkUserExist = merchandiseProvider.checkUserExist(userId);

  if (checkUserExist === 0)
    return res.send(errResponse(baseResponse.USER_IS_NOT_EXIST)); // 2026

  if (!regNum.test(merchandiseId) || merchandiseId < 1)
    return res.send(
      errResponse(baseResponse.MERCHANDISE_ID_FORM_IS_NOT_CORRECT)
    ); // 2032

  const checkMerchandiseExist = await merchandiseProvider.checkMerchandiseExist(
    merchandiseId
  );

  if (checkMerchandiseExist === 0)
    return res.send(errResponse(baseResponse.MERCHANDISE_IS_NOT_EXIST)); // 2010

  const checkMerchandiseIsDeleted =
    await merchandiseProvider.checkMerchandiseIsDeleted(merchandiseId);

  if (checkMerchandiseIsDeleted === 0)
    return res.send(errResponse(baseResponse.MERCHANDISE_IS_DELETED)); // 2011

  const checkHost = await merchandiseProvider.checkHost(userId, merchandiseId);

  if (checkHost === "false")
    return res.send(errResponse(baseResponse.USERID_IS_NOT_HOST)); // 2015

  const checkAlreadyHideOnOFF = await merchandiseProvider.checkAlreadyHideOnOFF(
    merchandiseId
  );

  if (checkAlreadyHideOnOFF === 0)
    return res.send(errResponse(baseResponse.MERCHANDISE_HIDE_ON)); // 2024

  const result = await merchandiseService.updateMerchandiseHideOn(
    merchandiseId
  );

  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 27
 * API Name : 판매상품 숨기기 해제 API
 * [PATCH] /merchandise/:merchandiseId/hide-off
 * Path Variable: merchandiseId
 */
exports.updateMerchandiseHideOff = async function (req, res) {
  const { userId } = req.verifiedToken;
  const { bodyId } = req.body;

  const { merchandiseId } = req.params;

  // Request Error
  if (!userId) return res.send(errResponse(baseResponse.ID_NOT_MATCHING)); // 2005

  if (userId !== bodyId)
    return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH)); // 2006

  const checkUserExist = merchandiseProvider.checkUserExist(userId);

  if (checkUserExist === 0)
    return res.send(errResponse(baseResponse.USER_IS_NOT_EXIST)); // 2026

  if (!regNum.test(merchandiseId) || merchandiseId < 1)
    return res.send(
      errResponse(baseResponse.MERCHANDISE_ID_FORM_IS_NOT_CORRECT)
    ); // 2032

  const checkMerchandiseExist = await merchandiseProvider.checkMerchandiseExist(
    merchandiseId
  );

  if (checkMerchandiseExist === 0)
    return res.send(errResponse(baseResponse.MERCHANDISE_IS_NOT_EXIST)); // 2010

  const checkMerchandiseIsDeleted =
    await merchandiseProvider.checkMerchandiseIsDeleted(merchandiseId);

  if (checkMerchandiseIsDeleted === 0)
    return res.send(errResponse(baseResponse.MERCHANDISE_IS_DELETED)); // 2011

  const checkHost = await merchandiseProvider.checkHost(userId, merchandiseId);

  if (checkHost === "false")
    return res.send(errResponse(baseResponse.USERID_IS_NOT_HOST)); // 2015

  const checkAlreadyHideOnOFF = await merchandiseProvider.checkAlreadyHideOnOFF(
    merchandiseId
  );

  if (checkAlreadyHideOnOFF === 1)
    return res.send(errResponse(baseResponse.MERCHANDISE_HIDE_OFF)); // 2025

  const result = await merchandiseService.updateMerchandiseHideOff(
    merchandiseId
  );

  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 28
 * API Name : 숨긴 판매상품 조회 API
 * [GET] /merchandise/hide/my-merchandise
 * query string: page, size
 */
exports.getMyHideMerchandise = async function (req, res) {
  const { userId } = req.verifiedToken;
  const { bodyId } = req.body;

  let { page, size } = req.query;

  // Request Error
  if (!userId) return res.send(errResponse(baseResponse.ID_NOT_MATCHING)); // 2005

  if (userId !== bodyId)
    return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH)); // 2006

  const checkUserExist = merchandiseProvider.checkUserExist(userId);

  if (checkUserExist === 0)
    return res.send(errResponse(baseResponse.USER_IS_NOT_EXIST)); // 2026

  if (!page) return res.send(response(baseResponse.PAGE_IS_EMPTY)); // 2027

  if (!regPage.test(page) & (page < 1))
    return res.send(response(baseResponse.PAGE_FORM_IS_NOT_CORRECT)); // 2028

  if (!size) return res.send(response(baseResponse.SIZE_IS_EMPTY)); // 2029

  if (!regSize.test(size) & (size < 1))
    return res.send(response(baseResponse.SIZE_FORM_IS_NOT_CORRECT)); // 2030

  page = size * (page - 1);

  const result = await merchandiseProvider.getMyHideMerchandise(
    userId,
    page,
    size
  );

  return res.send(response(baseResponse.SUCCESS, result));
};
