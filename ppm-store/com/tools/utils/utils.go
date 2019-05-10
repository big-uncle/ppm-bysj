// package main

package utils

import (
	"crypto/md5"
	"crypto/tls"
	"encoding/hex"
	"encoding/json"
	"io"
	"io/ioutil"
	"log"
	"math/rand"
	"mime/multipart"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/mozillazg/go-pinyin"
	"github.com/snluu/uuid"
)

/**
*  获取有文件上传的表单的参数
 */
func GetMultiParam(r *http.Request, paramName string) (multipart.File, error) {
	file, _, err := r.FormFile(paramName)
	if err != nil {
		return nil, err
	}
	return file, err
}

// 打印日志
func Println(file string, line int, text string) {
	log.Println(file+" "+strconv.Itoa(line)+"行：", text)
}
func PostParam(r *http.Request) map[string]string {
	r.ParseForm()
	var params map[string]string
	body, _ := ioutil.ReadAll(r.Body)
	json.Unmarshal(body, &params)
	return params
}
func GetParam(r *http.Request, paramName string) string {
	var param string
	if len(r.Form[paramName]) > 0 {
		param = r.Form[paramName][0]
	}
	return param
}

func ResponseWriter(data interface{}, msg string, code string, w http.ResponseWriter) {

	newRes := map[string]interface{}{"data": data, "msg": msg, "code": code}
	//将对象转为字节，并得到转换结果
	result, err := json.Marshal(newRes)
	if err != nil {
		result = []byte{}
	}
	w.Write(result)
}

//获取请求中所有参数
func GetParams(r *http.Request) *map[string]string {
	r.ParseForm()
	var params map[string]string
	for k, v := range r.Form {
		if len(v) > 0 {
			params[k] = v[0]
		}
	}
	return &params
}

func GetUUID() string {
	return strings.Replace(uuid.Rand().Hex(), "-", "", -1)
}

func GetFormatTime() string {
	return GenerateGSTTime().Format("2006-01-02 15:04:05")
}

func GetFormatDate() string {
	return GenerateGSTTime().Format("2006-01-02")
}

func GetTimestamp() string {
	return strconv.FormatInt(GenerateGSTTime().UnixNano()/1e6, 10)
}

/**
 * 生成随即字符串
 */
func GenerateMixed(n int) string {
	chars := []byte("0123456789abcdefghijklmnopqrstuvwxyz")
	var res []byte
	for i := 0; i < n; i++ {
		id := rand.Intn(len(chars) - 1)
		res = append(res, chars[id])
	}
	return string(res)
}

/**
 * 生成随即数字
 */
func GenerateNum(n int) string {
	chars := []byte("0123456789")
	var res []byte
	for i := 0; i < n; i++ {
		id := rand.Intn(len(chars) - 1)
		res = append(res, chars[id])
	}
	return string(res)
}

/**
 * 生成订单号
 */
func GenerateOrderId() string {
	tm := GenerateGSTTime()
	return strconv.FormatInt(tm.UnixNano()/1e6, 10) + GenerateNum(4)
}

/**
 * md5 加密
 */
func GetMd5(str string) string {
	//密码加密
	m5 := md5.New()
	m5.Write([]byte(str))
	s := m5.Sum(nil)
	newS := hex.EncodeToString(s)
	return newS
}

/**
* 获取往前30天的日期数组
 */
func GetFrontDate(num int) (results []interface{}) {
	var i int64 = int64(num - 1)
	//获取时间戳
	timestamp := GenerateGSTTime().Unix()
	for ; i >= 0; i-- {
		//格式化为字符串,tm为Time类型
		tm := time.Unix(timestamp-i*24*60*60, 0)
		results = append(results, tm.Format("2006-01-02"))
	}

	return results
}

//根据一个时间段获取段内所有日期 666666666
func GetDatePeriods(startDate, endDate string) (results []interface{}) {
	tm1, _ := time.ParseInLocation("2006-01-02", startDate, time.Local)
	tm2, _ := time.ParseInLocation("2006-01-02", endDate, time.Local)
	startTimestamp := tm1.Unix()
	endTimestamp := tm2.Unix()
	for {
		if startTimestamp > endTimestamp {
			break
		}
		tm := time.Unix(startTimestamp, 0)
		results = append(results, tm.Format("2006-01-02"))
		startTimestamp += 24 * 60 * 60
	}
	return results
}

//根据日期数组拼接mysql虚拟时间表
func GetVTable(dateList []interface{}) string {
	var vTable string
	for k, v := range dateList {
		if k == 0 {
			vTable += "SELECT '" + v.(string) + "' stsDate FROM DUAL "
		} else {
			vTable += " UNION SELECT '" + v.(string) + "' stsDate FROM DUAL "
		}
	}
	return vTable
}

//根据诊所编号数组数组拼接mysql虚拟诊所表
func GetClinicVTable(clinicList []string) string {
	var vTable string
	for k, v := range clinicList {
		if k == 0 {
			vTable += "SELECT '" + v + "' clinicId FROM DUAL "
		} else {
			vTable += " UNION SELECT '" + v + "' clinicId FROM DUAL "
		}
	}
	return vTable
}

// SELECT '2017-07-01' d FROM DUAL
// UNION
// SELECT '2017-07-02' d FROM DUAL
// UNION
// SELECT '2017-07-03' d FROM DUAL
// UNION
// SELECT '2017-07-04' d FROM DUAL
// UNION
// SELECT '2017-07-05' d FROM DUAL
// UNION
// SELECT '2017-07-24' d FROM DUAL

/**
 * 获取30天的日期数组
 */
func GetDate(num int) (results []interface{}) {
	var i int64 = 0
	//获取时间戳
	timestamp := GenerateGSTTime().Unix()
	for ; i < int64(num); i++ {
		//格式化为字符串,tm为Time类型
		tm := time.Unix(timestamp+i*24*60*60, 0)
		results = append(results, tm.Format("2006-01-02"))
	}

	return results
}

/**
 * 根据天得到月的数组
 */
func MonthsByDays(days []interface{}) (results []interface{}) {
	var months []interface{}
	for i := 0; i < len(days); i++ {
		month := string([]byte(days[i].(string))[:7])
		if !IsExist(months, month) {
			months = append(months, month)
		}
	}
	return months
}

/**
 * 判断元素是否包含在数组中
 */
func IsExist(arr []interface{}, item interface{}) bool {
	if arr == nil {
		return false
	}
	if item == nil {
		return false
	}

	if len(arr) == 0 {
		return false
	}

	var result bool = false
	for i := 0; i < len(arr); i++ {
		if arr[i] == item {
			result = true
		}
	}
	return result
}

//获取传入日期前一天的日期
func GetTomorrow(endTime string) string {
	//string转化为时间，layout必须为 "2006-01-02 15:04:05"
	t, _ := time.Parse("2006-01-02 15:04:05", endTime+" 00:00:00")
	resT := t.AddDate(0, 0, 1)
	return resT.Format("2006-01-02")
}

/**
 * 生成 xls 文件名
 * param UserName 管理员账号
 */
func GetXlsDate() string {
	xlsName := strings.Replace(GetFormatTime(), ":", "", -1) + ".xls"
	xlsName = strings.Replace(xlsName, "-", "", -1)
	xlsName = strings.Replace(xlsName, " ", "", -1)
	return xlsName
}

// 获取当月剩余日期 GetRemMonthDays []string
func GetRemMonthDays(workDate string) []string {
	// 获取上月的开始和结束日期
	// year, month, _ := GenerateGSTTime().Date()
	// thisMonth := time.Date(year, month, 1, 0, 0, 0, 0, time.Local)
	// start := thisMonth.AddDate(0, -1, 0).Format(DATE_FORMAT)
	// end := thisMonth.AddDate(0, 0, -1).Format(DATE_FORMAT)
	// timeRange := fmt.Sprintf("%s~%s", start, end)
	// fmt.Println(timeRange)

	DATE_FORMAT := "2006-01-02"
	var result []string
	nowMonth := GenerateGSTTime().Format(DATE_FORMAT)[0:7]
	var year, startDay int
	var month time.Month
	if workDate == nowMonth {
		year, month, startDay = GenerateGSTTime().Date()
	} else {
		the_time, _ := time.Parse(DATE_FORMAT, workDate+"-01")
		year, month, startDay = the_time.Date()
	}
	//获取当月1号;获取当月+1，日期-1
	endDay := time.Date(year, month, 1, 0, 0, 0, 0, time.Local).AddDate(0, +1, -1).Day()
	for startDay <= endDay {
		result = append(result, time.Date(year, month, startDay, 0, 0, 0, 0, time.Local).Format(DATE_FORMAT))
		startDay++
	}
	return result
}

/**
 * 生成北京时区格式的时间
 */
func GenerateGSTTime() time.Time {
	tm := time.Now()
	local, err := time.LoadLocation("UTC") //美国时区
	if err != nil {
		return tm
	} else {
		ntm := tm.In(local)
		h, _ := time.ParseDuration("1h")
		// 8个小时前
		ntm = ntm.Add(8 * h)
		return ntm
	}
}

func HttpsGet(url string) (*http.Response, error) {
	tr := &http.Transport{
		TLSClientConfig: &tls.Config{InsecureSkipVerify: true},
	}
	client := &http.Client{Transport: tr}
	return client.Get(url)
}

func IsWeeks(workDate string, weeks []interface{}) bool {
	flag := false
	if len(weeks) == 7 || len(weeks) == 0 {
		return true
	}
	t, _ := time.Parse("2006-01-02", workDate)
	s := t.Weekday().String()
	var workDateWeek string
	switch s {
	case "Monday":
		workDateWeek = "星期一"
	case "Tuesday":
		workDateWeek = "星期二"
	case "Wednesday":
		workDateWeek = "星期三"
	case "Thursday":
		workDateWeek = "星期四"
	case "Friday":
		workDateWeek = "星期五"
	case "Saturday":
		workDateWeek = "星期六"
	case "Sunday":
		workDateWeek = "星期日"
	}
	for _, v := range weeks {
		vstr := v.(string)
		if workDateWeek == vstr {
			flag = true
			break
		}
	}
	return flag
}

//获取上周的日期-时间戳
func Lastweek() int64 {
	var n int64
	a := GenerateGSTTime()
	s := a.Weekday().String()
	switch s {
	case "Monday":
		n = 0
	case "Tuesday":
		n = 1
	case "Wednesday":
		n = 2
	case "Thursday":
		n = 3
	case "Friday":
		n = 4
	case "Saturday":
		n = 5
	case "Sunday":
		n = 6
	}
	b := a.Unix() - n*24*60*60 //获取礼拜一的时间戳
	// return GetWeekFrontDateArr(b, 7) //获取前七天的日期
	return b
}

//获取一周的日期
func GetWeekFrontDateArr(timestamp int64, i int64) (results []interface{}) {
	//获取时间戳
	var _results []interface{}
	for ; i > 0; i-- {
		//格式化为字符串,tm为Time类型
		tm := time.Unix(timestamp-(i+1)*24*60*60, 0)
		_results = append(_results, tm.Format("2006-01-02"))
	}

	return _results
}

/*
*获取当前时间的第二天
*parpm times  2017-11-25
 */
func GetFormatnextDate(times string) string {
	toBeCharge := times + " " + "00:00:00"
	timeLayout := "2006-01-02 15:04:05"
	loc, _ := time.LoadLocation("Local")                            //重要：获取时区
	theTime, _ := time.ParseInLocation(timeLayout, toBeCharge, loc) //使用模板在对应时区转化为time.time类型
	sr := theTime.Unix()                                            //转化为当前时间戳 类型是int64
	int64, _ := strconv.ParseInt("86400", 10, 64)                   //获取一天的秒数 int64
	timestamp := sr + int64
	return time.Unix(timestamp, 0).Format("2006-01-02") //设置时间戳 使用模板格式化为日期字符串

}

/*
*	获取当月最后一天
*
 */
func GetEndDay() string {
	year, month, _ := time.Now().Date()
	thisMonth := time.Date(year, month, 1, 0, 0, 0, 0, time.Local)
	// start := thisMonth.AddDate(0, -1, 0).Format(DATE_FORMAT)
	end := thisMonth.AddDate(0, 1, -1).Format("2006-01-02")
	return end
}

/*
*	获取当月第一天
*
 */
func GetStartDay() string {
	year, month, _ := time.Now().Date()
	thisMonth := time.Date(year, month, 1, 0, 0, 0, 0, time.Local)
	start := thisMonth.Format("2006-01-02")
	return start
}

/*
*获取N月前后的日期
 */
func GetmouDay(m int) string {
	t := time.Now()
	year, month, day := t.Date()
	thisMonthFirstDay := time.Date(year, month, day, 1, 1, 1, 1, t.Location())
	theTime := thisMonthFirstDay.AddDate(0, m, 0)
	timestamp := theTime.Unix()
	_time := time.Unix(timestamp, 0).Format("2006-01-02")
	return _time
}

//生存病例编号
func CreatecaseId() string {
	_time := GenerateGSTTimestamp()
	return strconv.FormatInt(_time, 10) + strconv.Itoa(rand.Intn(10000))
}

//从今日以后的3个月
func ThreeGetFormatDate() (string, string, string) {
	now := time.Now()
	yesterday := now.AddDate(0, -1, 0)
	bef_yes := now.AddDate(0, +1, 0)
	y := now.Format("2006-01")
	m := yesterday.Format("2006-01")
	d := bef_yes.Format("2006-01")
	return y, m, d
}

/**
 * 生成北京时区格式的时间戳
 */
func GenerateGSTTimestamp() int64 {
	tm := GenerateGSTTime()
	return tm.UnixNano() / 1e6
}

/**
 * 判断元素是否包含在数组(字符串数组)中
 */
func StringIsExist(arr []string, item interface{}) bool {
	if arr == nil {
		return false
	}
	if item == nil {
		return false
	}

	if len(arr) == 0 {
		return false
	}

	var result bool = false
	for i := 0; i < len(arr); i++ {
		if arr[i] == item {
			result = true
		}
	}
	return result
}

//POST请求
func HttpsPost(url string, contentType string, body io.Reader) (*http.Response, error) {
	tr := &http.Transport{
		TLSClientConfig: &tls.Config{InsecureSkipVerify: true},
	}
	client := &http.Client{Transport: tr}

	return client.Post(url, contentType, body)
}
func GetFormatbeforet_Date(times string, i int) string { //获取i天前的日期
	toBeCharge := times + " " + "00:00:00"
	timeLayout := "2006-01-02 15:04:05"
	loc, _ := time.LoadLocation("Local")                            //重要：获取时区
	theTime, _ := time.ParseInLocation(timeLayout, toBeCharge, loc) //使用模板在对应时区转化为time.time类型
	sr := theTime.Unix()
	timeshijiancuo := 86400 * i                                        //转化为当前时间戳 类型是int64
	int64, _ := strconv.ParseInt(strconv.Itoa(timeshijiancuo), 10, 64) //获取一天的秒数 int64
	timestamp := sr - int64
	return time.Unix(timestamp, 0).Format("2006-01-02") //设置时间戳 使用模板格式化为日期字符串

}
func GetFormatbafert_Date(times string, i int) string { //获取i天前的日期
	toBeCharge := times + " " + "00:00:00"
	timeLayout := "2006-01-02 15:04:05"
	loc, _ := time.LoadLocation("Local")                            //重要：获取时区
	theTime, _ := time.ParseInLocation(timeLayout, toBeCharge, loc) //使用模板在对应时区转化为time.time类型
	sr := theTime.Unix()
	timeshijiancuo := 86400 * i                                        //转化为当前时间戳 类型是int64
	int64, _ := strconv.ParseInt(strconv.Itoa(timeshijiancuo), 10, 64) //获取一天的秒数 int64
	timestamp := sr + int64
	return time.Unix(timestamp, 0).Format("2006-01-02") //设置时间戳 使用模板格式化为日期字符串

}

//获取一周的日期
func GetWeekFrontDate(timestamp int64, i int64) (results []interface{}) {
	//获取时间戳
	var _results []interface{}
	for ; i >= 0; i-- {
		//格式化为字符串,tm为Time类型
		tm := time.Unix(timestamp-i*24*60*60, 0)
		sw := map[string]string{
			"stsDate": tm.Format("2006-01-02"),
		}
		_results = append(_results, sw)
	}

	return _results
}
func Timetimestamp(times string) int64 {
	toBeCharge := times + " " + "00:00:00"
	timeLayout := "2006-01-02 15:04:05"
	loc, _ := time.LoadLocation("Local")                            //重要：获取时区
	theTime, _ := time.ParseInLocation(timeLayout, toBeCharge, loc) //使用模板在对应时区转化为time.time类型
	sr := theTime.Unix()
	return sr
}

//根据日期数组拼接mysql虚拟时间表
func GetVTable_moni(dateList []interface{}) string {
	var vTable string
	for k, v := range dateList {
		_v := v.(map[string]string)
		if k == 0 {
			vTable += "SELECT '" + _v["workDate"] + "' workDate FROM DUAL "
		} else {
			vTable += " UNION SELECT '" + _v["workDate"] + "' workDate FROM DUAL "
		}
	}
	return vTable
}

//获取一周的日期
func GetFront_Date(timestamp int64, i int64) (results []interface{}) {
	//获取时间戳
	var _results []interface{}
	for ; i >= 0; i-- {
		//格式化为字符串,tm为Time类型
		tm := time.Unix(timestamp-i*24*60*60, 0)
		sw := map[string]string{
			"workDate": tm.Format("2006/01/02"),
		}
		_results = append(_results, sw)
	}

	return _results
}

//汉语转拼音缩写 首字母大写
func ChinesePinyin(chinese string) string {
	var _pinyin string
	_fun := pinyin.NewArgs()
	pinyinlist := pinyin.Pinyin(chinese, _fun)
	for _, value := range pinyinlist {
		for _, _value := range value {
			_pinyin += strings.ToUpper(_value)[0:1]
		}
	}
	return _pinyin
}

/**
 * 生成北京时区格式的时间字符串
 */
func GenerateGSTDateTime() string {
	tm := GenerateGSTTime()

	return tm.Format("2006-01-02 15:04:05")
}
