import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { LocaleProvider } from 'antd-mobile'
import Loading from './main/loading'
@inject('store')
@observer
class App extends React.Component {
    constructor(props) {
        super(props)
        console.log(this.props)
    }
    render() {
        return (
            <LocaleProvider>
                <div>
                    {this.props.children}
                    {
                        this.props.store.loading && <Loading />
                    }
                </div>
            </LocaleProvider>
        )
    }
}

export default App
