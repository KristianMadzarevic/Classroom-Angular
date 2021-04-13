import { Injectable } from '@angular/core';
import { Classroom } from './Classroom';
import { Student } from './students/Student';
import { STUDENTS } from './students/student-list';


@Injectable({
  providedIn: 'root'
})
export class AssignerService {

numberOfRows:number = 9;
numberOfColumns:number = 7;
valueInClassroom:string = '';
students:Student[] = STUDENTS;
numberOfStudents:number = STUDENTS.length;
assignedStudents:string[][]= [['']];
selectedRows:number[]=[0];
issue:string ='';

public setClassroomInfo(row:number,col:number,value:string){
  this.numberOfRows = row;
  this.numberOfColumns = col;
  this.valueInClassroom = value;
}
public getClassroomInfo():Classroom{
  let aclassroom:Classroom = {
    row:this.numberOfRows,
    column:this.numberOfColumns,
    value:this.valueInClassroom
  };
  return aclassroom;
  }
public assignStudents():string{
  this.checkValues();
  let studentsToAdd:Student[] = this.students.slice();
  for(let i=0; i<this.numberOfRows;i++){
    this.assignedStudents[i] = [''];
    this.assignedStudents[i+1] = [''];
    for(let j=0; j<this.numberOfColumns;j++){
      /* assign students to the assigned arrays */
      if(studentsToAdd[0] !== undefined && this.selectedRows.includes(i)){
        this.assignedStudents[i][j] = studentsToAdd[0].name + ' ' + studentsToAdd[0].surname + '<br>' + studentsToAdd[0].id;
        studentsToAdd.shift();
      }
    }
  }
  return this.issue;
}
public checkValues(){
  /* checks if some data is input and if there are enough tables for every student. */
  if(this.selectedRows.length == 0){/* displays a string if there aren't any rows selected */
    this.issue = 'You have to select some rows first. Try clicking them or writing to the Select Rows';
    return;
  }
  if(this.students.length > (this.selectedRows.length*this.numberOfColumns) && this.selectedRows.length != 0){/* display a message if there is too many students to assign */
    this.issue = 'There are some students left that are not assigned!';
    return;
  }
  this.issue='';
}
constructor() { }

}
