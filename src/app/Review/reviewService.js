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

exports.createReview = async function (userId, authorId, contents) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    const params = [userId, authorId, contents];
    const result = await reviewDao.insertReview(connection, params);

    console.log(`상품 추가 : ${result}`);
    connection.release();

    return response(baseResponse.SUCCESS);
  } catch {
    logger.error(`App - createReview Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};
