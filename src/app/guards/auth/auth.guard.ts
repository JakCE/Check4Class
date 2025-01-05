import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/Auth/auth.service';
import { inject } from '@angular/core';

const authService = () => inject(AuthService);
const routerInj = () => inject(Router);

export const authGuard: CanActivateFn = async (route, state) => {
  const router = routerInj();
  const { data } = await authService().session();
  //console.log(data);
  if(!data.session){
    router.navigateByUrl('/login');
  }
  return !!data.session;
};

export const authLogInGuard: CanActivateFn = async (route, state) => {
  const router = routerInj();
  const { data } = await authService().session();
  //console.log(data);
  if(data.session){
    router.navigateByUrl('/app');
  }
  return !data.session;
};
