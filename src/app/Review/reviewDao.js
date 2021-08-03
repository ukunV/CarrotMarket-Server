// 후기 조회
async function selectReview(connection, selectedId) {
  const query = `
                select u.nickname, u.photoURL, r.contents,
                      concat(l.address1, ' ', l.address2, ' ', l.address3) as address,
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
                      right join Review r on r.authorId = u.id
                      left join Location l on u.locationId = l.id
                where r.userId = ?
                and r.isDeleted = 1
                order by r.createdAt;
                `;

  const row = await connection.query(query, selectedId);

  return row[0];
}

// 후기 등록
async function insertReview(connection, params) {
  const query = `
                insert into Review (userId, authorId, contents)
                values (?, ?, ?);
                `;

  const row = await connection.query(query, params);

  return row[0];
}

// 후기 상태 변경
async function updateReviewStatus(connection, reviewId) {
  const query = `
                update Review
                set isDeleted = 0
                where id = ?
                `;

  const row = await connection.query(query, reviewId);

  return row[0]["info"];
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
  selectReview,
  insertReview,
  updateReviewStatus,
  checkUserExist,
};
