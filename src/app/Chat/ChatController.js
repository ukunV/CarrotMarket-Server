const jwtMiddleware = require("../../../config/jwtMiddleware");
const chatProvider = require("../../app/Chat/chatProvider");
const chatService = require("../../app/Chat/chatService");
const baseResponse = require("../../../config/baseResponseStatus");
const { response, errResponse } = require("../../../config/response");

const regexEmail = require("regex-email");
const { emit } = require("nodemon");

/**
 * API No. 23
 * API Name : 채팅방 목록 조회 API
 * [GET] /chat/chatroom/list
 */
exports.getChatRoom = async function (req, res) {
  const { userId } = req.verifiedToken;
  const { bodyId } = req.body;

  // Request Error
  if (!userId) return res.send(errResponse(baseResponse.ID_NOT_MATCHING)); // 2005

  if (userId !== bodyId)
    return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH)); // 2006

  const result = await chatProvider.getChatRoom(userId);

  return res.send(response(baseResponse.SUCCESS, result));
};
