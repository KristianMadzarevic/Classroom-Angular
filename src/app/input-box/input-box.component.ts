import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-input-box',
  templateUrl: './input-box.component.html',
  styleUrls: ['./input-box.component.css']
})
export class InputBoxComponent implements OnInit {
  public row = 9;
  public rows: number[] = [];
  public column = 7;
  public columns: number[] = [];

  public selected:string='';
  public stateOfInput:string = '';
  public numbers:string = '123456789'
  public smallerInRange = 0;
  public biggerInRange = 0;
  public listOfSelectedRows:string = '';
  public isInRange:boolean = false;

  constructor() {}

  ngOnInit(): void {
    this.rowChange(this.row);
    this.columnChange(this.column);
  }
  public rowChange(e: number) {
    this.rows=[];
    this.row = e;
    for (let i = 0; i < this.row; i++) {
      this.rows.push(i);
    }
  }
  public columnChange(e: number) {
    this.columns=[];
    this.column = e;
    for (let i = 0; i < this.column; i++) {
      this.columns.push(i);
    }
  }
  public selectChange(e: string) {
    this.stateOfInput=e;
  }
  public test(e: any) {
    this.isInRange=false;
    if(this.numbers.includes(e.key) == false 
      && e.key !== ',' && e.key !== 'Backspace' && e.key !== '-' 
      || this.listOfSelectedRows.includes(e.key) 
      || (e.key == this.stateOfInput[this.stateOfInput.length-1] && e.key != 'Backspace') 
      || (this.stateOfInput.length == 0 && this.numbers.includes(e.key) == false)
      /*upon deleting, if the last char is , or - then the user cannot input another , or - */
      || ((this.stateOfInput[this.stateOfInput.length-1] == ',' || this.stateOfInput[this.stateOfInput.length-1] == '-') && (e.key == ',' || e.key == '-'))
      /*if the last char was a number, this next one can't be a number*/
      || (this.numbers.includes(this.stateOfInput[this.stateOfInput.length-1]) && this.numbers.includes(e.key))
      /*if the last char was 9, this next one can't be '-'*/
      || (this.stateOfInput[this.stateOfInput.length-1] == '9' && e.key == '-')
      /* if that is a range, the second number must be larger */
      || (this.numbers.includes(this.stateOfInput[this.stateOfInput.length-2]) && this.stateOfInput[this.stateOfInput.length-1] == '-' && this.numbers.includes(e.key) && e.key <= parseInt(this.stateOfInput[this.stateOfInput.length-2])))
    {
      e.preventDefault();
    }else {
      /* if the range is trying to add an already existing row, don't allow input of that range */
      if(this.numbers.includes(this.stateOfInput[this.stateOfInput.length-2]) && this.stateOfInput[this.stateOfInput.length-1] == '-' && this.numbers.includes(e.key)){
        let first = parseInt(this.stateOfInput[this.stateOfInput.length-2])+1;
        let second = e.key;
        for(let i:number=first;i<second;i++){
          if(this.listOfSelectedRows.includes(String(i)) == true){
            e.preventDefault();
            this.isInRange = true;
            break;
          }
        }
      }
      if(this.isInRange == false) {
        if(this.numbers.includes(this.stateOfInput[this.stateOfInput.length-2]) && this.stateOfInput[this.stateOfInput.length-1] == '-' && this.numbers.includes(e.key)){
          this.smallerInRange = parseInt(this.stateOfInput[this.stateOfInput.length-2]);
          this.biggerInRange = e.key;
          this.adder(this.smallerInRange,this.biggerInRange);
          this.smallerInRange=0; 
          this.biggerInRange=0;
        }else if(this.numbers.includes(e.key) && this.listOfSelectedRows.includes(e.key) == false){
          this.listOfSelectedRows += e.key;
        }
      }
      if(e.key == 'Backspace'){
        this.refill();
      }
      this.sort();
    }
  }
  public adder(smaller:number, bigger:number){
    for(let i:number=smaller;i<=bigger;i++){
      if(this.listOfSelectedRows.includes(String(i)) == false){
        this.listOfSelectedRows += String(i);
      }
    }
  }
  public refill(){
    this.listOfSelectedRows='';
    for(let i=0;i<this.stateOfInput.length-1;i++){
      /* range, taking in consideration that stateOfInput deletes 1 button slower */
      if(i!=this.stateOfInput.length-3 && this.numbers.includes(this.stateOfInput[i]) && this.stateOfInput[i+1] == '-' && this.numbers.includes(this.stateOfInput[i+2])){
        console.log('it is a range');
        let first = parseInt(this.stateOfInput[i]);
        let second = parseInt(this.stateOfInput[i+2]);
        this.adder(first,second);
        first=0; 
        second=0;
      }
      /* number, not being range */
      if(this.numbers.includes(this.stateOfInput[i]) && this.stateOfInput[i+1] != '-' && this.stateOfInput[i-1] != '-'){
        this.listOfSelectedRows += String(this.stateOfInput[i]);
      }
    }
  }
  public sort(){

  }


  public checkIsRowSelected(i: number) {
/* highlight selected wors */
    return true;
  }
  public rowClicked(i: number){
/* add the row if it's not already added, and call the checkisrowselected to highlight it*/
  }

/* onblur makes a list and we have to push that list to the input field's string.This will also have to work in rowClicked*/

}
