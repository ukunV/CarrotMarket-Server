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
  const row1 = JSON.parse(JSON.stringify(result1[0]));
  const row2 = JSON.parse(JSON.stringify(result2[0]));
  const row = { row1, row2 };

  return row;
}

// 상품 삭제여부 check
async function checkIsDeleted(connection, merchandiseId) {
  const query = `
                select isDeleted
                from Merchandise
                where id = ?;
                `;
  const row = await connection.query(query, merchandiseId);

  return row[0][0]["isDeleted"];
}

// 상품 삭제여부 check
async function checkExist(connection, merchandiseId) {
  const query = `
                select exists(select id from Merchandise where id = ?) as exist;
                  `;
  const row = await connection.query(query, merchandiseId);

  return row[0][0]["exist"];
}

// // 상품 카테고리 read
// async function selectMerchandiseCategory(connection) {
//   const query = `
//                 select id, categoryName
//                 from MerchandiseCategory;
//                 `;
//   const [row] = await connection.query(query);
//   console.log(row);
//   return row;
// }

// // 카테고리별 최신순 판매상품 read by locationId, categoryId
// async function selectCategoryById(connection, params) {
//   const query = `
//                    select m.title, mi.imageURL, l.address3 as address, m.price, ifnull(lc.likeCount, 0) as likeCount,
//                           case
//                               when timestampdiff(year, m.pulledUpAt, now()) > 0 and m.pulledUpCount > 0
//                                   then concat('끌올', timestampdiff(year, m.pulledUpAt, now()), '년 전')
//                               when timestampdiff(year, m.createdAt, now()) > 0
//                                   then concat(timestampdiff(year, m.createdAt, now()), '년 전')
//                               when timestampdiff(month, m.pulledUpAt, now()) > 0 and m.pulledUpCount > 0
//                                   then concat('끌올', timestampdiff(month, m.pulledUpAt, now()), '달 전')
//                               when timestampdiff(month, m.createdAt, now()) > 0
//                                   then concat(timestampdiff(month, m.createdAt, now()), '달 전')
//                               when timestampdiff(day, m.pulledUpAt, now()) > 0 and m.pulledUpCount > 0
//                                   then concat('끌올', timestampdiff(day, m.pulledUpAt, now()), '일 전')
//                               when timestampdiff(day, m.createdAt, now()) > 0
//                                   then concat(timestampdiff(day, m.createdAt, now()), '일 전')
//                               when hour(timediff(m.pulledUpAt, now())) > 0 and m.pulledUpCount > 0
//                                   then concat('끌올', hour(timediff(m.pulledUpAt, now())), '시간 전')
//                               when hour(timediff(m.createdAt, now())) > 0
//                                   then concat(hour(timediff(m.createdAt, now())), '년 전')
//                               when minute(timediff(m.pulledUpAt, now())) > 0 and m.pulledUpCount > 0
//                                   then concat('끌올', minute(timediff(m.pulledUpAt, now())), '분 전')
//                              when minute(timediff(m.createdAt, now())) > 0
//                                   then concat(minute(timediff(m.createdAt, now())), '년 전')
//                               when second(timediff(m.pulledUpAt, now())) > 0 and m.pulledUpCount > 0
//                                   then concat('끌올', second(timediff(m.pulledUpAt, now())), '초 전')
//                               when second(timediff(m.createdAt, now())) > 0
//                                   then concat(second(timediff(m.createdAt, now())), '년 전')
//                           end as createdAt
//                    from User u
//                          right join Merchandise m on m.userId = u.id
//                          left join (select id, merchandiseId, number, imageURL,
//                                     ROW_NUMBER() over (PARTITION BY merchandiseId order by number) as rn
//                                     from MerchandiseImage
//                                     where isDeleted = 1) as mi on mi.merchandiseId = m.id
//                          left join Location l on u.locationId = l.id
//                          left join (select ml.id, count(ml.id) as likeCount
//                                     from MerchandiseLike ml
//                                     where ml.isDeleted = 1
//                                     group by ml.merchandiseId) as lc on m.id = lc.id
//                    where l.id = ?
//                    and m.categoryId = ?
//                    and m.status = 1
//                    and m.isDeleted = 1
//                    and (mi.rn = 1 or mi.rn is null)
//                    order by coalesce(m.pulledUpAt, m.createdAt) desc;
//                    `;

//   const row = await connection.query(query, params);
//   return row;
// }

// // 내 판매상품 read by userId
// async function selectMyMerchandiseById(connection, userId) {
//   const query = `
//                   select mi.imageURL,
//                          m.title,
//                          m.price,
//                          l.address3 as address,
//                          ifnull(lc.likeCount, 0) as likeCount,
//                          m.status,
//                          m.pulledUpCount,
//                          count(cr.merchandiseId) as chatroomCount,
//                          case
//                              when timestampdiff(year, m.pulledUpAt, now()) > 0 and m.pulledUpCount > 0
//                                  then concat('끌올 ', timestampdiff(year, m.pulledUpAt, now()), '년 전')
//                              when timestampdiff(year, m.createdAt, now()) > 0
//                                  then concat(timestampdiff(year, m.createdAt, now()), '년 전')
//                              when timestampdiff(month, m.pulledUpAt, now()) > 0 and m.pulledUpCount > 0
//                                  then concat('끌올 ', timestampdiff(month, m.pulledUpAt, now()), '달 전')
//                              when timestampdiff(month, m.createdAt, now()) > 0
//                                  then concat(timestampdiff(month, m.createdAt, now()), '달 전')
//                              when timestampdiff(day, m.pulledUpAt, now()) > 0 and m.pulledUpCount > 0
//                                  then concat('끌올 ', timestampdiff(day, m.pulledUpAt, now()), '일 전')
//                              when timestampdiff(day, m.createdAt, now()) > 0
//                                  then concat(timestampdiff(day, m.createdAt, now()), '일 전')
//                              when hour(timediff(m.pulledUpAt, now())) > 0 and m.pulledUpCount > 0
//                                  then concat('끌올 ', hour(timediff(m.pulledUpAt, now())), '시간 전')
//                              when hour(timediff(m.createdAt, now())) > 0
//                                  then concat(hour(timediff(m.createdAt, now())), '년 전')
//                              when minute(timediff(m.pulledUpAt, now())) > 0 and m.pulledUpCount > 0
//                                  then concat('끌올 ', minute(timediff(m.pulledUpAt, now())), '분 전')
//                              when minute(timediff(m.createdAt, now())) > 0
//                                  then concat(minute(timediff(m.createdAt, now())), '년 전')
//                              when second(timediff(m.pulledUpAt, now())) > 0 and m.pulledUpCount > 0
//                                  then concat('끌올 ', second(timediff(m.pulledUpAt, now())), '초 전')
//                              when second(timediff(m.createdAt, now())) > 0
//                                  then concat(second(timediff(m.createdAt, now())), '년 전')
//                         end as createdAt
//                   from User u
//                         left join Merchandise m on m.userId = u.id
//                         left join (select id, merchandiseId, number, imageURL,
//                                           ROW_NUMBER() over (PARTITION BY merchandiseId order by number) as rn
//                                    from MerchandiseImage
//                                    where isDeleted = 1) as mi on mi.merchandiseId = m.id
//                         left join Location l on u.locationId = l.id
//                         left join ChatRoom cr on cr.merchandiseId = m.id
//                         left join (select ml.id, count(ml.id) as likeCount
//                                    from MerchandiseLike ml
//                                    where ml.isDeleted = 1
//                                    group by ml.merchandiseId) as lc on m.id = lc.id
//                   where m.status in (1, 2)
//                   and m.isDeleted = 1
//                   and m.userId = ?
//                   and (mi.rn = 1 or mi.rn is null)
//                   group by m.id
//                   order by coalesce(m.pulledUpAt, m.createdAt) desc;
//                   `;

//   const [row] = await connection.query(query, userId);
//   return row;
// }

// // 상품 create
// async function insertMerchandise(connection, params) {
//   const query = `
//                 insert into Merchandise(categoryId, userId, title, contents, price)
//                 values (?, ?, ?, ?, ?);
//                 `;

//   const row = await connection.query(query, params);
//   return row;
// }

// // 상품 create 후 상품 사진 create, 상품 update 시 새로운 사진 등록
// async function insertMerchandiseImage(connection, params) {
//   const query = `
//                 insert into MerchandiseImage(merchandiseId, number, imageURL)
//                 values (?, ?, ?);
//                 `;

//   const row = await connection.query(query, params);
//   return row;
// }

// // 상품 수정 update
// async function updateMerchandise(connection, params) {
//   const query = `
//                 update Merchandise
//                 set categoryId = ?, userId = ?, title = ?, contents = ?, price = ?
//                 where id = ?
//                 `;

//   const row = await connection.query(query, params);
//   return row;
// }

// // 상품 update 후 상품 사진 삭제 update
// async function updateMerchandiseImage(connection, merchandiseId) {
//   const query = `
//                 update MerchandiseImage
//                 set isDeleted = 0
//                 where id = ?
//                 `;
//   const row = await connection.query(query, merchandiseId);
//   return row;
// }

// // 상품 상태 update (0:거래완료 1:판매중 2: 예약중 3: 거래중지)
// async function updateMerchandiseStatus(connection, params) {
//   const query = `
//                 update Merchandise
//                 set status = ?
//                 where id = ?
//                 `;

//   const row = await connection.query(query, params);
//   return row;
// }

// // 상품 delete
// async function deleteMerchandise(connection, merchandiseId) {
//   const query = `
//                 update Merchandise
//                 set isDeleted = 0
//                 where id = ?
//                 `;

//   const row = await connection.query(query, merchandiseId);
//   return row;
// }

module.exports = {
  selectAllMerchandise,
  selectMerchandise,
  checkIsDeleted,
  checkExist,
};
