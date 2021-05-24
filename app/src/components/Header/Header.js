import react, {Component} from "react";

import Title from './Title/Title'

class Header extends Component {

    constructor(props) {
        super(props);
    }

    render() {


        return (
            <header className="Header bg-secondary">
                <div className="mt-0 container text-left p-4 mt-0">
                    <div className="row">
                        <Title
                            cssClass="col-6"
                            isLoggedIn={this.props.isLogged}
                            username={this.props.username}
                        />
                        <div className="col-5"></div>
                    </div>
                </div>
            </header>
        );
    }

}

export default Header;
