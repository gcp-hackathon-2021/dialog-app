import { Component } from '@angular/core';
import {Platform} from '@ionic/angular';

import { ApiService } from '../api.service';
import { DialogflowApiService } from '../dialogflow-api.service';
//import { SpeechtotextService } from '../speechtotext.service';
import { TexttospeechService } from '../texttospeech.service';
//declare var webkitSpeechRecognition: any;
var SpeechRecognition: any = SpeechRecognition || window["webkitSpeechRecognition"];
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {
  todos: string
  micon = false;
  micoff= true;
  recognition:SpeechRecognition;
  conversationHistory:Conversation[]=new Array();
  isStoppedSpeechRecog = false;
  text: string;
  tempWords: string;
  constructor(private plt: Platform, private apiService: ApiService, 
    private texttospeechService: TexttospeechService, private dialogflowApiService: DialogflowApiService){}

  isAndroid(){
    return !this.plt.is('ios');
  }
  
  getPermissions(){
    console.log("getting permission");
  }

  init() {
    this.recognition =  new SpeechRecognition();
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-IN';
    // this.recognition.onresult = function(event) {
    //   const transcript = Array.from(event.results)
    //        .map((result) => result[0])
    //        .map((result) => result.transcript)
    //        .join('');
    //      this.tempWords = transcript;
    //      console.log(transcript);
    // }
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
    if(!this.recognition || this.recognition===null ){
      this.init();
    }    
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
          setTimeout(()=>{this.recognition.start();},100);
        }else{
          this.dialogflowApiService.getDialogResponse(this.tempWords).subscribe((data:any)=>{
            this.todos = data.fulfillmentText;
            var conversation = new Conversation(this.text, this.todos);
            this.conversationHistory.push(conversation);
            this.tempWords = '';
            this.texttospeechService.speak(this.todos);
            setTimeout(()=>{ 
              if(this.recognition && this.recognition!==null ){             
                this.recognition.start();
              }
            },5000);
          }, error =>{
            console.error('error caught in component');
            this.tempWords = '';
            var errormsg = "I can't understant";
            var conversation = new Conversation(this.text, errormsg);
            this.conversationHistory.push(conversation);
            this.texttospeechService.speak(errormsg);
            setTimeout(()=>{
              if(this.recognition && this.recognition!==null ){             
                this.recognition.start();
              }
            },1000);
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
    setTimeout(()=>{this.recognition=null;},1000);    
    console.log("End speech recognition");
  }
}



class Conversation { 
  //field 
  question:string; 
  answer:string; 
  //constructor 
  constructor(question:string, answer:string) { 
    this.question = question;
    this.answer = answer;
  }  
  
  //function 
  disp():void { 
     console.log(this.question+":"+this.answer);
  } 
} 