import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-myproducts-popup',
  standalone: true,
  imports: [],
  templateUrl: './myproducts-popup.component.html',
  styleUrl: './myproducts-popup.component.css'
})
export class MYproductsPopupComponent {

  constructor(private dialogRef: MatDialogRef<MYproductsPopupComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  close_popup(){
    this.dialogRef.close();
  }

}
