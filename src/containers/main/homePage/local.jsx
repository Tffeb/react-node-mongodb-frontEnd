import React, { Component } from 'react';
import { observable } from 'mobx'
import { observer, inject } from 'mobx-react'
import { NavBar, Icon, Grid, Toast } from 'antd-mobile';
import { Redirect } from 'react-router-dom';
import { reqCity } from '../../../api';
import '../../../assets/js/scrollToAnchor';
@inject('store')
@observer
class Local extends Component {
    @observable citydata = {};
    @observable hotcityarr = [];
    @observable cityarr = [];
    @observable cities = [];
    @observable cityIdArr = [];
    @observable path = '';
    constructor(props) {
        super(props)
        this.reqCity()
    }
    componentDidUpdate() {
        for (const hotcity of this.hotcityarr && this.hotcityarr) {
            this.cityIdArr.push(hotcity.id)
        }
    }
    // 瞄点滚动
    scrollToAnchor = (index) => {
        let anchorElement = document.querySelector(`#${index.text}`);
        if (index.text === anchorElement.innerText) {
            anchorElement.scrollIntoView({ behavior: 'smooth' });
        }
    }
    handleChange = () => {
        this.path = '/main'
    }
    reqCity = async () => {
        const res = await reqCity()
        if (res.data.code === 0) {
            this.citydata = res.data.data.data
        }
    }
    changeAddress = (index) => {
        if (this.cityIdArr.indexOf(index.id) === -1) {
            Toast.info('很抱歉，该城市还未开放!!!', 1);
            return;
        }
        this.props.store.changeAddress(index)
        this.path = this.props.store.path
    }
    render() {
        // 重定向
        if (this.path) {
            return <Redirect to={this.path} />
        }
        //hotcities
        this.citydata.hotCities && this.citydata.hotCities.map(item => this.hotcityarr.push({ text: item.text, id: item.id }))
        //cities
        this.citydata.cities && Object.keys(this.citydata.cities).forEach(element => this.cityarr.push({ text: element }))

        return (
            <div ref="container" className="container">
                <NavBar
                    mode="dark"
                    leftContent={(<Icon key="1" type="left" onClick={this.handleChange} />)}
                >城市选择</NavBar>
                <div className="sub-title">湖北城市</div>
                <Grid data={this.hotcityarr} itemStyle={{ height: '50px' }} onClick={(index) => this.changeAddress(index)} />
                <div className="sub-title">字母排序(点击字母查找城市)</div>
                <Grid data={this.cityarr} hasLine={false} itemStyle={{ height: '50px' }} onClick={(index) => this.scrollToAnchor(index)} />
                {
                    this.citydata.cities && Object.keys(this.citydata.cities).map((item, index) => (
                        <div key={index}>
                            <div className="sub-title" id={item}>{item}</div>
                            < Grid data={this.citydata.cities[item].map(list => ({ text: list.text, id: list.id }))} itemStyle={{ height: '50px' }} onClick={(index) => this.changeAddress(index)} />
                        </div>
                    ))
                }
            </div>
        );
    }
}

export default Local;