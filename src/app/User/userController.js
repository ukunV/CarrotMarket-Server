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

// 랜덤 닉네임 생성 함수
function createCode(numeric, alphabet) {
  let randomStr = "";

  for (let j = 0; j < 5; j++) {
    randomStr += alphabet[Math.floor(Math.random() * alphabet.length)];
  }

  for (let j = 0; j < 5; j++) {
    randomStr += numeric[Math.floor(Math.random() * numeric.length)];
  }

  return randomStr;
}

// Regex
const regPhoneNum = /^\d{3}\d{3,4}\d{4}$/;

/**
 * API No. 1
 * API Name : 로그인 API (비회원일 경우 회원가입 후 로그인)
 * [POST] /login
 */
exports.createUser = async function (req, res) {
  // Request Body
  const { userPhoneNum, auth } = req.body;

  // Request Error Check
  if (!userPhoneNum)
    return res.send(errResponse(baseResponse.SIGNUP_PHONENUM_EMPTY)); // 2001

  if (!regPhoneNum.test(userPhoneNum))
    return res.send(errResponse(baseResponse.SIGNUP_PHONENUM_ERROR_TYPE)); // 2002

  if (!auth) return res.send(errResponse(baseResponse.SIGNUP_AUTH_EMPTY)); // 2003

  if (auth !== 1234)
    // 인증번호 api 구현 전
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

    const nickname = createCode(numeric, alphabet);
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

  const checkExist = await userProvider.checkExist(selectedId);

  if (checkExist === 0)
    return res.send(errResponse(baseResponse.USER_IS_NOT_EXIST)); // 2007

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
