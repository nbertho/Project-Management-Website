import react, {Component} from "react";
import Cookies from 'js-cookie';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSignOutAlt} from "@fortawesome/free-solid-svg-icons";

import Title from './Title/Title'

class Header extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loggedInCookie: false
        }

        this.logOut = this.logOut.bind(this);
    }

    logOut() {
        let confirmLogout = window.confirm("Are you sure you want to log-out?");
        if (confirmLogout) {
            Cookies.remove('application_user_data');
            this.setState({loggedInCookie: false})
            this.props.resetState();
        }
    }

    componentDidMount() {
        let userCookieData = Cookies.get("application_user_data");
        if (userCookieData !== undefined) {
            this.setState({loggedInCookie: true})
        }
    }

    render() {

        let logOutContent = "";

        if (this.state.loggedInCookie || this.props.isLogged) {
            logOutContent = <p className="cursor-hover" onClick={this.logOut}><FontAwesomeIcon icon={faSignOutAlt} /> Log out</p>
        }

        return (
            <header className="Header bg-secondary">
                <div className="mt-0 container text-left p-4 mt-0">
                    <div className="row">
                        <Title
                            cssClass="col-6"
                            isLoggedIn={this.props.isLogged}
                            username={this.props.username}
                        />
                        <div className="col-5 text-right">
                            {logOutContent}
                        </div>
                    </div>
                </div>
            </header>
        );
    }

}

export default Header;
