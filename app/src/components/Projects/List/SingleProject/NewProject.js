import react, {Component} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faTimes} from "@fortawesome/free-solid-svg-icons";

class NewProject extends Component {

    constructor(props) {
        super(props);

        this.state = {
            userData: this.props.userData,
            active: false,
            project_name: "",
            project_description: "",
            project_status: 1
        }

        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.addProject = this.addProject.bind(this);
        this.toggleActive = this.toggleActive.bind(this);
    }

    toggleActive() {
        this.setState({active: !this.state.active})
    }

    addProject() {

        const taskRequestBody = {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                user_id: this.state.userData.id,
                user_token: this.state.userData.token,
                project_name: this.state.project_name,
                project_description: this.state.project_description,
                project_status: this.state.project_status.toString()
            })
        };
        fetch(process.env.REACT_APP_API_URL + "project/create", taskRequestBody)
            .then(response => response.json())
            .then(
                (data) => {
                    console.log(data);
                    let newProject = {
                        description: this.state.project_description,
                        name: this.state.project_name,
                        project_id: data.content.project_id,
                        status_id: this.state.project_status,
                        token: data.content.project_token
                    }
                    this.setState({active: false});
                    this.props.addProject(newProject)
                },
                (error) => {
                    console.log(error)
                    this.setState({error: true})
                }
            )
    }

    handleNameChange(e) {
        this.setState({project_name: e.target.value});
    }

    handleDescriptionChange(e) {
        this.setState({project_description: e.target.value});
    }

    render() {

        if (this.state.active) {
            return (
                <tr className="SingleProject">
                    <td><input id="project_name" name="project_name" value={this.state.project_name} type="text" onChange={this.handleNameChange}/></td>
                    <td><input id="project_description" name="project_description" value={this.state.project_description} type="text" onChange={this.handleDescriptionChange}/></td>
                    <td className="d-flex justify-content-around">
                        <button onClick={this.addProject} className="btn btn-success"><FontAwesomeIcon icon={faCheck} /></button>
                        <button onClick={this.toggleActive} className="btn btn-danger"><FontAwesomeIcon icon={faTimes} /></button>
                    </td>
                </tr>
            );
        }
        else {
            return (
                <tr className="SingleProject">
                    <td onClick={this.toggleActive}><u>New Project</u></td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                </tr>
            );
        }


    }

}

export default NewProject;