import { Routes } from "@angular/router";
import { ProfileComponent } from "./profile/profile.component";
import { ChangePhotoComponent } from "./change-photo/change-photo.component";

export const userRoutes: Routes = [
    {
        path: '',
        component: ProfileComponent
    },
    {
        path: 'change-photo',
        component: ChangePhotoComponent
    }
]