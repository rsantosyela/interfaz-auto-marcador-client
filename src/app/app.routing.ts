import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { MenuComponent } from './components/menu/menu.component';
import { ImportCsvComponent } from './components/import-csv/import-csv.component';
import { DownloadCsvComponent } from './components/download-csv/download-csv.component';
import { AuthGuard } from './helpers/auth.guard';

const appRoutes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'menu-principal', component: MenuComponent, canActivate: [AuthGuard] },
    { path: 'importar-csv', component: ImportCsvComponent, canActivate: [AuthGuard] },
    { path: 'descargar-csv', component: DownloadCsvComponent, canActivate: [AuthGuard] },
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders<any> = RouterModule.forRoot(appRoutes);