import react, {Component} from "react";
import React from "react";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";
import {faArrowRight} from "@fortawesome/free-solid-svg-icons";

class Task extends Component {

    constructor(props) {
        super(props);

        let statusData = this.props.statusData.find(stat => stat.id === this.props.taskData.status_id)

        this.state = {
            error: false,
            statusData: statusData,
            task: this.props.taskData,
        }

        this.decrementTaskStatus = this.decrementTaskStatus.bind(this);
        this.incrementTaskStatus = this.incrementTaskStatus.bind(this);

    }

    decrementTaskStatus() {

        let newStatusId = this.props.taskData.status_id--;

        if (newStatusId > 0 && newStatusId < this.props.statusData.length) {
            const taskRequestBody = {
                method: 'PATCH',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    task_id: this.state.task.id,
                    task_token: this.state.task.token,
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
        let newStatusId = this.props.taskData.status_id++;

        if (newStatusId > 0 && newStatusId < this.props.statusData.length) {
            const taskRequestBody = {
                method: 'PATCH',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    task_id: this.state.task.id,
                    task_token: this.state.task.token,
                    status_id: newStatusId
                })
            };

            fetch(process.env.REACT_APP_API_URL + "task/update/status", taskRequestBody)
                .then(response => response.json())
                .then(
                    (data) => {
                        this.setState({statusData: this.props.statusData.find(stat => stat.id === newStatusId)})
                        console.log(data);
                    },
                    (error) => {
                        console.log(error)
                        this.setState({error: true})
                    }
                )
        }
    }

    render() {

        let cssClass = `Task card col-2 offset-${this.state.task.status_id * 2 - 2}`;

        let currentStatus = this.props.statusData;

        if ( currentStatus < this.props.statusData.length) {

        }

        return (
            <div className="row mb-2">

                <article className={cssClass}>

                    <h5
                        className="card-title py-2"
                        style={{borderBottom: "3px solid " + this.state.statusData.color}}
                    >
                        {this.state.task.name}
                    </h5>

                    <div className="TaskDescription">
                        <p className="card-text">{this.state.task.description}</p>
                    </div>

                    <div className="TaskInfo">
                        <div>
                            {this.state.task.estimated_time}
                        </div>
                        <div>
                            {this.state.task.priority}
                        </div>
                    </div>

                    <div className="d-flex my-2 justify-content-around">
                        <div className="border border-dark py-2 px-4 cursor-hover">
                            <FontAwesomeIcon onClick={this.decrementTaskStatus} icon={faArrowLeft} />
                        </div>
                        <div>
                        </div>
                        <div className="border border-dark py-2 px-4 cursor-hover">
                            <FontAwesomeIcon onClick={this.incrementTaskStatus} icon={faArrowRight} />
                        </div>

                    </div>
                </article>
            </div>
        );
    }

}

export default Task;