package main

import (
	"log"
	"net/http"
	"path"

	"./com/controllers/index"
	"./com/controllers/login"
	"github.com/gorilla/mux"
)

func main() {
	router := mux.NewRouter().StrictSlash(true)

	// router.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
	// 	w.Write([]byte("无效的地址,错误的访问!"))
	// })
	/**
	 * 处理静态资源文件
	 */
	router.Handle("/css/{.+}", FileHandler{}).Methods("GET")
	router.Handle("/imgs/{.+}", FileHandler{}).Methods("GET")
	router.Handle("/js/{.+}", FileHandler{}).Methods("GET")
	//----------------------------------登录页面---------------------------------
	//跳转登录界面
	router.HandleFunc("/", login.Login)
	router.HandleFunc("/login", login.Login)
	router.HandleFunc("/play", login.Play)
	//跳转密码修改页面
	router.HandleFunc("/changepwd", login.Changepwd)
	//跳转注册页面
	router.HandleFunc("/regist", login.Regist)
	router.HandleFunc("/index", login.Index)
	//--------注册api----------
	//登录认证
	router.HandleFunc("/api/authentication", login.ApiAuthentication)
	//注册
	router.HandleFunc("/api/regist", login.ApiRegist)
	//修改密码
	router.HandleFunc("/api/changepwd", login.ApiChangepwd)

	//-------------------------------------前后端分离接口----------------------------------------------
	//添加货物出入仓记录
	router.HandleFunc("/api/data/addRecords", index.AddRecords)
	//查询所有货物每天的统计
	router.HandleFunc("/api/data/findAllCount", index.FindAllCount)
	//查看单个的货物详情
	router.HandleFunc("/api/data/findOneDetails", index.FindOneDetails)
	//导出excel表格
	router.HandleFunc("/api/data/findAllCountXlsx", index.FindAllCountXlsx)
	//查询所有货物仓库剩余量的统计
	router.HandleFunc("/api/data/findInventory", index.FindInventory)
	//查询个人每日统计和总体统计，总仓库的每日统计和总体统计
	router.HandleFunc("/api/data/statistical", index.Statistical)
	//查询个人总体统计,每日的详细数据统计量
	router.HandleFunc("/api/data/statisticalself", index.StatisticalSelf)
	//查询所有员工详细统计信息
	router.HandleFunc("/api/data/permsInfo", index.PermsInfo)
	//查询所有员工信息
	router.HandleFunc("/api/data/userUpd", index.UserUpd)
	//修改员工信息
	router.HandleFunc("/api/data/userlist", index.Userlist)
	//删除员工信息
	router.HandleFunc("/api/data/deluser", index.Deluser)
	//增加货物信息
	router.HandleFunc("/api/data/addItemInfo", index.AddItemInfo)
	//增加货物图片
	router.HandleFunc("/api/data/addItemPic", index.AddItemPic)
	//修改货物信息
	router.HandleFunc("/api/data/updItemInfo", index.UpdItemInfo)
	//删除货物信息
	router.HandleFunc("/api/data/delItemInfo", index.DelItemInfo)
	//查询货物信息
	router.HandleFunc("/api/data/findItemInfo", index.FindItemInfo)
	//查询所有货物信息
	router.HandleFunc("/api/data/findAllItemInfo", index.FindAllItemInfo)

	// router.HandleFunc("/api/xlsx/",)
	log.Println("服务器已启动，端口号10800")
	log.Fatal(http.ListenAndServe(":10800", &MyServer{router}))

}

/**
 * 处理静态资源文件
 */
type FileHandler struct {
}

func (f FileHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	prefix := "template"
	http.ServeFile(w, r, path.Join(prefix, r.URL.Path))
}

type MyServer struct {
	r *mux.Router
}

func (s *MyServer) ServeHTTP(rw http.ResponseWriter, req *http.Request) {
	if origin := req.Header.Get("Origin"); origin != "" {
		rw.Header().Set("Access-Control-Allow-Origin", origin)
		rw.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		rw.Header().Set("Access-Control-Allow-Headers",
			"Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
	}
	s.r.ServeHTTP(rw, req)
	log.Println(req.URL)
}
