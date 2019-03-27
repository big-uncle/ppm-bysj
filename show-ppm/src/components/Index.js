import React from "react";
import { Table, Avatar, Modal, Button, DatePicker,Input,Select   } from "antd";
import "antd/dist/antd.css";
import login from "../utils/addLocalStorage";
import styles from "./index.css";
import getRFID from "../utils/getRFID"
import  apiurl from "../utils/apiUrl";
import  post  from  "../utils/post"
//下拉选择框
const Option = Select.Option;
//搜索框
const Search = Input.Search;
//日期选择框
const { RangePicker } = DatePicker;
//接收数据
// const data = [];
//1.要么存到state中，然后点击详情可以根据key来获取state中的对应值
//2.要么掉接口从新获取（不推荐）
//3.要么就是将一行的数据存到state，然后取
//4.要么就是state中存key值，然后从state.list中取
//5.想要key值必须自己遍历，存到data里面去
//6.我在这里采用的是将每一行数据存到state里面去
class Index extends React.Component {
  state = { visible: false, list: [], oneDetails: {}, startdate:"", enddate:"",type:'0'}
  showModal = () => {
    this.setState({
      visible: true
    });
  }
  excel = (e) => {
    console.log("e");
        post(apiurl+'/api/data/findAllCountXlsx', {html :"prnhtml",cm1:'sdsddsd',cm2:'haha'});
  }
  //时间选择框
   selectDate = (date, dateString)=> {
    console.log(dateString);
    this.setState({
      startdate: dateString[0],
      enddate:    dateString[1],
    });
  }
  handleChange=(value)=> {
    console.log(value.label); // { key: "lucy", label: "Lucy (101)" }
  }
  handleOk = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }
  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }
  componentDidMount() {//生命周期函数，首先渲染，首先执行校验函数
  // componentWillMount(){ //在渲染之前执行
  login();
   getRFID()
    fetch(apiurl+'/api/data/findAllCount', {}).then(res => {//加载页面的函数
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
       
        this.setState({
          list: obj.data//react单向绑定，如果state值改变，那么页面属性也会改变，
        //   // 如果是自己定义的属性改变那么页面元素并不会发生改变，需要利用双向绑定，来进行通知，我状态发生改变了，
        //   //react 如果statu发生改变，底层做了处理会自动给你改变页面的元素，不需要了自己手动通知
        //   //在首次渲染的时候，必须对state进行一步操作，哪怕是空操作也可以 ，就可以改变reader里面的渲染值
        })
      })
    })
    setTimeout(()=>{
      // console.log('全局数组data为',data)
    console.log('state中list为',this.state.list)
      // console.log("单个为",this.state.oneDetails)
    },1000)
    
  }
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: <div>货物编号</div>,
        dataIndex: "items_id",
        width: "20%"
      },
      {
        title: "货物名字",
        dataIndex: "items_name",
        width: "20%"
      },
      {
        title: "操作人员",
        dataIndex: "user_name",
        width: "15%"
      },
      {
        title: "出入类型",
        dataIndex: "access_type",
        width: "15%"
      },
      {
        title: "出入日期",
        dataIndex: "date",
        width: "15%"
      },
      {
        title: "出入库详情",
        dataIndex: "operation",
        render: (text,record,index,rowKey) => {//record就是代表的是每一行的元素，就是上面定义的。key和operation都可以获取到对应的数组索引
          return (
            // <span>{(pagination.current-1)*10+index+1}</span>
            <div>  
              <a onClick={() => this.edit(text,record)}>查看详情</a>
            </div>
          );
        }
      }
    ];
  }
  cancel = () => { };
  edit(text,item) {
    // console.log('',data)
    console.log('当前货物详情为', item)
    // console.log('当前索引为', c)//整体list的索引

console.log('开始日期',this.state.startdate)
console.log('结束日期',this.state.enddate)
    this.setState({
      oneDetails: item,//给state里面存对象，有延迟
      // key: rowKey
    })//给state里面存对象，有延迟
    // setTimeout(()=>{//写这个是以前存在statu里面，因为给statu存对象有延迟，所以加个定时器，现在给数组里面存值，不影响
      this.showModal()
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
      <div>
        {/* //选择器 */}
        <div className={styles.select}>
       <Select labelInValue defaultValue={{ key: '0' }} style={{ width: 120 }} onChange={this.handleChange}>
        <Option value="0">全部</Option>
        <Option value="1">入库</Option>
        <Option value="2">出库</Option>
      </Select>
      </div>
        {/* //日期选择框 */}
        <div className={styles.input}>
        <Search
      placeholder="操作人员"
      onSearch={value => console.log(value)}
      style={{ width: 188 }}
    />
    </div>
        <div className={styles.date}>
        <RangePicker onChange={this.selectDate}  placeholder={['开始日期', '结束日期']} />
        </div>
          <Modal
          width ='1000px'
        
            title="货物详情"
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            footer={[
              // <Button key="back" onClick={this.handleCancel}>取消</Button>,
              <Button key="submit" type="primary" onClick={this.handleOk}>确认</Button>,
            ]}
          >
          {/* 如果页面在服务器上，浏览器出于安全考虑是不允许html访问本地文件的。不会允许浏览器打开file://开头的本地图片的。上面的IMG就会图裂,除非写成相对路径

如果页面html文件是放在本地的，比如用浏览器打开桌面上的html文件，是可以访问本地图片文件的。但也不能访问所在根目录以外的文件夹下的图片。否则会报错： 
“not allowed to load local resource”。 */}
             {/* <div className={styles.onepic0}>货物图片</div> */}
          <div className={styles.pic}><div className={styles.text}>货物图片:</div><img src={this.state.oneDetails.items_pic}/></div>
          <div className={styles.huowu}>
          
          <div className={styles.id}>货物编号: &nbsp;&nbsp;&nbsp;{this.state.oneDetails.items_id}</div>

          <div className={styles.name}>货物名称: &nbsp;&nbsp;&nbsp;{this.state.oneDetails.items_name}</div>

          <div className={styles.type}>货物类型: &nbsp;&nbsp;&nbsp;{this.state.oneDetails.items_type}</div>
          </div>
          <div className={styles.user}>
          
          <div className={styles.name}>操作人员: &nbsp;&nbsp;&nbsp;{this.state.oneDetails.user_name}</div>

          <div className={styles.type}>出入类型: &nbsp;&nbsp;&nbsp;{this.state.oneDetails.access_type}</div>

          <div className={styles.date}>操作日期: &nbsp;&nbsp;&nbsp;{this.state.oneDetails.date}</div>
          </div>
          <div className={styles.desc}>货物描述: &nbsp;&nbsp;&nbsp;<div className={styles.text}>{this.state.oneDetails.items_desc}</div></div>
          {/* <div className={styles.ruku}>入库类型: &nbsp;&nbsp;&nbsp;{this.state.oneDetails.access_type}</div>
          <div className={styles.date}>日期:&nbsp;&nbsp;&nbsp;{this.state.oneDetails.date}</div> */}
          
          
          {/* 因为第一次渲染是没有值的。也就是说有延迟，可以让他等到有值了再渲染，也可以不用statu，可以自己定义一个全局变量 */}
           {/* ><div className={styles.onepic}>{this.state.list.length>0? this.state.list[this.state.key].date:''}</div> */}
          </Modal>
          <div className={styles.all}>
          <Table
            components={components}
            bordered
            dataSource={this.state.list}//使用原生的list赋值
            // dataSource={data}//使用自己封装的data赋值
            columns={columns}
            className={styles.table}
            pagination={{ pageSize: 10, hideOnSinglePage: true}}//如果想使用react里面的原生组件的statu来进行获取key，那么就需要获取当前页，然后当前页-1乘以10再加上当期页的索引
            // <span>{(pagination.current-1)*10+index+1}</span>
          />
        </div>
        {/* <Avatar icon="user" /> */}
        {/* <Avatar>U</Avatar> */}
        {/* <Avatar>USER</Avatar> */}
        {/* <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" /> */}
        {/* <Avatar style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>U</Avatar> */}
        <div className={styles.avatar}><Avatar style={{ backgroundColor: '#87d068', }} icon="user" /></div>
        <div className={styles.xlsx}>
          {/* <br /> */}
          {/* <Button type="primary" shape="circle" icon="download" size={size} /> */}
          {/* <Button type="primary" shape="round" icon="download" size={size}>导出表格</Button> */}
          <Button type="primary" icon="download" size={size} onClick={this.excel}>导出表格</Button>
          {/* <br /> */}
          {/* <a onClick={() => this.edit(record,record.operation)}>查看详情</a> */}
        </div>

      </div>



    );
  }
}
// export default ReactDOM.render(<App />, mountNode);
// ReactDOM.render(<App />, mountNode);
export default Index;
