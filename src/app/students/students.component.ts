import { Component, NgModule, OnInit } from '@angular/core';
import { Student } from './Student';
import { STUDENTS } from './student-list'

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit{

  nameInput:string = '';
  surnameInput:string = '';
  idInput:number = 0;
  numbers:string = '0123456789';
  letters:string='qwertzuiopšđasdfghjklčćžyxcvbnmQWERTZUIOPŠĐASDFGHJKLČĆŽYXCVBNM BackspaceEscapeTab';
  students:Student[] = STUDENTS;
  isVisible:boolean = false;
  issue:string = '';
  modifySwitch:boolean = false;
  modifyID:number =  0;
  addFinish:string = 'Add';
  
  constructor() { }
  
  ngOnInit() {
  }
  addClicked(){
    /* changes the button text */
    if(this.addFinish == 'Finish'){
      this.addFinish = 'Add';
      this.finishModifying();
      return;
    }
    /* adds a student if he has unique ID, and all parameters input. */
    for(let i=0;i<this.students.length;i++){
      if(this.students[i].id == this.idInput){
        this.issue='You are trying to add a student with already allocated ID!';
        this.showAlert();
        return;
      }
    }
    if(this.nameInput == '' || this.surnameInput == '' || this.idInput == 0){
      this.issue = 'You are trying to add a student with no name, surname or ID!';
      this.showAlert();
      return;
    }
    let tempStudent:Student = {name:this.nameInput,surname:this.surnameInput,id:this.idInput}
    this.students.push(tempStudent);
  }
  deleteClicked(i:any){
    /* delete the student clicked */
    this.students.splice(i,1);
  }
  modifyClicked(i:any){
    this.addFinish = 'Finish';
    /* Select a student for modificating */
    this.nameInput= this.students[i].name;
    this.surnameInput= this.students[i].surname;
    this.idInput= this.students[i].id;
    this.modifySwitch = true;
    this.modifyID = i;
    console.log(i);
  }
  inputChange(e:string){
    /* on changing the fields, if modifying, update the student that's being modified */
    if(this.modifySwitch == true){
      let indexOfStudentInArray:number =0;
      for(let stud of this.students){//that's the student we're changing
        if (this.students.indexOf(stud) === this.modifyID){
          for(let otherStud of this.students){
            if(otherStud.id == this.idInput && otherStud != stud){
              this.issue = 'Another student already has this ID, please select a different ID.';
              this.showAlert();
              return;
            }
          }
          indexOfStudentInArray = this.students.indexOf(stud);
          this.students[indexOfStudentInArray].name = this.nameInput;
          this.students[indexOfStudentInArray].surname = this.surnameInput;
          this.students[indexOfStudentInArray].id = this.idInput;
        }
      }
      /* this.students[this.students.indexOf(this.modifyID)] */
    }
  }
  finishModifying(){
    /* when the user is done modifying, switch to adding users mode. */
    this.modifySwitch = false;
    this.nameInput = '';
    this.surnameInput = '';
    this.idInput = 0;
  }
  checkMode(){
    return this.modifySwitch;
  }
  showAlert(){
    /* hide the alert after 2s */
    if (this.isVisible) {return;} 
    this.isVisible = true;
    setTimeout(()=> this.isVisible = false,2000);
  }
  idKeyPressed(e:any){
    /* prevent certain keys from being pressed in the ID */
    if(this.numbers.includes(e.key) != true && e.key != 'Backspace' && e.key != 'Escape' && e.key != 'Tab'){
      e.preventDefault();
    }
  }
  nameSurnameKeyPressed(e:any){
    /* prevent certain keys from being pressed in the name and surname */
    if(this.letters.includes(e.key) != true){
      e.preventDefault();
    }
  }
}
