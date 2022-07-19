import React from 'react';
import {Route, Switch, NavLink} from "react-router-dom";
import styled from "styled-components";
import Logo from './../public/static/images/webpack.png';

const Link = styled(NavLink)`
    height: 100px;
    width: 100px;
    display: block;
    background-color: #000;
`;

const Count = () => {
    return (
        <div>
           123
        </div>
    );
};

const Welcome = () => {
    return (
        <div>
            welcome
        </div>
    );
};

const Main = () => {
    return (
        <div>
            <img src={Logo} alt=""/>
            <Link to="/count">Count</Link>
            <Link to="/welcome" >Welcome</Link>
        </div>
    )
}

function App() {
    return (
        <Switch>
            <Route path="/" exact component={Main} />
            <Route path="/count" component={Count} />
            <Route path="/welcome" component={Welcome} />
        </Switch>
    );
}
export default App;