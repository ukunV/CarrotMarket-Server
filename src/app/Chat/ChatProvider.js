const { pool } = require("../../../config/database");
const { errResponse } = require("../../../config/response");
const { logger } = require("../../../config/winston");

const chatDao = require("./chatDao");

// Provider: Read 비즈니스 로직 처리

// 채팅방 목록 조회
exports.getChatRoom = async function (userId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await chatDao.selectChatRoom(connection, userId);

    connection.release();

    return result;
  } catch (err) {
    logger.error(`getChatRoom Provider error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};
