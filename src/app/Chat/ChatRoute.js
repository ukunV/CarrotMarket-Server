module.exports = function (app) {
  const chat = require("./chatController");
  const jwtMiddleware = require("../../../config/jwtMiddleware");

  // 23. 채팅방 목록 조회 API
  app.get("/chat/chatroom/list", jwtMiddleware, chat.getChatRoom);
};
