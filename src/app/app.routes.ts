import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { ListDetail } from './components/list-detail/list-detail';
import { Quiz } from './components/quiz/quiz';
import { ListCreate } from './components/list-create/list-create';
import { ListAdd } from './components/list-add/list-add';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'list/create', component: ListCreate },
    { path: 'list/:id', component: ListDetail },
    { path: 'list/:id/add', component: ListAdd },
    { path: 'list/:id/quiz', component: Quiz },
    { path: '**', redirectTo: '', pathMatch: 'full' } // wildcard redirect
];
