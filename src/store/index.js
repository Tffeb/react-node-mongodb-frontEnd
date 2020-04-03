import { observable, action } from 'mobx'
class Store {
  @observable address = '';
  @observable path = '';
  @observable proxy = 'http://47.96.150.58:8080'
  @observable userInfo = {}
  @action
  changeAddress = (index) => {
    this.addressInfo = index
    this.path = '/main'
  }
}
const store = new Store()
export default store