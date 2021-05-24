import React, {Component} from 'react';

class ProjectDetails extends Component {

    constructor(props) {
        super(props);
        this.state= {
            project: this.props.project,
            userData: this.props.userData,
            showProject: this.props.showProject
        }
    }

    render() {

        let cssClass = `ProjectIndex ${this.props.cssClass}`;

        return (
            <div className={cssClass}>

                <p>{this.state.project.showProject}</p>

            </div>
        )

    }

};

export default ProjectDetails;