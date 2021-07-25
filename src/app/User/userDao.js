// 휴대폰 번호 체크
async function selectUserPhoneNum(connection, hashedPhoneNum) {
  const query = `
    select exists(select userPhoneNum from User where userPhoneNum = ?) as exist;
    `;

  const [row] = await connection.query(query, hashedPhoneNum);
  return row;
}

// 닉네임 체크
async function selectUserNickname(connection, nickname) {
  const query = `
    select exists(select nickname from User where nickname = ?) as exist;
    `;

  const [row] = await connection.query(query, nickname);
  return row;
}

// 회원가입
async function insertUserInfo(connection, params) {
  const query = `
        insert into User(userPhoneNum, nickname)
        values (?, ?);
    `;
  const row = await connection.query(query, params);

  return row;
}

// 유저 ID 조회
async function selectUserInfo(connection, hashedPhoneNum) {
  const query = `
                select id
                from User
                where userPhoneNum = ?;
                `;
  const [row] = await connection.query(query, hashedPhoneNum);
  return row;
}

// 유저 정보 수정
async function updateUserByUserId(connection, params) {
  const query = `
                update User 
                set photoURL = ?, nickname = ?
                where id = ?;
                `;
  const row = await connection.query(query, params);
  return row;
}

module.exports = {
  selectUserPhoneNum,
  selectUserNickname,
  insertUserInfo,
  selectUserInfo,
  updateUserByUserId,
};
