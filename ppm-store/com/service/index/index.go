package index

import (
	"encoding/json"
	"log"
	"time"

	modindex "../../models/index"
	"../../models/login"
	"../../tools/conf"
	"../../tools/utils"
	"github.com/tealeg/xlsx"
)

func AddRecords(userId, itemsId, user_name, access_type string) (interface{}, string, string) {

	//查询该诊所有货物的出入库统计
	res, err := modindex.AddRecords(userId, itemsId, user_name, access_type)
	if err != nil {
		return res, "添加失败", "400"
	}
	return res, "添加成功", "200"
}
func FindAllCount(startDate, endDate, access_type, user_name string) []byte {
	var newRes map[string]interface{}
	//查询该诊所有货物的出入库统计
	res := modindex.FindAllCount(startDate, endDate, access_type, user_name)

	newRes = map[string]interface{}{"data": res, "msg": "执行成功", "success": true}

	if result, err := json.Marshal(newRes); err == nil {
		return result
	} else {
		return []byte{}
	}
}
func FindOneDetails(itemId, date string) (interface{}, string, string) {

	//查询该诊所有货物的出入库统计
	res := modindex.FindOneDetails(itemId, date)

	return res, "success", "200"
}

// 根据条件查询货物出入库以excel形式导出
func FindAllCountXlsx(startDate, endDate, access_type, user_name string) (path string) {

	// title := []string{"货物编号", "患者电话", "患者年龄", "患者性别", "病情", "病情描述", "预约时间", "预约服务", "预约状态", "排号状态"}
	title := []string{"货物编号", "货物名字", "操作人员姓名", "出入库类型", "货物种类", "货物描述", "出入库时间"}
	column := []string{"items_id", "items_name", "user_name", "access_type", "items_type", "items_desc", "date"}
	xlFile := xlsx.NewFile()
	sheet, err := xlFile.AddSheet("历史货物出入库统计")
	if err != nil {
		return ""
	}
	//表格样式
	style := xlsx.NewStyle()                                 //单元格样式
	border := xlsx.NewBorder("thin", "thin", "thin", "thin") //单元格边框
	style.Border = *border
	style.Alignment.Horizontal = "center" //水平居中
	style.Alignment.Vertical = "center"   //垂直居中
	style.ApplyAlignment = true           //应用对齐方式
	//标题
	row0 := sheet.AddRow()
	row0.SetHeightCM(1) //设置行高
	col0 := row0.AddCell()
	col0.SetValue("历史货物出入库统计")
	col0.HMerge = len(title) - 1 //水平合并单元格
	col0.SetStyle(style)
	//表头
	rows := sheet.AddRow() //表头
	rows.SetHeightCM(1)
	for _, v := range title {
		cell := rows.AddCell()
		cell.SetStyle(style) //设置样式
		cell.SetValue(v)
	}
	//数据
	var r = []interface{}{}
	if r = modindex.FindAllCount(startDate, endDate, access_type, user_name); len(r) > 0 {
		for _, _v := range r {
			rows := sheet.AddRow()
			rows.SetHeightCM(1)
			v := _v.(map[string]string)
			for _, v1 := range column {
				cell := rows.AddCell()
				cell.SetStyle(style)
				value := "" //单元格中内容
				v2, s2 := v[v1]
				if s2 {
					value = v2
				}
				//  if v2, s2 := v[v1]; s2 {
				// 	log.Println("map为",v)
				// 	 log.Println("数组里面是",v[v1])
				// 	 log.Println("数组里面是",v1)
				// 	 log.Println("数组里面是",v2)
				// 	 log.Println("数组里面是",s2)
				// 	 value=v[v1]
				//  }
				cell.SetValue(value) //设置单元格中内容
			}
		}
	}
	sheet.SetColWidth(0, 0, 15) //设置0列1列的宽度为15
	sheet.SetColWidth(1, 1, 15)
	sheet.SetColWidth(2, 3, 15)
	sheet.SetColWidth(4, 4, 15)
	sheet.SetColWidth(5, 5, 100)
	sheet.SetColWidth(6, 6, 20)
	//自己笔记本的路径
	// if err := xlFile.Save("C:/Users/A-杰/Desktop/ppm-bysj/ppm-store/xlsx/file1.xlsx"); err == nil { //这个只是保存到本地，
	// 	path = "C:/Users/A-杰/Desktop/ppm-bysj/ppm-store/xlsx/file1.xlsx" //这个是将本地的上传到http里面，供别人下载
	// 	log.Println("保存excel表格报错了")
	// }
	//公司电脑的路径
	if err := xlFile.Save(conf.XlsxPath); err == nil { //这个只是保存到本地，
		path = conf.XlsxPath //这个是将本地的上传到http里面，供别人下载
		log.Println("保存excel表格报错了")
	}
	return path
}

//查询仓库剩余的货物

func FindInventory(startDate, endDate, user_name string) []byte {

	result := modindex.FindInventory(startDate, endDate, user_name)

	newresult := map[string]interface{}{"data": result, "msg": "执行成功", "success": true}

	if oldresult, err := json.Marshal(newresult); err == nil {
		return oldresult
	} else {
		return []byte{}
	}

}

//新增货物信息
func AddItemInfo(item *modindex.Item) (interface{}, string, string) {
	_, err := item.AddItemInfo()
	if err != nil {
		return err, "当前货物编号已存在,新增失败", "400"
	}
	return err, "新增成功", "200"
}

//修改货物信息
func UpdItemInfo(item *modindex.Item) (interface{}, string, string) {
	_, err := item.UpdItemInfo()
	if err != nil {
		return err, "修改失败", "400"
	}
	return err, "修改成功", "200"
}

//删除货物信息
func DelItemInfo(itemId string) (interface{}, string, string) {
	_, err := modindex.DelItemInfo(itemId)
	if err != nil {
		return err, "删除失败", "400"
	}
	return err, "删除成功", "200"
}

//查询货物信息
func FindItemInfo(itemId string) (interface{}, string, string) {
	res := modindex.FindItemInfo(itemId)
	return res, "货物信息", "200"
}

func FindAllItemInfo() (interface{}, string, string) {
	res := modindex.FindAllItemInfo()
	return res, "货物信息", "200"
}
func Statistical(userId string) (interface{}, string, string) {
	result := map[string]interface{}{}
	result["today"] = modindex.TodayStatistical(userId, utils.GetFormatDate()) //统计个人当天的和所有人当天的
	result["all"] = modindex.AllStatistical(userId)                            //查询个人所有和仓库所有
	result["sort"] = modindex.SelfSort(userId)["sort"]                         //个人仓库排名
	result["permnum"] = modindex.PermsCount()["permnum"]
	// log.Println(result)
	return result, "统计信息", "200"
}
func StatisticalSelf(userId, account string) (interface{}, string, string) {
	var result []interface{}
	a := login.CheckUserAccount(account)[0].(map[string]string)["add_date"]
	b := utils.GetFormatDate()
	if a == "" || b == "" {
		return "", "日期不能为空", "400"
	}
	date := utils.GetDatePeriods(a, b)
	// log.Println("拼接的时间数组", date)
	vTable := utils.GetVTable(date)
	res := modindex.StatisticalSelf(userId, vTable) //查询个人所有和仓库所有
	for _, v := range res {
		var linshi []string
		// log.Println(v)
		v1 := v.(map[string]string)

		linshi = append(linshi, v1["date"])
		linshi = append(linshi, v1["num"])
		linshi = append(linshi, v1["size"])

		result = append(result, linshi)
	}
	// log.Println(result)
	return result, "统计信息", "200"
}

//员工信息修改
func Deluser(userId string) (interface{}, string, string) {

	// a := login.CheckUserAccount(account)[0].(map[string]string)["add_date"]
	_, err := modindex.Deluser(userId)
	if err != nil {
		return "", "员工删除失败", "400"
	}

	return "", "删除员工成功", "200"
}

//员工信息修改
func UserUpd(account, userId, name, sex, phone, pwd string) (interface{}, string, string) {
	if len(modindex.CheckPwdById(userId, pwd)) < 1 {
		return "", "用户密码校验不通过", "400"
	}
	if len(login.CheckUserbindAccount(account, userId)) > 0 {
		return "", "该账号已存在，请重新修改", "400"
	}
	if len(login.CheckUserBindphone(phone, userId)) > 0 {
		return "", "该手机号已与他人关联，请重新修改", "400"
	}
	// a := login.CheckUserAccount(account)[0].(map[string]string)["add_date"]
	_, err := modindex.UserUpd(account, userId, name, sex, phone)
	if err != nil {
		return "", "员工信息修改失败", "400"
	}

	return "", "员工信息修改成功", "200"
}

//查询所有员工的所有统计信息  上周的
func PermsInfo() (interface{}, string, string) {
	result := map[string]interface{}{}
	result2 := []interface{}{}
	name := []interface{}{}
	lastweekTimestamp := utils.Lastweek()                       //获取本周一的时间戳
	lastweek := utils.GetWeekFrontDateArr(lastweekTimestamp, 7) //获取前七天的日期
	// log.Println("拼接的上周时间日期表", lastweek)
	vTable := utils.GetVTable(lastweek)
	res := modindex.PermsInfo()
	for _, v := range res {
		result1 := map[string]interface{}{}
		v1 := v.(map[string]string)["user_name"]
		v2 := v.(map[string]string)["user_id"]
		name = append(name, v1)
		// log.Println("llll", v1)
		// return result, "统计信息", "200"
		result1["name"] = v1
		result1["type"] = "bar"
		var linshi []string
		for _, v5 := range modindex.StatisticalAll(v2, vTable) {
			v6 := v5.(map[string]string)
			linshi = append(linshi, v6["num"])
		}
		result1["data"] = linshi
		result2 = append(result2, result1)
	}
	pie := map[string]interface{}{ //其实除了map还可以封装字符串只要格式对的上，前端也可以解析
		"name":   "上周总体情况",
		"type":   "pie",           //这里只支持饼图
		"center": []int{108, 110}, //设置位置
		"radius": []int{0, 50},    //设置圆状
		"tooltip": map[string]interface{}{ //控制鼠标显示详情
			"trigger":   "item",
			"formatter": "{a} <br/>{b} : {c} ({d}%)",
		},
		"itemStyle": map[string]interface{}{ //控制栏目大小
			"normal": map[string]interface{}{
				"labelLine": map[string]interface{}{
					"length": 8,
				},
			},
		},
		"data": modindex.PermsSelfCountByWeek(time.Unix(lastweekTimestamp, 0).Format("2006-01-02")), //获取本周一的日期

	}
	result2 = append(result2, pie)
	result["data"] = result2 //饼图放到这里面来
	result["name"] = name
	// thisMonday := time.Unix(lastweekTimestamp, 0).Format("2006-01-02") //获取本周一的日期
	// result["week"] = modindex.PermsSelfCountByWeek(thisMonday)
	// log.Println(result)
	return result, "统计信息", "200"
}
