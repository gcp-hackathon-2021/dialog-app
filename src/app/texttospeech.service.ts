import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TexttospeechService {
  msg;
  constructor() { }
  initSpeach(){
    this.msg = new SpeechSynthesisUtterance();
    var voices = window.speechSynthesis.getVoices();
    this.msg.voice = voices[1]; // Note: some voices don't support altering params
    //msg.voiceURI = 'native';
    this.msg.volume = 1; // 0 to 1
    this.msg.rate = 1; // 0.1 to 10
    this.msg.pitch = 1; //0 to 2
    this.msg.lang = 'en-IN';
    this.msg.onend = function(e) {
      console.log('Finished in ' + e.elapsedTime + ' seconds.');
    };
  }
  speak(resultText: string){
    this.msg.text = resultText;
    speechSynthesis.speak(this.msg);
  }
}
