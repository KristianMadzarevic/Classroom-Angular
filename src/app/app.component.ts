import { ChangeDetectorRef, Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  constructor(private cd:ChangeDetectorRef){
  }
  ngOnInit(): void {
    
  }
  title = 'CLASSROOM';
  message = '2-3,5-6---';

  public receiveValue(e:any){
    this.message=e;
  }
  ngAfterViewInit(){
    this.cd.detectChanges();
  }

}
