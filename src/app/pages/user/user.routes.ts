import { Routes } from "@angular/router";
import { ProfileComponent } from "./profile/profile.component";
import { ChangePhotoComponent } from "./change-photo/change-photo.component";
import { MakeSellerComponent } from "./make-seller/make-seller.component";
import { CreateReviewComponent } from "./create-review/create-review.component";
import { EditReviewComponent } from "./edit-review/edit-review.component";

export const userRoutes: Routes = [
    {
        path: '',
        component: ProfileComponent
    },
    {
        path: 'change-photo',
        component: ChangePhotoComponent
    },
    {
        path: 'make-seller',
        component: MakeSellerComponent
    },
    {
        path: 'reviews/create/:id',
        component: CreateReviewComponent
    },
    {
      path: 'reviews/edit/:idVendedor/:idResena',
      component: EditReviewComponent
    }
]
