import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NaicsService {
  private apiUrl = 'http://127.0.0.1:8080/codes'; // FastAPI endpoint
  private modApi = 'http://127.0.0.1:8080/codes/mods/quantitative'; // FastAPI endpoint

  constructor(private http: HttpClient) {}

  getNaicsCodes(): Observable<{ [key: string]: { description: string, premium: number } }> {
    return this.http.get<{ [key: string]: { description: string, premium: number } }>(this.apiUrl);
  }
  getModifiers(): Observable<{ [key: string]: { type: string, description: string, factor: number } }> {
    return this.http.get<{ [key: string]: { type: string, description: string, factor: number } }>(this.modApi);
  }
  
}
