const { pool } = require("../../../config/database");
const { errResponse } = require("../../../config/response");
const { logger } = require("../../../config/winston");

const reviewDao = require("./reviewDao");

// Provider: Read 비즈니스 로직 처리

// 후기 조회
exports.getReview = async function (selectId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await reviewDao.selectReview(connection, selectId);

    connection.release();

    return result;
  } catch (err) {
    logger.error(`getReview Provider error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};
