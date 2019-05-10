import { message } from 'antd';
import  * as conf from "./conf";
function getRFID(){
    var userId= localStorage.getItem('userId')
    var userName= localStorage.getItem('userName')
    var str = ""
    var id = ""
    window.onkeypress = function (e) {
        // console.log(e.key)
        if (e.key >= 0 && e.key <= 9) {
            str += e.key
            if (str.length == 10) {
        var url = conf.apiurl()+'/api/data/addRecords?userId='+userId+'&itemsId='+str+'&userName='+userName
        fetch(url).then(res => {
            res.json().then( obj=>{
                if (obj.code==='400'){
                message.error(obj.msg)
                }else if (obj.code==='200'){
                    message.success(obj.msg)
                    setTimeout(function () {
                        window.location.reload()//刷新地址栏
                    }, 888);
                }
               
            })
    })
                str = ""
                clearTimeout(id)
            }
            if (str.length == 1) {
                id = setTimeout(function () {
                    if (str.length < 10) {
                        str = ""
                    }
                }, 300);//300毫秒
            }
        }
    }
}

export default getRFID;






// class GetRFID extends Component{
//     constructor(props){
//         //当父组件向子组件传递数据时，需要在这里传入props。
//         super(props);

//         //由于事件函数onClickButton不是在render函数中定义的，所以需要通过bind绑定this指向。
//         this.onClickButton=this.onClickButton.bind(this);

//         //通过state来定义当前组件内部自己的数据
//         this.state={count:0};
//     }
//     onClickButton(){
//         //通过setState方法 来改变state对象中的值。
//         this.setState(
//             {
//             count:this.state.count+1
//             }
//         );
//     }
//     render(){
//         //在render中定义样式，必须使用对象的方式。
//         const counterStyle={
//             margin:'16px',
//             fontSize:'24px'
//         };
//         return (
//             {/*在jsx中，使用这个方式进行注释 */}
//             {/*在jsx中，使用在render函数中，定义的样式*/}
//             <div style={counterStyle}>
//                 {/*在jsx中，使用onClick方式进行事件绑定，不同于html行内事件绑定，原理参考jsx文章*/}
//                 <button onClick={this.onClickButton}>Click me</button>
//                 <div>
//                     Click Count:<span id="clickCount">{this.state.count}</span>
//                 </div>
//             </div>
//         );
//     }
// }

// //导出当前定义的组件
// export default GetRFID;