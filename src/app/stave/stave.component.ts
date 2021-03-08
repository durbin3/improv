import { Component, OnInit } from '@angular/core';
import Vex from 'vexflow';
import * as Tone from 'tone'

@Component({
  selector: 'app-stave',
  templateUrl: './stave.component.html',
  styleUrls: ['./stave.component.css']
})
export class StaveComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  	const VF = Vex.Flow;

    const vf = new VF.Factory({
      renderer: {elementId: 'boo', width: 500, height: 200}
    });

    const score = vf.EasyScore();
    const system = vf.System();

    system.addStave({
      voices: [
        score.voice(score.notes('C#5/q, B4/q, A4/q, G#4/q', {stem: 'up'}),{}),
        score.voice(score.notes('C#4/h, C#4/h', {stem: 'down'}),{})
      ]
    }).addClef('treble').addTimeSignature('4/4');

    vf.draw();
  }


  play(): void {
    const synth = new Tone.Synth().toDestination();

    //play a middle 'C' for the duration of an 8th note
    synth.triggerAttackRelease("C4", "8n");
  }

}
