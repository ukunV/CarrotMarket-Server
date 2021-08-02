// 후기 상태 변경
async function selectNotice(connection, userId) {
  const query = `
                select title, contents,
                      case
                          when timestampdiff(year, createdAt, now()) > 0
                              then concat(timestampdiff(year, createdAt, now()), '년 전')
                          when timestampdiff(month, createdAt, now()) > 0
                              then concat(timestampdiff(month, createdAt, now()), '개월 전')
                          when timestampdiff(day, createdAt, now()) between 29 and 30
                              then '4주 전'
                          when timestampdiff(day, createdAt, now()) between 21 and 28
                              then '3주 전'
                          when timestampdiff(day, createdAt, now()) between 14 and 20
                              then '2주 전'
                          when timestampdiff(day, createdAt, now()) between 7 and 13
                              then '1주 전'
                          when hour(timediff(createdAt, now())) > 0
                              then concat(hour(timediff(createdAt, now())), '시간 전')
                          when minute(timediff(createdAt, now())) > 0
                              then concat(minute(timediff(createdAt, now())), '분 전')
                          when second(timediff(createdAt, now())) > 0
                              then concat(second(timediff(createdAt, now())), '초 전')
                      end as created
                from Notice
                where type = 1
                or locationId = (select locationId from User where id = ?)
                or userId = ?
                and isDeleted = 1
                order by createdAt desc;
                `;

  const row = await connection.query(query, [userId, userId]);

  return row[0];
}

module.exports = {
  selectNotice,
};
