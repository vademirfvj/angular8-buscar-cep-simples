import { Component, OnInit} from '@angular/core';
import { Endereco } from './endereco';
import { Uf } from './uf';
import { Cidade } from './cidade';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  title = 'Consultar CEP';

  public cep: number;
  public cidade: string;
  public uf: string;
  public rua: string;
  endereco: Endereco;
  public cepDiv: boolean;
  public cidadeDiv: boolean;

  ufs: Uf[];
  cidades: Cidade[];
  enderecos: Endereco[];


   constructor(private appService: AppService){  }

   ngOnInit() {
    this.cepDiv = true;
   	this.endereco = new Endereco();
    this.appService.getUFList().subscribe((data:Uf[]) => {this.ufs = data}, (err) => { console.log(err)});
   }


   onSubmit() {
     if(this.cidadeDiv === true){
       this.enderecos = [];
       console.log("Consulta: Cidade: " + this.cidade + " UF: " + this.uf + " Rua: " + this.rua);

        this.appService.getEnderecoList(this.uf, this.cidade.replace(" ", "%20"), this.rua)
          .subscribe((data:Endereco[]) => {this.enderecos = data}, (err) => { console.log(err)});

     }else{
       this.endereco = new Endereco();
        this.buscarCEP(); 
     } 
  }

  changeTipo(tipo: number) {
    this.endereco = new Endereco();
    this.enderecos = [];

    if(tipo === 1){
     this.cepDiv = true;
     this.cidadeDiv = false;
    }else{
      this.cidadeDiv = true;
      this.cepDiv = false;
    }
  }

  setCidade(uf: string){
    console.log(uf)

    this.appService.getCidadeList(uf)
      .subscribe((data:Cidade[]) => {this.cidades = data}, error => console.log(error));
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
