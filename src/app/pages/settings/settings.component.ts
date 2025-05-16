import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  standalone: true, // Adicione se não estiver
  imports: [CommonModule, ReactiveFormsModule, RouterModule], // Adicione ReactiveFormsModule aqui
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  profileForm: FormGroup;
  currentImageUrl: string | null = null;
  selectedFile: File | null = null;
  passwordMismatch = false;

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router, private authService: AuthService) {
    this.profileForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      currentPassword: [''],
      newPassword: [''],
      confirmNewPassword: ['']
    });
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile() {
    this.userService.getProfile().subscribe((profile: { fullName: any; email: any; photoUrl: null; }) => {
      this.profileForm.patchValue({
        fullName: profile.fullName,
        email: profile.email
      });
      this.currentImageUrl = profile.photoUrl || null;
    });
  }

  onFileSelected(event: any) {
    if(event.target.files && event.target.files.length) {
      this.selectedFile = event.target.files[0];

      // Preview da imagem
      const reader = new FileReader();
      reader.onload = e => this.currentImageUrl = reader.result as string;
      reader.readAsDataURL(this.selectedFile as Blob);
    }
  }

  checkPasswordMatch() {
    const newPass = this.profileForm.get('newPassword')?.value;
    const confirmPass = this.profileForm.get('confirmNewPassword')?.value;
    this.passwordMismatch = newPass !== confirmPass;
  }
    onSubmit() {
    if (this.profileForm.invalid || this.passwordMismatch) return;

    const { fullName, email } = this.profileForm.value;
    let photoUrl = this.currentImageUrl;

    // Atualiza o usuário no localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    user.fullName = fullName;
    user.email = email;
    if (photoUrl) user.photoUrl = photoUrl;
    localStorage.setItem('user', JSON.stringify(user));

    alert('Perfil atualizado com sucesso!');

    // Opcional: recarregar a página ou emitir evento para atualizar o header imediatamente
    location.reload();
     this.router.navigate(['/dashboard']);
  }
  cancel() {
    this.router.navigate(['/dashboard']);
  }

  // onSubmit() {
  //   if (this.profileForm.invalid || this.passwordMismatch) return;

  //   const { fullName, email, currentPassword, newPassword } = this.profileForm.value;
  //   const updateData: any = { fullName, email };

  //   if (newPassword) {
  //     updateData.currentPassword = currentPassword;
  //     updateData.newPassword = newPassword;
  //   }

  //   this.userService.updateProfile(updateData, this.selectedFile).subscribe({
  //     next: () => alert('Perfil atualizado com sucesso!'),
  //     error: (err) => alert('Erro ao atualizar perfil: ' + err.message)
  //   });
  // }
}
