import React from "react";
import {message, Modal,List,Steps, Icon,Popconfirm } from "antd";
import "antd/dist/antd.css";
import styles from "./index.css";
import * as conf from "../utils/conf";
import Edititem  from "./edititem";
const Step = Steps.Step;
// let listData = [];
// const IconText = ({ type, text }) => (
//     <span>
//       <Icon type={type} style={{ marginRight: 8 }} />
//       {text}
//     </span>
//   );
//接收数据
// const data = [];
//1.要么存到state中，然后点击详情可以根据key来获取state中的对应值
//2.要么掉接口从新获取（不推荐）
//3.要么就是将一行的数据存到state，然后取
//4.要么就是state中存key值，然后从state.list中取
//5.想要key值必须自己遍历，存到data里面去
//6.我在这里采用的是将每一行数据存到state里面去
class ItemList extends React.PureComponent { 
  state = {listData:[],visible: false,visible1: false,oneDetails: {} }

  showModal = () => {
    this.setState({
      visible: true
    });
  }
  showModal1 = () => {
    this.setState({
      visible1: true
    });
  }
  handleOk = (e) => {
    // console.log(e);
    this.setState({
      visible: false,
    });
  }
  handleOk1 = (e) => {
    // console.log(e);
    this.setState({
      visible1: false,
    });
  }
  confirm1 = (e) => {
    // console.log(e.user_id)
   if (localStorage.getItem('phone')=='135****7817'){
    fetch(conf.apiurl() + '/api/data/delItemInfo?itemId='+e.items_id, {}).then(res => {//加载页面的函数
      res.json().then(obj => {
        // console.log(obj)
        if (obj.code==='400'){
          message.error(obj.msg)
          }else if (obj.code==='200'){
              message.success(obj.msg)

              setTimeout(function () {
                window.location.reload()//刷新地址栏
            }, 888);
          }
      });
    })
  }else{
    message.error("操作失败,你无权执行此操作")
  }
  }

  handleCancel = (e) => {
    // console.log(e);
    this.setState({
      visible: false,
    });
  }
  handleCancel1 = (e) => {
    // console.log(e);
    this.setState({
      visible1: false,
    });
  }
  editItem = (e) => {
    this.setState({
      oneDetails: e,//给state里面存对象，有延迟
      // key: rowKey
    })//给state里面存对象，有延迟
    // setTimeout(()=>{//写这个是以前存在statu里面，因为给statu存对象有延迟，所以加个定时器，现在给数组里面存值，不影响
    setTimeout(()=>{//写这个是以前存在statu里面，因为给statu存对象有延迟，所以加个定时器，现在给数组里面存值，不影响
      this.showModal()
      this.child.itemInfoPic(e)
      // console.log('子',this.child)
      // console.log("单个为",this.state.oneDetails)
      },88)
  }
  
 
    componentDidMount() {//生命周期函数，首先渲染，首先执行校验函数
    fetch(conf.apiurl() + '/api/data/findAllItemInfo', {}).then(res => {//加载页面的函数
      res.json().then(obj => {    
        // for (let i = 0; i < 23; i++) {
        //     listData.push({
        //       href: 'http://ant.design',
        //       title: `ant design part ${i}`,
        //       avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
        //       description: 'Ant Design, a design language for background applications, is refined by Ant UED Team.',
        //       content: 'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
        //     });
        //   }
        // console.log(obj.data)
        // console.log(obj)
        this.setState({
          listData: obj.data//react单向绑定，如果state值改变，那么页面属性也会改变，
          //   // 如果是自己定义的属性改变那么页面元素并不会发生改变，需要利用双向绑定，来进行通知，我状态发生改变了，
          //   //react 如果statu发生改变，底层做了处理会自动给你改变页面的元素，不需要了自己手动通知
          //   //在首次渲染的时候，必须对state进行一步操作，哪怕是空操作也可以 ，就可以改变reader里面的渲染值
        })
      })
    })
    // setTimeout(() => {
      // console.log('全局数组data为',data)
      // console.log('state中list为', this.state.list)
      // console.log("单个为",this.state.oneDetails)
    // }, 1000)

  }

 
  
  render() {
    return (
      <div  className={styles.itemlist}>
        <List
    itemLayout="vertical"
    size="large"
    pagination={{
      onChange: (page) => {
        // console.log(page);
      },
      pageSize: 3,
    }}
    dataSource={this.state.listData}
    footer={<div><b>PPM</b>货物信息</div>}
    
    renderItem={item => (
      <List.Item
        key={item.items_id}
        // actions={[<IconText type="star-o" text="156" />, <IconText type="like-o" text="156" />, <IconText type="message" text="2" />]}
        actions={[<a onClick={() => this.editItem(item)}>编辑信息</a>,
        <Popconfirm title="你确定要删除此货物信息吗?" okText="确定" cancelText="取消" onConfirm={() => this.confirm1(item)} icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}>
        <a href="#">删除信息</a>
      </Popconfirm>]}
        extra={<img width={288} height={175} alt="logo" src={item.items_pic} />}
      >
         {/* <Steps current={0}>
    <Step title="Finished" description="This is a description." />
    <Step title="In Progress" description="This is a description." />
    <Step title="Waiting" description="This is a description." />
  </Steps> */}
  {/* //可以通过current来判断当前处于哪个阶段 ,也可以判断loading的图标 */}
       <Steps current={item.current-1}> 
       {/* <Steps current={1}>    */}
       {/* 0/1/2 */}
       {/* <Icon type="import" />  */}
       {/* <Icon type="export" /> */}
       {/* <Icon type="login" /> */}
       {/* <Icon type="logout" /> */}
    <Step  title="入仓" icon={<Icon type="login" />} description={item.add_date} />
    <Step  title="待仓" icon={item.current==2?<Icon type="loading"/>:<Icon type="align-center" />}description={item.add_date}/>
    <Step  title="出仓" icon={<Icon type="logout" />}description={item.add_date} />
  </Steps>
        <List.Item.Meta
          // avatar={<Avatar src={item.avatar} />}
          title={<a href={item.href}>{item.items_name}</a>}
          description={item.items_desc}
        />
        {item.content}
      </List.Item>
    )
  }
  />
         <Modal //修改信息的窗口
          width='788px'
          height='1000px'

          title="修改信息"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={[
            // <Button key="back" onClick={this.handleCancel}>取消</Button>,
            // <Button key="submit" type="primary" onClick={this.handleOk}>确认修改</Button>,
          ]}
        >
        <Edititem  
      // visible2={this.state.visible2}//父传子通过prpos来接受，state的改变会实时发生调用改变
      handleOk={this.handleOk}//子传父，可以通过方法来传递,子传父通过方法加prpos
      oneDetails={this.state.oneDetails}
      onRef={ref => {
        // console.log('我们',ref)
        this.child = ref
      }}
        ></Edititem>
        </Modal>
      </div>
    );
  }
}
export default ItemList;
