import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { AuthGuard } from './guards/auth.guard'; // Importe o AuthGuard
import { TransactionListComponent } from './components/transaction-list/transaction-list.component';
// Importe outros componentes de página conforme necessário

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },
  {
    path: 'transaction/:type',
    loadComponent: () =>
      import('./components/transaction-form/transaction-form.component').then(m => m.TransactionFormComponent)
  },
  { path: 'transaction-list', component: TransactionListComponent},
  { path: '**', redirectTo: 'dashboard' } // Redireciona para o dashboard se a rota não for encontrada
];
