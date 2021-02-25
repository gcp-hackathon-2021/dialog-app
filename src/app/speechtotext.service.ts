import { Injectable } from '@angular/core';

declare var webkitSpeechRecognition: any;
@Injectable({
  providedIn: 'root'
})
export class SpeechtotextService {
  recognition =  new webkitSpeechRecognition();
  isStoppedSpeechRecog = false;
  text: string;
  tempWords: string;
  constructor() { }

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
    this.isStoppedSpeechRecog = false;
    this.recognition.start();
    console.log("Speech recognition started")
    this.recognition.addEventListener('end', (condition) => {
      if (this.isStoppedSpeechRecog) {
        this.recognition.stop();
        console.log("End speech recognition")
      } else {
        this.text=this.tempWords;
        this.tempWords = '';
        this.recognition.start();
      }
    });
    return this.text;
  }

  stopListening(){
    console.log("getting stopListening");
    this.isStoppedSpeechRecog = true;
    //this.wordConcat()
    this.recognition.stop();
    console.log("End speech recognition");
  }

  wordConcat() {
    //this.text.push(this.tempWords + '.');
    this.tempWords = '';
  }
}
