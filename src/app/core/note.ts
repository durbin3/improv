



enum IntervalQuality {
  Major,
  Minor,
  Perfect,
  Diminished,
  Augmented
}


class Interval {
  quality?:IntervalQuality;
  amount:number;
  upwards:boolean;
  constructor(amount:number,quality?:IntervalQuality) {
    this.amount = amount;
    this.quality = quality;
    this.upwards = amount>=0;
  }
}


class ToneDesignation {
  value: number;
  sharped : boolean;
  constructor(value:number,sharped?:boolean) {
    this.value = value%12;
    this.sharped = sharped;
  }

}


class Tone {
  value: number;
  sharped : boolean;
  constructor(value:number,sharped?:boolean) {
    this.value = value;
    this.sharped = sharped;
  }
  toString() {
    if (this.sharped) return ['a','a#','b','c','c#','d','d#','e','f','f#','g','g#'][value%12]+Math.floor(value/12).toString()
    else              return ['a','a#','b','c','c#','d','d#','e','f','f#','g','g#'][value%12]+Math.floor(value/12).toString()

    }
    
  }
}
class Duration {
  numerator:number;
  denominator:number;
  constructor(strrepr:string) {
    if (strrepr=='q') {numerator=1;denominator=1;}
    if (strrepr=='h') {numerator=2;denominator=1;}
  }
  toString() {
    if (numerator==1 && denominator==1) return "q";
    if (numerator==2 && denominator==1) return "h";
  }
}
class Note {
  tone:Tone;
  duration:number;
  constructor(tone:Tone,duration:number) {
    this.tone = tone;
    this.duration = duration;
  }
  toString() {
    return tone.toString()+duration.toString()
  }
}




class ChordDesignation {

}


class Chord {

}











