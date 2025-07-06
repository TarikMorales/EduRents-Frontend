import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AlertsService } from '../../../core/services/alerts.service';
import { AuthService } from '../../../core/services/auth.service';
import { ShowAlertDTO } from '../../../shared/model/alerts/alert.model';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [
    CommonModule,
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ],
  templateUrl: './alerts.component.html',
  styleUrl: './alerts.component.css'
})
export class AlertsComponent implements OnInit {
  private alertsService = inject(AlertsService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  alerts: ShowAlertDTO[] = [];
  loading = false;
  error = false;

  ngOnInit(): void {
    this.loadAlerts();
  }

  loadAlerts(): void {
    const user = this.authService.getUser();
    if (!user) {
      this.showSnackBar('Usuario no autenticado');
      this.router.navigate(['/auth/login']);
      return;
    }

    this.loading = true;
    this.error = false;

    this.alertsService.getAlertsByUser(user.id).subscribe({
      next: (alerts) => {
        this.alerts = alerts;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading alerts:', error);
        this.error = true;
        this.loading = false;
        this.showSnackBar('Error al cargar las alertas');
      }
    });
  }

  markAsViewed(alert: ShowAlertDTO): void {
    this.alertsService.markAsViewed(alert.id).subscribe({
      next: () => {
        alert.viewed = true;
        this.showSnackBar('Alerta marcada como vista');
      },
      error: (error) => {
        console.error('Error marking alert as viewed:', error);
        this.showSnackBar('Error al marcar la alerta como vista');
      }
    });
  }

  deleteAlert(alert: ShowAlertDTO): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta alerta?')) {
      this.alertsService.deleteAlert(alert.id).subscribe({
        next: () => {
          this.alerts = this.alerts.filter(a => a.id !== alert.id);
          this.showSnackBar('Alerta eliminada exitosamente');
        },
        error: (error) => {
          console.error('Error deleting alert:', error);
          this.showSnackBar('Error al eliminar la alerta');
        }
      });
    }
  }

  viewProduct(alert: ShowAlertDTO): void {
    this.router.navigate(['/product', alert.idProduct]);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getUnviewedCount(): number {
    return this.alerts.filter(alert => !alert.viewed).length;
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.src = 'assets/NoImage.png';
    }
  }

  private showSnackBar(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }
}
