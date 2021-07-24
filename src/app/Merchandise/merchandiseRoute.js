module.exports = function (app) {
  const merchandise = require("./merchandiseController");
  const jwtMiddleware = require("../../../config/jwtMiddleware");

  app.get("/merchandise/category", merchandise.getMerchandiseCategory);
  //   app.get("/merchandise/:location", merchandise.getAllMerchandiseById);
  app.get("/merchandise/:merchandiseId", merchandise.getMerchandiseById);
  app.get("/merchandise/location/:categoryId", merchandise.getCategoryById);
};
