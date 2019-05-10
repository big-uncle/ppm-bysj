import React from 'react';
import { Router, Route, Switch  } from 'dva/router';
import Tabledata from './components/table';
import PPMmenu from './components/menu';
import Home from './components/home';
import  Chart from './components/chart'
import  Adduser from './components/adduser'
import  Additem from './components/additem'
import  UserList from './components/userList'
import  ItemList from './components/itemList'


function RouterConfig({ history }) {
  return (
    <div> 
      <PPMmenu
      history={history}
      >
      </PPMmenu>   
    <Router history={history}>
    <div style={{
        // marginLeft: '13%',
        marginLeft: '8%',
        // paddingTop: '4%',
        top: '7%',
        }}>
      <Switch>
      <Route path="/home" exact component={Home} />
        <Route path="/chart" component={Chart} />
        <Route path='/table'  component={Tabledata} />
        <Route path="/adduser" component={Adduser} />
        <Route path="/userlist" component={UserList} />
        <Route path="/addinfo" component={Additem}/>
        <Route path="/itemlist" component={ItemList}/>
        
      </Switch>
      </div>
    </Router>
    </div>
  );
}
export default RouterConfig;

