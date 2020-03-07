import React, { Component } from 'react'
import { Icon, WingBlank, Result, Toast, Modal, SearchBar } from 'antd-mobile'
import { reqIsLogin, reqPraise, reqNoPraise, reqSearchInfo } from '../../../api'
import { observable } from 'mobx'
import { observer, inject } from 'mobx-react'
const alert = Modal.alert
@inject('store')
@observer
class Search extends Component {
  @observable loginInfo = null
  @observable articalInfo = []
  @observable proxyUrl = ''
  @observable src =
    'https://gw.alipayobjects.com/mdn/miniapp_social/afts/img/A*pevERLJC9v0AAAAAAAAAAABjAQAAAQ/original'
  constructor(props) {
    super(props)
    this.proxyUrl = props.store.proxy
  }
  reqIsLogin = async () => {
    const res = await reqIsLogin()
    if (res.data.code === 0) {
      this.loginInfo = res.data.data
    } else {
      if (res.data.code === 1) {
        alert('未登录', '请您先登录!', [
          { text: 'Cancel', onPress: () => console.log('cancel') },
          {
            text: 'Ok',
            onPress: () =>
              this.props.history.replace(`/login?url=${this.props.match.url}`)
          }
        ])
      }
    }
  }
  reqPraise = async index => {
    const res = await reqPraise({
      commentid: this.articalInfo[index]._id,
      userid: this.loginInfo._id
    })
    if (res.data.code === 0) {
      Toast.info(res.data.msg)
    }
  }
  reqNoPraise = async index => {
    const res = await reqNoPraise({
      commentid: this.articalInfo[index]._id,
      userid: this.loginInfo._id
    })
    if (res.data.code === 0) {
      Toast.info(res.data.msg)
    }
  }
  clickPraise = (e, index) => {
    if (this.loginInfo === null) {
      this.reqIsLogin()
      return
    } else {
      this.isClick = !this.isClick
      if (!e.target.parentNode.getAttribute('class')) {
        this.reqPraise(index)
        e.target.parentNode.setAttribute('class', 'isPraise')
      } else {
        this.reqNoPraise(index)
        e.target.parentNode.removeAttribute('class', 'isPraise')
      }
    }
  }
  comment = index => {
    this.props.history.replace(`/main/community/${this.articalInfo[index]._id}`)
  }
  componentDidMount() {
    this.autoFocusInst.focus()
  }
  toCommunity = () => {
    this.props.history.replace('/main/community')
  }
  onSearch = value => {
    reqSearchInfo({ search: value }).then(res => {
      if (res.data.code === 0) {
        this.articalInfo = res.data.data
      }
    })
  }
  timestampToTime = timestamp => {
    return new Date(parseFloat(timestamp)).toLocaleString()
  }
  render() {
    return (
      <div>
        <div
          style={{
            display: 'flex',
            width: '100%',
            alignItems: 'center'
          }}
        >
          <Icon
            key="1"
            type="left"
            onClick={this.toCommunity}
            style={{
              width: '10%',
              background: 'rgba(235,235,241,0.6)',
              height: '44px',
              color: '#fff'
            }}
          />
          <SearchBar
            placeholder="请输入相关趣事"
            style={{ width: '90%' }}
            ref={ref => (this.autoFocusInst = ref)}
            onSubmit={this.onSearch}
          />
        </div>
        <div className="contentbody">
          {!this.articalInfo.length ? (
            <Result
              img={<img src={this.src} className="spe am-icon am-icon-lg" />}
              message="暂无数据"
            />
          ) : (
            <WingBlank>
              {this.articalInfo.map((info, index) => (
                <div className="community_list" key={index}>
                  <div className="list_content">
                    <div className="content">
                      <img src={this.proxyUrl + info.avatar} alt="" />
                      <h1>
                        <span style={{ marginRight: '20px', color: '#ccc' }}>
                          {info.author}
                        </span>
                        {info.content}
                      </h1>
                    </div>
                    <div className="list_img">
                      {info.imagefile && info.imagefile.length === 1 ? (
                        <img
                          src={this.proxyUrl + info.imagefile[0]}
                          alt="帖子图片"
                          style={{ maxHeight: '140px', maxWidth: '100px' }}
                        />
                      ) : (
                        info.imagefile.map((file, dex) => (
                          <img
                            src={this.proxyUrl + file}
                            alt="帖子图片"
                            key={dex}
                            style={{ height: '80px', width: '80px' }}
                          />
                        ))
                      )}
                    </div>
                    <div className="list_date">
                      <span>{this.timestampToTime(info.date)}</span>
                      <span
                        style={{ margin: '0 20px' }}
                        onClick={e => this.clickPraise(e, index)}
                      >
                        <i className="iconfont icon-dianzan">
                          赞{info.praise.length ? info.praise.length : ''}
                        </i>
                      </span>
                      <span onClick={() => this.comment(index)}>
                        <i className="iconfont icon-006pinglunhuifu"></i>评论
                        {info.commentNumber ? info.commentNumber : ''}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </WingBlank>
          )}
        </div>
      </div>
    )
  }
}
export default Search
