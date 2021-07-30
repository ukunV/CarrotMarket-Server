const { pool } = require("../../../config/database");
const { errResponse } = require("../../../config/response");
const { logger } = require("../../../config/winston");

const mannerDao = require("./mannerDao");

// Provider: Read 비즈니스 로직 처리

// 매너 조회
exports.getManner = async function (selectedId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await mannerDao.selectManner(connection, selectedId);

    connection.release();

    return result;
  } catch (err) {
    logger.error(`getManner Provider error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 유저 존재 여부 check
exports.checkUserExist = async function (selectedId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await mannerDao.checkUserExist(connection, selectedId);

    connection.release();

    return result;
  } catch (err) {
    logger.error(`checkUserExist Provider error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 매너 존재 여부 check
exports.checkMannerExist = async function (mannerId_arr) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await mannerDao.checkMannerExist(connection, mannerId_arr);

    connection.release();

    return result;
  } catch (err) {
    logger.error(`checkMannerExist Provider error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};
