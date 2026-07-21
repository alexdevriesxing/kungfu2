const game=globalThis.greenDragonGame;

const TAU=Math.PI*2;
const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
const hash=value=>{let result=2166136261;for(const char of String(value)){result^=char.charCodeAt(0);result=Math.imul(result,16777619)}return result>>>0};
const random=(seed,index=0)=>{let value=(seed+index*2654435761)>>>0;value^=value<<13;value^=value>>>17;value^=value<<5;return (value>>>0)/4294967295};

const THEMES={
  village:{tint:'#d59664',accent:'#f3c977',particle:'petal',mist:'#f2dfbd',seal:'#a83b37'},
  market:{tint:'#c88655',accent:'#ffd27c',particle:'lantern',mist:'#e9c994',seal:'#ad3933'},
  bamboo:{tint:'#4f8b68',accent:'#91d68f',particle:'leaf',mist:'#bfd9bc',seal:'#8d3733'},
  mountain:{tint:'#718b8c',accent:'#d8d4b0',particle:'mist',mist:'#dce5d7',seal:'#8f3735'},
  shaolin:{tint:'#b07a49',accent:'#eac36e',particle:'ember',mist:'#e2c89e',seal:'#9d3430'},
  wudang:{tint:'#567b83',accent:'#8edbb1',particle:'mist',mist:'#d7e3d8',seal:'#853735'},
  river:{tint:'#4f8797',accent:'#efbdc9',particle:'petal',mist:'#cce1dd',seal:'#9d3838'},
  opera:{tint:'#8e3041',accent:'#f0b465',particle:'silk',mist:'#c99a9b',seal:'#b12f31'},
  council:{tint:'#6a6f63',accent:'#e2ca7b',particle:'mote',mist:'#d8d5ba',seal:'#8f3432'},
  arena:{tint:'#a46c3d',accent:'#ffd06d',particle:'ember',mist:'#e2c39c',seal:'#a9342d'},
  court:{tint:'#8b6b3e',accent:'#f2d37e',particle:'mote',mist:'#ddd0aa',seal:'#a52e2c'},
  snow:{tint:'#617b91',accent:'#dff4ee',particle:'snow',mist:'#e8f0ed',seal:'#88373a'},
  war:{tint:'#7d473d',accent:'#e5ae63',particle:'ember',mist:'#c9ada0',seal:'#a32f2e'},
  ghost:{tint:'#4d4164',accent:'#dba5c3',particle:'ash',mist:'#bdb5c8',seal:'#8f2d42'},
  archive:{tint:'#425b69',accent:'#82d3c4',particle:'mote',mist:'#cadbd5',seal:'#7c3540'},
  capital:{tint:'#765138',accent:'#efc56d',particle:'ash',mist:'#d4b99c',seal:'#aa302d'},
  legacy:{tint:'#315b50',accent:'#79e0a6',particle:'jade',mist:'#b9dfcf',seal:'#8e3434'},
};

function themeFor(target){
  const id=`${target.data?.location||''} ${target.location?.()?.background||''}`.toLowerCase();
  if(id.includes('returning')||id.includes('legacy'))return THEMES.legacy;
  if(id.includes('snow')||id.includes('northern')||id.includes('lotus')||id.includes('star-pass'))return THEMES.snow;
  if(id.includes('war-camp')||id.includes('banner'))return THEMES.war;
  if(id.includes('ghost')||id.includes('mask')||id.includes('sanctum'))return THEMES.ghost;
  if(id.includes('opera'))return THEMES.opera;
  if(id.includes('archive'))return THEMES.archive;
  if(id.includes('capital')||id.includes('arsenal')||id.includes('throne')||id.includes('terrace')||id.includes('garden'))return THEMES.capital;
  if(id.includes('court'))return THEMES.court;
  if(id.includes('arena')||id.includes('tournament'))return THEMES.arena;
  if(id.includes('council'))return THEMES.council;
  if(id.includes('river')||id.includes('ferry')||id.includes('dock'))return THEMES.river;
  if(id.includes('wudang'))return THEMES.wudang;
  if(id.includes('shaolin')||id.includes('monastery'))return THEMES.shaolin;
  if(id.includes('mountain')||id.includes('trail')||id.includes('observatory'))return THEMES.mountain;
  if(id.includes('bamboo')||id.includes('forest'))return THEMES.bamboo;
  if(id.includes('market'))return THEMES.market;
  return THEMES.village;
}

function rgba(hex,alpha){const value=hex.replace('#','');const size=value.length===3?1:2;const read=index=>parseInt(value.slice(index*size,(index+1)*size).repeat(size===1?2:1),16);return `rgba(${read(0)},${read(1)},${read(2)},${alpha})`}
function line(ctx,x1,y1,x2,y2,width,color,alpha=1){ctx.save();ctx.globalAlpha=alpha;ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();ctx.restore()}
function text(ctx,value,x,y,size,color,align='center',font='Georgia'){ctx.save();ctx.font=`${size}px ${font}`;ctx.textAlign=align;ctx.textBaseline='middle';ctx.lineJoin='round';ctx.strokeStyle='rgba(0,0,0,.75)';ctx.lineWidth=Math.max(2,size*.08);ctx.strokeText(String(value),x,y);ctx.fillStyle=color;ctx.fillText(String(value),x,y);ctx.restore()}
function diamond(ctx,x,y,size,color,alpha=1){ctx.save();ctx.globalAlpha=alpha;ctx.translate(x,y);ctx.rotate(Math.PI/4);ctx.fillStyle=color;ctx.fillRect(-size/2,-size/2,size,size);ctx.restore()}
function brushStroke(ctx,x,y,width,height,color,alpha=.7){ctx.save();ctx.globalAlpha=alpha;ctx.fillStyle=color;const seed=hash(`${x}:${y}:${width}:${height}`);for(let row=0;row<7;row++){const offset=(random(seed,row)-.5)*height*.5;ctx.fillRect(x-random(seed,row+11)*18,y+row*height/7+offset,width+random(seed,row+19)*30,height/7+2)}ctx.restore()}
function enso(ctx,x,y,radius,color,alpha=.58){ctx.save();ctx.globalAlpha=alpha;ctx.strokeStyle=color;ctx.lineCap='round';for(let pass=0;pass<4;pass++){ctx.lineWidth=8-pass*1.4;ctx.beginPath();ctx.arc(x+(pass-1.5)*1.7,y+(pass-1.5)*1.1,radius-pass*1.5,-.35,Math.PI*1.72);ctx.stroke()}ctx.restore()}
function seal(ctx,x,y,size,label='龍'){ctx.save();ctx.translate(x,y);ctx.rotate(-.045);ctx.fillStyle='#a52f2d';ctx.fillRect(-size/2,-size/2,size,size);ctx.strokeStyle='#f2d7ad';ctx.lineWidth=2;ctx.strokeRect(-size/2+4,-size/2+4,size-8,size-8);ctx.fillStyle='#f4dfbd';ctx.font=`bold ${size*.56}px serif`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(label,0,2);ctx.restore()}

function decorateStageCanvas(key,canvas){
  if(!canvas?.getContext||canvas.__wuxiaDecorated)return;
  const ctx=canvas.getContext('2d'),seed=hash(key),width=canvas.width||960,height=canvas.height||540;
  canvas.__wuxiaDecorated=true;ctx.save();
  const theme=themeFor({data:{location:key},location:()=>({background:key})});
  const sky=ctx.createLinearGradient(0,0,0,height*.72);sky.addColorStop(0,rgba(theme.tint,.2));sky.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=sky;ctx.fillRect(0,0,width,height*.72);
  ctx.globalAlpha=.12;ctx.fillStyle='#0a1712';for(let i=0;i<5;i++){const baseX=-100+i*240+random(seed,i)*80,peak=85+random(seed,i+10)*130;ctx.beginPath();ctx.moveTo(baseX,height*.58);ctx.quadraticCurveTo(baseX+100,peak,baseX+230,height*.58);ctx.lineTo(baseX+230,height*.62);ctx.lineTo(baseX,height*.62);ctx.fill()}
  ctx.globalAlpha=.13;ctx.fillStyle=theme.mist;for(let i=0;i<7;i++){const x=random(seed,i+22)*width,y=55+random(seed,i+40)*220,w=120+random(seed,i+60)*230;ctx.beginPath();ctx.ellipse(x,y,w,12+random(seed,i+80)*14,0,0,TAU);ctx.fill()}
  if(theme.particle==='snow'){ctx.globalAlpha=.32;ctx.fillStyle='#edf8f3';for(let i=0;i<90;i++){const x=random(seed,i)*width,y=random(seed,i+130)*height*.78,r=1+random(seed,i+260)*2;ctx.fillRect(x,y,r,r)}}
  if(['petal','silk'].includes(theme.particle)){ctx.globalAlpha=.25;ctx.fillStyle=theme.particle==='silk'?'#d45d6b':'#ef9eb1';for(let i=0;i<36;i++){const x=random(seed,i)*width,y=80+random(seed,i+70)*height*.62;ctx.save();ctx.translate(x,y);ctx.rotate(random(seed,i+140)*TAU);ctx.fillRect(-3,-1,7,3);ctx.restore()}}
  ctx.globalAlpha=.22;ctx.fillStyle='#08110d';ctx.beginPath();ctx.moveTo(0,height);ctx.lineTo(0,height*.82);for(let x=0;x<=width;x+=28){const grass=8+random(seed,x)*25;ctx.lineTo(x,height*.84-grass)}ctx.lineTo(width,height);ctx.fill();
  ctx.restore();
}

function decorateAllStages(){const stages=globalThis.greenDragonAssets?.stages||{};for(const [key,canvas] of Object.entries(stages))decorateStageCanvas(key,canvas)}

function makeParticles(target){
  const theme=themeFor(target),fx=target.wuxiaFx,desired=theme.particle==='snow'?46:theme.particle==='mist'?10:theme.particle==='ember'?24:theme.particle==='jade'?30:28;
  while(fx.particles.length<desired){const index=fx.serial++;const seed=hash(`${target.data.location}:${index}`);fx.particles.push({x:random(seed,1)*960,y:random(seed,2)*540,depth:.45+random(seed,3)*.85,speed:8+random(seed,4)*34,phase:random(seed,5)*TAU,size:1.5+random(seed,6)*4,kind:theme.particle})}
}

function updateParticles(target,dt){
  const fx=target.wuxiaFx,theme=themeFor(target);makeParticles(target);
  for(const particle of fx.particles){particle.y+=particle.speed*particle.depth*dt;particle.x+=Math.sin(target.time*.8+particle.phase)*9*dt*(particle.kind==='silk'?2:1);if(particle.kind==='ember')particle.y-=particle.speed*2.1*dt;if(particle.kind==='mist')particle.x+=particle.speed*.55*dt;if(particle.y>560){particle.y=-20;particle.x=(particle.x+173)%960}if(particle.y<-25){particle.y=555;particle.x=(particle.x+211)%960}if(particle.x>1000)particle.x=-40}
  fx.bossIntro=Math.max(0,fx.bossIntro-dt);fx.brushTransition=Math.max(0,fx.brushTransition-dt);fx.chapterPulse=Math.max(0,fx.chapterPulse-dt);
  fx.theme=theme;
}

function drawAtmosphere(target){
  const ctx=target.ctx,fx=target.wuxiaFx,theme=fx.theme||themeFor(target);
  if(['title','menu','shop','train'].includes(target.mode))return;
  ctx.save();
  for(const p of fx.particles){const sway=Math.sin(target.time*1.4+p.phase)*6;ctx.globalAlpha=.12+.24*p.depth;ctx.fillStyle=p.kind==='snow'?'#eff9f4':p.kind==='ember'?'#f3a44e':p.kind==='leaf'?'#8dcc72':p.kind==='silk'?'#dd6a7e':p.kind==='ash'?'#d2c3ae':p.kind==='jade'?'#79efad':p.kind==='lantern'?'#f2bc5d':'#efabc0';if(p.kind==='mist'){ctx.globalAlpha=.055;ctx.fillStyle=theme.mist;ctx.beginPath();ctx.ellipse(p.x+sway,p.y,105*p.depth,9*p.depth,0,0,TAU);ctx.fill()}else if(p.kind==='petal'||p.kind==='leaf'||p.kind==='silk'){ctx.save();ctx.translate(p.x+sway,p.y);ctx.rotate(target.time*.8+p.phase);ctx.fillRect(-p.size,-p.size*.35,p.size*2,p.size*.7);ctx.restore()}else{ctx.beginPath();ctx.arc(p.x+sway,p.y,p.size*(p.kind==='lantern'?1.15:.55),0,TAU);ctx.fill();if(p.kind==='lantern'||p.kind==='jade'){ctx.globalAlpha*=.3;ctx.beginPath();ctx.arc(p.x+sway,p.y,p.size*3,0,TAU);ctx.fill()}}}
  ctx.globalAlpha=1;
  const grade=ctx.createLinearGradient(0,0,960,540);grade.addColorStop(0,rgba(theme.tint,.08));grade.addColorStop(.55,'rgba(0,0,0,0)');grade.addColorStop(1,rgba(theme.tint,.11));ctx.fillStyle=grade;ctx.fillRect(0,0,960,540);
  ctx.restore();
}

function drawFrame(target){
  const ctx=target.ctx,theme=target.wuxiaFx.theme||themeFor(target);
  ctx.save();
  const vignette=ctx.createRadialGradient(480,260,160,480,270,590);vignette.addColorStop(.45,'rgba(0,0,0,0)');vignette.addColorStop(1,'rgba(0,0,0,.48)');ctx.fillStyle=vignette;ctx.fillRect(0,0,960,540);
  ctx.globalAlpha=.68;ctx.strokeStyle=theme.accent;ctx.lineWidth=2;ctx.strokeRect(7.5,7.5,945,525);ctx.globalAlpha=.38;ctx.strokeRect(13.5,13.5,933,513);
  for(const [x,y,sx,sy] of [[22,22,1,1],[938,22,-1,1],[22,518,1,-1],[938,518,-1,-1]]){ctx.save();ctx.translate(x,y);ctx.scale(sx,sy);line(ctx,0,0,54,0,3,theme.accent,.75);line(ctx,0,0,0,54,3,theme.accent,.75);line(ctx,8,8,34,8,1,theme.accent,.5);line(ctx,8,8,8,34,1,theme.accent,.5);diamond(ctx,2,2,8,theme.accent,.85);ctx.restore()}
  ctx.restore();
}

function drawTitle(target){
  if(target.mode!=='title')return;const ctx=target.ctx,theme=THEMES.legacy;
  ctx.save();enso(ctx,760,282,132,'#65dc8f',.28);enso(ctx,760,282,98,'#e1bd67',.12);
  for(let i=0;i<12;i++){const angle=target.time*.08+i/12*TAU;ctx.globalAlpha=.15;ctx.fillStyle=i%3?'#74d99a':'#e0bd68';ctx.beginPath();ctx.arc(760+Math.cos(angle)*160,282+Math.sin(angle)*105,2+(i%2),0,TAU);ctx.fill()}
  brushStroke(ctx,48,255,354,8,'#0a1410',.72);text(ctx,'武 俠 傳 奇',226,269,15,'#d7c28e','center','serif');seal(ctx,365,244,38,'龍');
  ctx.globalAlpha=1;ctx.restore();
}

function drawBossIntro(target){
  const fx=target.wuxiaFx;if(!fx.bossIntro||target.mode!=='combat')return;const ctx=target.ctx,progress=clamp(fx.bossIntro/fx.bossIntroMax,0,1),open=1-Math.abs(progress-.5)*2,ease=Math.sin(clamp(open,0,1)*Math.PI/2);
  ctx.save();ctx.fillStyle=`rgba(0,0,0,${.58*ease})`;ctx.fillRect(0,0,960,75*ease);ctx.fillRect(0,540-75*ease,960,75*ease);
  brushStroke(ctx,150,215,660,96,'#08100d',.88*ease);line(ctx,190,226,770,226,2,fx.theme.accent,.7*ease);line(ctx,190,310,770,310,2,fx.theme.accent,.4*ease);
  ctx.globalAlpha=ease;text(ctx,fx.bossName||'JIANGHU RIVAL',480,252,13,fx.theme.accent,'center','monospace');text(ctx,fx.bossTitle||'A NAME WRITTEN IN STEEL',480,279,34,'#f5dfaa');seal(ctx,755,272,52,fx.bossSeal||'武');ctx.restore();
}

function drawVictorySeal(target){
  if(target.mode!=='victory'||!target.combat)return;const ctx=target.ctx,rank=target.combat.rank||'C';ctx.save();ctx.globalAlpha=.93;enso(ctx,815,392,64,'#ebc76d',.55);seal(ctx,815,392,74,rank);text(ctx,'VICTORY',815,474,12,'#f0d78f','center','monospace');ctx.restore();
}

function drawBrushTransition(target){
  const amount=target.wuxiaFx.brushTransition;if(!amount)return;const ctx=target.ctx,progress=amount/target.wuxiaFx.brushTransitionMax;ctx.save();ctx.globalAlpha=Math.sin(progress*Math.PI)*.82;for(let i=0;i<13;i++){const x=(1-progress)*-1100+i*90;brushStroke(ctx,x,-10,280,560,'#07100d',.82)}ctx.restore();
}

function drawChapterPulse(target){
  const amount=target.wuxiaFx.chapterPulse;if(!amount)return;const ctx=target.ctx,alpha=Math.sin(clamp(amount/1.8,0,1)*Math.PI);ctx.save();ctx.globalAlpha=alpha*.9;brushStroke(ctx,195,200,570,118,'#07100d',.92);text(ctx,target.wuxiaFx.chapterTitle||'THE ROAD CONTINUES',480,237,12,'#82dba5','center','monospace');text(ctx,target.wuxiaFx.chapterSubtitle||'A NEW SCROLL UNFURLS',480,276,28,'#f0d18a');ctx.restore();
}

function drawRicePaperGrain(target){
  const ctx=target.ctx;ctx.save();ctx.globalAlpha=.025;ctx.fillStyle='#f2e4c0';const seed=Math.floor(target.time*2);for(let i=0;i<80;i++){const x=(hash(`${seed}:${i}`)%960),y=(hash(`${i}:${seed}:y`)%540);ctx.fillRect(x,y,1+(i%2),1)}ctx.restore();
}

function drawPresentation(target){decorateAllStages();drawAtmosphere(target);drawTitle(target);drawVictorySeal(target);drawBossIntro(target);drawChapterPulse(target);drawBrushTransition(target);drawFrame(target);drawRicePaperGrain(target)}

function ensureState(target){target.wuxiaFx=target.wuxiaFx||{particles:[],serial:0,bossIntro:0,bossIntroMax:2.35,bossName:'',bossTitle:'',bossSeal:'武',brushTransition:0,brushTransitionMax:.86,chapterPulse:0,chapterTitle:'',chapterSubtitle:'',lastLocation:target.data?.location||''}}

function patch(target){
  ensureState(target);decorateAllStages();
  const baseBegin=target.beginFight.bind(target);target.beginFight=function(npc){const result=baseBegin(npc);ensureState(this);const boss=Boolean(npc?.enemy?.boss||npc?.role==='boss');this.wuxiaFx.bossIntro=boss?2.35:.82;this.wuxiaFx.bossIntroMax=this.wuxiaFx.bossIntro;this.wuxiaFx.bossName=boss?'JIANGHU BOSS':'RIVAL ENCOUNTER';this.wuxiaFx.bossTitle=npc?.name||npc?.enemy?.name||'Unknown Rival';this.wuxiaFx.bossSeal=boss?'戰':'武';return result};
  const baseTravel=target.travel.bind(target);target.travel=function(direction){const before=this.data.location,result=baseTravel(direction);ensureState(this);if(before!==this.data.location){this.wuxiaFx.particles=[];this.wuxiaFx.brushTransition=.86;this.wuxiaFx.brushTransitionMax=.86}return result};
  const baseNew=target.newGame.bind(target);target.newGame=function(){const result=baseNew();ensureState(this);this.wuxiaFx.chapterPulse=1.8;this.wuxiaFx.chapterTitle='THE ASHES SPEAK';this.wuxiaFx.chapterSubtitle='THE GREEN DRAGON PATH BEGINS';return result};
  const baseLoad=target.load.bind(target);target.load=function(){const result=baseLoad();ensureState(this);this.wuxiaFx.brushTransition=.72;this.wuxiaFx.brushTransitionMax=.72;return result};
  const previousLoop=target.loop.bind(target);target.loop=function(now){const dt=Math.min(.034,Math.max(0,(now-(this.wuxiaFxLast||now))/1000));this.wuxiaFxLast=now;previousLoop(now);ensureState(this);updateParticles(this,dt);drawPresentation(this)};
}

patch(game);
globalThis.greenDragonWuxiaPresentation={THEMES,themeFor,decorateAllStages,drawPresentation};
