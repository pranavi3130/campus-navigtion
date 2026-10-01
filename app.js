/* ---------- EDIT THIS DATA TO MATCH YOUR CAMPUS ---------- */
// Road junctions: name -> [x, y] on a 600x400 map
const J={J1:[100,80],J2:[300,80],J3:[500,80],J4:[100,200],J5:[300,200],J6:[500,200],J7:[100,320],J8:[300,320],J9:[500,320],G:[300,375]};
// Roads between junctions
const E=[["J1","J2"],["J2","J3"],["J4","J5"],["J5","J6"],["J7","J8"],["J8","J9"],["J1","J4"],["J4","J7"],["J2","J5"],["J5","J8"],["J3","J6"],["J6","J9"],["J8","G"]];
// Categories: label, plural label, colour
const T={cls:["Classroom","Classrooms","var(--cls)"],lab:["Lab","Labs","var(--lab)"],lib:["Library","Library","var(--lib)"],can:["Canteen","Canteen","var(--can)"],oth:["Other","Other","var(--oth)"]};
// Buildings: r = [x, y, width, height], j = nearest junction
const B=[
{id:"gate",n:"Main Gate",t:"oth",j:"G",gate:1,d:"Entry and exit for the campus.",h:"Open 24 hours",rooms:["Security desk","Visitor pass"]},
{id:"admin",n:"Admin Block",t:"oth",r:[125,100,70,40],j:"J1",d:"Offices for admissions, fees and the principal.",h:"Mon-Sat, 9:30 am - 4:30 pm",rooms:["Principal office","Fee counter","Admissions"]},
{id:"lib",n:"Library",t:"lib",r:[205,100,75,40],j:"J2",d:"Reading hall, reference section and digital catalogue.",h:"Mon-Sat, 8 am - 8 pm",rooms:["Reading hall","Reference","E-library","Periodicals"]},
{id:"ca",n:"Classroom Block A",t:"cls",r:[320,100,75,40],j:"J2",d:"First and second year lecture rooms.",h:"Mon-Sat, 8 am - 5 pm",rooms:["101","102","103","201","202","Seminar hall"]},
{id:"cb",n:"Classroom Block B",t:"cls",r:[405,100,75,40],j:"J3",d:"Third and fourth year lecture rooms.",h:"Mon-Sat, 8 am - 5 pm",rooms:["104","105","204","205","206"]},
{id:"cl",n:"Computer Lab",t:"lab",r:[125,220,70,40],j:"J4",d:"Programming and networking labs.",h:"Mon-Sat, 9 am - 5 pm",rooms:["Lab 1","Lab 2","Server room"]},
{id:"pl",n:"Physics Lab",t:"lab",r:[205,220,75,40],j:"J5",d:"Optics, electronics and mechanics experiments.",h:"Mon-Fri, 9 am - 4 pm",rooms:["Optics lab","Electronics lab"]},
{id:"can",n:"Canteen",t:"can",r:[320,220,75,40],j:"J5",d:"Meals, snacks, tea and coffee.",h:"Daily, 8 am - 7 pm",rooms:["Dining hall","Juice counter"]},
{id:"aud",n:"Auditorium",t:"oth",r:[405,220,75,40],j:"J6",d:"Events, seminars and cultural programmes.",h:"During events",rooms:["Main hall","Green room"]},
{id:"hos",n:"Hostel",t:"oth",r:[125,270,70,38],j:"J7",d:"Student residence and warden office.",h:"Gate closes 9:30 pm",rooms:["Warden office","Common room"]},
{id:"bk",n:"Bookstore",t:"oth",r:[205,270,75,38],j:"J8",d:"Stationery, books and printing.",h:"Mon-Sat, 9 am - 6 pm",rooms:["Print and copy"]},
{id:"park",n:"Parking",t:"oth",r:[320,270,75,38],j:"J8",d:"Two-wheeler and four-wheeler parking.",h:"Open 24 hours",rooms:[]},
{id:"med",n:"Medical Centre",t:"oth",r:[405,270,75,38],j:"J9",d:"First aid and a visiting doctor.",h:"Mon-Sat, 10 am - 4 pm",rooms:["First aid","Doctor room"]}];
/* ---------- END OF DATA ---------- */

const $=s=>document.querySelector(s);
const byId=id=>B.find(b=>b.id===id);
B.forEach(b=>{const p=J[b.j];b.door=b.gate?p:[Math.min(Math.max(p[0],b.r[0]),b.r[0]+b.r[2]),Math.min(Math.max(p[1],b.r[1]),b.r[1]+b.r[3])]});
const dist=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
let filter="all";

function path(a,b){const d={},prev={},todo=new Set(Object.keys(J));todo.forEach(k=>d[k]=Infinity);d[a]=0;
 while(todo.size){let u=null;todo.forEach(k=>{if(u===null||d[k]<d[u])u=k});todo.delete(u);if(u===b)break;
  E.forEach(([x,y])=>{const v=x===u?y:y===u?x:null;if(v&&todo.has(v)){const w=d[u]+dist(J[u],J[v]);if(w<d[v]){d[v]=w;prev[v]=u}}})}
 const r=[b];while(r[0]!==a)r.unshift(prev[r[0]]);return r}

function draw(){
 let s=E.map(([a,b])=>`<path class="road" d="M${J[a]}L${J[b]}"/>`).join("")+'<path id="route" d=""/>';
 B.forEach(b=>{
  if(b.gate){s+=`<g class="b" tabindex="0" role="button" aria-label="${b.n}" data-id="${b.id}"><rect x="268" y="365" width="64" height="20" fill="var(--oth)"/><text x="300" y="378" text-anchor="middle">${b.n}</text></g>`;return}
  const[x,y,w,h]=b.r;
  s+=`<g class="b" tabindex="0" role="button" aria-label="${b.n}" data-id="${b.id}"><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${T[b.t][2]}"/><text x="${x+w/2}" y="${y+h/2+3}" text-anchor="middle">${b.n.replace("Classroom Block","Block").replace(" Centre","")}</text></g>`});
 s+='<circle id="you" r="7" fill="#fff" stroke="var(--route)" stroke-width="4" cx="-20" cy="-20"/><circle id="pin" r="7" fill="var(--route)" stroke="#fff" stroke-width="2" cx="-20" cy="-20"/>';
 $("#map").innerHTML=s;
 $("#map").querySelectorAll(".b").forEach(g=>{const f=()=>pick(g.dataset.id);g.onclick=f;g.onkeydown=e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();f()}}});
 $("#legend").innerHTML=Object.values(T).map(v=>`<span><i class="dot" style="background:${v[2]}"></i>${v[0]}</span>`).join("")+'<span><i class="dot" style="background:var(--route);border-radius:50%"></i>Destination</span>';
}

function opts(){const h=B.map(b=>`<option value="${b.id}">${b.n}</option>`).join("");$("#from").innerHTML=h;$("#to").innerHTML='<option value="">Select destination</option>'+h}

function chips(){
 const c=$("#chips");
 c.innerHTML=[["all","All"],...Object.entries(T).map(([k,v])=>[k,v[1]])].map(([k,l])=>`<button class="chip" aria-pressed="${filter===k}" data-k="${k}">${l}</button>`).join("");
 c.querySelectorAll("button").forEach(x=>x.onclick=()=>{filter=x.dataset.k;chips();list()})}

function list(){
 const q=$("#q").value.trim().toLowerCase(),out=[];
 B.filter(b=>filter==="all"||b.t===filter).forEach(b=>{
  if(!q||b.n.toLowerCase().includes(q)||T[b.t][0].toLowerCase().includes(q))out.push({b,label:b.n,sub:T[b.t][0]});
  else b.rooms.filter(r=>r.toLowerCase().includes(q)).forEach(r=>out.push({b,label:(/^\d/.test(r)?"Room "+r:r),sub:b.n}))});
 $("#list").innerHTML=out.length?out.map(o=>`<li><button data-id="${o.b.id}"><span class="dot" style="background:${T[o.b.t][2]}"></span>${o.label}<span class="t">${o.sub}</span></button></li>`).join(""):'<li class="empty">Nothing matches. Try a shorter word or choose All.</li>';
 $("#list").querySelectorAll("button").forEach(x=>x.onclick=()=>pick(x.dataset.id))}

function pick(id){$("#to").value=id;go();$("#detail").scrollIntoView({block:"nearest",behavior:"smooth"})}

function detail(b){
 const d=$("#detail");
 if(!b){d.hidden=true;return}
 d.hidden=false;
 d.innerHTML=`<span class="badge" style="background:${T[b.t][2]}">${T[b.t][0]}</span><h2>${b.n}</h2><p class="meta">${b.d}</p><p class="meta"><b>Hours:</b> ${b.h}</p>${b.rooms.length?`<div class="rooms">${b.rooms.map(r=>`<span>${/^\d/.test(r)?"Room "+r:r}</span>`).join("")}</div>`:""}`}

const D8=["north","north-east","east","south-east","south","south-west","west","north-west"];
const ang=(a,b)=>Math.atan2(b[0]-a[0],-(b[1]-a[1]));
const dir=a=>D8[(Math.round(a/(Math.PI/4))+8)%8];

function go(){
 const f=byId($("#from").value),t=byId($("#to").value),rt=$("#route");
 document.querySelectorAll(".b").forEach(g=>g.classList.toggle("sel",!!t&&g.dataset.id===t.id));
 detail(t);
 $("#share").hidden=true;
 for(const k of ["#you","#pin"]){$(k).setAttribute("cx",-20);$(k).setAttribute("cy",-20)}
 if(!t){rt.setAttribute("d","");$("#out").innerHTML='<p class="empty">Pick a destination to see directions.</p>';return}
 if(f===t){rt.setAttribute("d","");$("#out").innerHTML=`<p class="empty">You are already at ${t.n}. Choose a different start or destination.</p>`;return}
 const ids=path(f.j,t.j),pts=[f.door,...ids.map(k=>J[k]),t.door].filter((p,i,a)=>i===0||dist(p,a[i-1])>0.5);
 rt.setAttribute("d","M"+pts.map(p=>p.join(",")).join("L"));
 $("#you").setAttribute("cx",f.door[0]);$("#you").setAttribute("cy",f.door[1]);
 $("#pin").setAttribute("cx",t.door[0]);$("#pin").setAttribute("cy",t.door[1]);
 const segs=[];
 for(let i=1;i<pts.length;i++){const a=ang(pts[i-1],pts[i]),l=dist(pts[i-1],pts[i])*1.2,last=segs[segs.length-1];if(last&&Math.abs(last.a-a)<.01)last.l+=l;else segs.push({a,l})}
 let tot=0;
 const steps=segs.map((s,i)=>{tot+=s.l;const m=Math.round(s.l/5)*5||5;
  if(!i)return`Head ${dir(s.a)} for ${m} m`;
  let d=s.a-segs[i-1].a;while(d>Math.PI)d-=2*Math.PI;while(d<-Math.PI)d+=2*Math.PI;
  return`Turn ${d>0?"right":"left"} and walk ${dir(s.a)} for ${m} m`});
 steps.push(`Arrive at ${t.n}`);
 $("#out").innerHTML=`<div class="sum">${Math.round(tot/5)*5} m · about ${Math.max(1,Math.round(tot/80))} min walk</div><ol>${steps.map(x=>`<li>${x}</li>`).join("")}</ol>`;
 $("#share").hidden=false;
 try{history.replaceState(null,"",`#from=${f.id}&to=${t.id}`)}catch(e){}
}

$("#share").onclick=async()=>{
 try{await navigator.clipboard.writeText(location.href);$("#share").textContent="Link copied"}catch(e){$("#share").textContent="Copy the address bar to share"}
 setTimeout(()=>$("#share").textContent="Copy link to this route",2000)};
$("#q").oninput=list;$("#from").onchange=go;$("#to").onchange=go;
$("#swap").onclick=()=>{const a=$("#from").value,b=$("#to").value;if(!b)return;$("#from").value=b;$("#to").value=a;go()};
$("#theme").onclick=()=>{
 const dark=getComputedStyle(document.documentElement).getPropertyValue("--bg").trim()==="#0F1F1B";
 const v=dark?"light":"dark";document.documentElement.dataset.theme=v;
 try{localStorage.setItem("theme",v)}catch(e){}};
try{const v=localStorage.getItem("theme");if(v)document.documentElement.dataset.theme=v}catch(e){}

opts();$("#from").value="gate";draw();chips();list();
const h=new URLSearchParams(location.hash.slice(1));
if(byId(h.get("from")))$("#from").value=h.get("from");
if(byId(h.get("to"))){$("#to").value=h.get("to");go()}
