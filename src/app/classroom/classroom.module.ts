import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClassroomComponent } from './classroom.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
  ],
  declarations: [ClassroomComponent],
  exports:[ClassroomComponent]
})
export class ClassroomModule { }
