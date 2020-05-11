package mysql

import (
	"database/sql"
	"ppm/ppm-store/com/tools/conf"

	_ "github.com/go-sql-driver/mysql"
)

/**
 * 获取数据库链接
 */
var MysqlDB *sql.DB

func init() {
	MysqlDB, _ = sql.Open("mysql", conf.Mysql)
	//连接池
	MysqlDB.SetMaxOpenConns(3)
	MysqlDB.SetMaxIdleConns(1)
	MysqlDB.Ping()
}
func GetDB() *sql.DB {
	return MysqlDB
}
