import React, {Component} from 'react';
import { Link } from "react-router-dom";

import Menu from '../../components/Projects/List/Menu/Menu'
import SingleProject from '../../components/Projects/List/SingleProject/SingleProject'

class ProjectViewer extends Component {

    constructor(props) {
        super(props);
        this.state= {
            projectsData: this.props.projectsData,
            userData: this.props.userData,
            showProject: false
        }

        this.setShowDetails = this.setShowDetails.bind(this);
    }

    setShowDetails(nmbr) {
        this.setState({showProject: nmbr})
    }

    render() {

        let cssClass = `ProjectIndex ${this.props.cssClass}`;

        let projectList = this.state.projectsData.map((project) => {
            return <SingleProject key={project.project_id} value={project} />
        })

        return (
            <div className={cssClass}>

                <Menu/>

                <table className="table table-hover">
                    <thead className="thead-dark">
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Name</th>
                            <th scope="col">Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projectList}
                    </tbody>
                </table>

            </div>
        )

    }

};

export default ProjectViewer;