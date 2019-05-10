package conf

//本地的地址
var (
	Mysql     = "root:123456a@tcp(127.0.0.1:3306)/bishe?charset=utf8" //mysql mryl 数据源
	RedisHost = "127.0.0.1:6379"                                      // redis 地址
	// XlsxPath  = "C:/Users/A-杰/Desktop/ppm-bysj/ppm-store/xlsx/file1.xlsx" //自己笔记本的路径
	XlsxPath = "C:/Users/A·杰/Desktop/毕设/新版毕设/ppm-bysj/show-ppm/public/imgs/file1.xlsx" //公司电脑的路径
	Pic      = "C:/Users/A·杰/Desktop/毕设/新版毕设/ppm-bysj/show-ppm/public/imgs/"           //这只是存的地址，取得话因为react只支持 相对路径，我们就只能 ./imgs/写死了 服务器和本地都是写死

)

// //服务器上的地址
// var (
// 	Mysql     = "root:123456a@tcp(127.0.0.1:3306)/bishe?charset=utf8" //mysql mryl 数据源
// 	RedisHost = "127.0.0.1:6379"                                      // redis 地址
// 	XlsxPath  = "/xlsx/file1.xlsx"                                    //服务器的路径
// 	Pic       = "/go/ppm/ppm-bysj/nginx/www/imgs/"                    //服务器上的pic地址
// )
