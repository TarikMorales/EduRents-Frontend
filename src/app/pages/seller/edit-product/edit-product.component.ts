import { CourseCareer } from './../../../shared/model/product/course-career.model';
import { Component, inject, OnInit } from '@angular/core';
import { FooterComponent } from "../../../shared/components/footer/footer.component";
import { NavbarComponent } from "../../../shared/components/navbar/navbar.component";
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { PublicResourcesService } from '../../../core/services/public-resources.service';
import { SellerProductService } from '../../../core/services/seller-product.service';
import { Category } from '../../../shared/model/product/category.model';
import { ProductRequest } from '../../../shared/model/product/product-request.model';
import { ProductResponse } from '../../../shared/model/product/product-response.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [FooterComponent, NavbarComponent, RouterLink, FormsModule, ReactiveFormsModule, MatSnackBarModule, CommonModule],
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.css'
})
export class EditProductComponent implements OnInit{

  editProductForm: FormGroup; 
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute)
  private snackBar = inject(MatSnackBar);
  private authService = inject(AuthService);
  private publicResourcesService = inject(PublicResourcesService);
  private sellerProductService = inject(SellerProductService);

  opcionesCategorias : Category[] = [];
  opcionesCursosCarreras: CourseCareer[] = [];
  foto : string = "https://colorsremain.com/wp-content/plugins/elementor/assets/images/placeholder.png";
  productId : number = 1;
  producto: ProductResponse | null = null;

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
    this.editProductForm = this.fb.group({
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
    if (this.authService.getUser()?.rol !== 'SELLER') {
      this.showSnackBar('No tienes permisos para acceder a esta página (No eres un vendedor)');
      this.router.navigate(['/']);
    }
  
    this.publicResourcesService.getCategorias().subscribe(categorias => {
      this.opcionesCategorias = categorias;
    });
  
    // Combinar ambas llamadas: cursosCarreras y producto
    forkJoin({
      cursosCarreras: this.publicResourcesService.getCursosCarreras(),
      producto: this.publicResourcesService.getProductoPorId(Number(this.route.snapshot.paramMap.get('id')))
    }).subscribe(({ cursosCarreras, producto }) => {
      this.opcionesCursosCarreras = cursosCarreras;
      this.producto = producto;
    
      let foto = producto.imagenes.length > 0 ? producto.imagenes[0].url : 'https://colorsremain.com/wp-content/plugins/elementor/assets/images/placeholder.png';
      let categoria = producto.categorias.length > 0 ? producto.categorias[0].id : null;
      let curso_id = producto.cursos_carreras.length > 0 ? producto.cursos_carreras[0].id_curso : null;
      let carrera_id = producto.cursos_carreras.length > 0 ? producto.cursos_carreras[0].id_carrera : null;
    
      let cursoCarreraOriginal = cursosCarreras.find(cc =>
        cc.id_curso === curso_id && cc.id_carrera === carrera_id
      );
    
      this.editProductForm.patchValue({
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio: producto.precio,
        categoria: categoria,
        estado: producto.estado,
        curso_carrera: cursoCarreraOriginal ? cursoCarreraOriginal.id : null,
        cantidad_disponible: producto.cantidad_disponible,
        intercambio: producto.acepta_intercambio ? 'true' : 'false',
        url_imagen: foto
      });
    });
  
    // listener de imagen
    this.editProductForm.get('url_imagen')?.valueChanges.subscribe((url: string) => {
      this.foto = url;
    });
  }

  onsubmit(){

    if(this.editProductForm.invalid){
      return;
    };

    let categorias : number[] = [];
    categorias.push(Number(this.editProductForm.value.categoria));

    let cursosCarreras : number[] = [];
    cursosCarreras.push(Number(this.editProductForm.value.curso_carrera));

    let fotos : string[] = [];
    fotos.push(this.editProductForm.value.url_imagen);

    let aceptaIntercambio : boolean = false;

    if (this.editProductForm.value.intercambio === 'true') {
      aceptaIntercambio = true;
    } else {
      aceptaIntercambio = false;
    }

    let fechaExpiracion : string = new Date().toISOString();
    fechaExpiracion = new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString();
    fechaExpiracion = fechaExpiracion.split('T')[0];

    const productoNuevo : ProductRequest = {
      id_vendedor: this.authService.getUser()?.id || 0,
      nombre: this.editProductForm.value.nombre,
      descripcion: this.editProductForm.value.descripcion,
      precio: this.editProductForm.value.precio,
      categorias: categorias,
      estado: this.editProductForm.value.estado,
      cursos_carreras: cursosCarreras,
      cantidad_disponible: this.editProductForm.value.cantidad_disponible,
      acepta_intercambio: aceptaIntercambio,
      fecha_expiracion: fechaExpiracion,
      urls_imagenes: fotos
    }

    this.sellerProductService.updateProduct(this.productId, productoNuevo, this.authService.getUser()?.token || '').subscribe({
      next: () => {
        this.showSnackBar('Producto editado exitosamente');
        this.router.navigate(['/seller/my-products']);
      },
      error: () => {
        this.showSnackBar('Error al editar el producto');
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
