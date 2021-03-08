

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
  absolute() : Interval {
    if (!this.upwards) return new Interval(12-this.amount);
    return this
  }
}


export class ToneDesignation {
  value: number;
  sharped : boolean;
  constructor(value:number,sharped?:boolean) {
    this.value = ((value%12) + 12) % 12;
    if (sharped==undefined) this.sharped = true;
    else this.sharped = sharped;
  }
  to(other:Tone):Interval {
    return new Interval(other.value-this.value).absolute();
  }
  plus(other:Interval):ToneDesignation {
    return new ToneDesignation(this.value+other.amount,this.sharped);
  }
  inOctave(octave:number) : Tone {
    return new Tone(this.value+octave*12);
  }
  static fromString(name:String) : ToneDesignation {
    name = name.replace(/\s+/g, '').toLowerCase()
    var sharped = true;
    if (name.length==0) throw new Error('unrecognized tone');
    var toneindex = ({'a':0,'b':2,'c':3,'d':5,'e':7,'f':8,'g':10} as Record<string,number>)[name[0]];
    if (toneindex==undefined || name.length>2) throw new Error('unrecognized tone');
    if (name.length==2) {
      if (name[1]=='#') toneindex++;
      else if (name[1]=='@') {
        toneindex--;
        sharped = false;
      } else throw new Error('unrecognized tone');
    }
    return new ToneDesignation(toneindex,sharped);
  }
  toString() : string {
    if (this.sharped) return ['a','a#','b','c','c#','d','d#','e','f','f#','g','g#'][this.value%12]
    else              return ['a','b@','b','c','d@','d','e@','e','f','g@','g','a@'][this.value%12]
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
  to(other:Tone):Interval {
    return new Interval(other.value-this.value);
  }
  plus(other:Interval):Tone {
    return new Tone(this.value+other.amount,this.sharped);
  }
  general():ToneDesignation {
    return new ToneDesignation(this.value,this.sharped);
  }
  static fromString(name:String) : Tone {
    name = name.replace(/\s+/g, '').toLowerCase()
    var blah = name.match(/\d+/)
    name = name.replace(/\d+/g,'')
    return ToneDesignation.fromString(name).inOctave(blah==null?4:(+blah));
  }
  toString() : string {
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
    this.tones.sort((a, b) => (a.value > b.value) ? 1 : -1)
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
  tones:Array<ToneDesignation>;
  enharmonic:string;

  static fromString(name:string) {
    name = name.replace(/\s+/g, '');
    var key = name[0];
    var mode = name.substring(1);
    if (mode.length>0 && (mode[0]=='@' || mode[0]=='#')) {
      key = key+mode[0]
      mode = mode.substring(1);
    }
    var root = ToneDesignation.fromString(key);
    var enharmonic = root;
    if (mode.length==0) {
      mode = (key[0]==key[0].toUpperCase())?'major':'minor';
    }
    mode = mode.toLowerCase();
    var intervals = '2212221'
    if (mode.startsWith('harmonic')) {
      intervals = '3121221';
      mode = mode.substring('harmonic'.length);
    }
    if (mode == 'minor') mode = 'aeolian'
    if (mode == 'major') mode = 'ionian'
    var derrangement = ['ionian','dorian','phrygian','lydian','mixolydian','aeolian','locrian'].indexOf(mode);
    if (derrangement==-1) throw new Error('Mode not recognized');
    for (;derrangement>0;derrangement--) {
      enharmonic = enharmonic.plus(new Interval(-parseInt(intervals[0])));
      intervals = intervals.substring(1)+intervals[0];
      //intervals = intervals[6]+intervals.substring(0,6);
    }
    var tones = [];
    for (var i=0;i<7;i++) {
      tones.push(root);
      root = root.plus(new Interval(parseInt(intervals[i])));
    }
    return new Key(tones,enharmonic.toString());
  }
  constructor(tones:Array<ToneDesignation>,enharmonic:string) {
    this.tones = tones;
    this.enharmonic = enharmonic;
  }
  toString() {
    var res = "key<";
    for (var i=0;i<this.tones.length;i++) {
      res = res+this.tones[i].toString()+" ";
    }
    return res+"| enharmonic = "+this.enharmonic+">"
  }
}
























