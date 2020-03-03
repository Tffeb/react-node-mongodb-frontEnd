import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import Main from './containers/main'
import Login from './containers/login'
import Register from './containers/register'
import Local from './containers/main/homePage/local'
import PersonalData from './containers/main/my/personaldata'
import Prasing from './containers/main/my/praising'
import SendComment from './containers/main/my/sendcomment'
import HaveComment from './containers/main/my/havecomment'
import sendPage from './containers/main/community/sendpage'
import CommentPage from './containers/main/community/comment_page'
import Search from './containers/main/community/search'
import { Provider } from 'mobx-react'
import './assets/less/index.less'
import store from './store'
import DetailPage from './containers/main/homePage/detailPage'
import FoodDetail from './containers/main/homePage/foodDetail'
import BuyPage from './containers/main/order/buypage'
ReactDOM.render((
  <Provider store={store}>
    <BrowserRouter>
      <Switch>
        <Route path="/login" component={Login}></Route>
        <Route path="/register" component={Register}></Route>
        <Route path="/local" component={Local}></Route>
        <Route path="/buypage" component={BuyPage}></Route>
        <Route path="/my/prasing" component={Prasing}></Route>
        <Route path="/my/sendcomment" component={SendComment}></Route>
        <Route path="/my/havecomment" component={HaveComment}></Route>
        <Route path="/community/search" component={Search}></Route>
        <Route path="/detailpage" component={DetailPage}></Route>
        <Route path="/fooddetail" component={FoodDetail}></Route>
        <Route path='/main/community/sendpage' component={sendPage} />
        <Route path='/main/community/:id' component={CommentPage} />
        <Route path='/main/my/personaldata' component={PersonalData} />
        <Route path="/main" component={Main}></Route>
        <Redirect to="/main" />
      </Switch>
    </BrowserRouter>
  </Provider>
), document.getElementById('root'))