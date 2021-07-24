const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const reviewDao = require("./reviewDao");

// Provider: Read 비즈니스 로직 처리

exports.getReviewByUserId = async function () {
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    const result = await reviewDao.selectReviewByUserId(connection);
    connection.release();

    return result;
  } catch (err) {
    logger.error(`getCategoryById Provider error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};
