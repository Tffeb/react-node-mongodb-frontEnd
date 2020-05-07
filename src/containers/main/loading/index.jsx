import React, { Component } from "react";
import { Icon } from "antd-mobile";
class Loading extends Component {
  render() {
    return (
      <div style={{
        width: "100%",
        height: "100%",
        background: "rgba(255, 255, 255, 0.84)",
        position: "absolute",
        left: 0,
        top: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 100,
      }}>
        <Icon type="loading" size="md" />
        <span style={{ color: "skyblue" }}>正在努力加载中....</span>
      </div>
    );
  }
}

export default Loading
