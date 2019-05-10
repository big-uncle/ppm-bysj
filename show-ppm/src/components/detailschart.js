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
class Detailschart extends Component {
    state={ allDetails: {} }
    componentWillMount(){
        fetch(conf.apiurl()+'/api/data/permsInfo').then(res => {
            res.json().then( obj=>{
               this.setState({//给state 这个也有延迟
                allDetails: obj.data,
                });
            })  
    })
    }
    componentDidUpdate() {
        this.options()
//         setTimeout(() => {
// // console.log('this.state.allDetails为',this.state.allDetails.data)
//         },100)
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
            let myChart = echarts.init(document.getElementById('wordId2'));
 let option = {
    title : {
        text : '每周一0:00重置',
        // subtext : '上一周总体详情',
        y: 'top', //存在的位置//默认也是上
    },
    tooltip : {  //设置浮动的详细信息条目
        trigger: 'axis',//这个是指到数据的Y轴上都会给你显示
        // trigger: 'item',//这个是指到具体的图标上
    },
    toolbox: {  //控制工具栏
        show : true,
        // y: 'bottom', //存在的位置
        y: 'top', //存在的位置
        feature : {
            // mark : {show: true},
            dataView : {show: true, readOnly: false},
            magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']}, //线，柱，堆，铺
            restore : {show: true},
            saveAsImage : {show: true}
        }
    },
    calculable : true,
    legend: {   //控制底下的选项
        y: 'bottom', 
        // data:['直接访问','邮件营销','联盟广告','视频广告','搜索引擎','百度','谷歌','必应','其他']
        data:this.state.allDetails.name
    },
    xAxis : [  //控制时间轴底下的时间
        {
            type : 'category',
            splitLine : {show : false},
            data : ['周一','周二','周三','周四','周五','周六','周日']
        }
    ],
    yAxis : [  //坐标y轴位置
        {
            type : 'value',
            position: 'right'
        }
    ],
    series : this.state.allDetails.data 
    // series : (function () {
    //     var datainfo = [];
    //     datainfo = this.state.allDetails.data 
    // datainfo.push( //这里就是存放数据的
    //     {
    //         name:'搜索引擎细分', //设置左上角的圆形图
    //         type:'pie',//饼状图 这里不支持线性图,柱状图 
    //         tooltip : {
    //             // trigger: 'item',
    //             formatter: '{a} <br/>{b} : {c} ({d}%)'
    //         },
    //         // center: [160,130],
    //         center: [98,110], //设置位置
    //         radius : [0, 50],
    //         itemStyle :　{
    //             normal : {
    //                 labelLine : {
    //                     length : 8 //设置解释线条的长度
    //                 }
    //             }
    //         },
    //         data: this.state.allDetails.week
    //     }
    //             );
    //             console.log('狗娃子',datainfo)
    //     return datainfo 
    // })()
    
    // {
    //     name:'搜索引擎细分', //设置左上角的圆形图
    //     type:'pie',//饼状图
    //     // type:'bar',//柱状图  这里不支持
    //     // type:'line',//线性图  这里不支持
    //     tooltip : {
    //         trigger: 'item',
    //         formatter: '{a} <br/>{b} : {c} ({d}%)'
    //     },
    //     // center: [160,130],
    //     center: [98,110], //设置位置
    //     radius : [0, 50],
    //     itemStyle :　{
    //         normal : {
    //             labelLine : {
    //                 length : 8 //设置解释线条的长度
    //             }
    //         }
    //     },
    //     data:[
    //         {value:1048, name:'百度'},
    //         {value:251, name:'谷歌'},
    //         {value:147, name:'必应'},
    //         {value:102, name:'其他'}
    //     ]
    // }
    // series : [   //数据，注意左上的饼状图和柱状图是在一起渲染的
    //     {
    //         name:'直接访问',
    //         type:'bar',
    //         data:[320, 332, 301, 334, 390, 330, 320]
    //     },
    //     {
    //         name:'邮件营销',
    //         type:'bar',
    //         tooltip : {trigger: 'item'}, //这个是设置合并项的
    //         stack: '广告',//这个是设置合并的总项目
    //         data:[120, 132, 101, 134, 90, 230, 210]
    //     },
    //     {
    //         name:'联盟广告',
    //         type:'bar',
    //         tooltip : {trigger: 'item'},
    //         stack: '广告',
    //         data:[220, 182, 191, 234, 290, 330, 310]
    //     },
    //     {
    //         name:'视频广告',
    //         type:'bar',
    //         tooltip : {trigger: 'item'},
    //         stack: '广告',
    //         data:[150, 232, 201, 154, 190, 330, 410]
    //     },
    //     {
    //         name:'搜索引擎',
    //         // type:'line',
    //         type:'bar',
    //         // data:[862, 1018, 964, 1026, 1679, 1600, 1570]
    //         data:[2, 3, 4, 6, 7, 8, 45]
    //     },

        // {
        //     name:'搜索引擎细分', //设置左上角的圆形图
        //     type:'pie',//饼状图
        //     // type:'bar',//柱状图  这里不支持
        //     // type:'line',//线性图  这里不支持
        //     tooltip : {
        //         trigger: 'item',
        //         formatter: '{a} <br/>{b} : {c} ({d}%)'
        //     },
        //     // center: [160,130],
        //     center: [98,110], //设置位置
        //     radius : [0, 50],
        //     itemStyle :　{
        //         normal : {
        //             labelLine : {
        //                 length : 8 //设置解释线条的长度
        //             }
        //         }
        //     },
        //     data:[
        //         {value:1048, name:'百度'},
        //         {value:251, name:'谷歌'},
        //         {value:147, name:'必应'},
        //         {value:102, name:'其他'}
        //     ]
        // }
    // ]
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
<div id="wordId2" style={{width: "100%", height: "688px",paddingBottom:'18px'}}></div>
);
}
}
export default Detailschart;