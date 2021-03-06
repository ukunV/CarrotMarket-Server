// 채팅방 목록 조회
async function selectChatRoomList(connection, userId) {
  const query = `
                select u.photoURL, u.nickname, cm.contents, mi.imageURL,
                      case
                          when userOneId = uu.id
                              then userOneIsDeleted
                          when userTwoId = uu.id
                              then userTwoIsDeleted
                      end as isDeleted,
                      case
                          when datediff(now(), cr.updatedAt) > 364
                              then concat(DATE_FORMAT(cr.updatedAt, '%y'), '년 ',DATE_FORMAT(cr.updatedAt, '%m'), '월 ', DATE_FORMAT(cr.updatedAt, '%d'), '일')
                          when datediff(now(), cr.updatedAt) > 0
                              then concat(DATE_FORMAT(cr.updatedAt, '%m'), '월 ', DATE_FORMAT(cr.updatedAt, '%d'), '일')
                          when instr(DATE_FORMAT(cr.updatedAt, '%Y-%m-%d %p %h:%i'), 'PM') > 0
                              THEN replace(DATE_FORMAT(cr.updatedAt, '%p %h:%i'), 'PM', '오후')
                          else
                              replace(DATE_FORMAT(cr.updatedAt, '%p %h:%i'), 'AM', '오전')
                      end as updatedAt,
                      case
                          when ul.address1 != l.address1
                              then concat(l.address1, ' ', l.address2, ' ', l.address3)
                          when ul.address2 != l.address2
                              then concat(l.address2, ' ', l.address3)
                          else
                              l.address3
                      end as address
                from User u
                      left join Location l on u.locationId = l.id
                      left join ChatRoom cr on u.id = cr.userOneId or u.id = cr.userTwoId
                      left join Merchandise m on cr.merchandiseId = m.id
                      left join MerchandiseImage mi on m.id = mi.merchandiseId
                      left join ChatMessage cm on cr.id = cm.roomId,
                    User uu
                      left join Location ul on uu.locationId = ul.id
                where (mi.number = 1 or mi.number is null)
                and cr.updatedAt = cm.createdAt
                and u.id != ?
                and uu.id = ?
                and (cr.userOneId = ? or cr.userTwoId = ?)
                order by cr.updatedAt desc;
                `;

  const row = await connection.query(query, [userId, userId, userId, userId]);

  console.log(row[0].length);

  let result = [];

  // 채팅방을 조회하는 유저가 해당 채팅방을 삭제했는지 확인
  for (let i = 0; i < row[0].length; i++) {
    if (row[0][i]["isDeleted"] === 1) result.push(row[0][i]);
  }

  return result;
}

// 채팅방 존재 여부 check
async function checkRoomExist(connection, roomId) {
  const query = `
                select exists(select id from ChatRoom where id = ?) as exist;
                `;

  const row = await connection.query(query, roomId);

  return row[0][0]["exist"];
}

// 채팅 전송
async function createChat(connection, roomId, userId, contents) {
  const query1 = `
                insert into ChatMessage (roomId, authorId, contents)
                values (?, ?, ?);
                `;

  const row1 = await connection.query(query1, [roomId, userId, contents]);

  const query2 = `
                update ChatRoom
                set updatedAt = (select createdAt
                                from ChatMessage
                                where id = (select max(id) from ChatMessage)),
                    userOneIsDeleted = 1,
                    userTwoIsDeleted = 1
                where id = ?
                `;
  // userOneIsDeleted = 1, userTwoIsDeleted = 1
  // -> 삭제한 채팅방을 새로운 채팅으로 인해 재 생성

  await connection.query(query2, roomId);

  return row1[0];
}

// 채팅방 존재 여부 check
async function checkRoomMember(connection, roomId, userId) {
  const query = `
                select exists(select id
                                from ChatRoom
                                where id = ?
                                and (userOneId = ? or userTwoId = ?)) as exist;
                `;

  const row = await connection.query(query, [roomId, userId, userId]);

  return row[0][0]["exist"];
}

// 채팅방 조회
async function selectChatRoom(connection, roomId) {
  const query = `
                select u.id, u.nickname, u.photoURL,
                      concat(u.mannerTemperature, '°C') as mannerTemperature, cm.contents,
                      DATE_FORMAT(cm.createdAt, '%Y년 %m월 %d일') as createdDate,
                      case
                          when instr(DATE_FORMAT(cm.createdAt, '%p %h:%i'), 'PM') > 0
                          then replace(DATE_FORMAT(cm.createdAt, '%p %h:%i'), 'PM', '오후')
                      else
                          replace(DATE_FORMAT(cm.createdAt, '%p %h:%i'), 'AM', '오전')
                      end as createdTime,
                      m.title, m.price,
                      case
                          when m.status = 0
                              then '예약중'
                          when m.status = 1
                              then '거래중'
                          when m.status = 2
                              then '거래완료'
                          when m.status = 3
                              then '거래중지'
                      end as status
                from ChatRoom cr
                      left join ChatMessage cm on cr.id = cm.roomId
                      left join User u on cm.authorId = u.id
                      left join Merchandise m on m.id = cr.merchandiseId
                where cm.roomId = ?
                order by cm.createdAt;
                `;

  const row = await connection.query(query, roomId);

  return row[0];
}

// 채팅방 삭제
async function deleteChatRoom(connection, roomId, userId) {
  const query1 = `
                  select userOneId, userTwoId
                  from ChatRoom
                  where id = ?;
                  `;

  const row1 = await connection.query(query1, roomId);

  let result = [];

  if (row1[0][0]["userOneId"] === userId) {
    const query2 = `
                  update ChatRoom
                  set userOneIsDeleted = 0
                  where id = ?
                  `;

    const row2 = await connection.query(query2, roomId);
    result = row2[0].info;
  } else {
    const query2 = `
                  update ChatRoom
                  set userTwoIsDeleted = 0
                  where id = ?
                  `;

    const row2 = await connection.query(query2, roomId);
    result = row2[0].info;
  }

  return result;
}

// 유저 존재 여부 check
async function checkUserExist(connection, id) {
  const query = `
        select exists(select id from User where id = ?) as exist;
                `;

  const row = await connection.query(query, id);

  return row[0][0]["exist"];
}

module.exports = {
  selectChatRoomList,
  checkRoomExist,
  createChat,
  checkRoomMember,
  selectChatRoom,
  deleteChatRoom,
  checkUserExist,
};
