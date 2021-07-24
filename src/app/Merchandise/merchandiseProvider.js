const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const merchandiseDao = require("./merchandiseDao");

// Provider: Read 비즈니스 로직 처리

exports.getAllMerchandiseById = async function (locationId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    const result = await merchandiseDao.selectAllMerchandiseById(
      connection,
      locationId
    );
    connection.release();

    return result;
  } catch (err) {
    logger.error(`getAllMerchandiseById Provider error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

exports.getMerchandiseById = async function (merchandiseId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    const result = await merchandiseDao.selectMerchandiseById(
      connection,
      merchandiseId
    );
    connection.release();

    return result;
  } catch (err) {
    logger.error(`getMerchandiseById Provider error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

exports.getMerchandiseCategory = async function () {
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    const result = await merchandiseDao.selectMerchandiseCategory(connection);
    connection.release();

    return result;
  } catch (err) {
    logger.error(`getMerchandiseCategory Provider error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

exports.getCategoryById = async function () {
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    const result = await merchandiseDao.selectCategoryById(connection);
    connection.release();

    return result;
  } catch (err) {
    logger.error(`getCategoryById Provider error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

exports.getMyMerchandiseById = async function (userId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    const result = await merchandiseDao.selectMyMerchandiseById(
      connection,
      userId
    );
    connection.release();

    return result;
  } catch (err) {
    logger.error(`getMyMerchandiseById Provider error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};
