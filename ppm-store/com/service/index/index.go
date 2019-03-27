package index

import (
	modindex "../../models/index"
	"encoding/json"
	"log"
	"github.com/tealeg/xlsx"
)

func AddRecords(userId, itemsId, user_name, access_type string) (interface{}, string, string) {

	//查询该诊所有货物的出入库统计
	res,err := modindex.AddRecords(userId, itemsId, user_name, access_type)
	if err !=nil{
		return res,"添加失败","400"
	}
	return res,"添加成功","200"
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
func FindOneDetails(itemId,date string) (interface{}, string, string) {

	//查询该诊所有货物的出入库统计
	res := modindex.FindOneDetails(itemId,date)

	return res,"success","200"
}
// 根据条件查询货物出入库以excel形式导出
func FindAllCountXlsx(startDate,endDate,access_type,user_name string) (path string) {

	// title := []string{"货物编号", "患者电话", "患者年龄", "患者性别", "病情", "病情描述", "预约时间", "预约服务", "预约状态", "排号状态"}
	title := []string{"出入库时间", "货物编号", "管理员姓名", "入库类型", "货物名字", "货物种类", "预约时间", "预约服务", "预约状态", "排号状态"}
	column := []string{"patientName", "patientTel", "patientAge", "patientSex",
		"patientCond", "patientCondDesc", "appointmentTime", "doctorName", "status", "addRegTime"}
	xlFile := xlsx.NewFile()
	sheet, err := xlFile.AddSheet("历史预约信息列表")
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
	col0.SetValue("历史预约信息")
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
	if r = 	 modindex.FindAllCount(startDate, endDate, access_type, user_name); len(r) > 0 {
		for _, _v := range r {
			rows := sheet.AddRow()
			rows.SetHeightCM(1)
			v := _v.(map[string]string)
			for _, v1 := range column {
				cell := rows.AddCell()
				cell.SetStyle(style)
				value := "" //单元格中内容
				if v1 == "patientSex" {
					if v[v1] == "1" {
						value = "男"
					} else if v[v1] == "0" {
						value = "女"
					}
				} else if v1 == "status" {
					// 订单状态 -1 取消订单;0 等待付款;1 等待就诊;2 等待评价;3 完成订单
					switch v[v1] {
					case "-1":
						value = "取消订单"
					case "0":
						value = "等待付款"
					case "1":
						value = "等待就诊"
					case "2":
						value = "等待评价"
					case "3":
						value = "完成订单"
					}
				} else if v1 == "addRegTime" {
					if v[v1] == "" {
						value = "未排号"
					} else {
						value = "已排号"
					}
				} else if v1 == "patientCond" {
					if v[v1] == "1" {
						value = "复诊"
					} else {
						value = "初诊"
					}
				} else {
					value = v[v1]
				}
				cell.SetValue(value) //设置单元格中内容
			}
		}
	}
	sheet.SetColWidth(0, 0, 10) //设置0列1列的宽度为15
	sheet.SetColWidth(1, 1, 15)
	sheet.SetColWidth(2, 3, 100)
	sheet.SetColWidth(4, 4, 8)
	sheet.SetColWidth(5, 6, 25)
	sheet.SetColWidth(7, 7, 10)
	sheet.SetColWidth(8, 9, 10)
// 	if err := xlFile.Save("../../../xlsx/file1.xlsx"); err == nil {
// log.Println("sdadsaddsadas")
// 		path = "../../../xlsx/file1.xlsx"
// 	}
	if err := xlFile.Save("C:/Users/A·杰/Desktop/ppm-bysj/ppm-store/xlsx/file1.xlsx"); err == nil {
		path = "C:/Users/A·杰/Desktop/ppm-bysj/ppm-store/xlsx/file1.xlsx"
		log.Println("sdadsaddsadas")
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
