/**
 * 接口请求模块
 */
import ajax from './ajax'
const BASE_URL = '/api'
// import { reqUpdateUser } from './index';
//注册接口
export const reqRegister = (user) => ajax(BASE_URL + '/register', user, 'POST')
//登录接口
export const reqLogin = ({ username, password }) => ajax(BASE_URL + '/login', { username, password }, 'POST')
//验证是否登录
export const reqIsLogin = () => ajax(BASE_URL + '/isLogin')
//退出登录
export const reqLoginOut = () => ajax(BASE_URL + '/loginout')
//发帖
export const reqArtical = (content) => ajax(BASE_URL + '/artical', content, 'POST')
//帖子信息数据
export const reqArticalInfo = () => ajax(BASE_URL + '/articalinfo')

//上传头像
export const reqAvatar = (avatarUrl) => ajax(BASE_URL + '/avatar', avatarUrl, 'POST')
//保存个人资料信息
export const reqSaveInfo = (user) => ajax(BASE_URL + '/saveinfo', user, 'POST')
//获取个人资料信息
export const reqUserInfo = () => ajax(BASE_URL + '/userinfo')
//获取评论区信息
export const reqCommentPage = (id) => ajax(BASE_URL + '/comment_page', id, 'GET')
//评论
export const reqComment = (comment) => ajax(BASE_URL + '/comment', comment, 'POST')

//回复
export const reqReplay = (replay) => ajax(BASE_URL + '/replay', replay, 'POST')

//回显评论
export const reqCommentInfo = (commentid) => ajax(BASE_URL + '/comment_info', commentid, 'GET')

//搜索帖子
export const reqSearchInfo = (searchContent) => ajax(BASE_URL + '/search/articalinfo', searchContent, 'GET')
//回显回复
export const reqReplayInfo = (commentid) => ajax(BASE_URL + '/replay_info', commentid, 'GET')
//我赞过的
export const reqPraising = () => ajax(BASE_URL + '/praising')
//我评论过的
export const reqHaveComment = () => ajax(BASE_URL + '/havecomment')
//我的帖子
export const reqSendComment = () => ajax(BASE_URL + '/sendcomment')
//删除我的帖子
export const reqDeletmyComment = (IdArr) => ajax(BASE_URL + '/deletmycomment', IdArr, 'POST')
//点赞
export const reqPraise = (praise) => ajax(BASE_URL + '/praise', praise, 'POST')
//取消点赞
export const reqNoPraise = (nopraise) => ajax(BASE_URL + '/nopraise', nopraise, 'POST')
//评论点赞
export const reqCommentPraise = (praise) => ajax(BASE_URL + '/commentPraise', praise, 'POST')
//取消评论点赞
export const reqNoCommentPraise = (nopraise) => ajax(BASE_URL + '/noCommentPraise', nopraise, 'POST')

//随机获取casoursel
export const reqCasoursel = () => ajax(BASE_URL + '/carousel/img', 'GET')
//hot_spots接口
export const reqHotSpots = () => ajax(BASE_URL + '/hotspots')
//hot_spots详情接口
export const reqHotSpotsDetail = ({ name, id }) => ajax(BASE_URL + '/hotspots/detail', { name, id }, 'GET')
//hot_food接口
export const reqHotFood = () => ajax(BASE_URL + '/hotfood')
//hot_spots详情接口
export const reqFoodDetail = ({ name, id }) => ajax(BASE_URL + '/food/detail', { name, id }, 'GET')
//city接口
export const reqCity = () => ajax(BASE_URL + '/city')
//生成订单
export const reqOrder = (order) => ajax(BASE_URL + '/order', order, 'POST')
//查看所有订单
export const reqOrderInfo = () => ajax(BASE_URL + '/orderinfo')
//删除订单
export const reqDeleteOrder = (orderIdObj) => ajax(BASE_URL + '/deleteorder', orderIdObj, 'POST')
