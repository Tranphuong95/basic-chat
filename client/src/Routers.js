import React from 'react';
import {Switch, Route } from 'react-router-dom';
import Chat from './component/Chat/Chat';
import Join from './component/Join/Join';

export default function Routers() {
    return (
        <Switch>
            <Route exact path="/chat" component={Chat}/>
            <Route exact path="/" component={Join}/>
        </Switch>
    )
}
