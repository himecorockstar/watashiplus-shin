// 操作例はコピー上で計算し、利用者の盤面は変更しない。
const GAME_AID118=(()=>{
function example(initial){
 const target=structuredClone(initial);target.history=[];const steps=[];
 const assert=(ok,message)=>{if(!ok)throw Error(message||'操作例を作れません')};
 const P={...PLAY115,move(s,a,b){
  if(a==='transfer'){if(s.selected!==null)s.selected=null;const before=JSON.stringify(s.tubes);P.move(s,'cell',b[0]);P.move(s,'cell',b[1]);return JSON.stringify(s.tubes)!==before}
  const changed=PLAY115.move(s,a,b);if(s===target&&changed)steps.push([a,b]);return changed;
 }};
function run(s,list){for(const [a,b]of list){if(s.done)break;assert(P.move(s,a,b),`invalid ${s.id} ${a} ${b}`)}return s}
function tap(s,i){return P.move(s,'cell',i)}
function bfs(s,actions,key,max=20000){const q=[{s:structuredClone(s),path:[]}],seen=new Set([key(s)]);for(let k=0;k<q.length&&k<max;k++){const v=q[k];if(v.s.won)return v.path;for(const [a,b]of actions(v.s)){const n=structuredClone(v.s);n.history=[];if(!P.move(n,a,b))continue;const tag=key(n);if(seen.has(tag))continue;seen.add(tag);q.push({s:n,path:[...v.path,[a,b]]})}}throw Error(`No solution: ${s.id}`)}
const directionActions=()=>['up','right','down','left'].map(x=>['dir',x]);
function solve(s){
 if(s.solution?.length)return run(s,[...s.solution]);
 switch(s.type){
 case'memory':for(const x of new Set(s.cards))for(let i=0;i<s.cards.length;i++)if(s.cards[i]===x)tap(s,i);break;
 case'sequence':P.move(s,'begin');for(const i of s.sequence)tap(s,i);break;
 case'locations':P.move(s,'begin');for(const x of s.order)tap(s,s.cards.indexOf(x));break;
 case'ringSwap':for(let i=0;i<s.cells.length;i++){let j=s.cells.indexOf(i);while(j>i){tap(s,j);tap(s,j-1);j--}}break;
 case'word':for(let i=0;i<s.target.length;i++)if(s.cells[i]!==s.target[i]){const j=s.cells.indexOf(s.target[i],i+1);tap(s,i);tap(s,j)}break;
 case'pipes':for(let i=0;i<s.target.length;i++)if(s.cells[i]!==s.target[i]){const j=s.cells.indexOf(s.target[i],i+1);assert(j>=0);tap(s,i);tap(s,j)}break;
 case'maze':run(s,bfs(s,directionActions,x=>[x.pos,x.hasSpecial,x.mode==='trail'?x.visited.join(','):''].join('|')));break;
 case'soko':run(s,bfs(s,directionActions,x=>[x.pos,x.boxes.slice().sort().join(','),x.pits.join(',')].join('|')));break;
 case'chain':for(const x of ['ねこ','こま','まくら','らくだ'])tap(s,s.words.indexOf(x));break;
 case'wordPath':run(s,[['cell',0],['cell',1],['cell',2]]);break;
 case'domino':for(let i=0;i<16;i+=2)tap(s,i);break;
 case'queens':for(const i of [1,7,8,14])tap(s,i);break;
 case'rooks':for(const i of [1,6,11,12])tap(s,i);break;
 case'symmetry':for(let i=0;i<16;i++)if(s.cells[i]!==s.target[i])tap(s,i);break;
 case'stroke':for(const i of [2,8,6,0,4,8])tap(s,i);break;
 case'tour':for(const i of [1,2,3,7,6,5,4,8,9,10,11,15,14,13,12])tap(s,i);break;
 case'flow':for(let k=0;k<4;k++){P.move(s,'color',k);for(let i=k*4+1;i<k*4+4;i++)tap(s,i)}break;
 case'sort':run(s,bfs(s,x=>{const out=[];for(let i=0;i<3;i++)if(x.tubes[i].length)for(let j=0;j<3;j++)if(i!==j){out.push(['transfer',[i,j]])}return out},x=>JSON.stringify(x.tubes)));break;
 case'frogs':run(s,bfs(s,x=>x.cells.flatMap((v,i)=>v?[['cell',i]]:[]),x=>x.cells.join('|')));break;
 case'river':run(s,bfs(s,()=>[0,1,2,3].map(i=>['boat',i]),x=>x.banks.join('')));break;
 case'hanoi':{function tower(n,a,b,c){if(!n)return;tower(n-1,a,c,b);tap(s,a);tap(s,b);tower(n-1,c,b,a)}tower(3,0,2,1);break}
 case'same':for(let turn=0;turn<20&&!s.done;turn++){const i=s.cells.findIndex((v,i)=>v!=null&&P.neighbors(i,s.n).some(j=>s.cells[j]===v));assert(i>=0);tap(s,i)}break;
 case'match':for(let turn=0;turn<30&&!s.done;turn++){let pair;for(let i=0;i<9&&!pair;i++)for(const j of P.neighbors(i,3))if(P.matchMove(s,i,j).length){pair=[i,j];break}assert(pair);tap(s,pair[0]);tap(s,pair[1])}break;
 case'reversi':for(let k=0;k<20&&!s.done;k++){const i=s.cells.findIndex((v,i)=>P.flips(s,i,1).length);assert(i>=0);tap(s,i)}break;
 case'connect':case'tic':for(let k=0;k<20&&!s.done;k++){const i=s.type==='tic'?s.cells.indexOf(0):Array.from({length:4},(_,i)=>i).find(i=>!s.cells[i]);assert(i>=0);tap(s,i)}break;
 case'tray':for(let x=0;x<4;x++)for(const i of [8+x,4+x,x])tap(s,i);break;
 case'link':{const solveLink=a=>{if(a.every(v=>v==null))return[];const probe={...s,cells:a};for(let i=0;i<a.length;i++)if(a[i]!=null)for(let j=i+1;j<a.length;j++)if(P.linkable(probe,i,j)){const next=a.slice();next[i]=next[j]=null;const tail=solveLink(next);if(tail)return [['cell',i],['cell',j],...tail]}return null};const path=solveLink(s.cells);assert(path,'Link game has no solution');run(s,path);break}
 case'mines':for(let i=0;i<25;i++)if(!s.mines.includes(i)&&!s.opened.includes(i))tap(s,i);break;
 case'unblock':run(s,[['cell',3],['dir','left'],['dir','left'],['cell',1],['dir','down'],['dir','down'],['cell',0],['dir','right'],['dir','right'],['dir','right'],['dir','right']]);break;
 default:throw Error('Missing solver '+s.type);
 }return s;
}

 const final=solve(target);assert(final.done,'終局に到達しません');final.history=[];return {steps,final};
}
function goal(s){const map={memory:'すべての絵札が組になります。',sequence:'覚えた並びを最後まで押せば完成です。',locations:'すべての絵を指定された順に見つければ完成です。',lights:'灯りが全部消えたら完成です。',slide:'空白を含めて、見本と同じ配置にします。',ringSwap:'絵札を見本の順にそろえます。',rotate:'全ての絵札が見本の位置に戻れば完成です。',maze:'鍵や花がある時は先に取り、旗へ進みます。',soko:s.mode==='bridge'?'箱で穴を埋め、旗まで進みます。':'全ての箱を印の上へ運びます。',pipes:s.mode==='garden'?'漏れのない管で花壇全体に水を通します。':'入口から出口まで、切れ目のない水路を作ります。',word:'花の名前になるよう文字を並べます。',chain:'しりとりで全ての言葉札をつなぎます。',wordPath:'言葉を最後の文字までなぞります。',domino:'花壇を敷石で隙間なく埋めます。',queens:'互いの縦・横・斜めに重ならない花を各行へ置きます。',rooks:'互いの縦・横に重ならない塔を各行へ置きます。',symmetry:'見本に対応する模様を全て塗ります。',stroke:'すべての線を一度ずつ通ります。',tour:'全てのマスを一度ずつ訪ねてから旗へ入ります。',flow:'全ての色の端同士を、重ならない道でつなぎます。',sort:'同じ色だけの満杯の筒にそろえます。',frogs:'カエルの左右をそっくり入れ替えます。',river:'船頭・狼・羊・菜葉を安全に向こう岸へ運びます。',hanoi:'全ての輪を右の柱へ移します。',peg:'最後に星をひとつだけ残します。',same:'花を全て消します。',match:'花束がいっぱいになれば完成です。',reversi:'終局で自分の石が多ければ勝ち。同数は引き分けです。',connect:'相手より先に石を縦・横・斜めに並べます。',tic:'相手より先に○を縦・横・斜めに並べます。',tray:'トレイが埋まる前に全ての絵札を片付けます。',link:'全ての絵札をペアで消します。',gears:'すべての矢印を上へそろえます。',mines:'石のないマスをすべて開きます。',unblock:'葡萄の駒を右端へ運びます。'};return map[s.type]||s.rule}
function describe(s,a,b){const directions={up:'上',down:'下',left:'左',right:'右'};if(a==='dir')return directions[b]+'の矢印を押します。';if(a==='begin')return 'プレイ開始を押します。';if(a==='row')return ['上','中','下'][b]+'の行を右へ動かします。';if(a==='col')return ['左','中','右'][b]+'の列を下へ動かします。';if(a==='color')return ['葡萄','花','葉','星'][b]+'の色を選びます。';if(a==='boat')return ['船頭だけ','狼と一緒','羊と一緒','菜葉と一緒'][b]+'に船を渡します。';if(a==='turn')return '敷石の向きを変えます。';if(a==='flag')return 'しるしモードを切り替えます。';if(a==='cell'){
 if(s.type==='hanoi')return ['左','中','右'][b]+'の柱を押します。';if(s.type==='sort')return '左から'+(Number(b)+1)+'番目の筒を押します。';if(s.type==='unblock')return b===0?'葡萄の駒を選びます。':'上から'+(s.cars[b].y+1)+'行、左から'+(s.cars[b].x+1)+'列にある駒を選びます。';if(s.type==='connect')return '左から'+(Number(b)+1)+'列目に石を落とします。';if(s.type==='sequence')return PLAY115.symbols[b]+'の絵を押します。';if(s.type==='chain')return '「'+s.words[b]+'」の札を押します。';
 const cols=s.type==='ringSwap'?4:s.type==='word'?s.cells.length:s.type==='frogs'?7:s.type==='gears'?5:s.n;return '上から'+(Math.floor(Number(b)/cols)+1)+'行、左から'+(Number(b)%cols+1)+'列のマスを押します。';}return '遊び方を確認してください。'}
return {example,goal,describe};
})();
