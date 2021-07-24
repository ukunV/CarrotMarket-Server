const { logger } = require("../../../config/winston");
const { pool } = require("../../../config/database");
const secret_config = require("../../../config/secret");
const mannerProvider = require("./mannerProvider");
const mannerDao = require("./mannerDao");
const baseResponse = require("../../../config/baseResponseStatus");
const { response } = require("../../../config/response");
const { errResponse } = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { connect } = require("http2");

// Service: Create, Update, Delete 비즈니스 로직 처리

exports.createMannerAcheived = async function (userId, mannerId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    const params = [userId, mannerId];
    const result = await mannerDao.insertMannerAcheived(connection, params);

    console.log(`매너 추가 : ${result}`);

    connection.release();
    return response(baseResponse.SUCCESS);
  } catch {
    logger.error(`createBadge Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};
