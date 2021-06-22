import React, {Component} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faQuestionCircle} from "@fortawesome/free-solid-svg-icons";

import Task from "../../components/Task/Task";
import NewTask from "../../components/Task/NewTask";

class ProjectDetails extends Component {

    /**
     * @param props
     */
    constructor(props) {
        super(props);
        this.state = {
            project: this.props.project,
            userData: this.props.userData,
            showProject: this.props.showProject,
            statusData: this.props.statusData,
            tasks: []
        }
        this.updateTaskList = this.updateTaskList.bind(this);
        this.sortArrayByName = this.sortArrayByName.bind(this);
        this.sortArrayByPriority = this.sortArrayByPriority.bind(this);
    }

    /**
     * Update the task list of the state
     * @param newTask
     */
    updateTaskList(newTask) {
        this.setState({
            tasks: [...this.state.tasks, newTask]
        })
    }

    /**
     * Sort an array of object by name property
     * @param a
     * @param b
     * @returns {number}
     */
    sortArrayByName(a, b) {
        if (a.name < b.name) {
            return -1;
        }
        if (a.name > b.name) {
            return 1;
        }
    }

    /**
     * Sort an array of object by priority property
     * @param a
     * @param b
     * @returns {number}
     */
    sortArrayByPriority(a, b) {
        if (a.priority < b.priority) {
            return -1;
        }
        if (a.priority > b.priority) {
            return 1;
        }
        return 0;
    }

    /**
     * Get the task list from the API
     */
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

    /**
     * @returns {JSX.Element}
     */
    render() {

        let cssClass = `ProjectDetails mx-4 ${this.props.cssClass}`;

        let statusTable = this.state.statusData.map((status) => {
            return (
                <div key={status.id} className="col-2 font-weight-bold container">
                    <h5 className="pb-1 text-center" style={{borderBottom: "3px solid " + status.color}}>
                        {status.name} <FontAwesomeIcon data-bs-toggle="tooltip" data-bs-placement="bottom"
                                                       title={status.description} icon={faQuestionCircle}/>
                    </h5>
                </div>
            )
        });

        let tasksList = this.state.tasks;
        if (this.props.filter.value === 'name') {
            tasksList.sort(this.sortArrayByName);
        }
        if (this.props.filter.value === 'priority') {
            tasksList.sort(this.sortArrayByPriority);
        }

        if (this.props.filter.order === 'desc') {
            tasksList.reverse();
        }

        let taskInTable = tasksList.map((task) => {
            return <Task key={task.id} taskData={task} statusData={this.state.statusData}
                         updateDisplayMessage={this.props.updateDisplayMessage}/>
        })

        return (
            <div className={cssClass}>
                <div className="row mb-2">
                    {statusTable}
                </div>
                <br/>
                <NewTask updateTaskList={this.updateTaskList} projectData={this.props.project}
                         updateDisplayMessage={this.props.updateDisplayMessage}/>
                {taskInTable}
            </div>
        )

    }

};

export default ProjectDetails;