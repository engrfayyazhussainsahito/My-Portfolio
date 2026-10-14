(()=>{
const rm=matchMedia('(prefers-reduced-motion:reduce)').matches;
document.getElementById('y').textContent=new Date().getFullYear();
if(!rm){document.documentElement.classList.add('js');
 const els=[...document.querySelectorAll('main section:not(.intro)>*')];els.forEach(e=>{e.classList.add('rv');e.style.setProperty('--d',Math.min([...e.parentNode.children].indexOf(e),6)*70+'ms')});
 const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.05});
 els.forEach(e=>io.observe(e));
 setTimeout(()=>els.forEach(e=>e.classList.add('in')),2500)}
const links=[...document.querySelectorAll('.bar nav a')];
addEventListener('scroll',()=>{const d=document.documentElement;document.body.style.setProperty('--sp',scrollY/(d.scrollHeight-innerHeight||1))},{passive:true});
const so=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)links.forEach(a=>a.classList.toggle('act',a.getAttribute('href')==='#'+e.target.id))}),{rootMargin:'-40% 0px -55% 0px'});
document.querySelectorAll('main section[id]').forEach(s=>so.observe(s));

/* Subnet calculator */
const ipE=document.getElementById('ip'),cE=document.getElementById('cidr'),plE=document.getElementById('pl'),sn=document.getElementById('sn');
const toI=s=>{const p=s.trim().split('.').map(Number);return p.length===4&&p.every(n=>Number.isInteger(n)&&n>=0&&n<256)?((p[0]<<24)|(p[1]<<16)|(p[2]<<8)|p[3])>>>0:null};
const toS=n=>[n>>>24,(n>>>16)&255,(n>>>8)&255,n&255].join('.');
function calc(){const p=+cE.value;plE.textContent='/'+p;const a=toI(ipE.value);
 if(a===null){sn.innerHTML='<dt>Error</dt><dd>Enter a valid IPv4 address</dd>';return}
 const m=(0xFFFFFFFF<<(32-p))>>>0,net=(a&m)>>>0,bc=(net|~m)>>>0;
 sn.innerHTML=[['Subnet mask',toS(m)],['Network',toS(net)],['First host',toS(net+1)],['Last host',toS(bc-1)],['Broadcast',toS(bc)],['Usable hosts',(2**(32-p)-2).toLocaleString()]].map(([k,v])=>`<dt>${k}</dt><dd>${v}</dd>`).join('')}
ipE.addEventListener('input',calc);cE.addEventListener('input',calc);calc();

/* Traceroute simulator */
const T={OSPF:['link-state, Dijkstra SPF','cost = reference bandwidth / link bandwidth'],EIGRP:['DUAL, composite metric','bandwidth + delay'],BGP:['path-vector','AS-path length, then policy'],RIP:['distance-vector','hop count, maximum 15']};
document.getElementById('trace').addEventListener('click',()=>{const pr=document.getElementById('proto').value,o=document.getElementById('tr'),hops=['R1 (gateway)','SW1','R2','R4','R5 (edge)'],n=3+Math.floor(Math.random()*3);
 o.textContent='traceroute via '+pr+' ('+T[pr][0]+')\n';let i=0,ms=0;
 (function s(){if(i<n){ms+=2+Math.random()*9;o.textContent+=(i+1)+'  '+(i<n-1?hops[i]:'server').padEnd(14)+ms.toFixed(1)+' ms\n';i++;setTimeout(s,rm?0:380)}else o.textContent+='metric: '+T[pr][1]})()});

/* Name reveal */
if(!rm){const h=document.querySelector('h1'),t=h.textContent;let i=0;h.setAttribute('aria-label',t);
 h.innerHTML=t.split(' ').map(w=>`<span class="wd" aria-hidden="true">${[...w].map(c=>`<span class="ch" style="--i:${i++}">${c}</span>`).join('')}</span>`).join(' ')}
/* Count-up stats */
const co=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;co.unobserve(e.target);if(rm)return;const el=e.target,t=+el.dataset.n,s=el.dataset.s||'';let v=0;el.textContent='0'+s;
 const iv=setInterval(()=>{v++;el.textContent=v+s;if(v>=t)clearInterval(iv)},t>8?80:140)}));
document.querySelectorAll('[data-n]').forEach(e=>co.observe(e));
const tk=document.querySelector('.ticker div');tk.innerHTML+=tk.innerHTML;

/* Hero network background */
const cv=document.getElementById('net'),cx=cv.getContext('2d');let W,H,N=[],P=[],mx=-999,my=-999,col='#1f4fa3',run=true;
const css=()=>{col=getComputedStyle(document.documentElement).getPropertyValue('--acc').trim()};
function build(){const d=devicePixelRatio||1;W=cv.clientWidth;H=cv.clientHeight;cv.width=W*d;cv.height=H*d;cx.setTransform(d,0,0,d,0,0);css();
 N=Array.from({length:W<600?16:34},()=>({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.25,vy:(Math.random()-.5)*.25}))}
function frame(){cx.clearRect(0,0,W,H);const L=W<600?110:150;cx.lineWidth=1;
 for(const a of N){if(!rm){a.x+=a.vx;a.y+=a.vy}if(a.x<0||a.x>W)a.vx*=-1;if(a.y<0||a.y>H)a.vy*=-1}
 for(let i=0;i<N.length;i++){const a=N[i];
  for(let j=i+1;j<N.length;j++){const b=N[j],d=Math.hypot(a.x-b.x,a.y-b.y);
   if(d<L){cx.globalAlpha=(1-d/L)*.25;cx.strokeStyle=col;cx.beginPath();cx.moveTo(a.x,a.y);cx.lineTo(b.x,b.y);cx.stroke();if(!rm&&P.length<5&&Math.random()<.0003)P.push({a,b,t:0})}}
  const dm=Math.hypot(a.x-mx,a.y-my),R=L*1.3;
  if(dm<R){cx.globalAlpha=(1-dm/R)*.45;cx.strokeStyle=col;cx.beginPath();cx.moveTo(a.x,a.y);cx.lineTo(mx,my);cx.stroke()}
  cx.globalAlpha=.55;cx.fillStyle=col;cx.beginPath();cx.arc(a.x,a.y,2,0,7);cx.fill()}
 P=P.filter(p=>{p.t+=.015;if(p.t>=1)return false;cx.globalAlpha=.95;cx.fillStyle='#d98a1f';cx.beginPath();cx.arc(p.a.x+(p.b.x-p.a.x)*p.t,p.a.y+(p.b.y-p.a.y)*p.t,2.6,0,7);cx.fill();return true});
 cx.globalAlpha=1}
function loop(){if(run&&!document.hidden)frame();if(!rm)requestAnimationFrame(loop)}
build();frame();if(!rm)loop();
let rt;addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(()=>{build();frame()},150)});
addEventListener('pointermove',e=>{mx=e.clientX+scrollX;my=e.clientY+scrollY});
new IntersectionObserver(es=>{run=es[0].isIntersecting}).observe(document.querySelector('.intro'));
matchMedia('(prefers-color-scheme:dark)').addEventListener('change',css);

/* Lab bench tabs */
const tb=[...document.querySelectorAll('.tabs button')],tools=[...document.querySelectorAll('.tool')];
function tab(t){tb.forEach(b=>b.classList.toggle('on',b.dataset.t===t));tools.forEach(x=>{x.hidden=x.dataset.t!==t;if(!x.hidden)x.classList.add('in')})}
tb.forEach(b=>b.addEventListener('click',()=>tab(b.dataset.t)));tab('net');
const $=id=>document.getElementById(id),kv=(el,rows)=>{el.innerHTML=rows.map(([k,v])=>`<dt>${k}</dt><dd>${v}</dd>`).join('')};

/* IPv6 expander */
function v6(){const s=$('v6').value.trim().toLowerCase(),o=$('v6o');let f=null;
 if(/^[0-9a-f:]+$/.test(s)&&!/:::/.test(s)&&(s.match(/::/g)||[]).length<=1){const[h,t]=s.split('::'),a=h?h.split(':'):[],b=t?t.split(':'):[],d=s.includes('::');
  if((d&&a.length+b.length<=7)||(!d&&a.length===8)){const all=[...a,...Array(d?8-a.length-b.length:0).fill('0'),...b];if(all.every(x=>x.length>=1&&x.length<=4))f=all.map(x=>x.padStart(4,'0'))}}
 if(!f){kv(o,[['Error','Enter a valid IPv6 address']]);return}
 const g=f.map(x=>x.replace(/^0+(?=.)/,''));let bs=-1,bl=0;for(let i=0;i<8;){if(g[i]==='0'){let j=i;while(j<8&&g[j]==='0')j++;if(j-i>bl){bl=j-i;bs=i}i=j}else i++}
 const sh=bl>=2?g.slice(0,bs).join(':')+'::'+g.slice(bs+bl).join(':'):g.join(':'),n=parseInt(f[0],16),all0=f.slice(0,7).every(x=>x==='0000');
 const ty=all0&&f[7]==='0000'?'Unspecified (::)':all0&&f[7]==='0001'?'Loopback (::1)':f[0]==='2001'&&f[1]==='0db8'?'Documentation (2001:db8::/32)':(n&0xffc0)===0xfe80?'Link-local (fe80::/10)':(n&0xfe00)===0xfc00?'Unique local (fc00::/7)':(n>>8)===0xff?'Multicast (ff00::/8)':(n&0xe000)===0x2000?'Global unicast (2000::/3)':'Other';
 kv(o,[['Full',f.join(':')],['Shortest',sh],['Type',ty]])}
$('v6').addEventListener('input',v6);v6();

/* Port lookup */
const PT=[['FTP data',20,'TCP','file transfer'],['FTP control',21,'TCP','file transfer'],['SSH',22,'TCP','secure remote login'],['Telnet',23,'TCP','unencrypted remote login'],['SMTP',25,'TCP','email transfer'],['DNS',53,'UDP/TCP','name resolution'],['DHCP server',67,'UDP','address assignment'],['DHCP client',68,'UDP','address assignment'],['TFTP',69,'UDP','simple file transfer'],['HTTP',80,'TCP','web'],['EIGRP','n/a','IP protocol 88','routing'],['OSPF','n/a','IP protocol 89','routing'],['POP3',110,'TCP','email retrieval'],['NTP',123,'UDP','time sync'],['IMAP',143,'TCP','email retrieval'],['SNMP',161,'UDP','network management'],['BGP',179,'TCP','inter-domain routing'],['LDAP',389,'TCP/UDP','directory service'],['HTTPS',443,'TCP','secure web'],['Syslog',514,'UDP','logging'],['RIP',520,'UDP','routing'],['RIPng',521,'UDP','IPv6 routing'],['RDP',3389,'TCP','remote desktop']];
function pq(){const q=$('pq').value.trim().toLowerCase(),r=PT.filter(p=>!q||p.join(' ').toLowerCase().includes(q));
 $('po').textContent=r.length?r.map(p=>String(p[1]).padEnd(5)+p[0].padEnd(13)+p[2].padEnd(15)+p[3]).join('\n'):'No match.'}
$('pq').addEventListener('input',pq);pq();

/* Hash generator */
async function hs(){const o=$('hout');if(!crypto.subtle){o.textContent='Hashing needs a secure (https) page.';return}
 const b=await crypto.subtle.digest($('halg').value,new TextEncoder().encode($('hin').value));
 o.textContent=[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}
$('hin').addEventListener('input',hs);$('halg').addEventListener('change',hs);hs();

/* Password entropy */
function pw(){const p=$('pw').value,o=$('pwo');if(!p){kv(o,[['Entropy','Type something above']]);return}
 const pool=(/[a-z]/.test(p)?26:0)+(/[A-Z]/.test(p)?26:0)+(/[0-9]/.test(p)?10:0)+(/[^a-zA-Z0-9]/.test(p)?33:0),bits=p.length*Math.log2(pool),sec=2**bits/1e10;
 const fm=s=>s<1?'under a second':s<60?Math.round(s)+' seconds':s<3600?Math.round(s/60)+' minutes':s<86400?Math.round(s/3600)+' hours':s<3.15e7?Math.round(s/86400)+' days':s<3.15e9?Math.round(s/3.15e7)+' years':'more than 100 years';
 kv(o,[['Length',p.length+' characters'],['Character pool',pool],['Entropy',bits.toFixed(1)+' bits'],['Rough rating',bits<28?'Very weak':bits<36?'Weak':bits<60?'Reasonable':bits<128?'Strong':'Very strong'],['Full search at 10 billion guesses/s',fm(sec)]])}
$('pw').addEventListener('input',pw);pw();

/* CPU scheduler */
function sch(){const b=$('bt').value.trim().split(/\s+/).map(Number),o=$('so');
 if(!b.length||b.some(x=>!Number.isInteger(x)||x<1)||b.length>10){o.textContent='Enter 1 to 10 whole-number burst times, for example: 5 3 8 6';return}
 const a=$('alg').value,Q=Math.max(1,+$('qt').value||1),comp=[],seg=[];let t=0;
 if(a==='rr'){const rem=[...b],q=b.map((_,i)=>i);while(q.length){const i=q.shift(),r=Math.min(Q,rem[i]);seg.push([i,t,t+r]);t+=r;rem[i]-=r;rem[i]>0?q.push(i):comp[i]=t}}
 else{const ord=b.map((_,i)=>i);if(a==='sjf')ord.sort((x,y)=>b[x]-b[y]||x-y);ord.forEach(i=>{seg.push([i,t,t+b[i]]);t+=b[i];comp[i]=t})}
 const tat=comp,wt=b.map((x,i)=>comp[i]-x),av=x=>(x.reduce((p,c)=>p+c,0)/x.length).toFixed(2);
 o.textContent='Gantt: '+seg.map(s=>`P${s[0]+1}[${s[1]}-${s[2]}]`).join(' ')+'\n\n'+'Proc  Burst  Waiting  Turnaround\n'+b.map((x,i)=>`P${i+1}`.padEnd(6)+String(x).padEnd(7)+String(wt[i]).padEnd(9)+tat[i]).join('\n')+`\n\nAverage waiting: ${av(wt)}\nAverage turnaround: ${av(tat)}`}
['bt','alg','qt'].forEach(i=>$(i).addEventListener('input',sch));sch();

/* Base converter */
function nb(){const base=+$('nbs').value,s=$('nb').value.trim().toLowerCase().replace(/^0[xb]/,''),o=$('nbo'),ok={2:/^[01]+$/,8:/^[0-7]+$/,10:/^[0-9]+$/,16:/^[0-9a-f]+$/}[base];
 if(!s||!ok.test(s)||s.length>40){kv(o,[['Error','Enter a valid number for the chosen base']]);return}
 const v=BigInt({2:'0b',8:'0o',10:'',16:'0x'}[base]+s),bin=v.toString(2);
 kv(o,[['Decimal',v.toString(10)],['Binary',bin.replace(/\B(?=(\d{4})+$)/g,' ')],['Hexadecimal',v.toString(16).toUpperCase()],['Octal',v.toString(8)],['Bits needed',bin.length]])}
$('nb').addEventListener('input',nb);$('nbs').addEventListener('change',nb);nb();

/* Logic gates */
function lg(){const A=+$('ga').checked,B=+$('gb').checked,g=$('gt').value,f={AND:(a,b)=>a&b,OR:(a,b)=>a|b,NAND:(a,b)=>+!(a&b),NOR:(a,b)=>+!(a|b),XOR:(a,b)=>a^b,XNOR:(a,b)=>+!(a^b)}[g];
 $('go').textContent=`${g}(A=${A}, B=${B}) = ${f(A,B)}\n\n  A B | Y\n`+[[0,0],[0,1],[1,0],[1,1]].map(([a,b])=>`  ${a} ${b} | ${f(a,b)}${a===A&&b===B?'   <':''}`).join('\n')}
['gt','ga','gb'].forEach(i=>$(i).addEventListener('input',lg));lg();

/* RISC-V RV32I decoder */
const RN='zero ra sp gp tp t0 t1 t2 s0 s1 a0 a1 a2 a3 a4 a5 a6 a7 s2 s3 s4 s5 s6 s7 s8 s9 s10 s11 t3 t4 t5 t6'.split(' '),sx=(v,n)=>(v<<(32-n))>>(32-n);
function rvd(){const x=$('rv').value.trim().replace(/^0x/i,''),o=$('rvo');if(!/^[0-9a-fA-F]{1,8}$/.test(x)){kv(o,[['Error','Enter up to 8 hex digits']]);return}
 const w=parseInt(x,16)>>>0,op=w&127,rd=RN[(w>>>7)&31],f3=(w>>>12)&7,r1=RN[(w>>>15)&31],r2n=(w>>>20)&31,r2=RN[r2n],f7=w>>>25,iI=sx(w>>>20,12);let fm='',as=null;
 const bn=w.toString(2).padStart(32,'0'),bits=[bn.slice(0,7),bn.slice(7,12),bn.slice(12,17),bn.slice(17,20),bn.slice(20,25),bn.slice(25)].join(' ');
 if((w&3)!==3)fm='16-bit compressed (not supported here)';
 else if(op===0x33){fm='R-type';const m={'0,0':'add','0,32':'sub','1,0':'sll','2,0':'slt','3,0':'sltu','4,0':'xor','5,0':'srl','5,32':'sra','6,0':'or','7,0':'and'}[f3+','+f7];if(m)as=`${m} ${rd}, ${r1}, ${r2}`}
 else if(op===0x13){fm='I-type';const m={0:'addi',2:'slti',3:'sltiu',4:'xori',6:'ori',7:'andi'}[f3];
  if(m)as=`${m} ${rd}, ${r1}, ${iI}`;else if(f3===1&&f7===0)as=`slli ${rd}, ${r1}, ${r2n}`;else if(f3===5&&f7===0)as=`srli ${rd}, ${r1}, ${r2n}`;else if(f3===5&&f7===32)as=`srai ${rd}, ${r1}, ${r2n}`}
 else if(op===3){fm='I-type (load)';const m={0:'lb',1:'lh',2:'lw',4:'lbu',5:'lhu'}[f3];if(m)as=`${m} ${rd}, ${iI}(${r1})`}
 else if(op===0x23){fm='S-type (store)';const m={0:'sb',1:'sh',2:'sw'}[f3];if(m)as=`${m} ${r2}, ${sx((f7<<5)|((w>>>7)&31),12)}(${r1})`}
 else if(op===0x63){fm='B-type (branch)';const m={0:'beq',1:'bne',4:'blt',5:'bge',6:'bltu',7:'bgeu'}[f3];if(m)as=`${m} ${r1}, ${r2}, ${sx(((w>>>31)<<12)|(((w>>>7)&1)<<11)|((f7&63)<<5)|(((w>>>8)&15)<<1),13)}`}
 else if(op===0x37||op===0x17){fm='U-type';as=`${op===0x37?'lui':'auipc'} ${rd}, 0x${(w>>>12).toString(16)}`}
 else if(op===0x6f){fm='J-type';as=`jal ${rd}, ${sx(((w>>>31)<<20)|(((w>>>12)&255)<<12)|(((w>>>20)&1)<<11)|(((w>>>21)&1023)<<1),21)}`}
 else if(op===0x67&&f3===0){fm='I-type (jump)';as=`jalr ${rd}, ${iI}(${r1})`}
 kv(o,[['Hex','0x'+w.toString(16).padStart(8,'0')],['Binary',bits],['Format',fm||'Unknown opcode'],['Assembly',as||'Not an RV32I base instruction']])}
$('rv').addEventListener('input',rvd);rvd();
})();