import { Routes } from '@angular/router';

import { authChildGuard } from './auth/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.component')
        .then(m => m.LoginComponent)
  },

  {
    path: '',
    canActivateChild: [authChildGuard],
    children: [
      {
        path: 'samples',
        loadComponent: () =>
          import('./samples/pages/sample-list/sample-list.component')
            .then(m => m.SampleListComponent)
      },
      {
        path: 'samples/new',
        loadComponent: () =>
          import('./samples/components/sample-create/sample-create.component')
            .then(m => m.SampleCreateComponent)
      },
      {
        path: 'samples/:id/edit',
        loadComponent: () =>
          import('./samples/components/sample-edit/sample-edit.component')
            .then(m => m.SampleEditComponent)
      },
      {
        path: 'samples/:id',
        loadComponent: () =>
          import('./samples/pages/sample-detail/sample-detail.component')
            .then(m => m.SampleDetailComponent)
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'samples'
      }
    ]
  },

  {
    path: '403',
    loadComponent: () =>
      import('./pages/forbidden/forbidden.component')
        .then(m => m.ForbiddenComponent)
  },

  {
    path: '404',
    loadComponent: () =>
      import('./pages/not-found/not-found.component')
        .then(m => m.NotFoundComponent)
  },

  {
    path: '**',
    redirectTo: '404'
  }
];