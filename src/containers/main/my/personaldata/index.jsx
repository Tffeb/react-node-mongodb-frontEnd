import React, { Component } from 'react'
import { NavBar, Icon, List, InputItem, WhiteSpace, Toast } from 'antd-mobile'
import { reqSaveInfo, reqUserInfo, reqAvatar } from '../../../../api'
import { observable } from 'mobx'
import { observer, inject } from 'mobx-react'
@inject('store')
@observer
class PersonalData extends Component {
  @observable editType = 'edit'
  @observable userInfo = {}
  @observable avatar = ''
  @observable isChangeavatar = false
  @observable clicked = ''
  @observable avatarUrl = ''
  @observable filesAvatar = {}
  @observable proxyUrl = ''
  constructor(props) {
    super(props)
    this.proxyUrl = props.store.proxy
    this.initData()
    this.reqUserInfo()
  }
  initData = () => {
    this.userInfo = {
      nickname: '',
      signature: ''
    }
  }
  handleChange = () => {
    this.props.history.goBack()
  }
  reqUserInfo = async () => {
    const res = await reqUserInfo()
    if (res.data.code === 0) {
      this.userInfo.nickname = res.data.data.nickname
      this.userInfo.signature = res.data.data.signature
      this.avatar = res.data.data.avatar
    }
  }
  edit = () => {
    this.editType = 'save'
  }
  onCancel = () => {
    this.editType = 'edit'
  }
  successToast = info => {
    Toast.success(info.msg, 1)
  }
  failToast = info => {
    Toast.fail(info.msg, 2, () => {
      this.props.history.replace(`/login?url=${this.props.match.url}`)
    })
  }
  inputChange = e => {
    this.filesAvatar = e.target.files[0]
    this.avatarUrl =
      e.target.files[0] && window.URL.createObjectURL(e.target.files[0])
  }
  reqAvatar = async () => {
    this.isChangeavatar = false
    let formData = new FormData()
    formData.append('file', this.filesAvatar)
    const res = await reqAvatar(formData)
    Toast.loading('正在上传头像', 0)
    if (res.data.code === 0) {
      Toast.hide()
      Toast.info(res.data.msg, 1)
    } else {
      Toast.info(res.data.msg, 1.5)
    }
  }
  changeAvatar = () => {
    this.isChangeavatar = true
  }
  onSave = userInfo => {
    reqSaveInfo(userInfo).then(res => {
      if (res.data.code === 0) {
        this.successToast(res.data)
        this.reqUserInfo()
      } else {
        this.failToast(res.data)
      }
    })
    this.editType = 'edit'
  }
  nicknameRef = value => {
    this.userInfo.nickname = value
  }
  signatureRef = value => {
    this.userInfo.signature = value
  }
  render() {
    return (
      <div>
        {this.isChangeavatar ? (
          <NavBar
            mode="dark"
            leftContent={
              <Icon key="1" type="left" onClick={this.handleChange} />
            }
            rightContent={
              <span onClick={this.reqAvatar} style={{ color: '#fff' }}>
                完成
              </span>
            }
          />
        ) : (
          <NavBar
            mode="dark"
            leftContent={
              <Icon key="1" type="left" onClick={this.handleChange} />
            }
            rightContent={
              this.editType === 'edit' ? (
                <span onClick={this.edit}>编辑</span>
              ) : (
                <p>
                  <span onClick={this.onCancel} style={{ marginRight: '10px' }}>
                    取消
                  </span>
                  <span onClick={() => this.onSave(this.userInfo)}>保存</span>
                </p>
              )
            }
          >
            个人资料
          </NavBar>
        )}
        <div className="avatar" onClick={this.changeAvatar}>
          <img
            src={this.avatarUrl ? this.avatarUrl : this.proxyUrl + this.avatar}
            alt="头像"
          />
          <form
            encType="multipart/form-data"
            method="post"
            name="fileInfo"
            className="avatar_form"
          >
            <input
              type="file"
              name="file"
              className="avatar_file"
              accept="image/*"
              onChange={e => this.inputChange(e)}
            />
          </form>
        </div>
        <WhiteSpace />
        {this.isChangeavatar ? (
          ''
        ) : this.editType === 'edit' ? (
          <div>
            <List>
              <InputItem value={this.userInfo.nickname} editable={false}>
                昵称:
              </InputItem>
              <InputItem value={this.userInfo.signature} editable={false}>
                签名:
              </InputItem>
            </List>
          </div>
        ) : (
          <List>
            <InputItem
              clear
              value={this.userInfo.nickname}
              onChange={val => this.nicknameRef(val)}
            >
              昵称:
            </InputItem>
            <InputItem
              clear
              value={this.userInfo.signature}
              onChange={val => this.signatureRef(val)}
            >
              签名:
            </InputItem>
          </List>
        )}
      </div>
    )
  }
}

export default PersonalData
