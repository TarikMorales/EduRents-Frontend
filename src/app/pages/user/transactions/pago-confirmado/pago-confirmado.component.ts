import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../../../../shared/components/navbar/navbar.component";
import { FooterComponent } from "../../../../shared/components/footer/footer.component";

@Component({
  selector: 'app-pago-confirmado',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent],
  templateUrl: './pago-confirmado.component.html',
  styleUrls: ['./pago-confirmado.component.css']
})
export class PagoConfirmadoComponent {
  constructor(private router: Router) {}

  volverAlInicio(): void {
    this.router.navigate(['/']);
  }
}
