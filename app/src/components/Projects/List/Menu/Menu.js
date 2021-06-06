import react, {Component} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";

class Menu extends Component {

    constructor(props) {
        super(props);

        this.state = {
            optionSelected: 'name',
            options: [
                {
                    name: "Name",
                    value: 'name'
                },
                {
                    name: "Priority",
                    value: 'priority'
                }
            ],
            order: 'asc',
        }

        this.handleValueChange = this.handleValueChange.bind(this);
        this.handleOrderChange = this.handleOrderChange.bind(this);
        this.updateParentFilter = this.updateParentFilter.bind(this);
        this.returnToProjectIndex = this.returnToProjectIndex.bind(this);
    }

    updateParentFilter() {
        this.props.updateFilter({
            value: this.state.optionSelected,
            order: this.state.order,
        })
    }

    handleValueChange(event) {
        this.setState( { optionSelected: event.target.value}, () => this.updateParentFilter());
    }

    handleOrderChange(e) {
        this.setState({order: e.target.value}, () => this.updateParentFilter());
    }

    returnToProjectIndex(e) {
        e.preventDefault();
        this.props.updateShowProject(false)
    }

    render() {

        let cssClass = "Menu mt-2 container mx-auto row";

        let optionList = [];

        this.state.options.forEach((option) => {
            optionList.push(
                <option key={option.name} value={option.value}>{option.name}</option>
            )
        })

        if (this.props.showProject !== false) {
            return (
                <div className={cssClass}>
                    <p className="cursor-hover col-4" onClick={this.returnToProjectIndex}>
                        <FontAwesomeIcon icon={faArrowLeft}/> Back to project list
                    </p>
                    <h3 className="text-center col-4">
                        {this.props.projectTitle}
                    </h3>
                    <div className="col-4 d-flex justify-content-around">


                        <h4>Filter by :</h4>
                        <select id="task-filter-value" onChange={this.handleValueChange}
                                value={this.state.optionSelected}>
                            {optionList}
                        </select>
                        <select id="task-filter-order" onChange={this.handleOrderChange} value={this.state.order}>
                            <option key="asc" value="asc">Asc</option>
                            <option key="desc" value="desc">Desc</option>
                        </select>

                    </div>
                </div>
            );
        } else {
            return (
                <div className={cssClass}>
                    <p>Project Home</p>
                </div>
            )
        }

    }

}

export default Menu;
