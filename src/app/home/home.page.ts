import { Component } from '@angular/core';
import {Platform} from '@ionic/angular';

import { ApiService } from '../api.service';
//import { SpeechtotextService } from '../speechtotext.service';
import { TexttospeechService } from '../texttospeech.service';
declare var webkitSpeechRecognition: any;
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  todos: string
  micon = false;
  micoff= true;
  recognition =  new webkitSpeechRecognition();
  isStoppedSpeechRecog = false;
  text: string;
  tempWords: string;
  constructor(private plt: Platform, private apiService: ApiService, private texttospeechService: TexttospeechService){}//, private speechRecognition : SpeechRecognition) {}

  isAndroid(){
    return !this.plt.is('ios');
  }
  
  getPermissions(){
    console.log("getting permission");
  }

  init() {
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-IN';
    this.recognition.addEventListener('result', (e) => {
      const transcript = Array.from(e.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join('');
      this.tempWords = transcript;
      console.log(transcript);
    });
  }

  startListening(){
    this.init();
    this.micon=true;
    this.micoff=false;
    this.isStoppedSpeechRecog = false;
    this.recognition.start();
    console.log("Speech recognition started")
    this.recognition.addEventListener('end', (condition) => {
      if (this.isStoppedSpeechRecog) {
        this.recognition.stop();
        console.log("End speech recognition")
      } else {
        this.text=this.tempWords;
        this.apiService.getNews(this.tempWords).subscribe((data)=>{
          this.todos = data['title'];
          this.texttospeechService.speak(this.todos);
          this.tempWords = '';
          setTimeout(()=>{this.recognition.start();},5000);          
        });        
      }
    });    
  }

  stopListening(){
    console.log("getting stopListening");
    this.micon=false;
    this.micoff=true;
    this.isStoppedSpeechRecog = true;
    this.recognition.stop();
    console.log("End speech recognition");
  }
}