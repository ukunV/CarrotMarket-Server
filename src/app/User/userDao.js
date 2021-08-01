// 휴대폰 번호 체크
async function selectUserPhoneNum(connection, hashedPhoneNum) {
  const query = `
    select exists(select userPhoneNum from User where userPhoneNum = ?) as exist;
    `;

  const row = await connection.query(query, hashedPhoneNum);

  return row[0];
}

// 닉네임 체크
async function selectUserNickname(connection, nickname) {
  const query = `
    select exists(select nickname from User where nickname = ?) as exist;
    `;

  const row = await connection.query(query, nickname);

  return row[0];
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
async function selectUserId(connection, hashedPhoneNum) {
  const query = `
                select id
                from User
                where userPhoneNum = ?;
                `;

  const row = await connection.query(query, hashedPhoneNum);

  return row[0];
}

// 유저 정보 수정
async function updateUserProfile(connection, params) {
  const query = `
                update User 
                set photoURL = ?, nickname = ?
                where id = ?;
                `;

  const row = await connection.query(query, params);

  return row;
}

// 나의 당근 조회
async function selectMyCarrot(connection, userId) {
  const query = `
                select photoURL, nickname, concat('#', id) as id
                from User
                where id = ?
                `;

  const row = await connection.query(query, userId);

  return row[0];
}

// 회원 프로필 조회
async function selectUserProfile(connection, selectedId) {
  const query1 = `
                  select u.nickname, u.photoURL, concat('#', u.id) as id,
                        concat(u.mannerTemperature, '°C') as mannerTemperature,
                        concat(u.hopeRate, '%') as hopeRate, concat(u.responseRate, '%') as responseRate,
                        ifnull(ba.count, 0) as badgeCount, ifnull(m.count, 0) as merchandiseCount
                  from User u
                        left join (select userId, count(userId) as count from BadgeAcheived group by userId) as ba on u.id = ba.userId
                        left join (select userId, count(userId) as count from Merchandise group by userId) as m on u.id = m.userId
                  where u.id = ?;
                  `;

  const query2 = `
                  select m.title, count(ma.mannerId) as mannerCount
                  from Manner m
                        left join MannerAcheived ma on m.id = ma.mannerId
                  where ma.userId = ?
                  and m.status = 1
                  group by ma.mannerId
                  order by ma.mannerId
                  limit 3;
                  `;

  const query3 = `
                  select u.photoURL as authorPhotoURL, u.nickname as authorNickname, r.contents,
                        case
                            when ul.address1 != l.address1
                                then concat(l.address1, ' ', l.address2, ' ', l.address3)
                            when ul.address2 != l.address2
                                then concat(l.address2, ' ', l.address3)
                            else
                                l.address3
                        end as address,
                        case
                            when timestampdiff(year, r.createdAt, now()) > 0
                                then concat(timestampdiff(year, r.createdAt, now()), '년 전')
                            when timestampdiff(month, r.createdAt, now()) > 0
                                then concat(timestampdiff(month, r.createdAt, now()), '달 전')
                            when timestampdiff(day, r.createdAt, now()) > 0
                                then concat(timestampdiff(day, r.createdAt, now()), '일 전')
                            when hour(timediff(r.createdAt, now())) > 0
                                then concat(hour(timediff(r.createdAt, now())), '시간 전')
                            when minute(timediff(r.createdAt, now())) > 0
                                then concat(minute(timediff(r.createdAt, now())), '분 전')
                            when second(timediff(r.createdAt, now())) > 0
                                then concat(second(timediff(r.createdAt, now())), '초 전')
                        end as createdAt
                  from User u
                        left join Review r on u.id = r.authorId
                        left join Location l on u.locationId = l.id,
                      User uu
                        left join Review ur on uu.id = ur.userId
                        left join Location ul on uu.locationId = ul.id
                  where r.id is not null
                  and ur.id is not null
                  and r.userId = ?
                  group by r.id
                  order by ur.createdAt
                  limit 3;
                  `;

  const result1 = await connection.query(query1, selectedId);
  const result2 = await connection.query(query2, selectedId);
  const result3 = await connection.query(query3, selectedId);

  const information = JSON.parse(JSON.stringify(result1[0]));
  const manner = JSON.parse(JSON.stringify(result2[0]));
  const review = JSON.parse(JSON.stringify(result3[0]));

  const row = { information, manner, review };

  return row;
}

// 유저 존재 여부 check
async function checkExist(connection, selectedId) {
  const query = `
        select exists(select id from User where id = ?) as exist;
                `;

  const row = await connection.query(query, selectedId);

  return row[0][0]["exist"];
}

// 유저 상태 check
async function checkStatus(connection, selectedId) {
  const query = `
                select status
                from User
                where id = ?
                `;

  const row = await connection.query(query, selectedId);

  return row[0][0]["status"];
}

module.exports = {
  selectUserPhoneNum,
  selectUserNickname,
  insertUserInfo,
  selectUserId,
  updateUserProfile,
  selectMyCarrot,
  selectUserProfile,
  checkExist,
  checkStatus,
};
