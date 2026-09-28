import { Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { SampleListComponent } from './samples/sample-list.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'samples',
    component: SampleListComponent
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];