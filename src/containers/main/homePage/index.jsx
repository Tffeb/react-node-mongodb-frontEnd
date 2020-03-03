import React, { Component } from 'react'
// import HeadSearch from './headSearch'
// import HotAttractions from './hotAttractions';
// import Navigation from './navigation';
// import Recommend from './recommend';
import { NavLink } from 'react-router-dom'
import { Icon, Carousel, Grid, WingBlank, Result } from 'antd-mobile'
import avatarImg from '../../../assets/images/login.png'
import { inject, observer } from 'mobx-react'
import { observable } from 'mobx'
import {
  reqHotSpots,
  reqHotFood,
  reqCity,
  reqUserInfo,
  reqCasoursel
} from '../../../api'
@inject('store')
@observer
class HomePage extends Component {
  @observable navData = []
  @observable foodData = []
  @observable foods = []
  @observable carouselData = []
  @observable carouselImg = []
  @observable hotSpotsdata = []
  @observable hotSpots = []
  @observable proxyUrl = ''
  @observable src =
    'https://gw.alipayobjects.com/mdn/miniapp_social/afts/img/A*pevERLJC9v0AAAAAAAAAAABjAQAAAQ/original'
  @observable defaultAddress = {}
  @observable avatar = ''
  constructor(props) {
    super(props)
    this.proxyUrl = props.store.proxy
    this.reqCity()
    this.reqHotSpots()
    // this.reqHotFood()
    this.reqUserInfo()
    this.reqCasoursel()
    this.state = {
      carousel: ['1', '2', '3', '4'],
      imgHeight: 176
    }
  }
  reqCasoursel = async () => {
    const res = await reqCasoursel()
    if (res.data.code === 0) {
      this.carouselData = res.data.data
    }
    this.carouselImg = this.carouselData.map(item => item.image_url)
    setTimeout(() => {
      this.setState({
        carousel: this.carouselImg
      })
    }, 100)
  }
  reqUserInfo = async () => {
    const res = await reqUserInfo()
    if (res.data.code === 0) {
      this.avatar = res.data.data.avatar
    }
  }
  reqCity = async () => {
    const res = await reqCity()
    if (res.data.code === 0) {
      this.citydata = res.data.data.data
    }
    for (const hotCity of this.citydata.hotCities) {
      if (hotCity.id === 44) {
        this.defaultAddress = hotCity
        this.reqHotSpots()
        this.reqHotFood()
      }
    }
  }
  reqHotFood = async () => {
    const res = await reqHotFood()
    if (res.data.code === 0) {
      this.foodData = res.data.data
      this.foodData.forEach(hotfood => {
        if (hotfood.id === (this.defaultAddress && this.defaultAddress.id)) {
          this.foods = hotfood.food.map(food => ({
            id: food.id,
            icon: this.proxyUrl + food.image_url,
            text: food.foodname
          }))
        }
      })
    }
  }
  reqHotSpots = async () => {
    const res = await reqHotSpots()
    if (res.data.code === 0) {
      this.hotSpotsdata = res.data.data
      const { addressInfo } = this.props.store
      if (addressInfo) {
        this.defaultAddress = addressInfo
      }
      this.hotSpotsdata.forEach(hotSpot => {
        if (hotSpot.id === (this.defaultAddress && this.defaultAddress.id)) {
          this.hotSpots = hotSpot.address
        }
      })
    }
  }
  todetail = hotspot => {
    this.props.history.replace(
      `/detailpage?name=${this.defaultAddress.text}&id=${hotspot.id}`
    )
  }
  tofoodDetail = el => {
    this.props.history.replace(
      `/fooddetail?name=${this.defaultAddress.text}&id=${el.id}`
    )
  }
  groupArr = num => {
    const startArr = []
    for (let i = 0; i < num; i++) {
      startArr.push('a')
    }
    return startArr
  }
  render() {
    return (
      <div>
        <div className="searchbar">
          <div className="header_logo">
            <NavLink to="/main/my">
              {this.avatar ? (
                <img src={this.proxyUrl + this.avatar} alt="头像" />
              ) : (
                <img src={avatarImg} alt="头像" />
              )}
            </NavLink>
          </div>
          <div className="title_name">淘趣</div>
          <NavLink to="/local" className="local">
            {this.defaultAddress.text}
            <Icon type="down" />
          </NavLink>
        </div>
        <div
          style={{
            overflow: 'auto',
            height: window.innerHeight - 95
          }}
        >
          <Carousel autoplay infinite>
            {this.state.carousel.map(val => (
              <a
                key={val}
                // href="http://www.alipay.com"
                style={{
                  display: 'inline-block',
                  width: '100%',
                  height: this.state.imgHeight
                }}
              >
                <img
                  src={this.proxyUrl + val}
                  alt=""
                  style={{ width: '100%', verticalAlign: 'top' }}
                  onLoad={() => {
                    // fire window resize event to change height
                    window.dispatchEvent(new Event('resize'))
                    this.setState({ imgHeight: '170' })
                  }}
                />
              </a>
            ))}
          </Carousel>
          <div className="recommand_title">
            <div></div>
            <h1>美食推荐</h1>
          </div>
          <div className="foodlist">
            {!this.foods.length ? (
              <Result
                img={<img src={this.src} className="spe am-icon am-icon-lg" />}
                message="该地区暂无任何数据"
              />
            ) : (
              <Grid
                data={this.foods}
                carouselMaxRow={1}
                activeStyle={true}
                hasLine={false}
                onClick={el => this.tofoodDetail(el)}
              />
            )}
          </div>
          <div className="hot_title">
            <div></div>
            <h1>热门景点</h1>
          </div>

          {!this.hotSpots.length ? (
            <Result
              img={<img src={this.src} className="spe am-icon am-icon-lg" />}
              message="该地区暂无任何数据"
            />
          ) : (
            <WingBlank>
              {this.hotSpots.map((hotspot, index) => (
                <div
                  className="tour_list"
                  key={index}
                  onClick={() => this.todetail(hotspot)}
                >
                  <div className="tour_img">
                    <img src={this.proxyUrl + hotspot.image_url} alt="" />
                  </div>
                  <div className="tour_item">
                    <ul>
                      <li>
                        <h1>{hotspot.spots}</h1>
                      </li>
                      <li>
                        {this.groupArr(hotspot.stars).map((item, ind) => (
                          <i
                            className="iconfont icon-pingfenxingxing"
                            key={ind}
                          />
                        ))}
                        <span>
                          {hotspot.stars}
                          <span>.0分</span>
                        </span>
                      </li>
                      <li>
                        <span>{hotspot.description}</span>
                      </li>
                      <li>
                        <span>{hotspot.level || '未测评'}</span>
                      </li>
                    </ul>
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

export default HomePage
