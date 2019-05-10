import {
  Upload, message, Radio, Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete,
} from 'antd';
import React from 'react'
import "antd/dist/antd.css";
import styles from "./index.css";
import * as conf from "../utils/conf";
import reqwest from 'reqwest'
const RadioGroup = Radio.Group;
let isJPGPNG =  false
  const { TextArea } = Input;
  function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }
  function beforeUpload(file) {
    isJPGPNG = file.type === 'image/jpeg';  //这两个必定是相冲的
           if (!isJPGPNG){ //如果是的话就不执行，如果不是的话就执行
            isJPGPNG = file.type === 'image/png';
           }
    
    if (!isJPGPNG) {
      message.error('你只能上传jpg和png格式的图片!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片不能大小不能超过2MB!');
    }
    return isJPGPNG && isLt2M;
  }
class RegistrationForm extends React.PureComponent {
  state = {
    confirmDirty: false,
    autoCompleteResult: [],
    value: 1,
    loading: false,
    imageUrl:"",
  };
  onChange = (e) => {
    console.log('radio checked', e.target.value);
    this.setState({
      value: e.target.value,
    });
  }
  componentDidMount(){
     //   console.log('这个',this)
    //         //必须在这里声明，所以 ref 回调可以引用它
    this.props.onRef(this)
    }
  componentWillMount(){
    // this.props.onRef(this)
    this.setState({
      imageUrl: this.props.oneDetails.items_pic,
    });
    // console.log('我爱',this.props.oneDetails)
  }
  componentWillReceiveProps(nextProps){
    // console.log('aaa',nextProps)
    if(nextProps.oneDetails.items_pic==this.state.imageUrl){
      this.setState({
        imageUrl: nextProps.oneDetails.items_pic,
      })
    }
  }


 itemInfoPic = (e) => {
    this.setState({
      imageUrl:  e.items_pic,
    })
}
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        // console.log('接受到的表单值: ', values);
        // console.log('改变的为i1', this.state.imageUrl)
        setTimeout(() => {
          fetch(conf.apiurl() + '/api/data/updItemInfo', {
            method: 'POST',
            mode: "cors",//处理跨域
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            }, //在这里加上图片的地址信息
            body: 'itemId=' + this.props.oneDetails.items_id + '&itemName=' + values.itemName + '&itemType=' + values.itemType+'&itemPic='+this.state.imageUrl+'&itemDesc='+values.itemDesc,
          }).then(res => {
            res.json().then(obj => {
        if (obj.code==='400'){
          message.error(obj.msg)
          }else if (obj.code==='200'){
              message.success(obj.msg)
              setTimeout(function () {
                window.location.reload()//刷新地址栏
                // console.log('改变的为i1',this.state.imageUrl)
            }, 888);
          }
                  }
            )
          })
        }, 88)//做了88秒延迟才取数据请求接口         
      }
    });
  }

  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }

  handleChange = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl => this.setState({
        imageUrl,
        loading: false,
      }));
    }
  }
  customRequest=(option)=>{
    const formData = new FormData();
        // const fileUrl = AjaxUrl+"data/fileUpload.svt";
        formData.append('files',option.file);
       
        reqwest({ 
          url: conf.apiurl() + '/api/data/addItemPic',
          method: 'post',
          processData: false,
          data: formData,
          crossOrigin: true,
          success: (res) => {
            //res为文件上传成功之后返回的信息，res.responseText为接口返回的值
            // let fileInfo = res.responseText
            // JSON.parse(res.responseText);
            message.success("文件上传成功！");

    
            if(res){
              this.setState({
                  fileInfo:res,
                  loading: true, //不让他在等待
                  uploading: false,
                  defaultFile:false,
                  imageUrl:res,
              })
            }
            // setTimeout(() => {
            // // console.log('pppppp',this.state.imageUrl)
            // },888)
          },
          
          error: () => {
            this.setState({
                loading: false,
                uploading: false
            })
            message.error("文件上传失败！");
          },
        });
  }
  handleWebsiteChange = (value) => {
    let autoCompleteResult;
    if (!value) {
      autoCompleteResult = [];
    } else {
      autoCompleteResult = ['.com', '.org', '.net'].map(domain => `${value}${domain}`);
    }
    this.setState({ autoCompleteResult });
  }

  render() {
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const imageUrl = this.state.imageUrl;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };

    return (
      <div>

        
        <Form {...formItemLayout} onSubmit={this.handleSubmit} len = {20}>
        <div className={styles.edititem}>
          <Form.Item
            label="货物名称"
          >
            {getFieldDecorator('itemName', {
      initialValue: this.props.oneDetails.items_name ,
              rules: [{
                pattern: /[0-9a-zA-Z\u4E00-\u9FA5\\s]+$/, message: '无效的货物名称!',
              }, {
                required: true, message: '请输入货物名称',
              }],
            })(
              <Input type="itemName"  />
            )}
          </Form.Item>
          <Form.Item
            label={(
              <span>
                货物类型&nbsp;
                <Tooltip title="货物类型用于描述货物的种类，便于分类">
                  <Icon type="question-circle-o" />
                </Tooltip>
              </span>
            )}
          >
            {getFieldDecorator('itemType', {
          initialValue: this.props.oneDetails.items_type , //默认值
              rules: [{
                pattern: /[0-9a-zA-Z\u4E00-\u9FA5\\s]+$/, message: '无效的货物类型!',
              },{
                required: true, message: '请输入货物类型',
              }],
            })(
              <Input type="itemType"  />
            )}
          </Form.Item>
          <Form.Item
            label={(
              <span>
                货物描述&nbsp;
                <Tooltip title="对货物的描述，用于对货物的展示说明">
                  <Icon type="question-circle-o" />
                </Tooltip>
              </span>
            )}
          >
            {getFieldDecorator('itemDesc', {
    initialValue: this.props.oneDetails.items_desc , //默认值
              rules: [ {
                required: true, message: '请输入货物描述',
              }],
            })(
              // <Input type="itemDesc"  />
              <TextArea rows={4}  type="itemDesc" /> //用文本框代替本质还是input输入框
            )}
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">添加物品信息</Button>
          </Form.Item>
          </div>

          <div className={styles.edititempic}>
          <div className={styles.itemdeitpic}>
              <span style={{color:"red"}}>*</span>&nbsp;&nbsp;&nbsp;物品图片:&nbsp;
              {/* <Tooltip title="物品图片用于展示物品,仅支持上传jpg和png格式">
                <Icon type="question-circle-o" />
              </Tooltip> */}
            </div>
          <Form.Item //这个就只传图片的地址
          
          // extra={<div>点此上传图片</div>}
          // className={styles.upload}
        >
          {getFieldDecorator('upload', {
            valuePropName: 'fileList',
            // getValueFromEvent: this.normFile,
            // rules: [{ required: true, message: '请上传货物图片!' }],
          })(
      <Upload
      
        name="avatar"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false} //这个是显示多个列表吗 ，也就是可以多个上传吗
        action={conf.apiurl() + '/api/data/addItemPic'}
        beforeUpload={beforeUpload} //在上传之前先检验是否是jpg格式的
        // onChange={this.handleChange}   //原生的 需设置 这个 'Content-Type': 'multipart/form-data', 但是试了一下设置了不起作用
        customRequest={this.customRequest}
      >
      {/* 用上传成功的图片来替换掉按钮 */}
        {imageUrl ? <img style={{ width: '300px', height	: '300px' }} src={this.state.imageUrl} alt="avatar" /> : uploadButton}
      </Upload>
   )}
  </Form.Item> 
  </div>
         
        </Form>
      </div>
    );
  }
}
const WrappedRegistrationForm = Form.create({ name: 'register' })(RegistrationForm);

export default WrappedRegistrationForm