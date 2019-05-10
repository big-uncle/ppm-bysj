import React from 'react';
import styles from "./index.css";
import Pointcharts from "./pointcharts"
import WeekcCharts from "./weekcCharts"
import { Avatar, Card } from 'antd';
import * as conf from "../utils/conf";
var myDate = new Date();
var userId = localStorage.getItem('userId')
// const { Meta } = Card;
class Home extends React.Component {
    state = { mytoday: '', mycount: '', alltoday: '', allcount: '', selfsort: '', permnum: '' };
    showSelf = () => {
        fetch(conf.apiurl() + '/api/data/statistical?userId=' + userId).then(res => {
            res.json().then(obj => {
                // console.log(obj)
                this.setState({//给state 这个也有延迟
                    mytoday: obj.data.today.myTotal,//我的今天
                    mycount: obj.data.all.myTotal,//我的所有
                    alltoday: obj.data.today.allTotal,//所有今天
                    allcount: obj.data.all.allTotal,//所有所有
                    selfsort: obj.data.sort,
                    permnum: obj.data.permnum,
                });
            })
        })
    };
    componentWillMount() {
        //         //必须在这里声明，所以 ref 回调可以引用它
        this.showSelf();
    }
    render() {
        return (
            <div>
                <div className={styles.homeall}>
                    <div className={styles.homePageHeader}>

                        <div className={styles.headlog}>
                            <Avatar style={{ backgroundColor: '#52b1d6' }} size={80} src="./bbbb.png" />
                        </div>
                        <div className={styles.hellohead}>
                            {myDate.getHours() > 5 && myDate.getHours() < 12 ? '早上好,' : myDate.getHours() >= 12 && myDate.getHours() < 18 ? '下午好,' : '晚上好,'}
                            <span>&nbsp;&nbsp;&nbsp;{localStorage.getItem('userName')}&nbsp;&nbsp;祝你开心工作每一天！</span>
                            <div className={styles.bottomintroduce}>金牌勤劳员工&nbsp;|&nbsp;PPM仓库管理荣誉员工</div>
                        </div>
                        <div className={styles.worknum}>
                            <div className={styles.worknum1}>处理量:&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: 'rgb(15, 15, 15)', fontWeight: 'bold', fontSize: '25px', font: "Microsoft YaHei" }}>{this.state.mycount}</span></div>
                            <div className={styles.worknum2}>团队总排名:&nbsp;&nbsp;&nbsp;{this.state.selfsort ? <span><span style={{ color: 'rgb(15, 15, 15)', fontWeight: 'bold', fontSize: '25px', font: "Microsoft YaHei" }}>{this.state.selfsort}</span><span>&nbsp;&nbsp;/&nbsp;&nbsp;{this.state.permnum}</span></span> : <span style={{ color: 'rgb(238, 54, 9)', fontWeight: 'bold', fontSize: '15px', font: "Microsoft YaHei" }}>你当前还没有处理量!</span>}</div>
                        </div>
                    </div>
                    <div className={styles.card1}> <Card title="今日任务完成情况" bordered={true}> 
                        <Pointcharts
                      mytoday={this.state.mytoday}
                        ></Pointcharts>
                    </Card>
                    </div>
                    <div className={styles.card2}> <Card title="个人历史统计" bordered={true}> 
                        <WeekcCharts></WeekcCharts>
                    </Card>
                    </div>
                    <div className={styles.bottomintroduce1}>
                    <div>智能一体&nbsp;|&nbsp;省时省力&nbsp;|&nbsp;减少开支&nbsp;|&nbsp;快速出入
                        </div>
                        <br/>
                        <div>
                    Copyright © 2019-06-01 ** 版权所有 违者必究
                        </div>
                        </div>
                </div>
            </div>
        );
    }


}

export default Home