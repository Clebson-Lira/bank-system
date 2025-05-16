import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';



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

  constructor(private authService: AuthService, private router: Router) {}

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

  // loadUserInfo() {
  //   const user = this.authService.getCurrentUser(); // método que retorna dados do usuário logado
  //   if(user) {
  //     this.userName = user.fullName;
  //     this.userPhotoUrl = user.photoUrl || null;
  //   }
  // }
  loadUserInfo() {
  const user = this.authService.getUser(); // Corrija para getUser()
  if(user) {
    this.userName = user.fullName;
    this.userPhotoUrl = user.photoUrl || null;
  }
}

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
