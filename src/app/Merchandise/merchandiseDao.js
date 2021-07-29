// 지역 존재 여부 check
async function checkLocationExist(connection, locationId) {
  const query = `
                    select exists(select id from Location where id = ?) as exist;
                      `;

  const row = await connection.query(query, locationId);

  return row[0][0]["exist"];
}

// 동네별 최신수 판매 상품 조회
async function selectAllMerchandise(connection, locationId) {
  const query = `
                select m.title, mi.imageURL, l.address3 as address, m.price, ifnull(lc.likeCount, 0) as likeCount,
                        case
                            when timestampdiff(year, m.pulledUpAt, now()) > 0 and m.pulledUpCount > 0
                                then concat('끌올', timestampdiff(year, m.pulledUpAt, now()), '년 전')
                            when timestampdiff(year, m.createdAt, now()) > 0
                                then concat(timestampdiff(year, m.createdAt, now()), '년 전')
                            when timestampdiff(month, m.pulledUpAt, now()) > 0 and m.pulledUpCount > 0
                                then concat('끌올', timestampdiff(month, m.pulledUpAt, now()), '달 전')
                            when timestampdiff(month, m.createdAt, now()) > 0
                                then concat(timestampdiff(month, m.createdAt, now()), '달 전')
                            when timestampdiff(day, m.pulledUpAt, now()) > 0 and m.pulledUpCount > 0
                                then concat('끌올', timestampdiff(day, m.pulledUpAt, now()), '일 전')
                            when timestampdiff(day, m.createdAt, now()) > 0
                                then concat(timestampdiff(day, m.createdAt, now()), '일 전')
                            when hour(timediff(m.pulledUpAt, now())) > 0 and m.pulledUpCount > 0
                                then concat('끌올', hour(timediff(m.pulledUpAt, now())), '시간 전')
                            when hour(timediff(m.createdAt, now())) > 0
                                then concat(hour(timediff(m.createdAt, now())), '년 전')
                            when minute(timediff(m.pulledUpAt, now())) > 0 and m.pulledUpCount > 0
                                then concat('끌올', minute(timediff(m.pulledUpAt, now())), '분 전')
                            when minute(timediff(m.createdAt, now())) > 0
                                then concat(minute(timediff(m.createdAt, now())), '년 전')
                            when second(timediff(m.pulledUpAt, now())) > 0 and m.pulledUpCount > 0
                                then concat('끌올', second(timediff(m.pulledUpAt, now())), '초 전')
                            when second(timediff(m.createdAt, now())) > 0
                                then concat(second(timediff(m.createdAt, now())), '년 전')
                        end as createdAt
                from User u
                        right join Merchandise m on m.userId = u.id
                        left join (select id, merchandiseId, number, imageURL,
                                    ROW_NUMBER() over (PARTITION BY merchandiseId order by number) as rn
                                    from MerchandiseImage
                                    where isDeleted = 1) as mi on mi.merchandiseId = m.id
                        left join Location l on u.locationId = l.id
                        left join (select ml.id, count(ml.id) as likeCount
                                    from MerchandiseLike ml
                                    where ml.isDeleted = 1
                                    group by ml.merchandiseId) as lc on m.id = lc.id
                where l.id = ?
                and m.status = 1
                and m.isDeleted = 1
                and (mi.rn = 1 or mi.rn is null)
                order by coalesce(m.pulledUpAt, m.createdAt) desc;
                `;

  const row = await connection.query(query, locationId);

  return row[0];
}

// 상품 조회
async function selectMerchandise(connection, merchandiseId) {
  const query1 = `
                    select ROW_NUMBER() over (PARTITION BY merchandiseId order by number) as number, imageURL
                    from MerchandiseImage
                    where isDeleted = 1
                    and merchandiseId = ?;
                    `;

  const query2 = `
                    select u.nickname, l.address3 as address, u.mannerTemperature,
                            m.title, mc.categoryName, m.contents, m.price,
                            ifnull(lc.likeCount, 0) as likeCount,
                            ifnull(v.viewCount, 0) as viewCount,
                            case
                                when timestampdiff(year, m.pulledUpAt, now()) > 0 and m.pulledUpCount > 0
                                    then concat('끌올 ', timestampdiff(year, m.pulledUpAt, now()), '년 전')
                                when timestampdiff(year, m.createdAt, now()) > 0
                                    then concat(timestampdiff(year, m.createdAt, now()), '년 전')
                                when timestampdiff(month, m.pulledUpAt, now()) > 0 and m.pulledUpCount > 0
                                    then concat('끌올 ', timestampdiff(month, m.pulledUpAt, now()), '달 전')
                                when timestampdiff(month, m.createdAt, now()) > 0
                                    then concat(timestampdiff(month, m.createdAt, now()), '달 전')
                                when timestampdiff(day, m.pulledUpAt, now()) > 0 and m.pulledUpCount > 0
                                    then concat('끌올 ', timestampdiff(day, m.pulledUpAt, now()), '일 전')
                                when timestampdiff(day, m.createdAt, now()) > 0
                                    then concat(timestampdiff(day, m.createdAt, now()), '일 전')
                                when hour (timediff(m.pulledUpAt, now())) > 0 and m.pulledUpCount > 0
                                    then concat('끌올 ', hour(timediff(m.pulledUpAt, now())), '시간 전')
                                when hour(timediff(m.createdAt, now())) > 0
                                    then concat(hour(timediff(m.createdAt, now())), '년 전')
                                when minute(timediff(m.pulledUpAt, now())) > 0 and m.pulledUpCount > 0
                                    then concat('끌올 ', minute(timediff(m.pulledUpAt, now())), '분 전')
                                when minute(timediff(m.createdAt, now())) > 0
                                    then concat(minute(timediff(m.createdAt, now())), '년 전')
                                when second(timediff(m.pulledUpAt, now())) > 0 and m.pulledUpCount > 0
                                    then concat('끌올 ', second(timediff(m.pulledUpAt, now())), '초 전')
                                when second(timediff(m.createdAt, now())) > 0
                                    then concat(second(timediff(m.createdAt, now())), '년 전')
                            end as createdAt
                    from User u
                    left join Location l on u.locationId = l.id
                    left join Merchandise m on u.id = m.userId
                    left join MerchandiseCategory mc on mc.id = m.categoryId
                    left join (select ml.id, count(ml.id) as likeCount
                            from MerchandiseLike ml
                            where ml.isDeleted = 1
                            group by ml.merchandiseId) as lc on m.id = lc.id
                    left join (select mv.id, count(mv.id) as viewCount
                            from MerchandiseViews mv
                            group by mv.merchandiseId) as v on m.id = v.id
                    where m.id = ?;
                    `;

  const result1 = await connection.query(query1, merchandiseId);
  const result2 = await connection.query(query2, merchandiseId);
  const image = JSON.parse(JSON.stringify(result1[0]));
  const infomation = JSON.parse(JSON.stringify(result2[0]));
  const row = { image, infomation };

  return row;
}

// 상품 존재 여부 check
async function checkMerchandiseExist(connection, merchandiseId) {
  const query = `
                  select exists(select id from Merchandise where id = ?) as exist;
                    `;

  const row = await connection.query(query, merchandiseId);

  return row[0][0]["exist"];
}

// 상품 주인 여부 check
async function checkHost(connection, userId, merchandiseId) {
  const query = `
                select if(userId = ?, 'true', 'false') as host
                from Merchandise
                where id = ?;
                `;

  const row = await connection.query(query, [userId, merchandiseId]);

  return row[0][0]["host"];
}

// 상품 삭제 여부 check
async function checkMerchandiseIsDeleted(connection, merchandiseId) {
  const query = `
                select isDeleted
                from Merchandise
                where id = ?;
                `;

  const row = await connection.query(query, merchandiseId);

  return row[0][0]["isDeleted"];
}

// 전체 카테고리 조회
async function selectCategory(connection) {
  const query = `
                select id, categoryName
                from MerchandiseCategory;
                `;

  const row = await connection.query(query);

  return row[0];
}

// 카테고리 존재 여부 check
async function checkCategoryExist(connection, categoryId) {
  const query = `
                select exists(select id from MerchandiseCategory where id = ?) as exist;
                `;

  const row = await connection.query(query, categoryId);

  return row[0][0]["exist"];
}

// 카테고리별 최신순 판매상품 조회
async function selectCategoryMerchandise(connection, params) {
  const query = `
                   select m.title, mi.imageURL, l.address3 as address, m.price, ifnull(lc.likeCount, 0) as likeCount,
                          case
                              when timestampdiff(year, m.pulledUpAt, now()) > 0 and m.pulledUpCount > 0
                                  then concat('끌올', timestampdiff(year, m.pulledUpAt, now()), '년 전')
                              when timestampdiff(year, m.createdAt, now()) > 0
                                  then concat(timestampdiff(year, m.createdAt, now()), '년 전')
                              when timestampdiff(month, m.pulledUpAt, now()) > 0 and m.pulledUpCount > 0
                                  then concat('끌올', timestampdiff(month, m.pulledUpAt, now()), '달 전')
                              when timestampdiff(month, m.createdAt, now()) > 0
                                  then concat(timestampdiff(month, m.createdAt, now()), '달 전')
                              when timestampdiff(day, m.pulledUpAt, now()) > 0 and m.pulledUpCount > 0
                                  then concat('끌올', timestampdiff(day, m.pulledUpAt, now()), '일 전')
                              when timestampdiff(day, m.createdAt, now()) > 0
                                  then concat(timestampdiff(day, m.createdAt, now()), '일 전')
                              when hour(timediff(m.pulledUpAt, now())) > 0 and m.pulledUpCount > 0
                                  then concat('끌올', hour(timediff(m.pulledUpAt, now())), '시간 전')
                              when hour(timediff(m.createdAt, now())) > 0
                                  then concat(hour(timediff(m.createdAt, now())), '년 전')
                              when minute(timediff(m.pulledUpAt, now())) > 0 and m.pulledUpCount > 0
                                  then concat('끌올', minute(timediff(m.pulledUpAt, now())), '분 전')
                             when minute(timediff(m.createdAt, now())) > 0
                                  then concat(minute(timediff(m.createdAt, now())), '년 전')
                              when second(timediff(m.pulledUpAt, now())) > 0 and m.pulledUpCount > 0
                                  then concat('끌올', second(timediff(m.pulledUpAt, now())), '초 전')
                              when second(timediff(m.createdAt, now())) > 0
                                  then concat(second(timediff(m.createdAt, now())), '년 전')
                          end as createdAt
                   from User u
                         right join Merchandise m on m.userId = u.id
                         left join (select id, merchandiseId, number, imageURL,
                                    ROW_NUMBER() over (PARTITION BY merchandiseId order by number) as rn
                                    from MerchandiseImage
                                    where isDeleted = 1) as mi on mi.merchandiseId = m.id
                         left join Location l on u.locationId = l.id
                         left join (select ml.id, count(ml.id) as likeCount
                                    from MerchandiseLike ml
                                    where ml.isDeleted = 1
                                    group by ml.merchandiseId) as lc on m.id = lc.id
                   where l.id = ?
                   and m.categoryId = ?
                   and m.status = 1
                   and m.isDeleted = 1
                   and (mi.rn = 1 or mi.rn is null)
                   order by coalesce(m.pulledUpAt, m.createdAt) desc;
                   `;

  const row = await connection.query(query, params);

  return row[0];
}

// 상품 create
async function insertMerchandise(
  connection,
  categoryId,
  userId,
  title,
  contents,
  price,
  image_arr
) {
  const query = `
                insert into Merchandise(categoryId, userId, title, contents, price)
                values (?, ?, ?, ?, ?);
                `;

  const row = await connection.query(query, [
    categoryId,
    userId,
    title,
    contents,
    price,
  ]);

  const result = JSON.parse(JSON.stringify(row[0]));

  const getIdQuery = `
                    select max(id) as id
                    from Merchandise;
                    `;

  const getIdRow = await connection.query(getIdQuery);

  result["arrayCount"] = image_arr.length;

  let insertCount = 0;

  for (let i = 0; i < image_arr.length; i++) {
    const imgQuery = `
                insert into MerchandiseImage(merchandiseId, number, imageURL)
                values (?, ?, ?);
                `;

    const imgRow = await connection.query(imgQuery, [
      getIdRow[0][0]["id"],
      image_arr[i][0],
      image_arr[i][1],
    ]);

    if (imgRow[0].affectedRows === 1) {
      insertCount += 1;
    }
  }

  result["insertCount"] = insertCount;

  return result;
}

// 판매상품 삭제
async function deleteMerchandise(connection, merchandiseId) {
  const query = `
                  update Merchandise
                  set isDeleted = 0
                  where id = ?;
                  `;

  const row = await connection.query(query, merchandiseId);

  return row[0].info;
}

// 판매상품 끌어올리기 가능여부 check
async function checkPullUpPossible(connection, merchandiseId) {
  const query = `
            select pulledUpCount
            from Merchandise
            where id = ?;
    `;

  const row = await connection.query(query, merchandiseId);

  if (row[0][0]["pulledUpCount"] === 0) {
    const query = `
                    select timestampdiff(day, createdAt, now()) as possible
                    from Merchandise
                    where id = ?;
                    `;

    const row = await connection.query(query, merchandiseId);

    const temp = ["c", row[0][0]["possible"]];

    return temp;
  } else {
    const query = `
                    select timestampdiff(day, pulledUpAt, now()) as possible
                    from Merchandise
                    where id = ?;
                    `;

    const row = await connection.query(query, merchandiseId);

    const temp = ["p", row[0][0]["possible"]];

    return temp;
  }
}

// 판매상품 끌어올리기
async function pullUpMerchandise(connection, price, merchandiseId) {
  const query = `
                    update Merchandise
                    set price = ?, pulledUpCount = pulledUpCount + 1, pulledUpAt = now()
                    where id = ?;
                    `;

  const row = await connection.query(query, [price, merchandiseId]);

  return row[0].info;
}

// 상품 상태 update (0:거래완료 1:판매중 2: 예약중 3: 거래중지)
async function updateMerchandiseStatus(connection, params) {
  const query = `
                update Merchandise
                set status = ?
                where id = ?
                `;

  const row = await connection.query(query, params);

  return row[0].info;
}

// 내 판매상품 조회 (status - 판매중/예약중 : 1, 거래완료 : 0)
async function selectMyMerchandise(connection, userId, condition) {
  const query =
    `
                select mi.imageURL, m.title, m.price, l.address3 as address,
                        ifnull(lc.likeCount, 0) as likeCount, m.status, m.pulledUpCount,
                        count(cr.merchandiseId) as chatroomCount,
                        case
                            when timestampdiff(year, m.pulledUpAt, now()) > 0 and m.pulledUpCount > 0
                                then concat('끌올 ', timestampdiff(year, m.pulledUpAt, now()), '년 전')
                            when timestampdiff(year, m.createdAt, now()) > 0
                                then concat(timestampdiff(year, m.createdAt, now()), '년 전')
                            when timestampdiff(month, m.pulledUpAt, now()) > 0 and m.pulledUpCount > 0
                                then concat('끌올 ', timestampdiff(month, m.pulledUpAt, now()), '달 전')
                            when timestampdiff(month, m.createdAt, now()) > 0
                                then concat(timestampdiff(month, m.createdAt, now()), '달 전')
                            when timestampdiff(day, m.pulledUpAt, now()) > 0 and m.pulledUpCount > 0
                                then concat('끌올 ', timestampdiff(day, m.pulledUpAt, now()), '일 전')
                            when timestampdiff(day, m.createdAt, now()) > 0
                                then concat(timestampdiff(day, m.createdAt, now()), '일 전')
                            when hour(timediff(m.pulledUpAt, now())) > 0 and m.pulledUpCount > 0
                                then concat('끌올 ', hour(timediff(m.pulledUpAt, now())), '시간 전')
                            when hour(timediff(m.createdAt, now())) > 0
                                then concat(hour(timediff(m.createdAt, now())), '년 전')
                            when minute(timediff(m.pulledUpAt, now())) > 0 and m.pulledUpCount > 0
                                then concat('끌올 ', minute(timediff(m.pulledUpAt, now())), '분 전')
                            when minute(timediff(m.createdAt, now())) > 0
                                then concat(minute(timediff(m.createdAt, now())), '년 전')
                            when second(timediff(m.pulledUpAt, now())) > 0 and m.pulledUpCount > 0
                                then concat('끌올 ', second(timediff(m.pulledUpAt, now())), '초 전')
                            when second(timediff(m.createdAt, now())) > 0
                                then concat(second(timediff(m.createdAt, now())), '년 전')
                        end as createdAt
                from User u
                left join Merchandise m on m.userId = u.id
                left join MerchandiseImage mi on m.id = mi.merchandiseId
                left join Location l on u.locationId = l.id
                left join ChatRoom cr on cr.merchandiseId = m.id
                left join (select ml.id, count(ml.id) as likeCount
                        from MerchandiseLike ml
                        where ml.isDeleted = 1
                        group by ml.merchandiseId) as lc on m.id = lc.id
                where (mi.number = 1 or mi.number is null)
                and m.isDeleted = 1
                and m.userId = ?
                ` +
    condition +
    `
                group by m.id
                order by coalesce(m.pulledUpAt, m.createdAt) desc;
                `;

  const row = await connection.query(query, [userId, condition]);

  return row[0];
}

// 상품 수정 update
async function updateMerchandise(
  connection,
  merchandiseId,
  categoryId,
  title,
  contents,
  price,
  image_arr
) {
  const query1 = `
                update Merchandise
                set categoryId = ?, title = ?, contents = ?, price = ?
                where id = ?;
                `;

  const row = await connection.query(query1, [
    categoryId,
    title,
    contents,
    price,
    merchandiseId,
  ]);

  let result = JSON.parse(JSON.stringify(row[0])).info;

  const query2 = `
                update MerchandiseImage
                set isDeleted = 0
                where merchandiseId = ?;
                `;

  await connection.query(query2, merchandiseId);

  result += ` arrayCount: ${image_arr.length}`;

  let insertCount = 0;

  for (let i = 0; i < image_arr.length; i++) {
    const imgQuery = `
                insert into MerchandiseImage(merchandiseId, number, imageURL)
                values (?, ?, ?);
                `;

    const imgRow = await connection.query(imgQuery, [
      merchandiseId,
      image_arr[i][0],
      image_arr[i][1],
    ]);

    if (imgRow[0].affectedRows === 1) {
      insertCount += 1;
    }
  }

  result += ` insertCount: ${insertCount}`;

  return result;
}

module.exports = {
  checkLocationExist,
  selectAllMerchandise,
  selectMerchandise,
  checkMerchandiseExist,
  checkMerchandiseIsDeleted,
  selectCategory,
  checkCategoryExist,
  selectCategoryMerchandise,
  insertMerchandise,
  deleteMerchandise,
  checkPullUpPossible,
  pullUpMerchandise,
  updateMerchandiseStatus,
  checkHost,
  selectMyMerchandise,
  updateMerchandise,
};
