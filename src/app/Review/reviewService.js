const { logger } = require("../../../config/winston");
const { pool } = require("../../../config/database");
const secret_config = require("../../../config/secret");
const reviewProvider = require("./reviewProvider");
const reviewDao = require("./reviewDao");
const baseResponse = require("../../../config/baseResponseStatus");
const { response } = require("../../../config/response");
const { errResponse } = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { connect } = require("http2");

// Service: Create, Update, Delete 비즈니스 로직 처리

// 후기 등록
exports.createReview = async function (userId, authorId, contents) {
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    await connection.beginTransaction();

    const params = [userId, authorId, contents];
    const result = await reviewDao.insertReview(connection, params);

    await connection.commit();

    connection.release();

    return result;
  } catch (err) {
    await connection.rollback();
    connection.release();
    logger.error(`createReview Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 후기 상태 변경
exports.updateReviewStatus = async function (reviewId) {
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    await connection.beginTransaction();

    const result = await reviewDao.updateReviewStatus(connection, reviewId);

    await connection.commit();

    connection.release();

    return result;
  } catch (err) {
    await connection.rollback();
    connection.release();
    logger.error(`updateReviewStatus Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};
