import React from "react";
import { Menu, Avatar, Popover,Icon ,Tooltip } from "antd";
import "antd/dist/antd.css";
import login from "../utils/addLocalStorage";
import styles from "./index.css";
import getRFID from "../utils/getRFID"
import * as conf from "../utils/conf";
import User from './user'

//阿里ant小图标icon
// const IconFont = Icon.createFromIconfontCN({
//   scriptUrl: '//at.alicdn.com/t/font_8d5l8fzk5b87iudi.js',
// });
const SubMenu = Menu.SubMenu;
let menuKey = ['1']
let submenuKey = ['1']
class PPMmenu extends React.Component {
  state = {collapsed: false,visible1: false,visible2:false}
 
  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }
  //隐藏气泡弹框
  hide = () => {
    this.setState({
      visible1: false,
    });
  }
  exit = () => {//退出登录
    
    localStorage.clear();
    // alert(conf)
    window.location.href =conf.apiurl()
  }
  editUser = () => {//展示并编辑员工信息//父传子,子通过prpos来接受
    // this.User.showUserInfo()
    this.child.showUserInfo()
    this.setState({
      visible2: true,
    });
  }
  closeA=()=>{//子传父通过方法加prpos//尽量通过同一个状态来改变
    this.setState({
      visible2:false
    })
  }
  handleVisibleChange = (visible1) => {
    this.setState({ visible1 });
  }
  handleClick = (e) => {
    if (e.key=='1'){
      this.props.history.push("/home");
      }
      if (e.key=='2'){
        this.props.history.push("/chart");
        }
        if (e.key=='3'){
          this.props.history.push("/table");
          }
        if (e.key=='4'){
          this.props.history.push("/adduser");
          }
          if (e.key=='5'){
            this.props.history.push("/userlist");
            }
            if (e.key=='6'){
              this.props.history.push("/addinfo");
              }
              if (e.key=='7'){
                this.props.history.push("/itemlist");
                }
  }
    componentWillMount(){ //在渲染之前执行
    login();
    switch(this.props.history.location.pathname){
      case "/home":
      menuKey=['1']
       break;
      case "/chart":
      menuKey=['2']
      break;
      case "/table":
      menuKey=['3']
      break;
      case "/adduser":
      menuKey=['4']
      submenuKey=['sub1']
      break;
      case "/userlist":
      menuKey=['5']
      submenuKey=['sub1']
      break;
      case "/addinfo":
      menuKey=['6']
      submenuKey=['sub2']
      break;
      case "/itemlist":
      menuKey=['7']
      submenuKey=['sub2']
      break;
 }
    }
    componentDidMount() {//生命周期函数，首先渲染，首先执行校验函数
      this.props.history
    getRFID();
  }
  shouye =()=>{//点击首页跳转
    this.props.history.push("/home");
  }
  cancel = () => { };
  render() {
    const content1 = (
      <div>
        {/* //加p标签会增加行与行的间距 */}
        <Tooltip placement="left" autoAdjustOverflow title={<div>点击查看编辑用户信息</div>}>
       <p> <Icon type="user" /> &nbsp;&nbsp;&nbsp;<a onClick={this.editUser}>用户详细信息</a></p>
       </Tooltip>
        {/* <a onClick={this.exit}>退出仓库登录</a> */}
      </div>
    );
    return (
      <div className={styles.bigall}>
       <div className={styles.log}>仓库管理系统</div>
      <div  className={styles.topmenu}>
     {/* *致力于最好的仓库管理系统* */}
     <div className={styles.home}>
     <a onClick={this.shouye} >
     <Icon type="home"  />&nbsp;&nbsp;&nbsp;首页
     </a>
     </div>
      </div>
      {/* //菜单 */}
        <div className={styles.menuAll}>
        {/* <Button type="primary" onClick={this.toggleCollapsed} style={{ marginBottom: 16 }}> */}
          {/* <Icon type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'} /> */}
        {/* </Button> */}
        
        <div  className={styles.menu}>
        <img className={styles.img} src="./d.jpg" />
        <span>PPM-STORE</span>
        {/* <img={'./b.jpg'}> */}
        </div>
        <Menu
      onClick={this.handleClick}
        style={{ width: '100%' }}
          defaultSelectedKeys={menuKey}//默认选中的1级菜单
          defaultOpenKeys={submenuKey}//默认打开有2级菜单
          mode="inline"
          // theme="dark"
          type="line"
          // light|dark
          inlineCollapsed={this.state.collapsed}
        >
          <Menu.Item key="1">
            {/* <Icon type="pie-chart" /> */}
            <Icon type="home" />
            <span>首页</span>
          </Menu.Item>
          <Menu.Item key="2">
            <Icon type="area-chart" />
            <span>统计图</span>
          </Menu.Item>
          <Menu.Item key="3">
            {/* <Icon type="inbox" /> */}
            <Icon type="ordered-list" />
            <span>历史详细数据</span>
          </Menu.Item>
          <SubMenu key="sub1" title={<span><Icon type="user" /><span>人员管理</span></span>}>
            <Menu.Item key="4">新增人员</Menu.Item>
            <Menu.Item key="5">员工列表</Menu.Item>
          </SubMenu>
          {/* <Icon type="gold" /> */}
          {/* <Icon type="cluster" /> */}
          <SubMenu key="sub2" title={<span><Icon type="gold" /> <span>货物管理</span></span>}>
            <Menu.Item key="6">添加信息</Menu.Item>
            <Menu.Item key="7">货物列表</Menu.Item>
            {/* <SubMenu key="sub3" title="Submenu">
              <Menu.Item key="11">Option 11</Menu.Item>
              <Menu.Item key="12">Option 12</Menu.Item>
            </SubMenu> */}
          </SubMenu>
        </Menu>
        </div>
        {/* //气泡卡片 */}
        <User
          visible2={this.state.visible2}//父传子通过prpos来接受，state的改变会实时发生调用改变
          closeA={this.closeA}//子传父，可以通过方法来传递,子传父通过方法加prpos
          onRef={ref => {
            this.child = ref
          }}
        />
        <Popover
         content={
          <div>
         {content1}
         {/* //加p标签会增加行与行的间距 */}
        {/* <p><a onClick={this.exit}>用户详细信息</a></p> */}
        <Tooltip placement="left" autoAdjustOverflow title={<span>此操作将会使您退出</span>}>
        <Icon type="poweroff" /> 
        {/* <Icon type="logout" /> */}
        {/* <Icon type="login" />  */}
        &nbsp;&nbsp;&nbsp;
         <a onClick={this.exit}>退出仓库登录</a>
      </Tooltip>
       </div>
         } 
         title="用户" trigger="hover" placement="bottom"  visible={this.state.visible1} onVisibleChange={this.handleVisibleChange}>
      {/* <Button>Hover me</Button> */}
      <div className={styles.avatar}><Avatar style={{ backgroundColor: '#00a2ae', }} size={55} >{localStorage.getItem('userName')}<span>你好</span></Avatar></div>
      {/* ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae']; */}
      {/* src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"   icon="user"*/}
    </Popover>
      </div>
    );
  }
}
// export default ReactDOM.render(<App />, mountNode);
// ReactDOM.render(<App />, mountNode);
export default PPMmenu;
