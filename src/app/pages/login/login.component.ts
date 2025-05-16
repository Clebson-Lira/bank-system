import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true, // Adicione se não estiver
  imports: [CommonModule, ReactiveFormsModule, RouterModule], // Adicione ReactiveFormsModule aqui
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.fakeLogin(email, password).subscribe(
  () => this.router.navigate(['/dashboard']),
  (err) => console.error('Login falhou', err)
);
    }
  }

//  this.authService.login(email, password).subscribe(
//         () => this.router.navigate(['/dashboard']),
//         (err) => console.error('Login falhou', err)
//       );
}
