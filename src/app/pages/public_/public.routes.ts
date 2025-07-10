import { Routes } from "@angular/router";
import { LandingComponent } from "./landing/landing.component";
import { ProductDetailComponent } from "./product-detail/product-detail.component";
import { SellerProfileComponent } from "./seller-profile/seller-profile.component";

export const publicRoutes: Routes = [
    {
      path: 'products/:id',
      component: ProductDetailComponent
    },
    {
      path: 'seller-profile/:id',
      component: SellerProfileComponent
    },
]