const { logger } = require("../../../config/winston");
const { pool } = require("../../../config/database");
const secret_config = require("../../../config/secret");
const merchandiseProvider = require("./merchandiseProvider");
const merchandiseDao = require("./merchandiseDao");
const baseResponse = require("../../../config/baseResponseStatus");
const { response } = require("../../../config/response");
const { errResponse } = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { connect } = require("http2");

// Service: Create, Update, Delete 비즈니스 로직 처리

// 판매상품 생성
exports.createMerchandise = async function (
  categoryId,
  userId,
  title,
  contents,
  price,
  image_arr
) {
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    await connection.beginTransaction();

    const result = await merchandiseDao.insertMerchandise(
      connection,
      categoryId,
      userId,
      title,
      contents,
      price,
      image_arr
    );

    await connection.commit();

    connection.release();

    return result;
  } catch (err) {
    await connection.rollback();
    connection.release();
    logger.error(`createMerchandise Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 판매상품 삭제
exports.deleteMerchandise = async function (merchandiseId) {
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    await connection.beginTransaction();

    const result = await merchandiseDao.deleteMerchandise(
      connection,
      merchandiseId
    );

    await connection.commit();

    connection.release();

    return result;
  } catch (err) {
    await connection.rollback();
    connection.release();
    logger.error(`deleteMerchandise Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 판매상품 끌어올리기
exports.pullUpMerchandise = async function (price, merchandiseId) {
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    await connection.beginTransaction();

    const result = await merchandiseDao.pullUpMerchandise(
      connection,
      price,
      merchandiseId
    );

    await connection.commit();

    connection.release();

    return result;
  } catch (err) {
    await connection.rollback();
    connection.release();
    logger.error(`pullUpMerchandise Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 판매상품 상태 변경
exports.updateMerchandiseStatus = async function (status, merchandiseId) {
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    await connection.beginTransaction();

    const params = [status, merchandiseId];
    const result = await merchandiseDao.updateMerchandiseStatus(
      connection,
      params
    );

    await connection.commit();

    connection.release();

    return result;
  } catch (err) {
    await connection.rollback();
    connection.release();
    logger.error(`updateMerchandiseStatus Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 상품 수정
exports.updateMerchandise = async function (
  merchandiseId,
  categoryId,
  title,
  contents,
  price,
  image_arr
) {
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    await connection.beginTransaction();

    const result = await merchandiseDao.updateMerchandise(
      connection,
      merchandiseId,
      categoryId,
      title,
      contents,
      price,
      image_arr
    );

    await connection.commit();

    connection.release();

    return result;
  } catch (err) {
    await connection.rollback();
    connection.release();
    logger.error(`updateMerchandise Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 판매상품 숨기기
exports.updateMerchandiseHideOn = async function (merchandiseId) {
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    await connection.beginTransaction();

    const result = await merchandiseDao.updateMerchandiseHideOn(
      connection,
      merchandiseId
    );

    await connection.commit();

    connection.release();

    return result;
  } catch (err) {
    await connection.rollback();
    connection.release();
    logger.error(`updateMerchandiseHideOn Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 판매상품 숨기기 해제
exports.updateMerchandiseHideOff = async function (merchandiseId) {
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    await connection.beginTransaction();

    const result = await merchandiseDao.updateMerchandiseHideOff(
      connection,
      merchandiseId
    );

    await connection.commit();

    connection.release();

    return result;
  } catch (err) {
    await connection.rollback();
    connection.release();
    logger.error(`updateMerchandiseHideOff Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};
