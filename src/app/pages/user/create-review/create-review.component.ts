import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';
import { ReviewAuthService } from '../../../core/services/reviews/review-auth.service';
import { SellerProfileService } from '../../../core/services/seller-profile.service';
import { SellerProfileResponse } from '../../../shared/model/public-resources/seller-profile-response.model';
import { AuthResponse } from '../../../shared/model/login/auth-response.model';
import { ReviewRequest } from '../../../shared/model/reviews/review-request.model';

@Component({
  selector: 'app-create-review',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent, FormsModule, ReactiveFormsModule, MatSnackBarModule],
  templateUrl: './create-review.component.html',
  styleUrls: ['./create-review.component.css']
})
export class CreateReviewComponent implements OnInit {

  reviewForm: FormGroup;
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);
  private userAuthReviewService = inject(ReviewAuthService);
  private sellerService = inject(SellerProfileService);

  sellerId: number = 0;
  seller: SellerProfileResponse | undefined;

  usuario : AuthResponse | null = null;

  opciones = [
    { label: 'Sí', value: 'true' },
    { label: 'No', value: 'false' },
  ]

  constructor() {

    this.reviewForm = this.fb.group({
      contenido: ['', [Validators.required]],
      confiabilidad: ['', [Validators.required]],
      sinDemoras: ['', [Validators.required]],
      buenaAtencion: ['', [Validators.required]],
    });

  }

  ngOnInit() {

    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/auth/login']);
    }

    this.sellerId = +this.route.snapshot.paramMap.get('id')!;
    this.loadSellerData();

    const user: AuthResponse | null = this.authService.getUser();
    if (user) {
      this.usuario = user;
    }

    this.userAuthReviewService.existsReviewBySellerIdAndUserId(this.sellerId, this.usuario!.id, this.usuario!.token!).subscribe({
      next: (exists: boolean) => {
        if (exists) {
          this.showSnackBar('Ya has creado una reseña para este vendedor');
          this.router.navigate(['/public/seller-profile', this.sellerId]);
        }
      },
      error: () => {
        this.showSnackBar('Error al verificar si ya existe una reseña para este vendedor');
      }
    });

  }

  onsubmit(){
    if(this.reviewForm.invalid){
      return;
    };

    const reviewData : ReviewRequest = {
      contenido: this.reviewForm.value.contenido,
      confiabilidad: this.reviewForm.value.confiabilidad,
      sinDemoras: this.reviewForm.value.sinDemoras,
      buenaAtencion: this.reviewForm.value.buenaAtencion,
      idVendedor: this.sellerId,
      idUsuario: this.usuario!.id
    };

    console.log(reviewData);

    this.userAuthReviewService.createReview(reviewData, this.usuario?.token!).subscribe({
      next: () => {
        this.showSnackBar('Reseña creada exitosamente');
        this.router.navigate(['/public/seller-profile', this.sellerId]);
      },
      error: () => {
        this.showSnackBar('Error al crear la reseña');
      }
    });

  }

  loadSellerData() {
    this.sellerService.getSellerById(this.sellerId).subscribe({
      next: (sellerData: SellerProfileResponse) => {
        this.seller = sellerData;
        // console.log(this.seller);
      },
      error: () => {
        this.showSnackBar('Error al cargar los datos del vendedor');
        this.router.navigate(['/product-list-home']);
      }
    });
  }

  controlHasError(control: string, error: string){
    return this.reviewForm.controls[control].hasError(error);
  }

  private showSnackBar(message: string): void{
    this.snackBar.open(message, 'Close',{
      duration: 2000,
      verticalPosition: 'top'
    })
  }

  volver(): void {
    this.router.navigate(['/public/seller-profile', this.sellerId]);
  }

}
