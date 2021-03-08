

function lcm(x:number,y:number) {
  return (!x || !y) ? 0 : (x * y) / gcd(x, y);
}
function gcd(x:number,y:number) {
  while(y) {
    var t = y;
    y = x % y;
    x = t;
  }
  return x;
}

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
  constructor(a0:string|number,a1?:number) {
    if (a0=='q') {this.numerator=1;this.denominator=1;}
    if (a0=='h') {this.numerator=2;this.denominator=1;}
    if (a1!=undefined) {this.numerator=a0 as number;this.denominator=a1;}
  }
  plus(other:Duration):Duration {
    var nn = this.numerator * other.denominator + this.denominator * other.numerator;
    var dd = this.denominator * other.denominator;
    var gc = gcd(nn,dd);
    return new Duration(nn/gc,dd/gc);
  }
  toString() : string {
    if (this.numerator==1 && this.denominator==1) return "q";
    if (this.numerator==2 && this.denominator==1) return "h";
    return "null"
  }
  tonejs_repr() : string {
    if (this.numerator==1 && this.denominator==1) return "4n";
    if (this.numerator==2 && this.denominator==1) return "2n";
    return "null"
  }
  tonejs_transport_repr() : string {
    if (4%this.denominator!=0) return "null";
    var nn = this.numerator * (4/this.denominator);
    return Math.floor(nn/16)+":"+(Math.floor(nn/4)%4)+":"+(nn%4);
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
  getTones() {
    return [this.tone];
  }
}


export class TonesDesignation {

}


export class Tones {
  tones:Array<Tone>;
  constructor(tones:Array<Tone>) {
    this.tones = tones;
  }
  toString() {
    var res = "(";
    for (var i=0;i<this.tones.length;i++) {
      res = res+this.tones[i].toString();
      if (i!=this.tones.length-1) res = res+".";
    }
    return res+")"
  }
}


export class Chord {
  tones:Tones;
  duration:Duration;
  constructor(tones:Tones,duration:Duration) {
    this.tones = tones;
    this.duration = duration;
  }
  toString() {
    return this.tones.toString()+"/"+this.duration.toString()
  }
  getTones() {
    return this.tones.tones;
  }
}



export type Playable = Note | Chord;

















