const { logger } = require("../../../config/winston");
const { pool } = require("../../../config/database");
const secret_config = require("../../../config/secret");
const userProvider = require("./userProvider");
const userDao = require("./userDao");
const baseResponse = require("../../../config/baseResponseStatus");
const { response } = require("../../../config/response");
const { errResponse } = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { connect } = require("http2");

// Service: Create, Update, Delete 비즈니스 로직 처리

exports.createUser = async function (hashedPhoneNum, nickname) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const params = [hashedPhoneNum, nickname];
    const result = await userDao.insertUserInfo(connection, params);
    console.log(`추가된 회원 : ${result[0].insertId}`);

    connection.release();
    return result;
  } catch (err) {
    logger.error(`createUser Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

exports.updateUserByUserId = async function (photoURL, nickname, userId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const params = [photoURL, nickname, userId];
    const result = await userDao.updateUserInfo(connection, params);
    connection.release();

    return result;
  } catch (err) {
    logger.error(`updateUserByUserId Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};
