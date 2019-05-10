import React, { Component } from 'react';
// 引入 ECharts 主模块
import echarts from 'echarts';
import * as conf from "../utils/conf";
// 引入折线图
//import 'echarts/lib/chart/line';
//import 'echarts/lib/chart/bar';
// 引入提示框和标题组件
//import 'echarts/lib/component/tooltip';
//import 'echarts/lib/component/title';

let userName = localStorage.getItem('userName')
let userId = localStorage.getItem('userId')
let account = localStorage.getItem('account')
class WeekcCharts extends Component {
       
    state = { statisticalself: [] }
    componentWillMount(){
        fetch(conf.apiurl()+'/api/data/statisticalself?userId='+userId+'&account='+account).then(res => {
            res.json().then( obj=>{
               this.setState({//给state 这个也有延迟
                    statisticalself: obj.data,
                });
            })
           
    })
    }
    componentDidMount() {
        this.options()
    }
    componentDidUpdate() {
        this.options()
    }
    options = () => {
            // 基于准备好的dom，初始化echarts实例
            // const DoctorCount  = this.props.state;
            // var nameList =[]
            // var newappList =[]
            // var oldappList =[]
            // if(DoctorCount.length>10){
            //     for(var i = 0;i<10;i++){
            //         nameList[i] = DoctorCount[i].doctor_name
            //         newappList[i] = DoctorCount[i].newapp
            //         oldappList[i] = DoctorCount[i].oldapp
            //     }
            // }else{
            //     for(var i = 0;i<DoctorCount.length;i++){
            //         nameList[i] = DoctorCount[i].doctor_name
            //         newappList[i] = DoctorCount[i].newapp
            //         oldappList[i] = DoctorCount[i].oldapp
            //     }
            // } 
            let myChart = echarts.init(document.getElementById('wordId1'));
          let option = {
            title : {
                text : '时间坐标统计图',
                subtext : '入职至今'
            },
            tooltip : { //控制指向显示具体的数据的，  跟随你鼠标走
                trigger: 'item',
                formatter : function (params) {
                    let date = new Date(params.value[0]);
                   let data = date.getFullYear() + '-'
                           + (date.getMonth() + 1) + '-'
                           + date.getDate() + ' '
                        //    + date.getHours() + ':'   //去掉小时和分钟
                        //    + date.getMinutes();
                    return data + '<br/>统计量为:'
                           + params.value[1] + ', '  
                        //    + params.value[2]; //去掉圈圈大小
                }
            },
            toolbox: { //控制上面的选项的
                show : true,
                feature : {
                    mark : {show: true},
                    dataView : {show: true, readOnly: false},
                    restore : {show: true},
                    saveAsImage : {show: true},
                    magicType : {show: true, type: ['line', 'bar']},
                }
            },
            dataZoom: {//控制底下的滑动数据预览的
                show: true,
                // show: false,
                start : 70
            },
            legend : {
                // data : ['series1']
                data : [userName]
            },
            grid: { //控制数据时间轴和下面的数据zoom预览的间距
                y2: 80
            },
            xAxis : [
                {
                    type : 'time',
                    splitNumber:10 //控制一行显示多少个时间轴
                    // splitNumber:4
                }
            ],
            yAxis : [
                {
                    type : 'value'
                }
            ],
            series : [
                {
                    // name: 'series1',
                    name: userName,
                    type: 'line',//线形图，我把上面可选类型的数组放上去了，那么这里设置就是默认的，如果不设置就是默认柱状图
                    // type: 'pie',//饼状图//这里貌似不太支持这种
                    // type: 'bar',//柱状图    
                    showAllSymbol: true, //显示不显示圆圈圈
                    // showAllSymbol: false,
                    symbolSize: function (value){ //也是控制那个圆圈圈点的大小的
                        return Math.round(value[2]/10) + 2;
                        // return 100;
                    },
                    data: this.state.statisticalself
                    //  (function () {
                    //     var d = [];
                    //     var len = 0;
                    //     var now = new Date();
                    //     var value;
                    //     // while (len++ < 200) {
                    //     //     d.push([ //这里就是存放数据的
                    //     //         new Date(2014, 9, 1, 0, len * 10000),//这个就是底下的日期，必须与下面的数据对应  Tue Oct 07 2014 22:40:00 GMT+0800 (中国标准时间)
                    //     //         (Math.random()*100).toFixed(2) - 0,//控制最高数目的 85.9 取小数点一位 100以内
                    //     //         (Math.random()*100).toFixed(2) - 0//控制气泡大小的
                    //     //     ]);
                    //     //     if (len ===199){
                    //     //         console.log('原装数据',d)
                    //     //     }
                    //     // }
                    //     // return this.state.list;
                    //     return this.state.statisticalself;
                    // })()
                }
            ]
        };
                            
                                
                                
            myChart.setOption(option);
            // clearInterval(timeTicket);
            // timeTicket = setInterval(function (){
            //     option.series[0].data[0].value = (Math.random()*100).toFixed(2) - 0;
            //     myChart.setOption(option,true);
            // },2000) 
    }
    render() { 
        return (
            <div id="wordId1" style={{ width: "100%", height: "230px",marginBottom:'3px' }}></div>
        );
    }
}
export default WeekcCharts;