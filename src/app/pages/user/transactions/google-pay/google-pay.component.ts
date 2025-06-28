import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-google-pay',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './google-pay.component.html',
  styleUrls: ['./google-pay.component.css']
})
export class GooglePayComponent {
  googleForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.googleForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email, Validators.pattern('^[\\w.+\\-]+@gmail\\.com$')]]
    });
  }

  submit(): void {
    if (this.googleForm.valid) {
      const correo = this.googleForm.value.correo;
      console.log('Google Pay enviado con correo:', correo);
      this.router.navigate(['/transaccion-guardada-virtual'], {
        queryParams: { metodo: 'GOOGLEPAY' }
      });
    }
  }

  volver(): void {
    this.router.navigate(['/create-transaction']);
  }
}
