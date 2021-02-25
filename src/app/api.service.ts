import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private httpClient: HttpClient) { }
  public getNews(id: string){
    return this.httpClient.get(`https://jsonplaceholder.typicode.com/todos/${id}`);
  }
}
