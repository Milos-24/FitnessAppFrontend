import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { MenuItemComponent } from './menu-item/menu-item.component';
import { RegistrationComponent } from './registration/registration.component';
import { ProgramDetailsComponent } from './program-details/program-details.component';
import { FileUploadComponent } from './file-upload/file-upload.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'main', component: MainComponent},
  { path: 'item', component: MenuItemComponent},
  { path: 'registration', component: RegistrationComponent},
  { path: 'details', component: ProgramDetailsComponent},
  { path: 'new-program', component: FileUploadComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }