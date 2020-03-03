import React, { Component } from 'react'
import { reqFoodDetail } from '../../../api'
import { Icon, WingBlank } from 'antd-mobile'
import { observable } from 'mobx'
import { observer, inject } from 'mobx-react'
@inject('store')
@observer
class FoodDetail extends Component {
  @observable detailContent = {}
  @observable detailData = {}
  @observable proxyUrl = ''
  constructor(props) {
    super(props)
    this.proxyUrl = props.store.proxy
    this.detailContent = {
      name: window.decodeURI(
        props.history.location.search.split('=')[1].split('&')[0]
      ),
      id: props.history.location.search.split('=')[2]
    }
    this.reqFoodDetail(this.detailContent)
  }
  reqFoodDetail = async content => {
    const res = await reqFoodDetail(content)
    if (res.data.code === 0) {
      this.detailData = res.data.data
    }
  }
  toHomePage = () => {
    this.props.history.replace('/main/homepage')
  }
  render() {
    return (
      <div>
        <div className="left_icon">
          <Icon type="left" onClick={this.toHomePage} />
        </div>
        <div className="food_img">
          <img src={this.proxyUrl + this.detailData.image_url} alt="美食" />
          <div className="food_name">{this.detailData.foodname}</div>
        </div>
        <WingBlank>
          <div className="food_detail">
            <h1>美食介绍</h1>
            <div>{this.detailData.description}</div>
          </div>
          {/* <div className="about">
            <h1>相关店铺</h1>
            <div className="shop">
              <div className="shop_name">店名</div>
              <div>
                <div className="shop_img">
                  <img src="" alt="店铺" />
                </div>
                <div>
                  <h1>mieshi</h1>
                  <span>价格</span>
                </div>
              </div>
            </div>
          </div> */}
        </WingBlank>
      </div>
    )
  }
}
export default FoodDetail
