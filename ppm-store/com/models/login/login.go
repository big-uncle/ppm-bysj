package login

import (
	"ppm/ppm-store/com/tools/mysql"
	u "ppm/ppm-store/com/tools/utils"

	"ppm/ppm-store/com/tools/mysql/mysqlPack"
)

/**
 * 开始认证登陆用户信息
 */
func SelectUser(account string, passwd string) map[string]string {
	db := mysql.GetDB()
	sql := ` SELECT * FROM ppm.userinfo WHERE user_account = ? AND user_passwd = MD5(?) `
	return mysqlPack.SelectMap(db, sql, account, passwd)
}
func CheckUserAccount(account string) []interface{} {
	db := mysql.GetDB()
	sql := ` SELECT * FROM ppm.userinfo WHERE user_account = ?  `

	return mysqlPack.Select(db, sql, account)
}
func CheckUserbindAccount(account, userId string) []interface{} {
	db := mysql.GetDB()
	sql := ` SELECT * FROM ppm.userinfo WHERE user_account = ? AND user_id != ? `

	return mysqlPack.Select(db, sql, account, userId)
}
func CheckUserBindphone(phone, userId string) []interface{} {
	db := mysql.GetDB()
	sql := ` SELECT * FROM ppm.userinfo WHERE user_phone = ? AND user_id != ? `

	return mysqlPack.Select(db, sql, phone, userId)
}

func CheckUserBind(phone, account string) []interface{} {
	db := mysql.GetDB()
	sql := ` SELECT * FROM ppm.userinfo WHERE user_phone = ?  `
	if account != "" {
		sql += ` AND user_account =  ` + "'" + account + "'"
	}
	return mysqlPack.Select(db, sql, phone)
}

func CheckUser(phone, account string) []interface{} {
	db := mysql.GetDB()
	sql := ` SELECT * FROM ppm.userinfo WHERE user_phone = ?  `
	if account != "" {
		sql += ` OR user_account =  ` + "'" + account + "'"
	}
	return mysqlPack.Select(db, sql, phone)
}

// 修改密码
func ApiChangepwd(phone string, newpwd string) int64 {
	db := mysql.GetDB()
	sql := `
			UPDATE
			ppm.userinfo
			SET
			user_passwd = MD5(?)
			WHERE  user_phone = ?
		`
	count, _ := mysqlPack.Exec(db, sql, newpwd, phone)
	return count
}

//注册
func ApiRegist(phone, newpwd, account, name, sex string) (int64, error) {
	db := mysql.GetDB()
	date := u.GetFormatDate()
	user_id := u.GetUUID()
	sql := ` INSERT INTO ppm.userinfo (user_phone, user_passwd, user_account, user_id,user_name,sex,add_date)VALUES( ?, MD5(?), ?, ?, ? ,?, ? ) `
	return mysqlPack.Insert(db, sql, phone, newpwd, account, user_id, name, sex, date)
}
