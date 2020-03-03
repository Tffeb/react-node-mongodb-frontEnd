/*
注册的路由组件
 */

import React, { Component } from 'react'
import { observable } from 'mobx'
import { observer, inject } from 'mobx-react'
import {
  List,
  InputItem,
  WhiteSpace,
  Button,
  Toast,
  NavBar,
  Icon
} from 'antd-mobile'
import { reqRegister } from '../../api'
import logo from '../../assets/images/logo.png'

@inject('store')
@observer
class Register extends Component {
  @observable userInfo = {}
  @observable usernameErrorMsg = ''
  @observable passwordErrorMsg = ''
  @observable passwordErrorMsg2 = ''
  constructor(props) {
    super(props)
    this.initData()
  }
  initData = () => {
    this.userInfo = {
      username: '', // 用户名
      password: '', // 密码
      password2: '' // 确认密码
    }
  }
  successToast = () => {
    Toast.success('注册成功,正在进入!!!', 1, () => {
      this.props.history.goBack() //返回上一页
    })
  }
  // 点击注册调用
  register = async userInfo => {
    const { username, password, password2 } = userInfo
    if (!username) {
      this.usernameErrorMsg = '用户名不能为空！'
    } else if (!password) {
      this.passwordErrorMsg = '密码不能为空！'
    } else if (password !== password2) {
      this.passwordErrorMsg2 = '两次密码要保持一致！'
    } else {
      reqRegister({ username, password }).then(res => {
        if (res.data.code === 0) {
          this.successToast()
        } else {
          this.passwordErrorMsg2 = res.data.msg
        }
      })
    }
  }

  // 处理输入数据的改变: 更新对应的状态
  handleChange = (name, val) => {
    // 更新状态
    this.usernameErrorMsg = ''
    this.passwordErrorMsg = ''
    this.passwordErrorMsg2 = ''
    this.userInfo[name] = val // 属性名不是name, 而是name变量的值
  }

  toLogin = () => {
    this.props.history.replace('/login')
  }
  toHome = () => {
    this.props.history.replace('/main/homepage')
  }
  render() {
    // 如果redirectTo有值, 就需要重定向到指定的路由
    const style = {
      marginTop: '10px',
      marginLeft: '105px',
      fontSize: '17px',
      color: 'red'
    }
    return (
      <div>
        <NavBar
          mode="dark"
          leftContent={<Icon type="left" onClick={this.toHome} />}
        >
          注册
        </NavBar>
        <div style={{ width: '100%' }}>
          <img src={logo} alt="logo" style={{ width: '100%' }} />
        </div>
        <List>
          <WhiteSpace />
          <InputItem
            placeholder="请输入用户名"
            onChange={val => {
              this.handleChange('username', val)
            }}
          >
            用户名:
          </InputItem>
          {this.usernameErrorMsg ? (
            <div style={style}>{this.usernameErrorMsg}</div>
          ) : (
            ''
          )}
          <WhiteSpace />
          <InputItem
            placeholder="请输入密码"
            type="password"
            onChange={val => {
              this.handleChange('password', val)
            }}
          >
            密&nbsp;&nbsp;&nbsp;码:
          </InputItem>
          {this.passwordErrorMsg ? (
            <div style={style}>{this.passwordErrorMsg}</div>
          ) : (
            ''
          )}
          <WhiteSpace />
          <InputItem
            placeholder="请输入确认密码"
            type="password"
            onChange={val => {
              this.handleChange('password2', val)
            }}
          >
            确认密码:
          </InputItem>
          <div style={style}>{this.passwordErrorMsg2}</div>
          <WhiteSpace />
          <Button type="primary" onClick={() => this.register(this.userInfo)}>
            注&nbsp;&nbsp;&nbsp;册
          </Button>
          <WhiteSpace />
          <Button onClick={this.toLogin}>已有账户,去登录</Button>
        </List>
      </div>
    )
  }
}

export default Register
