import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import {
  NavBar,
  Icon,
  Stepper,
  List,
  Radio,
  Button,
  Modal,
  Toast
} from 'antd-mobile'
import { reqHotSpotsDetail, reqIsLogin, reqOrder } from '../../../api'
import { observer } from 'mobx-react'
import store from '../../../store'
const { RadioItem } = Radio
const { alert } = Modal
function BuyPage() {
  const proxyUrl = store.proxy
  let history = useHistory()
  const [ticket, setTicket] = useState('全票')
  const [price, setPrice] = useState()
  const [val, setVal] = useState(1)
  const [detailData, setDetailData] = useState({})
  const [totalPrice, setTotalPrice] = useState(0)
  const [loginInfo, setLoginInfo] = useState({})
  const detailContent = {
    name: window.decodeURI(window.location.search.split('=')[1].split('&')[0]),
    id: window.location.search.split('=')[2]
  }
  let orderObj = {}
  //是否登录
  const isLogin = async () => {
    const res = await reqIsLogin()
    setLoginInfo(res.data)
  }
  //景点相关信息
  const reqHotSpots = async content => {
    const res = await reqHotSpotsDetail(content)
    if (res.data.code === 0) {
      setDetailData(res.data.data)
    }
  }
  //生成订单
  const reqAddOrder = async order => {
    const res = await reqOrder(order)
    if (orderObj.state === 0) {
      if (res.data.code === 0) {
        Toast.success('购买成功!', 1, () => {
          history.push('/main/homepage')
        })
      } else {
        Toast.error('购买失败')
      }
    }
  }
  //页面渲染执行且一次
  useEffect(() => {
    reqHotSpots(detailContent)
    isLogin()
  }, [])
  const category = [
    { id: 1, value: '全票', price: detailData.all_price },
    { id: 2, value: '半票', price: detailData.middle_price },
    { id: 3, value: '年票', price: detailData.year_price }
  ]
  function toHomePage() {
    orderObj = {
      ordername: detailData.spots,
      price: totalPrice || category[0].price,
      num: val,
      orderimg: detailData.image_url,
      state: 1
    }
    alert('待支付', `你还未支付,确定要退出吗?`, [
      { text: 'Cancel', onPress: () => console.log('cancel') },
      {
        text: 'Ok',
        onPress: () => {
          reqAddOrder(orderObj)
          history.push(`/detailpage${window.location.search}`)
        }
      }
    ])
  }
  function changePrice(ticketName) {
    setTicket(ticketName.value)
    setPrice(ticketName.price)
    setTotalPrice(ticketName.price * val)
  }
  function onChange(val) {
    setVal(val)
    setTotalPrice((price || category[0].price) * val)
  }
  function toBuy() {
    if (loginInfo.code === 1) {
      alert('未登录', '请您先登录!', [
        { text: 'Cancel', onPress: () => console.log('cancel') },
        { text: 'Ok', onPress: () => history.push('/login') }
      ])
    } else {
      orderObj = {
        ordername: detailData.spots,
        price: totalPrice || category[0].price,
        num: val,
        orderimg: detailData.image_url,
        state: 0
      }
      alert('订单', `你确定要支付${totalPrice || category[0].price}元购买吗?`, [
        { text: 'Cancel', onPress: () => console.log('cancel') },
        { text: 'Ok', onPress: () => reqAddOrder(orderObj) }
      ])
    }
  }
  return (
    <div>
      <NavBar
        mode="dark"
        leftContent={<Icon type="left" onClick={toHomePage} />}
      >
        购票
      </NavBar>
      <List>
        <List.Item>
          <div className="order_img">
            <img src={proxyUrl + detailData.image_url} alt="景点" />
          </div>
          <div className="pricename">票名:{detailData.spots}门票</div>
          <div className="price">单价:{price || category[0].price}元/人</div>
          {category.map(item => (
            <RadioItem
              key={item.value}
              checked={item.value === ticket}
              onChange={() => changePrice(item)}
            >
              {item.value}
            </RadioItem>
          ))}
        </List.Item>
        <List.Item
          wrap
          extra={
            <Stepper
              style={{ width: '100%', minWidth: '100px' }}
              showNumber
              max={10}
              min={1}
              value={val}
              onChange={onChange}
            />
          }
        >
          购买数量
        </List.Item>
        <div className="total_price">
          总共:
          <span style={{ color: 'orange', fontSize: '24px', margin: '0 10px' }}>
            {totalPrice || category[0].price}
          </span>
          元
        </div>
      </List>
      <Button type="primary" onClick={toBuy}>
        确定
      </Button>
    </div>
  )
}
export default observer(BuyPage)
