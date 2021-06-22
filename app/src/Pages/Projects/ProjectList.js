import React, {Component} from 'react';

import SingleProject from '../../components/Projects/List/SingleProject/SingleProject'
import NewProject from "../../components/Projects/List/SingleProject/NewProject";

class ProjectList extends Component {

    /**
     * @param props
     */
    constructor(props) {
        super(props);
        this.state = {
            projectsData: this.props.projectsData,
            userData: this.props.userData,
        }
        this.addProject = this.addProject.bind(this);
    }

    /**
     * Add a project to the state projectsData
     * @param projectData
     */
    addProject(projectData) {
        if (projectData.project_id !== undefined) {
            let newProjectData = [...this.state.projectsData, projectData];
            this.setState({projectsData: newProjectData})
        }
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
     * @returns {JSX.Element}
     */
    render() {

        let cssClass = `ProjectList ${this.props.cssClass}`;

        let projectList = this.state.projectsData.map((project) => {
            return <SingleProject key={project.project_id} project={project}
                                  updateShowProject={this.props.updateShowProject} removeProject={this.removeProject}
                                  updateDisplayMessage={this.props.updateDisplayMessage}/>
        })

        let newProject = <NewProject userData={this.props.userData} addProject={this.addProject}
                                     updateDisplayMessage={this.props.updateDisplayMessage}/>

        return (
            <div className={cssClass}>

                <table className="table table-hover">
                    <thead className="thead-dark">
                    <tr>
                        <th scope="col">Name</th>
                        <th scope="col">Description</th>
                        <th className="text-center" scope="col">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {newProject}
                    {projectList}
                    </tbody>
                </table>

            </div>
        )

    }

};

export default ProjectList;