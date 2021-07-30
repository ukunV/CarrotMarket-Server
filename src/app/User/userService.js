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
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    await connection.beginTransaction();

    const params = [hashedPhoneNum, nickname];
    const result = await userDao.insertUserInfo(connection, params);

    await connection.commit();

    connection.release();
    return result;
  } catch (err) {
    await connection.rollback();
    connection.release();
    logger.error(`createUser Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

exports.updateUserProfile = async function (photoURL, nickname, userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    await connection.beginTransaction();

    const params = [photoURL, nickname, userId];
    const result = await userDao.updateUserProfile(connection, params);

    await connection.commit();

    connection.release();

    return result;
  } catch (err) {
    await connection.rollback();
    connection.release();
    logger.error(`updateUserProfile Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};
