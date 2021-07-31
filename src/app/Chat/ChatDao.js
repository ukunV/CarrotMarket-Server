// 채팅방 목록 조회
async function selectChatRoom(connection, userId) {
  const query = `
                select u.photoURL, u.nickname, cm.contents, mi.imageURL,
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

  return row[0];
}

module.exports = {
  selectChatRoom,
};
