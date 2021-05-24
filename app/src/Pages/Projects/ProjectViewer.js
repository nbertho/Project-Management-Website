import React, {Component} from 'react';

import Menu from '../../components/Projects/List/Menu/Menu'
import ProjectList from "./ProjectList";
import ProjectDetails from "./ProjectDetails";

class ProjectViewer extends Component {

    constructor(props) {
        super(props);
        this.state= {
            projectsData: this.props.projectsData,
            userData: this.props.userData,
            showProject: 0
        }

        this.setShowDetails = this.setShowDetails.bind(this);
    }

    render() {

        let cssClass = `ProjectViewer ${this.props.cssClass}`;
        let projectView = "";

        if (this.state.showProject === 0) {
            projectView = <ProjectList userData={this.state.userData} projectsData={this.state.projectsData} />
        }
        else {
            projectView = <ProjectDetails project={this.props.project} userData={this.props.userData} />
        }

        return (
            <div className={cssClass}>

                <Menu/>

                {projectView}

            </div>
        )

    }

};

export default ProjectViewer;