const { pool } = require("../../../config/database");
const { errResponse } = require("../../../config/response");
const { logger } = require("../../../config/winston");

const merchandiseDao = require("./merchandiseDao");

// Provider: Read 비즈니스 로직 처리

// 지역 존재 여부 check
exports.checkLocationExist = async function (locationId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await merchandiseDao.checkLocationExist(
      connection,
      locationId
    );

    connection.release();

    return result;
  } catch (err) {
    logger.error(`checkLocationExist Provider error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 동네별 최신수 판매 상품 조회
exports.getAllMerchandise = async function (locationId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    const result = await merchandiseDao.selectAllMerchandise(
      connection,
      locationId
    );

    connection.release();

    return result;
  } catch (err) {
    logger.error(`getAllMerchandise Provider error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 상품 조회
exports.getMerchandise = async function (merchandiseId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await merchandiseDao.selectMerchandise(
      connection,
      merchandiseId
    );

    connection.release();

    return result;
  } catch (err) {
    logger.error(`getMerchandise Provider error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 상품 존재 여부 check
exports.checkMerchandiseExist = async function (merchandiseId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await merchandiseDao.checkMerchandiseExist(
      connection,
      merchandiseId
    );

    connection.release();

    return result;
  } catch (err) {
    logger.error(`checkMerchandiseExist Provider error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 상품 주인 여부 check
exports.checkHost = async function (userId, merchandiseId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await merchandiseDao.checkHost(
      connection,
      userId,
      merchandiseId
    );

    connection.release();

    return result;
  } catch (err) {
    logger.error(`checkHost Provider error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 상품 삭제 여부 check
exports.checkMerchandiseIsDeleted = async function (merchandiseId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await merchandiseDao.checkMerchandiseIsDeleted(
      connection,
      merchandiseId
    );
    connection.release();

    return result;
  } catch (err) {
    logger.error(`checkMerchandiseIsDeleted Provider error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 전체 카테고리 조회
exports.getCategory = async function () {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await merchandiseDao.selectCategory(connection);

    connection.release();

    return result;
  } catch (err) {
    logger.error(`getCategory Provider error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 카테고리 존재 여부 check
exports.checkCategoryExist = async function (categoryId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await merchandiseDao.checkCategoryExist(
      connection,
      categoryId
    );

    connection.release();

    return result;
  } catch (err) {
    logger.error(`checkCategoryExist Provider error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 카테고리별 최신순 판매상품 조회
exports.getCategoryMerchandise = async function (locationId, categoryId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const params = [locationId, categoryId];
    const result = await merchandiseDao.selectCategoryMerchandise(
      connection,
      params
    );

    connection.release();

    return result;
  } catch (err) {
    logger.error(`getCategoryMerchandise Provider error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 판매상품 끌어올리기 가능여부 check
exports.checkPullUpPossible = async function (merchandiseId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await merchandiseDao.checkPullUpPossible(
      connection,
      merchandiseId
    );

    connection.release();

    return result;
  } catch (err) {
    logger.error(`checkPullUpPossible Provider error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 내 판매상품 조회 (status - 판매중/예약중 : 1, 거래완료 : 0)
exports.getMyMerchandise = async function (userId, condition) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await merchandiseDao.selectMyMerchandise(
      connection,
      userId,
      condition
    );

    connection.release();

    return result;
  } catch (err) {
    logger.error(`getMyMerchandise Provider error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 상품 숨기기 여부 check
exports.checkIsHided = async function (merchandiseId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await merchandiseDao.checkIsHided(connection, merchandiseId);

    connection.release();

    return result;
  } catch (err) {
    logger.error(`checkIsHided Provider error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 숨긴 판매상품 조회
exports.getMyHideMerchandise = async function (userId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await merchandiseDao.selectMyHideMerchandise(
      connection,
      userId
    );

    connection.release();

    return result;
  } catch (err) {
    logger.error(`getMyHideMerchandise Provider error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};
