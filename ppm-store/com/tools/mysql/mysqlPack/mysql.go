package mysqlPack

import (
	"database/sql"
	"log"
	"reflect"
	"strconv"

	_ "github.com/go-sql-driver/mysql"
)

/**
 * 运行事物
 */
func RunTransaction(db *sql.DB, sqls []map[string]interface{}) (e error) {
	//开启事务
	tx, err := db.Begin()
	if err != nil {
		return err
	}
	for _, value := range sqls {
		log.Println(value["sql"].(string))
		log.Println(value["params"].([]interface{}))
		//每次循环用的都是tx内部的连接，没有新建连接，效率高
		// time.Sleep(time.Second * 1)
		// log.Println("value", value)
		if _, e = tx.Exec(value["sql"].(string), value["params"].([]interface{})...); e != nil {
			break
		}
	}
	if e != nil {
		log.Println("RunTransaction tx.Exec Error:", e.Error())
		//出异常回滚
		tx.Rollback()
	} else {
		//提交事务
		tx.Commit()
	}
	return
}

//插入
func Insert(db *sql.DB, sqlstr string, args ...interface{}) (int64, error) {
	stmtIns, err := db.Prepare(sqlstr)
	if err != nil {
		// panic(err.Error())
		log.Println("Insert db.Prepare Error:", err.Error())
		return 0, err
	}
	defer stmtIns.Close()
	// log.Println("Execute SQL:", sqlstr)
	// log.Printf("Params:", args...)
	result, err := stmtIns.Exec(args...)
	if err != nil {
		// panic(err.Error())
		log.Println("Insert stmtIns.Exec Error:", err.Error())
		return 0, err
	}
	return result.LastInsertId()
}

/**
 * 查询多条数据
 */
func Select(db *sql.DB, query string, args ...interface{}) []interface{} {
	// db := MrylAnalysisConn()
	var (
		result = []interface{}{}
		rows   *sql.Rows
		err    error
	)
	log.Println("Execute SQL:", query)
	log.Printf("Params:", args...)
	if len(args) > 0 {
		rows, err = db.Query(query, args...)
	} else {
		rows, err = db.Query(query)
	}
	if err != nil {
		log.Println("Select db.Query Error:", err)
		return result
	}
	defer rows.Close()
	// defer db.Close()
	columns, err := rows.Columns()
	if err != nil {
		log.Println("Select rows.Columns Error:", err)
		return result
	}
	// log.Println(`columns`, columns, err.Error())
	// 构造scanArgs、values两个数组，scanArgs的每个值指向values相应值的地址
	scanArgs := make([]interface{}, len(columns))
	values := make([]interface{}, len(columns))
	for i := range values {
		scanArgs[i] = &values[i]
	}
	for rows.Next() {
		//将行数据保存到record字典
		err = rows.Scan(scanArgs...)
		record := make(map[string]string)
		// log.Println(`values`, len(values))
		for i, col := range values {
			// if col != nil {
			switch col.(type) {
			case []uint8:
				record[columns[i]] = string(col.([]byte))
			case int64:
				record[columns[i]] = strconv.FormatInt(col.(int64), 10)
			case float64:
				record[columns[i]] = strconv.FormatFloat(col.(float64), 'f', -1, 64)
			case nil:
				record[columns[i]] = ""
			default:
				log.Println("未知的字段类型:", reflect.TypeOf(col))
			}
			// }
		}
		result = append(result, record)
	}
	return result
}

/**
 * 查询一条数据
 */
func SelectMap(db *sql.DB, query string, args ...interface{}) map[string]string {
	var (
		result = map[string]string{}
		rows   *sql.Rows
		err    error
	)
	// log.Println("Execute SQL:", query)
	// log.Printf("Params:", args...)
	if len(args) > 0 {
		rows, err = db.Query(query, args...)
	} else {
		rows, err = db.Query(query)
	}
	if err != nil {
		log.Println("SelectMap db.Query Error:", err)
		return result
	}
	defer rows.Close()

	columns, err := rows.Columns()
	if err != nil {
		log.Println("SelectMap rows.Columns Error:", err)
		return result
	}
	// log.Println(`columns`, columns, err.Error())
	// 构造scanArgs、values两个数组，scanArgs的每个值指向values相应值的地址
	scanArgs := make([]interface{}, len(columns))
	values := make([]interface{}, len(columns))
	for i := range values {
		scanArgs[i] = &values[i]
	}
	for rows.Next() {
		err = rows.Scan(scanArgs...)
		// record := make(map[string]string)
		// log.Println(`values`, len(values))
		for i, col := range values {
			switch col.(type) {
			case []uint8:
				result[columns[i]] = string(col.([]byte))
			case int64:
				result[columns[i]] = strconv.FormatInt(col.(int64), 10)
			case float64:
				result[columns[i]] = strconv.FormatFloat(col.(float64), 'f', -1, 64)
			case nil:
				result[columns[i]] = ""
			default:
				log.Println("未知的字段类型:", reflect.TypeOf(col))
			}
		}
		break
	}
	return result
}

//修改和删除
func Exec(db *sql.DB, sqlstr string, args ...interface{}) (int64, error) {
	stmtIns, err := db.Prepare(sqlstr)
	if err != nil {
		// panic(err.Error())
		log.Println("Exec db.Prepare Error:", err.Error())
		return 0, err
	}
	defer stmtIns.Close()
	log.Println("Execute SQL:", sqlstr)
	log.Printf("Params:", args...)
	result, err := stmtIns.Exec(args...)
	if err != nil {
		// panic(err.Error())
		log.Println("Exec stmtIns.Exec Error:", err.Error())
		return 0, err
	}
	return result.RowsAffected()
}
