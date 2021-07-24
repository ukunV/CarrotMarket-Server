const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const badgeDao = require("./BadgeDao");

// Provider: Read 비즈니스 로직 처리

exports.getBadgeByUserId = async function (userId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    const result = await badgeDao.selectBadgeByUserId(connection, userId);

    connection.release();

    return result;
  } catch (err) {
    logger.error(`getBadgeByUserId Provider error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

exports.getBadgeDescriptionByBadgeId = async function (badgeId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    const result = await badgeDao.selectBadgeDescriptionByBadgeId(
      connection,
      badgeId
    );

    connection.release();

    return result;
  } catch (err) {
    logger.error(
      `getBadgeDescriptionByBadgeId Provider error\n: ${err.message}`
    );
    return errResponse(baseResponse.DB_ERROR);
  }
};
