import React from 'react';

class GradedTaskPage extends React.component {
    constructor(props){
        super(props);
        this.state = {
            taskName: '',
            taskDescription:''
        }
    }
    render(){
        return (
            <h3>Add new Graded Task REACT COMPONENT</h3>
            We understand as a graded task any test or practice that will be marked by teacher and should be reflected in the final mark.

            <form id="newGradedTask">
            <div class="form-group">   
                <label for="name">Task name:</label>
                <input type="text" class="form-control" id="idTaskName" name="taskname" value="" required>  
            </div>
            
            <div class="form-group">   
                <label for="description">Task description:</label>
                <textarea rows="4" cols="50" class="form-control" id="idTaskDescription" name="taskdescription" value=""></textarea>
            </div>
            <div class="form-group">   
                <label for="term">Task term:</label>
                <select id="termTask">
                    ${scope.TPL_TERMS}
                </select>
                </div>

            <div class="form-group">   
                <label id="labelWeight" for="weight">Task Weight (0-100 %):</label>
                <input type="number" class="form-control" min="1" max ="100" id="idTaskWeight" name="taskweight" value="" required>
            </div>
            <input type="submit" class="btn btn-primary" value="Save">
            </form> 

            <table id="listStudentsGrade">    
            
            </table>

        );
    }
}


export default GradedTaskPage;