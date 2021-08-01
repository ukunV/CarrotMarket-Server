const { pool } = require("../../../config/database");
const { errResponse } = require("../../../config/response");
const { logger } = require("../../../config/winston");

const chatDao = require("./chatDao");

// Provider: Read 비즈니스 로직 처리

// 채팅방 목록 조회
exports.getChatRoomList = async function (userId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await chatDao.selectChatRoomList(connection, userId);

    connection.release();

    return result;
  } catch (err) {
    logger.error(`getChatRoomList Provider error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 채팅방 존재 여부 check
exports.checkRoomExist = async function (roomId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await chatDao.checkRoomExist(connection, roomId);

    connection.release();

    return result;
  } catch (err) {
    logger.error(`checkRoomExist Provider error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 채팅방 맴버 여부 check
exports.checkRoomMember = async function (roomId, userId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await chatDao.checkRoomMember(connection, roomId, userId);

    connection.release();

    return result;
  } catch (err) {
    logger.error(`checkRoomMember Provider error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 채팅방 조회
exports.getChatRoom = async function (roomId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await chatDao.selectChatRoom(connection, roomId);

    connection.release();

    return result;
  } catch (err) {
    logger.error(`getChatRoom Provider error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};
