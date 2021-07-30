const { pool } = require("../../../config/database");
const { errResponse } = require("../../../config/response");
const { logger } = require("../../../config/winston");

const badgeDao = require("./BadgeDao");

// Provider: Read 비즈니스 로직 처리

// 획득 배지 조회
exports.getBadge = async function (selectedId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    const result = await badgeDao.selectBadge(connection, selectedId);

    connection.release();

    return result;
  } catch (err) {
    logger.error(`getBadge Provider error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 유저 존재 여부 check
exports.checkUserExist = async function (selectedId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    const result = await badgeDao.checkUserExist(connection, selectedId);

    connection.release();

    return result;
  } catch (err) {
    logger.error(`checkUserExist Provider error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 배지 존재 여부 check
exports.checkBadgeExist = async function (badgeId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    const result = await badgeDao.checkBadgeExist(connection, badgeId);

    connection.release();

    return result;
  } catch (err) {
    logger.error(`checkBadgeExist Provider error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 배지 상세내용 조회
exports.getBadgeDetail = async function (badgeId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    const result = await badgeDao.getBadgeDetail(connection, badgeId);

    connection.release();

    return result;
  } catch (err) {
    logger.error(`getBadgeDetail Provider error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 황금배지 여부 check
exports.checkIsGold = async function (badgeId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    const result = await badgeDao.checkIsGold(connection, badgeId);

    connection.release();

    return result;
  } catch (err) {
    logger.error(`checkIsGold Provider error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 배지 획득 여부 check
exports.checkIsAcheived = async function (userId, badgeId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    const params = [userId, badgeId];
    const result = await badgeDao.checkIsAcheived(connection, params);

    connection.release();

    return result;
  } catch (err) {
    logger.error(`checkIsAcheived Provider error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 대표 배지 설정 여부 check
exports.checkAlreadyMain = async function (userId, badgeId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    const params = [userId, badgeId];
    const result = await badgeDao.checkAlreadyMain(connection, params);

    connection.release();

    return result;
  } catch (err) {
    logger.error(`checkAlreadyMain Provider error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};
