import react, {Component} from "react";
import Cookies from 'js-cookie';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSignOutAlt} from "@fortawesome/free-solid-svg-icons";

import Title from './Title/Title'

class Header extends Component {

    /**
     * @param props
     */
    constructor(props) {
        super(props);
        this.state = {
            loggedInCookie: false,
        }

        this.logOut = this.logOut.bind(this);
    }

    /**
     * Clear the cookies and reset the state
     */
    logOut() {
        let confirmLogout = window.confirm("Are you sure you want to log-out?");
        if (confirmLogout) {
            Cookies.remove('application_user_data');
            this.setState({loggedInCookie: false})
            this.props.resetState();
        }
        this.props.updateDisplayMessage(null);
    }

    /**
     * Update the state if cookies are present
     */
    componentDidMount() {
        let userCookieData = Cookies.get("application_user_data");
        if (userCookieData !== undefined) {
            this.setState({loggedInCookie: true})
        }
    }

    /**
     * Display fadeout message in header
     * @param prevProps
     * @param prevState
     * @param snapshot
     */
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.message.content !== "") {
            let messageBox = document.getElementById("message-box");
            messageBox.classList.add("fadeout-animation");
            setTimeout(() => {
                this.props.updateDisplayMessage(null);
                messageBox.classList.remove('fadeout-animation');
            }, 5000);
        }
    }

    /**
     * @returns {JSX.Element}
     */
    render() {

        let logOutContent = "";
        let message = "";
        let messageBoxStyle = "d-none";
        if (!this.props.message.empty) {
            messageBoxStyle = "border bg-white border-info"
            let messageClass = 'text-success text-center my-1 font-weight-bold';
            if (this.props.message.error) {
                messageClass = 'text-danger text-center my-1 font-weight-bold';
            }
            message = <p className={messageClass}>{this.props.message.content}</p>
        }

        if (this.state.loggedInCookie || this.props.isLogged) {
            logOutContent =
                <p className="cursor-hover" onClick={this.logOut}><FontAwesomeIcon icon={faSignOutAlt}/> Log out</p>
        }

        return (
            <header className="Header bg-secondary">
                <div className="mt-0 container text-left p-4 mt-0">
                    <div className="row">
                        <Title
                            cssClass="col-8"
                            isLoggedIn={this.props.isLogged}
                            username={this.props.username}
                        />
                        <div className="col-4 text-right">
                            {logOutContent}
                            <div id="message-box" className={messageBoxStyle}>
                                {message}
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        );
    }

}

export default Header;
