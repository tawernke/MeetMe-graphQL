import React, {Component} from 'react'

const display = {
    display: 'block'
};
const hide = {
    display: 'none'
};

class TaskView extends Component {
    //Responsible for rendering contents of the modal window
    render(){
        return(
            !this.props.taskDetail[0] ? false : (
            <div id="myModal" className="modal" style={this.props.modal ? display : hide}>
                <div className="modal-content">
                    <button className="btnClose material-icons" onClick={() => this.props.toggleModal(this.props.taskDetail[0].id)}>close</button>
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Description</th>
                                <th scope="col">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="task-title">{this.props.taskDetail[0].id}</td>
                                <td className="task-title">{this.props.taskDetail[0].description}</td>
                                <td className="task-title">{this.props.taskDetail[0].status}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div className='btnContainer'>
                         <button className="btnActive" style={this.props.taskDetail[0].status === 'done' ? display : hide} onClick={() => this.props.updateTask(this.props.taskDetail[0].id, 'active')}>Active</button>
                        <button className="btnDone" style={this.props.taskDetail[0].status === 'done' ? hide : display} onClick={() => this.props.updateTask(this.props.taskDetail[0].id, 'done')}>Done</button>
                        <button className="btnDelete" onClick={() => this.props.deleteTask(this.props.taskDetail[0].id)}>DELETE</button>
                    </div>    
                </div>
            </div>)
        )
    }      
}

export default TaskView