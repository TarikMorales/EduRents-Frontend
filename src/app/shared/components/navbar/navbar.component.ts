import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  private router = inject(Router);
  private authService = inject(AuthService);

  nombreUsuario: string | undefined = '';
  foto : string | undefined = '';

  isLogged(): boolean {
    return this.authService.isAuthenticated();
  }

  logout(): void {
    this.authService.logout();
    this.nombreUsuario = '';
    this.foto = '';
    this.router.navigate(['/']);
  }

  constructor() {
    if (this.isLogged()) {
      this.nombreUsuario = this.authService.getUser()?.nombres;
      this.foto = this.authService.getUser()?.fotoUrl;
    }
  }

}
