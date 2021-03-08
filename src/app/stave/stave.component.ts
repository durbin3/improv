import { Component, OnInit } from '@angular/core';
import { Note, Duration, Tone, Chord, Tones } from '../core/note';
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
    new Note(new Tone(3),new Duration('q')),
    new Note(new Tone(3),new Duration('q')),
    new Note(new Tone(3),new Duration('q')),//new Chord(new Tones([new Tone(3),new Tone(6),new Tone(10)]),new Duration('q')),
    new Note(new Tone(3),new Duration('q'))
  ]

  ngOnInit(): void {




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

    system.addStave({
      voices: [
        score.voice(score.notes(blah, {stem: 'up'}),{}),
        //score.voice(score.notes('C#4/h, C#4/h', {stem: 'down'}),{})
      ]
    }).addClef('treble').addTimeSignature('4/4');

    vf.draw();
  }


  play(): void {
    const synth = new Tonejs.Synth().toDestination();
    var blah = new Duration(0,1);
    for (var i=0;i<this.notes.length;i++) {
      this.notes[i].getTones().forEach(tone => {
        synth.triggerAttackRelease(tone.toString(), this.notes[i].duration.tonejs_repr(), "+"+blah.tonejs_transport_repr());
      })
      blah = blah.plus(this.notes[i].duration);
    }
  }

}









