import react, {Component} from "react";
import {BrowserRouter as Router, Redirect, Route, Switch} from 'react-router-dom';
import '../styles/bootstrap.min.css';
import '../styles/app.css';

import Header from './Header/Header';
import Footer from './Footer/Footer';

import HomePage from "../Pages/HomePage/HomePage";
import Login from "../Pages/Login/Login";
import Register from "../Pages/Register/Register";
import ProjectViewer from "../Pages/Projects/ProjectViewer"

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLogged: false,
            userData: {},
            projectsData: []
        }

        this.updateAfterLogin = this.updateAfterLogin.bind(this);
    }

    updateAfterLogin(userData, projectsData, isLogged) {

        this.setState({
            userData: userData,
            projectsData: projectsData,
            isLogged: isLogged
        })

    }

    render() {

        let mainContainerCss = ""

        let appContent =
            <Router>
                <Switch>
                    <Route path="/login">
                        <Redirect to="/" />;
                    </Route>
                    <Route exact path="/">
                        <ProjectViewer
                            cssClass=""
                            isLogged={this.state.isLogged}
                            userData={this.state.userData}
                            projectsData={this.state.projectsData}
                        />;
                    </Route>
                </Switch>
            </Router>

        if (!this.state.isLogged) {

            mainContainerCss = "container"
            appContent =
                <Router>
                    <Switch>
                        <Route exact path="/">
                            <HomePage
                                cssClass="mt-4"
                            />
                        </Route>
                        <Route path="/login">
                            <Login
                                cssClass="mt-4"
                                updateAfterLogin={this.updateAfterLogin}
                            />
                        </Route>
                        <Route path="/register">
                            <Register
                                cssClass="mt-4"
                            />
                        </Route>
                    </Switch>
                </Router>

        }

        return (
            <div className="App">
                <Header
                    isLogged={this.state.isLogged}
                    username={this.state.userData.username}
                />
                <div className={mainContainerCss}>
                    {appContent}
                </div>
                <Footer/>
            </div>
        );
    }

}

export default App;
