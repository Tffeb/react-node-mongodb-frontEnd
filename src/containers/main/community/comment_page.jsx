import React, { Component } from 'react'
import {
  NavBar,
  Icon,
  WingBlank,
  Button,
  Toast,
  Modal,
  Result
} from 'antd-mobile'
import {
  reqCommentPage,
  reqComment,
  reqCommentInfo,
  reqPraise,
  reqNoPraise,
  reqIsLogin,
  reqReplay,
  reqReplayInfo,
  reqCommentPraise,
  reqNoCommentPraise
} from '../../../api'
import { observable } from 'mobx'
import { observer, inject } from 'mobx-react'
import { PhotoSlider } from 'react-photo-view'
import '../../../assets/js/scrollToAnchor'
const alert = Modal.alert

@inject('store')
@observer
class CommentPage extends Component {
  @observable proxyUrl = ''
  @observable articalid = { id: '' }
  @observable articalone = {}
  @observable commentshow = false
  @observable sayData = ''
  @observable commentId = ''
  @observable commentInfo = []
  @observable replayInfo = []
  @observable praiseIndex = []
  @observable loginInfo = null
  @observable isDisabled = true
  @observable isCover = false
  @observable isComment = false
  @observable isOpen = false
  @observable isCommentIndex = null
  @observable praiseClass = false
  @observable commentPraise = false
  @observable imgIndex = 0
  @observable visible = false
  @observable src =
    'https://gw.alipayobjects.com/mdn/miniapp_social/afts/img/A*pevERLJC9v0AAAAAAAAAAABjAQAAAQ/original'
  constructor(props) {
    super(props)
    this.proxyUrl = props.store.proxy
    this.articalid.id = props.match.params.id
    this.reqCommentPage(this.articalid)
    this.reqIsLogin()
  }
  reqIsLogin = async () => {
    const res = await reqIsLogin()
    if (res.data.code === 0) {
      this.loginInfo = res.data.data
    }
  }
  reqPraise = async () => {
    const res = await reqPraise({
      commentid: this.articalone._id,
      userid: this.loginInfo._id
    })
    if (res.data.code === 0) {
      Toast.info(res.data.msg, 1, () => this.reqCommentPage(this.articalid))
    }
  }
  reqNoPraise = async () => {
    const res = await reqNoPraise({
      commentid: this.articalone._id,
      userid: this.loginInfo._id
    })
    if (res.data.code === 0) {
      Toast.info(res.data.msg, 1, () => this.reqCommentPage(this.articalid))
    }
  }
  clickPraise = e => {
    if (this.loginInfo === null) {
      alert('未登录', '请您先登录!', [
        { text: 'Cancel', onPress: () => console.log('cancel') },
        {
          text: 'Ok',
          onPress: () =>
            this.props.history.replace(`/login?url=${this.props.match.url}`)
        }
      ])
    } else {
      if (!e.target.parentNode.getAttribute('class')) {
        this.reqPraise()
        e.target.parentNode.setAttribute('class', 'isPraise')
      } else {
        this.reqNoPraise()
        e.target.parentNode.removeAttribute('class', 'isPraise')
      }
    }
  }
  clickCommentPraise = (e, comment) => {
    if (this.loginInfo === null) {
      alert('未登录', '请您先登录!', [
        { text: 'Cancel', onPress: () => console.log('cancel') },
        {
          text: 'Ok',
          onPress: () =>
            this.props.history.replace(`/login?url=${this.props.match.url}`)
        }
      ])
    } else {
      if (!e.target.parentNode.getAttribute('class')) {
        this.reqCommentPraise(comment._id)
        e.target.parentNode.setAttribute('class', 'isPraise')
      } else {
        this.reqNoCommentPraise(comment._id)
        e.target.parentNode.removeAttribute('class', 'isPraise')
      }
    }
  }
  reqCommentPraise = async commentId => {
    const res = await reqCommentPraise({
      commentid: commentId,
      userid: this.loginInfo._id
    })
    if (res.data.code === 0) {
      Toast.info(res.data.msg, 1, () => this.reqCommentInfo())
    }
  }
  reqNoCommentPraise = async commentId => {
    const res = await reqNoCommentPraise({
      commentid: commentId,
      userid: this.loginInfo._id
    })
    if (res.data.code === 0) {
      Toast.info(res.data.msg, 1, () => this.reqCommentInfo())
    }
  }
  // 发起评论
  commentSay = () => {
    if (this.loginInfo === null) {
      alert('未登录', '请您先登录!', [
        { text: 'Cancel', onPress: () => console.log('cancel') },
        {
          text: 'Ok',
          onPress: () =>
            this.props.history.replace(`/login?url=${this.props.match.url}`)
        }
      ])
    } else {
      this.isComment = true
      this.isCover = true
      this.commentshow = true
      this.sayData = '评论:'
      this.textInput.focus()
      setTimeout(function() {
        this.textInput.scrollIntoView()
        this.textInput.scrollIntoViewIfNeeded()
      }, 300)
    }
  }
  //回复
  replay = toUser => {
    if (this.loginInfo === null) {
      alert('未登录', '请您先登录!', [
        { text: 'Cancel', onPress: () => console.log('cancel') },
        {
          text: 'Ok',
          onPress: () =>
            this.props.history.replace(`/login?url=${this.props.match.url}`)
        }
      ])
    } else {
      this.commentId = toUser._id
      this.isComment = false
      this.isCover = true
      this.commentshow = true
      this.sayData = `回复:@${toUser.author}`
      this.textInput.focus()
      setTimeout(function() {
        this.textInput.scrollIntoView()
        this.textInput.scrollIntoViewIfNeeded()
      }, 300)
    }
  }
  // 评论提交
  sendComment = () => {
    reqComment({
      comment: this.textInput.value,
      articalId: this.articalone._id
    }).then(res => {
      this.reqCommentPage(this.articalid)
      this.hideComment()
      this.textInput.value = ''
    })
  }
  //回复
  sendCommentTo = () => {
    reqReplay({
      comment: this.textInput.value,
      commentId: this.commentId
    }).then(res => {
      // this.reqCommentPage(this.articalid)
      this.hideComment()
      this.textInput.value = ''
    })
  }
  hideComment = () => {
    this.isCover = false
    this.commentshow = false
    setTimeout(function() {
      this.textInput.scrollIntoView()
      this.textInput.scrollIntoViewIfNeeded()
    }, 300)
  }
  inputChange = () => {
    if (this.textInput.value) {
      this.isDisabled = false
    } else {
      this.isDisabled = true
    }
  }
  // 评论回显
  reqCommentPage = async idobj => {
    const res = await reqCommentPage(idobj)
    if (res.data.code === 0) {
      this.articalone = res.data.data
      this.articalone.praise.length &&
        this.articalone.praise.map(item => {
          if (this.loginInfo && this.loginInfo._id === item) {
            this.praiseClass = true
          }
        })
    }
    this.reqCommentInfo()
  }
  reqCommentInfo = async () => {
    const res = await reqCommentInfo({ articalid: this.articalone._id })
    if (res.data.code === 0) {
      this.commentInfo = res.data.data
      this.commentInfo.map((item, index) => {
        item.praise.length &&
          item.praise.map(list => {
            if (this.loginInfo && this.loginInfo._id === list) {
              this.commentPraise = true
              this.praiseIndex.push(index)
            }
          })
      })
    }
    this.commentInfo.map(item => this.reqReplayInfo(item._id))
  }
  toOpen = (comment, index) => {
    this.reqReplayInfo(comment._id)
    this.isOpen = !this.isOpen
    this.isCommentIndex = index
  }
  reqReplayInfo = async commentId => {
    const res = await reqReplayInfo({ commentid: commentId })
    if (res.data.code === 0) {
      this.replayInfo = res.data.data
    }
  }
  indexChange = index => {
    this.imgIndex = index
  }
  showImg = dex => {
    this.imgIndex = dex
    this.visible = true
  }
  showImgOne = () => {
    this.imgIndex = 0
    this.visible = true
  }
  closeImg = () => {
    this.visible = false
  }
  handleChange = () => {
    this.props.history.replace('/main/community')
  }
  timestampToTime = timestamp => {
    return new Date(parseFloat(timestamp)).toLocaleString()
  }
  render() {
    return (
      <div>
        <NavBar
          mode="dark"
          leftContent={<Icon key="1" type="left" onClick={this.handleChange} />}
        >
          评论区
        </NavBar>
        <div className="contentbody">
          <WingBlank>
            <div className="community_list">
              <div className="list_content">
                <div className="content">
                  <img
                    src={this.proxyUrl + this.articalone.avatar}
                    alt="头像"
                  />
                  <h1>
                    <span style={{ marginRight: '20px', color: '#ccc' }}>
                      {this.articalone.author}
                    </span>
                    {this.articalone.content}
                  </h1>
                </div>
                <div className="list_img">
                  {this.articalone.imagefile &&
                  this.articalone.imagefile.length === 1 ? (
                    <img
                      src={this.proxyUrl + this.articalone.imagefile[0]}
                      alt="帖子图片"
                      style={{ maxHeight: '140px', maxWidth: '100px' }}
                      onClick={this.showImgOne}
                    />
                  ) : (
                    this.articalone.imagefile &&
                    this.articalone.imagefile.map((file, dex) => (
                      <img
                        src={this.proxyUrl + file}
                        alt="帖子图片"
                        key={dex}
                        style={{ height: '80px', width: '80px' }}
                        onClick={() => this.showImg(dex)}
                      />
                    ))
                  )}
                </div>
                {/* 图片预览 */}
                {this.articalone.imagefile && (
                  <PhotoSlider
                    images={this.articalone.imagefile.map(item => ({
                      src: this.proxyUrl + item
                    }))}
                    visible={this.visible}
                    onClose={this.closeImg}
                    index={this.imgIndex}
                    onIndexChange={this.indexChange}
                  />
                )}
                <div className="list_date">
                  <span>{this.timestampToTime(this.articalone.date)}</span>
                  <span
                    className={this.praiseClass ? 'isPraise' : ''}
                    style={{ margin: '0 20px' }}
                    onClick={e => this.clickPraise(e)}
                  >
                    <i className="iconfont icon-dianzan">
                      赞
                      {(this.articalone.praise &&
                        this.articalone.praise.length) ||
                        ''}
                    </i>
                  </span>
                  <span onClick={this.commentSay}>
                    <i className="iconfont icon-006pinglunhuifu"></i>评论
                    {this.articalone.commentNumber
                      ? this.articalone.commentNumber
                      : ''}
                  </span>
                </div>
              </div>
            </div>
            <div style={{ lineHeight: '30px' }}>评论区</div>
            {!this.commentInfo.length ? (
              <Result
                img={<img src={this.src} className="spe am-icon am-icon-lg" />}
                message="暂无评论"
              />
            ) : (
              this.commentInfo.map((comment, index) => (
                <div className="community_list" key={index}>
                  <div className="list_content">
                    <div className="content">
                      <img src={this.proxyUrl + comment.avatar} alt="头像" />
                      <h1>
                        <span style={{ marginRight: '20px', color: '#ccc' }}>
                          {comment.author}
                        </span>
                        {comment.content}
                      </h1>
                    </div>
                    <div className="list_date">
                      <span>{this.timestampToTime(comment.createTime)}</span>
                      <span
                        className={
                          this.praiseIndex.includes(index) && this.commentPraise
                            ? 'isPraise'
                            : ''
                        }
                        style={{ margin: '0 10px' }}
                        onClick={e => this.clickCommentPraise(e, comment)}
                      >
                        <i className="iconfont icon-dianzan">
                          赞{comment.praise.length || ''}
                        </i>
                      </span>
                      <span onClick={() => this.replay(comment)}>
                        <i className="iconfont icon-006pinglunhuifu"></i>回复
                      </span>
                      <span
                        onClick={() => this.toOpen(comment, index)}
                        style={{ color: '#ccc', marginLeft: '20px' }}
                      >
                        {this.isCommentIndex === index && this.isOpen
                          ? '收起所有回复'
                          : '展开所有回复'}
                      </span>
                    </div>
                    <div
                      className={
                        this.isCommentIndex === index && this.isOpen
                          ? 'replay_comment'
                          : 'replayHidden'
                      }
                    >
                      {!this.replayInfo.length ? (
                        <Result
                          img={
                            <img
                              src={this.src}
                              className="spe am-icon am-icon-lg"
                            />
                          }
                          message="暂无评论"
                        />
                      ) : (
                        this.replayInfo.map((replay, index) => (
                          <div key={index}>
                            <div>
                              <h1>
                                <span
                                  style={{
                                    marginRight: '20px',
                                    color: 'rgb(50,110,201)'
                                  }}
                                >
                                  {replay.author}:
                                </span>
                                {replay.content}
                              </h1>
                            </div>
                            <div className="list_date">
                              <span>
                                {this.timestampToTime(replay.createTime)}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
            {/* 评论 */}
            <div
              className={this.commentshow ? 'inputbox' : 'inputbox activeInput'}
              id="inputbox"
            >
              {this.isComment ? (
                <Button
                  type="primary"
                  className="sure-btn"
                  disabled={this.isDisabled}
                  onClick={this.sendComment}
                >
                  发送
                </Button>
              ) : (
                <Button
                  type="primary"
                  className="sure-btn"
                  disabled={this.isDisabled}
                  onClick={() => this.sendCommentTo()}
                >
                  发送
                </Button>
              )}
              <div className="ellipsis">
                <input
                  type="text"
                  className="text-input"
                  id="textInput"
                  ref={input => {
                    this.textInput = input
                  }}
                  placeholder={this.sayData}
                  onChange={this.inputChange}
                />
              </div>
            </div>
          </WingBlank>
        </div>
        <div
          className={this.isCover ? 'cover' : ''}
          onClick={this.hideComment}
        ></div>
      </div>
    )
  }
}

export default CommentPage
