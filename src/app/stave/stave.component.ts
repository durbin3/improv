import { Component, OnInit } from '@angular/core';
import { Note, Duration, Tone, Chord, Tones, Key, Sheet, TimeSignature } from '../core/note';
import Vex from 'vexflow';
import * as Tonejs from 'tone'

@Component({
  selector: 'app-stave',
  templateUrl: './stave.component.html',
  styleUrls: ['./stave.component.css']
})
export class StaveComponent implements OnInit {

  constructor() { }

  sheet : any = null;

  ngOnInit(): void {

  	const VF = Vex.Flow;

    const vf = new VF.Factory({
      renderer: {elementId: 'boo', width: 1500, height: 200}
    });

    var notes = [
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
    ]

    this.sheet = new Sheet(Key.fromString("C"),TimeSignature.fromString("3/4"),notes);
    this.sheet.applyToStave(vf);


    const vf2 = new VF.Factory({
      renderer: {elementId: 'boo2', width: 1500, height: 200}
    });
    new Sheet(Key.fromString("D"),TimeSignature.fromString("6/8"),notes).applyToStave(vf2)
  }

  play(): void {
    this.sheet.play();
  }

}









