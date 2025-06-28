import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-myproducts-editpopup',
  standalone: true,
  imports: [NgIf],
  templateUrl: './myproducts-editpopup.component.html',
  styleUrl: './myproducts-editpopup.component.css'
})
export class MYproductsEditpopupComponent {

  public invalid_input = false;

  constructor(private dialogRef: MatDialogRef<MYproductsEditpopupComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  close_popup(){
    this.dialogRef.close();
  }

  close_popup_and_edit(){

    const nameinput = document.getElementById("editname") as HTMLInputElement;
    var newname = nameinput.value;

    const priceinput = document.getElementById("editprice") as HTMLInputElement;
    var newprice = priceinput.value;

    const exchangeinput = document.getElementById("editxchange") as HTMLInputElement;
    var newexchangeable = "No";
    if (exchangeinput.checked){
      newexchangeable = "Si"
    }
  
    if (newname == ""){
      newname = this.data.message.name;
    }

    if (newprice == ""){
      newprice = this.data.message.precio
    }

    if (Number(newprice) > 0 && Number(newprice)){

      this.data.message.name = newname;
      this.data.message.precio = newprice;
      this.data.message.intercambio = newexchangeable;

      this.dialogRef.close();

    } else {

      this.invalid_input = true

    }
    
  }

}
