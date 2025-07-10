import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { AlertsService } from '../../../core/services/alerts.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule, MatIconModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  private router = inject(Router);
  private authService = inject(AuthService);
  private alertsService = inject(AlertsService);

  unviewedAlertsCount: number = 0;
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
      this.loadUnviewedAlertsCount();
    }
  }

  isSeller(): boolean {
    return this.authService.getUser()?.rol === 'SELLER';
  }

  loadUnviewedAlertsCount() {
    const user = this.authService.getUser();
    if (user) {
      this.alertsService.getAlertsByUser(user.id).subscribe(alerts => {
        alerts.forEach(alert => {
          alert.viewed = alert.visto ?? alert.viewed;
        });
        this.unviewedAlertsCount = alerts.filter(a => !a.viewed).length;
      });
    }
  }

}
