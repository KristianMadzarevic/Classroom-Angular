import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentsComponent } from '../app/students/students.component'
import { ClassroomComponent } from '../app/classroom/classroom.component'
import { AppComponent } from '../app/app.component'

const routes: Routes = [
  {path: 'classroom-component', component: ClassroomComponent},
  {path: 'students-component', component: StudentsComponent},
  /* { path: '', redirectTo: '/classroom-component', pathMatch: 'full' }, */
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
