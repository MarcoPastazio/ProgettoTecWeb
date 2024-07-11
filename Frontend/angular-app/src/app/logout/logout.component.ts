import { Component, inject } from '@angular/core';
import { AuthService } from '../_services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [],
  template: '',
  styles: ''
})
export class LogoutComponent {

  authService = inject(AuthService);
  toastr = inject(ToastrService);
  router = inject(Router);

  ngOnInit() {
    if(! this.authService.isAuthenticated()){
      this.toastr.warning("Non sei attualmente connesso!");
      this.router.navigateByUrl("/");
    } else {
      this.toastr.warning(`Torna presto!`, "Ti sei disconnesso");
      this.authService.logout();
      this.router.navigateByUrl("/");
    }
  }

}
