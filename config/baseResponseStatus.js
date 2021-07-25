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
  USER_ID_NOT_MATCH: {
    isSuccess: false,
    code: 2005,
    message: "유저 아이디 값을 확인해주세요",
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
