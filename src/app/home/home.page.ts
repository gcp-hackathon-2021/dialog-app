import { Component } from '@angular/core';
import {Platform} from '@ionic/angular';

import { ApiService } from '../api.service';
//import { SpeechtotextService } from '../speechtotext.service';
import { TexttospeechService } from '../texttospeech.service';
declare var webkitSpeechRecognition: any;
var SpeechRecognition: any = SpeechRecognition || webkitSpeechRecognition;
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  todos: string
  micon = false;
  micoff= true;
  recognition =  new SpeechRecognition();
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
    this.recognition.onresult = function(event) {
      const transcript = Array.from(event.results)
           .map((result) => result[0])
           .map((result) => result.transcript)
           .join('');
         this.tempWords = transcript;
         console.log(transcript);
    }
    this.recognition.onaudiostart = function() {
      console.log('Audio capturing started');
    }
    // this.recognition.addEventListener('result', (e) => {
    //   const transcript = Array.from(e.results)
    //     .map((result) => result[0])
    //     .map((result) => result.transcript)
    //     .join('');
    //   this.tempWords = transcript;
    //   console.log(transcript);
    // });
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
        this.stopListening();
        console.log("End speech recognition")
      } else {
        this.text=this.tempWords;
        console.log(this.tempWords);
        if(!this.tempWords || ""===this.tempWords || undefined===this.tempWords){
          this.tempWords = '';     
          setTimeout(()=>{this.stopListening();},100);
        }else{
          this.apiService.getNews(this.tempWords).subscribe((data)=>{
            this.todos = data['title'];
            this.tempWords = '';
            this.texttospeechService.speak(this.todos);
          },(error) => {
            console.error('error caught in component');
            this.tempWords = '';     
            setTimeout(()=>{this.recognition.start();},100);
          });
        }
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
