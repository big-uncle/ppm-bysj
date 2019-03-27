package index

import (
	modindex "../../models/index"
	serindex "../../service/index"
	"../../tools/utils"
	"fmt"
	"net/http"
	"strconv"
)

//统计货物的所有出入库情况
func AddRecords(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	access_type := "入库"
	userId := utils.GetParam(r, "userId")
	itemsId := utils.GetParam(r, "itemsId")
	userName := utils.GetParam(r, "userName")
	if modindex.FindItme(itemsId)["count"] == "0" {
		utils.ResponseWriter("111111", "未知物品无法入库", "400", w)
		return
	}
	count := modindex.FindCountByItmeId(itemsId)
	//如果count为奇数那么就代表这个物品已经在库里了，就是出库了，相反若是偶数，就代表是入库了
	int, _ := strconv.Atoi(count["count"])
	if int%2 == 1 { //出库
		access_type = "出库"
	}
	data, msg, code := serindex.AddRecords(userId, itemsId, userName, access_type)
	utils.ResponseWriter(data, access_type+msg, code, w)
}

//统计货物的所有出入库情况
func FindAllCount(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()

	startDate := utils.GetParam(r, "startDate")
	endDate := utils.GetParam(r, "endDate")
	access_type := utils.GetParam(r, "accessType")
	user_name := utils.GetParam(r, "userName")

	result := serindex.FindAllCount(startDate, endDate, access_type, user_name)
	w.Write(result)
}

//查询单个货物的详情
func FindOneDetails(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	itemId := utils.GetParam(r, "itemsId")
	date := utils.GetParam(r, "date")
	data, msg, code := serindex.FindOneDetails(itemId, date)
	utils.ResponseWriter(data, msg, code, w)
}

//统计货物的所有出入库情况导出表格
func FindAllCountXlsx(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	startDate := utils.GetParam(r, "startDate")
	endDate := utils.GetParam(r, "endDate")
	access_type := utils.GetParam(r, "accessType")
	user_name := utils.GetParam(r, "userName")	
	w.Header().Add("Content-Disposition", fmt.Sprintf("attachment; filename=货物出入库统计信息.xlsx"))
	w.Header().Set("Content-Type", "xlsx")

	if path := serindex.FindAllCountXlsx(startDate,endDate,access_type,user_name); path == "" {
		w.Write([]byte(""))
	} else {
		http.ServeFile(w, r, path)
	}
}

//库存量
func FindInventory(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	startDate := utils.GetParam(r, "startDate")
	endDate := utils.GetParam(r, "endDate")
	user_name := utils.GetParam(r, "userName")
	result := serindex.FindInventory(startDate, endDate, user_name)
	w.Write(result)
}
