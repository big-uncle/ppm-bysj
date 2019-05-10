import React from 'react';
import { Card } from 'antd';
import * as conf from "../utils/conf";
import Detailschart  from "./detailschart";
import styles from "./index.css";
var userId = localStorage.getItem('userId')
class Chart extends React.Component {
    state = { mytoday: '', mycount: '', alltoday: '', allcount: '', selfsort: '', permnum: '' };
  
    componentWillMount() {
        //         //必须在这里声明，所以 ref 回调可以引用它
    }
    render() {
        return (
            <div>
            <div className={styles.card3}>
             <Card title="上周整体员工完成情况" bordered={true}> 
            <Detailschart></Detailschart>
        </Card>
        </div>
        </div>
        );
    }
}

export default Chart