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

// 매너 추가
exports.createManner = async function (selectedId, mannerId_arr) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await mannerDao.insertManner(
      connection,
      selectedId,
      mannerId_arr
    );

    connection.release();

    return result;
  } catch (err) {
    logger.error(`createManner Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};
