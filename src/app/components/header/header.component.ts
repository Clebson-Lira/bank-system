import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from '../../services/user.service';



@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  standalone: true, // Adicione se não estiver
  imports: [CommonModule, RouterModule], // Adicione ReactiveFormsModule aqui
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  userName: string = '';
  userPhotoUrl: string | null = null;
   private routerSub!: Subscription;

  constructor(private authService: AuthService, private router: Router, private userService: UserService) {}

 ngOnInit(): void {
    this.loadUserInfo();
    this.routerSub = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.loadUserInfo();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
  }

  loadUserInfo() {
    const user = this.authService.getUser();
    this.userName = user ? user.fullName : '';

    this.userService.getProfile().subscribe(profile => {
      // Se profile.profilePicture for só o nome do arquivo, monte a URL:
      if (profile.profilePicture) {
        this.userPhotoUrl = profile.profilePicture.startsWith('http')
          ? profile.profilePicture
          : `http://localhost:3000/${profile.profilePicture}`;
      } else {
        this.userPhotoUrl = null;
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
