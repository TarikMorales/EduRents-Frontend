import { Routes } from "@angular/router";
import { NewProductComponent } from "./new-product/new-product.component";
import { MyProductsComponent } from "./my-products/my-products.component";
import { EditProductComponent } from "./edit-product/edit-product.component";

export const sellerRoutes: Routes = [
    {
        path: 'new-product',
        component: NewProductComponent
    },
    {
        path: 'my-products',
        component: MyProductsComponent
    },
    {
        path: 'edit-product/:id',
        component: EditProductComponent
    }
]