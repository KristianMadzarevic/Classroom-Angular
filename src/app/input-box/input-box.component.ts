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

  public selected:string = '';
  public stateOfInput:string = '';
  public numbers:string = '123456789'
  public smallerInRange = 0;
  public biggerInRange = 0;
  public listOfSelectedRows:string = '';
  public isInRange:boolean = false;

  public splitStateOfInput:string[] = [];
  public sortedStateOfInput:string = '';
  public rangeContainer:string[] = [];

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
        }else {
          if(this.numbers.includes(e.key) && this.listOfSelectedRows.includes(e.key) == false){
            this.listOfSelectedRows += e.key;
            console.log('dodao se ');
          }
        }
      }
      if(e.key == 'Backspace'){
        this.refill();
      }
    }
  }
  public adder(smaller:number, bigger:number){
    let rangeKojiCemoDodati:string = '';
    for(let i:number=smaller;i<=bigger;i++){
      if( this.listOfSelectedRows.includes(String(i)) == false){
        this.listOfSelectedRows += String(i);
      }
      
      rangeKojiCemoDodati += String(i);
    }
    console.log('rangeKojiCemoDodati');
    console.log(rangeKojiCemoDodati);
    this.rangeContainer.push(rangeKojiCemoDodati);
    console.log('rangeContainer');
    console.log(this.rangeContainer);

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
  public lostFocus(){
    if(this.stateOfInput[0] == '-'){
      this.stateOfInput = '';
    }
    this.sortedStateOfInput='';
    this.splitStateOfInput = this.stateOfInput.split(',');
    let sortedStateOfInputArray:string[] = [];
    sortedStateOfInputArray = this.splitStateOfInput.sort();
    for(let i=0;i<sortedStateOfInputArray.length;i++){
      if(sortedStateOfInputArray[i] != ''){
        this.sortedStateOfInput += sortedStateOfInputArray[i];
        if(i != sortedStateOfInputArray.length-1){
          this.sortedStateOfInput += ','
        }
      }
    }
    
    console.log('sortedStateOfInput');
    console.log(this.sortedStateOfInput);
    console.log('stateOfInput');
    console.log(this.stateOfInput);
    this.stateOfInput = this.sortedStateOfInput;
    console.log('stateOfInput after its equaled with sortedStateOfInput');
    console.log(this.stateOfInput);
    console.log('listOfSelectedRows');
    console.log(this.listOfSelectedRows);
    for(let i=0;i<this.sortedStateOfInput.length;i++){
      if(this.numbers.includes(this.stateOfInput[i]) && this.listOfSelectedRows.includes(this.stateOfInput[i]) == false){
        this.listOfSelectedRows += this.stateOfInput[i];
      }
    }

  }
  
  public checkIsRowSelected(i:any) {
    /* highlight selected wors */
    i++;
    if(this.listOfSelectedRows.includes(i.toString())){
      return true;
    }else {
      return false;
    }
  }
  public rowClicked(i:any){
    console.log('clicked: ');
    console.log(i);
    /* if stateOfInput has something, add a ',' before a number */
    if(this.stateOfInput != '' && this.stateOfInput[this.stateOfInput.length] != ','){
      this.stateOfInput += ',';
    }
    if(this.listOfSelectedRows.includes(i.toString()) == false){
      this.stateOfInput += String(i) +',';
      this.lostFocus();
      this.listOfSelectedRows += String(i);
      console.log('listOfSelectedRows: ');
      console.log(this.listOfSelectedRows);
      console.log('stateOfInput: ');
      console.log(this.stateOfInput);
    }else{
      /* check if the number is a part of a range, so you could delete the '-' and the next number too 
      RIJESI BRISANJE TU A NE U DISSAS...
      NEVALJA TI BRISANJE!!!
      */
      /* first range */


      /* 
      obrise samo crticu, to popraviti!!!
 
      Ne zanoravi da treba iz rangeContainer obrisati taj string!


      za prvi u rangeu radi, ali za zadnji ne radi

      */
      if(this.stateOfInput.includes(String(i)) && this.stateOfInput[this.stateOfInput.indexOf(String(i))+1] == '-' && this.numbers.includes(this.stateOfInput[this.stateOfInput.indexOf(String(i))+2])) {
        let culprit:number =parseInt(this.stateOfInput[this.stateOfInput.indexOf(String(i))]);
        console.log('it was first in range so StateOfInput will remove a few chars : ' + this.stateOfInput);
        this.stateOfInput = this.removeCharFromString(culprit,this.stateOfInput);
        console.log('it was first in range so StateOfInput will remove a few chars : ' + this.stateOfInput);
        this.stateOfInput = this.removeCharFromString(culprit,this.stateOfInput);
        console.log('it was first in range so StateOfInput will remove a few chars : ' + this.stateOfInput);
        this.stateOfInput = this.removeCharFromString(culprit-1,this.stateOfInput);
        console.log('it was first in range so StateOfInput now looks : ' + this.stateOfInput);

      }else if(this.stateOfInput.includes(String(i)) && this.stateOfInput[this.stateOfInput.indexOf(String(i))-1] == '-' && this.numbers.includes(this.stateOfInput[this.stateOfInput.indexOf(String(i))-2])) {
        let culprit:number =parseInt(this.stateOfInput[this.stateOfInput.indexOf(String(i))]);
        console.log('it was last in range so StateOfInput will remove a few chars : ' + this.stateOfInput);
        this.stateOfInput = this.removeCharFromString(culprit,this.stateOfInput);
        this.stateOfInput = this.removeCharFromString(culprit-1,this.stateOfInput);
        this.stateOfInput = this.removeCharFromString(culprit-2,this.stateOfInput);
        console.log('it was last in range so StateOfInput now looks : ' + this.stateOfInput);
      }else {
        this.stateOfInput = this.stateOfInput.split(String(i)).join('');
      }
      /* remove ',' after the number if there is one. */
      if(this.stateOfInput[i+1] == ','){
        console.log('before removing a , it looks: ');
        console.log(this.stateOfInput);
        this.stateOfInput = this.removeCharFromString (i+1, this.stateOfInput);
        console.log('removed a , and now it looks: ');
        console.log(this.stateOfInput);
      }
      this.lostFocus();
      this.listOfSelectedRows= this.listOfSelectedRows.split(String(i)).join('');
      console.log('listOfSelectedRows: ');
      console.log(this.listOfSelectedRows);
      console.log('stateOfInput: ');
      console.log(this.stateOfInput);
      /* if the rangeContainer contains the row in any of it's strings, make it dissasemble that string and add other numbers from the range as singles to the stateOfInput. Sorte the stateOfInput. */
      for(let j=0;j<this.rangeContainer.length;j++){
        for( let k=0; k<this.rangeContainer[j].length;k++){
          if(parseInt(i) == parseInt(this.rangeContainer[j][k])) {
            this.dissasemble(this.rangeContainer[j], parseInt(i));
            /* Delete the combo from rangeContainer */
            this.rangeContainer[j] = ''
            /* 
            
            
            izbaci prazni string iz rangeContainer and you're probably golden!!
            
            
            
            */
            console.log(this.rangeContainer);
          }
        }
        
      }
    }
  }
  public dissasemble(stringToDissasemble:string, culpritNumber:number){

  for(let i=0;i<stringToDissasemble.length;i++){
    if(parseInt(stringToDissasemble[i]) != culpritNumber){
      console.log("Ovaj bi se dodao " + parseInt(stringToDissasemble[i]));
      this.stateOfInput += stringToDissasemble[i];
      this.stateOfInput += ',';
      
    }
  }
  this.lostFocus();
  }
 public removeCharFromString (indexOfChar:number, stringA:string):string{
   return stringA.slice(0,indexOfChar) + stringA.substr(indexOfChar+1);
 }


}
