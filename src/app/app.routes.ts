import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { ListDetail } from './components/list-detail/list-detail';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'list/:id', component: ListDetail },
    { path: '**', redirectTo: '', pathMatch: 'full' } // wildcard redirect
];
