module.exports = function (app) {
  const merchandise = require("./merchandiseController");
  const jwtMiddleware = require("../../../config/jwtMiddleware");

  // 동네별 최신수 판매 상품 조회 API
  app.get(
    "/merchandise/:locationId",
    jwtMiddleware,
    merchandise.getAllMerchandise
  );

  // 상품 조회 API
  app.get("/merchandise", jwtMiddleware, merchandise.getMerchandise);

  // app.get("/merchandise/category", merchandise.getMerchandiseCategory);

  // app.get("/merchandise/location/:categoryId", merchandise.getCategoryById);
};
