// 후기 조회
async function selectReviewByUserId(connection, userId) {
  const query = `
                select u.nickname, u.photoURL, r.contents, concat(address2, ' ', address3) as address,
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
                and r.isDeleted = 1;
                `;

  const [row] = await connection.query(query, userId);
  return row;
}

// 후기 등록
async function insertReview(connection, params) {
  const query = `
                insert into Review (userId, authorId, contents)
                values (?, ?, ?);
                `;

  const [row] = connection.query(query, params);
  return row;
}

module.exports = {
  selectReviewByUserId,
};
