import {loadTemplate} from './lib/utils.js';
import {context} from './context.js'; //Singleton
import Person from './classes/person.js';
import GradedTask from './classes/gradedtask.js';
import AttitudeTask from './classes/attitudetask.js';
import Settings from './classes/settings.js';

/** Get students and grades from server and maintains a local copy in localstorage */
function updateFromServer() {
  if (context.user.id) {
    loadTemplate('api/getAttitudeTasks',function(response) {
                          loadAttitudeTasks(response);
                        },'GET','',false);

    loadTemplate('api/getStudents',function(response) {
                          loadStudents(response);
                          context.getTemplateRanking();
                        },'GET','',false);

    loadTemplate('api/getGradedTasks',function(response) {
                          loadGradedTasks(response);
                          context.getTemplateRanking();
                        },'GET','',false);
    loadTemplate('api/getSettings',function(response) {
                          loadSettings(response);
                          //context.getTemplateRanking();
                        },'GET','',false);
  }
}
/** Save students in server side */
function saveStudents(arrayStudents) {
  loadTemplate('api/saveStudents',function(response) {
                          console.log('SAVE STUDENTS ' + response);
                      },'POST',arrayStudents,false);

}
/** Save grades in server side */
function saveGradedTasks(arrayGT) {
  loadTemplate('api/saveGradedTasks',function(response) {
                          console.log('SAVE GRADED TASKS ' + response);
                        },'POST',arrayGT,false);
}

/** Save Attitude XP points in server side */
function saveAttitudeTasks(arrayAT) {
  loadTemplate('api/saveAttitudeTasks',function(response) {
                          console.log('SAVE ATTITUDE TASKS ' + response);
                        },'POST',arrayAT,false);
}
/** Save settings in server side */
function saveSettings(settingsJSON) {
  loadTemplate('api/saveSettings',function(response) {
                          console.log('SAVE SETTINGS ' + response);
                        },'POST',settingsJSON,false);
}

/** Load students from AJAX response and map to Person instances in context */
function loadStudents(studentsStr) {
  let students_ = new Map(JSON.parse(studentsStr));
  students_.forEach(function(value_,key_,students_) {
      students_.set(key_,new Person(value_.name,value_.surname,
          value_.attitudeTasks,value_.id));
    });
  context.students = students_;
}

/** Load graded tasks from AJAX response and map to GradedTasks instances in context */
function loadGradedTasks(gradedTasksStr) {
  let gradedTasks_ = new Map(JSON.parse(gradedTasksStr));
  gradedTasks_.forEach(function(value_,key_,gradedTasks_) {
      gradedTasks_.set(key_,new GradedTask(value_.name,value_.description,value_.weight,
          value_.studentsMark,value_.id));
    });
  context.gradedTasks = gradedTasks_;
}

/** Load attitude tasks (XP) from AJAX response and map to attitudeTasks instances in context */
function loadAttitudeTasks(attitudeTasksStr) {
  let attitudeTasks_ = new Map(JSON.parse(attitudeTasksStr));
  attitudeTasks_.forEach(function(value_,key_,attitudeTasks_) {
      attitudeTasks_.set(key_,new AttitudeTask(value_.name,value_.description,value_.points,
        value_.hits,value_.id));
    });
  context.attitudeTasks = attitudeTasks_;
}

/** Load setting from AJAX response and map to settings in context */
function loadSettings(settingsStr) {
  let settings_ = JSON.parse(settingsStr);
  context.settings = new Settings(settings_.weightXP,settings_.weightGT,settings_.defaultTerm,settings_.terms);
}

export {updateFromServer,saveStudents,saveGradedTasks,saveAttitudeTasks};