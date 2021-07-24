module.exports = function (app) {
  const manner = require("./mannerController");
  const jwtMiddleware = require("../../../config/jwtMiddleware");

  app.get("/manner", manner.getMannerByUserId);

  app.post("/manner", manner.createMannerAcheived);
};
