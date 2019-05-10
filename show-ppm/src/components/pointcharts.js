import React, { Component } from 'react';
import echarts from 'echarts';
// import * as conf from "../utils/conf";

class Pointcharts extends Component {
    state = { mytoday: 0 };
    componentDidMount() {
          this.options()
    }
    componentDidUpdate() {
        this.options()
    }
    options = () => {
            let myChart = echarts.init(document.getElementById('wordId'));
            let option = {
                tooltip : {
                    formatter: "{a} <br/>{b} : {c}%"
                },
                toolbox: {
                    show : true,
                    feature : {
                        mark : {show: true},
                        // restore : {show: true},//展示刷新的那个按钮
                        saveAsImage : {show: true}
                    }
                },
                series : [
                    {
                        name:'业务指标',
                        type:'gauge',
                        startAngle: 180,
                        endAngle: 0,
                        center : ['50%', '90%'],    // 默认全局居中
                        radius : 200,
                        axisLine: {            // 坐标轴线
                            lineStyle: {       // 属性lineStyle控制线条样式
                                color: [
                                    [0.2, '#CD5C5C'], //控制圆饼颜色和百分比
                                    [0.8, '#008080'],
                                    [1, '#20B2AA']
                                ],
                                width: 120
                            },
                        },
                        axisTick: {            // 坐标轴小标记
                            splitNumber: 10,   // 每份split细分多少段
                            length :120,        // 属性length控制线长
                            show : false,
                        },
                        splitLine:{
                            show: true,
                            length :0,
                            lineStyle: {
                                color: '#eee',
                                width: 20,
                                type: 'solid'
                            }
                        },     
                        axisLabel: {           // 坐标轴文本标签，详见axis.axisLabel
                            formatter: function(v){
                                switch (v+''){
                                    case '10': return '低';
                                    case '50': return '中';
                                    case '90': return '高';
                                    default: return '';
                                }
                            },
                            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                color: '#fff',
                                fontSize: 15,
                                fontWeight: 'bolder'
                            }
                        },
                        pointer:  {
                            length : '80%',
                            width : 8,
                            color : '#fff'
                        }, 
                        title : {
                            show : true,
                            offsetCenter: [0, '-60%'],       // x, y，单位px
                            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                color: '#fff',
                                fontSize: 20
                            }
                        },
                        detail : {
                            show : true,
                            backgroundColor: 'rgba(0,0,0,0)',
                            borderWidth: 0,
                            borderColor: '#ccc',
                            width: 100,
                            height: 40,
                            offsetCenter: [0, -40],       // x, y，单位px
                            formatter:'{value}',
                            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                fontSize : 20
                            }
                        },
                     
                        // data:[{value: this.state.mytoday, name: '完成率'}]
                        data:[{value: this.props.mytoday, name: '处理量'}]
                    }
                ]
            };
            myChart.setOption(option);
    }
    render() { 
        return (
            <div id="wordId"  style={{ width: "100%", height: "230px",marginBottom:'3px' }}></div>
        );
    }
}
export default Pointcharts;