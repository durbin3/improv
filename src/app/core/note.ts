
import Vex from 'vexflow';
import * as Tonejs from 'tone'




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

function relative_tone(
  value: number,
  sharped : boolean,
  key?:{sharped:boolean,lettertones:Array<number>}
) : [string,number] {
  var defaultTones : Array<number> = [0,2,4,5,7,9,11];
  var tonedict = key==null?defaultTones:key.lettertones;
  sharped = key==null?sharped:key.sharped;
  var or_index = tonedict.indexOf(value%12);
  if (or_index!=-1) return ['CDEFGAB'[or_index],value];
  or_index = defaultTones.indexOf(value%12);
  if (or_index!=-1) {
    tonedict[or_index] = defaultTones[or_index];
    return ['CDEFGAB'[or_index]+'n',value];
  }
  var accidentals = "";
  var hack = 0;
  while ((or_index = tonedict.indexOf((value+12)%12))==-1) {
    if (sharped) {
      value = value-1;
      hack++;
      accidentals = accidentals+"#";
    } else {
      value = value+1;
      hack--; 
      accidentals = accidentals+"b";
    }
  }
  tonedict[or_index]+=hack;
  return ['CDEFGAB'[or_index]+accidentals,value];
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
    var toneindex = ({'c':0,'d':2,'e':4,'f':5,'g':7,'a':9,'b':11} as Record<string,number>)[name[0]];
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
  toString(key?:{sharped:boolean,lettertones:Array<number>}) : string {
    return relative_tone(this.value,this.sharped,key)[0];
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
  toString(key?:{sharped:boolean,lettertones:Array<number>}) : string {
    var reltone = relative_tone(this.value,this.sharped,key);
    return reltone[0]+Math.floor(reltone[1]/12).toString()
  }
}

export class Duration {
  numerator:number = 1;
  denominator:number = 1;
  constructor(a0:number,a1:number) {
    var gc = gcd(a0,a1);
    this.numerator=a0/gc;
    this.denominator=a1/gc;
  }
  static fromString(name:string) : Duration {
    name = name.replace(/\s+/g, '').toLowerCase()
    if (name=='q' || name=='4') return new Duration(1,4);
    if (name=='h' || name=='2') return new Duration(1,2);
    if (name=='8') return new Duration(1,8);
    if (name=='16') return new Duration(1,16);
    throw new Error('unrecognized duration');
  }
  plus(other:Duration):Duration {return new Duration(this.numerator * other.denominator + this.denominator * other.numerator,this.denominator * other.denominator);}
  minus(other:Duration):Duration {return new Duration(this.numerator * other.denominator - this.denominator * other.numerator,this.denominator * other.denominator);}
  floordiv(other:Duration):number {return Math.floor((this.numerator * other.denominator) / (this.denominator * other.numerator));}
  ceildiv(other:Duration):number {return Math.ceil((this.numerator * other.denominator) / (this.denominator * other.numerator));}
  times(other:number):Duration {return new Duration(this.numerator * other,this.denominator);}
  split(other:number):Duration {return new Duration(this.numerator,this.denominator * other);}
  mod(other:Duration):Duration {return this.minus(other.times(this.floordiv(other)));}
  upmod(other:Duration):Duration {return this.minus(other.times(this.ceildiv(other)-1));}
  eq(other:Duration):boolean {return this.numerator * other.denominator == this.denominator * other.numerator;}
  lt(other:Duration):boolean {return this.numerator * other.denominator < this.denominator * other.numerator;}
  gt(other:Duration):boolean {return this.numerator * other.denominator > this.denominator * other.numerator;}
  lteq(other:Duration):boolean {return this.numerator * other.denominator <= this.denominator * other.numerator;}
  gteq(other:Duration):boolean {return this.numerator * other.denominator >= this.denominator * other.numerator;}
  toString() : string {
    if (this.numerator==1 && this.denominator==1) return "w";
    if (this.numerator==1) return ""+this.denominator;
    return "null"
  }
  tonejs_repr() : string {
    if (this.numerator==1 && this.denominator==16) return "16n";
    if (this.numerator==1 && this.denominator==8) return "8n";
    if (this.numerator==1 && this.denominator==4) return "4n";
    if (this.numerator==1 && this.denominator==2) return "2n";
    return "null"
  }
  tonejs_transport_repr() : string {
    if (16%this.denominator!=0) return "null";
    var nn = this.numerator * (16/this.denominator);
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
  toString(key?:{sharped:boolean,lettertones:Array<number>}) {
    return this.tone.toString(key)+"/"+this.duration.toString()
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
  toString(key?:{sharped:boolean,lettertones:Array<number>}) {
    var res = "";
    for (var i=0;i<this.tones.length;i++) {
      res = res+this.tones[i].toString(key);
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
  toString(key?:{sharped:boolean,lettertones:Array<number>}) {
    return this.tones.toString(key)+"/"+this.duration.toString()
  }
  getTones() {
    return this.tones.tones;
  }
}
export class Rest {
  duration:Duration;
  constructor(duration:Duration) {
    this.duration = duration;
  }
  static fromString(name:string) : Rest {
    return new Rest(Duration.fromString(name));
  }
  toString(key?:{sharped:boolean,lettertones:Array<number>}) {
    return "B4/"+this.duration.toString()+"/r";
  }
  getTones() {
    return [];
  }
}



export type Playable = Note | Chord | Rest;






export class Key {
  tones:Array<ToneDesignation>;
  enharmonic:ToneDesignation;

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
    var related_intervals = '2212221'
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
      enharmonic = enharmonic.plus(new Interval(-parseInt(related_intervals[0])));
      intervals = intervals.substring(1)+intervals[0];
      related_intervals = related_intervals.substring(1)+related_intervals[0];
    }
    var tones = [];
    for (var i=0;i<7;i++) {
      tones.push(root);
      root = root.plus(new Interval(parseInt(intervals[i])));
    }
    var fifths = (enharmonic.value*7)%12;
    var sharpamts = [0,1,2,3,4,5,6,7,undefined,undefined,undefined,undefined];
    var flatamts = [0,undefined,undefined,undefined,undefined,7,6,5,4,3,2,1];
    if (enharmonic.sharped && sharpamts[fifths]==undefined) enharmonic = new ToneDesignation(enharmonic.value,false);
    if (!enharmonic.sharped && flatamts[fifths]==undefined) enharmonic = new ToneDesignation(enharmonic.value,true);
    return new Key(tones,enharmonic);
  }
  constructor(tones:Array<ToneDesignation>,enharmonic:ToneDesignation) {
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
  get_implicit_tones() : Array<number> {
    var fifths = (this.enharmonic.value*7)%12;
    var toneindex : Array<number> = [0,2,4,5,7,9,11];
    if (this.enharmonic.sharped) {
      var amt = [0,1,2,3,4,5,6,7,undefined,undefined,undefined,undefined][fifths]!;
      var order = 'FCGDAEB';
      for (var i=0;i<amt;i++) toneindex['CDEFGAB'.indexOf(order[i])]++;
    } else {
      var amt = [0,undefined,undefined,undefined,undefined,7,6,5,4,3,2,1][fifths]!;
      var order = 'BEADGCF';
      for (var i=0;i<amt;i++) toneindex['CDEFGAB'.indexOf(order[i])]--;
    }
    return toneindex;
  }
}



export class TimeSignature {
  shelves:Array<Array<number>>;
  base:number;
  constructor(shelves:Array<Array<number>>,base:number) {
    this.shelves = shelves;
    this.base = base;
    if (this.shelves[this.shelves.length-1].length!=1) throw new Error('wrong internal format for time sig');
  }
  beats() : number {
    var a = 0;
    for (var i=0;i<this.shelves[0].length;i++) a+=this.shelves[0][i];
    return a;
  }
  toString() {
    return this.beats()+'/'+this.base;
  }
  measurelength() : Duration {
    return new Duration(this.beats(),this.base);
  }
  static fromString(name:string) : TimeSignature {
    var com = name.replace(/\s+|\(|\)/g, '').toLowerCase().split('/');
    if (com.length!=2) throw new Error("unrecognized time signature format");
    var numerators = com[0].split('+').map(y => parseInt(y));
    var denominator = parseInt(com[1]);
    function is_not_pow_2(x:number):boolean {
      while (x%2==0) x/=2;
      return x!=1;
    }
    if (is_not_pow_2(denominator)) throw new Error("time signature too strange");
    numerators = numerators.reduce((prev:Array<number>,num:number) => {
      function has_nonsimple_factor(x:number):boolean {
        while (x%2==0) x/=2;
        while (x%3==0) x/=3;
        return x!=1;
      }
      while (has_nonsimple_factor(num)) {
        if (num%2!=0) {prev = prev.concat([3]);num-=3;}
        else          {prev = prev.concat([2]);num-=2;}
      }
      return prev.concat([num]);
    },[]);
    var alt = numerators.map(numerator => {
      if (numerator==1) return [[1]];
      var num = numerator;
      var try_compound = denominator%8==0;
      var divisions:Array<number> = []
      while (num%3==0 && try_compound) {divisions.push(3);num/=3;}
      while (num%2==0) {divisions.push(2);num/=2;}
      while (num%3==0) {divisions.push(3);num/=3;}
      var res:Array<Array<number>> = [];
      divisions.forEach(x => {
        numerator/=x;
        res.push(Array(numerator).fill(x));
      });
      return res;
    })
    if (alt.length==1) return new TimeSignature(alt[0],denominator);
    var maxlen = Math.max.apply(null,alt.map(o=>o.length));
    alt.forEach(com=>{while (com.length<maxlen) com.push([1]);});
    return new TimeSignature(alt.reduce((a, b) => a.map((v, i) => v.concat(b[i]))).concat([[alt.length]]),denominator);
  }
  arrange(arr:Array<Playable>) : Array<Array<{beamed:boolean,notes:Array<Playable>}>> {
    var ml = this.measurelength();
    var shelflength : Array<Array<Duration>> = [this.shelves[0].map(x => new Duration(x,this.base))];
    this.shelves.forEach((xs,j) => {//this constructs the duration corresponding to each entry in the shelf object.
      if (j==0) return;
      var i=0;
      shelflength.push(xs.map(y => {
        var sum = shelflength[j-1][i];y--,i++;
        for (;y>0;y--,i++) sum = sum.plus(shelflength[j-1][i]);
        return sum;
      }));
    });
    if (this.beats()*(8/this.base)>4) shelflength.splice(shelflength.length-1);//This line is responsible for ensuring you don't bridge the outermost grouping of notes (i.e. you don't bridge across the middle, or across either middle for triplet time (behaves weirdly for additive time signatures))
    var output : Array<Array<{beamed:boolean,notes:Array<Playable>}>> = [];
    var co = new Duration(0,1);//the current amount of duration into each measure that the currently considered list of nodes stretches into
    var i=0;//sentry var
    arr = arr.concat([]);//shallow-copies arr so that when you modify it by adding rests to the end it won't modify the original list of nodes.
    while (i<arr.length) {//this iterates for each measure
      var k=i;//first index of the measure, inclusive (at the end of the following loop, i will be the last index of the measure, exclusive)
      var beamdex:Array<[number,number,Duration,boolean]> = [];//current list of beamed notes
      for (;co.lt(ml);i++) {//this iterates over each note in the measure
        if (i==arr.length) {//this statement is responsible for padding the end of the note array with rests if you don't have enough notes to complete the measure
          arr.push(new Rest(new Duration(1,ml.minus(co).denominator)));//wonky here so that rests of irregular length are broken up into smaller rests that the code will know how to represent
        }
        co = co.plus(arr[i].duration);
        if (arr[i].duration.lt(Duration.fromString('q'))) {//quarter notes and larger are not considered beamable, and the program should not attempt to beam over them.
          var verdim:Array<Duration> = [];//list of durations of legal groupings that end on the currently considered note, sorted in descending order
          for (var j=shelflength.length-1;;j--) {//iterate over each possible grouping of notes (grouped by beat, grouped by next level... grouped by measure)
            var bco = co;
            var vl:Duration;
            if (j<0) {//j<-1 represents splitting up base notes. j==-1 represents base notes. j==0 represents the beats. j==shelf.length-1 represents the whole measure.
              bco = bco.upmod(new Duration(1,this.base));
              vl = new Duration(1,this.base*Math.pow(2,-1-j));
            } else {
              var u=0;
              for (;bco.gt(shelflength[j][u]);u++) bco = bco.minus(shelflength[j][u]);
              vl = shelflength[j][u];
            }
            if (vl.lteq(arr[i].duration)) break//don't attempt to use a note to form a group which has smaller duration than the note itself
            if (bco.eq(vl) && (verdim.length==0 || !verdim[verdim.length-1].eq(vl))) verdim.push(vl);//shed duplicate group lengths and only consider the interval if it ends when the note ends.
          }
          var safej = i;
          var safeko = arr[i].duration;
          var isrest = arr[i].getTones().length==0;
          if (!isrest) {
            for (var l=verdim.length-1;l>=0;l--) {//this part combines beam groups including the very last note by looking backwards from that note.
              var t=beamdex.length-1;
              var j=safej;
              var ko=safeko;
              var lastrest = false;
              while (ko.lt(verdim[l]) && t>=0 && beamdex[t][1]==j) {
                ko = ko.plus(beamdex[t][2]);
                lastrest = beamdex[t][3];
                j = beamdex[t--][0];
              }
              if (ko.eq(verdim[l]) && !lastrest) {
                beamdex.splice(t+1);
                safej = j;
                safeko = ko;
              } else break;
            }
          }
          beamdex.push([safej,i+1,safeko,isrest]);
        }
      }
      co = co.minus(ml);//now that the groups have been processed, convert them to the format that this function is expected to output.
      var row : Array<{beamed:boolean,notes:Array<Playable>}> = []//same as beamdex, but in the desired output format. (including the notes themselves rather than indecies into the nodes, and also including unbeamed notes.)
      var unbeamed : Array<Playable> = [];
      var l = 0;
      for (var j=k;j<i;) {
        if (l<beamdex.length && beamdex[l][0]==j) {
          if (beamdex[l][1]==beamdex[l][0]+1) l++
          else {
            if (unbeamed.length) {
              row.push({beamed:false,notes:unbeamed});
              unbeamed = [];
            }
            row.push({beamed:true,notes:arr.slice(beamdex[l][0],beamdex[l][1])});
            j = beamdex[l++][1];
            continue
          }
        }
        unbeamed.push(arr[j++]);
      }
      if (unbeamed.length) row.push({beamed:false,notes:unbeamed});
      output.push(row);
    }
    return output;
  }
}





export class Sheet {
  key:Key;
  timesig:TimeSignature;
  notes:Array<Playable>;
  constructor(key:Key,timesig:TimeSignature,notes:Array<Playable>) {
    this.key = key;
    this.timesig = timesig;
    this.notes = notes;
  }


  applyToStave(vf:Vex.Flow.Factory) {
    var score = vf.EasyScore();
    score.set({ time: this.timesig.toString() });
    var offset = 0;
    this.timesig.arrange(this.notes).forEach((x,measure_index) => {
      console.log("one measure: ",x);
      var measure_width = measure_index==0?320:300;
      var system = vf.System({x:offset,width:measure_width});
      offset += measure_width;
      var tonerepr = {
        sharped:this.key.enharmonic.sharped,
        lettertones:this.key.get_implicit_tones()
      }
      var notelist = x.reduce((umu, y) => {
        var blah = "";
        for (var i=0;i<y.notes.length;i++) {
          blah = blah+y.notes[i].toString(tonerepr);
          if (i!=y.notes.length-1) blah = blah+", ";
        }
        console.log(blah)
        return umu.concat(y.beamed?score.beam(score.notes(blah)):score.notes(blah));
      },score.notes(""));

      var stave = system.addStave({
        voices: [
          //score.voice(score.notes(blah, {stem: 'up'}),{options: { autoStem: true }}),
          score.voice(
            notelist,
            // score.notes('C#5/h, B4'),
              // .concat(score.beam(score.notes('A4/8, E4, C4, D4'))),
              // .concat(score.beam(score.notes('A4/8, E4/8, C4/8, D4/8'))),
              //.concat(score.beam(score.notes('A4/8, E4/8, C4/8, D4/16, D4/16'))),
              // .concat(score.beam(score.notes('A4/16, A4/16, E4/16, E4/16, C4/16, C4/16, D4/16, D4/16'))),
              // .concat(score.beam(score.beam(score.notes('A4/16, A4/16, E4/16, E4/16')).concat(score.beam(score.notes('C4/16, C4/16, D4/16, D4/16'))))),
               // .concat(score.beam(score.notes('A4/8, E4/4, D4/8'))),
              // .concat(score.beam(score.notes('A4/4, E4'))),

              {}
          )
          //score.voice(score.notes('C#4/h, C#4/h', {stem: 'down'}),{}),
          //score.voice(score.notes('A/h, A/h', {stem: 'down'}),{})
        ]
      })
      if (measure_index==0) stave.addClef('treble').addKeySignature(this.key.enharmonic.toString()).addTimeSignature(this.timesig.toString());

    })
    vf.draw();
  }


  play(): void {
    var synth = new Tonejs.PolySynth().toDestination();
    var blah = new Duration(0,1);
    for (var i=0;i<this.notes.length;i++) {
      synth.triggerAttackRelease(this.notes[i].getTones().map(tone => tone.toString()), this.notes[i].duration.tonejs_repr(), "+"+blah.tonejs_transport_repr());
      blah = blah.plus(this.notes[i].duration);
    }
  }


}




















