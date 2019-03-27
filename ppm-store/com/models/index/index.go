package index

import (
	"../../tools/mysql"
	"../../tools/utils"
	// "log"
	"mryl.tools/mysqlPack"
	"strconv"
)

type Appointment struct {
	AppointmentId   string //预约编号
	UserId          string //用户编号
	Id              string //用户编号
	DoctorId        string //医生编号
	ClinicId        string //诊所编号
	AppointmentTime string //预约时间
	DoctorName      string //医生姓名
	OrderId         string //订单编号
	PatientName     string //患者姓名
	PatientTel      string //患者电话
	PatientAge      string //患者年龄
	PatientSex      string //患者性别
	PatientCond     string //patientCond: 0 初诊;1 复诊
	PatientCondDesc string //病情描述
	PayType         string //支付类型
	Price           string //预约价格
	Status          string //status: -1 取消订单;0 等待付款;1 等待就诊;2 等待评价;3 完成订单。
	EcologyId       string //生态编号
	AddTime         string //预约添加时间
	A_order         int    //排号编号
	Doctor_order    int    //该医生的排号
	AddRegTime      string //排号时间
	DoctorNameReg   string //排号时分配的医生姓名
	DoctorType      string //预约类型
	OpenId          string // 用户编号
	Unique_id       string //用户统一标识符
}

//查询货物的记录count，用来判断是入库还是出库，如果是奇数就是出库，如果是偶数那么就是入库
func FindItme(itemId string) map[string]string {
	db := mysql.GetDB()
	q := `
	SELECT
	count(*) AS count
FROM
	bishe.items
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
	bishe.statistics
WHERE
	items_id = ?
	`
	return mysqlPack.SelectMap(db, q, itemId)
}
func AddRecords(userId, itemsId, user_name, access_type string)(int64, error) {
	 db:=mysql.GetDB()
	 q:=` INSERT INTO	 
	 bishe.statistics
 (user_id,items_id,user_name,access_type,date)  
 VALUES
 (?,?,?,?,?) `
	return mysqlPack.Insert(db, q, userId,itemsId,user_name,access_type,utils.GetFormatTime())

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
	bishe.statistics AS a,
	bishe.items AS b
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
		a.user_name =? `
		params = append(params, user_name)

	}
	if startDate != "" && endDate != "" {
		q += ` AND
		a.date BETWEEN ?  AND ? `
		params = append(params, startDate)
		params = append(params, endDate)
	}
	q += ` ORDER BY a.date DESC `
	return mysqlPack.Select(db, q, params...)
}

//统计单个商品的情况
func FindOneDetails(itemId,date string) map[string]string {
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
	bishe.statistics AS a,
	bishe.items AS b
WHERE
	a.items_id = b.items_id
AND  a.items_id = ?
AND  a.date=?
	`
	return mysqlPack.SelectMap(db, q, itemId,date)
}
//统计仓库的出入情况导出表格
func (_a *Appointment) FindAllByClinicId(startDate, endDate string, page, rows int) []interface{} {
	return []interface{}{}
	db := mysql.GetDB()
	currentDate := utils.GetFormatTime()
	w := ""
	params := []interface{}{
		_a.DoctorType,
	}
	if _a.ClinicId != "" {
		w += " AND a.clinicId= ? "
		params = append(params, _a.ClinicId)
	}
	if _a.DoctorName != "" {
		w += " AND d.doctorName LIKE ? "
		params = append(params, "%"+_a.DoctorName+"%")
	}
	if _a.Status != "" {
		w += " AND a.status= ? "
		params = append(params, _a.Status)
	}
	if _a.AppointmentTime != "" {
		w += " AND a.appointmentTime LIKE ? "
		params = append(params, "%"+_a.AppointmentTime+"%")
	} else {
		w += " AND a.appointmentTime < ? "
		params = append(params, currentDate)
	}
	if startDate != "" && endDate != "" {
		w += " AND a.appointmentTime >= ? AND a.appointmentTime <= ? "
		params = append(params, startDate, endDate+" 23:59")
	}
	if _a.PatientName != "" {
		w += " AND a.patientName LIKE ? "
		params = append(params, "%"+_a.PatientName+"%")
	}
	limit := ""
	if page > 0 && rows > 0 {
		limit = " LIMIT ?,?"
		params = append(params, strconv.Itoa((page-1)*rows), strconv.Itoa(rows))
	}
	q := `
		SELECT 
			a.clinicId,
			a.doctorId,
			a.appointmentId,
			a.appointmentTime,
			a.patientName,
			a.patientTel,
			FLOOR(a.patientAge/12) AS patientAge,
			a.patientSex,
			a.patientCond,
			a.patientCondDesc,
			a.price,
			a.payType,
			a.userId,
			a.orderId,
			a.status,
			a.ecologyId,
			a.addTime,
			a.addRegTime,
			a.doctorNameReg,
			a.a_order,
			a.is_up_time,
			a.up_time,
			a.up_apomt_time,
			a.up_doctor_id,
			a.up_apomt_price,
			d.doctorName  
		FROM 
			appointment a
		LEFT JOIN
			doctor d 
		ON
			a.clinicId = d.clinicId
		WHERE  a.doctorType=?
		` + w + `
		AND a.doctorId = d.doctorId
		ORDER BY a.appointmentTime DESC ` + limit
	return mysqlPack.Select(db, q, params...)
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
	bishe.statistics
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
