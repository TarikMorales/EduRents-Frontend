import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../../../../shared/components/navbar/navbar.component";
import { FooterComponent } from "../../../../shared/components/footer/footer.component";

@Component({
  selector: 'app-apple-pay',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NavbarComponent, FooterComponent],
  templateUrl: './apple-pay.component.html',
  styleUrls: ['./apple-pay.component.css']
})
export class ApplePayComponent {
  appleForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.appleForm = this.fb.group({
      appleId: ['', [Validators.required, Validators.email]]
    });
  }

  submit(): void {
    if (this.appleForm.valid) {
      const appleId = this.appleForm.value.appleId;
      console.log('Apple Pay enviado con Apple ID:', appleId);
      this.router.navigate(['/transaccion-guardada-virtual'], {
        queryParams: { metodo: 'APPLEPAY' }
      });
    }
  }

  volver(): void {
    this.router.navigate(['/create-transaction']);
  }
}
