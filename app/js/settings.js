/* Settings: General, Wallet and billing (Claude Pay), Identity and access (Claude Auth), Vault (Claude Vault), Policies and limits, Audit log.
   All state lives in module scope so it survives leaving and coming back. Everything here is invented. */
(function(){
const CW=window.CW,D=CW.data,I=CW.icon,E=CW.esc,$=(s,r)=>(r||document).querySelector(s),$$=(s,r)=>Array.from((r||document).querySelectorAll(s));
CW.css('settings',`
.set-side{gap:4px}
.set-side .side-label{margin-top:8px}
.set-body{padding:16px;display:flex;flex-direction:column;gap:12px}
.set-big{font-family:var(--serif);font-size:40px;line-height:1.1;letter-spacing:-.015em}
.set-bar{height:6px;border-radius:3px;background:var(--bg-sunk);overflow:hidden;min-width:72px}
.set-bar i{display:block;height:100%;background:var(--accent);border-radius:3px}
.set-bar.warn i{background:var(--warn)} .set-bar.bad i{background:var(--bad)}
.set-wtop{display:grid;grid-template-columns:minmax(0,3fr) minmax(0,2fr);gap:16px}
.set-item{display:flex;align-items:center;gap:12px;padding:12px 16px;border-bottom:1px solid var(--line);min-width:0}
.set-item:last-child{border-bottom:0}
.set-ico{width:32px;height:32px;border-radius:var(--r-md);background:var(--bg-sunk);display:grid;place-items:center;color:var(--ink-2);flex:none}
.set-link{border:0;background:none;padding:0;font-weight:500;text-align:left;color:var(--ink)}
.set-link:hover{text-decoration:underline}
.set-click{cursor:pointer}
.set-sub td:first-child{padding-left:32px}
.set-tbl th,.set-tbl td{padding:9px 10px}
.set-tbl th:first-child,.set-tbl td:first-child{padding-left:16px}
.set-tbl th:last-child,.set-tbl td:last-child{padding-right:16px}
.set-vc{display:grid;grid-template-columns:176px minmax(0,1fr);gap:16px;padding:16px;border-bottom:1px solid var(--line)}
.set-vcs{display:grid;grid-template-columns:repeat(2,minmax(0,1fr))}
.set-vcs .set-vc:nth-child(odd){border-right:1px solid var(--line)}
.set-plastic{background:var(--code-bg);color:var(--code-ink);border:1px solid var(--code-line);border-radius:var(--r-lg);padding:12px;display:flex;flex-direction:column;justify-content:space-between;min-height:108px}
.set-plastic .n{font-family:var(--mono);font-size:12.5px;letter-spacing:.04em}
.set-plastic .s{font-size:11px;color:var(--code-dim)}
.set-plastic.frozen{opacity:.55}
.set-kv{display:grid;grid-template-columns:132px minmax(0,1fr);gap:8px 12px;font-size:13px;margin:0}
.set-kv dt{color:var(--ink-3)} .set-kv dd{margin:0;min-width:0}
.set-seg{display:inline-flex;gap:2px;background:var(--bg-sunk);border:1px solid var(--line);border-radius:var(--r-md);padding:2px}
.set-seg button{border:0;background:none;border-radius:7px;padding:4px 12px;font-weight:500;color:var(--ink-3);display:inline-flex;gap:6px;align-items:center}
.set-seg button:hover{color:var(--ink)}
.set-seg button[aria-pressed="true"]{background:var(--bg-raised);color:var(--ink);box-shadow:var(--shadow-1)}
.set-tools{display:flex;gap:8px;align-items:center;flex-wrap:wrap;padding:12px 16px;border-bottom:1px solid var(--line)}
.set-tools .search{flex:1;min-width:200px}
.set-tools .select{width:auto}
.set-chip{border:1px solid var(--line-strong);background:var(--bg-raised);border-radius:var(--r-md);padding:3px 10px;font-size:12.5px;font-weight:500;color:var(--ink-2)}
.set-chip:hover{background:var(--bg-hover)}
.set-presets{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}
.set-presets .btn[aria-pressed="true"],.set-chip[aria-pressed="true"]{background:var(--ink);border-color:var(--ink);color:var(--bg)}
.set-opt{display:flex;align-items:center;gap:12px;width:100%;text-align:left;border:1px solid var(--line-strong);background:var(--bg-raised);border-radius:var(--r-md);padding:10px 12px}
.set-opt:hover{background:var(--bg-hover)}
.set-opt[aria-pressed="true"]{border-color:var(--ink);background:var(--bg-sunk)}
.set-stat{text-align:left;display:flex;flex-direction:column;gap:2px}
button.set-stat:hover{background:var(--bg-hover)}
.set-stat[aria-pressed="true"]{border-color:var(--ink)}
.set-stat .v{font-family:var(--serif);font-size:26px;line-height:1.2}
.set-rule{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px 16px;align-items:start;padding:14px 16px;border-bottom:1px solid var(--line)}
.set-rule:last-child{border-bottom:0}
.set-prev{font-family:var(--serif);font-size:15.5px;line-height:1.45}
.set-rule.off .set-prev{color:var(--ink-3)}
.set-meta{display:flex;gap:4px 16px;flex-wrap:wrap;font-size:12.5px;color:var(--ink-3)}
.set-meta b{color:var(--ink-2);font-weight:500}
.set-tl time{font-family:var(--mono);font-size:12px;color:var(--ink-3);width:44px;flex:none}
.set-tl .set-layer{min-width:64px;justify-content:center}
.set-tl .set-who{width:124px;flex:none;font-size:13px;color:var(--ink-2)}
.set-detail{padding:10px 16px 14px 70px;border-bottom:1px solid var(--line);background:var(--bg);font-size:13px;color:var(--ink-2)}
.set-day{padding:6px 16px;background:var(--bg-sunk);border-bottom:1px solid var(--line)}
.set-secret{font-family:var(--mono);font-size:12px;color:var(--ink-3);word-break:break-all}
.set-secret.show{color:var(--warn)}
.set-success{display:flex;flex-direction:column;align-items:center;gap:8px;text-align:center;padding:12px 0}
.set-success i{width:44px;height:44px;border-radius:50%;background:var(--ok-soft);color:var(--ok);display:grid;place-items:center}
.set-note{font-size:12.5px;color:var(--ink-3);display:flex;gap:8px;align-items:flex-start}
.set-note svg{margin-top:2px}
.set-acts{display:flex;gap:2px;justify-content:flex-end}
.set-checks{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px 12px}
.set-checks label{display:flex;gap:8px;align-items:center;font-size:13px}
.set-lists{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}
.set-lists ul{margin:6px 0 0;padding:0;list-style:none;display:flex;flex-direction:column;gap:6px;font-size:13px}
.set-lists li{display:flex;gap:8px;align-items:flex-start}
.set-lists .y svg{color:var(--ok)} .set-lists .n svg{color:var(--bad)}
.set-lists li svg{margin-top:3px}
.set-amt{max-width:132px}
@media (max-width:900px){.set-wtop,.set-vcs,.set-lists{grid-template-columns:minmax(0,1fr)}.set-vcs .set-vc:nth-child(odd){border-right:0}}
`);

/* ---------- helpers ---------- */
const MON=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],FULL=['January','February','March','April','May','June','July','August','September','October','November','December'];
const pad=n=>String(n).padStart(2,'0');
const dayStr=(off,yr)=>{const d=new Date();d.setDate(d.getDate()-off);return MON[d.getMonth()]+' '+d.getDate()+(yr?', '+d.getFullYear():'')};
const nowTime=()=>{const d=new Date();return pad(d.getHours())+':'+pad(d.getMinutes())};
const num=v=>{const n=parseFloat(String(v).replace(/[^0-9.]/g,''));return isFinite(n)?n:0};
const botName=id=>{const b=CW.bot(id);return b?b.name:''};
const soon=()=>CW.toast('Not part of this concept yet.');
const rand4=()=>String(1000+Math.floor(Math.random()*9000));
const pill=(t,c)=>`<span class="pill ${c||''}">${E(t)}</span>`;
const bar=(v,max)=>{const p=max>0?Math.min(100,Math.round(v/max*100)):0;return `<div class="set-bar${p>=90?' bad':p>=75?' warn':''}" role="img" aria-label="${p}% used"><i style="width:${p}%"></i></div>`};
const sec=(title,sub,actions,body)=>`<section class="card flush"><div class="card-head"><div class="col" style="gap:0"><h2 class="t-h">${title}</h2>${sub?`<span class="t-xs t-mute">${sub}</span>`:''}</div><div class="row">${actions||''}</div></div>${body}</section>`;
const head=(title,product,sub,actions)=>`<div class="page-head"><div class="col" style="gap:4px"><div class="row"><h1 class="t-title">${title}</h1>${product?pill(product,'accent'):''}</div><p class="t-mute">${sub}</p></div><div class="row">${actions||''}</div></div>`;
const field=(label,id,html,hint)=>`<div class="field"><label for="${id}">${label}</label>${html}${hint?`<span class="t-xs t-mute">${hint}</span>`:''}</div>`;
const opts=(list,sel)=>list.map(o=>{const v=Array.isArray(o)?o[0]:o,l=Array.isArray(o)?o[1]:o;return `<option value="${E(v)}"${v===sel?' selected':''}>${E(l)}</option>`}).join('');
const empty=(icon,a,b)=>`<div class="empty">${I(icon,22)}<div>${a}</div>${b?`<div class="t-xs">${b}</div>`:''}</div>`;
const fakeNote=`<div class="set-note">${I('info',14)}<span>This is a concept. Do not enter real card, bank or password details. Nothing you type is sent anywhere.</span></div>`;
function confirmM(title,html,ok,fn,danger){const m=CW.modal({title,body:`<p class="t-2">${html}</p>`,foot:`<button class="btn" data-close>Cancel</button><button class="btn ${danger?'btn-danger':'btn-primary'}" id="set-ok">${E(ok)}</button>`});
  $('#set-ok',m).addEventListener('click',()=>{CW.closeModal();fn()})}

/* ---------- state ---------- */
let cur='general',seq=0,txN=200;
const sessionLog=[];
function log(layer,what,detail,bot,by,needed){sessionLog.unshift({id:'s'+(++seq),day:0,time:nowTime(),bot:bot||'',layer,what,by:by||'By '+D.me.name,needed:!!needed,detail:detail||''})}

const G={name:D.me.name,role:D.me.role,email:D.me.email,lang:'English (United Kingdom)',zone:'Europe, London time',notif:{push:true,daily:true,blocked:true,spend:false}};

const tx=(off,time,to,what,bot,auth,amt,status,m,kind)=>({id:'tx-'+(++txN),off,time,to,what,bot,auth,amt,status,m:!!m,kind:kind||'out'});
const W={balance:14550,auto:{on:true,below:2000,to:10000},
  methods:[{id:'pm-1',kind:'card',name:'Company card',last4:'4417',note:'Expires 08/28',def:true},{id:'pm-2',kind:'bank',name:'Operating account',last4:'0192',note:'Bank account, verified',def:false}],
  teams:[{name:'Finance',budget:12000},{name:'People and IT',budget:4000},{name:'Revenue operations',budget:2500},{name:'Product and engineering',budget:1500}],
  botB:{'procurement-bot':{budget:10000,renew:5000},'it-bot':{budget:3000,renew:250}},
  cards:[{id:'vc-1',bot:'procurement-bot',last4:'7731',exp:'09/27',limit:5000,monthly:10000,lock:'Approved vendors only',frozen:false},{id:'vc-2',bot:'it-bot',last4:'2086',exp:'11/27',limit:1000,monthly:3000,lock:'Approved vendors only',frozen:false}],
  tx:[
    tx(0,'09:12','Corvin Analytics','Analytics subscription, yearly renewal','procurement-bot','Inside limit',4050,'Paid',1),
    tx(0,'08:40','Marlow Telecom','Mobile plan for a new hire','it-bot','Inside limit',55,'Pending',1),
    tx(1,'17:42','Northgate Supply','Desk and monitor arm for a new hire','it-bot','Inside limit',389,'Paid',1),
    tx(1,'14:05','Ostrava Events','Conference booth deposit','procurement-bot','Blocked: vendor not approved',2200,'Declined',1),
    tx(1,'10:15','Linden Learning','Safety course pack, yearly renewal','it-bot','Approved by Lena Fischer',350,'Paid',1),
    tx(3,'11:20','Tessera Cloud','Storage usage top-up','procurement-bot','Inside limit',240,'Paid',1),
    tx(4,'09:02','Wallet top-up','From company card ending 4417','','Added by Asha Raman',10000,'Completed',1,'in'),
    tx(5,'15:36','Northgate Supply','Printer toner, 4 units','procurement-bot','Inside limit',148.6,'Paid',1),
    tx(6,'13:10','Pellow Software','Two design tool seats','it-bot','Inside limit',96,'Paid',1),
    tx(8,'07:01','Quillmark','E-signature plan, monthly','procurement-bot','Inside limit',79,'Paid',1),
    tx(10,'16:48','Northgate Supply','Refund for a returned keyboard','it-bot','Automatic refund',64,'Refunded',1,'in'),
    tx(11,'10:27','Brightline Courier','Contract courier to a customer','procurement-bot','Inside limit',42.4,'Paid',1),
    tx(21,'14:19','Corvin Analytics','Three extra dashboard seats','procurement-bot','Approved by Marcus Bell',405,'Paid',0),
    tx(23,'09:55','Kestrel Travel','Train tickets for onboarding week','it-bot','Approved by Lena Fischer',286,'Paid',0),
    tx(26,'07:00','Tessera Cloud','Storage plan, monthly','procurement-bot','Inside limit',180,'Paid',0),
    tx(28,'07:01','Quillmark','E-signature plan, monthly','procurement-bot','Inside limit',79,'Paid',0),
    tx(30,'12:44','Northgate Supply','Laptop dock, 2 units','it-bot','Inside limit',318,'Paid',0)
  ],
  subs:[
    {id:'sb-1',vendor:'Corvin Analytics',plan:'Business, yearly',seats:40,used:31,renew:dayStr(-365,1),yearly:4050,bot:'procurement-bot',cancel:false},
    {id:'sb-2',vendor:'Marlow Telecom',plan:'Mobile plans, monthly',seats:22,used:22,renew:dayStr(-14),yearly:14520,bot:'it-bot',cancel:false},
    {id:'sb-3',vendor:'Pellow Software',plan:'Design tool, monthly',seats:8,used:5,renew:dayStr(-24),yearly:4608,bot:'it-bot',cancel:false},
    {id:'sb-4',vendor:'Tessera Cloud',plan:'Storage 2 TB, monthly',seats:0,used:0,renew:dayStr(-4),yearly:2160,bot:'procurement-bot',cancel:false},
    {id:'sb-5',vendor:'Quillmark',plan:'Team e-signature, monthly',seats:12,used:12,renew:dayStr(-22),yearly:948,bot:'procurement-bot',cancel:false},
    {id:'sb-6',vendor:'Linden Learning',plan:'Safety course pack, yearly',seats:10,used:4,renew:dayStr(-364,1),yearly:350,bot:'it-bot',cancel:false}
  ],
  statements:[[6212.4,31],[4980,24],[7345.15,38],[5120.75,27],[3890,19],[6604.3,33]].map((s,i)=>{const d=new Date();d.setDate(1);d.setMonth(d.getMonth()-i-1);return {name:FULL[d.getMonth()]+' '+d.getFullYear(),total:s[0],n:s[1]}})
};
let txQ='',txStatus='all',txBot='all',laptopDone=false;
const counts=t=>t.m&&t.kind==='out'&&t.status!=='Declined';
const spentBy=id=>W.tx.filter(t=>counts(t)&&t.bot===id).reduce((s,t)=>s+t.amt,0);
const spentTotal=()=>W.tx.filter(counts).reduce((s,t)=>s+t.amt,0);
const monthBudget=()=>W.teams.reduce((s,t)=>s+t.budget,0);
function syncLaptop(){const a=D.approvals.find(x=>x.id==='ap-laptop');if(!a||a.status!=='approved'||laptopDone)return;laptopDone=true;W.balance-=1400;
  W.tx.unshift(tx(0,nowTime(),'Northgate Supply','Laptop for a new hire','it-bot','Approved by '+D.me.name,1400,'Paid',1));
  log('Pay','Paid Northgate Supply $1,400.00 for a laptop','Above the $1,000.00 per purchase limit, so it needed approval. Paid from the wallet with the virtual card ending 2086. Delivery on Friday.','it-bot','Approved by '+D.me.name,true)}

const APPS=[
  {id:'app-1',name:'Meridian CRM',kind:'CRM',who:'revops-bot',scopes:['deals:write','contracts:write'],last:'Today, 10:48',can:['Read and edit deals','Attach contracts to a deal','Read accounts and contacts'],cannot:['Delete deals or accounts','Change user permissions','Export the whole database']},
  {id:'app-2',name:'Meridian CRM',kind:'CRM',who:'analyst-bot',scopes:['pipeline:read'],last:'Today, 09:40',can:['Read pipeline and deal history','Run saved reports'],cannot:['Edit or delete any record','See payroll or billing fields']},
  {id:'app-3',name:'Meridian CRM workflows',kind:'CRM',who:'automation-bot',scopes:['workflows:write'],last:'Today, 10:12',can:['Create and edit workflows in the sandbox','Request to turn a workflow on'],cannot:['Turn on a live workflow without approval','Edit deals directly']},
  {id:'app-4',name:'Foldcase',kind:'Contract tool',who:'revops-bot',scopes:['contracts:write'],last:'Today, 10:48',can:['Generate a contract from a deal','Replace a draft contract'],cannot:['Send a contract for signature','Change contract templates']},
  {id:'app-5',name:'Corvin Analytics',kind:'Vendor portal',who:'procurement-bot',scopes:['billing:write'],last:'Today, 09:12',can:['See plans and invoices','Renew the current plan inside the limit'],cannot:['Upgrade the plan without approval','Add or remove admins']},
  {id:'app-6',name:'Northgate Supply',kind:'Vendor portal',who:'it-bot',scopes:['orders:create','pay:spend'],last:'Yesterday, 17:42',can:['Place orders inside the purchase limit','Track deliveries and returns'],cannot:['Order above $1,000.00 without approval','Change the delivery address book']},
  {id:'app-7',name:'Deskline Directory',kind:'Identity',who:'it-bot',scopes:['users:create','roles:assign'],last:'Today, 10:26',can:['Create accounts for new hires','Assign standard roles'],cannot:['Grant an admin role without approval','Delete accounts']},
  {id:'app-8',name:'Tallyboard',kind:'Issue tracker',who:'planner-bot',scopes:['issues:write'],last:'Today, 08:30',can:['Create and update issues','Link issues to specs'],cannot:['Close a release milestone','Delete projects']},
  {id:'app-9',name:'Harbor Git',kind:'Code repository',who:'builder-bot',scopes:['code:write','deploy:request'],last:'Yesterday, 16:15',can:['Push to feature branches','Open pull requests','Deploy to staging'],cannot:['Push to the main branch','Release to production without approval']},
  {id:'app-10',name:'Slidewell',kind:'Slides',who:'analyst-bot',scopes:['slides:write'],last:'Today, 09:52',can:['Create and edit decks in the RevOps folder'],cannot:['Share decks outside Larkfield','Delete decks made by people']},
  {id:'app-11',name:'Meridian CRM',kind:'CRM',who:'me',scopes:['profile','deals:read'],last:'Today, 08:14',can:['Sign you in with your Larkfield identity','Show your deals in Claude'],cannot:['Act as you without asking','Read your mail']},
  {id:'app-12',name:'Daybook',kind:'Calendar',who:'me',scopes:['profile','calendar:read'],last:'3 days ago',can:['Sign you in with your Larkfield identity','Read your calendar to find free time'],cannot:['Create or move meetings','See private event details']}
];
const ROLE={'revops-bot':'Deals and contracts','analyst-bot':'Read-only analyst','automation-bot':'Workflow editor','procurement-bot':'Buyer','it-bot':'Directory admin','planner-bot':'Planner','builder-bot':'Developer','qa-bot':'Tester'};
const suspended={};
const CONSENT={status:'pending',app:'Kestrel Travel',kind:'Travel booking',bot:'procurement-bot',scopes:['trips:read','bookings:create'],asks:['See trips booked for Larkfield','Book rail travel inside the purchase limit','Download receipts'],not:['Book flights or hotels','Change the saved payment method','See traveller passport details']};
const PEOPLE=[{name:D.me.name,team:'Revenue operations',initials:D.me.initials,role:'Owner',last:'Now'}].concat(D.people.map((p,i)=>({name:p.name,team:p.team,initials:p.initials,role:['Member','Approver','Bot owner','Approver','Bot owner','Bot owner'][i],last:['12 min ago','1 hour ago','Today, 10:12','Today, 09:14','Today, 10:31','Yesterday'][i]})));
const ROLES=['Admin','Approver','Bot owner','Member'];
const SESSIONS=[{id:'ss-1',device:'Laptop',app:'Claude desktop app',where:'Larkfield office network',last:'Active now',cur:true},{id:'ss-2',device:'Phone',app:'Claude mobile app',where:'Mobile network',last:'2 hours ago'},{id:'ss-3',device:'Tablet',app:'Web browser',where:'Home network',last:'Yesterday, 21:04'},{id:'ss-4',device:'Meeting room 3 screen',app:'Web browser',where:'Larkfield office network',last:'6 days ago'}];
const PASSKEYS=[{name:'Laptop fingerprint',added:'Added Mar 4',last:'Used today'},{name:'Security key, blue',added:'Added Jan 12',last:'Used 3 weeks ago'}];

/* Vault. rot: days until rotation is due (null when it does not rotate). idle: days since last use. */
const V=[
  {id:'v-1',name:'crm-service-key',type:'API key',bots:['revops-bot','analyst-bot','automation-bot'],last:'Today, 10:48',idle:0,rot:12},
  {id:'v-2',name:'contract-tool-key',type:'API key',bots:['revops-bot'],last:'Today, 10:48',idle:0,rot:64},
  {id:'v-3',name:'Corvin Analytics admin login',type:'Login',bots:['procurement-bot'],last:'Today, 09:10',idle:0,rot:null,strength:'Strong'},
  {id:'v-4',name:'Northgate Supply account login',type:'Login',bots:['procurement-bot','it-bot'],last:'Yesterday, 17:40',idle:1,rot:null,strength:'Weak'},
  {id:'v-5',name:'Procurement virtual card ending 7731',type:'Card',bots:['procurement-bot'],last:'Today, 09:12',idle:0,rot:null,exp:'Expires 09/27'},
  {id:'v-6',name:'IT virtual card ending 2086',type:'Card',bots:['it-bot'],last:'Yesterday, 17:40',idle:1,rot:null,exp:'Expires 11/27'},
  {id:'v-7',name:'staging-deploy-key',type:'API key',bots:['builder-bot','qa-bot'],last:'Yesterday, 16:14',idle:1,rot:-3},
  {id:'v-8',name:'Code signing certificate',type:'Certificate',bots:['builder-bot'],last:'6 days ago',idle:6,rot:41},
  {id:'v-9',name:'directory-admin-key',type:'API key',bots:['it-bot'],last:'Today, 10:24',idle:0,rot:77},
  {id:'v-10',name:'issue-tracker-token',type:'API key',bots:['planner-bot'],last:'Today, 08:29',idle:0,rot:88},
  {id:'v-11',name:'Old billing export login',type:'Login',bots:[],last:'132 days ago',idle:132,rot:null,strength:'Fair'}
];
const VUSE=[['Today, 10:48','revops-bot','crm-service-key','Meridian CRM','Signed in'],['Today, 10:48','revops-bot','contract-tool-key','Foldcase','Signed in'],['Today, 10:24','it-bot','directory-admin-key','Deskline Directory','Signed in'],['Today, 09:12','procurement-bot','Procurement virtual card ending 7731','Corvin Analytics','Payment made'],['Today, 09:10','procurement-bot','Corvin Analytics admin login','Corvin Analytics','Signed in'],['Today, 08:29','planner-bot','issue-tracker-token','Tallyboard','Signed in'],['Yesterday, 17:40','it-bot','IT virtual card ending 2086','Northgate Supply','Payment made'],['Yesterday, 16:14','builder-bot','staging-deploy-key','Harbor Git','Signed in'],['Yesterday, 14:05','procurement-bot','Procurement virtual card ending 7731','Ostrava Events','Blocked by policy']];
let vQ='',vType='all',vFilter='all',revealId=null,revealT=null,vN=20;
const vDue=v=>v.rot!==null&&v.rot<=14,vUnused=v=>v.idle>=90,vShared=v=>v.bots.length>1;

const rule=(id,group,name,who,action,limit,asks,key)=>({id,group,name,who,action,limit,asks,on:true,key:key||''});
const GROUPS=['Spending','Changes to live systems','Mail and messages','Data','Releases'];
const RULES=[
  rule('r-1','Spending','Discounts','RevOps bot','give discounts','10%','the RevOps manager'),
  rule('r-2','Spending','Single purchase, Procurement','Procurement bot','make a single purchase','$5,000.00','Marcus Bell','procurement-bot'),
  rule('r-3','Spending','Single purchase, IT','IT bot','make a single purchase','$1,000.00','a workspace admin','it-bot'),
  rule('r-4','Spending','Renewals, IT','IT bot','renew a subscription','$250.00','Lena Fischer'),
  rule('r-5','Spending','Plan changes','Procurement bot','change a plan or add seats','','Marcus Bell'),
  rule('r-6','Spending','Approved vendors','All spending bots','pay a vendor that is not on the approved list','',''),
  rule('r-7','Changes to live systems','Live CRM workflows','Automation bot','turn on a workflow in the live CRM','','the RevOps manager'),
  rule('r-8','Changes to live systems','Bulk deal edits','RevOps bot','edit deals in one go','50 records','the RevOps manager'),
  rule('r-9','Changes to live systems','Admin roles','IT bot','grant an admin role','','Lena Fischer'),
  rule('r-10','Mail and messages','Outside mail','All bots','send mail to people outside Larkfield','20 messages a day','the bot owner'),
  rule('r-11','Mail and messages','Contracts and quotes','All bots','send a contract or quote to a customer','','the person who made the request'),
  rule('r-12','Mail and messages','Personal addresses','All bots','forward work mail to a personal address','',''),
  rule('r-13','Data','CRM exports','Analyst bot','export CRM records','5,000 rows','Dana Whitlock'),
  rule('r-14','Data','Deleting records','All bots','delete records','','the bot owner'),
  rule('r-15','Data','Unconnected apps','All bots','copy customer data into an app that is not connected through Claude Auth','',''),
  rule('r-16','Releases','Production releases','Builder bot','release to production','','Sam Okafor and a workspace admin'),
  rule('r-17','Releases','Staging deploys','Builder bot','deploy to staging','10 times a day','Sam Okafor'),
  rule('r-18','Releases','Failed builds','QA bot','mark a failed build as passed','','')
];
let ruleN=40;
const preview=r=>{const w=E(r.who),it=/^All/.test(r.who)?'they ask':'it asks';
  if(!r.asks)return `${w} may never ${E(r.action)}.`;
  if(r.limit)return `${w} may ${E(r.action)} up to ${E(r.limit)}. Above that ${it} ${E(r.asks)}.`;
  return `${w} may not ${E(r.action)} without asking ${E(r.asks)}.`};

const LAYERS=['Auth','Vault','Browser','Pay','Mail','Bots'],LCLS={Auth:'info',Vault:'warn',Pay:'ok',Mail:'accent'};
const AUDIT=[
  [0,'11:02','builder-bot','Bots','Asked to release CSV export to production','',1,'Stopped at the rule "Production releases". Waiting for approval before it deploys.'],
  [0,'10:57','qa-bot','Browser','Ran 48 checks on the staging build of CSV export','',0,'48 passed, 0 failed. Staging build 412. The result was passed to Builder bot.'],
  [0,'10:52','revops-bot','Bots','Asked for a 12% discount on the Halden Dental contract','',1,'Stopped at the rule "Discounts". The policy allows 10% without approval.'],
  [0,'10:49','revops-bot','Browser','Opened deal HD-2291 and compared it with the signed quote','',0,'Quote: Growth tier, 45 seats. Contract v2 used the Starter price.'],
  [0,'10:48','revops-bot','Vault','Used crm-service-key and contract-tool-key','',0,'The vault placed both keys into the sign-in request. The values were not shown to the model.'],
  [0,'10:48','revops-bot','Auth','Signed in to Meridian CRM and Foldcase','',0,'Identity: revops-bot@larkfield.example. Scopes: deals:write, contracts:write.'],
  [0,'10:31','it-bot','Pay','Asked to buy a laptop for a new hire, $1,400.00','',1,'Stopped at the rule "Single purchase, IT". The limit is $1,000.00 per purchase.'],
  [0,'10:26','it-bot','Auth','Created a directory account for the new hire starting Monday','',0,'Assigned the standard Sales role and six work apps. No admin rights.'],
  [0,'10:24','it-bot','Vault','Used directory-admin-key','',0,'The vault placed the key into the request. The value was not shown to the model.'],
  [0,'10:12','automation-bot','Bots','Asked to turn on lead routing in the live CRM','',1,'Stopped at the rule "Live CRM workflows". The workflow is ready and tested in the sandbox.'],
  [0,'10:05','automation-bot','Browser','Tested lead routing on 40 sample leads in the sandbox','',0,'40 of 40 leads reached the right regional rep.'],
  [0,'09:52','analyst-bot','Browser','Created the Q3 pipeline review deck in Slidewell','',0,'14 slides in the RevOps folder. Not shared outside Larkfield.'],
  [0,'09:40','analyst-bot','Browser','Read Q3 pipeline data from Meridian CRM','',0,'Read 1,840 deals. Nothing was changed.'],
  [0,'09:38','analyst-bot','Auth','Signed in to Meridian CRM with read access','',0,'Identity: analyst-bot@larkfield.example. Scope: pipeline:read.'],
  [0,'09:14','procurement-bot','Mail','Sent the renewal receipt to Marcus Bell','',0,'One message inside Larkfield, with the receipt attached.'],
  [0,'09:12','procurement-bot','Pay','Paid Corvin Analytics $4,050.00 for the yearly renewal','',0,'Inside the $5,000.00 per purchase limit. Virtual card ending 7731. Approved vendor.'],
  [0,'09:10','procurement-bot','Vault','Used the Corvin Analytics admin login','',0,'The vault filled the sign-in form. The password was not shown to the model.'],
  [0,'09:09','procurement-bot','Browser','Opened the Corvin Analytics billing page','',0,'Checked the renewal price against last year. No change in price.'],
  [0,'08:30','planner-bot','Bots','Wrote the spec for CSV export on invoices','',0,'Linked to 14 customer requests in Tallyboard.'],
  [0,'08:02','analyst-bot','Mail','Sent the Monday pipeline summary to Dana Whitlock','',0,'Scheduled run, Mondays 08:00.'],
  [0,'07:00','procurement-bot','Bots','Ran the daily renewal check and found 1 renewal due','',0,'Corvin Analytics, due today.'],
  [1,'17:42','it-bot','Pay','Paid Northgate Supply $389.00 for a desk and monitor arm','',0,'Inside the $1,000.00 per purchase limit. Virtual card ending 2086.'],
  [1,'17:40','it-bot','Vault','Used the IT virtual card ending 2086','',0,'The vault filled the payment form. The card number was not shown to the model.'],
  [1,'16:15','builder-bot','Browser','Deployed CSV export to staging','',0,'Staging build 412 from branch csv-export.'],
  [1,'16:14','builder-bot','Vault','Used staging-deploy-key','',0,'This key is 3 days past its rotation date.'],
  [1,'15:30','revops-bot','Mail','Replied to Priya Nair about the Halden Dental quote','',0,'One message inside Larkfield.'],
  [1,'14:48','it-bot','Auth','Assigned an admin role in the design tool','Approved by Lena Fischer',1,'Rule "Admin roles". Lena Fischer approved at 14:46.'],
  [1,'14:05','procurement-bot','Pay','Blocked a payment of $2,200.00 to Ostrava Events','',0,'Rule "Approved vendors". The vendor is not on the approved list. Marcus Bell was told.'],
  [1,'13:20','analyst-bot','Browser','Exported 3,200 CRM rows for the pipeline review','',0,'Inside the 5,000 row limit.'],
  [1,'11:36','automation-bot','Bots','Changed a lead scoring workflow in the sandbox','',0,'No live system was changed.'],
  [1,'11:02','qa-bot','Browser','Ran 46 checks on staging build 409','',0,'44 passed, 2 failed. Builder bot was told.'],
  [1,'10:15','it-bot','Pay','Renewed the Linden Learning course pack, $350.00','Approved by Lena Fischer',1,'Above the $250.00 renewal limit. Lena Fischer approved at 10:11.'],
  [1,'09:44','revops-bot','Bots','Updated 18 deals after the pricing review','',0,'Inside the 50 record limit for bulk edits.'],
  [1,'09:05','planner-bot','Mail','Sent the weekly roadmap note to Sam Okafor','',0,'One message inside Larkfield.'],
  [1,'08:20','builder-bot','Auth','Signed in to Harbor Git','',0,'Identity: builder-bot@larkfield.example. Scopes: code:write, deploy:request.'],
  [1,'07:00','procurement-bot','Bots','Ran the daily renewal check, nothing due','',0,'Scheduled run, daily 07:00.']
].map((a,i)=>({id:'a'+i,day:a[0],time:a[1],bot:a[2],layer:a[3],what:a[4],by:a[5],needed:!!a[6],detail:a[7]}));
let aQ='',aBot='all',aLayer='all',aNeeded=false;const aOpen={};

/* ---------- shell of the view ---------- */
const NAV=[['Account',[['general','General','user']]],['Money',[['wallet','Wallet and billing','wallet']]],['Access',[['identity','Identity and access','shield'],['vault','Vault','key']]],['Control',[['policies','Policies and limits','sliders'],['audit','Audit log','list']]]];
const SECTIONS={general,wallet,identity,vault,policies,audit};
function side(){
  const n={identity:CONSENT.status==='pending'?1:0,vault:V.filter(vDue).length};
  return `<aside class="side set-side" style="--side-w:240px"><div class="t-h" style="padding:4px 8px">Settings</div>${NAV.map(g=>`<div class="side-label">${g[0]}</div><div class="col" style="gap:1px">${g[1].map(s=>`<button class="nav-item" data-a="nav" data-id="${s[0]}" ${cur===s[0]?'aria-current="page"':''}>${I(s[2])}<span class="truncate">${s[1]}</span>${n[s[0]]?`<span class="count">${n[s[0]]}</span>`:''}</button>`).join('')}</div>`).join('')}
  <div style="margin-top:auto;padding:8px" class="t-xs t-mute">${E(D.company.name)} · ${E(D.company.plan)} plan · ${D.company.size} people</div></aside>`;
}
function render(root,sub){
  cur=SECTIONS[sub]?sub:'general';syncLaptop();
  root.innerHTML=`<div class="split" style="--side-w:240px">${side()}<div class="main" id="set-main"><div class="page">${SECTIONS[cur]()}</div></div></div>`;
}
function draw(){
  const root=document.getElementById('view');if(!root||CW.mode!=='settings')return;
  const mn=$('#set-main',root),top=mn?mn.scrollTop:0,ae=document.activeElement;let key=null;
  if(ae&&root.contains(ae)&&ae.dataset){const k=ae.dataset.a?'a':ae.dataset.c?'c':null;if(k)key=`[data-${k}="${ae.dataset[k]}"]`+(ae.dataset.id?`[data-id="${ae.dataset.id}"]`:'')}
  render(root,cur);const m2=$('#set-main',root);if(m2)m2.scrollTop=top;
  if(key){const t=$(key,root);if(t)t.focus({preventScroll:true})}
}

/* ---------- 1. General ---------- */
const theme=()=>document.documentElement.dataset.theme==='dark'?'dark':'light';
function general(){
  const sw=(id,title,desc)=>`<div class="set-item"><div class="col grow" style="gap:0"><span style="font-weight:500">${title}</span><span class="t-sm t-mute">${desc}</span></div><input type="checkbox" class="switch" role="switch" data-c="notif" data-id="${id}" aria-label="${title}" ${G.notif[id]?'checked':''}></div>`;
  return head('General','','Your profile and how the workspace looks and reaches you.')
  +sec('Profile','Shown to people and bots at '+E(D.company.name),`<button class="btn btn-sm" data-a="g-save">Save changes</button>`,`<div class="set-body"><div class="row" style="gap:12px"><span class="avatar" style="width:44px;height:44px;font-size:15px">${E(D.me.initials)}</span><div class="col" style="gap:0"><b style="font-weight:500">${E(G.name)}</b><span class="t-sm t-mute">${E(G.role)} · ${E(D.company.name)}</span></div><span class="grow"></span><button class="btn btn-sm" data-a="soon">Change photo</button></div>
    <div class="grid-2">${field('Name','set-g-name',`<input class="input" id="set-g-name" data-c="g" data-id="name" value="${E(G.name)}">`)}${field('Role','set-g-role',`<input class="input" id="set-g-role" data-c="g" data-id="role" value="${E(G.role)}">`)}</div>
    ${field('Email','set-g-email',`<input class="input" id="set-g-email" data-c="g" data-id="email" value="${E(G.email)}">`,'Approvals and daily summaries are sent here.')}</div>`)
  +sec('Appearance','',``,`<div class="set-item"><div class="col grow" style="gap:0"><span style="font-weight:500">Theme</span><span class="t-sm t-mute">Applies to every mode on this device.</span></div><div class="set-seg" role="group" aria-label="Theme"><button data-a="theme" data-id="light" aria-pressed="${theme()==='light'}">${I('sun',14)}Light</button><button data-a="theme" data-id="dark" aria-pressed="${theme()==='dark'}">${I('moon',14)}Dark</button></div></div>`)
  +sec('Notifications','When bots need you, and how you hear about it','',sw('push','Approvals by push','Get a push notification as soon as a bot is waiting for you.')+sw('daily','Daily summary by mail','One message at 17:30 with what the bots did and what they spent.')+sw('blocked','Alert when a bot is blocked','Tell me when a policy stops a bot, even if no approval is needed.')+sw('spend','Alert at 80% of a budget','Tell me when a team or bot has used most of its monthly budget.'))
  +sec('Language and region','','',`<div class="set-body"><div class="grid-2">${field('Language','set-g-lang',`<select class="select" id="set-g-lang" data-c="g" data-id="lang">${opts(['English (United Kingdom)','English (United States)','Deutsch','Français','Español','Nederlands'],G.lang)}</select>`)}${field('Time zone','set-g-zone',`<select class="select" id="set-g-zone" data-c="g" data-id="zone">${opts(['Europe, London time','Europe, Berlin time','America, New York time','America, Los Angeles time','Asia, Singapore time'],G.zone)}</select>`)}</div><span class="t-xs t-mute">Bots reply in the language of the person who asked. This setting changes the app only.</span></div>`)
  +`<section class="card"><div class="row" style="align-items:flex-start;gap:12px"><span class="set-ico">${I('info')}</span><div class="col" style="gap:4px"><h2 class="t-h">Concept</h2><p class="t-2">This is an unofficial concept proposal. It is not an Anthropic product, and nothing here is a statement of what will be built. The company, people, vendors, amounts and card numbers are all invented, and no real payment, sign-in or secret is handled.</p></div></div></section>`;
}

/* ---------- 2. Wallet and billing ---------- */
const TXC={Paid:'ok',Completed:'ok',Pending:'warn',Declined:'bad',Refunded:'info',Disputed:'warn'};
function txList(){const q=txQ.trim().toLowerCase();return W.tx.filter(t=>(txStatus==='all'||t.status===txStatus)&&(txBot==='all'||t.bot===txBot)&&(!q||(t.to+' '+t.what+' '+botName(t.bot)+' '+t.auth+' '+t.amt.toFixed(2)).toLowerCase().includes(q)))}
function txBody(){const l=txList();
  return l.length?`<div class="table-wrap"><table class="tbl set-tbl"><thead><tr><th>Date</th><th>Paid to</th><th>For</th><th>Bot</th><th>Authority</th><th class="num">Amount</th><th>Status</th></tr></thead><tbody>${l.map(t=>`<tr class="set-click" data-a="tx-open" data-id="${t.id}"><td class="t-mute" style="white-space:nowrap">${dayStr(t.off)}</td><td><button class="set-link" data-a="tx-open" data-id="${t.id}">${E(t.to)}</button></td><td class="t-2">${E(t.what)}</td><td style="white-space:nowrap">${t.bot?E(botName(t.bot)):'<span class="t-mute">None</span>'}</td><td class="t-2">${E(t.auth)}</td><td class="num">${t.kind==='in'?'+':''}${CW.money(t.amt)}</td><td>${pill(t.status,TXC[t.status])}</td></tr>`).join('')}</tbody></table></div><div class="set-item t-xs t-mute">${l.length} of ${W.tx.length} transactions</div>`
  :empty('search','No transactions match.','Try a different search or clear the filters.')+`<div class="row" style="justify-content:center;padding-bottom:24px"><button class="btn btn-sm" data-a="tx-clear">Clear filters</button></div>`}
function wallet(){
  const spent=spentTotal(),bud=monthBudget(),def=W.methods.find(m=>m.def),nm=MON[(new Date().getMonth()+1)%12];
  const budgetRows=W.teams.map((t,i)=>{const bots=D.bots.filter(b=>b.team===t.name&&W.botB[b.id]),s=bots.reduce((x,b)=>x+spentBy(b.id),0);
    return `<tr><td><b style="font-weight:600">${E(t.name)}</b><div class="t-xs t-mute">${bots.length?bots.length+' spending bot'+(bots.length>1?'s':''):'No spending bots'}</div></td><td class="num">${CW.money(t.budget)}</td><td class="num">${CW.money(s)}</td><td class="num">${CW.money(t.budget-s)}</td><td>${bar(s,t.budget)}</td><td class="num t-mute"></td><td class="num t-mute"></td><td><div class="set-acts"><button class="btn btn-sm" data-a="bud-edit" data-id="team:${i}">Edit</button></div></td></tr>`
    +bots.map(b=>{const B=W.botB[b.id],sb=spentBy(b.id);return `<tr class="set-sub"><td><div class="row">${I('bot',14)}<span>${E(b.name)}</span></div></td><td class="num">${CW.money(B.budget)}</td><td class="num">${CW.money(sb)}</td><td class="num">${CW.money(B.budget-sb)}</td><td>${bar(sb,B.budget)}</td><td class="num">${CW.money(b.limit)}</td><td class="num">${CW.money(B.renew)}</td><td><div class="set-acts"><button class="btn btn-sm" data-a="bud-edit" data-id="${b.id}" aria-label="Edit budget for ${E(b.name)}">Edit</button></div></td></tr>`}).join('')}).join('');
  return head('Wallet and billing','Claude Pay','Money your bots can spend, inside limits you set. Every payment is tied to a bot, a rule and a receipt.')
  +`<div class="set-wtop"><section class="card col" style="gap:12px"><div class="row between"><span class="t-label">Available balance</span>${pill('Wallet active','ok')}</div><div class="set-big">${CW.money(W.balance)}</div>
    <div class="col" style="gap:6px"><div class="row between t-sm"><span>Spent this month</span><span class="t-mono">${CW.money(spent)} of ${CW.money(bud)}</span></div>${bar(spent,bud)}<span class="t-xs t-mute">${CW.money(Math.max(0,bud-spent))} left in the monthly budget. Resets ${nm} 1.</span></div>
    <div class="row wrap"><button class="btn btn-primary" data-a="funds">${I('plus',14)}Add funds</button><button class="btn" data-a="withdraw">Withdraw</button></div></section>
  <section class="card col" style="gap:12px"><div class="row between"><div class="col" style="gap:0"><h2 class="t-h">Auto top-up</h2><span class="t-xs t-mute">${def?'Uses '+E(def.name.toLowerCase())+' ending '+def.last4:'Add a payment method to use this'}</span></div><input type="checkbox" class="switch" role="switch" data-c="auto-on" aria-label="Auto top-up" ${W.auto.on?'checked':''}></div>
    <div class="grid-2">${field('When balance falls below','set-at-below',`<input class="input t-mono" id="set-at-below" inputmode="decimal" data-c="auto" data-id="below" value="${CW.money(W.auto.below)}" ${W.auto.on?'':'disabled'}>`)}${field('Top up to','set-at-to',`<input class="input t-mono" id="set-at-to" inputmode="decimal" data-c="auto" data-id="to" value="${CW.money(W.auto.to)}" ${W.auto.on?'':'disabled'}>`)}</div>
    <span class="t-xs t-mute">${W.auto.on?'At most one top-up a day. You get a receipt by mail each time.':'Auto top-up is off. Bots stop and ask when the balance runs out.'}</span></section></div>`
  +sec('Payment methods','Used to add funds. Bots never see these.',`<button class="btn btn-sm" data-a="pm-add">${I('plus',13)}Add payment method</button>`,W.methods.length?W.methods.map(p=>`<div class="set-item"><span class="set-ico">${I(p.kind==='card'?'card':'wallet')}</span><div class="col grow" style="gap:0"><span><b style="font-weight:500">${E(p.name)}</b> ending <span class="t-mono">${p.last4}</span></span><span class="t-xs t-mute">${E(p.note)}</span></div>${p.def?pill('Default','ok'):`<button class="btn btn-sm" data-a="pm-def" data-id="${p.id}">Set as default</button>`}<button class="btn btn-sm btn-danger" data-a="pm-rm" data-id="${p.id}" aria-label="Remove ${E(p.name)}">Remove</button></div>`).join(''):empty('card','No payment methods.','Add one to top up the wallet.'))
  +sec('Budgets','Monthly budgets per team and per bot',`<span class="t-xs t-mute">Total ${CW.money(bud)} a month</span>`,`<div class="table-wrap"><table class="tbl set-tbl"><thead><tr><th>Team or bot</th><th class="num">Budget</th><th class="num">Spent</th><th class="num">Remaining</th><th>Used</th><th class="num">Per purchase</th><th class="num">Renewals</th><th aria-label="Actions"></th></tr></thead><tbody>${budgetRows}</tbody></table></div>`)
  +sec('Virtual cards','One card per spending bot. The number stays in the vault.',`<button class="btn btn-sm" data-a="vc-issue">${I('plus',13)}Issue card</button>`,W.cards.length?`<div class="set-vcs">${W.cards.map(c=>`<div class="set-vc"><div class="set-plastic${c.frozen?' frozen':''}"><div class="row between"><span class="s">${E(botName(c.bot))}</span>${I('card',15)}</div><div class="n">•••• •••• •••• ${c.last4}</div><div class="row between"><span class="s">Virtual</span><span class="s">${c.exp}</span></div></div>
    <div class="col" style="gap:6px;min-width:0"><div class="row between"><b style="font-weight:500">${E(botName(c.bot))}</b>${pill(c.frozen?'Frozen':'Active',c.frozen?'warn':'ok')}</div><dl class="set-kv" style="grid-template-columns:96px minmax(0,1fr);gap:2px 8px"><dt>Per purchase</dt><dd class="t-mono">${CW.money(c.limit)}</dd><dt>Monthly</dt><dd class="t-mono">${CW.money(c.monthly)}</dd><dt>Vendor lock</dt><dd>${E(c.lock)}</dd></dl>
    <div class="row" style="margin-top:2px"><button class="btn btn-sm" data-a="vc-freeze" data-id="${c.id}">${c.frozen?'Unfreeze':'Freeze'}</button><button class="btn btn-sm btn-ghost" data-a="vc-close" data-id="${c.id}">Close card</button></div></div></div>`).join('')}</div>`:empty('card','No virtual cards.','Issue a card to let a bot pay vendors.'))
  +sec('Transactions','Everything paid from or into the wallet',`<button class="btn btn-sm" data-a="tx-export">${I('download',13)}Export</button>`,`<div class="set-tools"><label class="search">${I('search',15)}<input data-i="tx-q" placeholder="Search by vendor, purpose or amount" aria-label="Search transactions" value="${E(txQ)}"></label><select class="select" data-c="tx-bot" aria-label="Filter by bot">${opts([['all','All bots']].concat(D.bots.filter(b=>W.botB[b.id]).map(b=>[b.id,b.name])),txBot)}</select><select class="select" data-c="tx-status" aria-label="Filter by status">${opts([['all','All statuses'],'Paid','Pending','Declined','Refunded','Disputed','Completed'],txStatus)}</select></div><div id="set-tx">${txBody()}</div>`)
  +sec('Subscriptions','Renewals the bots look after',`<span class="t-xs t-mute">${CW.money(W.subs.filter(s=>!s.cancel).reduce((a,s)=>a+s.yearly,0))} a year</span>`,`<div class="table-wrap"><table class="tbl set-tbl"><thead><tr><th>Vendor and plan</th><th>Seats</th><th>Next renewal</th><th class="num">Yearly cost</th><th>Owner bot</th><th aria-label="Actions"></th></tr></thead><tbody>${W.subs.map(s=>`<tr><td><b style="font-weight:500">${E(s.vendor)}</b><div class="t-xs t-mute">${E(s.plan)}</div></td><td style="white-space:nowrap">${s.seats?`${s.used} of ${s.seats} used`:'<span class="t-mute">Not seat based</span>'}</td><td style="white-space:nowrap">${s.cancel?pill('Ends '+s.renew,'warn'):E(s.renew)}</td><td class="num">${CW.money(s.yearly)}</td><td style="white-space:nowrap">${E(botName(s.bot))}</td><td><div class="set-acts" style="gap:6px"><button class="btn btn-sm" data-a="sub-seats" data-id="${s.id}">Review seats</button><button class="btn btn-sm${s.cancel?'':' btn-danger'}" data-a="sub-cancel" data-id="${s.id}">${s.cancel?'Keep subscription':'Cancel at renewal'}</button></div></td></tr>`).join('')}</tbody></table></div>`)
  +sec('Invoices and statements','One statement a month, with every receipt attached','',W.statements.map((s,i)=>`<div class="set-item"><span class="set-ico">${I('file')}</span><div class="col grow" style="gap:0"><b style="font-weight:500">${E(s.name)}</b><span class="t-xs t-mute">${s.n} payments · ${CW.money(s.total)}</span></div><button class="btn btn-sm" data-a="st-dl" data-id="${i}" aria-label="Download statement for ${E(s.name)}">${I('download',13)}Download</button></div>`).join(''));
}
function pmOptions(st,kind){return W.methods.filter(p=>!kind||p.kind===kind).map(p=>`<button class="set-opt" data-pm="${p.id}" aria-pressed="${st.pm===p.id}"><span class="set-ico">${I(p.kind==='card'?'card':'wallet')}</span><span class="col grow" style="gap:0"><span><b style="font-weight:500">${E(p.name)}</b> ending <span class="t-mono">${p.last4}</span></span><span class="t-xs t-mute">${E(p.note)}</span></span>${p.def?pill('Default'):''}</button>`).join('')}
function fundsModal(step,st){
  if(!W.methods.length){CW.toast('Add a payment method first.');return}
  st=st||{amt:5000,pm:(W.methods.find(m=>m.def)||W.methods[0]).id};const p=W.methods.find(m=>m.id===st.pm)||W.methods[0];
  if(step===1){
    const m=CW.modal({title:'Add funds',body:`<div class="col"><span class="t-label">Amount</span><div class="set-presets">${[1000,2500,5000,10000].map(v=>`<button class="btn" data-v="${v}" aria-pressed="${st.amt===v}">${CW.money(v).replace('.00','')}</button>`).join('')}</div></div>
      ${field('Or enter an amount','set-f-amt',`<input class="input t-mono" id="set-f-amt" inputmode="decimal" value="${st.amt}">`,'Between $50.00 and $50,000.00.')}<div class="col"><span class="t-label">Pay from</span>${pmOptions(st)}</div>`,
      foot:`<button class="btn" data-close>Cancel</button><button class="btn btn-primary" id="set-f-next">Review</button>`});
    const inp=$('#set-f-amt',m);
    m.addEventListener('click',e=>{const v=e.target.closest('[data-v]'),o=e.target.closest('[data-pm]');
      if(v){st.amt=+v.dataset.v;inp.value=st.amt;$$('[data-v]',m).forEach(b=>b.setAttribute('aria-pressed',b===v))}
      if(o){st.pm=o.dataset.pm;$$('[data-pm]',m).forEach(b=>b.setAttribute('aria-pressed',b===o))}});
    inp.addEventListener('input',()=>{st.amt=num(inp.value);$$('[data-v]',m).forEach(b=>b.setAttribute('aria-pressed',+b.dataset.v===st.amt))});
    $('#set-f-next',m).addEventListener('click',()=>{if(st.amt<50||st.amt>50000){CW.toast('Enter an amount between $50.00 and $50,000.00.');inp.focus();return}fundsModal(2,st)});
  }else if(step===2){
    const m=CW.modal({title:'Review and confirm',body:`<dl class="set-kv"><dt>Amount</dt><dd class="t-mono">${CW.money(st.amt)}</dd><dt>Pay from</dt><dd>${E(p.name)} ending <span class="t-mono">${p.last4}</span></dd><dt>Fee</dt><dd class="t-mono">${CW.money(0)}</dd><dt>Arrives</dt><dd>${p.kind==='card'?'Straight away':'In 1 to 2 working days'}</dd><dt>Balance after</dt><dd class="t-mono"><b>${CW.money(W.balance+st.amt)}</b></dd></dl>${fakeNote}`,
      foot:`<button class="btn" id="set-f-back">Back</button><button class="btn btn-primary" id="set-f-ok">Add ${CW.money(st.amt)}</button>`});
    $('#set-f-back',m).addEventListener('click',()=>fundsModal(1,st));
    $('#set-f-ok',m).addEventListener('click',()=>{W.balance+=st.amt;W.tx.unshift(tx(0,nowTime(),'Wallet top-up','From '+p.name.toLowerCase()+' ending '+p.last4,'','Added by '+D.me.name,st.amt,'Completed',1,'in'));
      log('Pay','Added '+CW.money(st.amt)+' to the wallet','From '+p.name.toLowerCase()+' ending '+p.last4+'. Balance after: '+CW.money(W.balance)+'.');draw();
      CW.modal({title:'Funds added',body:`<div class="set-success"><i>${I('check',22)}</i><b class="t-h">${CW.money(st.amt)} added</b><span class="t-mute">The wallet balance is now ${CW.money(W.balance)}. A receipt is in Transactions.</span></div>`,foot:`<button class="btn btn-primary" data-close>Done</button>`})});
  }
}
function withdrawModal(){
  const banks=W.methods.filter(p=>p.kind==='bank');if(!banks.length){CW.toast('Add a bank account first. Withdrawals go to a bank account.');return}
  const st={pm:banks[0].id};
  const m=CW.modal({title:'Withdraw',body:`${field('Amount','set-w-amt',`<input class="input t-mono" id="set-w-amt" inputmode="decimal" placeholder="0.00">`,'Available: '+CW.money(W.balance)+'. Arrives in 1 to 2 working days.')}<div class="col"><span class="t-label">Send to</span>${pmOptions(st,'bank')}</div>`,foot:`<button class="btn" data-close>Cancel</button><button class="btn btn-primary" id="set-w-ok">Withdraw</button>`});
  m.addEventListener('click',e=>{const o=e.target.closest('[data-pm]');if(o){st.pm=o.dataset.pm;$$('[data-pm]',m).forEach(b=>b.setAttribute('aria-pressed',b===o))}});
  $('#set-w-ok',m).addEventListener('click',()=>{const a=num($('#set-w-amt',m).value),p=W.methods.find(x=>x.id===st.pm);
    if(a<=0){CW.toast('Enter an amount to withdraw.');return}if(a>W.balance){CW.toast('That is more than the available balance.');return}
    W.balance-=a;W.tx.unshift(tx(0,nowTime(),'Withdrawal','To '+p.name.toLowerCase()+' ending '+p.last4,'','Withdrawn by '+D.me.name,a,'Pending',0,'wd'));
    log('Pay','Withdrew '+CW.money(a)+' from the wallet','To '+p.name.toLowerCase()+' ending '+p.last4+'.');CW.closeModal();draw();CW.toast(CW.money(a)+' is on its way to the account ending '+p.last4+'.')});
}
function pmModal(){
  const m=CW.modal({title:'Add payment method',body:`${fakeNote}${field('Type','set-pm-kind',`<select class="select" id="set-pm-kind">${opts([['card','Company card'],['bank','Bank account']])}</select>`)}${field('Name for this method','set-pm-name',`<input class="input" id="set-pm-name" placeholder="For example: Travel card">`)}
    <div class="grid-2">${field('Number','set-pm-num',`<input class="input t-mono" id="set-pm-num" inputmode="numeric" placeholder="0000 0000 0000 0000" autocomplete="off">`,'Only the last four digits are kept.')}${field('Expiry or reference','set-pm-exp',`<input class="input t-mono" id="set-pm-exp" placeholder="MM/YY" autocomplete="off">`)}</div>`,
    foot:`<button class="btn" data-close>Cancel</button><button class="btn btn-primary" id="set-pm-ok">Add method</button>`});
  $('#set-pm-ok',m).addEventListener('click',()=>{const kind=$('#set-pm-kind',m).value,digits=$('#set-pm-num',m).value.replace(/\D/g,''),name=$('#set-pm-name',m).value.trim()||(kind==='card'?'Company card':'Bank account'),exp=$('#set-pm-exp',m).value.trim();
    const p={id:'pm-'+(++txN),kind,name,last4:digits.length>=4?digits.slice(-4):rand4(),note:kind==='card'?(exp?'Expires '+exp:'Card, added today'):'Bank account, waiting for verification',def:!W.methods.length};
    W.methods.push(p);log('Pay','Added a payment method ending '+p.last4,name+'.');CW.closeModal();draw();CW.toast(name+' ending '+p.last4+' added.')});
}
function budgetModal(id){
  const isTeam=id.indexOf('team:')===0,t=isTeam?W.teams[+id.slice(5)]:null,b=isTeam?null:CW.bot(id),B=b?W.botB[b.id]:null;if(!t&&!B)return;
  const m=CW.modal({title:'Edit budget: '+(t?t.name:b.name),body:`${field('Monthly budget','set-b-bud',`<input class="input t-mono" id="set-b-bud" inputmode="decimal" value="${(t?t.budget:B.budget).toFixed(2)}">`,t?'Shared by every spending bot in this team.':'Spent so far this month: '+CW.money(spentBy(b.id))+'.')}
    ${b?`<div class="grid-2">${field('Per purchase limit','set-b-lim',`<input class="input t-mono" id="set-b-lim" inputmode="decimal" value="${b.limit.toFixed(2)}">`,'Above this the bot asks first.')}${field('Renewal limit','set-b-ren',`<input class="input t-mono" id="set-b-ren" inputmode="decimal" value="${B.renew.toFixed(2)}">`,'For renewing an existing plan.')}</div>`:''}`,
    foot:`<button class="btn" data-close>Cancel</button><button class="btn btn-primary" id="set-b-ok">Save</button>`});
  $('#set-b-ok',m).addEventListener('click',()=>{const v=num($('#set-b-bud',m).value);if(v<=0){CW.toast('Enter a budget above zero.');return}
    if(t)t.budget=v;else{B.budget=v;b.limit=num($('#set-b-lim',m).value);B.renew=num($('#set-b-ren',m).value);
      const c=W.cards.find(x=>x.bot===b.id);if(c){c.limit=b.limit;c.monthly=v}const r=RULES.find(x=>x.key===b.id);if(r)r.limit=CW.money(b.limit)}
    log('Pay','Changed the budget for '+(t?t.name:b.name),'Monthly budget: '+CW.money(v)+(b?'. Per purchase: '+CW.money(b.limit)+'. Renewals: '+CW.money(B.renew):'')+'.',b?b.id:'');CW.closeModal();draw();CW.toast('Budget saved.')});
}
function issueModal(){
  const free=D.bots.filter(b=>!W.cards.some(c=>c.bot===b.id));
  if(!free.length){CW.toast('Every bot already has a card.');return}
  const m=CW.modal({title:'Issue card',body:`${field('Bot','set-vc-bot',`<select class="select" id="set-vc-bot">${opts(free.map(b=>[b.id,b.name+' · '+b.team]))}</select>`,'A bot can hold one card.')}
    <div class="grid-2">${field('Per purchase limit','set-vc-lim',`<input class="input t-mono" id="set-vc-lim" inputmode="decimal" value="250.00">`)}${field('Monthly limit','set-vc-mon',`<input class="input t-mono" id="set-vc-mon" inputmode="decimal" value="1000.00">`)}</div>
    ${field('Vendor lock','set-vc-lock',`<select class="select" id="set-vc-lock">${opts(['Approved vendors only','One vendor only','Any vendor, ask every time'])}</select>`)}<div class="set-note">${I('lock',14)}<span>The card number is created inside the vault. The bot can pay with it but cannot read it.</span></div>`,
    foot:`<button class="btn" data-close>Cancel</button><button class="btn btn-primary" id="set-vc-ok">Issue card</button>`});
  $('#set-vc-ok',m).addEventListener('click',()=>{const b=CW.bot($('#set-vc-bot',m).value),lim=num($('#set-vc-lim',m).value),mon=num($('#set-vc-mon',m).value);
    if(lim<=0||mon<lim){CW.toast('The monthly limit must be at least the per purchase limit.');return}
    const c={id:'vc-'+(++txN),bot:b.id,last4:rand4(),exp:'11/28',limit:lim,monthly:mon,lock:$('#set-vc-lock',m).value,frozen:false};W.cards.push(c);
    if(!W.botB[b.id])W.botB[b.id]={budget:mon,renew:0};b.limit=lim;
    V.push({id:'v-'+(++vN),name:b.name+' virtual card ending '+c.last4,type:'Card',bots:[b.id],last:'Never',idle:0,rot:null,exp:'Expires '+c.exp});
    log('Pay','Issued a virtual card ending '+c.last4+' to '+b.name,'Per purchase: '+CW.money(lim)+'. Monthly: '+CW.money(mon)+'. '+c.lock+'.',b.id);CW.closeModal();draw();CW.toast('Card ending '+c.last4+' issued to '+b.name+'.')});
}
function receiptModal(id){
  const t=W.tx.find(x=>x.id===id);if(!t)return;const c=W.cards.find(x=>x.bot===t.bot);
  const m=CW.modal({title:t.kind==='out'?'Receipt':'Transaction',body:`<div class="row between"><div class="col" style="gap:0"><b class="t-h">${E(t.to)}</b><span class="t-sm t-mute">${E(t.what)}</span></div><div class="col" style="gap:2px;align-items:flex-end"><span class="t-mono" style="font-size:18px">${t.kind==='in'?'+':''}${CW.money(t.amt)}</span>${pill(t.status,TXC[t.status])}</div></div><hr class="divider">
    <dl class="set-kv"><dt>Date</dt><dd>${dayStr(t.off,1)}, ${t.time}</dd>${t.bot?`<dt>Bot</dt><dd>${E(botName(t.bot))}</dd>`:''}${t.kind==='out'&&c?`<dt>Paid with</dt><dd>Virtual card ending <span class="t-mono">${c.last4}</span></dd>`:''}<dt>Authority</dt><dd>${E(t.auth)}</dd><dt>Reference</dt><dd class="t-mono">LF-${t.id.slice(3)}-${String(Math.round(t.amt*100)).padStart(6,'0')}</dd>${t.reason?`<dt>Dispute reason</dt><dd>${E(t.reason)}</dd>`:''}</dl>
    ${t.status==='Declined'?`<div class="set-note">${I('alert',14)}<span>No money left the wallet. The vendor is not on the approved list, so the payment was stopped before it was sent.</span></div>`:''}`,
    foot:`${t.kind==='out'&&t.status==='Paid'?`<button class="btn btn-danger" id="set-r-dis">Dispute</button>`:''}<button class="btn" id="set-r-dl">${I('download',14)}Download receipt</button><button class="btn btn-primary" data-close>Close</button>`});
  $('#set-r-dl',m).addEventListener('click',()=>CW.toast('Downloads are not part of this concept. The receipt for '+t.to+' would be saved as a file.'));
  const d=$('#set-r-dis',m);if(d)d.addEventListener('click',()=>disputeModal(t));
}
function disputeModal(t){
  const m=CW.modal({title:'Dispute a payment',body:`<p class="t-2">${E(t.to)}, ${CW.money(t.amt)}, ${dayStr(t.off)}. The bot that paid is told and stops paying this vendor until the dispute is closed.</p>${field('Reason','set-d-why',`<select class="select" id="set-d-why">${opts(['Charged the wrong amount','Charged twice','Goods or service not received','I do not recognise this payment','Cancelled before the charge'])}</select>`)}${field('Details (optional)','set-d-txt',`<textarea class="textarea" id="set-d-txt" rows="3" placeholder="Anything that helps the vendor look into it"></textarea>`)}`,
    foot:`<button class="btn" data-close>Cancel</button><button class="btn btn-primary" id="set-d-ok">Open dispute</button>`});
  $('#set-d-ok',m).addEventListener('click',()=>{t.status='Disputed';t.reason=$('#set-d-why',m).value;log('Pay','Opened a dispute with '+t.to+' for '+CW.money(t.amt),'Reason: '+t.reason+'.',t.bot);CW.closeModal();draw();CW.toast('Dispute opened. '+(botName(t.bot)||'The bot')+' has been told.')});
}
function seatsModal(id){
  const s=W.subs.find(x=>x.id===id);if(!s)return;
  if(!s.seats){CW.modal({title:'Review seats: '+s.vendor,body:`<p class="t-2">${E(s.plan)} is billed by usage, not by seat. ${E(botName(s.bot))} checks usage against the plan before each renewal.</p>`,foot:`<button class="btn btn-primary" data-close>Close</button>`});return}
  const spare=s.seats-s.used,per=s.yearly/s.seats,keep=Math.min(s.seats,s.used+(spare>2?2:0));
  const m=CW.modal({title:'Review seats: '+s.vendor,body:`<dl class="set-kv"><dt>Plan</dt><dd>${E(s.plan)}</dd><dt>Seats paid for</dt><dd>${s.seats}</dd><dt>Seats in use</dt><dd>${s.used} (signed in during the last 30 days)</dd><dt>Cost per seat</dt><dd class="t-mono">${CW.money(per)} a year</dd></dl>${bar(s.used,s.seats)}
    ${spare>0?`<div class="notice"><b>${spare} seat${spare>1?'s are':' is'} not being used</b><span class="t-sm">Reducing to ${keep} seats at the next renewal would save ${CW.money((s.seats-keep)*per)} a year${keep>s.used?' and keep 2 spare':''}.</span></div>`:`<div class="set-note">${I('check',14)}<span>Every seat is in use. Nothing to change.</span></div>`}`,
    foot:`<button class="btn" data-close>Close</button>${spare>0?`<button class="btn btn-primary" id="set-s-ok">Reduce to ${keep} at renewal</button>`:''}`});
  const ok=$('#set-s-ok',m);if(ok)ok.addEventListener('click',()=>{s.yearly=Math.round(per*keep*100)/100;s.seats=keep;log('Pay','Asked '+botName(s.bot)+' to reduce '+s.vendor+' to '+keep+' seats','Takes effect at the next renewal on '+s.renew+'.',s.bot);CW.closeModal();draw();CW.toast(botName(s.bot)+' will reduce '+s.vendor+' to '+keep+' seats at renewal.')});
}

/* ---------- 3. Identity and access ---------- */
const whoName=w=>w==='me'?D.me.name:botName(w);
function identity(){
  const c=CONSENT,cb=CW.bot(c.bot);
  const lists=(a,b,ta,tb)=>`<div class="set-lists"><div><span class="t-label">${ta}</span><ul class="y">${a.map(x=>`<li>${I('check',14)}<span>${E(x)}</span></li>`).join('')}</ul></div><div><span class="t-label">${tb}</span><ul class="n">${b.map(x=>`<li>${I('x',14)}<span>${E(x)}</span></li>`).join('')}</ul></div></div>`;
  return head('Identity and access','Claude Auth','Who each bot is, which apps it is signed in to and what it may do there.')
  +(c.status==='pending'?`<section class="notice"><div class="row between wrap"><div class="row"><span class="avatar bot">${I('shield',15)}</span><div class="col" style="gap:0"><b>${E(c.app)} is asking for access</b><span class="t-sm t-mute">${E(c.kind)} · for ${E(cb.name)} · asked by ${E(cb.owner)}</span></div></div>${pill('Waiting for you','warn')}</div>${lists(c.asks,c.not,'It would be able to','It would not be able to')}<div class="t-xs t-mute">Scopes: <span class="t-mono">${c.scopes.join(', ')}</span>. You can revoke this at any time.</div><div class="row wrap"><button class="btn btn-primary" data-a="consent" data-id="allow">Allow</button><button class="btn" data-a="consent" data-id="deny">Deny</button></div></section>`
    :`<section class="card"><div class="row">${I(c.status==='allowed'?'check':'x')}<span class="t-2">You ${c.status==='allowed'?'allowed':'denied'} the request from ${E(c.app)}. No other requests are waiting.</span></div></section>`)
  +sec('Sign in with Claude','Apps you and your bots are signed in to',`<span class="t-xs t-mute">${APPS.length} connected</span>`,APPS.length?`<div class="table-wrap"><table class="tbl set-tbl"><thead><tr><th>App</th><th>Signed in as</th><th>Scopes granted</th><th>Last used</th><th aria-label="Actions"></th></tr></thead><tbody>${APPS.map(a=>`<tr class="set-click" data-a="app-open" data-id="${a.id}"><td><button class="set-link" data-a="app-open" data-id="${a.id}">${E(a.name)}</button><div class="t-xs t-mute">${E(a.kind)}</div></td><td style="white-space:nowrap"><div class="row">${a.who==='me'?I('user',14):I('bot',14)}<span>${E(whoName(a.who))}</span></div></td><td><span class="t-mono t-xs t-2">${a.scopes.join(', ')}</span></td><td class="t-mute" style="white-space:nowrap">${E(a.last)}</td><td><div class="set-acts"><button class="btn btn-sm btn-danger" data-a="app-revoke" data-id="${a.id}" aria-label="Revoke ${E(a.name)} for ${E(whoName(a.who))}">Revoke</button></div></td></tr>`).join('')}</tbody></table></div>`:empty('shield','No connected apps.','Apps appear here when you or a bot sign in with Claude.'))
  +sec('Bot identities','Each bot signs in as itself, never as a person','',`<div class="table-wrap"><table class="tbl set-tbl"><thead><tr><th>Bot</th><th>Address</th><th>Role</th><th>Owner</th><th>Status</th><th aria-label="Actions"></th></tr></thead><tbody>${D.bots.map(b=>{const s=suspended[b.id]!==undefined;return `<tr><td style="white-space:nowrap"><div class="row"><span class="avatar bot" style="width:24px;height:24px">${I('bot',13)}</span><b style="font-weight:500">${E(b.name)}</b></div></td><td class="t-mono t-xs">${b.id}@larkfield.example</td><td>${E(ROLE[b.id]||'Member')}</td><td style="white-space:nowrap">${E(b.owner)}</td><td>${pill(s?'Suspended':'Active',s?'bad':'ok')}</td><td><div class="set-acts"><button class="btn btn-sm" data-a="bot-susp" data-id="${b.id}" aria-label="${s?'Resume':'Suspend'} ${E(b.name)}">${s?'Resume':'Suspend'}</button></div></td></tr>`}).join('')}</tbody></table></div>`)
  +sec('People and roles','Who can approve, own bots and change settings',`<button class="btn btn-sm" data-a="invite">${I('plus',13)}Invite person</button>`,`<div class="table-wrap"><table class="tbl set-tbl"><thead><tr><th>Person</th><th>Team</th><th>Role</th><th>Bots owned</th><th>Last active</th></tr></thead><tbody>${PEOPLE.map((p,i)=>{const own=D.bots.filter(b=>b.owner===p.name);return `<tr><td style="white-space:nowrap"><div class="row"><span class="avatar" style="width:24px;height:24px;font-size:10px">${E(p.initials)}</span><b style="font-weight:500">${E(p.name)}</b>${i===0?pill('You'):''}</div></td><td>${E(p.team)}</td><td>${p.role==='Owner'?pill('Owner','accent'):`<button class="btn btn-sm" data-a="role" data-id="${i}" aria-label="Change role for ${E(p.name)}">${E(p.role)} ${I('chevron-down',12)}</button>`}</td><td class="t-2">${own.length?own.map(b=>E(b.name)).join(', '):'<span class="t-mute">None</span>'}</td><td class="t-mute" style="white-space:nowrap">${E(p.last)}</td></tr>`}).join('')}</tbody></table></div>`)
  +`<div class="grid-2" style="align-items:start">${sec('Sessions and devices','Where you are signed in','',SESSIONS.map(s=>`<div class="set-item"><span class="set-ico">${I(s.device==='Phone'?'user':'panel')}</span><div class="col grow" style="gap:0"><b style="font-weight:500">${E(s.device)}</b><span class="t-xs t-mute">${E(s.app)} · ${E(s.where)} · ${E(s.last)}</span></div>${s.cur?pill('This device','ok'):`<button class="btn btn-sm" data-a="sess-out" data-id="${s.id}" aria-label="Sign out ${E(s.device)}">Sign out</button>`}</div>`).join(''))}
  ${sec('Passkeys','Sign in without a password',`<button class="btn btn-sm" data-a="passkey">${I('plus',13)}Add passkey</button>`,PASSKEYS.map(p=>`<div class="set-item"><span class="set-ico">${I('key')}</span><div class="col grow" style="gap:0"><b style="font-weight:500">${E(p.name)}</b><span class="t-xs t-mute">${E(p.added)} · ${E(p.last)}</span></div></div>`).join('')+`<div class="set-item"><span class="set-note">${I('lock',14)}<span>Approvals above $1,000.00 ask for a passkey before they go through.</span></span></div>`)}</div>`;
}
function appModal(id){
  const a=APPS.find(x=>x.id===id);if(!a)return;
  const li=(l,ic)=>l.map(x=>`<li>${I(ic,14)}<span>${E(x)}</span></li>`).join('');
  const m=CW.modal({title:a.name+' · '+whoName(a.who),body:`<dl class="set-kv"><dt>App</dt><dd>${E(a.name)} (${E(a.kind)})</dd><dt>Signed in as</dt><dd>${a.who==='me'?E(D.me.email):`<span class="t-mono">${a.who}@larkfield.example</span>`}</dd><dt>Scopes</dt><dd class="t-mono">${a.scopes.join(', ')}</dd><dt>Last used</dt><dd>${E(a.last)}</dd></dl><hr class="divider">
    <div class="set-lists"><div><span class="t-label">Allowed</span><ul class="y">${li(a.can,'check')}</ul></div><div><span class="t-label">Not allowed</span><ul class="n">${li(a.cannot,'x')}</ul></div></div>
    <div class="set-note">${I('info',14)}<span>The app only gets a scoped token for this identity. It never gets a password, and the token stops working when you revoke it.</span></div>`,
    foot:`<button class="btn btn-danger" id="set-app-rv">Revoke access</button><button class="btn btn-primary" data-close>Close</button>`});
  $('#set-app-rv',m).addEventListener('click',()=>revokeApp(id));
}
function revokeApp(id){const a=APPS.find(x=>x.id===id);if(!a)return;
  confirmM('Revoke access',`${E(whoName(a.who))} will be signed out of ${E(a.name)} straight away. Work that needs this app will stop and ask you.`,'Revoke',()=>{APPS.splice(APPS.indexOf(a),1);log('Auth','Revoked '+a.name+' for '+whoName(a.who),'Scopes removed: '+a.scopes.join(', ')+'.',a.who==='me'?'':a.who);draw();CW.toast(a.name+' access revoked for '+whoName(a.who)+'.')},true)}

/* ---------- 4. Vault ---------- */
const VTYPE={'Login':'user','API key':'key','Card':'card','Certificate':'shield'};
function vHealth(v){
  if(vUnused(v))return pill('Unused for '+v.idle+' days','warn');
  if(v.type==='Login')return pill(v.strength||'Strong',v.strength==='Weak'?'bad':v.strength==='Fair'?'warn':'ok');
  if(v.type==='Card')return `<span class="t-2">${E(v.exp||'No expiry')}</span>`;
  if(v.rot===null)return '<span class="t-mute">No rotation</span>';
  const w=v.type==='Certificate'?'Expires':'Rotate';
  return v.rot<0?pill(w==='Rotate'?'Rotation overdue by '+(-v.rot)+' days':'Expired','bad'):v.rot<=14?pill(w+' in '+v.rot+' days','warn'):`<span class="t-2">${w} in ${v.rot} days</span>`;
}
function vList(){const q=vQ.trim().toLowerCase();return V.filter(v=>(vType==='all'||v.type===vType)&&(vFilter==='all'||(vFilter==='due'&&vDue(v))||(vFilter==='unused'&&vUnused(v))||(vFilter==='shared'&&vShared(v)))&&(!q||(v.name+' '+v.type+' '+v.bots.map(botName).join(' ')).toLowerCase().includes(q)))}
const fakeSecret=v=>'fake-'+v.id.replace('v-','').padStart(4,'0')+'-not-a-real-secret';
function vBody(){const l=vList();
  return l.length?`<div class="table-wrap"><table class="tbl set-tbl"><thead><tr><th>Name</th><th>Secret</th><th>Bots that may use it</th><th>Last used</th><th>Health</th><th aria-label="Actions"></th></tr></thead><tbody>${l.map(v=>`<tr><td><div class="row">${I(VTYPE[v.type]||'key',15)}<div class="col" style="gap:0"><b style="font-weight:500">${E(v.name)}</b><span class="t-xs t-mute">${E(v.type)}</span></div></div></td><td><span class="set-secret${revealId===v.id?' show':''}" data-secret="${v.id}">${revealId===v.id?fakeSecret(v):'••••••••••'}</span></td><td class="t-2">${v.bots.length?v.bots.map(b=>E(botName(b))).join(', '):'<span class="t-mute">No bots</span>'}</td><td class="t-mute" style="white-space:nowrap">${E(v.last)}</td><td>${vHealth(v)}</td>
    <td><div class="set-acts"><button class="icon-btn sm" data-a="v-reveal" data-id="${v.id}" aria-label="Reveal ${E(v.name)}">${I('eye',14)}</button><button class="icon-btn sm" data-a="v-copy" data-id="${v.id}" aria-label="Copy ${E(v.name)}">${I('copy',14)}</button><button class="icon-btn sm" data-a="v-rotate" data-id="${v.id}" aria-label="Rotate ${E(v.name)}">${I('refresh',14)}</button><button class="icon-btn sm" data-a="v-share" data-id="${v.id}" aria-label="Share ${E(v.name)} with a bot">${I('users',14)}</button><button class="icon-btn sm" data-a="v-rm" data-id="${v.id}" aria-label="Remove ${E(v.name)}">${I('trash',14)}</button></div></td></tr>`).join('')}</tbody></table></div><div class="set-item t-xs t-mute">${l.length} of ${V.length} items</div>`
  :empty('key','No items match.','Try a different search or clear the filters.')+`<div class="row" style="justify-content:center;padding-bottom:24px"><button class="btn btn-sm" data-a="v-clear">Clear filters</button></div>`}
function vault(){
  const stat=(id,n,t,d)=>`<button class="card set-stat" data-a="v-filter" data-id="${id}" aria-pressed="${vFilter===id}"><span class="v">${n}</span><span style="font-weight:500">${t}</span><span class="t-xs t-mute">${d}</span></button>`;
  return head('Vault','Claude Vault','Logins, keys, cards and certificates that bots can use but never read.',`<button class="btn" data-a="v-import">${I('download',14)}Import</button><button class="btn btn-primary" data-a="v-add">${I('plus',14)}Add item</button>`)
  +`<div class="grid-3">${stat('due',V.filter(vDue).length,'Due for rotation','In the next 14 days, or overdue')}${stat('unused',V.filter(vUnused).length,'Unused for 90 days','Safe to remove in most cases')}${stat('shared',V.filter(vShared).length,'Shared with more than one bot','Consider one key per bot')}</div>`
  +sec('Items',vFilter==='all'?'Everything stored for '+E(D.company.name):'Filtered by the health summary above',vFilter!=='all'?`<button class="btn btn-sm" data-a="v-filter" data-id="all">Show all items</button>`:'',`<div class="set-tools"><label class="search">${I('search',15)}<input data-i="v-q" placeholder="Search by name, type or bot" aria-label="Search vault items" value="${E(vQ)}"></label><select class="select" data-c="v-type" aria-label="Filter by type">${opts([['all','All types'],'Login','API key','Card','Certificate'],vType)}</select></div><div id="set-vault">${vBody()}</div>`)
  +sec('Usage log','Which bot used which item, and when','',`<div class="set-item" style="align-items:flex-start"><span class="set-ico">${I('lock')}</span><div class="col" style="gap:2px"><b style="font-weight:500">The model never sees the secret</b><span class="t-sm t-2">When a bot needs to sign in or pay, the vault places the value straight into the form or request, and the bot only hears back whether it worked.</span></div></div>
    <div class="table-wrap"><table class="tbl set-tbl"><thead><tr><th>When</th><th>Bot</th><th>Item</th><th>Used at</th><th>Result</th></tr></thead><tbody>${VUSE.map(u=>`<tr><td class="t-mute" style="white-space:nowrap">${E(u[0])}</td><td style="white-space:nowrap">${E(botName(u[1]))}</td><td>${E(u[2])}</td><td>${E(u[3])}</td><td>${pill(u[4],u[4].indexOf('Blocked')===0?'bad':'ok')}</td></tr>`).join('')}</tbody></table></div>`);
}
function vAddModal(){
  const fields=t=>t==='Login'?`<div class="grid-2">${field('Username','set-v-a',`<input class="input" id="set-v-a" autocomplete="off" placeholder="name@larkfield.example">`)}${field('Password','set-v-b',`<input class="input t-mono" id="set-v-b" type="password" autocomplete="off" placeholder="Made-up value">`)}</div>${field('Sign-in page','set-v-c',`<input class="input" id="set-v-c" placeholder="portal.vendor.example">`)}`
    :t==='API key'?`${field('Key','set-v-a',`<input class="input t-mono" id="set-v-a" type="password" autocomplete="off" placeholder="Made-up value">`)}${field('Rotate every','set-v-b',`<select class="select" id="set-v-b">${opts(['30 days','90 days','180 days'],'90 days')}</select>`)}`
    :t==='Card'?`<div class="grid-2">${field('Card number','set-v-a',`<input class="input t-mono" id="set-v-a" autocomplete="off" placeholder="0000 0000 0000 0000">`,'Only the last four digits are shown later.')}${field('Expiry','set-v-b',`<input class="input t-mono" id="set-v-b" placeholder="MM/YY">`)}</div>`
    :`${field('Certificate','set-v-a',`<textarea class="textarea t-mono" id="set-v-a" rows="3" placeholder="Paste a made-up certificate"></textarea>`)}${field('Expires in','set-v-b',`<select class="select" id="set-v-b">${opts(['90 days','1 year','2 years'],'1 year')}</select>`)}`;
  const m=CW.modal({title:'Add item',body:`${fakeNote}<div class="grid-2">${field('Type','set-v-type',`<select class="select" id="set-v-type">${opts(['Login','API key','Card','Certificate'],'Login')}</select>`)}${field('Name','set-v-name',`<input class="input" id="set-v-name" placeholder="For example: Vendor portal login">`)}</div><div id="set-v-fields" class="col" style="gap:14px">${fields('Login')}</div>
    <div class="col"><span class="t-label">Bots that may use it</span><div class="set-checks">${D.bots.map(b=>`<label><input type="checkbox" value="${b.id}">${E(b.name)}</label>`).join('')}</div></div>`,
    foot:`<button class="btn" data-close>Cancel</button><button class="btn btn-primary" id="set-v-ok">Add to vault</button>`});
  const ty=$('#set-v-type',m);ty.addEventListener('change',()=>{$('#set-v-fields',m).innerHTML=fields(ty.value)});
  $('#set-v-ok',m).addEventListener('click',()=>{const name=$('#set-v-name',m).value.trim(),t=ty.value;if(!name){CW.toast('Give the item a name.');$('#set-v-name',m).focus();return}
    const bots=$$('.set-checks input:checked',m).map(x=>x.value),b=$('#set-v-b',m),bv=b?b.value:'';
    const v={id:'v-'+(++vN),name,type:t,bots,last:'Never',idle:0,rot:t==='API key'?parseInt(bv,10)||90:t==='Certificate'?(bv==='90 days'?90:bv==='2 years'?730:365):null};
    if(t==='Login')v.strength='Strong';if(t==='Card')v.exp=bv?'Expires '+bv:'No expiry';
    V.unshift(v);log('Vault','Added "'+name+'" to the vault',t+'. '+(bots.length?'May be used by '+bots.map(botName).join(', ')+'.':'No bots may use it yet.'));CW.closeModal();draw();CW.toast('"'+name+'" added to the vault.')});
}
function reveal(v){
  confirmM('Reveal this secret',`You are about to show <b>${E(v.name)}</b> on screen for five seconds. This is recorded in the audit log, and the bot owners can see that you looked.`,'Reveal for 5 seconds',()=>{
    clearTimeout(revealT);revealId=v.id;log('Vault','Revealed "'+v.name+'" on screen','Shown for five seconds on this device.');draw();
    revealT=setTimeout(()=>{revealId=null;const el=$('[data-secret="'+v.id+'"]');if(el){el.textContent='••••••••••';el.classList.remove('show')}},5000)});
}

/* ---------- 5. Policies and limits ---------- */
function policies(){
  const on=RULES.filter(r=>r.on).length;
  return head('Policies and limits','','The rules every bot follows. A bot stops and asks when it reaches one.',`<button class="btn btn-primary" data-a="rule-add">${I('plus',14)}Add rule</button>`)
  +`<div class="grid-3"><div class="card set-stat"><span class="v">${on}</span><span style="font-weight:500">Rules switched on</span><span class="t-xs t-mute">${RULES.length-on} switched off</span></div><div class="card set-stat"><span class="v">${CW.pending().length}</span><span style="font-weight:500">Bots waiting at a rule</span><span class="t-xs t-mute">Shown under the bell</span></div><div class="card set-stat"><span class="v">${RULES.filter(r=>r.on&&!r.asks).length}</span><span style="font-weight:500">Things no bot may do</span><span class="t-xs t-mute">Blocked, with no way to ask</span></div></div>`
  +GROUPS.map(g=>{const l=RULES.filter(r=>r.group===g);return sec(E(g),l.length+' rule'+(l.length===1?'':'s'),`<button class="btn btn-sm btn-ghost" data-a="rule-add" data-id="${E(g)}" aria-label="Add rule to ${E(g)}">${I('plus',13)}Add</button>`,l.length?l.map(r=>`<div class="set-rule${r.on?'':' off'}"><div class="col" style="gap:6px;min-width:0"><div class="row"><b style="font-weight:500">${E(r.name)}</b>${r.on?'':pill('Off')}</div><p class="set-prev">${preview(r)}</p><div class="set-meta"><span>Applies to <b>${E(r.who)}</b></span><span>Limit <b>${r.asks?(r.limit?E(r.limit):'Always ask'):'Never allowed'}</b></span><span>Above the limit <b>${r.asks?'Ask '+E(r.asks):'Blocked'}</b></span></div></div>
    <div class="row"><button class="btn btn-sm" data-a="rule-edit" data-id="${r.id}" aria-label="Edit rule: ${E(r.name)}">Edit</button><input type="checkbox" class="switch" role="switch" data-c="rule-on" data-id="${r.id}" aria-label="${E(r.name)} on or off" ${r.on?'checked':''}></div></div>`).join(''):empty('sliders','No rules in this group.','Bots act freely here until you add one.'))}).join('');
}
function ruleModal(id,group){
  const ex=RULES.find(r=>r.id===id),r=ex?Object.assign({},ex):{group:group||GROUPS[0],name:'',who:'All bots',action:'',limit:'',asks:'the bot owner'};
  const whoList=['All bots','All spending bots'].concat(D.bots.map(b=>b.name));if(whoList.indexOf(r.who)<0)whoList.push(r.who);
  const m=CW.modal({title:ex?'Edit rule':'Add rule',body:`<div class="grid-2">${field('Group','set-r-group',`<select class="select" id="set-r-group">${opts(GROUPS,r.group)}</select>`)}${field('Applies to','set-r-who',`<select class="select" id="set-r-who">${opts(whoList,r.who)}</select>`)}</div>
    ${field('Short name','set-r-name',`<input class="input" id="set-r-name" value="${E(r.name)}" placeholder="For example: Refunds">`)}
    ${field('What the bot does','set-r-action',`<input class="input" id="set-r-action" value="${E(r.action)}" placeholder="For example: give refunds">`,'Finish the sentence "The bot may ...".')}
    <div class="grid-2">${field('Limit','set-r-limit',`<input class="input" id="set-r-limit" value="${E(r.limit)}" placeholder="For example: $200.00">`,'Leave empty to ask every time.')}${field('Above the limit, ask','set-r-asks',`<input class="input" id="set-r-asks" value="${E(r.asks)}" placeholder="For example: the bot owner">`,'Leave empty to block it completely.')}</div>
    <div class="card" style="background:var(--bg-sunk)"><span class="t-label">In plain words</span><p class="set-prev" id="set-r-prev" style="margin-top:4px"></p></div>`,
    foot:`${ex?`<button class="btn btn-danger" id="set-r-del" style="margin-right:auto">Delete rule</button>`:''}<button class="btn" data-close>Cancel</button><button class="btn btn-primary" id="set-r-ok">${ex?'Save rule':'Add rule'}</button>`});
  const read=()=>{['group','who','name','action','limit','asks'].forEach(k=>{r[k]=$('#set-r-'+k,m).value.trim()});$('#set-r-prev',m).innerHTML=r.action?preview(r):'<span class="t-mute">Describe what the bot does to see the rule in plain words.</span>'};
  m.addEventListener('input',read);m.addEventListener('change',read);read();
  $('#set-r-ok',m).addEventListener('click',()=>{read();if(!r.action){CW.toast('Describe what the bot does.');$('#set-r-action',m).focus();return}if(!r.name)r.name=r.action.charAt(0).toUpperCase()+r.action.slice(1);
    if(ex){Object.assign(ex,r);if(ex.key&&r.limit){const b=CW.bot(ex.key),c=W.cards.find(x=>x.bot===ex.key);if(b){b.limit=num(r.limit);ex.limit=CW.money(b.limit);if(c)c.limit=b.limit}}}
    else RULES.push(Object.assign({id:'r-'+(++ruleN),on:true,key:''},r));
    log('Bots',(ex?'Changed':'Added')+' the rule "'+r.name+'"',$('#set-r-prev',m).textContent);CW.closeModal();draw();CW.toast(ex?'Rule saved.':'Rule added. It applies from now on.')});
  const del=$('#set-r-del',m);if(del)del.addEventListener('click',()=>confirmM('Delete rule',`Delete the rule "${E(ex.name)}"? ${E(ex.who)} will no longer be limited by it.`,'Delete rule',()=>{RULES.splice(RULES.indexOf(ex),1);log('Bots','Deleted the rule "'+ex.name+'"','');draw();CW.toast('Rule deleted.')},true));
}

/* ---------- 6. Audit log ---------- */
function aList(){const q=aQ.trim().toLowerCase();return sessionLog.concat(AUDIT).filter(a=>(aBot==='all'||(aBot==='me'?!a.bot:a.bot===aBot))&&(aLayer==='all'||a.layer===aLayer)&&(!aNeeded||a.needed)&&(!q||(a.what+' '+(botName(a.bot)||D.me.name)+' '+a.layer+' '+a.by+' '+a.detail).toLowerCase().includes(q)))}
function aBody(){const l=aList();if(!l.length)return empty('list','No entries match.','Try a different search or clear the filters.')+`<div class="row" style="justify-content:center;padding-bottom:24px"><button class="btn btn-sm" data-a="a-clear">Clear filters</button></div>`;
  let day=-1,h='';
  l.forEach(a=>{if(a.day!==day){day=a.day;h+=`<div class="set-day t-label">${day===0?'Today':'Yesterday'} · ${dayStr(day)}</div>`}
    const open=!!aOpen[a.id];
    h+=`<button class="list-row" data-a="a-open" data-id="${a.id}" aria-expanded="${open}"><time>${a.time}</time><span class="pill set-layer ${LCLS[a.layer]||''}">${a.layer}</span><span class="set-who truncate">${E(botName(a.bot)||D.me.name)}</span><span class="grow">${E(a.what)}</span>${a.by?pill(a.by,a.by.indexOf('Declined')===0?'bad':a.by.indexOf('Approved')===0?'ok':''):a.needed?pill('Waiting for approval','warn'):''}${I(open?'chevron-down':'chevron-right',14)}</button>`
      +(open?`<div class="set-detail"><dl class="set-kv"><dt>What happened</dt><dd>${E(a.detail||'No further details.')}</dd><dt>Who</dt><dd>${a.bot?`${E(botName(a.bot))} <span class="t-mono t-xs t-mute">${a.bot}@larkfield.example</span>`:E(D.me.name)}</dd><dt>Layer</dt><dd>${({Auth:'Claude Auth',Vault:'Claude Vault',Browser:'Claude Browser',Pay:'Claude Pay',Mail:'Mail',Bots:'Bots'})[a.layer]}</dd><dt>Approval</dt><dd>${a.by?E(a.by):a.needed?'Needed, not given yet':'Not needed'}</dd><dt>Entry</dt><dd class="t-mono t-xs">${dayStr(a.day,1)} ${a.time} · ${a.id}</dd></dl></div>`:'')});
  return h+`<div class="set-item t-xs t-mute">${l.length} of ${sessionLog.length+AUDIT.length} entries. Entries cannot be edited or deleted.</div>`}
function audit(){
  return head('Audit log','','Everything bots and people did, in order, with who allowed it.',`<button class="btn" data-a="a-export">${I('download',14)}Export</button>`)
  +`<section class="card flush"><div class="set-tools"><label class="search">${I('search',15)}<input data-i="a-q" placeholder="Search what happened" aria-label="Search the audit log" value="${E(aQ)}"></label><select class="select" data-c="a-bot" aria-label="Filter by bot">${opts([['all','All bots and people']].concat(D.bots.map(b=>[b.id,b.name]),[['me',D.me.name]]),aBot)}</select></div>
  <div class="set-tools" role="group" aria-label="Filter by layer"><button class="set-chip" data-a="a-layer" data-id="all" aria-pressed="${aLayer==='all'}">All layers</button>${LAYERS.map(l=>`<button class="set-chip" data-a="a-layer" data-id="${l}" aria-pressed="${aLayer===l}">${l}</button>`).join('')}<span class="grow"></span><button class="set-chip" data-a="a-needed" aria-pressed="${aNeeded}">${I('check',12)} Needed approval</button></div>
  <div class="set-tl" id="set-audit">${aBody()}</div></section>`;
}

/* ---------- actions ---------- */
const part=(id,fn)=>{const el=document.getElementById(id);if(el)el.innerHTML=fn()};
const ACT={
  nav:(el,id)=>CW.go('settings',id),
  soon,
  'g-save':()=>{D.me.name=G.name||D.me.name;D.me.role=G.role||D.me.role;D.me.email=G.email||D.me.email;draw();CW.toast('Profile saved.')},
  theme:(el,id)=>{if(id!==theme()){const t=document.getElementById('theme');if(t)t.click()}},
  funds:()=>fundsModal(1),
  withdraw:withdrawModal,
  'pm-add':pmModal,
  'pm-def':(el,id)=>{W.methods.forEach(p=>{p.def=p.id===id});const p=W.methods.find(x=>x.def);draw();CW.toast(p.name+' ending '+p.last4+' is now the default.')},
  'pm-rm':(el,id)=>{const p=W.methods.find(x=>x.id===id);if(!p)return;if(p.def&&W.methods.length>1){CW.toast('Choose another default before removing this one.');return}
    confirmM('Remove payment method',`Remove ${E(p.name)} ending ${p.last4}? ${p.def?'Auto top-up will stop until you add another method.':'It can be added again later.'}`,'Remove',()=>{W.methods.splice(W.methods.indexOf(p),1);if(!W.methods.length)W.auto.on=false;log('Pay','Removed the payment method ending '+p.last4,p.name+'.');draw();CW.toast('Payment method removed.')},true)},
  'bud-edit':(el,id)=>budgetModal(id),
  'vc-issue':issueModal,
  'vc-freeze':(el,id)=>{const c=W.cards.find(x=>x.id===id);if(!c)return;c.frozen=!c.frozen;log('Pay',(c.frozen?'Froze':'Unfroze')+' the virtual card ending '+c.last4,c.frozen?'Payments with this card are declined until it is unfrozen.':'The card can be used again.',c.bot);draw();CW.toast(c.frozen?'Card ending '+c.last4+' is frozen. '+botName(c.bot)+' cannot pay with it.':'Card ending '+c.last4+' is active again.')},
  'vc-close':(el,id)=>{const c=W.cards.find(x=>x.id===id);if(!c)return;confirmM('Close card',`Close the card ending ${c.last4} for good? ${E(botName(c.bot))} will not be able to pay until a new card is issued. To pause it for a while, freeze it.`,'Close card',()=>{W.cards.splice(W.cards.indexOf(c),1);log('Pay','Closed the virtual card ending '+c.last4,'',c.bot);draw();CW.toast('Card ending '+c.last4+' closed.')},true)},
  'tx-open':(el,id)=>receiptModal(id),
  'tx-clear':()=>{txQ='';txStatus='all';txBot='all';draw()},
  'tx-export':()=>CW.toast('Export is not part of this concept. '+txList().length+' transactions would be saved as a file.'),
  'sub-seats':(el,id)=>seatsModal(id),
  'sub-cancel':(el,id)=>{const s=W.subs.find(x=>x.id===id);if(!s)return;
    if(s.cancel){s.cancel=false;draw();CW.toast(s.vendor+' will renew as usual.');return}
    confirmM('Cancel at renewal',`${E(s.vendor)} stays active until ${E(s.renew)} and then ends. ${E(botName(s.bot))} will not renew it, and will tell the ${s.seats?s.used+' people using it':'team'} a week before.`,'Cancel at renewal',()=>{s.cancel=true;log('Pay','Set '+s.vendor+' to cancel at renewal','Ends '+s.renew+'. Saves '+CW.money(s.yearly)+' a year.',s.bot);draw();CW.toast(s.vendor+' will end on '+s.renew+'.')},true)},
  'st-dl':(el,id)=>CW.toast('Downloads are not part of this concept. The '+W.statements[+id].name+' statement would be saved as a file.'),
  consent:(el,id)=>{const c=CONSENT;c.status=id==='allow'?'allowed':'denied';
    if(id==='allow')APPS.unshift({id:'app-'+(++txN),name:c.app,kind:c.kind,who:c.bot,scopes:c.scopes.slice(),last:'Never',can:c.asks.slice(),cannot:c.not.slice()});
    log('Auth',(id==='allow'?'Allowed ':'Denied ')+c.app+' for '+botName(c.bot),'Scopes asked for: '+c.scopes.join(', ')+'.',c.bot,(id==='allow'?'Approved by ':'Declined by ')+D.me.name,true);draw();
    CW.toast(id==='allow'?botName(c.bot)+' can now sign in to '+c.app+'.':'Request denied. '+botName(c.bot)+' has been told.')},
  'app-open':(el,id)=>appModal(id),
  'app-revoke':(el,id)=>revokeApp(id),
  'bot-susp':(el,id)=>{const b=CW.bot(id);if(!b)return;
    if(suspended[id]!==undefined){b.status=suspended[id];delete suspended[id];b.suspended=false;log('Auth','Resumed the identity of '+b.name,'It can sign in again with the same scopes.',id);draw();CW.toast(b.name+' is active again.');return}
    confirmM('Suspend '+b.name,`${E(b.name)} will be signed out of every app and will stop working until you resume it. Its tasks and history are kept.`,'Suspend',()=>{suspended[id]=b.status;b.status='idle';b.suspended=true;log('Auth','Suspended the identity of '+b.name,'Signed out of '+APPS.filter(a=>a.who===id).length+' apps.',id);draw();CW.toast(b.name+' is suspended.')},true)},
  invite:()=>CW.toast('Inviting people is not part of this concept yet.'),
  role:(el,id)=>{const p=PEOPLE[+id];CW.menu(el,ROLES.map(r=>({label:r,icon:r===p.role?'check':'user',hint:{Admin:'All settings',Approver:'Can approve',"Bot owner":'Owns bots',Member:'Can ask bots'}[r],onClick:()=>{if(r===p.role)return;p.role=r;log('Auth','Changed the role of '+p.name+' to '+r,'');draw();CW.toast(p.name+' is now '+(r==='Admin'||r==='Approver'?'an ':'a ')+r.toLowerCase()+'.')}})))},
  'sess-out':(el,id)=>{const s=SESSIONS.find(x=>x.id===id);if(!s)return;SESSIONS.splice(SESSIONS.indexOf(s),1);log('Auth','Signed out the session on '+s.device,s.app+', '+s.where+'.');draw();CW.toast('Signed out of '+s.device+'.')},
  passkey:()=>CW.toast('Adding a passkey is not part of this concept. Your device would ask for a fingerprint or PIN here.'),
  'v-filter':(el,id)=>{vFilter=vFilter===id?'all':id;draw()},
  'v-clear':()=>{vQ='';vType='all';vFilter='all';draw()},
  'v-import':()=>CW.toast('Import is not part of this concept. It would read an export from another password manager.'),
  'v-add':vAddModal,
  'v-reveal':(el,id)=>{const v=V.find(x=>x.id===id);if(v)reveal(v)},
  'v-copy':(el,id)=>{const v=V.find(x=>x.id===id);if(v)CW.toast('Copied a placeholder for "'+v.name+'". No real secret exists in this concept.')},
  'v-rotate':(el,id)=>{const v=V.find(x=>x.id===id);if(!v)return;
    confirmM('Rotate '+v.name,v.type==='Card'?`The vault will replace this card number with a new one. Bots keep working and vendors are updated on the next payment.`:`The vault will create a new value, update it at the app and retire the old one. ${v.bots.length?E(v.bots.map(botName).join(', '))+' will use the new value from the next request.':'No bots use this item.'}`,'Rotate now',()=>{if(v.type==='Login')v.strength='Strong';else if(v.type!=='Card')v.rot=v.type==='Certificate'?365:90;log('Vault','Rotated "'+v.name+'"','A new value was created inside the vault. Nobody saw it.');draw();CW.toast('"'+v.name+'" rotated.')})},
  'v-share':(el,id)=>{const v=V.find(x=>x.id===id);if(!v)return;CW.menu(el,D.bots.map(b=>{const has=v.bots.indexOf(b.id)>=0;return {label:b.name,icon:has?'check':'bot',hint:has?'Has access':'',onClick:()=>{if(has)v.bots.splice(v.bots.indexOf(b.id),1);else v.bots.push(b.id);log('Vault',(has?'Stopped sharing "':'Shared "')+v.name+'" with '+b.name,'',b.id);draw();CW.toast(has?b.name+' can no longer use "'+v.name+'".':b.name+' may now use "'+v.name+'".')}}}))},
  'v-rm':(el,id)=>{const v=V.find(x=>x.id===id);if(!v)return;confirmM('Remove from vault',`Remove <b>${E(v.name)}</b>? ${v.bots.length?E(v.bots.map(botName).join(', '))+' will stop and ask the next time '+(v.bots.length>1?'they need':'it needs')+' it.':'No bots use it.'} This cannot be undone.`,'Remove',()=>{V.splice(V.indexOf(v),1);log('Vault','Removed "'+v.name+'" from the vault','');draw();CW.toast('"'+v.name+'" removed.')},true)},
  'rule-add':(el,id)=>ruleModal(null,id),
  'rule-edit':(el,id)=>ruleModal(id),
  'a-open':(el,id)=>{aOpen[id]=!aOpen[id];part('set-audit',aBody);const b=$('[data-a="a-open"][data-id="'+id+'"]');if(b)b.focus({preventScroll:true})},
  'a-layer':(el,id)=>{aLayer=id;draw()},
  'a-needed':()=>{aNeeded=!aNeeded;draw()},
  'a-clear':()=>{aQ='';aBot='all';aLayer='all';aNeeded=false;draw()},
  'a-export':()=>CW.toast('Export is not part of this concept. '+aList().length+' entries would be saved as a file.')
};
const CHG={
  g:(el,id)=>{G[id]=el.value.trim();if(id==='lang'||id==='zone')CW.toast((id==='lang'?'Language':'Time zone')+' set to '+el.value+'.')},
  notif:(el,id)=>{G.notif[id]=el.checked;CW.toast(el.getAttribute('aria-label')+(el.checked?' is on.':' is off.'))},
  'auto-on':el=>{if(el.checked&&!W.methods.length){CW.toast('Add a payment method first.');el.checked=false;return}W.auto.on=el.checked;log('Pay','Turned auto top-up '+(W.auto.on?'on':'off'),W.auto.on?'Below '+CW.money(W.auto.below)+', top up to '+CW.money(W.auto.to)+'.':'');draw();CW.toast('Auto top-up is '+(W.auto.on?'on.':'off.'))},
  auto:(el,id)=>{const v=num(el.value),o=id==='below'?W.auto.to:W.auto.below;
    if(v<=0||(id==='below'&&v>=o)||(id==='to'&&v<=o)){CW.toast('"Top up to" must be higher than "when balance falls below".');el.value=CW.money(W.auto[id]);return}
    W.auto[id]=v;el.value=CW.money(v);CW.toast('Auto top-up saved.')},
  'tx-bot':el=>{txBot=el.value;part('set-tx',txBody)},
  'tx-status':el=>{txStatus=el.value;part('set-tx',txBody)},
  'v-type':el=>{vType=el.value;part('set-vault',vBody)},
  'rule-on':(el,id)=>{const r=RULES.find(x=>x.id===id);if(!r)return;r.on=el.checked;log('Bots','Turned the rule "'+r.name+'" '+(r.on?'on':'off'),r.on?'':'Bots are no longer limited by this rule.');draw();CW.toast('"'+r.name+'" is '+(r.on?'on.':'off. Bots are no longer limited by it.'))},
  'a-bot':el=>{aBot=el.value;part('set-audit',aBody)}
};
const INP={'tx-q':el=>{txQ=el.value;part('set-tx',txBody)},'v-q':el=>{vQ=el.value;part('set-vault',vBody)},'a-q':el=>{aQ=el.value;part('set-audit',aBody)}};
const inView=e=>CW.mode==='settings'&&e.target.closest&&e.target.closest('#view');
document.addEventListener('click',e=>{if(!inView(e))return;const el=e.target.closest('[data-a]');if(!el)return;
  if(el.tagName==='TR'&&e.target.closest('button,input,select,a'))return;
  const f=ACT[el.dataset.a];if(f)f(el,el.dataset.id,e);else soon()});
document.addEventListener('change',e=>{if(!inView(e))return;const el=e.target.closest('[data-c]');if(el&&CHG[el.dataset.c])CHG[el.dataset.c](el,el.dataset.id)});
document.addEventListener('input',e=>{if(!inView(e))return;const el=e.target.closest('[data-i]');if(el&&INP[el.dataset.i])INP[el.dataset.i](el)});

CW.register('settings',{render});
CW.on('approvals',a=>{
  if(a&&a.status!=='pending'){const ok=a.status==='approved';
    log(a.id==='ap-laptop'?'Pay':'Bots',(ok?'Approved: ':'Declined: ')+a.title,a.reason+'. Asked by '+a.asker+'. '+(ok?'Next: '+a.after:'The bot was told and has stopped.'),a.bot,(ok?'Approved by ':'Declined by ')+D.me.name,true)}
  syncLaptop();if(CW.mode==='settings')draw()});
CW.on('theme',()=>{if(CW.mode==='settings'&&cur==='general')draw()});
})();
