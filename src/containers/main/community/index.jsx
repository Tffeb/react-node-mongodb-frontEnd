import React, { Component } from "react";
import { NavBar, Icon, NoticeBar, WingBlank, Toast, Modal } from "antd-mobile";
import {
  reqIsLogin,
  reqArticalInfo,
  reqPraise,
  reqNoPraise,
} from "../../../api";
import { observable } from "mobx";
import { observer, inject } from "mobx-react";
import { PhotoSlider } from "react-photo-view";
import "react-photo-view/dist/index.css";
const alert = Modal.alert;
@inject("store")
@observer
class Community extends Component {
  @observable loginInfo = null;
  @observable articalInfo = [];
  @observable praiseArr = [];
  @observable proxyUrl = "";
  @observable paiseStyle = {};
  @observable contentValue = "";
  @observable isShow = false;
  @observable praiseClass = false;
  @observable hotInfo = undefined;
  @observable praiseIndex = [];
  @observable phptoIndex = -1;
  @observable imgIndex = 0;
  @observable visible = false;
  constructor(props) {
    super(props);
    this.reqArticalInfo();
    this.reqIsLogin();
    this.proxyUrl = props.store.proxy;
  }

  sendInfo = () => {
    if (this.loginInfo === null) {
      alert("未登录", "您还未登录,请您先登录！", [
        { text: "取消", onPress: () => console.log("cancel") },
        {
          text: "确定",
          onPress: () =>
            this.props.history.replace(`/login?url=${this.props.match.url}`),
        },
      ]);
    } else {
      this.props.history.replace("/main/community/sendpage");
    }
  };
  reqIsLogin = async () => {
    const res = await reqIsLogin();
    if (res.data.code === 0) {
      this.loginInfo = res.data.data;
      this.reqArticalInfo();
    }
  };
  reqArticalInfo = async () => {
    const res = await reqArticalInfo();
    if (res.data.code === 0) {
      this.articalInfo = res.data.data;
      this.articalInfo.map((item, index) => {
        item.praise.length &&
          item.praise.map((list) => {
            if (this.loginInfo && this.loginInfo._id === list) {
              this.praiseClass = true;
              this.praiseIndex.push(index);
            }
          });
      });
      this.praiseArr = this.articalInfo.map((artical) => artical.praise.length);
      this.articalInfo.length > 1 &&
        this.articalInfo.map((info) => {
          if (this.maxValue(this.praiseArr, info.praise.length)) {
            this.hotInfo = info.content;
          }
        });
    }
  };
  reqPraise = async (index) => {
    const res = await reqPraise({
      commentid: this.articalInfo[index]._id,
      userid: this.loginInfo._id,
    });
    if (res.data.code === 0) {
      Toast.info(res.data.msg, 1, () => this.reqArticalInfo());
    }
  };
  reqNoPraise = async (index) => {
    const res = await reqNoPraise({
      commentid: this.articalInfo[index]._id,
      userid: this.loginInfo._id,
    });
    if (res.data.code === 0) {
      Toast.info(res.data.msg, 1, () => this.reqArticalInfo());
    }
  };
  clickPraise = (e, index) => {
    if (this.loginInfo === null) {
      alert("未登录", "您还未登录,请您先登录！", [
        { text: "取消", onPress: () => console.log("cancel") },
        {
          text: "确定",
          onPress: () =>
            this.props.history.replace(`/login?url=${this.props.match.url}`),
        },
      ]);
    } else {
      this.isClick = !this.isClick;
      if (!e.target.parentNode.getAttribute("class")) {
        this.reqPraise(index);
        e.target.parentNode.setAttribute("class", "isPraise");
      } else {
        this.reqNoPraise(index);
        e.target.parentNode.removeAttribute("class", "isPraise");
      }
    }
  };
  contentChange = (value) => {
    this.contentValue = value;
  };
  comment = (index) => {
    this.props.history.replace(
      `/main/community/${this.articalInfo[index]._id}`
    );
  };
  timestampToTime = (timestamp) => {
    return new Date(parseFloat(timestamp)).toLocaleString();
  };
  maxValue(valueArr, len) {
    let value = -1;
    for (let i = 0; i < valueArr.length; i++) {
      if (value < valueArr[i]) {
        value = valueArr[i];
      }
    }
    return value === len;
  }
  search = () => {
    this.props.history.replace("/community/search");
  };
  showImg = (index, dex) => {
    this.phptoIndex = index;
    this.imgIndex = dex;
    this.visible = true;
  };
  showImgOne = (index) => {
    this.phptoIndex = index;
    this.imgIndex = 0;
    this.visible = true;
  };
  closeImg = () => {
    this.visible = false;
  };
  indexChange = (index) => {
    this.imgIndex = index;
  };
  render() {
    return (
      <div>
        <NavBar
          mode="dark"
          leftContent={
            <Icon
              key="0"
              type="search"
              style={{ marginRight: "16px" }}
              onClick={this.search}
            />
          }
          rightContent={<span onClick={this.sendInfo}>我要发帖</span>}
        >
          玩味社区
        </NavBar>
        <NoticeBar
          marqueeProps={{
            loop: true,
            trailing: 0,
            fps: 30,
            style: { padding: "0 20.5px" },
          }}
        >
          <div>最热帖子:{this.hotInfo || "暂无"}</div>
        </NoticeBar>
        <div
          style={{
            overflow: "auto",
            height: window.innerHeight - 132,
          }}
        >
          <WingBlank>
            {this.articalInfo &&
              this.articalInfo.map((info, index) => (
                <div className="community_list" key={index}>
                  <div className="list_content">
                    <div className="content">
                      <img src={this.proxyUrl + info.avatar} alt="" />
                      <h1>
                        <span style={{ marginRight: "20px", color: "#ccc" }}>
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
                          style={{ maxHeight: "140px", maxWidth: "100px" }}
                          onClick={() => this.showImgOne(index)}
                        />
                      ) : (
                        info.imagefile.map((file, dex) => (
                          <img
                            src={this.proxyUrl + file}
                            alt="帖子图片"
                            key={dex}
                            style={{ height: "80px", width: "80px" }}
                            onClick={() => this.showImg(index, dex)}
                          />
                        ))
                      )}
                    </div>
                    {/* 图片预览 */}
                    <PhotoSlider
                      images={info.imagefile.map((item) => ({
                        src: this.proxyUrl + item,
                      }))}
                      visible={this.phptoIndex === index && this.visible}
                      onClose={this.closeImg}
                      index={this.imgIndex}
                      onIndexChange={this.indexChange}
                    />
                    <div className="list_date">
                      <span>{this.timestampToTime(info.date)}</span>
                      <span
                        className={
                          this.praiseIndex.includes(index) && this.praiseClass
                            ? "isPraise"
                            : ""
                        }
                        style={{ margin: "0 20px" }}
                        onClick={(e) => this.clickPraise(e, index)}
                      >
                        <i className="iconfont icon-dianzan">
                          赞{info.praise.length ? info.praise.length : ""}
                        </i>
                      </span>
                      <span onClick={() => this.comment(index)}>
                        <i className="iconfont icon-006pinglunhuifu"></i>评论
                        {info.commentNumber ? info.commentNumber : ""}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </WingBlank>
        </div>
      </div>
    );
  }
}

export default Community;
