import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  //private baseUrl = 'http://localhost:3000/enderecos';

  constructor(private http: HttpClient) { }

  getCEP(cep: number): Observable<any> {
    //return this.http.get(`${this.baseUrl}?cep=${cep}`);
    return this.http.get(`https://viacep.com.br/ws/${cep}/json/`);
  }

  getUFList(): Observable<any> {
    return this.http.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados`)
  }

  getCidadeList(uf: string): Observable<any> {
    return this.http.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/distritos`);
  }

  getEnderecoList(uf: string, localidade: string, logradouro: string ): Observable<any> {
    return this.http.get(`https://viacep.com.br/ws/${uf}/${localidade}/${logradouro}/json/`);
  }


}