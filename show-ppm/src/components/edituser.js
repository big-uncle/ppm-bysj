import {
    message, Radio, Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete,
  } from 'antd';
  import React from 'react'
  import "antd/dist/antd.css";
  import styles from "./index.css";
  import * as conf from "../utils/conf";
  const RadioGroup = Radio.Group;
  class RegistrationForm extends React.Component {
    state = {
      confirmDirty: false,
      autoCompleteResult: [],
      value: 1,
    };
    onChange = (e) => {
      // console.log('radio checked', e.target.value);
      this.setState({
        value: e.target.value,
      });
    }
    handleSubmit = (e) => {
      e.preventDefault();
      this.props.form.validateFieldsAndScroll((err, values) => {
        // console.log('biaodan',values)
        if (!err) {
          // console.log('接受到的表单值: ', values);
          setTimeout(() => {
            fetch(conf.apiurl() + '/api/data/userUpd', {
              method: 'POST',
              mode: "cors",//处理跨域
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
              body: 'account=' + values.account + '&name=' + values.userName + '&phone=' + values.phone+'&pwd='+values.password+'&sex='+values.sex+'&userId='+this.props.oneDetails.user_id,
            }).then(res => {
              res.json().then(obj => {
    // console.log(obj)
    if (obj.code==="400"){
      message.error(obj.msg)
      }else if (obj.code==="200"){
          message.success(obj.msg)
          this.props.handleOk()
          setTimeout(function () {
            window.location.reload()//刷新地址栏
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
        <div className={styles.edituser}
        >
        <Form {...formItemLayout} onSubmit={this.handleSubmit} len = {20}
        
        //  onClose={this.onClose}//子传父，儿子触发onClose然后调用本身的上面的onClose方法。然后在上面的方法里面调用父的方法
        //  visible={this.props.visible2}//父传子直接prpos来进行接受     
        //  之前想法是错误的  ，  子调用父 不用传对象，   就跟router 和 menu 一样 只需在 父组件的子组件标签里面 定义好 子组件需要调用的属性即可，然后子组件直接this.prpo.func() 既可以 ，然后父组件在引入的子组件里面接受然后进行相应处理（调用本身或是其他）
        >
          <Form.Item
            label="姓名"
          >
            {getFieldDecorator('userName', {
                initialValue: this.props.oneDetails.user_name , //默认值
              rules: [{
                pattern: /^[\u4E00-\u9FA5A-Za-z]+$/, message: '无效的姓名!',
              }, {
                required: true, message: '请输入姓名',
              }],
            })(
              <Input type="userName"  />
            )}
          </Form.Item>
  
          <Form.Item
            label="账户名"
          >
            {getFieldDecorator('account', {
                initialValue: this.props.oneDetails.user_account , //默认值
              rules: [{
                pattern: /[0-9a-zA-Z\u4E00-\u9FA5\\s]+$/, message: '无效的账号!',
              }, {
                required: true, message: '请输入账号',
              }],
            })(
              <Input type="account"  />
            )}
          </Form.Item>
  
          <Form.Item
            label="性别"
          >
            {getFieldDecorator('sex',{
              initialValue: this.props.oneDetails.sex=='男'?1:2 , //默认值
              rules: [{ required: true, message: '请选择性别!' }],
            })(
               <RadioGroup onChange={this.onChange} >
               <Radio value={1}>男</Radio>
               <Radio value={2}>女</Radio>
             </RadioGroup>
            )}
          </Form.Item>
          <Form.Item
             label={(
              <span>
                新手机号&nbsp;
                <Tooltip title="用于修改密码时的身份验证,请谨慎修改并保存">
                  <Icon type="question-circle-o" />
                </Tooltip>
              </span>
            )}
          >
            {getFieldDecorator('phone', {
              rules: [{ pattern: /^1[34578]\d{9}$/, message: '请输入正确的手机号码' },
                { required: true, message: '请输入手机号!' }],
            })(
              <Input  style={{ width: '100%' }} />
            )}
          </Form.Item>
          <Form.Item
            label={(
              <span>
                密码&nbsp;
                <Tooltip title="该密码用于修改成员信息时的验证">
                  <Icon type="question-circle-o" />
                </Tooltip>
              </span>
            )} 
          >
            {getFieldDecorator('password', {
              rules: [
                { pattern: /^(?![^a-zA-Z]+$)(?!\D+$)/, message: '密码必须包含数字、字母，区分大小写' },
                {required: true, message: '请输入密码!',
              }, {
                validator: this.validateToNextPassword,
              }],
            })(
              <Input type="password"  />
            )}
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" style={{ left: '30%' }} htmlType="submit">确认修改</Button>
          </Form.Item>
        </Form>
        </div>
        </div>
      );
    }
  }
  const WrappedRegistrationForm = Form.create({ name: 'register' })(RegistrationForm);
  
  export default WrappedRegistrationForm