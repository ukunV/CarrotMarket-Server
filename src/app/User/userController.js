const jwtMiddleware = require("../../../config/jwtMiddleware");
const secret_config = require("../../../config/secret");
const userProvider = require("../../app/User/userProvider");
const userService = require("../../app/User/userService");
const baseResponse = require("../../../config/baseResponseStatus");
const { response, errResponse } = require("../../../config/response");

const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const regexEmail = require("regex-email");
const { emit } = require("nodemon");

const { NCPClient } = require("../../../config/ncp_client");
const sensKey = require("../../../config/ncp_config").sensSecret;

// Regex
const regPhoneNum = /^\d{3}\d{3,4}\d{4}$/;
const regNum = /^[0-9]/g;

// 랜덤 닉네임 생성 함수
function createNickname(numeric, alphabet) {
  let randomStr = "";

  for (let j = 0; j < 5; j++) {
    randomStr += alphabet[Math.floor(Math.random() * alphabet.length)];
  }

  for (let j = 0; j < 5; j++) {
    randomStr += numeric[Math.floor(Math.random() * numeric.length)];
  }

  return randomStr;
}

// 랜덤 인증번호 생성 함수
function createAuthNum() {
  const randNum = Math.floor(Math.random() * 9000) + 1000;

  return randNum;
}

/**
 * API No. 1
 * API Name : 로그인 API (비회원일 경우 회원가입 후 로그인)
 * [POST] /user/login
 */
exports.createUser = async function (req, res) {
  const { userPhoneNum } = req.body;

  const sendAuth = createAuthNum();

  // 전화번호 입력 후 인증번호 입력 구현 방법 (수정필요)
  const ncp = new NCPClient({
    ...sensKey,
  });

  const to = userPhoneNum;
  const content = `[당근마켓] 인증번호 [${sendAuth}]`;

  const { success, status, msg } = await ncp.sendSMS({
    to,
    content,
  });

  if (!success) {
    console.log(
      `(ERROR) node-sens error: ${msg}, Status ${status} Date ${Date.now()}`
    );
    res.send("SMS 전송 중 오류가 발생했습니다.");
  }

  // Request Error Check
  if (!userPhoneNum)
    return res.send(errResponse(baseResponse.SIGNUP_PHONENUM_EMPTY)); // 2001

  if (!regPhoneNum.test(userPhoneNum))
    return res.send(errResponse(baseResponse.SIGNUP_PHONENUM_ERROR_TYPE)); // 2002

  if (!bodyAuth) return res.send(errResponse(baseResponse.SIGNUP_AUTH_EMPTY)); // 2003

  if (!regNum.test(bodyAuth))
    return res.send(errResponse(baseResponse.AUTH_NUM_FORM_IS_NOT_CORRECT)); // 2037

  if (bodyAuth !== sendAuth)
    return res.send(errResponse(baseResponse.SIGNUP_AUTH_NOT_MATCH)); // 2004

  // 휴대폰 번호 암호화
  const hashedPhoneNum = await crypto
    .createHash("sha512")
    .update(userPhoneNum)
    .digest("hex");

  const checkPhoneNum = await userProvider.phoneNumCheck(hashedPhoneNum);

  // 이미 회원가입이 되어있는 회원일 경우 로그인
  if (checkPhoneNum[0].exist === 1) {
    const userIdx = await userProvider.getUserId(hashedPhoneNum);

    //토큰 생성 Service
    const token = await jwt.sign(
      {
        userId: userIdx[0].id,
      }, // 토큰의 내용(payload)
      secret_config.jwtsecret, // 비밀키
      {
        expiresIn: "365d",
        subject: "userInfo",
      } // 유효 기간 365일
    );

    return res.send(
      response(baseResponse.SUCCESS, { userId: userIdx[0].id, jwt: token })
    );
  }

  // nickname 겹치지 않을 때 까지
  while (true) {
    const numeric = `0,1,2,3,4,5,6,7,8,9`.split(",");
    const alphabet = `a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,
       A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z`.split(",");

    const nickname = createNickname(numeric, alphabet);
    const checkUserNickname = await userProvider.nicknameCheck(nickname);

    // 회원가입 후 바로 로그인
    if (checkUserNickname[0].exist === 0) {
      await userService.createUser(hashedPhoneNum, nickname);

      const userIdx = await userProvider.getUserId(hashedPhoneNum);

      const token = await jwt.sign(
        {
          userId: userIdResult[0].insertId,
        }, // 토큰의 내용(payload)
        secret_config.jwtsecret, // 비밀키
        {
          expiresIn: "365d",
          subject: "userInfo",
        } // 유효 기간 365일
      );

      return res.send(
        response(baseResponse.SUCCESS, { userId: userIdx[0].id, jwt: token })
      );
    }
  }
};

/**
 * API No. 2
 * API Name : 나의 당근 조회 API
 * [GET] /user/my-carrot
 */

exports.getMyCarrot = async function (req, res) {
  const { userId } = req.verifiedToken;
  const { bodyId } = req.body;

  // Request Error
  if (!userId) return res.send(errResponse(baseResponse.ID_NOT_MATCHING)); // 2005

  if (userId !== bodyId)
    return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH)); // 2006

  const checkUserExist = userProvider.checkUserExist(userId);

  if (checkUserExist === 0)
    return res.send(errResponse(baseResponse.USER_IS_NOT_EXIST)); // 2026

  const result = await userProvider.getMyCarrot(userId);

  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 3
 * API Name : 회원 프로필 조회 API
 * [GET] /user/:selectedId/profile
 * Path Variable : selectedId
 */
exports.getUserProfile = async function (req, res) {
  const { userId } = req.verifiedToken;
  const { bodyId } = req.body;

  const { selectedId } = req.params;

  // Request Error
  if (!userId) return res.send(errResponse(baseResponse.ID_NOT_MATCHING)); // 2005

  if (userId !== bodyId)
    return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH)); // 2006

  const checkUserExist = userProvider.checkUserExist(userId);

  if (checkUserExist === 0)
    return res.send(errResponse(baseResponse.USER_IS_NOT_EXIST)); // 2026

  if (!regNum.test(selectedId) || selectedId < 1)
    return res.send(errResponse(baseResponse.SELECT_ID_FORM_IS_NOT_CORRECT)); // 2031

  const checkSelectedIdExist = await userProvider.checkUserExist(selectedId);

  if (checkSelectedIdExist === 0)
    return res.send(errResponse(baseResponse.SELECTED_USER_IS_NOT_EXIST)); // 2007

  const checkStatus = await userProvider.checkStatus(selectedId);

  if (checkStatus !== 1)
    return res.send(errResponse(baseResponse.USER_STATUS_IS_NOT_VALID)); // 2008

  const result = await userProvider.getUserProfile(selectedId);

  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 4
 * API Name : 회원 프로필 수정 API
 * [PATCH] /user/profile
 */
exports.updateUserProfile = async function (req, res) {
  const { userId } = req.verifiedToken;
  const { bodyId, photoURL, nickname } = req.body;

  // Request Error
  if (!userId) return res.send(errResponse(baseResponse.ID_NOT_MATCHING)); // 2005

  if (userId !== bodyId)
    return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH)); // 2006

  const checkUserExist = userProvider.checkUserExist(userId);

  if (checkUserExist === 0)
    return res.send(errResponse(baseResponse.USER_IS_NOT_EXIST)); // 2026

  // Response Error
  const checkUserNickname = await userProvider.nicknameCheck(nickname);

  if (checkUserNickname[0].exist === 1)
    res.send(errResponse(baseResponse.MODIFY_REDUNDANT_NICKNAME)); // 3001

  const result = await userService.updateUserProfile(
    photoURL,
    nickname,
    userId
  );

  return res.send(response(baseResponse.SUCCESS, result[0]["info"]));
};

/** JWT 토큰 검증 API
 * [GET] /app/auto-login
 */
// exports.check = async function (req, res) {
//   const userIdResult = req.verifiedToken.userId;
//   console.log(userIdResult);
//   return res.send(response(baseResponse.TOKEN_VERIFICATION_SUCCESS));
// };
