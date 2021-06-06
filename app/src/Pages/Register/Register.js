import React, {Component} from 'react';
import {Link, Redirect} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye, faEyeSlash} from "@fortawesome/free-solid-svg-icons";

class Register extends Component {

    constructor(props) {
        super(props);
        this.state = {
            passwordType: 'password',
            registrationSuccess: false,
            userEmail: "",
            userName: "",
            userPwd: "",
        }

        this.togglePasswordType = this.togglePasswordType.bind(this);
        this.handleMailChange = this.handleMailChange.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handlePwdChange = this.handlePwdChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    togglePasswordType() {
        if (this.state.passwordType === "password") {
            this.setState({passwordType: "text"})
        }
        else {
            this.setState({passwordType: "password"})
        }
    }

    handleMailChange(event) {
        this.setState({userEmail: event.target.value});
    }

    handleNameChange(event) {
        this.setState({userName: event.target.value});
    }

    handlePwdChange(event) {
        this.setState({userPwd: event.target.value});
    }

    handleSubmit(event) {
        event.preventDefault();

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


    render () {

        let cssClass = `Register ${this.props.cssClass}`;

        let pwdIcon = faEye;
        if (this.state.passwordType === "password") {
            pwdIcon = faEyeSlash;
        }

        if (this.state.registrationSuccess) {
            return (
                <Redirect to="/" />
            )
        }
        else {
            return (
                <div className={cssClass}>

                    <div className="button-back"><Link to="/">Back to HomePage</Link></div>

                    <h1 className="text-center">Register Page</h1>

                    <br/>

                    <form className="my-3 mx-auto" onSubmit={this.handleSubmit}>
                        <div className="my-3">
                            <label className="d-block text-center"htmlFor="email">Email</label>
                            <input
                                id="email"
                                className="d-block mx-auto w-25"
                                onChange={this.handleMailChange}
                                type="text"
                                placeholder="Email adress"
                            />
                        </div>
                        <div className="my-3">
                            <label className="d-block text-center"htmlFor="name">Email</label>
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
                                <FontAwesomeIcon icon={pwdIcon} className="col-2 my-auto" onClick={this.togglePasswordType} />
                            </div>
                        </div>
                        <div className="text-center">
                            <button className="btn btn-primary">Validate</button>
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