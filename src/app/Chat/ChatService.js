const { logger } = require("../../../config/winston");
const { pool } = require("../../../config/database");
const secret_config = require("../../../config/secret");
const chatProvider = require("./chatProvider");
const chatDao = require("./chatDao");
const baseResponse = require("../../../config/baseResponseStatus");
const { response } = require("../../../config/response");
const { errResponse } = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { connect } = require("http2");

// Service: Create, Update, Delete 비즈니스 로직 처리

// 채팅 전송
exports.createChat = async function (roomId, userId, contents) {
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    await connection.beginTransaction();

    const result = await chatDao.createChat(
      connection,
      roomId,
      userId,
      contents
    );

    await connection.commit();

    connection.release();

    return result;
  } catch (err) {
    await connection.rollback();
    connection.release();
    logger.error(`createChat Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 채팅방 삭제
exports.deleteChatRoom = async function (roomId, userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    await connection.beginTransaction();

    const result = await chatDao.deleteChatRoom(connection, roomId, userId);

    await connection.commit();

    connection.release();

    return result;
  } catch (err) {
    await connection.rollback();
    connection.release();
    logger.error(`deleteChatRoom Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};
