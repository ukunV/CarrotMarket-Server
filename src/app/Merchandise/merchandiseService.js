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
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await merchandiseDao.insertMerchandise(
      connection,
      categoryId,
      userId,
      title,
      contents,
      price,
      image_arr
    );

    connection.release();

    return result;
  } catch (err) {
    logger.error(`createMerchandise Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 판매상품 삭제
exports.deleteMerchandise = async function (merchandiseId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    const result = await merchandiseDao.deleteMerchandise(
      connection,
      merchandiseId
    );

    connection.release();

    return result;
  } catch {
    logger.error(`deleteMerchandise Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 판매상품 끌어올리기
exports.pullUpMerchandise = async function (merchandiseId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    const result = await merchandiseDao.pullUpMerchandise(
      connection,
      price,
      merchandiseId
    );

    connection.release();

    return result;
  } catch {
    logger.error(`pullUpMerchandise Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// exports.updateMerchandise = async function (
//   categoryId,
//   userId,
//   title,
//   contents,
//   price
// ) {
//   try {
//     const connection = await pool.getConnection(async (conn) => conn);
//     const params = [categoryId, userId, title, contents, price];
//     const result = await merchandiseDao.updateMerchandise(connection, params);

//     connection.release();
//     return response(baseResponse.SUCCESS);
//   } catch {
//     logger.error(`updateMerchandise Service error\n: ${err.message}`);
//     return errResponse(baseResponse.DB_ERROR);
//   }
// };

// exports.updateMerchandiseImage = async function (merchandiseId) {
//   try {
//     const connection = await pool.getConnection(async (conn) => conn);
//     const result = await merchandiseDao.updateMerchandise(
//       connection,
//       merchandiseId
//     );
//     console.log(`상품 수정 : ${result}`);
//     connection.release();
//     return response(baseResponse.SUCCESS);
//   } catch {
//     logger.error(`App - createUser Service error\n: ${err.message}`);
//     return errResponse(baseResponse.DB_ERROR);
//   }
// };

// exports.updateMerchandiseStatus = async function (status, id) {
//   try {
//     const connection = await pool.getConnection(async (conn) => conn);
//     const params = [status, id];
//     const result = await merchandiseDao.updateMerchandise(connection, params);
//     console.log(`상품 상태 수정 : ${result}`);
//     connection.release();
//     return response(baseResponse.SUCCESS);
//   } catch {
//     logger.error(`App - createUser Service error\n: ${err.message}`);
//     return errResponse(baseResponse.DB_ERROR);
//   }
// };

// exports.deleteMerchandise = async function (merchandiseId) {
//   try {
//     const connection = await pool.getConnection(async (conn) => conn);
//     const result = await merchandiseDao.updateMerchandise(
//       connection,
//       merchandiseId
//     );
//     console.log(`상품 삭제 : ${result}`);
//     connection.release();
//     return response(baseResponse.SUCCESS);
//   } catch {
//     logger.error(`App - createUser Service error\n: ${err.message}`);
//     return errResponse(baseResponse.DB_ERROR);
//   }
// };
