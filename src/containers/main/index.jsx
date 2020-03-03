import React, { Component } from 'react'
import { Switch, Route, Redirect, NavLink } from 'react-router-dom'
import HomePage from './homePage'
import Community from './community'
import Order from './order'
import My from './my'
class Main extends Component {
    render() {

        return (
            <div>
                <div className="footer">
                    <NavLink to="/main/homepage" className="footer-icon">
                        <i className="iconfont icon-shouye"></i>
                        <p>首页</p>
                    </NavLink>
                    <NavLink to="/main/community" className="footer-icon">
                        <i className="iconfont icon-jiaoliuweixuanzhong"></i>
                        <p>交流</p>
                    </NavLink>
                    <NavLink to="/main/order" className="footer-icon">
                        <i className="iconfont icon-dingdan1"></i>
                        <p>订单</p>
                    </NavLink>
                    <NavLink to="/main/my" className="footer-icon">
                        <i className="iconfont icon-wode1"></i>
                        <p>我的</p>
                    </NavLink>
                </div>
                <Switch>
                    <Route path="/main/homepage" component={HomePage}></Route>
                    <Route path="/main/community" component={Community}></Route>
                    <Route path="/main/order" component={Order}></Route>
                    <Route path="/main/my" component={My}></Route>
                    <Redirect exact from="/main" to="/main/homepage" />
                </Switch>
            </div>
        );
    }
}
export default Main