const express = require("express");
const compression = require("compression");
const methodOverride = require("method-override");
const cors = require("cors");

module.exports = function () {
  const app = express();

  app.use(compression());

  app.use(express.json());

  app.use(express.urlencoded({ extended: true }));

  app.use(methodOverride());

  app.use(cors());
  // app.use(express.static(process.cwd() + '/public'));

  /* App (Android, iOS) */
  // TODO: 도메인을 추가할 경우 이곳에 Route를 추가하세요.
  require("../src/app/User/userRoute")(app);
  require("../src/app/Review/reviewRoute")(app);
  require("../src/app/Merchandise/merchandiseRoute")(app);
  require("../src/app/Manner/mannerRoute")(app);
  require("../src/app/Badge/badgeRoute")(app);
  require("../src/app/Chat/chatRoute")(app);
  require("../src/app/Notice/noticeRoute")(app);

  return app;
};
