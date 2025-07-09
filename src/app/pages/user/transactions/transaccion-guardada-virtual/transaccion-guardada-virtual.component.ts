import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../../../../shared/components/navbar/navbar.component";
import { FooterComponent } from "../../../../shared/components/footer/footer.component";
import { TransactionService } from '../../../../core/services/transaction.service';
import { AuthService } from '../../../../core/services/auth.service';
import { inject } from '@angular/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
@Component({
  selector: 'app-transaccion-guardada-virtual',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent, MatSnackBarModule],
  templateUrl: './transaccion-guardada-virtual.component.html',
  styleUrls: ['./transaccion-guardada-virtual.component.css']
})
export class TransaccionGuardadaVirtualComponent implements OnInit {
  motivoReclamo: string | null = null;
  idUsuario!: number;
  idTransaccion!: number;
  metodoPago!: string;
  token!: string;
  haHechoReclamo: boolean = false;

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private transactionService = inject(TransactionService);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    const user = this.authService.getUser();
    if (!user) {
      this.router.navigate(['/auth/login']);
      return;
    }

    this.token = user.token;

    this.route.queryParams.subscribe(params => {
      this.motivoReclamo = params['reclamo'] || null;
      this.idTransaccion = +params['idTransaccion']; // Asegúrate de pasarlo al redirigir
      this.metodoPago = params['metodo'] || 'EFECTIVO'; // fallback
      this.idUsuario = params['idUsuario'] ? +params['idUsuario'] : user.id;
    });

    if (!this.idTransaccion || isNaN(this.idTransaccion)) {
      this.showSnackBar('ID de transacción no proporcionado');
      this.router.navigate(['/mi-historial']);
      return;
    }

    if (this.transactionService.getTransactionByIdAndUser(this.idTransaccion, this.idUsuario, this.token)) {
      this.transactionService.getTransactionByIdAndUser(this.idTransaccion, this.idUsuario, this.token).subscribe({
        next: (transaction) => {
          if (!transaction) {
            this.showSnackBar('Transacción no encontrada');
            this.router.navigate(['/mi-historial']);
          } else {
            this.idTransaccion = transaction.id;
            this.metodoPago = transaction.metodo_pago || 'EFECTIVO'; // fallback
            this.idUsuario = transaction.usuario.id;
            this.motivoReclamo = transaction.motivo_reclamo ? transaction.motivo_reclamo : null;
            if (transaction.motivo_reclamo && transaction.motivo_reclamo.trim() !== '') {
              this.haHechoReclamo = true;
            }
          }
        },
        error: () => {
          this.showSnackBar('Error al obtener la transacción');
          this.router.navigate(['/mi-historial']);
        }
      });
    }
  }
  confirmarPago(): void {
    this.transactionService.confirmarTransaccion(this.idTransaccion, this.token).subscribe({
      next: () => this.router.navigate(['/pago-confirmado']),
      error: () => this.showSnackBar('Error al confirmar el pago')
    });
  }

  cancelarTransaccion(): void {
    this.transactionService.cancelarTransaccion(this.idTransaccion, this.token).subscribe({
      next: () => this.router.navigate(['/transaccion-cancelada']),
      error: () => this.showSnackBar('Error al cancelar la transacción')
    });
  }

  reclamarEntrega(): void {
    this.router.navigate(['/reclamar-entrega'], {
      queryParams: {
        tipo: 'virtual',
        idTransaccion: this.idTransaccion
      }
    });
  }

  irHistorial(): void {
    this.router.navigate(['/mi-historial']);
  }

  volver(): void {
    this.router.navigate(['/mi-historial']);
  }

  private showSnackBar(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      verticalPosition: 'top'
    });
  }
}
