package conf

//服务器上的地址
var (
	Mysql    = "root:root@1234@tcp(www.store.pp:3306)/ppm?charset=utf8" //mysql mryl 数据源
	XlsxPath = "/opt/bysj/xlsx/file.xlsx"                               //服务器的路径 //服务上该路径必须有这个文件，可以为空，但是必须要有，作为每次文件的下载引用
	Pic      = "/opt/nginx/html/bysj/imgs/"                             //服务器上的pic地址
)
