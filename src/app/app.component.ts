import { Component, OnInit, SecurityContext, ViewEncapsulation } from '@angular/core';
import { Endereco } from './endereco';
import { Uf } from './uf';
import { Cidade } from './cidade';
import { AppService } from './app.service';
import { DomSanitizer } from '@angular/platform-browser';
import { AlertConfig } from 'ngx-bootstrap/alert';

export function getAlertConfig(): AlertConfig {
  return Object.assign(new AlertConfig(), { type: 'success' });
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  encapsulation: ViewEncapsulation.None,
  styles: [
    `
  .alert-md-local {
    background-color: #009688;
    border-color: #00695C;
    color: #fff;
  }
  `
  ],
  providers: [{ provide: AlertConfig, useFactory: getAlertConfig }]
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

  public ruaInvalid: boolean;

  ufs: Uf[];
  cidades: Cidade[];
  enderecos: Endereco[];
  msg_erro;

  error_consult_cep = 'Não foi encontrado endereço para o CEP: %';
  error_consult_city = 'Não foi encontrado endereço para a rua: %';


   constructor(private appService: AppService, sanitizer: DomSanitizer){  }

   ngOnInit() {
    this.cepDiv = true;
   	this.endereco = new Endereco();
    this.appService.getUFList().subscribe((data:Uf[]) => 
        {this.ufs = data ; this.ufs.sort((a,b)=> a.sigla.localeCompare(b.sigla))}, 
          (err) => { console.log(err)});
   }


   onSubmit() {
     if(this.cidadeDiv === true){
       this.enderecos = [];
       this.ruaInvalid = false;
       console.log("Consulta: Cidade: " + this.cidade + " UF: " + this.uf + " Rua: " + this.rua);

        this.appService.getEnderecoList(this.uf, this.cidade.replace(" ", "%20"), this.rua)
          .subscribe((data:Endereco[]) =>  
             { console.log(data) ; 
                 if(data.length === 0){ 
                     this.msg_erro = this.error_consult_city.replace("%",""+this.rua);
                     this.ruaInvalid = true;
                   }; 
               this.enderecos = data; this.enderecos.sort((a,b)=> a.logradouro.localeCompare(b.logradouro))}, 
               (err) => { console.log(err)});

     }else{
       this.endereco = new Endereco();
        this.buscarCEP(); 
     } 
  }

  changeTipo(tipo: number) {
    this.endereco = new Endereco();
    this.enderecos = [];
    this.ruaInvalid = false;

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
      .subscribe((data:Cidade[]) => 
        {this.cidades = data; this.cidades.sort((a,b)=> a.nome.localeCompare(b.nome))},
         error => console.log(error));
  }

  buscarCEP(){
	console.log("CEP consultado: " + this.cep);
	
	this.appService.getCEP(this.cep)
      .subscribe(data => {
        console.log(data)
        this.endereco = data;
          if(this.endereco.erro === true){
            this.msg_erro = this.error_consult_cep.replace("%",""+this.cep);
          }
      }, error => console.log(error));
  }


}
