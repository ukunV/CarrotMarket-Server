// 받은 매너 조회 by userId
async function selectMannerByUserId(connection, userId) {
  const query = `
                select m.title, count(*) as count, m.status
                from Manner m		
                      left join MannerAcheived ma on m.id = ma.mannerId
                where ma.userId = ?
                group by m.title;
                `;

  const [rows] = await connection.query(query, userId);
  return rows;
}

// 획득 매너 추가
async function insertMannerAcheived(connection, params) {
  const query = `
                insert into MannerAcheived(userId, mannerId)
                values (?, ?);
                `;

  const [rows] = await connection.query(query, params);
  return rows;
}

module.exports = {
  selectMannerByUserId,
  insertMannerAcheived,
};
