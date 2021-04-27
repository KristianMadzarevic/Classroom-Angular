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
afterAssign:boolean = false;
students:Student[] = STUDENTS;
numberOfStudents:number = STUDENTS.length;
assignedStudents:string[][] = [['']];
selectedRows:number[] = [0];
issue:string = '';

public setClassroomInfo(row:number,col:number,value:string,allSelectedRows:number[], afterAssign:boolean){
  this.numberOfRows = row;
  this.numberOfColumns = col;
  this.valueInClassroom = value;
  this.selectedRows = allSelectedRows;
  this.afterAssign = afterAssign;
}
public getClassroomInfo():Classroom{
  let aclassroom:Classroom = {
    row:this.numberOfRows,
    column:this.numberOfColumns,
    value:this.valueInClassroom,
    afterAssign:this.afterAssign
  };
  return aclassroom;
  }
public assignAllStudents(){
  for(let i=0;i<STUDENTS.length;i++){
    STUDENTS[i].toAssign = true;
  }
}
public assignStudents():string{
  this.checkValues();
  let studentsToAdd:Student[] = [];
  for(let i=0; i<STUDENTS.length; i++){
    if(STUDENTS[i].toAssign){
      studentsToAdd.push(STUDENTS[i]);
    }
  }
  for(let i=0; i<=this.numberOfRows;i++){
    this.assignedStudents[i] = [''];
    this.assignedStudents[i+1] = [''];
    for(let j=0; j<this.numberOfColumns;j++){
      /* assign students to the assigned arrays */
      if(studentsToAdd[0] !== undefined && this.selectedRows.includes(i)){
        this.assignedStudents[i][j] = studentsToAdd[0].name + ' ' + studentsToAdd[0].surname + '<br>' + studentsToAdd[0].id;
        for(let k=0;k<STUDENTS.length;k++){// assigns the coordinate values to students
          if(STUDENTS[k].id === studentsToAdd[0].id){
            STUDENTS[k].position = 'C'+ (j+1) + ':' + i;
            STUDENTS[k].assigned = true;
            break;
          }
          /* in for loop, not being assigned */
          
        }
        studentsToAdd.shift();
      }
      for(let k=0;k<STUDENTS.length;k++){
        if(!STUDENTS[k].assigned){
          STUDENTS[k].position = 'None';
          if(STUDENTS[k].toAssign){
            STUDENTS[k].position = 'Waiting';
          }
        }
        if(!STUDENTS[k].toAssign){
          STUDENTS[k].position = 'None';
          STUDENTS[k].assigned = false;
        }
      }
    }
  }
  return this.issue;
}
public unassignStudents(rowToUnassign:number){
  for(let i=0; i<STUDENTS.length;i++){
    if(STUDENTS[i].position.includes(':' + rowToUnassign) || !this.selectedRows.includes(parseInt(STUDENTS[i].position.substring(STUDENTS[i].position.indexOf(':')+1,STUDENTS[i].position.length)) )){
      /* If the student is from that row */
      STUDENTS[i].assigned = false;
      STUDENTS[i].toAssign = false;
    }
  }
}
public resetStudentPositions(){
  for(let k=0;k<STUDENTS.length;k++){
    STUDENTS[k].position = 'None';
    STUDENTS[k].assigned = false;
    STUDENTS[k].toAssign = false;
  }
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
