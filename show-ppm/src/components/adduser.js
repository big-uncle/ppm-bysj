import {
  message, Radio, Form, Input, Tooltip, Icon, Select, Checkbox, Button, AutoComplete,
} from 'antd';
import React from 'react'
import "antd/dist/antd.css";
import styles from "./index.css";
import * as conf from "../utils/conf";
const { Option } = Select;
const RadioGroup = Radio.Group;

const AutoCompleteOption = AutoComplete.Option;
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
      if (!err) {
        console.log('接受到的表单值: ', values);
        if (!values.agreement){
          message.error('请仔细阅读并同意勾选下方服务协议框!')
        }else{
        setTimeout(() => {
          fetch(conf.apiurl() + '/api/register', {
            method: 'POST',
            mode: "cors",//处理跨域
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'account=' + values.account + '&name=' + values.userName + '&phone=' + values.phone+'&newpwd='+values.password+'&sex='+values.sex,
          }).then(res => {
            res.json().then(obj => {
  if (obj.success===false){
    message.error(obj.msg)
    }else if (obj.success===true){
        message.success(obj.msg)

        setTimeout(function () {
          window.location.reload()//刷新地址栏
      }, 888);
    }
            }
            )
          })
        }, 88)//做了88秒延迟才取数据请求接口     
      }   
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
    const { autoCompleteResult } = this.state;

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
    const prefixSelector = getFieldDecorator('prefix', {
      initialValue: '86',
    })(
      <Select style={{ width: 70 }}>
        <Option value="86">+86</Option>
        <Option value="87">+87</Option>
      </Select>
    );

    const websiteOptions = autoCompleteResult.map(website => (
      <AutoCompleteOption key={website}>{website}</AutoCompleteOption>
    ));

    return (
      <div>
      <div className={styles.adduserhead}>
      </div>
      <div className={styles.adduser}>
      
      <Form {...formItemLayout} onSubmit={this.handleSubmit} len = {20}>
        <Form.Item
          label="姓名"
        >
          {getFieldDecorator('userName', {
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
            initialValue: 1, //默认值
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
              手机号&nbsp;
              <Tooltip title="用于修改密码时的身份验证">
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
          )}
        >
    
          {getFieldDecorator('phone', {
            rules: [{ pattern: /^1[34578]\d{9}$/, message: '请输入正确的手机号码' },
              { required: true, message: '请输入手机号!' }],
          })(
            <Input addonBefore={prefixSelector} style={{ width: '100%' }} />
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
          {getFieldDecorator('agreement', {
              // initialValue: 'checked' , //默认值
              rules: [{ required: true, message: '请仔细阅读并同意勾选服务协议框!' }],
            valuePropName: 'checked', 
          })(
            <Checkbox>我已阅读并同意相关服务条款<a href="./tiaoyue.html" target="_blank">《PPM协议》</a></Checkbox>
          )}
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">注册</Button>
        </Form.Item>
      </Form>
      </div>
      </div>
    );
  }
}

const WrappedRegistrationForm = Form.create({ name: 'register' })(RegistrationForm);

export default WrappedRegistrationForm