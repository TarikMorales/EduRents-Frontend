import { AuthService } from './../../../core/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { SellerProfileService, ShowProductDTO } from '../../../core/services/seller-profile.service';
import { SellerProfileResponse } from '../../../shared/model/public-resources/seller-profile-response.model';
import { AuthResponse } from '../../../shared/model/login/auth-response.model';
import { ReviewAuthService } from '../../../core/services/reviews/review-auth.service';
import { ReviewPublicService } from '../../../core/services/reviews/review-public.service';
import { ReviewResponse } from '../../../shared/model/reviews/review-response.model';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-seller-profile',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent, MatSnackBarModule],
  templateUrl: './seller-profile.component.html',
  styleUrls: ['./seller-profile.component.css']
})
export class SellerProfileComponent implements OnInit {
  sellerId!: number;
  seller?: SellerProfileResponse;
  products: ShowProductDTO[] = [];
  showProducts = false;
  loading = true;
  error = false;
  loadingProducts = false;
  heHechoResena = false;
  soloMostrarResenasAjenas = false;
  mostrarResenas = false;
  usuarioId: number = 0;
  token = '';
  usuarioLogueado : boolean = false;
  resenas: ReviewResponse[] = [];
  resenaPropia: ReviewResponse | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sellerService: SellerProfileService,
    private authService: AuthService,
    private reviewAuthService: ReviewAuthService,
    private reviewPublicService: ReviewPublicService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {

    this.sellerId = +this.route.snapshot.paramMap.get('id')!;
    this.loadSellerData();

    if (!this.authService.isAuthenticated()) {
      this.heHechoResena = false;
      this.soloMostrarResenasAjenas = true;
      this.usuarioLogueado = false;
      console.log('Usuario no autenticado, solo se muestran reseñas de otros usuarios');
    } else {
      const user : AuthResponse | null = this.authService.getUser();
      this.usuarioLogueado = true;
      this.usuarioId = user?.id || 0;
      this.token = user?.token || '';
      if (user) {
        if (user.id === this.sellerId) {
          console.log('El usuario es el mismo que el vendedor');
          this.heHechoResena = true; // El usuario es el mismo que el vendedor
        } else {
          this.reviewAuthService.existsReviewBySellerIdAndUserId(this.sellerId, user.id, this.token).subscribe({
            next: (exists: boolean) => {
              if (!exists) {
                console.log('El usuario no ha hecho reseña');
                this.heHechoResena = false; // El usuario no ha hecho reseña
                this.soloMostrarResenasAjenas = false; // Solo se muestran reseñas de otros usuarios
              } else {
                console.log('El usuario ha hecho reseña');
                this.heHechoResena = true;
                this.soloMostrarResenasAjenas = true;
              }
              // Si el usuario ha hecho una reseña, la buscamos
              if (this.heHechoResena && this.usuarioId !== this.sellerId) {
                this.reviewAuthService.getReviewBySellerIdAndUserId(this.sellerId, this.usuarioId, this.token).subscribe({
                  next: (resena) => {
                    this.resenaPropia = resena;
                  },
                  error: (err) => {
                    console.error('Error loading reviews:', err);
                  }
                });
              }
            },
            error: (err) => {
              console.error('Error checking review existence:', err);
            }
          });
        }
      }
    }

  }

  loadSellerData() {
    this.loading = true;
    this.error = false;
    this.sellerService.getSellerById(this.sellerId).subscribe({
      next: (sellerData: SellerProfileResponse) => {
        this.seller = sellerData;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading seller:', error);
        this.error = true;
        this.loading = false;
      }
    });
  }

  getSellerName(): string {
    return this.seller?.nombreUsuario || '---';
  }

  getSellerUser(): string {
    return this.seller?.nombreUsuario || 'Sin usuario';
  }

  getSellerEmail(): string {
    return this.seller?.correoElectronico || 'Sin correo';
  }

  getSellerPhoneNumber(): number {
    return this.seller?.numeroTelefono || 0;
  }

  getSellerPresentation(): string {
    return this.seller?.presentacion || 'Sin presentación';
  }
  isSellerReliable(): boolean {
    return !!this.seller?.confiabilidad;
  }
  isSellerOnTime(): boolean {
    return !!this.seller?.sin_demoras;
  }
  isSellerAttentive(): boolean {
    return !!this.seller?.buena_atencion;
  }

  onShowProducts() {
    this.showProducts = !this.showProducts;
    if (this.showProducts && this.products.length === 0) {
      this.loadingProducts = true;
      this.sellerService.getSellerProducts(this.sellerId).subscribe({
        next: (products) => {
          this.products = products;
          this.loadingProducts = false;
        },
        error: (err) => {
          this.loadingProducts = false;
          console.error('Error loading products:', err);
        }
      });
    }
  }

  onShowReviews() {
    this.mostrarResenas = !this.mostrarResenas;
    if (this.mostrarResenas && this.resenas.length === 0) {
      if (!this.usuarioLogueado){

        this.reviewPublicService.getReviewsBySellerId(this.sellerId).subscribe({
          next: (resenas) => {
            this.resenas = resenas;
          },
          error: () => {
            this.showSnackBar('Error al cargar las reseñas');
          }
        });

      }

      else {

        if (this.soloMostrarResenasAjenas) {
          this.reviewAuthService.getReviewsBySellerIdAndNotUserId(this.sellerId, this.usuarioId, this.token).subscribe({
            next: (resenas) => {
              this.resenas = resenas;
            },
            error: () => {
              this.showSnackBar('Error al cargar las reseñas');
            }
          });
        } else {
            this.reviewPublicService.getReviewsBySellerId(this.sellerId).subscribe({
            next: (resenas) => {
              this.resenas = resenas;
            },
            error: () => {
              this.showSnackBar('Error al cargar las reseñas');
            }
          });
        }
      }

    }
  }

  goToProductDetail(productId: number) {
    this.router.navigate(['/public/products', productId]);
  }

  private showSnackBar(message: string): void{
    this.snackBar.open(message, 'Close',{
      duration: 2000,
      verticalPosition: 'top'
    })
  }

  createReview() {
    this.router.navigate(['/user/reviews/create', this.sellerId]);
  }

  editReview() {
    if (this.resenaPropia) {
      this.router.navigate(['/user/reviews/edit', this.sellerId, this.resenaPropia.id]);
    } else {
      this.showSnackBar('No se encontró la reseña propia para editar.');
    }
  }

  deleteReview() {
    if (this.resenaPropia) {
      this.reviewAuthService.deleteReview(this.resenaPropia.id, this.token).subscribe({
        next: () => {
          this.showSnackBar('Reseña eliminada correctamente');
          this.resenaPropia = null;
          this.heHechoResena = false;
          this.mostrarResenas = false;
          this.ngOnInit();
        },
        error: () => {
          this.showSnackBar('Error al eliminar la reseña');
        }
      });
    } else {
      this.showSnackBar('No se encontró la reseña propia para eliminar.');
    }
  }
}
