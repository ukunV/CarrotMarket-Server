// 획득한 배지 조회
async function selectBadgeByUserId(connection, userId) {
  const query = `
                select b.badgeImageURL, b.badgeName, ba.mainBadge
                from Badge b	
                      left join BadgeAcheived ba on b.id = ba.badgeId
                where ba.userId = ?;
                `;

  const [row] = await connection.query(query, userId);
  return row;
}

// 배지 상세내용 조회
async function selectBadgeDescriptionByBadgeId(connection, badgeId) {
  const query = `
                select badgeName, badgeImageURL, badgeDescription
                from Badge
                where id = ?;
                `;

  const [row] = await connection.query(query, badgeId);
  return row;
}

// 획득 배지 추가
async function insertBadgeAcheived(connection, params) {
  const query = `
                insert into BadgeAcheived(badgeId, userId)
                values (?, ?);
                `;

  const [row] = await connection.query(query, params);
  return row;
}

// 대표 배지 변경
async function updateMainBadge(connection, userId, badgeId) {
  const query_1 = `
                  update BadgeAcheived
                  set mainBadge = 0
                  where userId = ?;
                  `;

  const query_2 = `
                  update BadgeAcheived
                  set mainBadge = 1
                  where badgeId = ?;
                  `;

  const [row1] = await connection.query(query_1, userId);
  const [row2] = await connection.query(query_2, badgeId);
  return row1.concat(row2);
}

module.exports = {
  selectBadgeByUserId,
  selectBadgeDescriptionByBadgeId,
  insertBadgeAcheived,
  updateMainBadge,
};
