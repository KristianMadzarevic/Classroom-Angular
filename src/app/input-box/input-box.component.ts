import { Component, OnInit, Input, Output, EventEmitter,  ChangeDetectorRef} from '@angular/core';

@Component({
  selector: 'app-input-box',
  templateUrl: './input-box.component.html',
  styleUrls: ['./input-box.component.css'],
})
export class InputBoxComponent implements OnInit {
  @Input() row = 9;//number of rows
  @Input() column = 7;//number of columns
  @Input() value:string = '';//value input by parent and shown in input field
  rows: number[] = [];//container of rows
  columns: number[] = [];//container of columns
  numbers:string = '123456789';
  buttons:string = '0123456789,-';
  specials:string = ',-';
  stateOfInput:string[] = [];//value split by ','and sorted
  allSelectedRows:number[] = [];
  @Output() valueEvent = new EventEmitter<string>();//child -> parent
  isVisible:boolean = false;//trigger of a message as an alert
  issue:string = '';//the alert message
  
  constructor(private cd:ChangeDetectorRef) {}

  sendValueToParent(){
    /*child -> parent */
    this.valueEvent.emit(this.value);
  }
  ngAfterViewInit(){
    /* detects changes after initialisation, possibly input by parent */
    this.cd.detectChanges();
  }
  ngOnInit(): void {
    this.rowChange(this.row);
    this.columnChange(this.column);
    this.selectChange(this.value,true);
  }
  rowChange(e: number) {
    /* create some rows */
    this.rows=[];
    this.row = e;
    for (let i = 0; i < this.row; i++) {
      this.rows.push(i);
    }
  }
  columnChange(e: number) {
    /* create some columns */
    this.columns=[];
    this.column = e;
    for (let i = 0; i < this.column; i++) {
      this.columns.push(i);
    }
  }
  keyDown(e: any) {
    /* disable input of some obviously wrong strings */
    let prev:string = this.value[this.value.length-1];
    /* if its not a button we can press */
    if(this.buttons.includes(e.key) == false && e.key != 'Backspace' && e.key != 'Escape'){
        this.issue='You are trying to press a button that is not supported!';
        this.showAlert();
        e.preventDefault();
        return;
      }
    /* if its the first thing we input */
    if(this.value.length == 0 && this.specials.includes(e.key)){
      this.issue='Please input numbers first!';
      this.showAlert();
      e.preventDefault();
      return;
    }
    /* if we try adding ,- after ,- */
    if((prev == ',' || prev == '-') && (e.key == ',' || e.key == '-')){
      this.issue='You cannot add , or - after , or -';
      this.showAlert();
      e.preventDefault();
      return;
    }
    /* if we try adding another - after we already input a range */
    if(this.value.lastIndexOf('-') != -1 && (this.value.lastIndexOf(',') < this.value.lastIndexOf('-')) && e.key == '-'){
      this.issue='Please insert only one - in a range!';
      this.showAlert();
      e.preventDefault();
      return;
    }
    /* if we try adding an already existing number, check if the last number we're trying to add is already in the allSelectedRows and don't let the user add a ',' to complete a false number. */
    if(e.key == ',' && this.stateOfInput.slice(0,this.stateOfInput.length-1).includes(this.value.substring(this.value.lastIndexOf(',')+1,this.value.length))){
      this.issue='You are trying to add an already existing number!';
      this.showAlert();
      e.preventDefault();
      return;
    }
    /* if the end of a range is smaller than the start */
    if(this.stateOfInput.length > 0){
      if(this.stateOfInput[this.stateOfInput.length-1].includes('-') 
        && parseInt(this.stateOfInput[this.stateOfInput.length-1].substring(0,this.stateOfInput[this.stateOfInput.length-1].indexOf('-'))) 
        > parseInt(this.stateOfInput[this.stateOfInput.length-1].substring(this.stateOfInput[this.stateOfInput.length-1].indexOf('-')+1,this.stateOfInput[this.stateOfInput.length-1].length))){
        this.issue='The end of a range must be bigger than the start!';
        this.showAlert();
        return;
      }
    }
  }
  selectChange(e: string,fromParent:boolean) {
    /* handles a received change of input field */
    this.removeUnwantedKeys();
    this.stateOfInput = this.value.split(',');
    this.removeBadStrings();
    this.refill();
    this.allSelectedRows.sort();
    if(fromParent){
      this.lostFocus();
    }
    this.sendValueToParent();//child -> parent
  }
  removeUnwantedKeys(){
    /* remove everything except numbers and ,- */
    let tempValue = this.value.slice();
    for(let i=0;i<tempValue.length;i++){
      if ((this.numbers.includes(tempValue[i]) != true && this.specials.includes(tempValue[i]) != true)){
        tempValue= tempValue.substring(0,i)+tempValue.substring(i+1,tempValue.length);
        i--;
      }
    }
    this.value=tempValue;
  }
  removeBadStrings(){
    /* remove inputs that start or end with '-' */
    let tempInput= this.stateOfInput.slice();
    for(let i=0;i<tempInput.length;i++){
      while(typeof this.stateOfInput[0] !== 'undefined' && (this.stateOfInput[i][0] == '-' || this.stateOfInput[i][this.stateOfInput[i].length-1] == '-' )){
        this.stateOfInput[i] = this.stateOfInput[i].substring(1,this.value.length);
      }
    }
  }
  refill(){
    /* adds numbers from stateOfInput to allSelectedRows, for highlighting. Only allow adding new numbers, not duplicates.*/
    this.allSelectedRows = [];
    for( let oneInput of this.stateOfInput){
      if(oneInput != ''){
        this.adder(oneInput);
      }
    }
  }
  adder(oneInput:string){
    /* adds an input to allSelectedRows, be it a range or one number. */
    /* if allSelectedRows already contains that number, it will not add him or that range. */
    if(oneInput.includes('-') && oneInput.indexOf('-') != oneInput.length-1){
      let smaller = parseInt(oneInput.substring(0,oneInput.indexOf('-')));
      let bigger = parseInt(oneInput.substring(oneInput.indexOf('-')+1,oneInput.length));
      if(smaller >= bigger) {
        this.issue='Second number in a range must be bigger then the first number in that range!';
        this.showAlert();
        this.subtractRange(smaller,false);
        return;
      }
      for(let i = smaller; i <= bigger; i++){
        if(this.allSelectedRows.includes(i)){
          this.issue='One of the numbers in this range is already selected. Please specify a different range!';
          this.stateOfInput[this.stateOfInput.indexOf(oneInput)] = '';
          this.showAlert();
          return;
        }// do not add any numbers if any of the numbers selected by range are already contained in allSelectedRows
      }
      for(let i = smaller; i <= bigger; i++){
        this.allSelectedRows.push(i);
      }
      return;
    }
    /* if it's just a number */
    if(this.allSelectedRows.includes(parseInt(oneInput))){
      this.issue='This number is already selected. Please select a different number!';
      this.stateOfInput[this.stateOfInput.indexOf(oneInput)] = '';
      this.showAlert();
      return;
    }
    this.allSelectedRows.push(parseInt(oneInput));
  }
  lostFocus(){
    /* All the sorting and filtering that needs to be done after the change is final (blur) */
    this.checkForDuplicates();
    this.checkNumberOfRows();
    let stateOfInputNumbers:number[] = [];
    for(let i=0; i<this.stateOfInput.length;i++){
      stateOfInputNumbers.push(parseInt(this.stateOfInput[i]));
    }
    stateOfInputNumbers.sort(function (a, b){ return a-b;});
    this.numbersToString(stateOfInputNumbers);
    this.checkForDuplicates();
    this.fillInPretty(true);
    this.sendValueToParent();
  }
  fillInPretty(fillInLast:boolean) {
    /* Add inputs from stateOfInput nicely into value. */
    this.value = '';
    for(let i = 0; i < this.stateOfInput.length; i++){
      this.value += this.stateOfInput[i];
      if(i != this.stateOfInput.length-1){
        this.value += ',';
      }
    }
  }
  checkIsRowSelected(i:any) {
    /* return true if a certain row is selected, for highlighting */
    i++;
    return this.allSelectedRows.includes(i);
  }
  rowClicked(i:any){
    /* when a row is clicked, if it's a new row, add it. if it's already added, remove it. */
    if(this.allSelectedRows.includes(i) == false){
      this.stateOfInput.push(String(i));
      this.refill();
      this.lostFocus();
      return;
    }
    /* if it's a number, just substract it from stateOfInput*/
    if(this.stateOfInput.includes(String(i))){
      this.stateOfInput.splice(this.stateOfInput.indexOf(String(i)),1);
      this.refill();
      this.lostFocus();
      return;
    }
    /* range substraction here */
    this.subtractRange(i,true);
    this.refill();
    this.lostFocus();
  }
  subtractRange(i:any,addRest:boolean){
    /* removes a range containing number i from stateOfInput */
    let pointsOfRange:number[] = this.findPoints(i);
    let range:string = pointsOfRange[0] + '-' + pointsOfRange[1];
    this.stateOfInput.splice(this.stateOfInput.indexOf(range),1);//delete that range
    if(addRest){//add the other numbers from that range if addRest is true
      for(let j=pointsOfRange[0];j<=pointsOfRange[1];j++){
        if(j != i){
          this.stateOfInput.push(String(j));
        }
      }
    }
  }
  findPoints(i:number):number[]{
    /* returns numbers of a certain range, smaller - bigger */
    for( let k=0;k<this.stateOfInput.length;k++){
      if(this.stateOfInput[k].includes('-')){
        let smaller = parseInt(this.stateOfInput[k].substring(0,this.stateOfInput[k].indexOf('-')));
        let bigger = parseInt(this.stateOfInput[k].substring(this.stateOfInput[k].indexOf('-')+1,this.stateOfInput[k].length));
        if((smaller <= i && bigger >i) || i == bigger){
          return [smaller,bigger];
        }
      }
    }
    return [0,0];
  }
  checkForDuplicates(){
    /* filter for duplicates in stateOfInput */
    for(let i=0;i<this.stateOfInput.length;i++){
      for(let j=i+1;j<=this.stateOfInput.length;j++){
        if(this.stateOfInput[i] != '' && this.stateOfInput[i] == this.stateOfInput[j]){
          this.stateOfInput[j] = '';
        }
      }
    }
    /* filters for empty strings, sorts and puts the new sorted array on display */
    this.stateOfInput = this.stateOfInput.filter(v => v!='');
  }
  checkNumberOfRows(){
    /* delete inputs that are trying to add rows bigger than the max row number */
    for( let k in this.stateOfInput){
      if(this.stateOfInput[k].includes('-')){//range
        let bigger = parseInt(this.stateOfInput[k].substring(this.stateOfInput[k].indexOf('-')+1,this.stateOfInput[k].length));
        if(bigger > this.row){
          this.subtractRange(bigger,false);
        }
      }

      if(parseInt(this.stateOfInput[k]) > this.row){//number
        this.stateOfInput.splice(this.stateOfInput.indexOf(String(k)),1);
      }
    }
  }
  numbersToString(nums: number[]) {
    /* takes numbers from nums and matches them with stateOfInput strings, and if they match, sorts stateOfInput accordingly */
    let tempStrings = this.stateOfInput.slice();
    for(let i=0;i<nums.length;i++){
      for(let j=0;j<nums.length;j++){
        if(nums[i]==parseInt(tempStrings[j])){
          this.stateOfInput[i]=tempStrings[j];
          break;
        }
      }
    }
  }
  showAlert(){
    /* hide the alert after 2s */
    if (this.isVisible) {return;} 
    this.isVisible = true;
    setTimeout(()=> this.isVisible = false,2000);
  }
}