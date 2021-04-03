import { Component, OnInit } from '@angular/core';
import { Note, Duration, Tone, Chord, Tones, Key, Sheet, TimeSignature } from '../core/note';

interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}

@Component({
  selector: 'app-music-generator',
  templateUrl: './music-generator.component.html',
  styleUrls: ['./music-generator.component.css']
})
export class MusicGeneratorComponent implements OnInit {

  mainsheet : Sheet = new Sheet(
    Key.fromString("C"),TimeSignature.fromString("3/4"),[]
  )

  constructor() { }

  ngOnInit(): void {
    console.log("changing")
    this.mainsheet = new Sheet(Key.fromString("C"),TimeSignature.fromString("3/4"),[
      Chord.fromString('A/8'),
      Chord.fromString('A/8'),
      Chord.fromString('(F,G,C)/8'),
      Chord.fromString('(F,G,C)/8'),
      Chord.fromString('A/8'),
      Chord.fromString('A/8'),
      Chord.fromString('(A,C,F#)/8'),
      Chord.fromString('(A,C,F#)/8'),
      Note.fromString('A/8'),
      Chord.fromString('(F,G,C)/8'),
      Chord.fromString('(F,G,C)/8'),
      Chord.fromString('A/16'),
      Chord.fromString('A/16'),
      Chord.fromString('A/16'),
      Chord.fromString('A/16'),
      Chord.fromString('(A,C,F#)/8'),
      Chord.fromString('(A,C,F#)/8')
    ]);
  }

  handleFileInput(inp:any) {
    if (inp==null) return;
    var files:FileList|null = (inp as HTMLInputEvent).target.files;
    if (files==null) return;
    console.log(files.item(0))
    // this.mainsheet = sheet.fromMidi("osijdfoa");
  }


}
