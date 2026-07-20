import {FIGHTER_ATLAS as ATLAS} from './sprite-atlas.js';

const C={ink:'#0a100e',jade:'#55d787',deep:'#174a38',gold:'#e0b963',paper:'#f6e8c4',red:'#bd4546',blue:'#4778a6'};
const PROD_FRAME_W=ATLAS.frameWidth,PROD_FRAME_H=ATLAS.frameHeight,PROD_COLS=ATLAS.columns,PROD_ANIMS=ATLAS.animations;
const q=value=>Math.round(value);
const PORTRAIT_ORDER=['shi-an','mei-lin','bo','elder-zhao','tea-lian','merchant-han','abbot-wu','hermit-reed','white-brow','razor-fang','kuo','ghost-face','master-shen','novice-jin','broker-qiu','lotus'];

function spriteKey(fighter){return fighter.sprite||fighter.id||(fighter.name==='Shi-An'?'shi-an':fighter.variant)||'atlas'}
function actionFrame(fighter,time){
  let action=fighter.block?'block':fighter.action||'idle';
  if(action==='weapon')action=fighter.weapon==='staff'?'staff':'sword';
  const chi=action==='chi';if(chi)action='victory';
  const frames=PROD_ANIMS[action]||PROD_ANIMS.idle,loop=['idle','walk','block'].includes(action),fps=action==='walk'?10:action==='idle'?5:action==='block'?7:12;
  const clock=loop?time:(fighter.actionTime||0),slot=loop?Math.floor(clock*fps)%frames.length:Math.min(frames.length-1,Math.floor(clock*fps));
  return {action,chi,frame:frames[slot]};
}
function drawProductionFighter(context,fighterData,time){
  const assets=globalThis.greenDragonAssets,key=spriteKey(fighterData),sheet=assets?.sprites?.[key]||assets?.sprites?.[fighterData.variant||'atlas'];
  if(!sheet)return false;
  const {chi,frame}=actionFrame(fighterData,time),sourceX=(frame%PROD_COLS)*PROD_FRAME_W,sourceY=Math.floor(frame/PROD_COLS)*PROD_FRAME_H,scale=1.42;
  context.save();context.imageSmoothingEnabled=false;context.globalAlpha=fighterData.invulnerable>0&&Math.floor(time*24)%2===0?.48:1;
  context.fillStyle='rgba(0,0,0,.28)';context.beginPath();context.ellipse(q(fighterData.x),q(fighterData.y+2),44,8,0,0,Math.PI*2);context.fill();
  context.translate(q(fighterData.x),q(fighterData.y));context.scale((fighterData.dir<0?-1:1)*scale,scale);
  context.drawImage(sheet,sourceX,sourceY,PROD_FRAME_W,PROD_FRAME_H,-ATLAS.pivot.x,-ATLAS.pivot.y,PROD_FRAME_W,PROD_FRAME_H);
  if(fighterData.hitFlash>0){context.globalCompositeOperation='source-atop';context.globalAlpha=Math.min(.75,fighterData.hitFlash*6);context.fillStyle='#fff6dc';context.fillRect(-100,-124,200,124)}
  if(chi){
    context.globalCompositeOperation='screen';context.strokeStyle='#78f39a';context.lineWidth=4;context.globalAlpha=.8;context.beginPath();context.arc(0,-65,48+Math.sin(time*12)*5,0,Math.PI*2);context.stroke();
    for(let index=0;index<5;index++){const angle=time*2+index*1.26;context.fillStyle='#a4ffb9';context.fillRect(Math.cos(angle)*52-2,-65+Math.sin(angle)*45-2,4,4)}
  }
  context.restore();return true;
}

export const rect=(context,x,y,width,height,color)=>{context.fillStyle=color;context.fillRect(q(x),q(y),q(width),q(height))};
export function txt(context,string,x,y,size=16,color=C.paper,align='left',font='Georgia'){context.fillStyle=color;context.font=`${size}px ${font}`;context.textAlign=align;context.textBaseline='top';context.fillText(string,x,y)}
export function wrap(context,string,x,y,width,lineHeight=20,size=16,color=C.paper,limit=8){
  context.font=`${size}px Georgia`;context.fillStyle=color;context.textAlign='left';context.textBaseline='top';let line='',output=[];
  for(const word of string.split(' ')){const candidate=line?`${line} ${word}`:word;if(context.measureText(candidate).width>width&&line){output.push(line);line=word}else line=candidate}
  if(line)output.push(line);output.slice(0,limit).forEach((value,index)=>context.fillText(value,x,y+index*lineHeight));return output.length;
}
export function panel(context,x,y,width,height,alpha=.94){
  rect(context,x,y,width,height,`rgba(4,12,9,${alpha})`);context.strokeStyle=C.gold;context.lineWidth=3;context.strokeRect(x+.5,y+.5,width-1,height-1);context.strokeStyle='#31563f';context.lineWidth=1;context.strokeRect(x+6.5,y+6.5,width-13,height-13);
  rect(context,x+10,y+10,3,3,C.gold);rect(context,x+width-13,y+10,3,3,C.gold);rect(context,x+10,y+height-13,3,3,C.gold);rect(context,x+width-13,y+height-13,3,3,C.gold);
}
export function bar(context,x,y,width,height,value,max,color){
  const ratio=Math.max(0,Math.min(1,max?value/max:0));rect(context,x,y,width,height,'#160d0b');rect(context,x+2,y+2,(width-4)*ratio,height-4,color);
  if(ratio>.08)rect(context,x+3,y+3,(width-6)*ratio,Math.max(1,(height-5)*.28),'rgba(255,255,255,.2)');context.strokeStyle='#806038';context.strokeRect(x+.5,y+.5,width-1,height-1);
}
function poly(context,points,color){context.fillStyle=color;context.beginPath();context.moveTo(points[0][0],points[0][1]);points.slice(1).forEach(point=>context.lineTo(point[0],point[1]));context.closePath();context.fill()}
function mountain(context,x,y,width,height,color){poly(context,[[x,y+height],[x+width*.45,y],[x+width,y+height]],color);poly(context,[[x+width*.31,y+height*.32],[x+width*.45,y],[x+width*.59,y+height*.32]],'#d9e3d8')}
function tree(context,x,y,scale=1,blossom=false){
  rect(context,x-5*scale,y,10*scale,62*scale,'#3d291d');const color=blossom?'#d87891':'#1c633d';
  for(const [dx,dy,radius] of [[0,-10,26],[-18,7,20],[18,8,21],[-5,22,22]]){rect(context,x+(dx-radius)*scale,y+(dy-radius)*scale,radius*2*scale,radius*2*scale,color);rect(context,x+(dx-radius+5)*scale,y+(dy-radius+4)*scale,radius*1.2*scale,radius*.45*scale,blossom?'#f0a8b5':'#4b9b5b')}
}
function roof(context,x,y,width,color='#28332d'){poly(context,[[x-20,y+25],[x+width/2,y],[x+width+20,y+25]],color);rect(context,x,y+24,width,8,'#a55234');for(let index=0;index<width;index+=18)rect(context,x+index,y+18,10,4,'#d2a65a')}
function building(context,x,y,width,height){rect(context,x,y+25,width,height-25,'#7a5336');roof(context,x,y,width);for(let index=14;index<width-18;index+=30){rect(context,x+index,y+43,18,height-55,'#171e1a');rect(context,x+index+3,y+47,12,height-62,'#d3b77a')}rect(context,x+width/2-16,y+height-42,32,42,'#1a1c18')}
function lantern(context,x,y,time=0){
  rect(context,x-2,y,4,18,'#3a2418');const flicker=Math.sin(time*8+x)*.12;context.save();context.globalAlpha=.22+flicker;rect(context,x-15,y+8,30,34,'#ffb34f');context.restore();rect(context,x-7,y+15,14,19,'#c9482f');rect(context,x-5,y+18,10,13,'#f2a13d');
}
function water(context,time){rect(context,0,380,960,160,'#2a7187');for(let index=0;index<30;index++){const x=(index*83+time*18)%1000-20,y=395+(index*31)%115;rect(context,x,y,34,3,index%2?'#3c8da0':'#78b7bd')}}

export function stage(context,id,time=0){
  const production=globalThis.greenDragonAssets?.stages?.[id];if(production){context.imageSmoothingEnabled=false;context.drawImage(production,0,0,960,540);return}
  const sky=context.createLinearGradient(0,0,0,540);sky.addColorStop(0,id.includes('wudang')?'#385873':'#719aa0');sky.addColorStop(1,'#e7bd78');rect(context,0,0,960,540,sky);
  context.save();context.globalAlpha=.48;rect(context,770,52,72,72,'#f7d98c');context.restore();mountain(context,-70,80,420,250,'#496d5e');mountain(context,250,95,470,235,'#5b7d68');mountain(context,610,70,420,260,'#3f6256');
  if(id.includes('bamboo')){
    rect(context,0,310,960,230,'#33583d');for(let index=0;index<38;index++){const x=index*29+(index%3)*7;rect(context,x,80+(index%4)*30,8,390,'#3f8653');for(let leaf=0;leaf<7;leaf++){poly(context,[[x+4,130+leaf*48],[x+27,120+leaf*48],[x+7,145+leaf*48]],'#77c47d');poly(context,[[x+3,148+leaf*48],[x-20,139+leaf*48],[x+1,163+leaf*48]],'#4fa76c')}}rect(context,0,438,960,102,'#7a633f');
  }else if(id.includes('mountain')){
    rect(context,0,345,960,195,'#8a6f49');poly(context,[[0,390],[280,325],[600,402],[960,315],[960,540],[0,540]],'#756447');for(let index=0;index<13;index++)rect(context,index*82,430+(index%2)*22,55,30,'#a08b61');lantern(context,180,345,time);lantern(context,780,330,time);
  }else if(id.includes('shaolin')){
    rect(context,0,350,960,190,'#a18a60');building(context,245,160,470,235);for(let index=0;index<11;index++)rect(context,80+index*82,425,60,36,index%2?'#aa956b':'#897857');lantern(context,210,270,time);lantern(context,750,270,time);tree(context,120,290,1.2);tree(context,850,295,1.1);
  }else if(id.includes('wudang')){
    rect(context,0,382,960,158,'#7e8980');poly(context,[[0,430],[220,350],[430,420],[620,330],[960,408],[960,540],[0,540]],'#5f6b62');building(context,330,205,300,150);for(let index=0;index<9;index++)rect(context,100+index*96,445,72,18,'#a49a7a');rect(context,0,470,960,70,'#46534c');
  }else if(id.includes('river')){
    water(context,time);building(context,80,240,250,150);building(context,630,230,245,160);poly(context,[[310,430],[390,350],[570,350],[650,430]],'#8d744e');for(let index=0;index<8;index++)rect(context,350+index*34,360,20,70,'#49382b');tree(context,45,290,1.1,true);tree(context,915,285,1.2,false);
  }else{
    rect(context,0,372,960,168,'#9c7d55');building(context,35,225,245,170);building(context,350,205,260,190);building(context,680,225,245,170);for(let index=0;index<8;index++){lantern(context,80+index*112,330,time);rect(context,20+index*130,432,95,28,index%2?'#806044':'#a37c53')}tree(context,310,315,.75,true);tree(context,650,315,.75,true);
  }
  const fog=context.createLinearGradient(0,270,0,540);fog.addColorStop(0,'rgba(230,225,190,0)');fog.addColorStop(1,'rgba(40,55,48,.12)');rect(context,0,260,960,280,fog);
}

export function ambient(context,id,time=0){
  context.save();
  for(let index=0;index<5;index++){const x=((index*230+time*(6+index))%1250)-150,y=68+(index%3)*43;context.globalAlpha=.08+(index%2)*.025;rect(context,x,y,120+index*13,12,'#f5ead2');rect(context,x+25,y-8,72,9,'#f5ead2')}
  context.globalAlpha=1;const bamboo=id.includes('bamboo'),river=id.includes('river')||id.includes('market'),temple=id.includes('shaolin')||id.includes('wudang'),count=bamboo?18:river?12:8;
  for(let index=0;index<count;index++){
    const speed=bamboo?34:river?18:11,x=(index*79+time*speed*(1+(index%3)*.2))%1040-40,y=120+(index*47)%330+Math.sin(time*2+index)*8;
    if(bamboo){context.globalAlpha=.28;rect(context,x,y,7,3,index%2?'#8bcf75':'#d8c06e')}
    else if(river){context.globalAlpha=.22;rect(context,x,y,3,3,index%3?'#f1c6d0':'#fff0c2')}
    else if(temple){context.globalAlpha=.2+.12*Math.sin(time*3+index);rect(context,x,y,3,3,'#f6d978')}
  }
  context.globalAlpha=1;if(id.includes('river'))for(let index=0;index<9;index++){const x=(index*117+time*22)%1000,y=402+(index*29)%105;context.globalAlpha=.22+.12*Math.sin(time*5+index);rect(context,x,y,24,2,'#c7eef0')}
  context.restore();
}

const variants={atlas:['#263a32','#e0c08a','#161a18'],crimson:['#872c32','#e1ae79','#1a1212'],indigo:['#35316f','#d6aa78','#151422'],gold:['#9c762d','#dfb47d','#1b1710'],ashen:['#5c6764','#d3aa7b','#161817']};
function limb(context,x1,y1,x2,y2,width,color){context.strokeStyle='#120f0d';context.lineWidth=width+6;context.beginPath();context.moveTo(q(x1),q(y1));context.lineTo(q(x2),q(y2));context.stroke();context.strokeStyle=color;context.lineWidth=width;context.stroke();rect(context,x2-5,y2-5,10,10,'#d9a877')}
export function fighter(context,data,time=0){
  if(drawProductionFighter(context,data,time))return;
  const [cloth,skin,dark]=variants[data.variant]||variants.atlas,x=q(data.x),y=q(data.y),flip=data.dir<0?-1:1,action=data.action||'idle',progress=data.actionTime||time;
  let bob=action==='walk'?Math.sin(progress*16)*4:Math.sin(time*4)*2;const jump=action==='jump'?-Math.sin(Math.min(1,progress)*Math.PI)*85:0;let arm=0,leg=0;
  if(action==='punch')arm=Math.sin(Math.min(1,progress*5)*Math.PI)*54;if(action==='kick')leg=Math.sin(Math.min(1,progress*4)*Math.PI)*70;if(action==='hurt')bob=8;if(action==='victory')arm=42;
  context.save();context.globalAlpha=data.invulnerable>0&&Math.floor(time*24)%2===0?.5:1;context.translate(x,y+jump+bob);context.scale(flip,1);rect(context,-34,1,68,9,'rgba(0,0,0,.35)');
  limb(context,-14,-54,-18-leg*.15,-10,15,dark);limb(context,13,-54,18+leg,-12-leg*.35,15,cloth);poly(context,[[-30,-104],[0,-119],[30,-104],[22,-52],[-22,-52]],cloth);rect(context,-18,-104,36,44,cloth);rect(context,-24,-65,48,10,'#17130f');limb(context,-22,-98,-42,-64,13,cloth);limb(context,22,-98,42+arm,-70-arm*.18,13,cloth);rect(context,-18,-145,36,34,skin);rect(context,-21,-149,42,15,dark);rect(context,-25,-145,8,32,dark);rect(context,7,-134,4,4,'#17130f');rect(context,20,-146,13,7,dark);
  if(data.block){limb(context,20,-98,45,-118,14,cloth);limb(context,-20,-98,18,-120,14,cloth)}
  if(action==='sword'||(data.weapon==='sword'&&action==='weapon')){context.strokeStyle='#dce3d7';context.lineWidth=5;context.beginPath();context.moveTo(40,-72);context.lineTo(94,-118);context.stroke();rect(context,33,-78,18,7,C.gold)}
  if(action==='staff'||(data.weapon==='staff'&&action==='weapon')){context.strokeStyle='#6f4326';context.lineWidth=8;context.beginPath();context.moveTo(-48,-118);context.lineTo(100,-54);context.stroke()}
  context.restore();
}

function portraitKey(name){
  const normalized=name.toLowerCase();if(normalized.includes('shi-an'))return'shi-an';if(normalized.includes('mei lin'))return'mei-lin';if(normalized.startsWith('bo '))return'bo';if(normalized.includes('elder zhao'))return'elder-zhao';if(normalized.includes('tea-seller'))return'tea-lian';if(normalized.includes('merchant han'))return'merchant-han';if(normalized.includes('abbot wu'))return'abbot-wu';if(normalized.includes('hermit reed'))return'hermit-reed';if(normalized.includes('white brow'))return'white-brow';if(normalized.includes('razor fang'))return'razor-fang';if(normalized.includes('three knuckles'))return'kuo';if(normalized.includes('faceless'))return'ghost-face';if(normalized.includes('novice')||normalized.includes('bell sparrow'))return'novice-jin';if(normalized.includes('broker qiu'))return'broker-qiu';if(normalized.includes('lotus'))return'lotus';return null;
}
export function portrait(context,name,x,y,width,height,variant='atlas'){
  const portraitAtlas=globalThis.greenDragonAssets?.portraits,key=portraitKey(name);
  if(portraitAtlas&&key){const index=PORTRAIT_ORDER.indexOf(key),sourceX=(index%4)*180,sourceY=Math.floor(index/4)*220;context.save();context.beginPath();context.rect(x,y,width,height);context.clip();context.imageSmoothingEnabled=false;context.drawImage(portraitAtlas,sourceX,sourceY,180,220,x,y,width,height);context.restore();context.strokeStyle=C.gold;context.lineWidth=2;context.strokeRect(x+.5,y+.5,width-1,height-1);return}
  context.save();context.beginPath();context.rect(x,y,width,height);context.clip();const gradient=context.createLinearGradient(x,y,x,y+height);gradient.addColorStop(0,'#31483d');gradient.addColorStop(1,'#090d0b');rect(context,x,y,width,height,gradient);fighter(context,{x:x+width*.5,y:y+height*1.1,variant,sprite:key||undefined,dir:1,action:'idle'},0);context.restore();context.strokeStyle=C.gold;context.lineWidth=2;context.strokeRect(x+.5,y+.5,width-1,height-1);txt(context,name.split(' “')[0],x+width/2,y+height-21,11,'#f4d58f','center','monospace');
}
export function keyArt(context,time){
  const production=globalThis.greenDragonAssets?.keyArt;if(production){context.imageSmoothingEnabled=false;context.drawImage(production,0,0,960,540);return}
  stage(context,'stage-wudang-walkway.webp',time);ambient(context,'stage-wudang-walkway.webp',time);const veil=context.createLinearGradient(0,0,620,0);veil.addColorStop(0,'rgba(0,0,0,.97)');veil.addColorStop(.68,'rgba(0,0,0,.34)');veil.addColorStop(1,'rgba(0,0,0,.04)');rect(context,0,0,960,540,veil);fighter(context,{x:735,y:490,variant:'atlas',sprite:'shi-an',dir:1,action:'victory'},time);fighter(context,{x:855,y:485,variant:'indigo',sprite:'mei-lin',dir:-1,action:'staff',weapon:'staff'},time);
  context.save();context.strokeStyle='#52df7d';context.lineWidth=5;context.globalAlpha=.72;context.beginPath();context.arc(756,385,110,.25,5.8);context.stroke();context.restore();txt(context,'KUNG FU',55,75,65,C.gold);txt(context,'RETURN OF THE',62,154,29,'#7ae58d');txt(context,'GREEN DRAGON MASTER',55,195,36,'#55c978');txt(context,'A WUXIA ACTION RPG',62,248,15,'#e9d9aa','left','monospace');
}

export {C};
