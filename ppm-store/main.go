package main

import (
	"./com/controllers/index"
	"./com/controllers/login"
	"github.com/gorilla/mux"
	"log"
	"net/http"
	"path"
)

func main() {
	router := mux.NewRouter().StrictSlash(true)

	// router.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
	// 	w.Write([]byte("错误的访问!"))
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
