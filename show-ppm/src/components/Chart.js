import React from "react";
import echarts from "echarts";
import loginCheck from "../utils/loginCheck";
import "antd/dist/antd.css";

class Chart extends React.Component {
  options = () => {
    const { list } = this.props;
    let dataTime = [];
    let dataRecommend = [];
    let dataBrowse = [];
    let dataAppointment = [];
    let dataShare = [];
    let dataFollow = [];
    if (list) {
      for (let i = list.length - 1; i >= 0; i--) {
        let times = list[i].stsDate;
        let recommend = parseInt(list[i].recommend);
        let browse = parseInt(list[i].browse);
        let appointment = parseInt(list[i].appointment);
        let share = parseInt(list[i].share);
        let follow = parseInt(list[i].follow);
        dataTime.push(times);
        dataRecommend.push(recommend);
        dataBrowse.push(browse);
        dataAppointment.push(appointment);
        dataShare.push(share);
        dataFollow.push(follow);
      }
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById("chartsId"));
      let option = {
        title: {
          text: "",
          subtext: ""
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: ["推荐量", "浏览量", "预约量", "分享量", "关注量"],
          x: "center",
          y: "bottom"
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            // dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ["line", "bar"] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        calculable: true,
        grid: {},
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            axisLabel: {
              formatter: function(value) {
                return value.substring(8, 10);
              },
              textStyle: {
                color: "blacK"
              }
            },
            data: dataTime
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ],
        series: [
          {
            name: "推荐量",
            type: "line",
            smooth: true,
            itemStyle: {
              normal: { color: "#0091d7", areaStyle: { type: "default" } }
            },
            data: dataRecommend
          },
          {
            name: "浏览量",
            type: "line",
            smooth: true,
            itemStyle: {
              normal: { color: "#ff2828", areaStyle: { type: "default" } }
            },
            data: dataBrowse
          },
          {
            name: "预约量",
            type: "line",
            smooth: true,
            itemStyle: {
              normal: { color: "#4fc514", areaStyle: { type: "default" } }
            },
            data: dataAppointment
          },
          {
            name: "分享量",
            type: "line",
            smooth: true,
            itemStyle: {
              normal: { color: "#ff8d14", areaStyle: { type: "default" } }
            },
            data: dataShare
          },
          {
            name: "关注量",
            type: "line",
            smooth: true,
            itemStyle: {
              normal: { color: "#f6ff00", areaStyle: { type: "default" } }
            },
            data: dataFollow
          }
        ]
      };
      // 绘制图表
      myChart.setOption(option);
    }
  };
  componentDidMount() {
    loginCheck();
    this.options();
  }
  componentDidUpdate() {
    this.options();
  }
  render() {
    return (
      <div>
        <div id="chartsId" style={{ width: "100%", height: "380px" }} />
      </div>
    );
  }
}

export default Chart;
