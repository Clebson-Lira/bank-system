import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: true, // Adicione se não estiver
  imports: [CommonModule, ReactiveFormsModule, RouterModule], // Adicione ReactiveFormsModule aqui
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
   passwordMismatch = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      cpf: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      birthDate: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const { fullName, email, cpf, birthDate, password } = this.registerForm.value;
      this.authService.register({ fullName, email, cpf, birthDate, password }).subscribe(
        () => this.router.navigate(['/login']),
        (err) => console.error('Registro falhou', err)
      );
    }
  }
}
