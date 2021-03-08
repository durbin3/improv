import { Component, OnInit } from '@angular/core';
import { Note, Duration, Tone, Chord, Tones, Key, Sheet } from '../core/note';
import Vex from 'vexflow';
import * as Tonejs from 'tone'

@Component({
  selector: 'app-stave',
  templateUrl: './stave.component.html',
  styleUrls: ['./stave.component.css']
})
export class StaveComponent implements OnInit {

  constructor() { }

  sheet = new Sheet(Key.fromString("C"),[
    Note.fromString('A/q'),
    Chord.fromString('(F,G,C)/q'),
    Note.fromString('A/q'),
    Chord.fromString('(A,C,F#)/q'),
  ])

  ngOnInit(): void {

  	const VF = Vex.Flow;

    const vf = new VF.Factory({
      renderer: {elementId: 'boo', width: 500, height: 200}
    });

    this.sheet.applyToStave(vf);
  }

  play(): void {
    this.sheet.play();
  }

}









