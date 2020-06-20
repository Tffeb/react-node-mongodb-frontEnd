import React, { Component } from "react";
import {
  List,
  InputItem,
  Button,
  WhiteSpace,
  Toast,
  NavBar,
  Icon,
} from "antd-mobile";
import { observable } from "mobx";
import { observer, inject } from "mobx-react";
import { reqLogin } from "../../api";
import logo from "../../assets/images/logo.png";
@inject("store")
@observer
class Login extends Component {
  @observable userInfo = {};
  @observable usernameErrorMsg = "";
  @observable passwordErrorMsg = "";
  constructor(props) {
    super(props);
    this.initData();
    console.log("dd", this.props.location.search.split("=")[1]);
  }
  initData = () => {
    this.userInfo = {
      username: "", // 用户名
      password: "", // 密码
    };
  };
  handleChange = (name, val) => {
    // 更新状态
    this.usernameErrorMsg = "";
    this.passwordErrorMsg = "";
    this.userInfo[name] = val; // 属性名不是name, 而是name变量的值
  };
  successToast = () => {
    Toast.success("登录成功!!!", 1, () => {
      this.props.history.push(this.props.location.search.split("=")[1]); //返回之前页
    });
  };
  // 点击登录调用
  login = (userInfo) => {
    const { username, password } = userInfo;
    if (!username) {
      this.usernameErrorMsg = "用户名不存在！";
    }
    if (!password) {
      this.passwordErrorMsg = "密码不能为空！";
    } else {
      reqLogin({ username, password }).then((res) => {
        if (res.data.code === 0) {
          this.successToast();
        } else {
          this.passwordErrorMsg = res.data.msg;
        }
      });
    }
  };
  toRegister = () => {
    this.props.history.replace(
      `/register?url=${this.props.location.search.split("=")[1]}`
    );
  };
  toBack = () => {
    this.props.history.replace(this.props.location.search.split("=")[1]);
  };
  render() {
    const style = {
      marginTop: "10px",
      marginLeft: "105px",
      fontSize: "17px",
      color: "red",
    };
    return (
      <div>
        <div>sdad
          <div>sadaf
            <p>444</p>
          </div>
        </div>
        <NavBar
          mode="dark"
          leftContent={<Icon type="left" onClick={this.toBack} />}
        >
          登录
        </NavBar>
        <div style={{ width: "100%" }}>
          <img src={logo} alt="logo" style={{ width: "100%" }} />
        </div>
        <List>
          <InputItem
            placeholder="请输入用户名"
            onChange={(val) => {
              this.handleChange("username", val);
            }}
          >
            用户名:
          </InputItem>
          {this.usernameErrorMsg ? (
            <div style={style}>{this.usernameErrorMsg}</div>
          ) : (
              ""
            )}
          <InputItem
            type="password"
            placeholder="请输入密码"
            onChange={(val) => {
              this.handleChange("password", val);
            }}
          >
            密&nbsp;&nbsp;码:
          </InputItem>
          <div style={style}>{this.passwordErrorMsg}</div>
          <WhiteSpace />
          <Button type="primary" onClick={() => this.login(this.userInfo)}>
            登录
          </Button>
          <WhiteSpace />
          <Button onClick={this.toRegister}>没有账号，请先注册</Button>
        </List>
      </div>
    );
  }
}
export default Login;
