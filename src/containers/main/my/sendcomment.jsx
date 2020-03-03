import React, { useState, useEffect } from 'react'
import { NavBar, Icon, Result, Checkbox, Button, Toast } from 'antd-mobile'
import { useHistory } from 'react-router-dom'
import { reqSendComment, reqDeletmyComment } from '../../../api'
import { observer } from 'mobx-react'
import store from '../../../store'
function SendComment() {
  const CheckboxItem = Checkbox.CheckboxItem
  const proxyUrl = store.proxy
  const src =
    'https://gw.alipayobjects.com/mdn/miniapp_social/afts/img/A*pevERLJC9v0AAAAAAAAAAABjAQAAAQ/original'
  const [sendcomment, setSendcomment] = useState([])
  const [commentArr, setCommentArr] = useState([])
  const [checkIndex, setCheckIndex] = useState([])
  const [typeValue, setTypeValue] = useState('edit')
  const [isShow, setIsShow] = useState(false)
  let history = useHistory()
  const sendComment = async () => {
    const res = await reqSendComment()
    if (res.data.code === 0) {
      setSendcomment(res.data.data)
      if (!res.data.data.length) {
        setTypeValue('none')
        setIsShow(false)
      }
      const checkarr = []
      for (var i = 0; i < res.data.data.length; i++) {
        checkarr.push(false)
      }
      setCheckIndex(checkarr)
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
  function edit() {
    setTypeValue('allChose')
    setIsShow(true)
  }

  function allChose() {
    const check = []
    for (var i = 0; i < sendcomment.length; i++) {
      check.push(true)
    }
    setCheckIndex(check)
    setCommentArr(() => {
      sendcomment.map((item, index) => {
        if (!commentArr.includes(item._id)) {
          commentArr.push(item._id)
        }
      })
      return commentArr
    })
    setTypeValue('allChose')
  }
  function Cancel() {
    setTypeValue('edit')
    setIsShow(false)
    const checkarr = []
    for (var i = 0; i < sendcomment.length; i++) {
      checkarr.push(false)
    }
    setCheckIndex(checkarr)
    setCommentArr([])
  }
  function checkChange(id, index) {
    if (checkIndex[index]) {
      var check = checkIndex
      check[index] = false
      setCheckIndex(check)
      setCommentArr(commentArr.filter(item => item !== id))
    } else if (!checkIndex[index]) {
      var isCheck = checkIndex
      isCheck[index] = true
      setCheckIndex(isCheck)
      setCommentArr([...commentArr, id])
    }
  }
  function delComment() {
    if (commentArr.length) {
      reqDeletmy(commentArr)
    } else {
      Toast.info('删除项不能为空!')
      return
    }
  }
  const reqDeletmy = async IdArr => {
    const res = await reqDeletmyComment(IdArr)
    if (res.data.code === 0) {
      Toast.info(res.data.msg, 1, () => {
        sendComment()
      })
    }
  }
  useEffect(() => {
    sendComment()
  }, [])
  return (
    <div className="sendcomment">
      {typeValue === 'edit' ? (
        <NavBar
          mode="dark"
          leftContent={<Icon type="left" onClick={toMy} />}
          rightContent={<span onClick={edit}>编辑</span>}
        >
          我的帖子
        </NavBar>
      ) : typeValue === 'allChose' ? (
        <NavBar
          mode="dark"
          leftContent={<span onClick={Cancel}>取消</span>}
          rightContent={<span onClick={allChose}>全选</span>}
        />
      ) : (
        <NavBar mode="dark" leftContent={<Icon type="left" onClick={toMy} />}>
          我的帖子
        </NavBar>
      )}
      {!sendcomment.length ? (
        <Result
          img={<img src={src} className="spe am-icon am-icon-lg" />}
          message="暂无相关帖子"
        />
      ) : typeValue === 'allChose' ? (
        <div style={{ height: '547px', overflow: 'auto' }}>
          {sendcomment.map((item, index) => (
            <CheckboxItem
              key={index}
              checked={checkIndex[index] ? true : false}
              onChange={() => checkChange(item._id, index)}
            >
              <div className="praise" onClick={() => toComment(item)}>
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
            </CheckboxItem>
          ))}
        </div>
      ) : (
        sendcomment.map((item, index) => (
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
      <Button
        type="warning"
        className={isShow ? 'showdel' : 'hiddendel'}
        onClick={delComment}
      >
        删除
      </Button>
    </div>
  )
}
export default observer(SendComment)
