const { pool } = require("../../../config/database");
const { errResponse } = require("../../../config/response");
const { logger } = require("../../../config/winston");

const reviewDao = require("./reviewDao");

// Provider: Read 비즈니스 로직 처리

// 후기 조회
exports.getReview = async function (selectedId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await reviewDao.selectReview(connection, selectedId);

    connection.release();

    return result;
  } catch (err) {
    logger.error(`getReview Provider error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 유저 존재 여부 check
exports.checkUserExist = async function (id) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await reviewDao.checkUserExist(connection, id);

    connection.release();

    return result;
  } catch (err) {
    logger.error(`checkUserExist Provider error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};
