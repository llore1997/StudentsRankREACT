import {context} from './context.js'; //Singleton
import {getIdFromURL,setCookie} from './lib/utils.js';
import {logout} from './menu.js';
import AttitudeTask from './classes/attitudetask.js';
import GradedTask from './classes/gradedtask.js';
import Person from './classes/person.js';
import Settings from './classes/settings.js';
import {saveStudents} from './dataservice.js';
import GradedTaskPage from './components/gradedTaskPage.js';
import RankingListPage from './components/rankingListPage.js';
import PersonPage from './components/personPage.js';
import React from 'react';
import reactDOM from 'react-dom';
import {events} from './lib/eventsPubSubs.js';
import $ from "jquery";

let settings;
events.subscribe('settings/change',(obj) => {
  settings = obj;
});
/** Primitive routing mechanism based on detecting clicks on links and get the URL */
function initRouter() {
  
  window.onclick = function(e) {
        e = e || event;
        var isLink = findParent('a',e.target || e.srcElement);
        if (isLink) {
          
          switch (true) {
            /** View Student information detail */
            case /#student/.test(isLink.href):
              reactDOM.unmountComponentAtNode(document.getElementById('content')); //umount react component
              let personInstance = Person.getPersonById(getIdFromURL(isLink.href));
              personInstance.getHTMLDetail();
              break;
            /** Modify student information */
            case /#editStudent/.test(isLink.href):
              reactDOM.unmountComponentAtNode(document.getElementById('content')); //umount react component
              personInstance = Person.getPersonById(getIdFromURL(isLink.href));
              reactDOM.render(<PersonPage student={{personInstance}} />, document.getElementById('content'));
              //personInstance.getHTMLEdit();
              break;
            /** Delete student with confirmation */
            case /#deleteStudent/.test(isLink.href):
              if (window.confirm('Are you sure?')) {
                Person.deleteById(parseInt(getIdFromURL(isLink.href)));
                //context.students.delete(parseInt(getIdFromURL(isLink.href)));
                //saveStudents(JSON.stringify([...context.students]));
                context.getTemplateRanking(true);
              }
              break;
            /** Delete Xp associated to a person */
            case /#deleteXP/.test(isLink.href):
              if (window.confirm('Are you sure?')) {
                var reg = /\/{1}([0-9,-]+)\//;
                var matchResults = isLink.href.match(reg);
                personInstance = Person.getPersonById(matchResults[1]);
                personInstance.deleteXP(parseInt(getIdFromURL(isLink.href)));
                personInstance.getHTMLDetail();
              }
              break;
            /** Show popup associated to an student in order to assign XP points  */
            case /#addXP/.test(isLink.href):
              personInstance = Person.getPersonById(getIdFromURL(isLink.href));
              AttitudeTask.addXP(personInstance);
              break;
            /** Add new student form */
            case /#addStudent/.test(isLink.href):
              //debugger;
              reactDOM.unmountComponentAtNode(document.getElementById('content')); //umount react component
              reactDOM.render(<PersonPage student={{}} />, document.getElementById('content'));
             
              //Person.addPerson();
              break;
            case /#settings/.test(isLink.href):
              //context.getSettings();
              reactDOM.unmountComponentAtNode(document.getElementById('content')); //umount react component
              Settings.getSettings();
              break;
            /** logout */
            case /#logout/.test(isLink.href):
              logout();
              break;
            /** Add new Graded Task form */
            case /#addGradedTask/.test(isLink.href):
              reactDOM.unmountComponentAtNode(document.getElementById('content')); //umount react component
              // GradedTask.addGradedTask();
              //reactDOM.render(<GradedTaskPage gtInstance={{}} terms={Settings.getTerms()} />, document.getElementById('content')); 		          
              //(100 - GradedTask.getGradedTasksTotalWeight()
              reactDOM.render(<GradedTaskPage props={{term:settings.defaultTerm}} allowedWeight={(100 - GradedTask.getGradedTasksTotalWeight())} />, document.getElementById('content'));
             
              break;
            case /#detailGradedTask/.test(isLink.href):
              reactDOM.unmountComponentAtNode(document.getElementById('content')); //umount react component
              let gtInstance = GradedTask.getGradedTaskById(getIdFromURL(isLink.href));	    
                
              reactDOM.render(<GradedTaskPage props={gtInstance} allowedWeight={(100 - GradedTask.getGradedTasksTotalWeight() + parseInt(gtInstance.weight))} />, document.getElementById('content'));
             	
              /*reactDOM.render(<GradedTaskPage gtInstance={gtInstance} terms={Settings.getTerms()} />, document.getElementById('content'));*/
              //gtInstance.getHTMLEdit();
              break;
            /*case /#reactTest/.test(isLink.href):                         
              reactDOM.unmountComponentAtNode(document.getElementById('content')); //umount react component
              reactDOM.render(<RankingListPage gtWeight={Settings.getGtWeight()} xpWeight={Settings.getXpWeight()} students= {Person.getStudentsFromMap()}/>, document.getElementById('content'));
              //reactDOM.render(<RankingListItemPage student={{id:'-1420523329',profileURL:'fjakfja',name:'Paco',surnames:'El MAco',fg:78,xp:23,gt:56}} />, document.getElementById('content'));
              break;*/
            default:
              //debugger;
              context.isLogged();
          }
        }
    };
}

/** find first parent with tagName [tagname] so nested links <a> are triggered too */
function findParent(tagname,el) {
  while (el) {
    if ((el.nodeName || el.tagName).toLowerCase() === tagname.toLowerCase()) {
      return el;
    }
    el = el.parentNode;
  }
  return null;
}

export {initRouter};
