import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GoogleSheetsService {
  // PEGA AQUÍ TU URL DEL SCRIPT DE GOOGLE (La que termina en /exec)
  private scriptUrl = 'https://script.google.com/macros/s/AKfycbxyISn-E9vstcBFn76SuNIr1TEMlQaBgthrbpQ_dQQhgON1pffhvfu6VL0cY502rPF2/exec'; 

  constructor(private http: HttpClient) { }

  submitData(data: any): Observable<any> {
    return this.http.post(this.scriptUrl, JSON.stringify(data), {
      responseType: 'text' 
    });
  }
}