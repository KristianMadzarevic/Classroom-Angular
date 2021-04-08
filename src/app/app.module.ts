import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ClassroomModule } from './classroom/classroom.module';
import { StudentsModule } from './students/students.module';
import { AssignerService } from './assigner.service';

@NgModule({
  declarations: [
    AppComponent,

  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    CommonModule,
    ClassroomModule,
    StudentsModule
  ],
  providers: [AssignerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
