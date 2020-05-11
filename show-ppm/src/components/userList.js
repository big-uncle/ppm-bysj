import React from "react";
import {Table, Modal,Popconfirm, Icon,message } from "antd";
import "antd/dist/antd.css";
import styles from "./index.css";
import * as conf from "../utils/conf";
import Edituser  from "./edituser";
import Changepwd  from "./changepwd";


//接收数据
// const data = [];
//1.要么存到state中，然后点击详情可以根据key来获取state中的对应值
//2.要么掉接口从新获取（不推荐）
//3.要么就是将一行的数据存到state，然后取
//4.要么就是state中存key值，然后从state.list中取
//5.想要key值必须自己遍历，存到data里面去
//6.我在这里采用的是将每一行数据存到state里面去
class UserList extends React.Component {
  state = { visible: false,visible1: false, list: [], oneDetails: {}}

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
  confirm1 = (a,e) => {
    console.log(e.user_id)
    if (localStorage.getItem('account')=='root'||localStorage.getItem('account')=='admin'){
    fetch(conf.apiurl() + '/api/data/deluser?userId='+e.user_id, {}).then(res => {//加载页面的函数
      res.json().then(obj => {
        console.log(obj)
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
    componentDidMount() {//生命周期函数，首先渲染，首先执行校验函数
    fetch(conf.apiurl() + '/api/data/userlist', {}).then(res => {//加载页面的函数
      res.json().then(obj => {
        // for (let i = 0; i < obj.data.length; i++) {
        //   data.push({
        //     key: i.toString(),
        //     items_desc: obj.data[i].items_desc,
        //     items_pic: obj.data[i].items_pic,
        //     items_type: obj.data[i].items_type,
        //     items_id: obj.data[i].items_id,
        //     items_name: obj.data[i].items_name,
        //     user_name: obj.data[i].user_name,
        //     access_type:  obj.data[i].access_type,
        //     date:  obj.data[i].date,
        //     operation: i.toString(),//使用record.key和record.operation   都给他们赋值，可以使用他俩都可以获取对应的key
        //   });
        // }
        console.log(obj.data)
        console.log(obj)
        this.setState({
          list: obj.data//react单向绑定，如果state值改变，那么页面属性也会改变，
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

  constructor(props) {//构造函数，只加载一次，相当于java的构造函数一样
    super(props);
    this.columns = [
      {
        title: <div>员工编号</div>,
        dataIndex: "user_id",
        width: "28%"
      },
      {
        title: "员工姓名",
        dataIndex: "user_name",
        width: "13%"
      },
      {
        title: "员工性别",
        dataIndex: "sex",
        width: "13%"
      },
      {
        title: "员工账号",
        dataIndex: "user_account",
        width: "13%"
      },
      {
        title: "入职日期",
        dataIndex: "add_date",
        width: "13%"
      },
      {
        title: <div style={{marginLeft:"20%"}}>编辑信息</div>,
        dataIndex: "operation",
        render: (text, record, index, rowKey) => {//record就是代表的是每一行的元素，就是上面定义的。key和operation都可以获取到对应的数组索引
          return (
            // <span>{(pagination.current-1)*10+index+1}</span>
            <div>
              <a onClick={() => this.edit(text, record)}>修改信息</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <a onClick={() => this.edit1(text, record)}>重置密码</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <Popconfirm title="你确定要删除此人吗?" okText="确定" cancelText="取消" onConfirm={() => this.confirm1(text, record)} icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}>
    <a href="#">删除</a>
  </Popconfirm>
            </div>
          );
        }
      },
      // {
      //   title: "编辑信息",
      //   dataIndex: "operation",
      //   render: (text, record, index, rowKey) => {//record就是代表的是每一行的元素，就是上面定义的。key和operation都可以获取到对应的数组索引
      //     return (
      //       // <span>{(pagination.current-1)*10+index+1}</span>
      //       <div>
      //         <a onClick={() => this.edit(text, record)}>修改信息</a>
      //       </div>
      //     );
      //   }
      // }
    ];
  }

  cancel = () => { };
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
  edit(text, item) {
    // console.log('',data)
    // console.log('当前货物详情为', item)
    // console.log('当前索引为', c)//整体list的索引

    // console.log('开始日期', this.state.startdate)
    // console.log('结束日期', this.state.enddate)
    this.setState({
      oneDetails: item,//给state里面存对象，有延迟
      // key: rowKey
    })//给state里面存对象，有延迟
    setTimeout(()=>{//写这个是以前存在statu里面，因为给statu存对象有延迟，所以加个定时器，现在给数组里面存值，不影响
    this.showModal()
    // console.log("单个为",this.state.oneDetails)
    },88)
    //post请求
    // fetch(apiurl+'/api/data/findOneDetails?itemsId='+item.items_id+'&date='+item.date).then(res => {
    //   fetch(apiurl+'/api/data/findOneDetails', { method: 'POST', 
    //   mode: "cors",//处理跨域
    //   headers: {
    //     　　　　  'Content-Type': 'application/x-www-form-urlencoded',      
    //   　　　　 },
    //  body: 'itemsId='+item.items_id+'&date='+item.date,
    //  }).then(res => {
    //     res.json().then( obj=>{
    //       console.log('ddddd', obj.data);
    //     //    this.setState({
    //     //    list:res
    //     // })
    //     }
    //     )

    //   })
  }
  edit1(text, item) {
    // console.log('',data)
    // console.log('当前货物详情为', item)
    // console.log('当前索引为', c)//整体list的索引

    // console.log('开始日期', this.state.startdate)
    // console.log('结束日期', this.state.enddate)
    this.setState({
      oneDetails: item,//给state里面存对象，有延迟
      // key: rowKey
    })//给state里面存对象，有延迟
    // setTimeout(()=>{//写这个是以前存在statu里面，因为给statu存对象有延迟，所以加个定时器，现在给数组里面存值，不影响
    this.showModal1()
    // console.log("单个为",this.state.oneDetails)
    // },0)
    //post请求
    // fetch(apiurl+'/api/data/findOneDetails?itemsId='+item.items_id+'&date='+item.date).then(res => {
    //   fetch(apiurl+'/api/data/findOneDetails', { method: 'POST', 
    //   mode: "cors",//处理跨域
    //   headers: {
    //     　　　　  'Content-Type': 'application/x-www-form-urlencoded',      
    //   　　　　 },
    //  body: 'itemsId='+item.items_id+'&date='+item.date,
    //  }).then(res => {
    //     res.json().then( obj=>{
    //       console.log('ddddd', obj.data);
    //     //    this.setState({
    //     //    list:res
    //     // })
    //     }
    //     )

    //   })
  }
  render() {
    const size = this.state.size;
    const components = {};
    const columns = this.columns.map(col => {
      return {
        ...col,
        onCell: record => ({
          record,
          title: col.title,
          // dataIndex: col.dataIndex,
        })
      };
    });

    return (
      
 
      <div >
        <Modal //修改信息的窗口
          width='500px'
          hright='1000px'

          title="修改信息"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={[
            // <Button key="back" onClick={this.handleCancel}>取消</Button>,
            // <Button key="submit" type="primary" onClick={this.handleOk}>确认修改</Button>,
          ]}
        >
        <Edituser  
      // visible2={this.state.visible2}//父传子通过prpos来接受，state的改变会实时发生调用改变
      handleOk={this.handleOk}//子传父，可以通过方法来传递,子传父通过方法加prpos
      oneDetails={this.state.oneDetails}
      // onRef={ref => {
      //   this.child = ref
      // }}
        ></Edituser>
        </Modal>
        <Modal //修改密码的窗口
          width='500px'
          height='1000px'

          title="修改密码"
          visible={this.state.visible1}
          onOk={this.handleOk1}
          onCancel={this.handleCancel1}
          footer={[
            // <Button key="back" onClick={this.handleCancel}>取消</Button>,
            // <Button key="submit" type="primary" onClick={this.handleOk1}>确认</Button>,
          ]}
        >
        <Changepwd
      // visible2={this.state.visible2}//父传子通过prpos来接受，state的改变会实时发生调用改变
      handleOk1={this.handleOk1}//子传父，可以通过方法来传递,子传父通过方法加prpos
      // onRef={ref => {
      //   this.child = ref
      // }}
        ></Changepwd>
        </Modal>
        

        <div className={styles.userlist}>
          <Table
            components={components}
            // bordered
            // title='表头'
            dataSource={this.state.list}//使用原生的list赋值
            // dataSource={data}//使用自己封装的data赋值
            columns={columns}
            className={styles.table}
            pagination={{ pageSize: 10, hideOnSinglePage: true }}//如果想使用react里面的原生组件的statu来进行获取key，那么就需要获取当前页，然后当前页-1乘以10再加上当期页的索引

          />
        </div>

      </div>
    );
  }
}
// export default ReactDOM.render(<App />, mountNode);
// ReactDOM.render(<App />, mountNode);
export default UserList;
