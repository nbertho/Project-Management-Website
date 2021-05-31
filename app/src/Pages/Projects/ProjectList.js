import React, {Component} from 'react';

import SingleProject from '../../components/Projects/List/SingleProject/SingleProject'
import NewProject from "../../components/Projects/List/SingleProject/NewProject";

class ProjectList extends Component {

    constructor(props) {
        super(props);
        this.state= {
            projectsData: this.props.projectsData,
            userData: this.props.userData,
        }
        this.addProject = this.addProject.bind(this);
    }

    addProject(projectData) {
        let newProjectData = [...this.state.projectsData, projectData];
        this.setState({projectsData: newProjectData})
    }

    render() {

        let cssClass = `ProjectList ${this.props.cssClass}`;

        let projectList = this.state.projectsData.map((project) => {
            return <SingleProject key={project.project_id} project={project} updateShowProject={this.props.updateShowProject} removeProject={this.removeProject} />
        })

        let newProject = <NewProject userData={this.props.userData} addProject={this.addProject} />

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