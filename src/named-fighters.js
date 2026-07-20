import { FIGHTER_ATLAS, createFighterAtlas } from './sprite-atlas.js';

const NAMED = Object.freeze({
  'shi-an': { base:'atlas', type:'hero' },
  'mei-lin': { base:'indigo', type:'crane' },
  'bo': { base:'crimson', type:'ox' },
  'hermit-reed': { base:'gold', type:'hermit' },
  'razor-fang': { base:'ashen', type:'claw' },
  'kuo': { base:'crimson', type:'brawler' },
  'novice-jin': { base:'gold', type:'monk' },
  'ghost-face': { base:'indigo', type:'ghost' },
});

const FRAME_INFO = Object.entries(FIGHTER_ATLAS.animations)
  .flatMap(([action, frames]) => frames.map((frame, phase) => ({frame, action, phase, count:frames.length})))
  .sort((a,b)=>a.frame-b.frame);

const px=(c,x,y,w,h,color)=>{c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));};
const line=(c,x1,y1,x2,y2,width,color)=>{c.strokeStyle=color;c.lineWidth=width;c.beginPath();c.moveTo(x1,y1);c.lineTo(x2,y2);c.stroke();};

function pose(action, phase, count){
  const progress=count<=1?0:phase/(count-1),wave=Math.sin(progress*Math.PI),cycle=Math.sin(progress*Math.PI*2);
  const p={bob:0,bodyY:0,lean:0};
  if(action==='idle')p.bob=cycle*1.5;
  if(action==='walk')p.bob=Math.abs(cycle)*2;
  if(action==='jump')p.bodyY=-wave*28;
  if(action==='crouch')p.bodyY=wave*18;
  if(action==='hurt'){p.lean=-wave*14;p.bodyY=wave*4;}
  if(action==='punch'||action==='sword')p.lean=wave*5;
  if(action==='kick')p.lean=-wave*7;
  return p;
}

function decorate(context, descriptor, type){
  const {frame,action,phase,count}=descriptor;
  const col=frame%8,row=Math.floor(frame/8),p=pose(action,phase,count);
  const ox=col*256+128+p.lean,oy=row*128+118+p.bodyY+p.bob;
  context.save();context.imageSmoothingEnabled=false;
  if(type==='hero'){
    px(context,ox-25,oy-96,9,43,'#173f32');px(context,ox-21,oy-91,5,36,'#69ca82');
    px(context,ox+12,oy-110,18,4,'#be3437');px(context,ox+25,oy-107,13,3,'#e95e4f');
    px(context,ox-3,oy-55,8,8,'#e6c264');
  }
  if(type==='crane'){
    px(context,ox-21,oy-93,42,43,'#e9e3d1');px(context,ox-24,oy-55,48,7,'#b43e43');
    px(context,ox-20,oy-112,40,5,'#171c1b');px(context,ox+17,oy-110,7,31,'#181d1c');
    line(context,ox+19,oy-109,ox+35,oy-93,3,'#c83d42');
    if(['kick','staff','victory'].includes(action)){line(context,ox-50,oy-78,ox-77,oy-96,3,'#f3efe0');line(context,ox-50,oy-75,ox-78,oy-68,2,'#d9d4c5');}
  }
  if(type==='ox'){
    px(context,ox-31,oy-91,62,41,'#77452d');px(context,ox-35,oy-87,10,35,'#d59a63');px(context,ox+25,oy-87,10,35,'#d59a63');
    px(context,ox-13,oy-110,26,7,'#3a241b');
    for(let i=-2;i<=2;i++)px(context,ox+i*8,oy-86+Math.abs(i)*2,6,6,'#30251d');
  }
  if(type==='hermit'){
    px(context,ox-24,oy-94,48,43,'#526c45');px(context,ox-15,oy-109,30,18,'#d9c8a6');
    px(context,ox-10,oy-92,20,28,'#dfddd1');px(context,ox+25,oy-72,13,18,'#8a572c');px(context,ox+28,oy-77,7,6,'#d8ae57');
    if(['staff','victory'].includes(action))line(context,ox-78,oy-89,ox+84,oy-47,6,'#675035');
  }
  if(type==='claw'){
    px(context,ox-23,oy-94,46,42,'#4a332a');px(context,ox-24,oy-56,48,7,'#9e302f');
    for(let i=0;i<3;i++){line(context,ox+35,oy-69+i*5,ox+59,oy-79+i*4,2,'#e6e2d5');line(context,ox-35,oy-69+i*5,ox-59,oy-79+i*4,2,'#e6e2d5');}
  }
  if(type==='brawler'){
    px(context,ox-28,oy-93,56,40,'#5d3c29');px(context,ox-31,oy-88,9,34,'#d79c66');px(context,ox+22,oy-88,9,34,'#d79c66');
    px(context,ox-20,oy-113,40,5,'#b63836');px(context,ox+17,oy-110,23,4,'#da4d44');
    px(context,ox+29,oy-73,14,16,'#4a4b4c');px(context,ox-43,oy-73,14,16,'#4a4b4c');
  }
  if(type==='monk'){
    px(context,ox-22,oy-95,44,43,'#a9752f');px(context,ox-12,oy-111,24,20,'#e0ad76');px(context,ox-15,oy-112,30,4,'#a9752f');
    for(let i=-2;i<=2;i++)px(context,ox+i*8,oy-84+Math.abs(i)*2,6,6,'#503721');
  }
  if(type==='ghost'){
    px(context,ox-25,oy-98,50,48,'#26213d');px(context,ox-17,oy-112,34,25,'#25262b');px(context,ox-12,oy-106,24,16,'#6d7377');
    px(context,ox-17,oy-116,34,6,'#b68a3e');px(context,ox-28,oy-119,56,5,'#1c1a28');
    if(['sword','victory','hurt'].includes(action)){context.strokeStyle='rgba(132,83,217,.75)';context.lineWidth=3;context.beginPath();context.arc(ox,oy-72,42+phase*2,0,Math.PI*2);context.stroke();}
  }
  context.restore();
}

export function createNamedFighterAtlas(key){
  const config=NAMED[key];
  if(!config)return null;
  const canvas=createFighterAtlas(config.base);
  if(!canvas)return null;
  const context=canvas.getContext('2d',{alpha:true});
  for(const descriptor of FRAME_INFO)decorate(context,descriptor,config.type);
  return canvas;
}

export function buildNamedFighterAtlases(){
  const atlases={};
  for(const key of Object.keys(NAMED)){
    const canvas=createNamedFighterAtlas(key);
    if(canvas)atlases[key]=canvas;
  }
  return atlases;
}

export const NAMED_FIGHTERS=Object.freeze(Object.keys(NAMED));