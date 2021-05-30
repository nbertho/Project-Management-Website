import react, {Component} from "react";

class SingleProject extends Component {

    constructor(props) {
        super(props);

        this.showProject = this.showProject.bind(this);
    }

    showProject(e) {
        e.preventDefault();
        this.props.updateShowProject(this.props.value.project_id)
    }

    render() {
        return (
            <tr className="SingleProject" onClick={this.showProject}>
                <td>{this.props.value.project_id}</td>
                <td>{this.props.value.name}</td>
                <td>{this.props.value.description}</td>
            </tr>
        );
    }

}

export default SingleProject;