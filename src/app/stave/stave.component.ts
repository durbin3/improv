import { Component, OnInit } from '@angular/core';
import { Note, Duration, Tone } from '../core/note';
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
    new Note(new Tone(3),new Duration('q')),
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

    system.addStave({
      voices: [
        score.voice(score.notes(blah, {stem: 'up'}),{}),
        score.voice(score.notes('C#4/h, C#4/h', {stem: 'down'}),{})
      ]
    }).addClef('treble').addTimeSignature('4/4');

    vf.draw();
  }


  play(): void {
    const synth = new Tonejs.Synth().toDestination();
    console.log("boop")
    const now = Tonejs.now()
    //play a middle 'C' for the duration of an 8th note
    synth.triggerAttack("C4", now);
    synth.triggerAttack("G4", now);
    synth.triggerAttack("E4", now);
    synth.triggerRelease(["C4", "G4", "E4", "C5", "E5"], now + 4);

  }

}









