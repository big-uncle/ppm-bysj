package conf

//服务器上的地址
var (
	Mysql    = "root:123456a@tcp(127.0.0.1:3306)/bishe?charset=utf8" //mysql mryl 数据源
	XlsxPath = "/xlsx/file1.xlsx"                                    //服务器的路径 //服务上该路径必须有这个文件，可以为空，但是必须要有，作为每次文件的下载引用
	Pic      = "/go/ppm/ppm-bysj/nginx/www/imgs/"                    //服务器上的pic地址
)
