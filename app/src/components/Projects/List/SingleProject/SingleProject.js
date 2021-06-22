import react, {Component} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCog, faTrash, faCheck, faUndo} from "@fortawesome/free-solid-svg-icons";

class SingleProject extends Component {

    /**
     * @param props
     */
    constructor(props) {
        super(props);

        this.state = {
            updatePending: false,
            dataHasChanged: false,
            isShown: true,
            project_id: this.props.project.project_id,
            project_token: this.props.project.token,
            project_name: this.props.project.name,
            project_description: this.props.project.description,
            project_status: this.props.project.status_id
        }

        this.showProject = this.showProject.bind(this);
        this.toggleUpdate = this.toggleUpdate.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.handleDeleteProject = this.handleDeleteProject.bind(this);
        this.removeUpdate = this.removeUpdate.bind(this);
    }

    /**
     * Handle project name change
     * @param e
     */
    handleNameChange(e) {
        this.setState({project_name: e.target.value, dataHasChanged: true});
    }

    /**
     * Handle project description change
     * @param e
     */
    handleDescriptionChange(e) {
        this.setState({project_description: e.target.value, dataHasChanged: true});
    }

    /**
     * Handle the suppression of a project with the API and hides it from the state
     */
    handleDeleteProject() {
        let deleteConfirmed = window.confirm(`Are you sure you want to delete the project : ${this.state.project_name}?`);
        if (deleteConfirmed) {
            const taskRequestBody = {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    project_id: this.state.project_id,
                    project_token: this.state.project_token
                })
            };

            fetch(process.env.REACT_APP_API_URL + "project/delete", taskRequestBody)
                .then(response => response.json())
                .then(
                    (data) => {
                        this.props.updateDisplayMessage({empty: false, error: data.error, content: data.msg});
                        if (!data.error) {
                            this.setState({updatePending: !this.state.updatePending, isShown: false});
                        }
                    },
                    (error) => {
                        this.props.updateDisplayMessage({empty: false, error: true, content: error});
                        this.setState({error: true})
                    }
                )
        }
    }

    /**
     * Reset the update data of a project
     */
    removeUpdate() {

        this.setState({
            updatePending: false,
            dataHasChanged: false,
            project_id: this.props.project.project_id,
            project_token: this.props.project.token,
            project_name: this.props.project.name,
            project_description: this.props.project.description,
            project_status: this.props.project.status_id
        })
    }

    /**
     * Toggle the update state of a project and fetch the API if needed to update it in the DB
     */
    toggleUpdate() {

        if (this.state.dataHasChanged && this.state.updatePending) {
            const taskRequestBody = {
                method: 'PATCH',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    project_id: this.state.project_id,
                    project_token: this.state.project_token,
                    project_name: this.state.project_name,
                    project_description: this.state.project_description,
                    project_status: this.state.project_status.toString()
                })
            };

            fetch(process.env.REACT_APP_API_URL + "project/update", taskRequestBody)
                .then(response => response.json())
                .then(
                    (data) => {
                        this.props.updateDisplayMessage({empty: false, error: data.error, content: data.msg});
                        this.setState({updatePending: !this.state.updatePending});
                    },
                    (error) => {
                        this.props.updateDisplayMessage({empty: false, error: true, content: error});
                        this.setState({error: true})
                    }
                )
        } else {
            this.setState({updatePending: !this.state.updatePending});
        }
    }

    /**
     * Show project details
     * @param e
     */
    showProject(e) {
        e.preventDefault();
        if (!this.state.updatePending) {
            this.props.updateShowProject(this.props.project.project_id)
        }
    }

    /**
     * @returns {JSX.Element}
     */
    render() {

        let nameData = this.state.project_name;
        let descriptionData = this.state.project_description;
        let actions =
            <td className="d-flex justify-content-around">
                <button onClick={this.toggleUpdate} className="btn btn-light"><FontAwesomeIcon icon={faCog}/></button>
                <button onClick={this.handleDeleteProject} className="btn btn-light"><FontAwesomeIcon icon={faTrash}/>
                </button>
            </td>;

        if (this.state.updatePending) {
            nameData = <input id="project_name" name="project_name" value={this.state.project_name} type="text"
                              onChange={this.handleNameChange}/>;
            descriptionData =
                <input id="project_description" name="project_description" value={this.state.project_description}
                       type="text" onChange={this.handleDescriptionChange}/>;
            actions =
                <td className="d-flex justify-content-around">
                    <button onClick={this.toggleUpdate} className="btn btn-success"><FontAwesomeIcon icon={faCheck}/>
                    </button>
                    <button onClick={this.removeUpdate} className="btn btn-danger"><FontAwesomeIcon icon={faUndo}/>
                    </button>
                </td>;
        }

        if (this.state.isShown) {
            return (
                <tr className="SingleProject">
                    <td onClick={this.showProject}>{nameData}</td>
                    <td onClick={this.showProject}>{descriptionData}</td>
                    {actions}
                </tr>
            );
        } else {
            return (
                <tr className="d-none"/>
            );
        }

    }

}

export default SingleProject;