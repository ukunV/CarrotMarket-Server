const { logger } = require("../../../config/winston");
const { pool } = require("../../../config/database");
const secret_config = require("../../../config/secret");
const badgeProvider = require("./BadgeProvider");
const badgeDao = require("./BadgeDao");
const baseResponse = require("../../../config/baseResponseStatus");
const { response } = require("../../../config/response");
const { errResponse } = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { connect } = require("http2");

// Service: Create, Update, Delete 비즈니스 로직 처리

// 대표 배지 변경
exports.updateMainBadge = async function (userId, badgeId) {
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    await connection.beginTransaction();

    const result = await badgeDao.updateMainBadge(connection, userId, badgeId);

    await connection.commit();

    connection.release();

    return result;
  } catch (err) {
    await connection.rollback();
    connection.release();
    logger.error(`updateMainBadge Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};
