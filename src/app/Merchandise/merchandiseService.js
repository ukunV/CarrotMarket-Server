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

exports.createMerchandise = async function (
  categoryId,
  userId,
  title,
  contents,
  price
) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    const params = [categoryId, userId, title, contents, price];
    const result = await merchandiseDao.insertMerchandise(connection, params);
    console.log(`상품 추가 : ${result}`);
    connection.release();
    return response(baseResponse.SUCCESS);
  } catch {
    logger.error(`App - createUser Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 이미지 배열 처리
exports.createMerchandiseImage = async function (
  merchandiseId,
  number,
  imageURL
) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    const params = [merchandiseId, number, imageURL];
    const result = await merchandiseDao.insertMerchandiseImage(
      connection,
      params
    );
    console.log(`상품 이미지 추가 : ${result}`);
    connection.release();
    return response(baseResponse.SUCCESS);
  } catch {
    logger.error(`App - createUser Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

exports.updateMerchandise = async function (
  categoryId,
  userId,
  title,
  contents,
  price
) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    const params = [categoryId, userId, title, contents, price];
    const result = await merchandiseDao.updateMerchandise(connection, params);
    console.log(`상품 수정 : ${result}`);
    connection.release();
    return response(baseResponse.SUCCESS);
  } catch {
    logger.error(`App - createUser Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

exports.updateMerchandiseImage = async function (merchandiseId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    const result = await merchandiseDao.updateMerchandise(
      connection,
      merchandiseId
    );
    console.log(`상품 수정 : ${result}`);
    connection.release();
    return response(baseResponse.SUCCESS);
  } catch {
    logger.error(`App - createUser Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

exports.updateMerchandiseStatus = async function (status, id) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    const params = [status, id];
    const result = await merchandiseDao.updateMerchandise(connection, params);
    console.log(`상품 상태 수정 : ${result}`);
    connection.release();
    return response(baseResponse.SUCCESS);
  } catch {
    logger.error(`App - createUser Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

exports.deleteMerchandise = async function (merchandiseId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    const result = await merchandiseDao.updateMerchandise(
      connection,
      merchandiseId
    );
    console.log(`상품 삭제 : ${result}`);
    connection.release();
    return response(baseResponse.SUCCESS);
  } catch {
    logger.error(`App - createUser Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};
