import { Component, OnInit, Input } from '@angular/core';
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

  @Input() sheet !: Sheet;
  ngOnChanges(): void {
    console.log("oidsfjoaisjdf")
    const VF = Vex.Flow;

    const vf = new VF.Factory({
      renderer: {elementId: 'boo', width: 1500, height: 200}
    });

    this.sheet.applyToStave(vf);

  }
  ngOnInit(): void {

  }

  play(): void {
    this.sheet.play();
  }

}









