import { Component, OnInit } from '@angular/core';
import { Note, Duration, Tone, Chord, Tones, Key } from '../core/note';
import Vex from 'vexflow';
import * as Tonejs from 'tone'

@Component({
  selector: 'app-stave',
  templateUrl: './stave.component.html',
  styleUrls: ['./stave.component.css']
})
export class StaveComponent implements OnInit {

  constructor() { }


  notes = [
    Note.fromString('A/q'),
    Chord.fromString('(A,C,F#)/q'),
    Note.fromString('A/q'),
    Chord.fromString('(A,C,F#)/q'),
  ]

  ngOnInit(): void {

    // console.log('a#',Tone.fromString('a#').toString())


  	const VF = Vex.Flow;

    const vf = new VF.Factory({
      renderer: {elementId: 'boo', width: 500, height: 200}
    });

    const score = vf.EasyScore();
    const system = vf.System();

    var blah = "";
    for (var i=0;i<this.notes.length;i++) {
      blah = blah+this.notes[i].toString();
      if (i!=this.notes.length-1) blah = blah+", ";
    }
    console.log(blah)

    console.log("a",Key.fromString("a").toString());
    console.log("C",Key.fromString("C").toString());
    console.log("a minor",Key.fromString("a minor").toString());
    console.log("d dorian",Key.fromString("d dorian").toString());
    console.log("c major",Key.fromString("c major").toString());

    system.addStave({
      voices: [
        score.voice(score.notes(blah, {stem: 'up'}),{}),
        //score.voice(score.notes('C#4/h, C#4/h', {stem: 'down'}),{})
      ]
    }).addClef('treble').addKeySignature("C").addTimeSignature('4/4');

    vf.draw();
  }


  play(): void {
    const synth = new Tonejs.PolySynth().toDestination();
    var blah = new Duration(0,1);
    for (var i=0;i<this.notes.length;i++) {
      synth.triggerAttackRelease(this.notes[i].getTones().map(tone => tone.toString()), this.notes[i].duration.tonejs_repr(), "+"+blah.tonejs_transport_repr());
      blah = blah.plus(this.notes[i].duration);
    }
  }

}









