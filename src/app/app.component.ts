import { Component, OnInit} from '@angular/core';

import { Endereco } from './endereco';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Consultar CEP';

  private cep: number;
  endereco: Endereco;


   constructor(private appService: AppService){  }

   ngOnInit() {

   	this.endereco = new Endereco();
   }


   onSubmit() {
   	this.endereco = new Endereco();
    this.buscarCEP();  
  }

  buscarCEP(){
	console.log("CEP consultado: " + this.cep);
	
	this.appService.getCEP(this.cep)
      .subscribe(data => {
        console.log(data)
        this.endereco = data;
      }, error => console.log(error));
  }
}
