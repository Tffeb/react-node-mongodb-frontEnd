import React, { Component } from 'react'
import { NavBar, Tabs, Badge, Button, Toast, Modal, Result } from 'antd-mobile'
import { observable } from 'mobx'
import { observer, inject } from 'mobx-react'
import { reqIsLogin, reqOrderInfo, reqDeleteOrder } from '../../../api'
const { alert } = Modal
@inject('store')
@observer
class Order extends Component {
  @observable loginInfo = {}
  @observable orderInfoData = []
  @observable waitToPayData = []
  @observable toPayData = []
  @observable proxyUrl = ''
  @observable src =
    'https://gw.alipayobjects.com/mdn/miniapp_social/afts/img/A*pevERLJC9v0AAAAAAAAAAABjAQAAAQ/original'
  constructor(props) {
    super(props)
    this.proxyUrl = props.store.proxy
    this.reqIsLogin()
    this.reqOrderInfo()
  }
  reqIsLogin = async () => {
    const res = await reqIsLogin()
    this.loginInfo = res.data
  }
  reqOrderInfo = async () => {
    this.waitToPayData = []
    this.toPayData = []
    const res = await reqOrderInfo()
    if (res.data.code === 0) {
      this.orderInfoData = res.data.data
      this.orderInfoData.map(item => {
        if (item.state === 1) {
          this.waitToPayData.push(item)
        }
      })
      this.orderInfoData.map(item => {
        if (item.state === 0) {
          this.toPayData.push(item)
        }
      })
    }
  }
  reqDeleteOrder = async deleteOrder => {
    const res = await reqDeleteOrder(deleteOrder)
    if (res.data.code === 0) {
      Toast.info(res.data.msg)
    }
  }
  delOrder = item => {
    alert('删除订单', `你确定要删除该订单吗?`, [
      { text: 'Cancel', onPress: () => console.log('cancel') },
      {
        text: 'Ok',
        onPress: () => {
          this.reqDeleteOrder({ orderid: item._id })
          this.reqOrderInfo()
        }
      }
    ])
  }
  timestampToTime = timestamp => {
    return new Date(parseFloat(timestamp)).toLocaleString()
  }
  toLogin = () => {
    this.props.history.replace(`/login?url=${this.props.match.url}`)
  }
  toPay = item => {
    this.props.history.push(`/main/order/topay?id=${item._id}`)
  }
  render() {
    const tabs = [
      { title: <Badge text={this.orderInfoData.length}>全部</Badge> },
      { title: <Badge text={this.waitToPayData.length}>待付款</Badge> },
      { title: <Badge text={this.toPayData.length}>已付款</Badge> }
    ]

    return (
      <div>
        <NavBar
          mode="dark"
          onLeftClick={() => console.log('onLeftClick')}
          leftContent="订单"
        />
        {this.loginInfo.code === 1 ? (
          <div className="loginState">
            {this.loginInfo.msg}
            <Button type="primary" onClick={this.toLogin}>
              登录
            </Button>
          </div>
        ) : (
          <Tabs tabs={tabs} initialPage={0}>
            <div
              style={{
                overflow: 'auto',
                height: window.innerHeight - 141
              }}
            >
              {!this.orderInfoData.length ? (
                <Result
                  img={
                    <img src={this.src} className="spe am-icon am-icon-lg" />
                  }
                  message="暂无任何订单"
                />
              ) : (
                this.orderInfoData.map((item, index) => (
                  <div className="order_item" key={index}>
                    <div className="item_title">
                      <span>{item.ordername}门票</span>
                      <span style={{ marginLeft: '20px' }}>
                        订单编号：{item._id}
                      </span>
                    </div>
                    <div className="item">
                      <div className="item_img">
                        <img src={this.proxyUrl + item.orderimg} alt="景点图" />
                      </div>
                      <div className="item_info">
                        <div>
                          张数：<span>{item.number}</span>
                        </div>
                        <div>
                          总价：<span>{item.price}元</span>
                        </div>
                        <br />
                        <div>
                          订单创建时间：
                          <p>{this.timestampToTime(item.createTime)}</p>
                        </div>
                      </div>
                    </div>
                    <div className="pay">
                      {item.state === 1 ? (
                        <Button type="default" onClick={() => this.toPay(item)}>
                          去付款
                        </Button>
                      ) : (
                        <Button type="default" disabled>
                          已付款
                        </Button>
                      )}
                      <Button
                        type="default"
                        onClick={() => this.delOrder(item)}
                      >
                        删除订单
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div
              style={{
                overflow: 'auto',
                height: window.innerHeight - 141
              }}
            >
              {!this.waitToPayData.length ? (
                <Result
                  img={
                    <img src={this.src} className="spe am-icon am-icon-lg" />
                  }
                  message="暂无任何订单"
                />
              ) : (
                this.waitToPayData.map((item, index) => (
                  <div className="order_item" key={index}>
                    <div className="item_title">
                      <span>{item.ordername}门票</span>
                      <span style={{ marginLeft: '20px' }}>
                        订单编号：{item._id}
                      </span>
                    </div>
                    <div className="item">
                      <div className="item_img">
                        <img src={this.proxyUrl + item.orderimg} alt="景点图" />
                      </div>
                      <div className="item_info">
                        <div>
                          张数：<span>{item.number}</span>
                        </div>
                        <div>
                          总价：<span>{item.price}元</span>
                        </div>
                        <br />
                        <div>
                          订单创建时间：
                          <p>{this.timestampToTime(item.createTime)}</p>
                        </div>
                      </div>
                    </div>
                    <div className="pay">
                      <Button type="default" onClick={() => this.toPay(item)}>
                        去付款
                      </Button>
                      <Button
                        type="default"
                        onClick={() => this.delOrder(item)}
                      >
                        删除订单
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div
              style={{
                overflow: 'auto',
                height: window.innerHeight - 141
              }}
            >
              {!this.toPayData.length ? (
                <Result
                  img={
                    <img src={this.src} className="spe am-icon am-icon-lg" />
                  }
                  message="暂无任何订单"
                />
              ) : (
                this.toPayData.map((item, index) => (
                  <div className="order_item" key={index}>
                    <div className="item_title">
                      <span>{item.ordername}门票</span>
                      <span style={{ marginLeft: '20px' }}>
                        订单编号：{item._id}
                      </span>
                    </div>
                    <div className="item">
                      <div className="item_img">
                        <img src={this.proxyUrl + item.orderimg} alt="景点图" />
                      </div>
                      <div className="item_info">
                        <div>
                          张数：<span>{item.number}</span>
                        </div>
                        <div>
                          总价：<span>{item.price}元</span>
                        </div>
                        <br />
                        <div>
                          订单创建时间：
                          <p>{this.timestampToTime(item.createTime)}</p>
                        </div>
                      </div>
                    </div>
                    <div className="pay">
                      <Button type="default" disabled>
                        已付款
                      </Button>
                      <Button
                        type="default"
                        onClick={() => this.delOrder(item)}
                      >
                        删除订单
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Tabs>
        )}
      </div>
    )
  }
}

export default Order
