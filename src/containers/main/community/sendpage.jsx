import React, { Component } from 'react'
import {
  NavBar,
  Icon,
  List,
  ImagePicker,
  TextareaItem,
  Toast,
  Modal,
  Button
} from 'antd-mobile'
import { observable } from 'mobx'
import { observer, inject } from 'mobx-react'
import { reqIsLogin, reqArtical } from '../../../api'
const alert = Modal.alert
@inject('store')
@observer
class sendPage extends Component {
  @observable files = []
  @observable loginInfo = {}
  @observable contentValue = ''
  @observable imageFiles = []
  constructor(props) {
    super(props)
    this.reqIsLogin()
  }
  onChange = (files, type, index) => {
    this.files = files
  }
  reqIsLogin = async () => {
    const res = await reqIsLogin()
    this.loginInfo = res.data
  }

  contentChange = value => {
    this.contentValue = value
  }
  reqArtical = async content => {
    const res = await reqArtical(content)
    if (res.data.code === 0) {
      Toast.info(res.data.msg, 1, () => {
        this.props.history.replace('/main/community')
      })
    }
    this.files = []
    this.contentValue = ''
  }
  toLogin = () => {
    this.props.history.replace('/login')
  }
  handleChange = () => {
    this.props.history.replace('/main/community')
  }
  pulishInfo = () => {
    if (this.files.length === 0 && this.contentValue === '') {
      Toast.info('内容不能为空!', 1, () => {
        return
      })
    } else {
      alert('发布', '您确定要发布吗?', [
        { text: 'Cancel', onPress: () => console.log('cancel') },
        {
          text: 'Ok',
          onPress: () => {
            this.files.map(file => this.imageFiles.push(file.file))
            var fd = new FormData()
            fd.append('info', this.contentValue)
            this.imageFiles.map(item => fd.append('file', item))
            this.reqArtical(fd)
          }
        }
      ])
    }
  }
  render() {
    return (
      <div>
        <NavBar
          mode="dark"
          leftContent={<Icon key="1" type="left" onClick={this.handleChange} />}
          rightContent={<span onClick={this.pulishInfo}>发布</span>}
        />
        {this.loginInfo.code === 1 ? (
          <div className="loginState">
            {this.loginInfo.msg}
            <Button type="primary" onClick={this.toLogin}>
              登录
            </Button>
          </div>
        ) : (
          <div>
            <form encType="multipart/form-data" method="post" name="fileInfo">
              <ImagePicker
                files={this.files}
                onChange={this.onChange}
                // onImageClick={(index, fs) => console.log(index, fs)}
                selectable={this.files.length < 9}
                multiple={true}
              />
              <div
                style={{
                  lineHeight: '30px',
                  fontSize: '16px',
                  paddingLeft: '10px'
                }}
              >
                发表文字
              </div>
              <List>
                <TextareaItem
                  value={this.contentValue}
                  rows={3}
                  name="info"
                  autoHeight
                  placeholder="这一刻的想法"
                  onChange={this.contentChange}
                />
              </List>
            </form>
          </div>
        )}
      </div>
    )
  }
}

export default sendPage
