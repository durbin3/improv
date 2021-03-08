

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
  static fromString(name:String) : Tone {
    name = name.replace(/\s+/g, '').toLowerCase()
    var blah = 'e#'.match(/\d+/)
    return new Tone( ['a','a#','b','c','c#','d','d#','e','f','f#','g','g#'].indexOf(name.replace(/\d+/g,'')) + 12*(blah==null?4:(+blah)),!name.includes('@'));
  }
  toString() {
    if (this.sharped) return ['a','a#','b','c','c#','d','d#','e','f','f#','g','g#'][this.value%12]+Math.floor(this.value/12).toString()
    else              return ['a','b@','b','c','d@','d','e@','e','f','g@','g','a@'][this.value%12]+Math.floor(this.value/12).toString()
  }
}
export class Duration {
  numerator:number = 1;
  denominator:number = 1;
  constructor(a0:number,a1:number) {
    this.numerator=a0;
    this.denominator=a1;
  }
  static fromString(name:string) : Duration {
    name = name.replace(/\s+/g, '').toLowerCase()
    if (name=='q') return new Duration(1,1);
    if (name=='h') return new Duration(2,1);
    throw new Error('unrecognized duration');
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
  static fromString(name:string) : Note {
    var ah = name.replace(/\s+|\(|\)/g, '').toLowerCase().split("/");
    return new Note(Tone.fromString(ah[0]),Duration.fromString(ah[1]));
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
  static fromString(name:String) : Tones {
    return new Tones(name.split(',').map(n => Tone.fromString(n)));
  }
  toString() {
    var res = "";
    for (var i=0;i<this.tones.length;i++) {
      res = res+this.tones[i].toString();
      if (i!=this.tones.length-1) res = res+" ";
    }
    if (this.tones.length==1) return res;
    return "("+res+")"
  }
}


export class Chord {
  tones:Tones;
  duration:Duration;
  constructor(tones:Tones,duration:Duration) {
    this.tones = tones;
    this.duration = duration;
  }
  static fromString(name:string) : Chord {
    var ah = name.replace(/\s+|\(|\)/g, '').toLowerCase().split("/");
    return new Chord(Tones.fromString(ah[0]),Duration.fromString(ah[1]));
  }
  toString() {
    return this.tones.toString()+"/"+this.duration.toString()
  }
  getTones() {
    return this.tones.tones;
  }
}



export type Playable = Note | Chord;






export class Key {
  static fromString(name:string) {

  }
}
























