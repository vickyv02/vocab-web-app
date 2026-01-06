import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { ListDetail } from './components/list-detail/list-detail';
import { Quiz } from './components/quiz/quiz';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'list/:id', component: ListDetail },
    { path: 'list/:id/quiz', component: Quiz },
    { path: '**', redirectTo: '', pathMatch: 'full' } // wildcard redirect
];
