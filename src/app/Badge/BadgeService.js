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
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await badgeDao.updateMainBadge(connection, userId, badgeId);

    connection.release();

    return result;
  } catch (err) {
    logger.error(`updateMainBadge Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};
