import React, { Component } from 'react'
import { reqHotSpotsDetail, reqIsLogin } from '../../../api'
import { Icon, WingBlank, Button, Modal } from 'antd-mobile'
import { observable } from 'mobx'
import { observer, inject } from 'mobx-react'
const { alert } = Modal
@inject('store')
@observer
class DetailPage extends Component {
  @observable detailContent = {}
  @observable detailData = {}
  @observable proxyUrl = ''
  @observable loginInfo = undefined
  constructor(props) {
    super(props)
    this.proxyUrl = props.store.proxy
    this.detailContent = {
      name: window.decodeURI(
        props.history.location.search.split('=')[1].split('&')[0]
      ),
      id: props.history.location.search.split('=')[2]
    }
    this.reqHotSpotsDetail(this.detailContent)
  }
  reqIsLogin = async () => {
    const res = await reqIsLogin()
    this.loginInfo = res.data.code
  }
  reqHotSpotsDetail = async content => {
    const res = await reqHotSpotsDetail(content)
    if (res.data.code === 0) {
      this.detailData = res.data.data
    }
  }
  toHomePage = () => {
    this.props.history.replace('/main/homepage')
  }
  toBuy = () => {
    if (this.loginInfo === 1) {
      alert('未登录', '请您先登录!', [
        { text: 'Cancel', onPress: () => console.log('cancel') },
        {
          text: 'Ok',
          onPress: () =>
            this.props.history.push(`/login?url=${this.props.match.url}`)
        }
      ])
    } else {
      this.props.history.replace(
        `/buypage?name=${this.detailContent.name}&id=${this.detailContent.id}`
      )
    }
  }
  render() {
    return (
      <div>
        <div className="leftIcon">
          <Icon type="left" onClick={this.toHomePage} />
        </div>
        <div className="spot_img">
          <img src={this.proxyUrl + this.detailData.image_url} alt="景点" />
        </div>
        <WingBlank>
          <div className="spot_detail">
            <div className="spot_content">
              <div className="spotname">
                <h1>{this.detailData.spots}</h1>
                <p>{this.detailData.level}</p>
                <span>{this.detailData.description}</span>
              </div>
              <div className="pingfen">
                <span>{this.detailData.stars}</span>/5分
              </div>
            </div>
            <div className="introduce">
              <h1>景点介绍</h1>
              <div>{this.detailData.credit}</div>
              <h1>乘车路线</h1>
              <div>{this.detailData.traffic}</div>
              <h1>开放时间</h1>
              <div>{this.detailData.spring}</div>
              <div>{this.detailData.spring_time}</div>
              <div>{this.detailData.summer}</div>
              <div>{this.detailData.summer_time}</div>
              <h1>票价</h1>
              <div>全票：{this.detailData.all_price}/人</div>
              <div>半票：{this.detailData.middle_price}/人</div>
              <div>年票：{this.detailData.year_price}/人</div>
              <Button
                type="primary"
                style={{
                  height: '32px',
                  lineHeight: '32px',
                  marginTop: '20px'
                }}
                onClick={this.toBuy}
              >
                购票
              </Button>
            </div>
          </div>
        </WingBlank>
      </div>
    )
  }
}
export default DetailPage
