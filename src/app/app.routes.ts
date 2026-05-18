import { Routes } from '@angular/router';
import { AppLayoutComponent } from './layout/app-layout/app-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'basic' },
      {
        path: 'basic',
        loadComponent: () =>
          import('./pages/basic-editor/basic-editor.component').then(
            (m) => m.BasicEditorComponent,
          ),
      },
      {
        path: 'multi-editors',
        loadComponent: () =>
          import('./pages/multi-editors/multi-editors.component').then(
            (m) => m.MultiEditorsComponent,
          ),
      },
      {
        path: 'lifecycle',
        loadComponent: () =>
          import('./pages/lifecycle/lifecycle-page.component').then(
            (m) => m.LifecyclePageComponent,
          ),
      },
      {
        path: 'comments',
        loadComponent: () =>
          import('./pages/comments/comments-feed.component').then(
            (m) => m.CommentsFeedComponent,
          ),
      },
      {
        path: 'modal',
        loadComponent: () =>
          import('./pages/modal/modal-editor-page.component').then(
            (m) => m.ModalEditorPageComponent,
          ),
      },
    ],
  },
  { path: '**', redirectTo: 'basic' },
];
