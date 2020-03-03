import React, { useState, useEffect } from 'react'
import { NavBar, Icon, Result } from 'antd-mobile'
import { useHistory } from 'react-router-dom'
import { reqHaveComment } from '../../../api'
import { observer } from 'mobx-react'
import store from '../../../store'
function HaveComment() {
  const proxyUrl = store.proxy
  const src =
    'https://gw.alipayobjects.com/mdn/miniapp_social/afts/img/A*pevERLJC9v0AAAAAAAAAAABjAQAAAQ/original'
  const [havecomment, setHavecomment] = useState([])
  let history = useHistory()
  const haveComment = async () => {
    const res = await reqHaveComment()
    if (res.data.code === 0) {
      setHavecomment(res.data.data)
    }
  }
  function toMy() {
    history.push('/main/my')
  }
  function toComment(item) {
    history.push(`/main/community/${item._id}`)
  }
  function timestampToTime(timestamp) {
    return new Date(parseFloat(timestamp)).toLocaleString()
  }
  useEffect(() => {
    haveComment()
  }, [])
  return (
    <div>
      <NavBar mode="dark" leftContent={<Icon type="left" onClick={toMy} />}>
        我评论过的
      </NavBar>
      {!havecomment.length ? (
        <Result
          img={<img src={src} className="spe am-icon am-icon-lg" />}
          message="暂无相关帖子"
        />
      ) : (
        havecomment.map((item, index) => (
          <div className="praise" key={index} onClick={() => toComment(item)}>
            <div className="content_top">
              <div className="head_img">
                <img src={proxyUrl + item.avatar} alt="头像" />
              </div>
              <div>{item.author}</div>
            </div>
            <div style={{ marginBottom: '10px' }}>{item.content}</div>
            <div className="list_img">
              {item.imagefile && item.imagefile.length === 1 ? (
                <img
                  src={proxyUrl + item.imagefile[0]}
                  alt="帖子图片"
                  style={{ maxHeight: '140px', maxWidth: '100px' }}
                />
              ) : (
                item.imagefile.map((file, dex) => (
                  <img
                    src={proxyUrl + file}
                    alt="帖子图片"
                    key={dex}
                    style={{ height: '80px', width: '80px' }}
                  />
                ))
              )}
            </div>
            <div className="content_bottom">
              <span>{timestampToTime(item.date)}</span>
              <span>赞{item.praise.length}</span>
              <span>评论{item.commentNumber}</span>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
export default observer(HaveComment)
