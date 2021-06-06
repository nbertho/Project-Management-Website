import React, {Component} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faQuestionCircle} from "@fortawesome/free-solid-svg-icons";

import Task from "../../components/Task/Task";
import NewTask from "../../components/Task/NewTask";

class ProjectDetails extends Component {

    constructor(props) {
        super(props);
        this.state= {
            project: this.props.project,
            userData: this.props.userData,
            showProject: this.props.showProject,
            statusData: this.props.statusData,
            tasks: []
        }
    }

    componentDidMount() {
        const taskRequestBody = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                project_id: this.state.project.project_id,
                project_token: this.state.project.token
            })
        };

        fetch(process.env.REACT_APP_API_URL + "task/show", taskRequestBody)
            .then(response => response.json())
            .then(
                (data) => {
                    this.setState({tasks: data.content.tasks})
                },
                (error) => {
                    console.log(error)
                    this.setState({error: true})
                }
            )

    }

    render() {

        let cssClass = `ProjectDetails mx-4 ${this.props.cssClass}`;

        let statusTable = this.state.statusData.map((status) => {
            return (
                <div key={status.id} className="col-2 font-weight-bold container">
                    <h5 className="pb-1 text-center" style={{borderBottom: "3px solid " + status.color}}>
                        {status.name} <FontAwesomeIcon data-bs-toggle="tooltip" data-bs-placement="bottom" title={status.description} icon={faQuestionCircle} />
                    </h5>
                </div>
            )
        });

        let taskInTable = this.state.tasks.map((task) => {
            return <Task key={task.id} taskData={task} statusData={this.state.statusData} />
        })

        return (
            <div className={cssClass}>
                <div className="row mb-2">
                    {statusTable}
                </div>
                <br/>
                <NewTask projectData={this.props.project} />
                {taskInTable}
            </div>
        )

    }

};

export default ProjectDetails;