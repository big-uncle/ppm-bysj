import React from 'react'
import {
    Drawer, Divider, Col, Row, Icon
} from "antd";
import * as conf from "../utils/conf";

const pStyle = {
    fontSize: 16,
    color: 'rgba(0,0,0,0.85)',
    lineHeight: '24px',
    display: 'block',
    marginBottom: 16,
};
var userId= localStorage.getItem('userId')
const DescriptionItem = ({ title, content }) => (
    <div
        style={{
            fontSize: 14,
            lineHeight: '22px',
            marginBottom: 7,
            color: 'rgba(0,0,0,0.65)',
        }}
    >
        <p
            style={{
                marginRight: 8,
                display: 'inline-block',
                color: 'rgba(0,0,0,0.85)',
            }}
        >
            {title}:
      </p>
        {content}
    </div>
);

class User extends React.Component {
  

    state = { visible: false ,mytoday:'',mycount:'',alltoday:'',allcount:''};//这个statu.visible也没用了，由父组件的来控制
    // showDrawer = () => {//由于此状态由父组件来控制，那么这个方法也就无用了
    //     this.setState({
    //         visible: true,
    //     });
    // };
    // constructor(props) {
    // //     console.log("我是构造函数1")
    //     super(props)
    // //     // 将当前实例(this)传递给父组件
    //     // this.props.onRef(this)
    // //     console.log("我是构造函数2")
    //   }
    componentDidMount(){
//         //必须在这里声明，所以 ref 回调可以引用它
this.props.onRef(this)
}
//掉接口返回所需的用户窗口信息

showUserInfo = () => {
    fetch(conf.apiurl()+'/api/data/statistical?userId='+userId).then(res => {
        res.json().then( obj=>{
            // console.log(obj)
            this.setState({//给state 这个也有延迟
                mytoday: obj.data.today.myTotal,//我的今天
                mycount:  obj.data.all.myTotal,//我的所有
                alltoday: obj.data.today.allTotal,//所有今天
                allcount: obj.data.all.allTotal,//所有所有
              });
        })
})
};
    onClose = () => {//子传父通过方法加prpos
        this.props.closeA()//在父引用子的标签里面，加一个这个方法然后就会执行在父组件间引入本子组件里面的该方法
    };
    render() {//每一步对state操作都会渲染一下，都会从新走render
        return (
            <div>
                {/* /> */}
                <Drawer
                    width={640}
                    placement="right"
                    closable={false}
                    onClose={this.onClose}//子传父，儿子触发onClose然后调用本身的上面的onClose方法。然后在上面的方法里面调用父的方法
                    visible={this.props.visible2}//父传子直接prpos来进行接受
                >
                    <p style={{ ...pStyle, marginBottom: 24 }}>用户信息</p>
                    <Row>
                        <Col span={1}>
                            <Icon type="profile" />
                        </Col>
                        <Col span={12}>
                            <DescriptionItem title="员工姓名" content={localStorage.getItem('userName')} />
                        </Col>
                    </Row>
                    <Row>
                        <Col span={1}>
                            <Icon type="solution" />
                        </Col>
                        <Col span={12}>
                            <DescriptionItem title="员工账号" content={localStorage.getItem('account')} />
                        </Col>
                    </Row>
                    <Row>
                        <Col span={1}>
                            <Icon type="phone" />
                        </Col>
                        <Col span={12}>
                            <DescriptionItem title="联系电话" content={localStorage.getItem('phone')} />
                        </Col>
                    </Row>
                    <Row>
                        <Col span={1}>
                            <Icon type="clock-circle" />
                        </Col>
                        <Col span={12}>
                            <DescriptionItem title="入职日期" content={localStorage.getItem('date')} />
                        </Col>
                    </Row>
                    <Row>
                        <Col span={1}>
                            <Icon type="idcard" />
                        </Col>
                        <Col span={20}>
                            <DescriptionItem
                                title="员工编号"
                                content={localStorage.getItem('userId')}
                            />
                        </Col>
                    </Row>
                    <Divider />
                    <p style={pStyle}>今日战绩</p>
                    <Row>
                    <Col>&nbsp;&nbsp;&nbsp;</Col>
                    </Row>
                    <Row>
                    </Row>
                    <Row>
                    <Col span={1}>
                    <Icon type="user" />
                    </Col>
                        <Col span={10}>
                            <DescriptionItem title="我的处理量" content={this.state.mytoday}/>
                        </Col>
                        <Col span={1}>
                        <Icon type="home" />
                        </Col>
                        <Col span={10}>
                            <DescriptionItem title="仓库总处理量" content={this.state.alltoday} />
                        </Col>
                    </Row>
                    <Row>
                    <Row>
                    <Col>&nbsp;</Col>
                    <Col span={1}>
                    {/* <Icon type="sound" /> */}
                    <Icon type="message" />
                    </Col>
                        <Col span={15}>  
                           <DescriptionItem
                                title="今日点评"
                                content={this.state.mytoday>20?'今日你已达标请继续努力,给你个赞！':'今日你尚未达标仍需努力,要加油哦！'}
                            />
                        </Col>
                        <Col span={1}> 
                        {this.state.mytoday>20? <Icon type="like" theme="twoTone" twoToneColor="#f56a00" style={{ color: '#7265e6',fontSize: '32px' }} />: <Icon type="smile" theme="twoTone" twoToneColor="#ffbf00" spin='true' style={{ fontSize: '32px' }}/>}
                        </Col>
                        <Col>&nbsp;&nbsp;&nbsp;</Col><Col>&nbsp;&nbsp;&nbsp;</Col><Col>&nbsp;&nbsp;&nbsp;</Col>
                    </Row>
                    </Row>
                    <Row>
                  
                    <Divider />

                    <p style={pStyle}>以往战绩</p>
                    <Row>
                    <Col>&nbsp;&nbsp;&nbsp;</Col>
                    </Row>
                    <Col span={1}>
                    <Icon type="user" />
                    </Col>
                        <Col span={10}>
                            <DescriptionItem title="我的处理量" content={this.state.mycount} />
                        </Col>
                        <Col span={1}>
                        <Icon type="home" />
                        </Col>
                        <Col span={10}>
                            <DescriptionItem title="仓库总处理量" content={this.state.allcount} />
                        </Col>
                    </Row>
                    <Row>
                    <Col>&nbsp;&nbsp;&nbsp;</Col>
                    <Col span={1}>
                    <Icon type="message" />
                    </Col>
                        <Col span={20}>  
                           <DescriptionItem
                                title="历史点评"
                                content={'你是个非常优秀的员工！'}
                            />
                        </Col>
                      <Col>&nbsp;&nbsp;&nbsp;</Col><Col>&nbsp;&nbsp;&nbsp;</Col><Col>&nbsp;&nbsp;&nbsp;</Col>
                    </Row>
                    <Divider />
                    <Row>
                    <div className="contact">
                   <Col>&nbsp;</Col>
                <div><Col span={7}></Col><Col span={15}>智能一体&nbsp;|&nbsp;省时省力&nbsp;|&nbsp;减少开支&nbsp;|&nbsp;快速出入</Col>  </div> 
            </div>
            </Row>
            <Row>
            <Col>&nbsp;</Col>
            </Row>
            
            <Col span={6}></Col>
            <Col span={15}> Copyright © 2019-06-01 ** 版权所有 违者必究</Col>
                </Drawer>
            </div>
        );
    }
}

export default User