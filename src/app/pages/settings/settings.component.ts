import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
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
    async onSubmit() {
  if (this.profileForm.invalid || this.passwordMismatch) return;

  const { fullName, email, currentPassword, newPassword } = this.profileForm.value;
  const updateData: any = { fullName, email };

  try {
    if (this.selectedFile) {
      await this.userService.uploadPhoto(this.selectedFile).toPromise();
    }

    if (newPassword && currentPassword) {
      await this.userService.updatePassword(currentPassword, newPassword).toPromise();
    }

    await this.userService.updateProfile(updateData, this.selectedFile ?? undefined).toPromise();

    alert('Perfil atualizado com sucesso!');
    this.router.navigate(['/dashboard']);
    } catch (err: any) {
      alert('Erro ao atualizar perfil: ' + (err?.message || err));
    }
  }
   cancel() {
    this.router.navigate(['/dashboard']);
  }
}
