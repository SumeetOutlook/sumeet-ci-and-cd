import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from "@angular/router";
import { JwtAuthService } from "../services/auth/jwt-auth.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private jwtAuth: JwtAuthService) {}  
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    
    if (this.jwtAuth.isLoggedIn()) {
      return true;
    } else {
      // this.router.navigate(["/sessions/login"], {
      //   queryParams: {
      //     return: state.url
      //   }
      // });
      this.router.navigateByUrl("sessions/login");
      return false;
    }
  }
}
