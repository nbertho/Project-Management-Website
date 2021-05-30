import react, {Component} from "react";
import React from "react";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft, faArrowRight, faCog, faCheck, faTrash, faChevronDown, faChevronUp} from "@fortawesome/free-solid-svg-icons";

class Task extends Component {

    constructor(props) {
        super(props);

        let statusData = this.props.statusData.find(stat => stat.id === this.props.taskData.status_id)

        this.state = {
            error: false,
            statusData: statusData,
            task_id: this.props.taskData.id,
            task_token: this.props.taskData.token,
            task_name: this.props.taskData.name,
            task_description: this.props.taskData.description,
            task_et: this.props.taskData.estimated_time,
            task_priority: this.props.taskData.priority,
            task_status_id: this.props.taskData.status_id,
            updatePending: false,
            dataHasChanged: false,
            collapse: false
        }

        this.decrementTaskStatus = this.decrementTaskStatus.bind(this);
        this.incrementTaskStatus = this.incrementTaskStatus.bind(this);
        this.updateTask = this.updateTask.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.handlePriorityChange = this.handlePriorityChange.bind(this);
        this.handleEtChange = this.handleEtChange.bind(this);
        this.toggleCollapse = this.toggleCollapse.bind(this);

    }

    toggleCollapse() {
        this.setState({collapse: !this.state.collapse})
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

    updateTask() {

        if (this.state.dataHasChanged && this.state.updatePending) {

            const taskRequestBody = {
                method: 'PATCH',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    task_id: this.state.task_id,
                    task_token: this.state.task_token,
                    task_name: this.state.task_name,
                    task_description: this.state.task_description,
                    task_et: this.state.task_et,
                    task_priority: this.state.task_priority
                })
            };

            fetch(process.env.REACT_APP_API_URL + "task/update", taskRequestBody)
                .then(response => response.json())
                .then(
                    (data) => {
                        console.log(data);
                    },
                    (error) => {
                        console.log(error)
                        this.setState({error: true})
                    }
                )

            this.setState({updatePending: !this.state.updatePending, dataHasChanged: false})
        }
        else {
            this.setState({updatePending: !this.state.updatePending})
        }

    }

    decrementTaskStatus() {
        if (typeof this.state.task_status_id === 'undefined') {
            this.setState({task_status_id: this.props.taskData.status_id})
        }
        let statusId = this.state.task_status_id;
        let newStatusId = statusId - 1;

        if (newStatusId > 0 && newStatusId < this.props.statusData.length) {

            this.setState({task_status_id: newStatusId});

            const taskRequestBody = {
                method: 'PATCH',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    task_id: this.state.task_id,
                    task_token: this.state.task_token,
                    status_id: newStatusId
                })
            };

            fetch(process.env.REACT_APP_API_URL + "task/update/status", taskRequestBody)
                .then(response => response.json())
                .then(
                    (data) => {
                        this.setState({statusData: this.props.statusData.find(stat => stat.id === newStatusId) })
                        console.log(data);
                    },
                    (error) => {
                        console.log(error)
                        this.setState({error: true})
                    }
                )
        }

    }

    incrementTaskStatus() {
        if (typeof this.state.status_id === 'undefined') {
            this.setState({task_status_id: this.props.taskData.status_id})
        }
        let statusId = this.state.task_status_id;
        let newStatusId = statusId + 1;

        if (newStatusId > 0 && newStatusId <= this.props.statusData.length) {

            this.setState({task_status_id: newStatusId});

            const taskRequestBody = {
                method: 'PATCH',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    task_id: this.state.task_id,
                    task_token: this.state.task_token,
                    status_id: newStatusId
                })
            };

            fetch(process.env.REACT_APP_API_URL + "task/update/status", taskRequestBody)
                .then(response => response.json())
                .then(
                    (data) => {
                        this.setState({statusData: this.props.statusData.find(stat => stat.id === newStatusId)})
                        //console.log(data);
                    },
                    (error) => {
                        console.log(error)
                        this.setState({error: true})
                    }
                )
        }
    }

    render() {

        let cssClass = `Task card col-2 offset-${this.state.task_status_id * 2 - 2}`;
        let changeIcon = <FontAwesomeIcon className="mt-2" icon={faCog} onClick={this.updateTask} />;
        let descriptionContent = <p className="card-text">{this.state.task_description}</p>
        let nameContent = <h5 className="py-2" style={{borderBottom: "3px solid " + this.state.statusData.color}}>{this.state.task_name}</h5>
        let etContent = <input className="w-100" id="task_et" name="task_et" value={this.state.task_et ?? undefined} type="number" onChange={this.handleEtChange} />
        let priorityContent = <input className="w-100" id="task_priority" name="task_priority" value={this.state.task_priority ?? undefined} type="number" onChange={this.handlePriorityChange} />

        if (this.state.updatePending) {
            changeIcon = <FontAwesomeIcon className="mt-2" color="green" icon={faCheck} onClick={this.updateTask} />;
            descriptionContent = <input className="w-100 my-2" id="task_description" name="task_description" value={this.state.task_description} type="text" onChange={this.handleDescriptionChange} />
            nameContent = <input id="task_name" className="py-2" name="task_name" value={this.state.task_name} type="text" onChange={this.handleNameChange} />
        }

        // Collapse Action
        let collapseAction = <FontAwesomeIcon icon={faChevronDown} />
        let cssContent = "";

        if (this.state.collapse) {
            collapseAction = <FontAwesomeIcon icon={faChevronUp} />
            cssContent = "d-none";
        }

        return (
            <div className="row mb-2">

                <article className={cssClass}>

                    <div className="d-flex justify-content-between pt-2">
                        <button className="btn btn-light" onClick={this.toggleCollapse}>
                            {collapseAction}
                        </button>
                        <div className="text-right">
                            <FontAwesomeIcon className="mx-3 mt-2" icon={faTrash} />
                            {changeIcon}
                        </div>
                    </div>

                    {nameContent}

                    <div className={cssContent}>
                        <div className="TaskDescription">
                            {descriptionContent}
                        </div>

                        <div className="TaskInfo my-4 row">
                            <div className="col-6">
                                <p>Estimated-time</p>
                                {etContent}
                            </div>
                            <div className="col-6">
                                <p>Priority</p>
                                {priorityContent}
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

export default Task;