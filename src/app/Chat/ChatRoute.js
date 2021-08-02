module.exports = function (app) {
  const chat = require("./chatController");
  const jwtMiddleware = require("../../../config/jwtMiddleware");

  // 23. 채팅방 목록 조회 API
  app.get("/chat/room/list", jwtMiddleware, chat.getChatRoomList);

  // 24. 채팅 전송 API
  app.post("/chat/:roomId/message", jwtMiddleware, chat.createChat);

  // 25. 채팅방 조회 API
  app.get("/chat/:roomId/room", jwtMiddleware, chat.getChatRoom);

  // 29. 채팅방 조회 API
  app.patch("/chat/:roomId/room/status", jwtMiddleware, chat.deleteChatRoom);
};
