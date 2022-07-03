import React from 'react';
import {Route, Switch, NavLink} from "react-router-dom";

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
            <NavLink to="/count">Count</NavLink>
            <NavLink to="/welcome" >Welcome</NavLink>
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