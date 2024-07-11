import { Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
//import { ResetPageComponent } from './reset-page/reset-page.component';
import { authGuard } from './auth/auth.guard';
import { IdeasComponent } from './ideas/ideas.component';
import { EditideaComponent } from './editidea/editidea.component';
import { LogoutComponent } from './logout/logout.component';
import { CommentsComponent } from './comments/comments.component';

export const routes: Routes = [
  
  {
    path: "home",
    component: HomepageComponent,
    title: "Home"
  }, {
    path: "auth",
    component: LoginComponent,
    title: "Auth"
  }, {
    path: "signup",
    component: SignupComponent,
    title: "Signup"
  }, {
    path: "logout",
    component: LogoutComponent,
    title: "Log out"
  }, /*{
    path: "reset",
    component: ResetPageComponent,
    title: "Reset app",
  }, */{
    path: "ideas",
    component: IdeasComponent,
    title: "Ideas",
    canActivate: [authGuard]
  }, {
    path: "editidea",
    component: EditideaComponent,
    title: "Editidea",
    canActivate: [authGuard]
  }, {
    path: "",
    redirectTo: "/home",
    pathMatch: 'full'
  },
  {
    path: 'comments/:id',
    component: CommentsComponent,
    title: "Comment idea",
    canActivate: [authGuard]
  }
  
];

