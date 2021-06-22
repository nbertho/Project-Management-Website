import React, {Component} from 'react';

import Menu from '../../components/Projects/List/Menu/Menu'
import ProjectList from "./ProjectList";
import ProjectDetails from "./ProjectDetails";

class ProjectViewer extends Component {

    /**
     * @param props
     */
    constructor(props) {
        super(props);
        this.state = {
            projectsData: this.props.projectsData,
            statusData: [],
            userData: this.props.userData,
            orderFilter: {
                value: 'name',
                order: 'asc'
            },
            showProject: false
        }

        this.updateShowProject = this.updateShowProject.bind(this);
        this.updateFilter = this.updateFilter.bind(this);
    }

    /**
     * Get the status helper from the API
     */
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
                    this.setState({error: true})
                }
            )
    }

    /**
     * @param prevProps
     * @param prevState
     * @param snapshot
     */
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.projectsData !== this.props.projectsData) {
            this.setState({projectsData: this.props.projectsData})
        }
    }

    /**
     * Update the showProject property
     * @param projectId
     */
    updateShowProject(projectId) {
        this.setState({showProject: projectId});
    }

    /**
     * Update the newState property
     * @param newState
     */
    updateFilter(newState) {
        this.setState({orderFilter: newState});
    }

    /**
     * @returns {JSX.Element}
     */
    render() {

        let cssClass = "ProjectViewer pb-4";
        let projectView = "";
        let projectTitle = "";

        if (!this.state.showProject) {
            projectView = <ProjectList userData={this.state.userData} projectsData={this.props.projectsData}
                                       updateShowProject={this.updateShowProject}
                                       updateDisplayMessage={this.props.updateDisplayMessage}/>;
            cssClass += ` container ${this.props.cssClass}`;
        } else {
            let project = this.props.projectsData.find(project => project.project_id === this.state.showProject)
            projectTitle = project.name;
            projectView =
                <ProjectDetails filter={this.state.orderFilter} project={project} userData={this.props.userData}
                                statusData={this.state.statusData}
                                updateDisplayMessage={this.props.updateDisplayMessage}/>;
            cssClass += ` mx-4 ${this.props.cssClass}`;
        }

        return (
            <div className={cssClass}>
                <Menu projectTitle={projectTitle} showProject={this.state.showProject}
                      updateShowProject={this.updateShowProject} updateFilter={this.updateFilter}/>
                <br/>
                {projectView}
                <br/>
            </div>
        )

    }

}

export default ProjectViewer;