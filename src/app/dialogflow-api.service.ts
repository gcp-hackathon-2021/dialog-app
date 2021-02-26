import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
var dialogFlowUrl = 'https://us-central1-hack-gcpsailors.cloudfunctions.net/dialog-flow-clientfunction';
@Injectable({
  providedIn: 'root'
})
export class DialogflowApiService {
  messages = [];
  sessionId = Math.random().toString(36).slice(-5);

  constructor(private httpClient: HttpClient ) { }

  public getDialogResponse(longTextRequest: string){
    return this.httpClient.post( dialogFlowUrl, {
      sessionId: this.sessionId, 
      queryInput:{
        text :{
          text : longTextRequest,
          languageCode : 'en-IN'
        }
      }
    });
  }
}
