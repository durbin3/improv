



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




class NoteDesignation {
  value: number;
  constructor(value:number) {
    this.value = value%12;
  }

}


class Note {
  value: number;
  constructor(value:number) {
    this.value = value;
  }
}




class ChordDesignation {
	
}


class Chord {

}











