const { pool } = require("../../../config/database");
const { errResponse } = require("../../../config/response");
const { logger } = require("../../../config/winston");

const merchandiseDao = require("./merchandiseDao");

// Provider: Read 비즈니스 로직 처리

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

// 상품 삭제 여부 check
exports.checkIsDeleted = async function (merchandiseId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    const result = await merchandiseDao.checkIsDeleted(
      connection,
      merchandiseId
    );
    connection.release();

    return result;
  } catch (err) {
    logger.error(`checkIsDeleted Provider error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 상품 존재 여부 check
exports.checkExist = async function (merchandiseId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    const result = await merchandiseDao.checkExist(connection, merchandiseId);
    connection.release();

    return result;
  } catch (err) {
    logger.error(`checkExist Provider error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// exports.getMerchandiseCategory = async function () {
//   try {
//     const connection = await pool.getConnection(async (conn) => conn);
//     const result = await merchandiseDao.selectMerchandiseCategory(connection);
//     connection.release();

//     return result;
//   } catch (err) {
//     logger.error(`getMerchandiseCategory Provider error\n: ${err.message}`);
//     return errResponse(baseResponse.DB_ERROR);
//   }
// };

// exports.getCategoryById = async function () {
//   try {
//     const connection = await pool.getConnection(async (conn) => conn);
//     const result = await merchandiseDao.selectCategoryById(connection);
//     connection.release();

//     return result;
//   } catch (err) {
//     logger.error(`getCategoryById Provider error\n: ${err.message}`);
//     return errResponse(baseResponse.DB_ERROR);
//   }
// };

// exports.getMyMerchandiseById = async function (userId) {
//   try {
//     const connection = await pool.getConnection(async (conn) => conn);
//     const result = await merchandiseDao.selectMyMerchandiseById(
//       connection,
//       userId
//     );
//     connection.release();

//     return result;
//   } catch (err) {
//     logger.error(`getMyMerchandiseById Provider error\n: ${err.message}`);
//     return errResponse(baseResponse.DB_ERROR);
//   }
// };
