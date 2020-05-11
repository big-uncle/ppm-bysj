package login

import (
	"html/template"
	"log"
	"net/http"

	"ppm/ppm-store/com/service/login"
	"ppm/ppm-store/com/tools/utils"
)

//玩游戏
func Play(w http.ResponseWriter, r *http.Request) {
	t, err := template.ParseFiles("template/api/html/play.html")
	if err != nil {
		log.Println(err)
	}
	t.Execute(w, nil)
}

/**
 * 跳转登录界面
 */
func Login(w http.ResponseWriter, r *http.Request) {

	t, err := template.ParseFiles("template/api/html/login.html")
	if err != nil {
		log.Println(err)
	}
	t.Execute(w, nil)
}

/**
 * 跳转密码修改页面
 */
func Changepwd(w http.ResponseWriter, r *http.Request) {

	t, err := template.ParseFiles("template/api/html/changepwd.html")
	if err != nil {
		log.Println(err)
	}
	t.Execute(w, nil)
}

/**
 * 注册页面
 */
func Regist(w http.ResponseWriter, r *http.Request) {

	t, err := template.ParseFiles("template/api/html/regist.html")
	if err != nil {
		log.Println(err)
	}
	t.Execute(w, nil)
}

/**
 * 开始认证
 */
func ApiAuthentication(w http.ResponseWriter, r *http.Request) {
	//格式化参数
	r.ParseForm()

	account := utils.GetParam(r, "account")
	passwd := utils.GetParam(r, "passwd")

	result := login.Authentication(account, passwd)

	w.Write(result)

}

/**
 * 修改密码接口
 */
func ApiChangepwd(w http.ResponseWriter, r *http.Request) {
	//格式化参数
	r.ParseForm()
	account := utils.GetParam(r, "account")
	phone := utils.GetParam(r, "phone")
	newpwd := utils.GetParam(r, "newpwd")
	result := login.ApiChangepwd(account, phone, newpwd)
	w.Write(result)
}

/**
 * 注册接口
 */
func ApiRegist(w http.ResponseWriter, r *http.Request) {
	//格式化参数
	r.ParseForm()
	account := utils.GetParam(r, "account")
	name := utils.GetParam(r, "name")
	phone := utils.GetParam(r, "phone")
	newpwd := utils.GetParam(r, "newpwd")
	sex := utils.GetParam(r, "sex")
	log.Println(name)
	result := login.ApiRegist(phone, newpwd, account, name, sex)
	w.Write(result)
}

/*
 * 主页面
 */
func Index(w http.ResponseWriter, r *http.Request) {
	//格式化参数
	r.ParseForm()
	log.Println("我走index")
	t, err := template.ParseFiles("template/api/html/index.html")
	if err != nil {
		log.Println(err)
	}
	t.Execute(w, nil)
}
