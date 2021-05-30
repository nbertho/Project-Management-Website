import react, {Component} from "react";

class Title extends Component {

    render() {

        let username = "Not logged-in";
        if (this.props.isLoggedIn && this.props.username !== "") {
            username = this.props.username;
        }

        return (
            <div className={this.props.cssClass}>
                <h1>Project Management App</h1>
                {username}
            </div>
        );
    }

}

export default Title;
