import React, {Component} from 'react';
import {Link} from "react-router-dom";

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: false,
            loginMail: '',
            loginPwd: ''
        };

        this.handleMailChange = this.handleMailChange.bind(this);
        this.handlePwdChange = this.handlePwdChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleMailChange(event) {
        this.setState({loginMail: event.target.value});
    }

    handlePwdChange(event) {
        this.setState({loginPwd: event.target.value});
    }

    handleSubmit(event) {

        event.preventDefault();

        const requestBody = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                mail: this.state.loginMail,
                pwd: this.state.loginPwd
            })
        };

        fetch(process.env.REACT_APP_API_URL + "user/login", requestBody)
            .then(response => response.json())
            .then(
                (data) => {
                    if (!data.error) {
                        this.props.updateDisplayMessage({empty: false, error: data.error, content: data.msg});
                        this.props.updateAfterLogin(data.content.userData, data.content.projectsData , true);
                    }
                    else {
                        this.props.updateDisplayMessage({empty: false, error: data.error, content: data.msg});
                    }
                },
                (error) => {
                    this.props.updateDisplayMessage({empty: false, error: true, content: error});
                    this.setState({error: true})
                }
            )
    }


    render() {

        let cssClass = `Login ${this.props.cssClass}`;

        return (
            <div className={cssClass}>
                <div className="button-back"><Link to="/">Back to HomePage</Link></div>
                <h1 className="text-center">Login Page</h1>
                <br/>
                <form className="my-3 mx-auto" onSubmit={this.handleSubmit}>
                    <div className="my-3">
                        <label className="d-block text-center"htmlFor="email">Email</label>
                        <input
                            id="email"
                            className="d-block mx-auto"
                            onChange={this.handleMailChange}
                            type="text"
                            placeholder="Email adress"
                        />
                    </div>
                    <div className="my-3">
                        <label className="d-block text-center" htmlFor="password">Password</label>
                        <input
                            id="password"
                            className="d-block mx-auto"
                            onChange={this.handlePwdChange}
                            type="password"
                            placeholder="Password"
                        />
                    </div>
                    <div className="text-center">
                        <button className="btn btn-primary">Validate</button>
                    </div>
                </form>
                <br/>
                <div>
                    <p className="text-center mb-1">
                        <small>Otherwise you can register <Link to="/register">here</Link></small>
                    </p>
                </div>
            </div>
        )
    }

}

export default Login;