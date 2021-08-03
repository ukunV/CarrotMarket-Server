// 획득 배지 조회
async function selectBadge(connection, selectedId) {
  const query = `
                select b.badgeImageURL, b.badgeName, ba.mainBadge
                from Badge b	
                      left join BadgeAcheived ba on b.id = ba.badgeId
                where ba.userId = ?;
                `;

  const row = await connection.query(query, selectedId);

  return row[0];
}

// 유저 존재 여부 check
async function checkUserExist(connection, id) {
  const query = `
                select exists(select id from User where id = ?) as exist;
                `;

  const row = await connection.query(query, id);

  return row[0][0]["exist"];
}

// 배지 존재 여부 check
async function checkBadgeExist(connection, badgeId) {
  const query = `
                select exists(select id from Badge where id = ?) as exist;
                `;

  const row = await connection.query(query, badgeId);

  return row[0][0]["exist"];
}

// 배지 상세내용 조회
async function getBadgeDetail(connection, badgeId) {
  const query = `
                select badgeName, badgeImageURL, badgeDescription,
                      concat(round(((select count(*) from BadgeAcheived where badgeId = ?) / (select count(*) from User)), 2), '% 사용자가 획득했어요') as acheiveRate
                from Badge
                where id = ?;
                `;

  const row = await connection.query(query, [badgeId, badgeId]);

  return row[0];
}

// 황금배지 여부 check
async function checkIsGold(connection, badgeId) {
  const query = `
                select goldBadge
                from Badge
                where id = ?;
                `;

  const row = await connection.query(query, badgeId);

  return row[0][0]["goldBadge"];
}

// 배지 획득 여부 check
async function checkIsAcheived(connection, params) {
  const query = `
                select exists(select id from BadgeAcheived where userId = ? and badgeId = ?) as exist;
                `;

  const row = await connection.query(query, params);

  return row[0][0]["exist"];
}

// 대표 배지 설정 여부 check
async function checkAlreadyMain(connection, params) {
  const query = `
                select exists(select id from BadgeAcheived where mainBadge = 1 and userId = ? and badgeId = ?) as exist;
                `;

  const row = await connection.query(query, params);

  return row[0][0]["exist"];
}

// 대표 배지 변경
async function updateMainBadge(connection, userId, badgeId) {
  const query1 = `
                  update BadgeAcheived
                  set mainBadge = 0
                  where userId = ?;
                  `;

  const query2 = `
                  update BadgeAcheived
                  set mainBadge = 1
                  where userId = ?
                  and badgeId = ?;
                  `;

  const row1 = await connection.query(query1, userId);
  const deleteMainQuery = row1[0].changedRows;

  const row2 = await connection.query(query2, [userId, badgeId]);
  const updateMainQuery = row2[0].changedRows;

  const result = { deleteMainQuery, updateMainQuery };

  return result;
}

module.exports = {
  selectBadge,
  checkUserExist,
  checkBadgeExist,
  getBadgeDetail,
  checkIsGold,
  checkIsAcheived,
  updateMainBadge,
  checkAlreadyMain,
};
