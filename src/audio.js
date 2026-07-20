export class Sound{
  constructor(){
    this.ctx=null;this.master=null;this.on=true;this.music='';this.timer=null;this.stepIndex=0;this.lastStep=0;
    try{this.on=localStorage.getItem('greenDragonSound')!=='off'}catch{}
  }
  unlock(){
    const Audio=globalThis.AudioContext||globalThis.webkitAudioContext;
    if(!this.ctx&&Audio){this.ctx=new Audio();this.master=this.ctx.createGain();this.master.gain.value=.72;this.master.connect(this.ctx.destination)}
    this.ctx?.resume?.();
    if(this.ctx&&this.music&&!this.timer&&this.on)this.start();
  }
  tone(frequency,duration=.1,volume=.05,type='square',delay=0,slide=0){
    if(!this.ctx||!this.on)return;
    const start=this.ctx.currentTime+delay,oscillator=this.ctx.createOscillator(),gain=this.ctx.createGain();
    oscillator.type=type;oscillator.frequency.setValueAtTime(frequency,start);
    if(slide)oscillator.frequency.exponentialRampToValueAtTime(Math.max(20,frequency+slide),start+duration);
    gain.gain.setValueAtTime(.0001,start);gain.gain.exponentialRampToValueAtTime(Math.max(.0002,volume),start+.008);gain.gain.exponentialRampToValueAtTime(.0001,start+duration);
    oscillator.connect(gain).connect(this.master||this.ctx.destination);oscillator.start(start);oscillator.stop(start+duration+.025);
  }
  noise(duration=.08,volume=.035,delay=0){
    if(!this.ctx||!this.on)return;
    const length=Math.max(1,Math.floor(this.ctx.sampleRate*duration)),buffer=this.ctx.createBuffer(1,length,this.ctx.sampleRate),data=buffer.getChannelData(0);
    for(let index=0;index<length;index++)data[index]=(Math.random()*2-1)*(1-index/length);
    const source=this.ctx.createBufferSource(),gain=this.ctx.createGain(),start=this.ctx.currentTime+delay;
    source.buffer=buffer;gain.gain.setValueAtTime(volume,start);gain.gain.exponentialRampToValueAtTime(.0001,start+duration);
    source.connect(gain).connect(this.master||this.ctx.destination);source.start(start);
  }
  sfx(name){
    const sounds={
      move:[420,.04,.028,'square',0,35],ok:[690,.07,.055,'triangle',0,130],punch:[112,.065,.09,'square',0,-35],kick:[78,.11,.11,'sawtooth',0,-28],
      sword:[990,.13,.065,'triangle',0,-610],staff:[178,.095,.09,'square',0,-70],block:[145,.075,.065,'triangle',0,80],hit:[62,.12,.105,'sawtooth',0,-18],
      chi:[520,.25,.075,'sine',0,520],victory:[784,.16,.07,'triangle'],defeat:[98,.38,.075,'sawtooth',0,-45],parry:[1160,.11,.075,'triangle',0,380],
      guardbreak:[94,.22,.105,'sawtooth',0,-50],evade:[380,.08,.035,'sine',0,220],throw:[82,.16,.11,'square',0,-34],assist:[660,.12,.06,'triangle',0,330],
      quest:[523,.14,.055,'triangle',0,260],recruit:[587,.14,.06,'triangle',0,390],heal:[420,.2,.05,'sine',0,310],coin:[880,.07,.045,'triangle',0,210],
      train:[196,.2,.065,'triangle',0,196],level:[659,.2,.065,'triangle',0,520],gong:[110,.55,.055,'sine',0,-35],
    };
    const params=sounds[name]||[300,.06,.04,'square'];
    this.tone(...params);
    if(['punch','kick','hit','throw','guardbreak'].includes(name))this.noise(name==='guardbreak'?.16:.055,name==='guardbreak'?.06:.028);
    if(name==='victory'){this.tone(988,.18,.065,'triangle',.14);this.tone(1175,.3,.065,'triangle',.29)}
    if(name==='chi'){this.tone(780,.23,.055,'sine',.06,420);this.tone(1040,.3,.045,'sine',.12,520)}
    if(name==='quest'||name==='recruit'||name==='level'){this.tone(params[0]*1.25,.14,.05,'triangle',.12);this.tone(params[0]*1.5,.2,.045,'triangle',.24)}
    if(name==='parry')this.noise(.04,.02);
    if(name==='gong'){this.tone(165,.65,.035,'sine',.03,-55);this.tone(220,.75,.018,'sine',.05,-70)}
  }
  step(){
    const now=performance.now();if(now-this.lastStep<145)return;this.lastStep=now;this.noise(.025,.008);this.tone(82,.025,.009,'sine');
  }
  setMusic(name){
    if(this.music===name)return;this.music=name;clearInterval(this.timer);this.timer=null;this.stepIndex=0;if(this.ctx&&this.on)this.start();
  }
  start(){
    clearInterval(this.timer);
    const patterns={
      village:{melody:[220,277,330,277,247,330,370,330,220,247,294,330,277,247,220,196],bass:[110,110,123,123,98,98,110,110],pace:300},
      mountain:{melody:[196,247,294,392,330,294,247,220,196,220,247,330,294,247,220,165],bass:[98,98,110,110,82,82,98,98],pace:330},
      battle:{melody:[147,196,220,147,247,220,196,165,147,220,262,196,247,294,220,196],bass:[73,82,73,98,73,82,110,98],pace:168},
    };
    const pattern=patterns[this.music]||patterns.village;
    const tick=()=>{
      const index=this.stepIndex++,melody=pattern.melody[index%pattern.melody.length],bass=pattern.bass[index%pattern.bass.length];
      this.tone(melody,.2,this.music==='battle'?.025:.022,this.music==='battle'?'square':'triangle');this.tone(bass,.27,.012,'sine');
      if(this.music==='battle'&&index%2===0)this.noise(.035,.008);if(index%8===0)this.tone(melody*1.5,.16,.009,'sine',.04);
    };
    tick();this.timer=setInterval(tick,pattern.pace);
  }
  toggle(){
    this.on=!this.on;try{localStorage.setItem('greenDragonSound',this.on?'on':'off')}catch{}
    if(!this.on){clearInterval(this.timer);this.timer=null}else if(this.ctx)this.start();return this.on;
  }
}
