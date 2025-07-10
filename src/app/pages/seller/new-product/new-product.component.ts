import { Category } from './../../../shared/model/product/category.model';
import { Component, inject, OnInit } from '@angular/core';
import { NavbarComponent } from "../../../shared/components/navbar/navbar.component";
import { FooterComponent } from "../../../shared/components/footer/footer.component";
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { PublicResourcesService } from '../../../core/services/public-resources.service';
import { SellerProductService } from '../../../core/services/seller-product.service';
import { CourseCareer } from '../../../shared/model/product/course-career.model';
import { ProductRequest } from '../../../shared/model/product/product-request.model';

@Component({
  selector: 'app-new-product',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, RouterLink, FormsModule, ReactiveFormsModule, MatSnackBarModule, CommonModule],
  templateUrl: './new-product.component.html',
  styleUrl: './new-product.component.css'
})
export class NewProductComponent implements OnInit{

  productForm: FormGroup; 
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private authService = inject(AuthService);
  private publicResourcesService = inject(PublicResourcesService);
  private sellerProductService = inject(SellerProductService);

  opcionesCategorias : Category[] = [];
  opcionesCursosCarreras: CourseCareer[] = [];
  foto : string = "https://colorsremain.com/wp-content/plugins/elementor/assets/images/placeholder.png";

  opcionesIntercambio = [
    { label: 'Sí', value: 'true' },
    { label: 'No', value: 'false' },
  ];

  opcionesEstados = [
    { label: 'Nuevo', value: 'NUEVO' },
    { label: 'Seminuevo', value: 'SEMINUEVO' },
    { label: 'Usado', value: 'USADO' },
    { label: 'Muy usado', value: 'MUY_USADO' }
  ];

  constructor(){
    this.productForm = this.fb.group({
      nombre: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      precio: ['', [Validators.required, Validators.min(0)]],
      categoria: ['', [Validators.required]],
      estado: ['', [Validators.required]],
      curso_carrera: ['', [Validators.required]],
      cantidad_disponible: ['', [Validators.required, Validators.min(0)]],
      intercambio: ['', [Validators.required]],
      url_imagen: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {

    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/auth/login']);
    }
    if(this.authService.getUser()?.rol !== 'SELLER') {
      this.showSnackBar('No tienes permisos para acceder a esta página (No eres un vendedor)');
      this.router.navigate(['/']);
    }

    this.publicResourcesService.getCategorias().subscribe(categorias => {
      this.opcionesCategorias = categorias;
    });

    this.publicResourcesService.getCursosCarreras().subscribe(cursosCarreras => {
      this.opcionesCursosCarreras = cursosCarreras;
    });

    this.productForm.get('url_imagen')?.valueChanges.subscribe((url: string) => {
      this.foto = url;
    });

  }

  onsubmit(){

    if(this.productForm.invalid){
      return;
    };

    let categorias : number[] = [];
    categorias.push(Number(this.productForm.value.categoria));

    let cursosCarreras : number[] = [];
    cursosCarreras.push(Number(this.productForm.value.curso_carrera));

    let fotos : string[] = [];
    fotos.push(this.productForm.value.url_imagen);

    let aceptaIntercambio : boolean = false;

    if (this.productForm.value.intercambio === 'true') {
      aceptaIntercambio = true;
    } else {
      aceptaIntercambio = false;
    }

    let fechaExpiracion : string = new Date().toISOString();
    fechaExpiracion = new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString();
    fechaExpiracion = fechaExpiracion.split('T')[0];

    const productoNuevo : ProductRequest = {
      id_vendedor: this.authService.getUser()?.id || 0,
      nombre: this.productForm.value.nombre,
      descripcion: this.productForm.value.descripcion,
      precio: this.productForm.value.precio,
      categorias: categorias,
      estado: this.productForm.value.estado,
      cursos_carreras: cursosCarreras,
      cantidad_disponible: this.productForm.value.cantidad_disponible,
      acepta_intercambio: aceptaIntercambio,
      fecha_expiracion: fechaExpiracion,
      urls_imagenes: fotos
    }

    // console.log(productoNuevo);
    // console.log(this.authService.getUser()?.token);

    this.sellerProductService.createProduct(productoNuevo, this.authService.getUser()?.token || '').subscribe({
      next: () => {
        this.showSnackBar('Producto creado exitosamente');
        this.router.navigate(['/seller/my-products']);
      },
      error: () => {
        this.showSnackBar('Error al crear el producto');
        this.router.navigate(['/seller/my-products']);
      }
    });

  }

  private showSnackBar(message: string): void{
    this.snackBar.open(message, 'Close',{
      duration: 2000,
      verticalPosition: 'top'
    })
  }

  onImageError() {
    this.foto = 'https://colorsremain.com/wp-content/plugins/elementor/assets/images/placeholder.png';
  }

}
