import { Routes } from '@angular/router';
import { LoginComponent } from './modules/auth/login/login.component';
import { RegisterComponent } from './modules/auth/register/register.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { AsistenciaComponent } from './modules/asistencia/asistencia.component';
import { authGuard, authLogInGuard } from './guards/auth/auth.guard';
import { MantenedoresMenuComponent } from './modules/mantenedores/mantenedores-menu/mantenedores-menu.component';
import { NivelesMantComponent } from './modules/niveles/niveles-mant/niveles-mant.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', canActivate: [authLogInGuard], component: LoginComponent },
    { path: 'register', canActivate: [authGuard], component: RegisterComponent },
    { path: 'app', canActivate: [authGuard], component: DashboardComponent },
    { path: 'asistencia', canActivate: [authGuard], component: AsistenciaComponent },
    { path: 'mantenedores', canActivate: [authGuard], component: MantenedoresMenuComponent },
    { path: 'niveles', canActivate: [authGuard], component: NivelesMantComponent },
    { path: '**', redirectTo: 'login' },
];