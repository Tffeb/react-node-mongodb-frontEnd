import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import {
  NavBar,
  Icon,
  WingBlank,
  List,
  Button,
  Toast,
  Modal
} from 'antd-mobile'
import { reqIsLogin, reqLoginOut, reqUserInfo } from '../../../api'
import { observable } from 'mobx'
import { observer, inject } from 'mobx-react'
const Item = List.Item
const alert = Modal.alert
@inject('store')
@observer
class My extends Component {
  @observable loginInfo = {}
  @observable loginOutInfo = {}
  @observable userInfo = {}
  @observable avatar = ''
  @observable proxyUrl = ''
  constructor(props) {
    super(props)
    this.proxyUrl = props.store.proxy
    this.reqIsLogin()
    this.reqUserInfo()
    this.initData()
  }
  initData = () => {
    this.userInfo = {
      nickname: '',
      signature: ''
    }
  }
  reqIsLogin = async () => {
    const res = await reqIsLogin()
    this.loginInfo = res.data
  }
  toLogin = () => {
    this.props.history.replace(`/login?url=${this.props.match.url}`)
  }
  reqUserInfo = async () => {
    const res = await reqUserInfo()
    if (res.data.code === 0) {
      this.userInfo.nickname = res.data.data.nickname
      this.userInfo.signature = res.data.data.signature
      this.avatar = res.data.data.avatar
    }
  }
  successToast = info => {
    Toast.success(info.msg, 1, () => {
      this.reqIsLogin()
    })
  }

  reqLoginOut = () => {
    alert('退出', '您确定要退出么?', [
      { text: 'Cancel', onPress: () => console.log('cancel') },
      {
        text: 'Ok',
        onPress: async () => {
          const res = await reqLoginOut()
          this.loginOutInfo = res.data
          this.successToast(this.loginOutInfo)
        }
      }
    ])
  }
  praising = () => {
    this.props.history.replace('/my/prasing')
  }
  haveComment = () => {
    this.props.history.replace('/my/havecomment')
  }
  sendComment = () => {
    this.props.history.replace('/my/sendcomment')
  }
  render() {
    return (
      <div>
        <NavBar mode="dark">我的</NavBar>
        {this.loginInfo.code === 1 ? (
          <div className="loginState">
            {this.loginInfo.msg}
            <Button type="primary" onClick={this.toLogin}>
              登录
            </Button>
          </div>
        ) : (
          <div>
            <WingBlank>
              <NavLink className="my_center" to="/main/my/personaldata">
                <div className="my_logo">
                  <img src={this.proxyUrl + this.avatar} alt="头像" />
                </div>
                <div className="my_name">
                  <span>昵称：</span>
                  <span>
                    {this.userInfo.nickname && this.userInfo.nickname}
                  </span>
                  <br />
                  <br />
                  <span>签名：</span>
                  <span>
                    {this.userInfo.signature && this.userInfo.signature}
                  </span>
                </div>
                <Icon type="right" />
              </NavLink>
            </WingBlank>
            <List>
              <Item arrow="horizontal" onClick={this.praising}>
                我赞过的帖子
              </Item>
              <Item onClick={this.haveComment} arrow="horizontal">
                我评论过的帖子
              </Item>
              <Item onClick={this.sendComment} arrow="horizontal">
                我的帖子
              </Item>
            </List>
            <Button type="warning" onClick={this.reqLoginOut}>
              退出登录
            </Button>
          </div>
        )}
      </div>
    )
  }
}

export default My
