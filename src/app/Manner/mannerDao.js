// 받은 매너 조회 by userId
async function selectManner(connection, selectedId) {
  const query = `
                select m.title, count(*) as count, m.status
                from Manner m		
                      left join MannerAcheived ma on m.id = ma.mannerId
                where ma.userId = ?
                group by m.title;
                `;

  const row = await connection.query(query, selectedId);

  return row[0];
}

// 획득 매너 추가
async function insertManner(connection, selectedId, mannerId_arr) {
  let insertCount = 0;

  for (let i = 0; i < mannerId_arr.length; i++) {
    const query = `
                insert into MannerAcheived(userId, mannerId)
                values (?, ?);
                `;

    const row = await connection.query(query, [selectedId, mannerId_arr[i]]);

    if (row[0].affectedRows === 1) {
      insertCount += 1;
    }
  }
  const row = { arrayCount: mannerId_arr.length, insertCount };

  return row;
}

// 유저 존재 여부 check
async function checkUserExist(connection, selectedId) {
  const query = `
                select exists(select id from User where id = ?) as exist;
                `;

  const row = await connection.query(query, selectedId);

  return row[0][0]["exist"];
}

// 매너 존재 여부 check
async function checkMannerExist(connection, mannerId_arr) {
  for (let i = 0; i < mannerId_arr.length; i++) {
    const query = `
                  select exists(select id from Manner where id = ?) as exist;
                  `;

    const row = await connection.query(query, mannerId_arr[i]);

    if (row[0][0]["exist"] === 0) return 0;
  }

  return 1;
}

module.exports = {
  selectManner,
  insertManner,
  checkUserExist,
  checkMannerExist,
};
