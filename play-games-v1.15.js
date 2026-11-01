// 操作型ミニゲーム。ブラウザーや保存APIに依存しない盤面処理。
const PLAY115=(()=>{
const catalog=[
['絵合わせ','カードを２枚ずつ開き、同じ絵をそろえます。違う絵は次のカードを押すと裏返ります。','memory',{group:2}],
['三つ子の絵札','同じ絵を３枚ずつ探します。３枚そろわなければ、次を押すと裏返ります。','memory',{group:3}],
['絵の順番の記憶','見本の並びを覚え、「プレイ開始」の後に同じ順で絵を押します。音は出ません。','sequence',{}],
['場所の記憶','カードの場所を覚えてから開始。上に示す絵の順に、隠れた場所を押します。','locations',{}],
['十字の消灯','押した灯りと上下左右が反転します。すべて消してください。','lights',{mode:'cross'}],
['一列の消灯','押した場所の横一列が反転します。すべて消してください。','lights',{mode:'row'}],
['斜めの消灯','押した場所と斜め隣の灯りが反転します。すべて消してください。','lights',{mode:'diagonal'}],
['輪の消灯','輪の中の灯りと左右の隣が反転します。すべて消してください。','lights',{mode:'ring'}],
['絵札スライド','空白に隣り合う絵札を動かし、見本の並びに戻します。','slide',{}],
['輪の入れ替え','隣り合う絵札を２枚選んで交換し、輪を見本の順にそろえます。端同士も隣です。','ringSwap',{}],
['行をくるり','行の右側の矢印で、その行を右へ循環させます。見本の配置に戻します。','rotate',{axis:'row'}],
['列をくるり','列の下の矢印で、その列を下へ循環させます。見本の配置に戻します。','rotate',{axis:'col'}],
['交差する絵札','行を右へ、列を下へ動かします。交差して動く絵札を見本にそろえます。','rotate',{axis:'both'}],
['小さな迷路','矢印で●を動かして旗へ。濃いマスは通れません。','maze',{mode:'normal'}],
['鍵の迷路','鍵を取ってから扉を通り、旗へ進みます。','maze',{mode:'key'}],
['氷の庭','矢印を押すと壁まで滑ります。花を取ってから旗へ進みます。','maze',{mode:'ice'}],
['消える足場','歩いた足場には戻れません。花を取ってから旗へ。行き詰まったら一手戻れます。','maze',{mode:'trail'}],
['箱を届ける','箱を押して印の場所へ運びます。箱は引けません。','soko',{mode:'single'}],
['倉庫の片付け','箱を押して、すべての印を埋めます。箱同士や壁を越えて押せません。','soko',{mode:'double'}],
['橋をかける','箱を穴へ押して橋にします。橋を渡って旗へ進んでください。','soko',{mode:'bridge'}],
['水路をつなぐ','管を押して回し、左上の入口から右下の出口へ水をつなぎます。','pipes',{mode:'route'}],
['花壇の水やり','管を回し、入口の水をすべての管へ通します。途中や端から水が漏れないようにします。','pipes',{mode:'garden'}],
['水路の引っ越し','２枚の管を選んで入れ替えます。全ての管を通る、入口から出口への道を作ります。管は回転しません。','pipes',{mode:'swap'}],
['ことばの絵札','文字札を２枚選んで交換し、花の名前を作ります。','word',{}],
['しりとり列車','言葉札をしりとりの順につなぎ、すべての札を使います。違う順に始めたら一手戻れます。','chain',{}],
['ことばをなぞる','見つけたい言葉を、上下左右に隣り合う文字でなぞります。後ろの文字を押すと一歩戻れます。','wordPath',{}],
['花壇の敷石','空きマスを押して２マスの敷石を置き、花壇を埋めます。向きを変えられ、置いた石は押すと外れます。','domino',{}],
['女王の庭','花を置き、縦・横・斜めの線に他の花が重ならない配置を作ります。各行に花を置いてください。','queens',{}],
['見張りの塔','塔を置き、縦と横の線に他の塔が重ならない配置を作ります。濃いマスは置けません。各行に塔を置きます。','rooks',{}],
['鏡の模様','左側を見本に、右側を押して模様を塗ります。左右対称にしてください。','symmetry',{mode:'mirror'}],
['回転する模様','上半分の見本を半回転した模様になるよう、下半分を押して塗ります。','symmetry',{mode:'turn'}],
['ひと筆の星座','点を押して線をたどり、すべての線を一度ずつ通ります。同じ点には戻れますが同じ線は通れません。','stroke',{}],
['すべての花を訪ねる','隣のマスへ進み、すべてのマスを一度ずつ通って旗へ。通ったマスには戻れません。','tour',{}],
['色の小道','色を選び、同じ色の端同士を隣接マスでつなぎます。違う色の道とは重なれません。端を押すとその色の道をやり直せます。','flow',{}],
['色玉の仕分け','筒を選んでから移し先を押します。一番上の玉だけを、空の筒か同じ色の上へ移し、色ごとに満杯にします。','sort',{}],
['カエルのすれ違い','カエルは向いている方へ進みます。空きへ一歩、または反対向きのカエルを跳び越え、左右を入れ替えます。','frogs',{}],
['川渡り','船頭と一緒に運ぶ物を選んで渡ります。船頭がいない岸で、狼と羊、羊と菜葉を一緒にしないで全員を向こう岸へ。','river',{}],
['輪の引っ越し','柱を選んで移し先を押します。上の輪だけ動かせます。小さい輪の上へ大きい輪は置けません。全て右の柱へ。','hanoi',{}],
['星のひとまたぎ','星を選び、隣の星を上下左右に跳び越えて空きへ。越えた星が消えます。最後に星をひとつ残します。','peg',{mode:'cross'}],
['斜めのひとまたぎ','星を選び、斜め隣の星を跳び越えて空きへ。越えた星が消えます。最後に星をひとつ残します。','peg',{mode:'diagonal'}],
['花びら落とし','同じ色が上下左右でつながる花を押して消します。孤立した花は消せません。全て消してください。','same',{}],
['花をそろえる','隣り合う花を交換し、縦か横に同じ花を並べて集めます。花束がいっぱいになったら完成です。','match',{}],
['小さなリバーシ','あなたは濃い石。相手の石を挟んで自分の色に変えます。置ける場所に印が出ます。','reversi',{}],
['四つ並べ','列を押して石を落とします。あなたは濃い石。相手より先に縦・横・斜めへ石を並べます。','connect',{}],
['まるばつ','空きマスに○を置きます。相手は×。縦・横・斜めに○を並べてください。','tic',{}],
['絵札トレイ','手前の絵札を選んでトレイへ。同じ絵が３枚集まると消えます。トレイが埋まる前に全て片付けます。','tray',{}],
['曲がり角の絵合わせ','同じ絵を２枚選び、空きマスを通って曲がり角２回以内でつなげると消えます。盤面の外も通れます。','link',{}],
['歯車の向き','歯車を押すと自分は右回り、隣は左回り。すべての矢印を上向きにそろえます。','gears',{}],
['宝石の庭','マスを開き、石の場所を避けて庭を調べます。点は隣の石の数。しるしモードで印を付けられます。最初は必ず安全です。','mines',{}],
['出口へスライド','駒を選んで矢印で動かします。横長は左右、縦長は上下だけ。葡萄の駒を右端へ運んでください。','unblock',{}]
].map(([name,rule,type,opt],id)=>({id,name,rule,type,...opt}));
const symbols=['🌷','🍇','🌿','⭐','🌙','💧','🕊','☀'];
const shuffle=(a,r=Math.random)=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const adjacent=(a,b,n)=>Math.abs(Math.floor(a/n)-Math.floor(b/n))+Math.abs(a%n-b%n)===1;
const neighbors=(i,n)=>[i-n,i+n,i%n?i-1:-1,i%n<n-1?i+1:-1].filter(x=>x>=0&&x<n*n);
const dirs={up:[-1,0],right:[0,1],down:[1,0],left:[0,-1]};
function step(i,dir,n){const d=dirs[dir],y=Math.floor(i/n)+d[0],x=i%n+d[1];return y>=0&&y<n&&x>=0&&x<n?y*n+x:-1}
function lightTargets(s,i){const n=s.n;if(s.mode==='row')return Array.from({length:n},(_,x)=>Math.floor(i/n)*n+x);if(s.mode==='ring')return [...new Set([i,(i+7)%8,(i+1)%8])];if(s.mode==='diagonal')return [i,...[-1,1].flatMap(dy=>[-1,1].map(dx=>{const y=Math.floor(i/n)+dy,x=i%n+dx;return y>=0&&y<n&&x>=0&&x<n?y*n+x:-1})).filter(x=>x>=0)];return [i,...neighbors(i,n)]}
function rotateLine(a,n,axis,line){const ix=Array.from({length:n},(_,k)=>axis==='row'?line*n+k:k*n+line),last=a[ix.at(-1)];for(let k=n-1;k>0;k--)a[ix[k]]=a[ix[k-1]];a[ix[0]]=last}
const pipeTurn=m=>((m<<1)&15)|(m>>3);
function pipeStatus(s){const a=s.cells,n=s.n;if(!(a[0]&8))return false;const seen=new Set([0]),q=[0];let leak=false;for(const i of q)for(let d=0;d<4;d++)if(a[i]&(1<<d)){const j=step(i,['up','right','down','left'][d],n);if(j<0){if(!(i===0&&d===3)&&!(s.mode!=='garden'&&i===a.length-1&&d===1))leak=true;continue}if(!(a[j]&(1<<((d+2)%4)))){leak=true;continue}if(!seen.has(j)){seen.add(j);q.push(j)}}return s.mode==='garden'?seen.size===a.length&&!leak:seen.has(a.length-1)&&!!(a.at(-1)&2)&&(s.mode!=='swap'||seen.size===a.length)&&!leak}
function create(id,r=Math.random){const c=catalog[id];if(!c)throw Error('Unknown game');const s={...c,n:3,moves:0,done:false,won:false,selected:null,note:'',history:[]};
switch(s.type){
case'memory':s.cards=shuffle(symbols.slice(0,4).flatMap(x=>Array(s.group).fill(x)),r);s.n=s.group===3?4:4;s.open=[];s.matched=[];break;
case'sequence':s.sequence=Array.from({length:5},()=>Math.floor(r()*6));s.progress=0;s.preview=true;break;
case'locations':s.cards=shuffle(symbols.slice(0,6),r);s.order=shuffle([...s.cards],r);s.progress=0;s.preview=true;break;
case'lights':s.n=s.mode==='ring'?8:3;s.cells=Array(s.mode==='ring'?8:9).fill(0);s.solution=[];for(let j=0;j<5;j++){const i=Math.floor(r()*s.cells.length);lightTargets(s,i).forEach(x=>s.cells[x]^=1);s.solution.unshift(['cell',i])}if(s.cells.every(x=>!x)){lightTargets(s,0).forEach(x=>s.cells[x]^=1);s.solution.unshift(['cell',0])}break;
case'slide':s.cells=[0,1,2,3,4,5,6,7,-1];s.solution=[];{let last=-1;for(let j=0;j<14;j++){const z=s.cells.indexOf(-1),a=neighbors(z,3).filter(x=>x!==last),i=a[Math.floor(r()*a.length)];[s.cells[z],s.cells[i]]=[s.cells[i],s.cells[z]];s.solution.unshift(['cell',z]);last=z}if(s.cells.every((v,i)=>v===(i===8?-1:i))){const z=8;[s.cells[7],s.cells[z]]=[s.cells[z],s.cells[7]];s.solution.unshift(['cell',8])}}break;
case'ringSwap':s.cells=shuffle([0,1,2,3,4,5,6,7],r);if(s.cells.every((v,i)=>v===i))[s.cells[0],s.cells[1]]=[s.cells[1],s.cells[0]];break;
case'rotate':s.cells=Array.from({length:9},(_,i)=>i);s.solution=[];for(let k=0;k<6;k++){const axis=s.axis==='both'?(r()<.5?'row':'col'):s.axis,line=Math.floor(r()*3);rotateLine(s.cells,3,axis,line);s.solution.unshift(...Array.from({length:2},()=>[axis,line]))}if(s.cells.every((v,i)=>v===i)){const axis=s.axis==='col'?'col':'row';rotateLine(s.cells,3,axis,0);s.solution.unshift([axis,0],[axis,0])}break;
case'maze':s.n=s.mode==='trail'?4:5;s.pos=0;s.goal=s.n*s.n-1;s.walls=s.mode==='ice'?[6,8,13,15,18]:s.mode==='trail'?[]:[2,7,10,14,17,22];s.special=s.mode==='key'?20:s.mode==='ice'?12:s.mode==='trail'?3:-1;s.door=s.mode==='key'?23:-1;s.hasSpecial=false;s.visited=[0];break;
case'soko':s.n=s.mode==='double'?6:5;s.walls=Array.from({length:s.n*s.n},(_,i)=>i).filter(i=>i<s.n||i>=s.n*(s.n-1)||i%s.n===0||i%s.n===s.n-1);if(s.mode==='bridge'){s.walls=Array.from({length:25},(_,i)=>i).filter(i=>Math.floor(i/5)!==2);s.pos=10;s.boxes=[11];s.pits=[12];s.goals=[];s.goal=14}else if(s.mode==='double'){s.pos=7;s.boxes=[14,20];s.goals=[16,22];s.pits=[]}else{s.pos=11;s.boxes=[12];s.goals=[8];s.pits=[]}break;
case'pipes':s.n=3;s.target=s.mode==='garden'?[14,10,12,5,6,9,1,3,8]:[10,10,12,6,10,9,3,10,10];s.cells=s.target.slice();s.solution=[];if(s.mode==='swap'){s.cells=shuffle(s.cells,r);if(pipeStatus(s))[s.cells[0],s.cells[2]]=[s.cells[2],s.cells[0]]}else{for(let i=0;i<9;i++){const count=Math.floor(r()*4);for(let k=0;k<count;k++)s.cells[i]=pipeTurn(s.cells[i]);for(let k=0;k<(4-count)%4;k++)s.solution.push(['cell',i])}if(pipeStatus(s)){s.cells[0]=pipeTurn(s.cells[0]);s.solution.unshift(['cell',0],['cell',0],['cell',0])}}break;
case'word':s.word=['さくら','つばき','すみれ','あじさい'][Math.floor(r()*4)];s.target=[...s.word];s.cells=shuffle(s.target,r);if(s.cells.join('')===s.word)s.cells.push(s.cells.shift());break;
case'chain':s.words=shuffle(['ねこ','こま','まくら','らくだ'],r);s.path=[];break;
case'wordPath':s.n=4;s.word='さくら';s.cells=['さ','く','ら','も','こ','し','や','う','な','ま','け','あ','と','り','す','え'];s.path=[];break;
case'domino':s.n=4;s.cells=Array(16).fill(-1);s.vertical=false;s.nextStone=0;break;
case'queens':case'rooks':s.n=4;s.cells=Array(16).fill(0);s.blocked=s.type==='rooks'?[0,5,10,15]:[];break;
case'symmetry':s.n=4;s.target=Array(16).fill(0);for(let i=0;i<16;i++)if(s.mode==='mirror'?i%4<2:i<8){s.target[i]=r()<.5?1:0;const j=s.mode==='mirror'?Math.floor(i/4)*4+3-i%4:15-i;s.target[j]=s.target[i]}s.target[0]=1;s.target[s.mode==='mirror'?3:15]=1;s.cells=s.target.map((v,i)=>(s.mode==='mirror'?i%4<2:i<8)?v:0);break;
case'stroke':s.n=3;s.points=[0,2,4,6,8];s.edges=[[0,2],[2,8],[8,6],[6,0],[0,4],[4,8]];s.path=[0];s.used=[];break;
case'tour':s.n=4;s.path=[0];s.goal=12;break;
case'flow':s.n=4;s.pairs=[[0,3],[4,7],[8,11],[12,15]];s.paths=s.pairs.map(([a])=>[a]);s.color=0;break;
case'sort':s.tubes=[['🌷','🍇','🍇'],['🍇','🌷','🌷'],[]];s.cap=3;break;
case'frogs':s.cells=['→','→','→','','←','←','←'];break;
case'river':s.banks=[0,0,0,0];break;
case'hanoi':s.towers=[[3,2,1],[],[]];break;
case'peg':s.n=5;s.valid=Array.from({length:25},(_,i)=>i).filter(i=>s.mode==='diagonal'||Math.floor(i/5)===2||i%5===2);s.cells=Array(25).fill(0);s.cells[12]=1;s.solution=[];{for(let k=0;k<8;k++){const opts=[];for(const to of s.valid)if(s.cells[to])for(const [dy,dx]of(s.mode==='diagonal'?[[-1,-1],[-1,1],[1,-1],[1,1]]:[[-1,0],[1,0],[0,-1],[0,1]])){const y=Math.floor(to/5)+dy*2,x=to%5+dx*2,my=Math.floor(to/5)+dy,mx=to%5+dx,from=y*5+x,mid=my*5+mx;if(y>=0&&y<5&&x>=0&&x<5&&s.valid.includes(from)&&s.valid.includes(mid)&&!s.cells[from]&&!s.cells[mid])opts.push({from,mid,to})}if(!opts.length)break;const m=opts[Math.floor(r()*opts.length)];s.cells[m.to]=0;s.cells[m.from]=s.cells[m.mid]=1;s.solution.unshift(['cell',m.from],['cell',m.to])}}break;
case'same':s.n=4;s.cells=['🌷','🌷','🍇','🍇','🌿','🌿','⭐','⭐','🌷','🌷','🍇','🍇','🌿','🌿','⭐','⭐'];break;
case'match':s.n=3;s.cells=['🌷','🍇','🌷','🍇','🌷','🌿','🌿','🌷','🍇'];s.collected=0;s.seed=1;break;
case'reversi':s.n=4;s.cells=Array(16).fill(0);s.cells[5]=s.cells[10]=2;s.cells[6]=s.cells[9]=1;break;
case'connect':s.n=4;s.cells=Array(16).fill(0);break;
case'tic':s.n=3;s.cells=Array(9).fill(0);break;
case'tray':s.cards=Array.from({length:12},(_,i)=>symbols[i%4]);s.removed=[];s.tray=[];break;
case'link':s.n=4;s.cells=['🌷','🍇','🍇','🌷','🌿','🌙','🌙','🌿','⭐','💧','💧','⭐','🕊','☀','☀','🕊'];break;
case'gears':s.cells=Array(5).fill(0);s.solution=[];for(const i of [0,2,1,4,3]){gear(s,i);s.solution.unshift(['cell',i],['cell',i],['cell',i])}break;
case'mines':s.n=5;s.mines=[6,9,15,22];s.opened=[];s.flags=[];s.flagMode=false;s.started=false;break;
case'unblock':s.n=6;s.cars=[{x:0,y:2,len:2,axis:'h'},{x:2,y:1,len:3,axis:'v'},{x:1,y:0,len:3,axis:'h'},{x:2,y:4,len:2,axis:'h'}];break;
}return s}
function snapshot(s){const {history,...rest}=s;return structuredClone(rest)}
function finish(s,won=true,text='できました！'){s.done=true;s.won=won;s.note=text}
function move(s,action,arg){if(s.done)return false;const before=snapshot(s);s.note='';const changed=apply(s,action,arg);if(changed){s.history.push(before);if(s.history.length>300)s.history.shift();s.moves++}return changed}
function undo(s){if(!s.history.length)return s;const h=s.history.slice(),previous=h.pop();return Object.assign(previous,{history:h,note:'一手戻しました。'})}
function gear(s,i){s.cells[i]=(s.cells[i]+1)%4;for(const j of [i-1,i+1])if(j>=0&&j<s.cells.length)s.cells[j]=(s.cells[j]+3)%4}
function groupAt(cells,n,i){if(cells[i]==null)return[];const set=new Set([i]),q=[i];for(const x of q)for(const j of neighbors(x,n))if(cells[j]===cells[i]&&!set.has(j)){set.add(j);q.push(j)}return q}
function lineWin(a,n,who,length){for(let i=0;i<a.length;i++)if(a[i]===who)for(const [dy,dx]of[[0,1],[1,0],[1,1],[1,-1]]){let count=1;for(let k=1;k<length;k++){const y=Math.floor(i/n)+dy*k,x=i%n+dx*k;if(y<0||y>=n||x<0||x>=n||a[y*n+x]!==who)break;count++}if(count===length)return true}return false}
function flips(s,i,who){if(s.cells[i])return[];const result=[];for(const [dy,dx]of[[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]){let y=Math.floor(i/s.n)+dy,x=i%s.n+dx,run=[];while(y>=0&&y<s.n&&x>=0&&x<s.n&&s.cells[y*s.n+x]===3-who){run.push(y*s.n+x);y+=dy;x+=dx}if(run.length&&y>=0&&y<s.n&&x>=0&&x<s.n&&s.cells[y*s.n+x]===who)result.push(...run)}return result}
function linkable(s,a,b){if(a===b||s.cells[a]==null||s.cells[a]!==s.cells[b])return false;const n=s.n+2,start=(Math.floor(a/s.n)+1)*n+a%s.n+1,end=(Math.floor(b/s.n)+1)*n+b%s.n+1;const blocked=i=>{const y=Math.floor(i/n)-1,x=i%n-1;return y>=0&&y<s.n&&x>=0&&x<s.n&&s.cells[y*s.n+x]!=null&&i!==start&&i!==end};const q=[{i:start,d:-1,t:0}],best=new Map();for(let k=0;k<q.length;k++){const cur=q[k];for(let d=0;d<4;d++){const j=step(cur.i,['up','right','down','left'][d],n),turn=cur.t+(cur.d>=0&&cur.d!==d?1:0);if(j<0||turn>2||blocked(j))continue;if(j===end)return true;const key=j+':'+d;if((best.get(key)??3)<=turn)continue;best.set(key,turn);q.push({i:j,d,t:turn})}}return false}
function matches(a,n){const out=new Set();for(let i=0;i<a.length;i++)for(const d of [1,n]){if(d===1&&i%n>n-3||d===n&&Math.floor(i/n)>n-3)continue;if(a[i]!=null&&a[i]===a[i+d]&&a[i]===a[i+2*d]){out.add(i);out.add(i+d);out.add(i+2*d)}}return [...out]}
function matchMove(s,a,b){const cells=s.cells.slice();[cells[a],cells[b]]=[cells[b],cells[a]];return matches(cells,s.n)}
function safeRiver(a){for(const bank of [0,1])if(a[0]!==bank&&((a[1]===bank&&a[2]===bank)||(a[2]===bank&&a[3]===bank)))return false;return true}
function apply(s,action,arg){const i=Number(arg),a=s.cells;
switch(s.type){
case'memory':if(action!=='cell'||!Number.isInteger(i)||i<0||i>=s.cards.length||s.matched.includes(i)||s.open.includes(i))return false;if(s.open.length===s.group)s.open=[];s.open.push(i);if(s.open.length===s.group&&s.open.every(j=>s.cards[j]===s.cards[s.open[0]])){s.matched.push(...s.open);s.open=[];if(s.matched.length===s.cards.length)finish(s)}return true;
case'sequence':case'locations':if(action==='begin'&&s.preview){s.preview=false;s.progress=0;return true}if(action!=='cell'||s.preview)return false;{const correct=s.type==='sequence'?i===s.sequence[s.progress]:s.cards[i]===s.order[s.progress];if(correct){s.progress++;if(s.progress===(s.type==='sequence'?s.sequence.length:s.order.length))finish(s)}else{s.progress=0;s.note='もう一度、最初からたどってみましょう。'}}return true;
case'lights':if(action!=='cell'||!Number.isInteger(i)||i<0||i>=a.length)return false;lightTargets(s,i).forEach(x=>a[x]^=1);if(a.every(x=>!x))finish(s);return true;
case'slide':if(action!=='cell'||!adjacent(i,a.indexOf(-1),3))return false;{const z=a.indexOf(-1);[a[i],a[z]]=[a[z],a[i]];if(a.every((v,j)=>v===(j===8?-1:j)))finish(s)}return true;
case'ringSwap':case'word':case'pipes':{
 if(action!=='cell'||!Number.isInteger(i)||i<0||i>=a.length)return false;
 if(s.type==='pipes'&&s.mode!=='swap'){a[i]=pipeTurn(a[i]);if(pipeStatus(s))finish(s);return true}
 if(s.selected===null){s.selected=i;return true}const j=s.selected;s.selected=null;if(i===j)return true;
 if(s.type==='ringSwap'&&Math.abs(i-j)!==1&&Math.abs(i-j)!==7){s.note='輪の隣同士を選んでください。';return true}
 [a[i],a[j]]=[a[j],a[i]];if(s.type==='word'?a.join('')===s.word:s.type==='ringSwap'?a.every((v,k)=>v===k):pipeStatus(s))finish(s);return true;
}
case'rotate':if(!['row','col'].includes(action)||i<0||i>=3||s.axis!=='both'&&action!==s.axis)return false;rotateLine(a,3,action,i);if(a.every((v,j)=>v===j))finish(s);return true;
case'maze':if(action!=='dir'||!dirs[arg])return false;{let to=step(s.pos,arg,s.n);const blocked=j=>j<0||s.walls.includes(j)||(j===s.door&&!s.hasSpecial)||(s.mode==='trail'&&s.visited.includes(j));if(blocked(to))return false;if(s.mode==='ice')while(!blocked(step(to,arg,s.n)))to=step(to,arg,s.n);if(to===s.goal&&s.special>=0&&!s.hasSpecial&&to!==s.special){s.note='先に鍵や花を取りに行きましょう。';return false}s.pos=to;if(to===s.special)s.hasSpecial=true;s.visited.push(to);if(to===s.goal)finish(s)}return true;
case'soko':if(action!=='dir'||!dirs[arg])return false;{const to=step(s.pos,arg,s.n);if(to<0||s.walls.includes(to))return false;const box=s.boxes.indexOf(to);if(box>=0){const dest=step(to,arg,s.n);if(dest<0||s.walls.includes(dest)||s.boxes.includes(dest))return false;if(s.pits.includes(dest)){s.pits=s.pits.filter(x=>x!==dest);s.boxes.splice(box,1)}else s.boxes[box]=dest}else if(s.pits.includes(to))return false;s.pos=to;if(s.mode==='bridge'?s.pos===s.goal:s.goals.every(x=>s.boxes.includes(x)))finish(s)}return true;
case'chain':if(action!=='cell'||!s.words[i]||s.path.includes(i))return false;if(s.path.length&&[...s.words[s.path.at(-1)]].at(-1)!==[...s.words[i]][0]){s.note='前の言葉の最後から始まる札を選びます。';return false}s.path.push(i);if(s.path.length===s.words.length)finish(s);return true;
case'wordPath':if(action!=='cell'||!Number.isInteger(i)||i<0||i>=a.length)return false;if(s.path.at(-2)===i){s.path.pop();return true}if(s.path.includes(i)||a[i]!==[...s.word][s.path.length]||s.path.length&&!adjacent(i,s.path.at(-1),s.n)){s.note='言葉の順に、上下左右につながる文字を選んでください。';return false}s.path.push(i);if(s.path.length===[...s.word].length)finish(s);return true;
case'domino':if(action==='turn'){s.vertical=!s.vertical;return true}if(action!=='cell'||i<0||i>=a.length)return false;if(a[i]>=0){const id=a[i];s.cells=a.map(x=>x===id?-1:x);return true}{const j=s.vertical?i+s.n:i+1;if(j>=a.length||!s.vertical&&i%s.n===s.n-1||a[j]>=0)return false;a[i]=a[j]=s.nextStone++;if(a.every(x=>x>=0))finish(s)}return true;
case'queens':case'rooks':if(action!=='cell'||i<0||i>=a.length||s.blocked.includes(i))return false;if(a[i]){a[i]=0;return true}for(let j=0;j<a.length;j++)if(a[j]){const dy=Math.abs(Math.floor(i/s.n)-Math.floor(j/s.n)),dx=Math.abs(i%s.n-j%s.n);if(!dy||!dx||s.type==='queens'&&dy===dx){s.note='他の駒の線に重なります。置いた駒は押すと外せます。';return false}}a[i]=1;if(a.filter(Boolean).length===s.n)finish(s);return true;
case'symmetry':if(action!=='cell'||i<0||i>=a.length||(s.mode==='mirror'?i%4<2:i<8))return false;a[i]^=1;if(a.every((v,j)=>v===s.target[j]))finish(s);return true;
case'stroke':if(action!=='cell'||!s.points.includes(i))return false;{const from=s.path.at(-1),edge=s.edges.findIndex(([a,b])=>(a===from&&b===i||b===from&&a===i));if(edge<0||s.used.includes(edge))return false;s.used.push(edge);s.path.push(i);if(s.used.length===s.edges.length)finish(s)}return true;
case'tour':if(action!=='cell'||!adjacent(i,s.path.at(-1),s.n)||s.path.includes(i))return false;if(i===s.goal&&s.path.length<s.n*s.n-1){s.note='旗に入る前に、すべてのマスを訪ねてください。';return false}s.path.push(i);if(s.path.length===s.n*s.n&&i===s.goal)finish(s);return true;
case'flow':if(action==='color'&&i>=0&&i<s.pairs.length){s.color=i;return true}if(action!=='cell'||i<0||i>=s.n*s.n)return false;{const k=s.color,p=s.paths[k],[start,end]=s.pairs[k];if(i===start){s.paths[k]=[start];return true}if(p.at(-2)===i){p.pop();return true}if(p.at(-1)===end||p.includes(i)||!adjacent(p.at(-1),i,s.n))return false;for(let c=0;c<s.pairs.length;c++)if(c!==k&&(s.paths[c].includes(i)||s.pairs[c].includes(i)))return false;p.push(i);if(s.paths.every((p,c)=>p.at(-1)===s.pairs[c][1]))finish(s)}return true;
case'sort':if(action!=='cell'||i<0||i>=s.tubes.length)return false;if(s.selected===null){if(!s.tubes[i].length)return false;s.selected=i;return true}{const from=s.selected;s.selected=null;if(from===i)return true;const source=s.tubes[from],dest=s.tubes[i];if(dest.length>=s.cap||dest.length&&dest.at(-1)!==source.at(-1)){s.note='空きか、同じ色の上へ移してください。';return true}dest.push(source.pop());if(s.tubes.every(t=>!t.length||t.length===s.cap&&t.every(v=>v===t[0])))finish(s)}return true;
case'frogs':if(action!=='cell'||!a[i])return false;{const z=a.indexOf(''),delta=a[i]==='→'?1:-1;const gap=z-i;if(gap!==delta&&!(gap===2*delta&&a[i+delta]&&a[i+delta]!==a[i]))return false;[a[z],a[i]]=[a[i],a[z]];if(a.join('|')===['←','←','←','','→','→','→'].join('|'))finish(s)}return true;
case'river':if(action!=='boat'||i<0||i>3||i>0&&s.banks[i]!==s.banks[0])return false;{const copy=s.banks.slice();copy[0]^=1;if(i)copy[i]^=1;if(!safeRiver(copy)){s.note='その渡り方では、留守の岸で食べられてしまいます。';return false}s.banks=copy;if(copy.every(x=>x===1))finish(s)}return true;
case'hanoi':if(action!=='cell'||i<0||i>2)return false;if(s.selected===null){if(!s.towers[i].length)return false;s.selected=i;return true}{const from=s.selected;s.selected=null;if(from===i)return true;const disc=s.towers[from].at(-1),dest=s.towers[i];if(dest.length&&dest.at(-1)<disc){s.note='小さい輪の上には置けません。';return true}dest.push(s.towers[from].pop());if(s.towers[2].length===3)finish(s)}return true;
case'peg':if(action!=='cell'||!s.valid.includes(i))return false;if(a[i]){s.selected=i;return true}if(s.selected===null)return false;{const from=s.selected,dy=Math.floor(i/5)-Math.floor(from/5),dx=i%5-from%5;const valid=s.mode==='diagonal'?Math.abs(dy)===2&&Math.abs(dx)===2:Math.abs(dy)+Math.abs(dx)===2&&(!dy||!dx);if(!valid)return false;const mid=(i+from)/2;if(!a[mid])return false;a[from]=a[mid]=0;a[i]=1;s.selected=null;if(a.filter(Boolean).length===1)finish(s)}return true;
case'same':if(action!=='cell')return false;{const group=groupAt(a,s.n,i);if(group.length<2)return false;group.forEach(x=>a[x]=null);const columns=[];for(let x=0;x<s.n;x++){const col=Array.from({length:s.n},(_,y)=>a[y*s.n+x]).filter(v=>v!=null);if(col.length)columns.push([...Array(s.n-col.length).fill(null),...col])}s.cells=Array(s.n*s.n).fill(null);columns.forEach((col,x)=>col.forEach((v,y)=>s.cells[y*s.n+x]=v));if(s.cells.every(x=>x==null))finish(s)}return true;
case'match':if(action!=='cell'||i<0||i>=a.length)return false;if(s.selected===null){s.selected=i;return true}{const j=s.selected;s.selected=null;if(i===j)return true;if(!adjacent(i,j,s.n))return true;const hit=matchMove(s,i,j);if(!hit.length){s.note='縦か横に同じ花がそろう交換を探しましょう。';return true}[a[i],a[j]]=[a[j],a[i]];s.collected+=hit.length;for(const k of hit)a[k]=symbols[(s.seed++*7)%3];if(s.collected>=9)finish(s,true,'花束ができました！');else{let possible=false;for(let x=0;x<a.length;x++)for(const y of neighbors(x,s.n))if(matchMove(s,x,y).length)possible=true;if(!possible)s.cells=['🌷','🍇','🌷','🍇','🌷','🌿','🌿','🌷','🍇']}}return true;
case'reversi':if(action!=='cell')return false;{const f=flips(s,i,1);if(!f.length)return false;a[i]=1;f.forEach(j=>a[j]=1);for(let turn=0;turn<16;turn++){const user=a.flatMap((v,j)=>flips(s,j,1).length?[j]:[]),ai=a.flatMap((v,j)=>flips(s,j,2).length?[j]:[]);if(!user.length&&!ai.length){const mine=a.filter(v=>v===1).length,other=a.filter(v=>v===2).length;finish(s,mine>=other,mine===other?'引き分けです。':mine>other?'あなたの勝ちです！':'相手の勝ちです。もう一勝負できます。');break}if(ai.length){const best=ai.sort((x,y)=>flips(s,y,2).length-flips(s,x,2).length)[0],flip=flips(s,best,2);a[best]=2;flip.forEach(j=>a[j]=2)}if(a.some((v,j)=>flips(s,j,1).length))break}}return true;
case'connect':case'tic':if(action!=='cell')return false;{let pos=i;if(s.type==='connect'){if(i<0||i>=s.n)return false;pos=-1;for(let y=s.n-1;y>=0;y--)if(!a[y*s.n+i]){pos=y*s.n+i;break}}if(pos<0||pos>=a.length||a[pos])return false;a[pos]=1;const len=s.type==='tic'?3:4;if(lineWin(a,s.n,1,len)){finish(s,true,'あなたの勝ちです！');return true}let options=s.type==='connect'?Array.from({length:s.n},(_,x)=>{for(let y=s.n-1;y>=0;y--)if(!a[y*s.n+x])return y*s.n+x;return -1}).filter(x=>x>=0):a.flatMap((v,j)=>v?[]:[j]);if(!options.length){finish(s,true,'引き分けです。');return true}const findWin=who=>options.find(j=>{a[j]=who;const win=lineWin(a,s.n,who,len);a[j]=0;return win});let chosen=findWin(2);if(chosen===undefined)chosen=findWin(1);if(chosen===undefined)chosen=options.includes(Math.floor(a.length/2))?Math.floor(a.length/2):options[0];a[chosen]=2;if(lineWin(a,s.n,2,len))finish(s,false,'相手の勝ちです。もう一勝負できます。');else if(a.every(Boolean))finish(s,true,'引き分けです。')}return true;
case'tray':if(action!=='cell'||i<0||i>=s.cards.length||s.removed.includes(i)||i+4<s.cards.length&&!s.removed.includes(i+4))return false;s.removed.push(i);s.tray.push(s.cards[i]);{const same=s.tray.filter(v=>v===s.cards[i]).length;if(same===3)s.tray=s.tray.filter(v=>v!==s.cards[i]);if(s.removed.length===s.cards.length)finish(s);else if(s.tray.length>=5)finish(s,false,'トレイがいっぱいです。一手戻って試せます。')}return true;
case'link':if(action!=='cell'||a[i]==null)return false;if(s.selected===null){s.selected=i;return true}{const j=s.selected;s.selected=null;if(i===j)return true;if(linkable(s,j,i)){a[i]=a[j]=null;if(a.every(x=>x==null))finish(s)}else s.note='空いた道で、曲がり角２回以内につなぎます。'}return true;
case'gears':if(action!=='cell'||i<0||i>=a.length)return false;gear(s,i);if(a.every(x=>x===0))finish(s);return true;
case'mines':if(action==='flag'){s.flagMode=!s.flagMode;return true}if(action!=='cell'||i<0||i>=25||s.opened.includes(i))return false;if(s.flagMode){s.flags=s.flags.includes(i)?s.flags.filter(x=>x!==i):[...s.flags,i];return true}if(s.flags.includes(i))return false;if(!s.started){s.started=true;if(s.mines.includes(i)){s.mines=s.mines.filter(x=>x!==i);s.mines.push(Array.from({length:25},(_,j)=>j).find(j=>j!==i&&!s.mines.includes(j)))}}if(s.mines.includes(i)){finish(s,false,'石に当たりました。一手戻って続けるか、もう一勝負できます。');s.opened.push(i);return true}{const q=[i];for(const p of q)if(!s.opened.includes(p)){s.opened.push(p);if(!mineCount(s,p))for(const j of around(p,5))if(!s.mines.includes(j)&&!s.flags.includes(j)&&!q.includes(j))q.push(j)}if(s.opened.filter(x=>!s.mines.includes(x)).length===25-s.mines.length)finish(s)}return true;
case'unblock':if(action==='cell'&&i>=0&&i<s.cars.length){s.selected=i;return true}if(action!=='dir'||s.selected===null||!dirs[arg])return false;{const car=s.cars[s.selected],d=dirs[arg];if(car.axis==='h'&&d[0]||car.axis==='v'&&d[1])return false;const x=car.x+d[1],y=car.y+d[0];if(x<0||y<0||x+(car.axis==='h'?car.len:1)>6||y+(car.axis==='v'?car.len:1)>6)return false;const occupied=carSquares({...car,x,y},6);for(let j=0;j<s.cars.length;j++)if(j!==s.selected&&carSquares(s.cars[j],6).some(k=>occupied.includes(k)))return false;car.x=x;car.y=y;if(s.cars[0].x===4)finish(s)}return true;
}return false}
function around(i,n){const out=[];for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){if(!dy&&!dx)continue;const y=Math.floor(i/n)+dy,x=i%n+dx;if(y>=0&&y<n&&x>=0&&x<n)out.push(y*n+x)}return out}
function mineCount(s,i){return around(i,s.n).filter(j=>s.mines.includes(j)).length}
function carSquares(c,n){return Array.from({length:c.len},(_,k)=>(c.y+(c.axis==='v'?k:0))*n+c.x+(c.axis==='h'?k:0))}
function hint(s){
 if(s.type==='reversi'){const i=s.cells.findIndex((v,i)=>flips(s,i,1).length);return i<0?'置ける場所がない時は自動で手番を進めます。':`印のあるマスへ石を置けます。`}
 if(s.type==='mines'){const i=s.cells?.length;return 'しるしを付けたマスは開きません。「安全なマス」ボタンで、石のない場所を一つ開けられます。'}
 if(s.type==='word')return `作る花の名前は「${s.word}」です。`;
 if(s.type==='chain')return '「ねこ」から始めると、すべての言葉をつなげられます。';
 if(s.type==='pipes')return '管の端同士が向かい合うようにします。入口は左上の左側です。';
 if(s.type==='queens')return '上から、左から２番目・右端・左端・左から３番目に置く配置があります。';
 if(s.type==='river')return '最初は羊を運びます。船頭だけで戻ることもできます。';
 if(s.type==='frogs')return '中央の空きへ進んだ後、反対向きの相手を跳び越えます。一手戻ってやり直せます。';
 if(s.type==='unblock')return '下側の横長の駒を左へ寄せると、縦長の駒を下へ動かせます。';
 return '遊び方を確認し、行き詰まったら「一手戻る」で試し直せます。制限時間はありません。';
}
return {catalog,symbols,create,move,undo,snapshot,adjacent,neighbors,step,lightTargets,pipeStatus,flips,linkable,matches,matchMove,around,mineCount,carSquares,hint};
})();
