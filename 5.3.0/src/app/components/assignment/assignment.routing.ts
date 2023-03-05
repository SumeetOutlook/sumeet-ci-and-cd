import { Routes } from "@angular/router";
import { AssignmentComponent } from './assignment/assignment.component';

export const AssignmentRoutes: Routes = [
     //{ path: '', component: AssignmentComponent, data: { title: 'Assignment' } }  
     {
          path: "",
          children: [
               {
                    path: "a",
                    component: AssignmentComponent,
                    data: { title: "Assignment" }
               }
          ]
     }
];
