import {
    message, Form, Input, Tooltip, Icon, Button, AutoComplete,
  } from 'antd';
  import React from 'react'
  import "antd/dist/antd.css";
  import styles from "./index.css";
  import * as conf from "../utils/conf"; 
  const AutoCompleteOption = AutoComplete.Option;
  class RegistrationForm extends React.Component {
    state = {
      confirmDirty: false,
      autoCompleteResult: [],
      value: 1,
    };
    componentDidMount(){
        // this.props.onRef(this)
    }
    onChange = (e) => {
      // console.log('radio checked', e.target.value);
      this.setState({
        value: e.target.value,
      });
    }
    // onClose = () => {//子传父通过方法加prpos
    //     this.props.closeA()//在父引用子的标签里面，加一个这个方法然后就会执行在父组件间引入本子组件里面的该方法
    // };
    handleSubmit = (e) => {
      e.preventDefault();
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          // console.log('接受到的表单值: ', values);
          setTimeout(() => {
            fetch(conf.apiurl() + '/api/changepwd', {
              method: 'POST',
              mode: "cors",//处理跨域
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
              body: 'account=' + values.account + '&phone=' + values.phone+'&newpwd='+values.password,
            }).then(res => {
              res.json().then(obj => {
    // console.log(obj)
    if (obj.success===false){
      message.error(obj.msg)
      }else if (obj.success===true){
          message.success(obj.msg)
            this.props.handleOk1()
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
    compareToFirstPassword = (rule, value, callback) => {
      const form = this.props.form;
      if (value && value !== form.getFieldValue('password')) {
        callback('俩次密码输入不一致!');
      } else {
        callback();
      }
    }
    validateToNextPassword = (rule, value, callback) => {
      const form = this.props.form;
      if (value && this.state.confirmDirty) {
        form.validateFields(['confirm'], { force: true });
      }
      callback();
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
      // const { autoCompleteResult } = this.state;
  
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
      // const websiteOptions = autoCompleteResult.map(website => (
      //   <AutoCompleteOption key={website}>{website}</AutoCompleteOption>
      // ));
      return (
        <div>
        <div className={styles.edituser}> 
        <Form {...formItemLayout} onSubmit={this.handleSubmit} len = {20}
        //  onClose={this.onClose}//子传父，儿子触发onClose然后调用本身的上面的onClose方法。然后在上面的方法里面调用父的方法
        //  visible={this.props.visible2}//父传子直接prpos来进行接受     
        //  之前想法是错误的  ，  子调用父 不用传对象，   就跟router 和 menu 一样 只需在 父组件的子组件标签里面 定义好 子组件需要调用的属性即可，然后子组件直接this.prpo.func() 既可以 ，然后父组件在引入的子组件里面接受然后进行相应处理（调用本身或是其他）
        >
          <Form.Item
            label="账户名"
          >
            {getFieldDecorator('account', {
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
             label={(
              <span>
                手机号&nbsp;
                <Tooltip title="注册时填写的手机号,用于修改密码验证身份">
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
                <Tooltip title="密码必须包含数字、字母，区分大小写">
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
          <Form.Item
            label="确认密码"
          >
            {getFieldDecorator('confirm', {
              rules: [{
                required: true, message: '请确认密码!',
              }, {
                validator: this.compareToFirstPassword,
              }],
            })(
              <Input type="password" onBlur={this.handleConfirmBlur} />
            )}
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" style={{ left: '30%' }} htmlType="submit">确认修改密码</Button>
          </Form.Item>
        </Form>
        </div>
        </div>
      );
    }
  }
  const WrappedRegistrationForm = Form.create({ name: 'register' })(RegistrationForm);
  export default WrappedRegistrationForm