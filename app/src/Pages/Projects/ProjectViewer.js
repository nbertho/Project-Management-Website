import React, {Component} from 'react';

import Menu from '../../components/Projects/List/Menu/Menu'
import ProjectList from "./ProjectList";
import ProjectDetails from "./ProjectDetails";

class ProjectViewer extends Component {

    constructor(props) {
        super(props);
        this.state= {
            projectsData: this.props.projectsData,
            statusData: [],
            userData: this.props.userData,
            showProject: false
        }

        this.updateShowProject = this.updateShowProject.bind(this);
    }

    componentDidMount() {
        const helperRequestBody = {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
        };

        fetch(process.env.REACT_APP_API_URL + "helpers/status", helperRequestBody)
            .then(response => response.json())
            .then(
                (data) => {
                    this.setState({statusData: data.content.status})
                },
                (error) => {
                    console.log(error)
                    this.setState({error: true})
                }
            )
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.projectsData !== this.props.projectsData){
            this.setState({projectsData: this.props.projectsData})
        }
    }

    updateShowProject(projectId) {
        this.setState({showProject: projectId});
    }

    render() {

        let cssClass = "ProjectViewer pb-4";
        let projectView = "";
        let projectTitle = "";

        if (!this.state.showProject) {
            projectView = <ProjectList userData={this.state.userData} projectsData={this.props.projectsData} updateShowProject={this.updateShowProject} />;
            cssClass += ` container ${this.props.cssClass}`;
        }
        else {
            let project = this.props.projectsData.find( project => project.project_id === this.state.showProject )
            projectTitle = project.name;
            projectView = <ProjectDetails project={project} userData={this.props.userData} statusData={this.state.statusData} />;
            cssClass += ` mx-4 ${this.props.cssClass}`;
        }

        return (
            <div className={cssClass}>

                <Menu projectTitle={projectTitle} showProject={this.state.showProject} updateShowProject={this.updateShowProject} />
                <br/>
                {projectView}
                <br/>
            </div>
        )

    }

}

export default ProjectViewer;