import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MYproductsComponent } from "./pages/public_/myproducts/myproducts.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MYproductsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'edurents-app_v1';
}
