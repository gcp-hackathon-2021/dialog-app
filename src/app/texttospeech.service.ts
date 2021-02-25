import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TexttospeechService {

  constructor() { }
  speak(resultText: string){
    var msg = new SpeechSynthesisUtterance();
    var voices = window.speechSynthesis.getVoices();
    msg.voice = voices[1]; // Note: some voices don't support altering params
    //msg.voiceURI = 'native';
    msg.volume = 1; // 0 to 1
    msg.rate = 1; // 0.1 to 10
    msg.pitch = 1; //0 to 2
    msg.text = resultText;
    msg.lang = 'en-IN';
    console.debug;
    msg.onend = function(e) {
      console.log('Finished in ' + e.elapsedTime + ' seconds.');
    };

    speechSynthesis.speak(msg);
  }
}
