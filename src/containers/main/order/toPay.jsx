import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { withRouter } from 'react-router'
import { NavBar, Icon, List, Button, Modal, Toast } from 'antd-mobile'
import { reqPayInfo, reqToPay } from '../../../api'
import store from '../../../store'
const { alert } = Modal
function ToPay(props) {
  let history = useHistory()
  const proxyUrl = store.proxy
  const [orderId, setOrderId] = useState(props.location.search.split('=')[1])
  const [payInfoData, setPayInfoData] = useState({})
  const payInfo = async id => {
    const res = await reqPayInfo(id)
    if (res.data.code === 0) {
      setPayInfoData(res.data.data)
    }
  }
  //页面渲染执行且一次
  useEffect(() => {
    payInfo({ id: orderId })
  }, [])
  const toOrderPage = () => {
    alert('未支付', `你还未支付,确定要退出吗?`, [
      { text: 'Cancel', onPress: () => console.log('cancel') },
      {
        text: 'Ok',
        onPress: () => {
          history.push('/main/order')
        }
      }
    ])
  }
  const reqTopay = async () => {
    const res = await reqToPay({ id: orderId })
    if (res.data.code === 0) {
      Toast.success(res.data.msg, 1, () => {
        history.push('/main/order')
      })
    }
  }
  const toPayOrder = () => {
    alert('支付', `你确定要支付吗?`, [
      { text: 'Cancel', onPress: () => console.log('cancel') },
      {
        text: 'Ok',
        onPress: () => {
          reqTopay()
        }
      }
    ])
  }
  return (
    <div>
      <NavBar
        mode="dark"
        leftContent={<Icon type="left" onClick={toOrderPage} />}
      >
        订单支付
      </NavBar>
      <List>
        <div>订单编号:{orderId}</div>
        <div className="order_img">
          <img src={proxyUrl + payInfoData.orderimg} alt="景点" />
        </div>
        <div className="pricename">
          票名:&nbsp;&nbsp;{payInfoData.ordername}门票
        </div>
        <div className="price">
          单价:&nbsp;&nbsp;{payInfoData.price / payInfoData.number}
          &nbsp;元
        </div>
        <div className="price">
          票数:&nbsp;&nbsp;{payInfoData.number}&nbsp;张
        </div>
        <div className="total_price">
          总共:
          <span style={{ color: 'orange', fontSize: '24px', margin: '0 10px' }}>
            {payInfoData.price}
          </span>
          元
        </div>
      </List>
      <Button type="primary" onClick={toPayOrder}>
        付款
      </Button>
    </div>
  )
}
export default withRouter(ToPay)
