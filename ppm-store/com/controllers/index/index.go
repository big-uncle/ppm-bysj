package index

import (
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strconv"

	modindex "ppm/ppm-store/com/models/index"
	serindex "ppm/ppm-store/com/service/index"
	"ppm/ppm-store/com/tools/conf"
	"ppm/ppm-store/com/tools/utils"
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

//统计货物的所有出入库情况0,全部；1，入库；2，出库
func FindAllCount(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	startDate := utils.GetParam(r, "startDate")
	endDate := utils.GetParam(r, "endDate")
	access_type := utils.GetParam(r, "accessType")
	user_name := utils.GetParam(r, "userName")
	if access_type == "1" { //0,全部；1，入库；2，出库
		access_type = "入库"
	} else if access_type == "2" {
		access_type = "出库"
	} else {
		access_type = ""
	}
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
	if access_type == "1" { //0,全部；1，入库；2，出库
		access_type = "入库"
	} else if access_type == "2" {
		access_type = "出库"
	} else {
		access_type = ""
	}
	w.Header().Add("Content-Disposition", fmt.Sprintf("attachment; filename=货物出入库统计信息.xlsx"))
	w.Header().Set("Content-Type", "xlsx")

	if path := serindex.FindAllCountXlsx(startDate, endDate, access_type, user_name); path == "" {
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

//查询个人每日统计和总体统计，总仓库的每日统计和总体统计
func Statistical(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	userId := utils.GetParam(r, "userId")
	data, msg, code := serindex.Statistical(userId)

	utils.ResponseWriter(data, msg, code, w)
}

//查询个人每日统计和总体统计，总仓库的每日统计和总体统计
func StatisticalSelf(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	account := utils.GetParam(r, "account")
	userId := utils.GetParam(r, "userId")
	if account == "" || userId == "" {
		w.Write([]byte(`{"data": "", "msg":"参数错误", "code": 400}`))
		return
	}
	data, msg, code := serindex.StatisticalSelf(userId, account)

	utils.ResponseWriter(data, msg, code, w)
}

//查询所有员工详细统计信息 --上周的
func PermsInfo(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	data, msg, code := serindex.PermsInfo()
	utils.ResponseWriter(data, msg, code, w)
}

//修改员工信息
func UserUpd(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	account := utils.GetParam(r, "account")
	userId := utils.GetParam(r, "userId")
	name := utils.GetParam(r, "name")
	sex := utils.GetParam(r, "sex")
	phone := utils.GetParam(r, "phone")
	pwd := utils.GetParam(r, "pwd")
	data, msg, code := serindex.UserUpd(account, userId, name, sex, phone, pwd)
	utils.ResponseWriter(data, msg, code, w)
}

//查询所有员工信息
func Userlist(w http.ResponseWriter, r *http.Request) {

	utils.ResponseWriter(modindex.PermsInfo(), "员工列表", "200", w)
}

//删除员工信息
func Deluser(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	userId := utils.GetParam(r, "userId")
	data, msg, code := serindex.Deluser(userId)
	utils.ResponseWriter(data, msg, code, w)
}

type Sizer interface {
	Size() int64
}

//查询所有员工信息
func AddItemPic(w http.ResponseWriter, r *http.Request) {
	path := ""

	// r.ParseMultipartForm(32 << 20) //这种是解析  'Content-Type': 'multipart/form-data', 就可以获取key-values值了 ，但是下面这个方法里面封装了这个解析
	// file, errflie := utils.GetMultiParam(r, "files")

	// //上面那个就是 封装了 解析和 file, handler, err := r.FormFile("files")

	// if errflie != nil {
	// 	w.Write([]byte(`{"data":` + errflie.Error() + `,"code":400,"msg":"上传失败"}`))
	// 	return
	// }
	// defer file.Close()
	// // // // picName := utils.GetUUID()
	// // // // _name := "ppm/ppm-store/" + picName + ".jpg"
	// // // // ImagePath := _name

	// io.Copy(f3, file)

	// log.Println(r.Method)
	// r.MultipartReader

	// _body, _ := ioutil.ReadAll(r.Body)

	// ioutil.WriteFile("ppm/ppm-store/重复111122222.jpg", _body, 0644)
	// r.ParseForm()
	// log.Println("3333333333", r.Body)
	// log.Println("88888888888", r.PostForm)
	// log.Println(3333, r.Form)
	// account := utils.GetParam(r, "files")
	// log.Println("99999999999", account)
	// // log.Println("8888888888", r.Form)
	// // filePath, _ := os.OpenFile(time.Now().String()+".jpg", os.O_RDWR, 066)
	// log.Println(r)
	// bytes, _ := ioutil.ReadAll(r.Body)
	// // filePath.Write(bytes)
	// log.Println(string(bytes))
	// ioutil.ReadAll(filePath)
	file, handler, err := r.FormFile("files") //这个给你把解析文件类型和getparam都给你封装了

	if err != nil {
		msg := "获取上传文件错误:" + err.Error()
		fmt.Fprintf(w, msg) //相当于也是w.Write()，然后将msg塞在里面
		log.Println(msg)
		return
	}
	defer file.Close()
	log.Println(file)
	if fileSizer, ok := file.(Sizer); ok {
		fileSize := fileSizer.Size() / (1024 * 1024)
		fmt.Printf("上传文件的大小为: %d 名称为%s", fileSize, handler.Filename)
		if fileSize > 10 {
			msg := "获取上传文件错误:文件大小超出10M"
			fmt.Fprintf(w, msg)
			return
		}
		path = conf.Pic + handler.Filename
		f, createErr := os.Create(path)

		if createErr != nil {
			w.Write([]byte(fmt.Sprint(createErr)))
			return
		}

		defer f.Close()
		log.Println("创建文件成功,路径为", path)
		io.Copy(f, file)

	} else {
		msg := "获取上传文件错误:无法读取文件大小"
		fmt.Fprintf(w, msg)
		return
	}
	// fmt.Fprintf(w, "ok") //这个也相当于传送一个响应回去
	fmt.Fprintf(w, "imgs/"+handler.Filename)
	// utils.ResponseWriter("", "图片信息", "200", w)
}

//新增货物信息
func AddItemInfo(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	itemId := utils.GetParam(r, "itemId")
	itemName := utils.GetParam(r, "itemName")
	itemDesc := utils.GetParam(r, "itemDesc")
	itemType := utils.GetParam(r, "itemType")
	itemPic := utils.GetParam(r, "itemPic")

	log.Println("itemPic图片为", itemPic)
	log.Println("itemName为", itemName)
	log.Println("itemDesc为", itemDesc)
	log.Println("itemType为", itemType)
	log.Println("itemId", itemId)
	if itemId == "" || itemName == "" || itemDesc == "" || itemType == "" || itemPic == "" {
		w.Write([]byte(`{"data": "", "msg":"参数错误", "code": 400}`))
		return
	}
	a := &modindex.Item{
		ItemId:   itemId,
		ItemName: itemName,
		ItemDesc: itemDesc,
		ItemPic:  itemPic,
		ItemType: itemType,
	}
	data, msg, code := serindex.AddItemInfo(a)

	utils.ResponseWriter(data, msg, code, w)
}

//新增货物信息
func UpdItemInfo(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	itemId := utils.GetParam(r, "itemId")
	itemName := utils.GetParam(r, "itemName")
	itemDesc := utils.GetParam(r, "itemDesc")
	itemType := utils.GetParam(r, "itemType")
	itemPic := utils.GetParam(r, "itemPic")
	if itemId == "" || itemName == "" || itemDesc == "" || itemType == "" || itemPic == "" {
		w.Write([]byte(`{"data": "", "msg":"参数错误", "code": 400}`))
		return
	}
	a := &modindex.Item{
		ItemId:   itemId,
		ItemName: itemName,
		ItemDesc: itemDesc,
		ItemPic:  itemPic,
		ItemType: itemType,
	}
	data, msg, code := serindex.UpdItemInfo(a)
	utils.ResponseWriter(data, msg, code, w)
}

//新增货物信息
func DelItemInfo(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	itemId := utils.GetParam(r, "itemId")
	if itemId == "" {
		w.Write([]byte(`{"data": "", "msg":"参数错误", "code": 400}`))
		return
	}

	data, msg, code := serindex.DelItemInfo(itemId)

	utils.ResponseWriter(data, msg, code, w)
}

//查询货物信息
func FindItemInfo(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	itemId := utils.GetParam(r, "itemId")
	if itemId == "" {
		w.Write([]byte(`{"data": "", "msg":"参数错误", "code": 400}`))
		return
	}

	data, msg, code := serindex.FindItemInfo(itemId)

	utils.ResponseWriter(data, msg, code, w)
}

//查询所有货物信息
func FindAllItemInfo(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	data, msg, code := serindex.FindAllItemInfo()

	utils.ResponseWriter(data, msg, code, w)
}
