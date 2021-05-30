import react, {Component} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

class Menu extends Component {

    constructor(props) {
        super(props);
        this.returnToProjectIndex = this.returnToProjectIndex.bind(this);
    }

    returnToProjectIndex(e) {
        e.preventDefault();
        this.props.updateShowProject(false)
    }

    render() {

        let cssClass = "Menu mt-2 container mx-auto row";

        if (this.props.showProject !== false) {
            return (
                <div className={cssClass}>
                    <p className="cursor-hover col-4" onClick={this.returnToProjectIndex}>
                        <FontAwesomeIcon icon={faArrowLeft} /> Back to project list
                    </p>
                    <h3 className="text-center col-4">
                        {this.props.projectTitle}
                    </h3>
                    <div className="col-4">&nbsp;</div>
                </div>
            );
        }
        else {
            return (
                <div className={cssClass}>
                    <p>Project Home</p>
                </div>
            )
        }

    }

}

export default Menu;
