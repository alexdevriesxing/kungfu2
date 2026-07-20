export const CLANS = [
  {name:'Green Dragon Hall', creed:'Mercy before mastery; mastery before vengeance.'},
  {name:'Shaolin Temple', creed:'Strength disciplined by compassion.'},
  {name:'Wu Dang Monastery', creed:'Yield like water, strike like thunder.'},
  {name:'Red Sash Brotherhood', creed:'Silver buys loyalty; fear keeps it.'},
  {name:'White Crane School', creed:'One perfect opening is enough.'},
  {name:'Iron Ox Society', creed:'The mountain does not dodge.'},
  {name:'Plum Blossom Sect', creed:'Beauty conceals the blade.'},
  {name:'Beggar Kings', creed:'An empty bowl hears every secret.'},
  {name:'Black River Escort House', creed:'A promise delivered or a life forfeited.'},
  {name:'Seven Lantern Academy', creed:'Knowledge burns longer than anger.'},
  {name:'Ghost Face Opera', creed:'Every mask tells the truth sideways.'},
  {name:'Jade Phoenix Sisterhood', creed:'Rise brighter from every defeat.'},
  {name:'Southern Mantis School', creed:'Close the distance. End the doubt.'},
  {name:'Emei Moon Sect', creed:'Grace is a weapon sharpened in silence.'},
  {name:'Thunder Gate', creed:'Announce nothing. Arrive as thunder.'},
  {name:'Golden Carp Traders', creed:'Every road is a river of opportunity.'}
];

export const STYLES = [
  {name:'Green Dragon Fist', type:'unarmed', power:9, speed:8, chi:8},
  {name:'Shaolin Long Fist', type:'unarmed', power:8, speed:7, chi:6},
  {name:'Wu Dang Soft Palm', type:'unarmed', power:6, speed:8, chi:10},
  {name:'Iron Ox Body', type:'defence', power:7, speed:3, chi:7},
  {name:'White Crane Wing', type:'unarmed', power:7, speed:10, chi:6},
  {name:'Drunken Reed', type:'unarmed', power:8, speed:9, chi:7},
  {name:'Southern Mantis Hands', type:'unarmed', power:9, speed:9, chi:5},
  {name:'Emei Moon Needle', type:'weapon', power:7, speed:10, chi:8},
  {name:'Seven Star Staff', type:'weapon', power:9, speed:6, chi:7},
  {name:'Autumn Rain Sword', type:'weapon', power:8, speed:9, chi:8},
  {name:'Tiger Gate Saber', type:'weapon', power:10, speed:6, chi:5},
  {name:'Plum Blossom Steps', type:'movement', power:5, speed:10, chi:8},
  {name:'Beggar King Dog Staff', type:'weapon', power:9, speed:8, chi:7},
  {name:'Thunder Gate Elbow', type:'unarmed', power:10, speed:7, chi:4},
  {name:'Jade Phoenix Kicks', type:'unarmed', power:8, speed:10, chi:7},
  {name:'Black River Twin Blades', type:'weapon', power:9, speed:9, chi:5},
  {name:'Ghost Face Sleeves', type:'weapon', power:7, speed:9, chi:9},
  {name:'Golden Carp Coin Fist', type:'unarmed', power:6, speed:8, chi:8},
  {name:'Mountain Splitting Palm', type:'unarmed', power:10, speed:5, chi:7},
  {name:'Quiet Lake Breathing', type:'chi', power:4, speed:5, chi:10}
];

export const WEAPONS = [
  {id:'training-staff',name:'Oiled Ash Staff',kind:'staff',power:5,price:90,desc:'Balanced, forgiving and honest.'},
  {id:'river-sword',name:'River Reed Jian',kind:'sword',power:7,price:240,desc:'A flexible straight sword made in Hangzhou.'},
  {id:'tiger-saber',name:'Tiger-Tooth Dao',kind:'sword',power:9,price:420,desc:'A heavy saber with a serrated spine.'},
  {id:'monk-spade',name:'Pilgrim Moon Spade',kind:'staff',power:10,price:560,desc:'Half tool, half battlefield sermon.'},
  {id:'crane-spear',name:'White Crane Spear',kind:'staff',power:9,price:500,desc:'Long reach with a feather-light shaft.'},
  {id:'widow-needles',name:'Widow Lin’s Needles',kind:'sword',power:8,price:390,desc:'Hidden needles carried in a lacquered fan.'},
  {id:'thunder-hammer',name:'Thunder Gate Hammer',kind:'staff',power:12,price:730,desc:'Too heavy for anyone who asks its weight.'},
  {id:'beggar-staff',name:'Nine-Knot Beggar Staff',kind:'staff',power:11,price:680,desc:'Each knot remembers an unpaid debt.'},
  {id:'plum-blades',name:'Plum Blossom Twin Blades',kind:'sword',power:10,price:620,desc:'Paired blades that sing when crossed.'},
  {id:'green-dragon-blade',name:'Green Dragon Master’s Jian',kind:'sword',power:15,price:0,desc:'Your master’s missing sword. The final clue.'}
];

export const ITEMS = [
  {id:'herbal-tonic',name:'Herbal Tonic',price:30,desc:'Restore 35 HP.',effect:'heal'},
  {id:'ginseng-tea',name:'Ginseng Tea',price:45,desc:'Restore 30 Chi.',effect:'chi'},
  {id:'rice-bowl',name:'Hot Rice Bowl',price:18,desc:'Restore 18 HP.',effect:'heal-small'},
  {id:'smoke-bomb',name:'Smoke Bomb',price:65,desc:'Escape a non-boss battle.',effect:'escape'},
  {id:'ink-rubbing',name:'Temple Ink Rubbing',price:110,desc:'A collector’s clue and trade good.',effect:'quest'}
];

export const LOCATIONS = [
  {id:'market-street',name:'Golden Carp Market',background:'stage-market-street.webp',music:'village-theme',danger:1,subtitle:'Trade, rumours and knives behind smiles.'},
  {id:'jade-river',name:'Jade River Village',background:'stage-riverside-village.webp',music:'village-theme',danger:1,subtitle:'Where Green Dragon Hall burned.'},
  {id:'bamboo-forest',name:'Whispering Bamboo Forest',background:'stage-bamboo-forest.webp',music:'mountain-theme',danger:2,subtitle:'Every stalk seems to remember footsteps.'},
  {id:'mountain-trail',name:'Cloud-Breaker Trail',background:'stage-mountain-trail.webp',music:'mountain-theme',danger:3,subtitle:'The Red Sash Brotherhood owns the road.'},
  {id:'shaolin-courtyard',name:'Shaolin Monastery',background:'stage-shaolin-courtyard.webp',music:'mountain-theme',danger:2,subtitle:'Discipline, bells and old debts.'},
  {id:'wudang-walkway',name:'Wu Dang Sky Walkway',background:'stage-wudang-walkway.webp',music:'mountain-theme',danger:4,subtitle:'Truth waits above the clouds.'}
];

export const QUESTS = [
  {id:'ashes',title:'Ashes of Green Dragon Hall',giver:'Elder Zhao',summary:'Ask Elder Zhao what he saw on the night Master Shen was murdered.',reward:'60 silver · 80 XP'},
  {id:'footprints',title:'Footprints in Rain',giver:'Elder Zhao',summary:'Search the bamboo forest for the torn crimson sash.',reward:'90 silver · unlock Mei Lin'},
  {id:'teahouse',title:'The Teahouse Whisper',giver:'Tea-Seller Lian',summary:'Find the witness who heard the assassins name their employer.',reward:'120 silver · River Reed Jian'},
  {id:'ambush',title:'Red Sash Ambush',giver:'Shi-An',summary:'Defeat Kuo “Three Knuckles” on Cloud-Breaker Trail.',reward:'160 silver · 180 XP'},
  {id:'silent-bell',title:'The Silent Bell',giver:'Abbot Wu',summary:'Pass Shaolin’s trial and learn why the monastery bell did not ring.',reward:'Shaolin Long Fist'},
  {id:'five-shadows',title:'Five Shadows at Your Back',giver:'Mei Lin',summary:'Recruit allies willing to enter Ghost Face territory.',reward:'Party assist unlocked'},
  {id:'moonlit-ink',title:'Ink Beneath Moonlight',giver:'Broker Qiu',summary:'Acquire the Black River shipping ledger without starting a clan war.',reward:'250 silver · hidden route'},
  {id:'faceless',title:'The Man Without a Face',giver:'White Brow Kunlun',summary:'Challenge the masked killer who carried your master’s sword.',reward:'Act I conclusion'}
];

export const NPCS = {
  'jade-river':[
    {id:'elder-zhao',name:'Elder Zhao “Old Cicada”',x:250,variant:'gold',portrait:'portrait-master-1.webp',role:'quest',lines:[
      'Shi-An... you have your master’s eyes, but not yet his patience.',
      'The killers wore rain capes. One limped. One never touched the ground with his heels.',
      'I found crimson thread in the ash. Search the Whispering Bamboo before the next rain.'
    ]},
    {id:'mei-lin',name:'Mei Lin “Falling Petal”',x:520,variant:'indigo',portrait:'portrait-mei-lin.webp',role:'recruit',lines:[
      'Master Shen once hid me from the Red Sash collectors. I owe him more than incense.',
      'You are charging into a storm with one umbrella. Let me stand at your left shoulder.',
      'My White Crane kicks are faster than your suspicion.'
    ]},
    {id:'merchant-han',name:'Merchant Han “Two Ledgers”',x:760,variant:'ashen',portrait:'portrait-master-2.webp',role:'shop',lines:['Condolences are free. Everything useful costs silver.','I sell medicine, training weapons and information of varying honesty.']}
  ],
  'market-street':[
    {id:'tea-lian',name:'Tea-Seller Lian “Steam Eyes”',x:250,variant:'gold',portrait:'portrait-lotus.webp',role:'quest',lines:['The night your master died, three riders drank without removing their gloves.','Their leader smelled of temple ink and wintergreen oil. He called someone “Magistrate.”','Buy a bowl, sit quietly, and I may remember more.']},
    {id:'bo',name:'Bo “Iron Belly” Gan',x:510,variant:'crimson',portrait:'portrait-iron-palm.webp',role:'recruit',lines:['People call me slow because they only see me before I move.','Beat me cleanly and I will carry your packs. Beat me cleverly and I will guard your back.']},
    {id:'broker-qiu',name:'Broker Qiu “Silk Rat”',x:760,variant:'indigo',portrait:'portrait-master-7.webp',role:'shop',lines:['Truth is a luxury product. Rumour is the affordable imitation.','Bring me a temple rubbing and perhaps I remember a shipping ledger.']}
  ],
  'bamboo-forest':[
    {id:'hunter-fong',name:'Fong “Moss-Eyed” Yu',x:320,variant:'ashen',portrait:'portrait-master-6.webp',role:'quest',lines:['The bamboo bent west after midnight. Six men passed, but seven shadows returned.','Here—crimson cloth snagged on a thorn. Smells like cheap dye and expensive blood.']},
    {id:'hermit-reed',name:'Hermit Reed “Bent but Unbroken”',x:690,variant:'gold',portrait:'portrait-master-5.webp',role:'train',lines:['A rigid branch snaps. A reed borrows the storm’s strength.','Show me ten patient breaths and I will show you Willow Step.']}
  ],
  'mountain-trail':[
    {id:'kuo',name:'Kuo “Three Knuckles”',x:560,variant:'crimson',portrait:'portrait-razor-fang.webp',role:'fight',enemy:{name:'Kuo “Three Knuckles”',variant:'crimson',level:4,maxHp:150,power:12,reward:160,weapon:'staff'},lines:['Green Dragon cub! Your master squealed less than the villagers say.','Come take the rest of the story from my broken teeth.']}
  ],
  'shaolin-courtyard':[
    {id:'abbot-wu',name:'Abbot Wu “Stone Lantern”',x:320,variant:'gold',portrait:'portrait-master-2.webp',role:'train',lines:['Vengeance is a cup with a hole in its bottom. Drink carefully.','Master Shen came here three days before his death. He feared a war between schools.','Pass the Wooden Men trial. Then I will share what he entrusted to me.']},
    {id:'novice-jin',name:'Jin “Bell Sparrow”',x:690,variant:'ashen',portrait:'portrait-master-3.webp',role:'fight',enemy:{name:'Jin “Bell Sparrow”',variant:'gold',level:3,maxHp:125,power:10,reward:80,weapon:'none'},lines:['The abbot says you need humility. I have been assigned to deliver it.']}
  ],
  'wudang-walkway':[
    {id:'white-brow',name:'White Brow Kunlun',x:330,variant:'ashen',portrait:'portrait-master-6.webp',role:'quest',lines:['Your master and I disagreed for thirty years. I miss being wrong beside him.','The killer you seek practices a heel-less step taught only to court executioners.','Defeat his shadow on this walkway, then descend beneath the old observatory.']},
    {id:'ghost-face',name:'The Faceless Magistrate',x:700,variant:'indigo',portrait:'portrait-master-7.webp',role:'boss',enemy:{name:'The Faceless Magistrate',variant:'indigo',level:7,maxHp:220,power:16,reward:400,weapon:'sword',boss:true},lines:['Shi-An. Your master died protecting the name you carry.','Draw your weapon. The first truth is written in blood.']}
  ]
};

const GIVEN=['Bao','Chen','Dao','Feng','Guo','Hai','Jian','Kai','Lan','Ming','Ning','Qiao','Rong','Shan','Tao','Wei','Xian','Yao','Zhen','Luo'];
const FAMILY=['An','Bai','Cao','Deng','Fan','Gao','He','Jin','Kang','Lei','Mo','Pan','Qin','Shen','Su','Tang','Wen','Xue','Yan','Zhou'];
const EPITHETS=['Broken Fan','Copper Cricket','Laughing Wolf','Nine Toes','Rain Drinker','Sleepless Ox','Red Lantern','Paper Tiger','Silent Drum','Three Crows','Crooked Moon','Dusty Phoenix','One-Eyed Carp','Cold Teacup','Hundred Steps','Needle Beard','Empty Sleeve','Thunder Auntie','Little Mountain','Fox in Snow'];
const ORIGINS=['a flooded salt village','a caravan that vanished beyond Dunhuang','the kitchens of a corrupt magistrate','a theatre troupe that doubled as spies','a monastery library destroyed by lightning','a family of river ferrymen','an escort house ruined by one broken promise','a tea plantation occupied by bandits','the forgotten alleys beneath Luoyang','a mountain shrine where no bell rings'];
const MOTIVES=['seeks the sibling sold to debt collectors','hunts the officer who burned a family shrine','protects a secret map tattooed beneath one sleeve','owes a life-debt to an enemy clan','believes Master Shen once spared their parent','collects techniques before an old wound steals mobility','wants enough silver to buy freedom for an entire village','fears a prophecy naming them the next clan betrayer','searches for a weapon forged from fallen star iron','pretends to be foolish while investigating court assassins'];

export const FIGHTER_ARCHIVE = Array.from({length:240},(_,i)=>{
  const clan=CLANS[i%CLANS.length]; const style=STYLES[(i*7+3)%STYLES.length]; const weapon=WEAPONS[(i*5+2)%WEAPONS.length];
  return {
    id:`fighter-${i+1}`,
    name:`${GIVEN[i%GIVEN.length]} ${FAMILY[(i*9+4)%FAMILY.length]} “${EPITHETS[(i*11+2)%EPITHETS.length]}”`,
    rank:['Disciple','Senior Disciple','Instructor','Wandering Expert','Hall Master','Legendary Fighter'][Math.min(5,Math.floor(i/40))],
    clan:clan.name,style:style.name,weapon:weapon.name,
    backstory:`Raised in ${ORIGINS[(i*3+1)%ORIGINS.length]}, this fighter ${MOTIVES[(i*7+5)%MOTIVES.length]}. Their signature habit is ${['counting every breath','apologising before a duel','leaving a white pebble at each victory','never sitting with their back to a door','feeding stray dogs before travelling'][i%5]}.`
  };
});

const REGION_A=['Jade','Cloud','Red','White','Silent','Golden','Broken','Moonlit','Emerald','Black','Frost','Autumn'];
const REGION_B=['River','Crane','Tiger','Lantern','Willow','Thunder','Lotus','Carp','Dragon','Reed','Bell','Phoenix'];
const REGION_C=['Village','Pass','Temple','Market','Valley','Ford','Monastery','Fort','Garden','Harbour'];
export const WORLD_ARCHIVE = Array.from({length:144},(_,i)=>({
  id:`world-${i+1}`,
  name:`${REGION_A[i%REGION_A.length]} ${REGION_B[(i*5+2)%REGION_B.length]} ${REGION_C[(i*7+1)%REGION_C.length]}`,
  region:['Central Plains','Jiangnan','Sichuan','Wudang Range','Northern Frontier','Southern Coast'][i%6],
  hook:['a vanished caravan','a forbidden tournament','a clan wedding under threat','a haunted mine','an imperial tax revolt','a master seeking one final student'][i%6]
}));
