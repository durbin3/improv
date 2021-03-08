



export enum IntervalQuality {
  Major,
  Minor,
  Perfect,
  Diminished,
  Augmented
}


export class Interval {
  quality?:IntervalQuality;
  amount:number;
  upwards:boolean;
  constructor(amount:number,quality?:IntervalQuality) {
    this.amount = amount;
    this.quality = quality;
    this.upwards = amount>=0;
  }
}


export class ToneDesignation {
  value: number;
  sharped : boolean;
  constructor(value:number,sharped?:boolean) {
    this.value = value%12;
    if (sharped==undefined) this.sharped = true;
    else this.sharped = sharped;
  }
}

export class Tone {
  value: number;
  sharped : boolean;
  constructor(value:number,sharped?:boolean) {
    this.value = value;
    if (sharped==undefined) this.sharped = true;
    else this.sharped = sharped;
  }
  toString() {
    if (this.sharped) return ['a','a#','b','c','c#','d','d#','e','f','f#','g','g#'][this.value%12]+Math.floor(4+this.value/12).toString()
    else              return ['a','b@','b','c','d@','d','e@','e','f','g@','g','a@'][this.value%12]+Math.floor(4+this.value/12).toString()
  }
}
export class Duration {
  numerator:number = 1;
  denominator:number = 1;
  constructor(strrepr:string) {
    if (strrepr=='q') {this.numerator=1;this.denominator=1;}
    if (strrepr=='h') {this.numerator=2;this.denominator=1;}
  }
  toString() {
    if (this.numerator==1 && this.denominator==1) return "q";
    if (this.numerator==2 && this.denominator==1) return "h";
    return "null"
  }
}
export class Note {
  tone:Tone;
  duration:Duration;
  constructor(tone:Tone,duration:Duration) {
    this.tone = tone;
    this.duration = duration;
  }
  toString() {
    return this.tone.toString()+"/"+this.duration.toString()
  }
}




export class TonesDesignation {

}


export class Tones {

}


export class Chord {

}








