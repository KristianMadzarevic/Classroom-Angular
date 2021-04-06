import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { InputBoxComponent } from '../app/input-box/input-box.component'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  @ViewChild(InputBoxComponent) child!: InputBoxComponent;
  constructor(private cd:ChangeDetectorRef){
  }
  ngOnInit(): void {
    
  }
  title = 'CLASSROOM';
  message = '2-3,5-6';

  public receiveValue(e:any){
    this.message=e;
  }
  ngAfterViewInit(){
    this.cd.detectChanges();
  }

}
