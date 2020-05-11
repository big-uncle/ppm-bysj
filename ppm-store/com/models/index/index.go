package index

import (
	"ppm/ppm-store/com/tools/mysql"
	"ppm/ppm-store/com/tools/mysql/mysqlPack"
	"ppm/ppm-store/com/tools/utils"
)

type Item struct {
	ItemId   string
	ItemName string
	ItemDesc string
	ItemPic  string
	ItemType string
}

func (i *Item) AddItemInfo() (int64, error) {
	db := mysql.GetDB()
	q := `
	INSERT INTO ppm.items (
		items_id,
		items_name,
		items_desc,
		items_pic,
		items_type
	)
	VALUES
		(?,?,?,?,?)
	`
	return mysqlPack.Insert(db, q, i.ItemId, i.ItemName, i.ItemDesc, i.ItemPic, i.ItemType)
}

func (i *Item) UpdItemInfo() (int64, error) {
	db := mysql.GetDB()
	q := `
	UPDATE ppm.items SET items_name= ?, items_desc = ?, items_pic = ?,items_type = ? WHERE items_id = ? 
	`
	return mysqlPack.Exec(db, q, i.ItemName, i.ItemDesc, i.ItemPic, i.ItemType, i.ItemId)
}

func DelItemInfo(itemId string) (int64, error) {
	db := mysql.GetDB()
	q := `
	DELETE FROM ppm.items WHERE items_id = ?
	`
	return mysqlPack.Exec(db, q, itemId)
}
func FindItemInfo(itemId string) map[string]string {
	db := mysql.GetDB()
	q := `
	SELECT * FROM ppm.items WHERE items_id = ?
	`
	return mysqlPack.SelectMap(db, q, itemId)
}

func FindAllItemInfo() []interface{} {
	db := mysql.GetDB()
	q := `
	SELECT
	t1.*,(case WHEN t2.access_type='出库' THEN  3  WHEN t2.access_type='入库'  THEN 2 ELSE 0 END) AS current
FROM
	ppm.items AS t1 LEFT JOIN
	( SELECT *	FROM ( SELECT * FROM ppm.statistics ORDER BY date DESC ) AS t GROUP BY t.items_id ) AS t2
	ON  t1.items_id=t2.items_id
ORDER BY
	t1.add_date DESC
	`
	return mysqlPack.Select(db, q)
}

//查询货物的记录count，用来判断是入库还是出库，如果是奇数就是出库，如果是偶数那么就是入库
func FindItme(itemId string) map[string]string {
	db := mysql.GetDB()
	q := `
	SELECT
	count(*) AS count
FROM
	ppm.items
WHERE
	items_id = ?
	`
	return mysqlPack.SelectMap(db, q, itemId)
}

//查询货物的记录count，用来判断是入库还是出库，如果是奇数就是出库，如果是偶数那么就是入库
func FindCountByItmeId(itemId string) map[string]string {
	db := mysql.GetDB()
	q := `
	SELECT
	count(*) AS count
FROM
	ppm.statistics
WHERE
	items_id = ?
	`
	return mysqlPack.SelectMap(db, q, itemId)
}
func AddRecords(userId, itemsId, user_name, access_type string) (int64, error) {
	db := mysql.GetDB()
	q := ` INSERT INTO	 
	 ppm.statistics
 (user_id,items_id,user_name,access_type,date)  
 VALUES
 (?,?,?,?,?) `
	return mysqlPack.Insert(db, q, userId, itemsId, user_name, access_type, utils.GetFormatTime())

}

//统计仓库的出入情况
func FindAllCount(startDate, endDate, access_type, user_name string) []interface{} {
	params := []interface{}{}
	db := mysql.GetDB()
	q := `
	SELECT
	a.user_name,
	a.items_id,
	a.access_type,
	a.date,
	b.items_desc,
	b.items_name,
	b.items_pic,
	b.items_type
FROM
	ppm.statistics AS a,
	ppm.items AS b
WHERE
	a.items_id = b.items_id
	`
	if access_type != "" {
		q += ` AND
		a.access_type = ? `
		params = append(params, access_type)
	}
	if user_name != "" {
		q += ` AND
		a.user_name LIKE ? `
		params = append(params, "%"+user_name+"%")

	}
	if startDate != "" && endDate != "" {
		q += ` AND
		a.date BETWEEN ?  AND date_add(?,interval 1 day) `
		// date_add('2015-11-03',interval 1 day)
		params = append(params, startDate)
		params = append(params, endDate)
	}
	q += ` ORDER BY a.date DESC `
	return mysqlPack.Select(db, q, params...)
}

//统计单个商品的情况
func FindOneDetails(itemId, date string) map[string]string {
	db := mysql.GetDB()
	q := `
	SELECT
	a.user_name,
	a.items_id,
	a.access_type,
	a.date,
	b.items_desc,
	b.items_name,
	b.items_pic,
	b.items_type
FROM
	ppm.statistics AS a,
	ppm.items AS b
WHERE
	a.items_id = b.items_id
AND  a.items_id = ?
AND  a.date=?
	`
	return mysqlPack.SelectMap(db, q, itemId, date)
}

//统计仓库现有库存情况
func FindInventory(startDate, endDate, user_name string) []interface{} {
	params := []interface{}{}
	db := mysql.GetDB()
	q := `
	SELECT
	COUNT(items_id) AS num,
	items_id,
	user_id,
	user_name,
	date
FROM
	ppm.statistics
WHERE
	1 = 1 `
	if user_name != "" {
		q += ` AND user_name = ? `
		params = append(params, user_name)
	}
	if startDate != "" && endDate != "" {
		q += ` AND
		date BETWEEN ?  AND ? `
		params = append(params, startDate)
		params = append(params, endDate)
	}
	q += `
		GROUP BY
			items_id
		HAVING
			num % 2 = 1
		ORDER BY
			date ASC `

	return mysqlPack.Select(db, q, params...)
}

func Deluser(userId string) (int64, error) {
	db := mysql.GetDB()
	q := ` DELETE FROM ppm.userinfo WHERE user_id= ?   `

	return mysqlPack.Exec(db, q, userId)
}

//根据userid查询密码

func CheckPwdById(userId, pwd string) []interface{} {
	db := mysql.GetDB()
	q := ` SELECT *FROM ppm.userinfo WHERE user_id= ? AND user_passwd = MD5(?)  `

	return mysqlPack.Select(db, q, userId, pwd)
}
func UserUpd(account, userId, name, sex, phone string) (int64, error) {
	db := mysql.GetDB()
	q := ` UPDATE ppm.userinfo
	SET user_account =?, user_name =?, sex =?, user_phone =?
	WHERE
		user_id =?  `

	return mysqlPack.Exec(db, q, account, name, sex, phone, userId)
}

func StatisticalSelf(userId, vTable string) []interface{} {
	db := mysql.GetDB()
	q := `
	SELECT
	t2.stsDate AS date,
	count(t1.items_id) AS num,
	floor(rand()*100) AS size
FROM
	ppm.statistics t1
	RIGHT JOIN ( ` + vTable + ` ) t2
	ON t2.stsDate = LEFT(t1.date,10) 
AND
	t1.user_id = ?
GROUP BY t2.stsDate
ORDER BY
	date ASC `

	return mysqlPack.Select(db, q, userId)
}

//个人当天统计和仓库当天统计
func TodayStatistical(userId, date string) map[string]string {
	db := mysql.GetDB()
	q := `
	SELECT
	t1.myTotal,
	count(*) AS allTotal
FROM
	(
		SELECT
			count(*) AS myTotal
		FROM
			ppm.statistics
		WHERE
			date BETWEEN ?
		AND date_add( ? ,interval 1 day)
AND
			user_id = ?
	) AS t1,
	ppm.statistics AS t2 WHERE
			date BETWEEN ?
			AND	date_add( ? ,interval 1 day) `

	return mysqlPack.SelectMap(db, q, date, date, userId, date, date)
}

//个人当天统计和仓库当天统计
func AllStatistical(userId string) map[string]string {
	db := mysql.GetDB()
	q := `
	SELECT
	t1.myTotal,
	count(*) AS allTotal
FROM
	(
		SELECT
			count(*) AS myTotal
		FROM
			ppm.statistics
		WHERE
			user_id = ?
	) AS t1,
	ppm.statistics AS t2  `

	return mysqlPack.SelectMap(db, q, userId)
}

//个人在团队中的排名
func SelfSort(userId string) map[string]string {
	db := mysql.GetDB()
	q := `
	SELECT z.sort FROM(
		SELECT
			(@i :=@i + 1) AS sort,
			l.*
		FROM
			(
				SELECT
					COUNT(*) AS total,
					user_name,
					user_id
				FROM
					statistics
				GROUP BY
					user_id
				ORDER BY
					total DESC
			) AS l,
			(SELECT @i := 0) AS i 
		) z
		WHERE z.user_id= ?  `

	return mysqlPack.SelectMap(db, q, userId)
}

//查询员工总数
func PermsCount() map[string]string {
	db := mysql.GetDB()
	q := `
	SELECT COUNT(*) AS permnum FROM userinfo  `

	return mysqlPack.SelectMap(db, q)
}

//查询所有员工---
func PermsInfo() []interface{} {
	db := mysql.GetDB()
	q := `
	SELECT user_id,user_account,user_phone,user_name,add_date, CASE WHEN sex = '1'THEN '男'ELSE '女'END AS sex FROM userinfo 
  `

	return mysqlPack.Select(db, q)
}
func StatisticalAll(userId, vTable string) []interface{} {
	db := mysql.GetDB()
	q := `
	SELECT
	count(t1.items_id) AS num
FROM
	ppm.statistics t1
	RIGHT JOIN ( ` + vTable + ` ) t2
	ON t2.stsDate = LEFT(t1.date,10) 
AND
	t1.user_id = ?
GROUP BY t2.stsDate
ORDER BY
stsdate ASC `

	return mysqlPack.Select(db, q, userId)
}

func PermsSelfCountByWeek(thisMonday string) []interface{} {

	db := mysql.GetDB()
	q := `
		SELECT
		COUNT(user_id) AS value,
		user_name  AS name
		FROM
			ppm.statistics
		WHERE
			LEFT (date, 10) BETWEEN DATE_SUB( ? ,interval 8 day)
		AND DATE_SUB( ? ,interval 2 day)
		GROUP BY
			user_id  `

	return mysqlPack.Select(db, q, thisMonday, thisMonday)
}
