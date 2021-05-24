import react, {Component} from "react";

class SingleProject extends Component {

    render() {
        return (
            <tr className="Menu">
                <td>{this.props.value.project_id}</td>
                <td>{this.props.value.name}</td>
                <td>{this.props.value.description}</td>
            </tr>
        );
    }

}

export default SingleProject;