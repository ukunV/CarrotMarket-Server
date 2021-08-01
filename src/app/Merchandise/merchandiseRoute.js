module.exports = function (app) {
  const merchandise = require("./merchandiseController");
  const jwtMiddleware = require("../../../config/jwtMiddleware");

  // 8. 동네별 최신수 판매 상품 조회 API
  app.get(
    "/merchandise/:locationId/on-sale",
    jwtMiddleware,
    merchandise.getAllMerchandise
  );

  // 9. 상품 조회 API
  app.get(
    "/merchandise/:merchandiseId/detail",
    jwtMiddleware,
    merchandise.getMerchandise
  );

  // 10. 전체 카테고리 조회 API
  app.get("/merchandise/all-category", jwtMiddleware, merchandise.getCategory);

  // 11. 카테고리별 최신순 판매상품 조회 API
  app.get(
    "/merchandise/:locationId/category",
    jwtMiddleware,
    merchandise.getCategoryMerchandise
  );

  // 12. 판매상품 생성 API
  app.post("/merchandise", jwtMiddleware, merchandise.createMerchandise);

  // 13. 판매상품 삭제 API
  app.patch(
    "/merchandise/:merchandiseId",
    jwtMiddleware,
    merchandise.deleteMerchandise
  );

  // 14. 판매상품 끌어올리기 API
  app.patch(
    "/merchandise/:merchandiseId/pull-up",
    jwtMiddleware,
    merchandise.pullUpMerchandise
  );

  // 15. 판매상품 상태 변경 API
  app.patch(
    "/merchandise/:merchandiseId/status",
    jwtMiddleware,
    merchandise.updateMerchandiseStatus
  );

  // 16. 내 판매상품 조회 API
  app.get(
    "/merchandise/my-merchandise",
    jwtMiddleware,
    merchandise.getMyMerchandise
  );

  // 17. 판매상품 수정 API
  app.patch(
    "/merchandise/:merchandiseId/detail",
    jwtMiddleware,
    merchandise.updateMerchandise
  );

  // 26. 판매상품 숨기기 API
  app.patch(
    "/merchandise/:merchandiseId/hide-on",
    jwtMiddleware,
    merchandise.updateMerchandiseHideOn
  );

  // 27. 판매상품 숨기기 해제 API
  app.patch(
    "/merchandise/:merchandiseId/hide-off",
    jwtMiddleware,
    merchandise.updateMerchandiseHideOff
  );

  // 28. 숨긴 판매상품 조회 API
  app.get(
    "/merchandise/hide/my-merchandise",
    jwtMiddleware,
    merchandise.getMyHideMerchandise
  );
};
