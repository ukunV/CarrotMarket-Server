const { pool } = require("../../../config/database");
const { errResponse } = require("../../../config/response");
const { logger } = require("../../../config/winston");

const userDao = require("./userDao");

// Provider: Read 비즈니스 로직 처리

// 휴대폰 번호 체크
exports.phoneNumCheck = async function (hashedPhoneNum) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await userDao.selectUserPhoneNum(connection, hashedPhoneNum);
    connection.release();

    return result;
  } catch (err) {
    logger.error(`phoneNumCheck Provider error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 닉네임 체크
exports.nicknameCheck = async function (nickname) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await userDao.selectUserNickname(connection, nickname);
    connection.release();

    return result;
  } catch (err) {
    logger.error(`nicknameCheck Provider error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 유저 ID 조회
exports.getUserId = async function (hashedPhoneNum) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await userDao.selectUserId(connection, hashedPhoneNum);
    connection.release();

    return result;
  } catch (err) {
    logger.error(`getUserInfo Provider error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 유저 프로필 조회
exports.getUserProfile = async function (selectedId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await userDao.selectUserProfile(connection, selectedId);
    connection.release();

    return result;
  } catch (err) {
    logger.error(`getUserProfile Provider error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 유저 존재 여부 check
exports.checkExist = async function (selectedId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await userDao.checkExist(connection, selectedId);

    connection.release();

    return result;
  } catch (err) {
    logger.error(`checkExist Provider error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 유저 상태 check
exports.checkStatus = async function (selectedId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await userDao.checkStatus(connection, selectedId);

    connection.release();

    return result;
  } catch (err) {
    logger.error(`checkStatus Provider error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 나의 당근 조회
exports.getMyCarrot = async function (userId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await userDao.selectMyCarrot(connection, userId);
    connection.release();

    return result;
  } catch (err) {
    logger.error(`getMyCarrot Provider error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};
