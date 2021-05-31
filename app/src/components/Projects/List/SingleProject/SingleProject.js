import react, {Component} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCog, faTrash, faCheck} from "@fortawesome/free-solid-svg-icons";

class SingleProject extends Component {

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
    }

    handleNameChange(e) {
        this.setState({project_name: e.target.value, dataHasChanged: true});
    }

    handleDescriptionChange(e) {
        this.setState({project_description: e.target.value, dataHasChanged: true});
    }

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
                        console.log(data);
                        if (!data.error) {
                            this.setState({updatePending: !this.state.updatePending, isShown: false});
                        }
                    },
                    (error) => {
                        console.log(error)
                        this.setState({error: true})
                    }
                )
        }
    }

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
                        console.log(data);
                        this.setState({updatePending: !this.state.updatePending});
                    },
                    (error) => {
                        console.log(error)
                        this.setState({error: true})
                    }
                )
        }
        else {
            this.setState({updatePending: !this.state.updatePending});
        }
    }

    showProject(e) {
        e.preventDefault();
        if (!this.state.updatePending) {
            this.props.updateShowProject(this.props.project.project_id)
        }
    }

    render() {

        let nameData = this.state.project_name;
        let descriptionData = this.state.project_description;
        let updateButton = <FontAwesomeIcon icon={faCog} />;

        if (this.state.updatePending) {
            nameData = <input id="project_name" name="project_name" value={this.state.project_name} type="text" onChange={this.handleNameChange}/>;
            descriptionData = <input id="project_description" name="project_description" value={this.state.project_description} type="text" onChange={this.handleDescriptionChange}/>;
            updateButton = <FontAwesomeIcon icon={faCheck} color="green" />;
        }

        if (this.state.isShown) {
            return (
                <tr className="SingleProject">
                    <td onClick={this.showProject}>{nameData}</td>
                    <td onClick={this.showProject}>{descriptionData}</td>
                    <td className="d-flex justify-content-around">
                        <button onClick={this.toggleUpdate} className="btn btn-light">{updateButton}</button>
                        <button onClick={this.handleDeleteProject} className="btn btn-light"><FontAwesomeIcon icon={faTrash} /></button>
                    </td>
                </tr>
            );
        }
        else {
            return (
                <tr className="d-none"/>
            );
        }

    }

}

export default SingleProject;