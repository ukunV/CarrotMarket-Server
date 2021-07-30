module.exports = {
  // Success
  SUCCESS: { isSuccess: true, code: 1000, message: "성공" },

  // Common
  TOKEN_EMPTY: {
    isSuccess: false,
    code: 2000,
    message: "JWT 토큰을 입력해주세요.",
  },
  TOKEN_VERIFICATION_FAILURE: {
    isSuccess: false,
    code: 3000,
    message: "JWT 토큰 검증 실패",
  },
  TOKEN_VERIFICATION_SUCCESS: {
    isSuccess: true,
    code: 1001,
    message: "JWT 토큰 검증 성공",
  }, // ?

  //Request error
  SIGNUP_PHONENUM_EMPTY: {
    isSuccess: false,
    code: 2001,
    message: "휴대폰 번호를 입력해주세요.",
  },
  SIGNUP_PHONENUM_ERROR_TYPE: {
    isSuccess: false,
    code: 2002,
    message: "휴대폰 번호는 숫자만 입력하세요.",
  },
  SIGNUP_AUTH_EMPTY: {
    isSuccess: false,
    code: 2003,
    message: "인증번호를 입력하세요.",
  },
  SIGNUP_AUTH_NOT_MATCH: {
    isSuccess: false,
    code: 2004,
    message: "인증번호가 올바르지 않습니다.",
  },
  USER_ID_IS_EMPTY: {
    isSuccess: false,
    code: 2005,
    message: "userId값이 입력되지 않았습니다.",
  },
  USER_ID_NOT_MATCH: {
    isSuccess: false,
    code: 2006,
    message: "userId가 적절하지 않습니다.",
  },
  USER_IS_NOT_EXIST: {
    isSuccess: false,
    code: 2007,
    message: "존재하지 않는 유저입니다.",
  },
  USER_STATUS_IS_NOT_VALID: {
    isSuccess: false,
    code: 2008,
    message: "조회할 수 없는 유저입니다.",
  },
  LOCATION_IS_NOT_EXIST: {
    isSuccess: false,
    code: 2009,
    message: "존재하지 않는 지역입니다.",
  },
  MERCHANDISE_IS_NOT_EXIST: {
    isSuccess: false,
    code: 2010,
    message: "존재하지 않는 상품입니다.",
  },
  MERCHANDISE_IS_DELETED: {
    isSuccess: false,
    code: 2011,
    message: "삭제된 상품입니다.",
  },
  CATEGORY_IS_NOT_EXIST: {
    isSuccess: false,
    code: 2012,
    message: "존재하지 않는 카테고리입니다.",
  },
  CREATE_AFTER_3_DAYS: {
    isSuccess: false,
    code: 2013,
    message: "생성일로부터 3일 이후에 끌어올리기가 가능합니다.",
  },
  PULL_UP_IMPOSSIBLE: {
    isSuccess: false,
    code: 2014,
    message: "끌어올리기를 한지 3일이 지나지 않았습니다.",
  },
  USERID_IS_NOT_HOST: {
    isSuccess: false,
    code: 2015,
    message: "해당 상품에 접근할 수 없습니다.",
  },
  MANNER_IS_NOT_EXIST: {
    isSuccess: false,
    code: 2016,
    message: "존재하지 않는 매너가 포함되어 있습니다.",
  },
  BADGE_IS_NOT_EXIST: {
    isSuccess: false,
    code: 2017,
    message: "존재하지 않는 배지 입니다.",
  },
  BADGE_IS_NOT_GOLD: {
    isSuccess: false,
    code: 2018,
    message: "황금배지만 대표배지로 설정할 수 있습니다.",
  },
  BADGE_IS_NOT_ACHEIVED: {
    isSuccess: false,
    code: 2019,
    message: "획득하지 못한 배지입니다.",
  },
  BADGE_IS_ALREADY_MAIN: {
    isSuccess: false,
    code: 2020,
    message: "해당 배지는 이미 대표 배지로 설정되어 있습니다.",
  },

  // Response error
  MODIFY_REDUNDANT_NICKNAME: {
    isSuccess: false,
    code: 3001,
    message: "이미 존재하는 닉네임입니다.",
  },

  //Connection, Transaction 등의 서버 오류
  DB_ERROR: { isSuccess: false, code: 4000, message: "데이터 베이스 에러" },
  SERVER_ERROR: { isSuccess: false, code: 4001, message: "서버 에러" },
};
