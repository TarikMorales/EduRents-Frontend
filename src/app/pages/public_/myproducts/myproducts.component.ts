import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { MYproductsPopupComponent } from '../myproducts-popup/myproducts-popup.component';
import { MYproductsEditpopupComponent } from '../myproducts-editpopup/myproducts-editpopup.component';

@Component({
  selector: 'app-myproducts',
  standalone: true,
  imports: [NgFor, MatDialogModule],
  templateUrl: './myproducts.component.html',
  styleUrl: './myproducts.component.css'
})
export class MYproductsComponent {

  //Temporary replacement for Id, change when connecting to the API
  private count = 3;

  //Allows popout screens to appear
  constructor(private dialog: MatDialog) {}

  //Temporary data
  myproducts = [
    {
      id: "1",
      name: "Tableta Grafica",
      precio: "370.00",
      intercambio: "Si",
      publicador: "Rodrigo Ramírez"
    },
    {
      id: "2",
      name: "Casio FX-570",
      precio: "79.00",
      intercambio: "No",
      publicador: "Rodrigo Ramírez"
    }
  ]


  //HU01 - ENDPOINT 1: "Crear producto"
  //Adds new publication if the data inserted is correct!
  verify_and_create_publication(){

    const newid = this.count;
    this.count = this.count + 1;

    const nameinput = document.getElementById("fname") as HTMLInputElement;
    const newname = nameinput.value;

    const priceinput = document.getElementById("fprice") as HTMLInputElement;
    const newprice = priceinput.value;

    const exchangeinput = document.getElementById("fexchange") as HTMLInputElement;
    var newexchangeable = "No";
    if (exchangeinput.checked){
      newexchangeable = "Si"
    }

    if (newname != "" && newprice != "" && Number(newprice) > 0 && Number(newprice)){
      this.myproducts.push({
        id:String(newid),
        name:newname,
        precio:newprice,
        intercambio:newexchangeable,
        publicador:"Rodrigo Ramírez"
      })
    }    
  }

  //HU01 - ENDPOINT 2: "Actualizar producto"
  //
  open_edit_popup(pub_id: string): void {

    const product = this.myproducts.find((element) => element.id == pub_id);

    this.dialog.open(MYproductsEditpopupComponent, {
      width: "1000px",
      data: { message: product, myproducts:this.myproducts},
    });
  }
  access_publication_to_edit(pub_id: string){
    this.open_edit_popup(pub_id)
  }

  //HU01 - ENDPOINT 3: "Eliminar producto"
  //
  delete_publication(pub_id: string){
    const todelete = this.myproducts.find((element) => element.id == pub_id);

    if (todelete){
      const indextodelete = this.myproducts.indexOf(todelete);
      
      if (indextodelete !== -1){
        this.myproducts.splice(indextodelete,1)
      }
    }
  }

  //HU01 - ENDPOINT 4: "Observar producto"
  //
  open_view_popup(pub_id: string): void {

    const product = this.myproducts.find((element) => element.id == pub_id);

    this.dialog.open(MYproductsPopupComponent, {
      width: "1000px",
      data: { message: product},
    });
  }

  access_publication_to_observe(pub_id: string){
    this.open_view_popup(pub_id)
  }
}
