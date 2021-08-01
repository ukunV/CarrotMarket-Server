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
 * [GET] /chat/room/list
 * 채팅방(유저 마다) 삭제 여부 체크
 */
exports.getChatRoomList = async function (req, res) {
  const { userId } = req.verifiedToken;
  const { bodyId } = req.body;

  // Request Error
  if (!userId) return res.send(errResponse(baseResponse.ID_NOT_MATCHING)); // 2005

  if (userId !== bodyId)
    return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH)); // 2006

  const result = await chatProvider.getChatRoomList(userId);

  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 24
 * API Name : 채팅 전송 API
 * [POST] /chat/:roomId/message
 */
exports.createChat = async function (req, res) {
  const { userId } = req.verifiedToken;
  const { bodyId } = req.body;

  const { roomId } = req.params;
  const { contents } = req.body;

  // Request Error
  if (!userId) return res.send(errResponse(baseResponse.ID_NOT_MATCHING)); // 2005

  if (userId !== bodyId)
    return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH)); // 2006

  const checkRoomExist = await chatProvider.checkRoomExist(roomId);

  if (checkRoomExist === 0)
    return res.send(errResponse(baseResponse.CHATROOM_IS_NOT_EXIST)); // 2022

  const result = await chatService.createChat(roomId, userId, contents);

  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 25
 * API Name : 채팅방 조회 API
 * [GET] /chat/:roomId/room
 */
exports.getChatRoom = async function (req, res) {
  const { userId } = req.verifiedToken;
  const { bodyId } = req.body;

  const { roomId } = req.params;

  // Request Error
  if (!userId) return res.send(errResponse(baseResponse.ID_NOT_MATCHING)); // 2005

  if (userId !== bodyId)
    return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH)); // 2006

  const checkRoomExist = await chatProvider.checkRoomExist(roomId);

  if (checkRoomExist === 0)
    return res.send(errResponse(baseResponse.CHATROOM_IS_NOT_EXIST)); // 2022

  const checkRoomMember = await chatProvider.checkRoomMember(roomId, userId);

  if (checkRoomMember === 0)
    return res.send(errResponse(baseResponse.NOT_IN_ROOM_MEMBER)); // 2023

  const result = await chatProvider.getChatRoom(roomId);

  return res.send(response(baseResponse.SUCCESS, result));
};
