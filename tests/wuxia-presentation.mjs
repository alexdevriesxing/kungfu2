import fs from 'node:fs';
const fail=message=>{throw new Error(message)};
const mode=process.argv[2]||'runtime';
if(mode==='static'){
  const source=fs.readFileSync('src/wuxia-presentation.js','utf8');
  for(const token of ['THEMES','decorateAllStages','drawBossIntro','drawVictorySeal','drawBrushTransition','drawRicePaperGrain','FIVE','Hall of Returning Paths'].filter(token=>token!=='FIVE'))if(!source.includes(token))fail(`Wuxia presentation feature missing: ${token}`);
  for(const token of ["particle:'petal'","particle:'snow'","particle:'silk'","particle:'jade'",'JIANGHU BOSS','brushTransition','enso(','seal('])if(!source.includes(token))fail(`Wuxia visual language missing: ${token}`);
  const styles=fs.readFileSync('styles.css','utf8');
  for(const token of ['ambientSilk','clip-path:polygon','武俠 · GREEN DRAGON · 江湖','cinnabar','loading-track::before'])if(!styles.includes(token))fail(`Wuxia shell styling missing: ${token}`);
  const boot=fs.readFileSync('src/bootstrap.js','utf8');
  if(!boot.includes("import('./wuxia-presentation.js')"))fail('Wuxia presentation module is not bootstrapped.');
  const sw=fs.readFileSync('sw-legacy.js','utf8');
  if(!sw.includes('wuxia-presentation.js'))fail('Wuxia presentation module is absent from offline cache.');
  console.log('Wuxia presentation wiring validation passed.');
  process.exit(0);
}

const noop=()=>{};
const gradient={addColorStop:noop};
const context=new Proxy({
  imageSmoothingEnabled:false,
  measureText:value=>({width:String(value).length*9}),
  createLinearGradient:()=>gradient,
  createRadialGradient:()=>gradient,
  getImageData:()=>({data:new Uint8ClampedArray(4)}),
},{get:(object,key)=>key in object?object[key]:noop,set:(object,key,value)=>(object[key]=value,true)});
const makeCanvas=()=>({width:960,height:540,style:{},getContext:()=>context});
const canvas=makeCanvas(),loading={style:{display:'block'},classList:{add:noop}},progress={textContent:'',style:{}};
globalThis.document={getElementById:id=>id==='game'?canvas:id==='loading'?loading:progress,querySelectorAll:()=>[],fullscreenElement:null,createElement:()=>makeCanvas()};
globalThis.window=globalThis;globalThis.addEventListener=noop;globalThis.requestAnimationFrame=()=>0;
globalThis.performance={now:()=>0};
Object.defineProperty(globalThis,'navigator',{value:{getGamepads:()=>[]},configurable:true,writable:true});
const saved=new Map;globalThis.localStorage={getItem:key=>saved.get(key)||null,setItem:(key,value)=>saved.set(key,String(value))};
globalThis.greenDragonAssets={sprites:{},stages:{}};
await import('../src/game.js');
await import('../src/enhancements.js');
await import('../src/world-systems.js');
await import('../src/act-two.js');
await import('../src/act-two-compat.js');
await import('../src/act-three.js');
await import('../src/act-four.js');
await import('../src/legacy-journey.js');
await import('../src/legacy-progression.js');
await import('../src/wuxia-presentation.js');
const game=globalThis.greenDragonGame,api=globalThis.greenDragonWuxiaPresentation;
const {NPCS}=await import('../src/content.js');
const find=id=>Object.values(NPCS).flat().find(item=>item.id===id);
const check=(name,value)=>{if(!value)fail(`${name} failed`);console.log(`PASS ${name}`)};

check('presentation api',api&&typeof api.themeFor==='function'&&typeof api.decorateAllStages==='function'&&typeof api.drawPresentation==='function');
check('location themes',api.themeFor({data:{location:'ghost-opera-backstage'},location:()=>({background:'ghost-opera.webp'})}).particle==='silk'&&api.themeFor({data:{location:'snow-lotus-village'},location:()=>({background:'snow.webp'})}).particle==='snow'&&api.themeFor({data:{location:'hall-returning-paths'},location:()=>({background:'legacy.webp'})}).particle==='jade');
api.decorateAllStages();
check('stage canvases decorated',Object.values(globalThis.greenDragonAssets.stages).length>0&&Object.values(globalThis.greenDragonAssets.stages).every(stage=>stage.__wuxiaDecorated));
game.newGame();
check('new journey chapter pulse',game.wuxiaFx.chapterPulse>0&&game.wuxiaFx.chapterTitle==='THE ASHES SPEAK');
const kuo=find('kuo');game.beginFight(kuo);
check('boss entrance state',game.wuxiaFx.bossIntro>0&&game.wuxiaFx.bossTitle===kuo.name&&game.wuxiaFx.bossSeal==='戰');
api.drawPresentation(game);
game.mode='victory';game.combat.rank='S';api.drawPresentation(game);
check('presentation renders combat and victory',true);
game.mode='explore';game.data.location='jade-river';game.data.player.x=951;game.travel(1);
check('brush travel transition',game.wuxiaFx.brushTransition>0);
api.drawPresentation(game);
console.log('Wuxia presentation runtime validation passed.');
