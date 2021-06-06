import react, {Component} from "react";
import {BrowserRouter as Router, Redirect, Route, Switch} from 'react-router-dom';
import Cookies from 'js-cookie';
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
            displayMessage: {
                empty: true,
                error: false,
                content: ""
            },
            isLogged: false,
            projectsDataHasBennFetch: false,
            userData: {},
            projectsData: []
        }

        this.updateAfterLogin = this.updateAfterLogin.bind(this);
        this.updateDisplayMessage = this.updateDisplayMessage.bind(this);
        this.resetState = this.resetState.bind(this);
    }

    updateDisplayMessage(newMessage) {
        if (newMessage === null) {
            this.setState({
                displayMessage: {
                    empty: true,
                    error: false,
                    content: ""
                }
            })
        }
        else {
            this.setState({displayMessage: newMessage })
        }
    }

    updateAfterLogin(userData, projectsData, isLogged) {

        if (projectsData === 0) {
            this.setState({
                userData: userData,
                projectsData: projectsData,
                isLogged: isLogged
            });
        }
        else {
            this.setState({
                userData: userData,
                projectsData: projectsData,
                isLogged: isLogged
            })
        }
        Cookies.set("application_user_data", userData);
    }

    resetState() {
        this.setState({
            displayMessage: {
                empty: true,
                error: false,
                content: ""
            },
            isLogged: false,
            projectsDataHasBennFetch: false,
            userData: {},
            projectsData: []
        });
    }

    fetchProjectList() {
        const helperRequestBody = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                user_id: this.state.userData.id,
                user_mail: this.state.userData.mail,
                user_token: this.state.userData.token
            })
        };

        fetch(process.env.REACT_APP_API_URL + "project/list", helperRequestBody)
            .then(response => response.json())
            .then(
                (data) => {
                    this.setState({projectsData: data.content.result, projectsDataHasBennFetch: true});
                },
                (error) => {
                    console.log(error)
                    this.setState({error: true})
                }
            )
    }

    componentDidMount() {

        if (this.state.isLogged === false) {
            let userCookieData = Cookies.get("application_user_data");
            if (userCookieData !== undefined) {

                this.setState(
                    {userData: JSON.parse(userCookieData), isLogged: true},
                    () => {
                        this.fetchProjectList();
                    }
                );
            }
        }
        else {
            this.fetchProjectList();
        }

    }

    render() {

        let mainContainerCss = ""

        let appContent =
            <Router>
                <Switch>
                    <Route path="/login">
                        <Redirect to="/"/>;
                    </Route>
                    <Route exact path="/">
                        <ProjectViewer
                            cssClass=""
                            isLogged={this.state.isLogged}
                            userData={this.state.userData}
                            projectsData={this.state.projectsData}
                            reRenderAppComponent={this.reRenderAppComponent}
                            userDataFromCookies={this.state.userDataFromCookies}
                            resetUserDataFromCookies={this.resetUserDataFromCookies}
                            updateDisplayMessage={this.updateDisplayMessage}
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
                                updateDisplayMessage={this.updateDisplayMessage}
                                updateAfterLogin={this.updateAfterLogin}
                            />
                        </Route>
                        <Route path="/register">
                            <Register
                                updateDisplayMessage={this.updateDisplayMessage}
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
                    resetState={this.resetState}
                    message={this.state.displayMessage}
                    updateDisplayMessage={this.updateDisplayMessage}
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
