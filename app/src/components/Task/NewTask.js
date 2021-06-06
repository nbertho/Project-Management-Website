import react, {Component} from "react";
import React from "react";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faArrowLeft,
    faArrowRight,
    faCheck,
    faChevronDown,
    faChevronUp,
    faUndo
} from "@fortawesome/free-solid-svg-icons";

class NewTask extends Component {

    constructor(props) {
        super(props);

        this.state = {
            error: false,
            statusData: 0,
            task_id: "",
            task_token: "",
            task_name: "",
            task_description: "",
            task_et: 0,
            task_priority: 0,
            collapse: true
        }

        this.handleNameChange = this.handleNameChange.bind(this);
        this.createTask = this.createTask.bind(this);
        this.resetState = this.resetState.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.handlePriorityChange = this.handlePriorityChange.bind(this);
        this.handleEtChange = this.handleEtChange.bind(this);
        this.toggleCollapse = this.toggleCollapse.bind(this);

    }

    toggleCollapse() {
        this.setState({collapse: !this.state.collapse})
    }

    resetState() {
        this.setState({
            task_id: "",
            task_token: "",
            task_name: "",
            task_description: "",
            task_et: 0,
            task_priority: 0,
            collapse: true
        });
    }

    createTask() {

        const taskRequestBody = {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                project_id: this.props.projectData.project_id,
                project_token: this.props.projectData.token,
                task_name: this.state.task_name,
                task_priority: this.state.task_priority,
                task_description: this.state.task_description,
                task_et: this.state.task_et
            })
        };
        fetch(process.env.REACT_APP_API_URL + "task/create", taskRequestBody)
            .then(response => response.json())
            .then(
                (data) => {
                    if (!data.error) {
                        this.props.updateTaskList({
                            id: data.content.task_id,
                            name: this.state.task_name,
                            description: this.state.task_description,
                            estimated_time: this.state.task_et,
                            priority: this.state.task_priority,
                            status_id: 1,
                            token: data.content.task_token
                        });
                        this.resetState();
                    }
                    else {
                        alert(data.msg)
                    }
                },
                (error) => {
                    console.log(error)
                    this.setState({error: true})
                }
            )


    }

    handleNameChange(event) {
        this.setState({task_name: event.target.value, dataHasChanged: true});
    }

    handleDescriptionChange(event) {
        this.setState({task_description: event.target.value, dataHasChanged: true});
    }

    handlePriorityChange(event) {
        this.setState({task_priority: event.target.value, dataHasChanged: true});
    }

    handleEtChange(event) {
        this.setState({task_et: event.target.value, dataHasChanged: true});
    }


    render() {

        let cssClass = `Task card col-2 offset-0`;
        let collapseData =  <div>
                                <button onClick={this.resetState} className="btn btn-danger mx-1">
                                    <FontAwesomeIcon icon={faUndo} />
                                </button>
                                <button onClick={this.createTask} className="btn btn-success mx-1">
                                    <FontAwesomeIcon icon={faCheck} />
                                </button>
                            </div>

        // Collapse Action
        let collapseAction = <FontAwesomeIcon icon={faChevronDown} />
        let cssContent = "";

        if (this.state.collapse) {
            collapseAction = <FontAwesomeIcon icon={faChevronUp} />
            collapseData = <h5 className="my-auto cursor-hover" onClick={this.toggleCollapse}>+ New Task</h5>;
            cssContent = "d-none";
        }

        return (
            <div className="row mb-2">

                <article className={cssClass}>

                    <div className="d-flex justify-content-between pt-2 mb-2">
                        <button className="btn btn-light" onClick={this.toggleCollapse}>
                            {collapseAction}
                        </button>
                        {collapseData}
                    </div>

                    <div className={cssContent}>

                        <input id="task_name" className="py-2" name="task_name" placeholder="Task name" value={this.state.task_name} type="text" onChange={this.handleNameChange} />

                        <div className="TaskDescription">
                            <input className="w-100 my-2" id="task_description" placeholder="Task description" name="task_description" value={this.state.task_description} type="text" onChange={this.handleDescriptionChange} />
                        </div>

                        <div className="TaskInfo my-4 row">
                            <div className="col-6">
                                <p>Estimated-time</p>
                                <input className="w-100" id="task_et" name="task_et" value={this.state.task_et} type="number" onChange={this.handleEtChange} />
                            </div>
                            <div className="col-6">
                                <p>Priority</p>
                                <input className="w-100" id="task_priority" name="task_priority" value={this.state.task_priority} type="number" onChange={this.handlePriorityChange} />
                            </div>
                        </div>

                        <div className="d-flex my-2 justify-content-around">
                            <button className="btn btn-light" onClick={this.decrementTaskStatus}>
                                <FontAwesomeIcon icon={faArrowLeft} />
                            </button>
                            <div>&nbsp;</div>
                            <button className="btn btn-light" onClick={this.incrementTaskStatus}>
                                <FontAwesomeIcon icon={faArrowRight} />
                            </button>
                        </div>
                    </div>

                </article>
            </div>
        );
    }

}

export default NewTask;