const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const mannerDao = require("./mannerDao");

// Provider: Read 비즈니스 로직 처리

exports.getMannerByUserId = async function (userId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    const result = await mannerDao.selectMannerByUserId(connection, userId);

    connection.release();

    return result;
  } catch (err) {
    logger.error(`getBadgeByUserId Provider error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};
