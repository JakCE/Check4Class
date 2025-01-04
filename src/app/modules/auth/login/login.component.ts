import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastService } from '../../../services/toasteMessage/toast.service';
import { AuthService } from '../../../services/Auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  logInForm!: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private toastService: ToastService,
    private authService: AuthService,
    private router: Router
  ){}

  ngOnInit(): void {
    this.logInForm = this.formBuilder.group({
      email: [null,[Validators.required, Validators.email]],
      password: [null,Validators.required]
    });
  }

  async logIn(){
    if(this.logInForm.invalid) {
      this.toastService.showToast('danger', 'Something went wrong.');
      //this.toastService.showToast('success', 'Operation successful!');
      //this.toastService.showToast('warning', 'Please check your inputs.');
      return;
    }
    const authResponse = await this.authService.login({
      email: this.logInForm.get("email")?.value,
      password: this.logInForm.get("password")?.value,
    })
    if(authResponse.error && authResponse.error.__isAuthError){
      this.toastService.showToast('danger', authResponse.error.message);
      this.router.navigateByUrl('/login');
    }else{
      this.toastService.showToast('success', 'Inicio de sesión exitoso!');
      this.router.navigateByUrl('/app');
    }
    console.log(authResponse);
  }

  async signUp(){
    if(this.logInForm.invalid) {
      this.toastService.showToast('danger', 'Something went wrong.');
      //this.toastService.showToast('success', 'Operation successful!');
      //this.toastService.showToast('warning', 'Please check your inputs.');
      return;
    }
    const authResponse = await this.authService.signUp({
      email: this.logInForm.get("email")?.value,
      password: this.logInForm.get("password")?.value,
    })

    this.toastService.showToast('success', 'Operation successful!');
    console.log(authResponse);
  }
}
