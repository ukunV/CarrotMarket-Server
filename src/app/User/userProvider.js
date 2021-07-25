const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const userDao = require("./userDao");

// Provider: Read 비즈니스 로직 처리

// 휴대폰 번호 체크
exports.phoneNumCheck = async function (hashedPhoneNum) {
  const connection = await pool.getConnection(async (conn) => conn);
  const phoneNumCheckResult = await userDao.selectUserPhoneNum(
    connection,
    hashedPhoneNum
  );
  connection.release();

  return phoneNumCheckResult;
};

// 닉네임 체크
exports.nicknameCheck = async function (nickname) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    const nicknameCheckResult = await userDao.selectUserNickname(
      connection,
      nickname
    );
    connection.release();

    return nicknameCheckResult;
  } catch (err) {
    logger.error(`nicknameCheck Provider error\n: ${err.message}`);
    return response(baseResponse.DB_ERROR);
  }
};

// 유저 ID 조회
exports.getUserInfo = async function (hashedPhoneNum) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    const userInfoResult = await userDao.selectUserInfo(
      connection,
      hashedPhoneNum
    );
    connection.release();

    return userInfoResult;
  } catch (err) {
    logger.error(`userInfo Provider error\n: ${err.message}`);
    return response(baseResponse.DB_ERROR);
  }
};
