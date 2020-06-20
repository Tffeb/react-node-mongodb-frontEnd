import { observable, action } from "mobx";
class Store {
  @observable address = "";
  @observable path = "";
  @observable proxy = "http://47.96.150.58:8080";
  @observable userInfo = {};
  @observable loading = false;
  @action
  changeAddress = (index) => {
    this.addressInfo = index;
    this.path = "/main";
  };
  @action
  loadingStart = () => {
    this.loading = true;
  };
  @action
  loadingEnd = () => {
    this.loading = false;
  };
}
const store = new Store();
// 我今天使用git参与了开发
export default store;

