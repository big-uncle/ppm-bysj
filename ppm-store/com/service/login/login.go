package login

import (
	"encoding/json"
	"log"

	"ppm/ppm-store/com/models/login"
)

/**
 * 开始认证
 */
func Authentication(account string, passwd string) []byte {
	userInfo1 := login.CheckUserAccount(account)
	log.Println(userInfo1)
	if len(userInfo1) == 0 {
		newRes := map[string]interface{}{"data": "", "msg": "该账户不存在", "success": false}
		result, err := json.Marshal(newRes)
		if err == nil {
			return result
		} else {
			return []byte{}
		}
	}
	userInfo := login.SelectUser(account, passwd)
	var msg string
	var success bool
	if len(userInfo) > 0 {
		msg = "登录成功"
		success = true
	} else if len(userInfo) == 0 {
		msg = "密码有误"
		success = false
	}
	newRes := map[string]interface{}{"data": userInfo, "msg": msg, "success": success}
	//将对象转为字节，并得到转换结果
	result, err := json.Marshal(newRes)
	if err == nil {
		return result
	} else {
		return []byte{}
	}
}

// 修改密码
func ApiChangepwd(account string, phone string, newpwd string) []byte {
	// account := ""
	userAccount := login.CheckUserAccount(account)
	if len(userAccount) == 0 {
		newRes := map[string]interface{}{"data": "", "msg": "没有找到该账户", "success": false}
		result, err := json.Marshal(newRes)
		if err == nil {
			return result
		} else {
			return []byte{}
		}
	}
	userInfo := login.CheckUserBind(phone, account)
	log.Println(userInfo)
	if len(userInfo) == 0 {
		newRes := map[string]interface{}{"data": "", "msg": "该账户的手机号与绑定时不一致", "success": false}
		result, err := json.Marshal(newRes)
		if err == nil {
			return result
		} else {
			return []byte{}
		}
	}
	count := login.ApiChangepwd(phone, newpwd)
	newRes := map[string]interface{}{}
	if count == 1 || count == 0 {
		newRes = map[string]interface{}{"data": count, "msg": "修改成功", "success": true}
	} else {
		newRes = map[string]interface{}{"data": count, "msg": "修改失败", "success": false}
	}
	// log.Println("影响的行数为", count)
	result, err := json.Marshal(newRes)
	if err == nil {
		return result
	} else {
		return []byte{}
	}
}

//注册
func ApiRegist(phone, newpwd, account, name, sex string) []byte {
	userInfo := login.CheckUserAccount(account)
	log.Println(userInfo)
	if len(userInfo) > 0 {
		newRes := map[string]interface{}{"data": "", "msg": "该账户名已存在", "success": false}
		result, err := json.Marshal(newRes)
		if err == nil {
			return result
		} else {
			return []byte{}
		}
	}
	userPhone := login.CheckUser(phone, account)
	if len(userPhone) > 0 {
		newRes := map[string]interface{}{"data": "", "msg": "该手机号已与其他账号绑定", "success": false}
		result, err := json.Marshal(newRes)
		if err == nil {
			return result
		} else {
			return []byte{}
		}
	}
	count, err := login.ApiRegist(phone, newpwd, account, name, sex)
	newRes := map[string]interface{}{}
	if err == nil {
		newRes = map[string]interface{}{"data": count, "msg": "注册成功", "success": true}
	} else {
		newRes = map[string]interface{}{"data": count, "msg": "注册失败", "success": false}
	}

	result, err := json.Marshal(newRes)
	if err == nil {
		return result
	} else {
		return []byte{}
	}
}
