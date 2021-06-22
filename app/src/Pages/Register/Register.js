import React, {Component} from 'react';
import {Link, Redirect} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye, faEyeSlash} from "@fortawesome/free-solid-svg-icons";

class Register extends Component {

    /**
     * @param props
     */
    constructor(props) {
        super(props);
        this.state = {
            passwordType: 'password',
            passwordVerifyType: 'password',
            registrationSuccess: false,
            userEmail: "",
            userName: "",
            userPwd: "",
            userPwdVerify: "",
            passwordValid: false,
            passwordMessage: ""
        }

        this.togglePasswordType = this.togglePasswordType.bind(this);
        this.togglePasswordVerifyType = this.togglePasswordVerifyType.bind(this);
        this.handleMailChange = this.handleMailChange.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handlePwdChange = this.handlePwdChange.bind(this);
        this.handlePwdVerifyChange = this.handlePwdVerifyChange.bind(this);
        this.checkPwd = this.checkPwd.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    /**
     * Toggle the password type between password and text
     */
    togglePasswordType() {
        if (this.state.passwordType === "password") {
            this.setState({passwordType: "text"})
        } else {
            this.setState({passwordType: "password"})
        }
    }

    /**
     * Toggle the second password type between password and text
     */
    togglePasswordVerifyType() {
        if (this.state.passwordVerifyType === "password") {
            this.setState({passwordVerifyType: "text"})
        } else {
            this.setState({passwordVerifyType: "password"})
        }
    }

    /**
     * Verify that both password matches
     */
    checkPwd() {

        if (this.state.userPwd === this.state.userPwdVerify) {
            this.setState({passwordValid: true, passwordMessage: ""})
        }

    }

    /**
     * Handle mail input changes
     * @param event
     */
    handleMailChange(event) {
        this.setState({userEmail: event.target.value});
    }

    /**
     * Handle name input changes
     * @param event
     */
    handleNameChange(event) {
        this.setState({userName: event.target.value});
    }

    /**
     * Handle password input changes
     * @param event
     */
    handlePwdChange(event) {
        this.setState(
            {userPwd: event.target.value},
            () => {
                this.checkPwd();
            }
        );
    }

    /**
     * Handle password verify input changes
     * @param event
     */
    handlePwdVerifyChange(event) {
        this.setState(
            {userPwdVerify: event.target.value},
            () => {
                this.checkPwd();
            }
        );
    }

    /**
     * Fetch the API to register the user
     * @param event
     */
    handleSubmit(event) {
        event.preventDefault();

        if (this.state.passwordValid) {
            const requestBody = {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    mail: this.state.userEmail,
                    name: this.state.userName,
                    pwd: this.state.userPwd
                })
            };

            fetch(process.env.REACT_APP_API_URL + "user/register", requestBody)
                .then(response => response.json())
                .then(
                    (data) => {
                        this.props.updateDisplayMessage({empty: false, error: data.error, content: data.msg});
                        if (!data.error) {
                            this.setState({registrationSuccess: true})
                        }
                    },
                    (error) => {
                        this.props.updateDisplayMessage({empty: false, error: true, content: error});
                        this.setState({error: true})
                    }
                )
        }
    }

    /**
     * @returns {JSX.Element}
     */
    render() {

        let cssClass = `Register ${this.props.cssClass}`;

        let pwdIcon = faEye;
        if (this.state.passwordType === "password") {
            pwdIcon = faEyeSlash;
        }

        let validateButton = <button disabled={true} className="btn btn-secondary">Validate</button>
        if (this.state.passwordValid) {
            validateButton = <button className="btn btn-primary">Validate</button>;
        }

        if (this.state.registrationSuccess) {
            return (
                <Redirect to="/"/>
            )
        } else {
            return (
                <div className={cssClass}>

                    <div className="button-back"><Link to="/">Back to HomePage</Link></div>

                    <h1 className="text-center">Register Page</h1>

                    <br/>

                    <form className="my-3 mx-auto" onSubmit={this.handleSubmit}>
                        <div className="my-3">
                            <label className="d-block text-center" htmlFor="email">Email</label>
                            <input
                                id="email"
                                className="d-block mx-auto w-25"
                                onChange={this.handleMailChange}
                                type="text"
                                placeholder="Email adress"
                            />
                        </div>
                        <div className="my-3">
                            <label className="d-block text-center" htmlFor="name">Name</label>
                            <input
                                id="name"
                                className="d-block mx-auto w-25"
                                onChange={this.handleNameChange}
                                type="text"
                                placeholder="Name"
                            />
                        </div>
                        <div className="my-3">
                            <label className="d-block text-center" htmlFor="password">Password</label>
                            <div className="row w-25 mx-auto">
                                <input
                                    id="password"
                                    className="d-block mx-auto col-10"
                                    onChange={this.handlePwdChange}
                                    type={this.state.passwordType}
                                />
                                <FontAwesomeIcon icon={pwdIcon} className="col-2 my-auto"
                                                 onClick={this.togglePasswordType}/>
                            </div>
                        </div>
                        <div className="my-3">
                            <label className="d-block text-center" htmlFor="password_verify">Verify your
                                password</label>
                            <div className="row w-25 mx-auto">
                                <input
                                    id="password_verify"
                                    className="d-block mx-auto col-10"
                                    onChange={this.handlePwdVerifyChange}
                                    type={this.state.passwordVerifyType}
                                />
                                <FontAwesomeIcon icon={pwdIcon} className="col-2 my-auto"
                                                 onClick={this.togglePasswordVerifyType}/>
                            </div>
                        </div>
                        <div className="text-center">
                            {validateButton}
                        </div>
                    </form>

                    <br/>

                    <div>
                        <p className="text-center mb-1">
                            <small>If you already have an account, you can log <Link to="/login">here</Link></small>
                        </p>
                    </div>

                </div>
            )
        }

    }

};

export default Register;