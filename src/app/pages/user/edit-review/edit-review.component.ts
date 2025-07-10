import { Component, inject, OnInit } from '@angular/core';
import { NavbarComponent } from "../../../shared/components/navbar/navbar.component";
import { FooterComponent } from "../../../shared/components/footer/footer.component";
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ReviewAuthService } from '../../../core/services/reviews/review-auth.service';
import { SellerProfileService } from '../../../core/services/seller-profile.service';
import { SellerProfileResponse } from '../../../shared/model/public-resources/seller-profile-response.model';
import { AuthResponse } from '../../../shared/model/login/auth-response.model';
import { ReviewPublicService } from '../../../core/services/reviews/review-public.service';
import { ReviewResponse } from '../../../shared/model/reviews/review-response.model';
import { ReviewRequest } from '../../../shared/model/reviews/review-request.model';

@Component({
  selector: 'app-edit-review',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, CommonModule, FormsModule, ReactiveFormsModule, MatSnackBarModule],
  templateUrl: './edit-review.component.html',
  styleUrl: './edit-review.component.css'
})
export class EditReviewComponent implements OnInit{

  editReviewForm: FormGroup;
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);
  private userAuthReviewService = inject(ReviewAuthService);
  private publicReviewService = inject(ReviewPublicService);
  private sellerService = inject(SellerProfileService);

  resenaId: number = 0;
  sellerId : number = 0;
  seller: SellerProfileResponse | undefined;
  usuario : AuthResponse | null = null;

  opciones = [
    { label: 'Sí', value: 'true' },
    { label: 'No', value: 'false' },
  ]

  constructor() {
    this.editReviewForm = this.fb.group({
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

    this.resenaId = +this.route.snapshot.paramMap.get('idResena')!;
    this.sellerId = +this.route.snapshot.paramMap.get('idVendedor')!;

    if (this.sellerId === this.authService.getUser()?.id) {
      this.showSnackBar('No puedes editar tu propia reseña');
      this.router.navigate(['/public/seller-profile', this.sellerId]);
      return;
    }

    this.loadResenaData();
    this.loadSellerData();

    const user: AuthResponse | null = this.authService.getUser();
    if (user) {
      this.usuario = user;
    }

    this.userAuthReviewService.getReviewBySellerIdAndUserId(this.sellerId, this.usuario!.id, this.usuario!.token!)
      .subscribe({
        next: (resenaOriginal: ReviewResponse) => {
          if (resenaOriginal.id !== this.resenaId) {
            this.showSnackBar('Esta reseña no la creaste tú');
            this.router.navigate(['/public/seller-profile', this.sellerId]);
          }
        },
        error: () => {
          this.showSnackBar('No se encontró la reseña original para editar');
          this.router.navigate(['/public/seller-profile', this.sellerId]);
        }
      });

  }

  onsubmit(){

    if(this.editReviewForm.invalid){
      return;
    };

    const reviewData : ReviewRequest = {
      contenido: this.editReviewForm.value.contenido,
      confiabilidad: this.editReviewForm.value.confiabilidad,
      sinDemoras: this.editReviewForm.value.sinDemoras,
      buenaAtencion: this.editReviewForm.value.buenaAtencion,
      idVendedor: this.sellerId,
      idUsuario: this.usuario!.id
    };

    this.userAuthReviewService.updateReview(this.resenaId, reviewData, this.usuario!.token!).subscribe({
      next: () => {
        this.showSnackBar('Reseña editada correctamente');
        this.router.navigate(['/public/seller-profile', this.sellerId]);
      },
      error: () => {
        this.showSnackBar('Error al editar la reseña');
      }
    });

  }

  loadSellerData() {
    this.sellerService.getSellerById(this.sellerId).subscribe({
      next: (sellerData: SellerProfileResponse) => {
        this.seller = sellerData;
      },
      error: () => {
        this.showSnackBar('Error al cargar los datos del vendedor');
        this.router.navigate(['/product-list-home']);
      }
    });
  }

  loadResenaData() {
    this.publicReviewService.getReviewById(this.resenaId).subscribe({
      next: (resena) => {
        this.editReviewForm.patchValue({
          contenido: resena.contenido,
          confiabilidad: resena.confiabilidad.toString(),
          sinDemoras: resena.sinDemoras.toString(),
          buenaAtencion: resena.buenaAtencion.toString()
        });
      },
      error: () => {
        this.showSnackBar('Error al cargar la reseña');
        this.router.navigate(['/product-list-home']);
      }
    });
  }

  controlHasError(control: string, error: string){
    return this.editReviewForm.controls[control].hasError(error);
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
