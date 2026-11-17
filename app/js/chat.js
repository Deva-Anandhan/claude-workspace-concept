/* Chat mode: home composer, conversations, chat history, projects and artifacts. Also the reference for how a view is written. */
(function(){
const CW=window.CW,D=CW.data,I=CW.icon,E=CW.esc;
CW.css('chat',`
.chat-home{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:24px;padding:32px 24px;max-width:760px;width:100%;margin:0 auto}
.chat-home .composer{width:100%}
.chat-chips{display:flex;gap:8px;flex-wrap:wrap;justify-content:center}
.chat-stats{width:100%}
.chat-stat .v{font-family:var(--serif);font-size:26px;line-height:1.2}
.chat-new{color:var(--accent-strong);font-weight:500}
.chat-new i{width:22px;height:22px;border-radius:50%;background:var(--accent);color:var(--on-accent);display:grid;place-items:center}
.chat-foot{position:sticky;bottom:0;background:linear-gradient(transparent,var(--bg) 28%);padding:20px 24px 20px}
.chat-foot .composer{max-width:740px;margin:0 auto}
.chat-head{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 20px;border-bottom:1px solid var(--line);position:sticky;top:0;background:var(--bg);z-index:2}
.chat-list{display:flex;flex-direction:column}
.chat-item{display:flex;gap:12px;align-items:flex-start;width:100%;text-align:left;border:0;border-bottom:1px solid var(--line);background:none;padding:14px 10px;border-radius:0}
.chat-item:hover{background:var(--bg-hover);border-radius:var(--r-md)}
.chat-cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px}
.chat-card{display:flex;flex-direction:column;gap:8px;text-align:left;background:var(--bg-raised);border:1px solid var(--line);border-radius:var(--r-lg);padding:16px;min-height:132px}
.chat-card:hover{border-color:var(--line-strong);box-shadow:var(--shadow-2)}
.chat-thumb{height:132px;border-radius:var(--r-md);background:var(--bg-sunk);border:1px solid var(--line);padding:14px;display:flex;flex-direction:column;gap:7px;overflow:hidden}
.chat-thumb i{display:block;height:7px;border-radius:4px;background:var(--line-strong)}
.chat-thumb .bars{display:flex;align-items:flex-end;gap:8px;flex:1}
.chat-thumb .bars i{flex:1;height:auto;border-radius:4px 4px 0 0;background:var(--accent)}
.chat-thumb .cells{display:grid;grid-template-columns:repeat(5,1fr);gap:4px;flex:1}
.chat-thumb .cells i{height:auto;border-radius:2px}
.chat-thumb .slide{flex:1;border-radius:6px;background:var(--bg-raised);border:1px solid var(--line);padding:12px;display:flex;flex-direction:column;gap:6px;justify-content:center}
.chat-proj{display:grid;grid-template-columns:minmax(0,1fr) 320px;gap:24px;align-items:start}
@media (max-width:1000px){.chat-proj{grid-template-columns:minmax(0,1fr)}}
`);
const THREADS={
 halden:{title:'Halden Dental contract tier',bot:'RevOps bot',who:'Priya Nair · Sales',when:'10:48',snip:'The contract was generated at the Starter price.'},
 deck:{title:'Q3 pipeline review deck',bot:'Analyst bot',who:'Dana Whitlock · VP Sales',when:'09:52',ask:'I need the Q3 pipeline review deck for Thursday.',
  open:'I pulled the open pipeline and built the review deck. Three things are worth a look before Thursday.',
  tools:[['shield','Claude Auth · signed in as Analyst bot','CRM, read only','Identity: analyst-bot@larkfield.example\nScopes: pipeline:read, slides:write'],['list','Read 412 open deals','Q3, all regions','Stage, amount, owner, close date, last activity'],['layers','Built 12 slides in Claude Slides','18 min','1 Summary\n2 Pipeline by stage\n3 Coverage by region\n4 Slipped deals\n5 to 12 Region detail']],
  close:'The deck is ready. Check slide 4: two enterprise deals have stalled for more than 30 days, week 9 shows a dip in new pipeline, and one region is missing owner data on 11 deals.',file:['Q3 pipeline review','Slides · 12 slides']},
 renew:{title:'Analytics renewal',bot:'Procurement bot',who:'Marcus Bell · Finance',when:'09:12',ask:'Our analytics subscription renews Friday. Renew it, and drop the seats nobody uses.',
  open:'I checked usage first. Fifteen of the 60 seats have not signed in for 90 days, so I renewed for 45.',
  tools:[['globe','Claude Browser · opened the vendor billing page','Corvin Analytics','Seats: 60\nActive in the last 90 days: 45'],['key','Claude Vault · used 1 key','not shown to the model','corvin-admin-login ········'],['wallet','Claude Pay · paid $4,050.00','inside the renewal limit','Rule: renewals up to $5,000.00 need no approval when the price does not rise\nLast year: $5,400.00']],
  close:'Renewed for $4,050.00 with 45 seats. That is $1,350.00 less than last year, and the receipt is in the wallet.',file:['Receipt CA-2026-1104','PDF · $4,050.00']},
 jo:{title:'Set up Jo for Monday',bot:'IT bot',who:'Lena Fischer · People team',when:'10:26',ask:'Jo starts Monday as a support agent. Set them up.',
  open:'Accounts, access and the first-week calendar are done. The laptop needs your approval because it is above my purchase limit.',
  tools:[['shield','Claude Auth · created an identity for Jo','role: Support agent','6 work apps assigned from the role template'],['mail','Claude Mail · sent a welcome note','first-week plan attached','To: Jo Brandt\nCc: Lena Fischer']],
  close:'Everything except the laptop is ready. Approve the $1,400.00 purchase from the bell and it will arrive on Friday.'},
 csv:{title:'CSV export on invoices',bot:'Builder bot',who:'Sam Okafor · Product',when:'11:02',ask:'Customers keep asking for CSV export on the invoices page.',
  open:'Planner bot wrote the spec, I built it on a branch, and QA bot ran it on staging.',
  tools:[['file','Wrote the spec','1 page','Export the current filter as CSV\nColumns match the table\nLimit: 10,000 rows'],['terminal','Ran 38 tests','38 passing','invoices.export.spec ········ ok'],['globe','Claude Browser · checked the export on staging','412 rows','Downloaded invoices.csv and compared it with the table']],
  close:'It works on staging and every test passes. Releasing to production needs your approval; it is waiting in the bell.'},
 notes:{title:'Notes from the pricing review',bot:'Claude',who:'You',when:'Yesterday',ask:'Turn my notes from the pricing review into decisions, open questions and owners.',
  open:'Here is the review organised into what was decided, what is still open, and who owns each item.',tools:[],
  close:'Decided: the Growth tier keeps its price, and discounts above 10% need a manager. Open: annual prepay terms and a floor for multi-year deals. Owners: Dana for prepay, Marcus for the floor. I saved this as a document.',file:['Pricing review decisions','Document · 1 page']}
};
const RECENTS=['halden','deck','renew','jo','csv','notes'];
const OLDER=[['Draft the Q4 territory plan','Analyst bot','Mon'],['Why did churn rise in August?','Analyst bot','Mon'],['Clean up duplicate accounts in the CRM','RevOps bot','Fri'],['Compare three e-signature vendors','Procurement bot','Thu'],['Rewrite the renewal reminder email','Claude','Wed'],['Summarise the board pre-read','Claude','12 Nov'],['Explain our discount policy to a new rep','Claude','10 Nov'],['Forecast headcount for support','Analyst bot','7 Nov']];
let projects=[
 {id:'q3',name:'Q3 pipeline review',desc:'The quarterly review deck, its data pulls and follow-ups.',upd:'Updated today',chats:['deck'],files:['Q3 pipeline review (slides)','Pipeline export, 412 deals','Review agenda'],bots:['Analyst bot'],ins:'Use the fiscal calendar. Round currency to whole dollars in charts.'},
 {id:'pricing',name:'Pricing and packaging 2027',desc:'Tier changes, discount rules and the rollout plan.',upd:'Updated yesterday',chats:['notes'],files:['Pricing review decisions','Tier comparison sheet','Discount policy'],bots:['RevOps bot','Analyst bot'],ins:'Never quote a price that is not in the tier comparison sheet.'},
 {id:'halden',name:'Halden Dental renewal',desc:'Contract correction, seat expansion and the renewal thread.',upd:'Updated today',chats:['halden'],files:['Halden Dental contract, corrected','Signed quote HD-2291'],bots:['RevOps bot'],ins:'Discounts above 10% need the RevOps manager.'},
 {id:'onboard',name:'New hire onboarding',desc:'Accounts, equipment and first-week plans for new starters.',upd:'Updated today',chats:['jo'],files:['Role templates','First-week plan, support'],bots:['IT bot'],ins:'Create accounts from the role template only.'},
 {id:'invoices',name:'Invoices: CSV export',desc:'Spec, build, tests and release notes for the export feature.',upd:'Updated today',chats:['csv'],files:['Spec: CSV export','Test run, 38 passing'],bots:['Planner bot','Builder bot','QA bot'],ins:'A production release always needs approval.'},
 {id:'vendors',name:'Vendor renewals',desc:'Every subscription the company pays for, with seats and dates.',upd:'Updated 2 days ago',chats:['renew'],files:['Subscriptions tracker','Approved vendor list'],bots:['Procurement bot'],ins:'Renew only from the approved vendor list.'}
];
const ARTIFACTS=[
 ['Q3 pipeline review','Slides','Analyst bot','2 hours ago','slide','mine'],['Subscriptions tracker','Sheet','Procurement bot','Today','sheet','mine'],
 ['Pricing review decisions','Document','Claude','Yesterday','doc','mine'],['Pipeline coverage by region','Dashboard','Analyst bot','Today','bars','mine'],
 ['Halden Dental contract, corrected','Document','RevOps bot','Today','doc','mine'],['First-week plan, support','Document','IT bot','Today','doc','mine'],
 ['Spec: CSV export','Document','Planner bot','Yesterday','doc','shared'],['Tier comparison','Sheet','Dana Whitlock','Monday','sheet','shared'],
 ['Support volume by week','Dashboard','Lena Fischer','Friday','bars','shared']];
let draft='',chatQ='',artTab='mine';

function side(sub){
  const cur=k=>sub===k||(k==='projects'&&sub&&sub.indexOf('project-')===0)?'aria-current="page"':'';
  return `<aside class="side"><button class="nav-item chat-new" data-open="">${'<i>'+I('plus',14)+'</i>'}New chat</button>
  <div class="col" style="gap:1px"><button class="nav-item" data-open="chats" ${cur('chats')}>${I('chat')}Chats</button><button class="nav-item" data-open="projects" ${cur('projects')}>${I('folder')}Projects</button><button class="nav-item" data-open="artifacts" ${cur('artifacts')}>${I('layers')}Artifacts</button></div>
  <div class="col" style="gap:1px"><div class="side-label">Recents</div>${RECENTS.map(k=>`<button class="nav-item t-sm" data-open="${k}" ${sub===k?'aria-current="page"':''}><span class="truncate">${E(THREADS[k].title)}</span></button>`).join('')}</div>
  </aside>`;
}
function composer(ph){
  return `<div class="composer"><textarea id="chat-in" rows="2" placeholder="${E(ph)}" aria-label="Message">${E(draft)}</textarea>
  <div class="bar"><div class="row"><button class="icon-btn" aria-label="Attach" data-soon>${I('plus',17)}</button><button class="icon-btn" aria-label="Tools and connected apps" data-soon>${I('sliders',16)}</button></div>
  <div class="row"><button class="btn btn-ghost btn-sm" id="chat-route">Route to: best bot ${I('chevron-down',13)}</button><button class="send" id="chat-send" aria-label="Send">${I('arrow-up',16)}</button></div></div></div>`;
}
function home(){
  const hr=new Date().getHours(),g=hr<12?'Good morning':hr<18?'Good afternoon':'Good evening',p=CW.pending().length,run=D.bots.filter(b=>b.status==='run').length,done=D.bots.reduce((s,b)=>s+b.doneToday,0);
  return `<div class="chat-home"><h1 class="t-display" style="text-align:center">${g}, ${E(D.me.first)}</h1>${composer('Ask for anything. A bot will pick it up.')}
  <div class="chat-chips"><button class="chip" data-fill="The Halden Dental contract has the wrong pricing tier. Can you fix it?">${I('edit',14)}Fix a contract</button><button class="chip" data-go="bots">${I('zap',14)}Automate a workflow</button><button class="chip" data-go="mail">${I('mail',14)}Clear my inbox</button><button class="chip" data-go="browser">${I('globe',14)}Research a vendor</button><button class="chip" data-go="settings" data-sub="wallet">${I('wallet',14)}Check spending</button></div>
  <div class="grid-3 chat-stats"><button class="card chat-stat" style="text-align:left" id="chat-wait"><div class="v">${p}</div><div class="t-mute">waiting for your approval</div></button>
  <button class="card chat-stat" style="text-align:left" data-go="bots"><div class="v">${run}</div><div class="t-mute">bots working now</div></button>
  <button class="card chat-stat" style="text-align:left" data-go="settings" data-sub="audit"><div class="v">${done}</div><div class="t-mute">requests done today</div></button></div></div>`;
}
const tool=(icon,title,meta,body)=>`<details class="tool"><summary>${I(icon,15)}<span class="grow"><b style="font-weight:500">${title}</b></span><span class="t-xs t-mute">${meta}</span>${I('chevron-down',13)}</summary><div class="tool-body">${body}</div></details>`;
function head(t,k){const botId=(D.bots.find(b=>b.name===t.bot)||{}).id;
  return `<div class="chat-head"><div class="row"><span class="avatar bot">${I('bot',15)}</span><div class="col" style="gap:0"><b style="font-weight:500">${E(t.title)}</b><span class="t-xs t-mute">${E(t.bot)} · asked by ${E(t.who.replace(' · ',', '))}</span></div></div><div class="row">${botId?`<button class="btn btn-sm" data-go="bots" data-sub="${botId}">${I('bot',14)}Open bot session</button>`:''}${k==='halden'||k==='renew'?`<button class="btn btn-sm" data-go="browser">${I('globe',14)}View in Browser</button>`:''}</div></div>`}
function halden(){
  const a=D.approvals.find(x=>x.id==='ap-discount'),t=THREADS.halden;let end='';
  if(a.status==='pending')end=`<div class="notice"><div class="row between"><b>Approval needed from you</b><span class="pill warn">Above policy</span></div><div>Matching the price the customer was told needs a 12% discount. Policy allows 10% without approval.</div><div class="t-sm t-mute">If you approve: ${E(a.after)}</div><div class="row wrap"><button class="btn btn-primary" data-ap="approved">Approve</button><button class="btn" data-ap="declined">Decline</button><button class="btn btn-ghost" data-soon>Ask a question first</button></div></div>`;
  else if(a.status==='approved')end=`<div>${tool('check','Approved by '+E(D.me.name),'logged','Approval ap-discount\nPolicy: discounts above 10% need the RevOps manager\nRecorded in the audit log')}${tool('globe','Claude Browser · updated the opportunity and regenerated the contract','6 min in total','Opened deal HD-2291\nSet tier: Growth\nSet discount: 12%\nRegenerated contract v3')}</div>
   <div class="msg-claude">Done. The contract now shows the Growth tier with the approved 12% discount, and I have replied to Priya with the new version.</div><div><span class="file-chip">${I('file',18)}<span><b style="font-weight:500">Halden Dental contract, corrected</b><br><span class="t-mute">Document · attached to the deal</span></span></span></div>`;
  else end=`<div class="msg-claude">Understood. I have left the contract as it was and told Priya that the discount was declined. She can come back with a price inside the 10% policy.</div>`;
  return head(t,'halden')+`<div class="thread grow"><div class="msg-user"><div class="t-xs t-mute">${E(t.who)}</div>The Halden Dental contract has the wrong pricing tier. Can you fix it?</div>
  <div class="msg-claude">I'll take this. I checked the deal against the signed quote: it was sold on the Growth tier, but the contract was generated at the Starter price.</div>
  <div>${tool('shield','Claude Auth · signed in as RevOps bot','CRM, contract tool','Identity: revops-bot@larkfield.example\nRole: Deals and contracts\nScopes: deals:write, contracts:write')}${tool('key','Claude Vault · used 2 keys','not shown to the model','crm-service-key ········ used 10:48\ncontract-tool-key ········ used 10:48')}${tool('globe','Claude Browser · opened the Halden Dental deal','deal HD-2291','Quote: Growth tier, 45 seats\nContract v2: Starter tier price\nDifference: 12% below Growth list price')}</div>
  ${end}</div><div class="chat-foot">${composer('Reply to RevOps bot')}</div>`;
}
function thread(k){const t=THREADS[k];
  return head(t,k)+`<div class="thread grow"><div class="msg-user"><div class="t-xs t-mute">${E(t.who)}</div>${E(t.ask)}</div><div class="msg-claude">${E(t.open)}</div>
  ${t.tools.length?`<div>${t.tools.map(x=>tool(x[0],E(x[1]),E(x[2]),E(x[3]))).join('')}</div>`:''}<div class="msg-claude">${E(t.close)}</div>
  ${t.file?`<div><span class="file-chip">${I('file',18)}<span><b style="font-weight:500">${E(t.file[0])}</b><br><span class="t-mute">${E(t.file[1])}</span></span></span></div>`:''}</div><div class="chat-foot">${composer('Reply to '+t.bot)}</div>`}
function chatsPage(){
  const all=RECENTS.map(k=>[k,THREADS[k].title,THREADS[k].bot,THREADS[k].when,THREADS[k].snip||THREADS[k].close]).concat(OLDER.map(o=>['',o[0],o[1],o[2],'']));
  const q=chatQ.trim().toLowerCase(),list=all.filter(c=>!q||(c[1]+' '+c[2]+' '+c[4]).toLowerCase().includes(q));
  return `<div class="page" style="max-width:820px"><div class="page-head"><h1 class="t-title">Your chat history</h1><button class="btn btn-primary" data-open="">${I('plus',15)}New chat</button></div>
  <div class="search">${I('search',16)}<input id="chat-q" placeholder="Search your chats" aria-label="Search your chats" value="${E(chatQ)}"></div>
  <div class="t-sm t-mute">${q?list.length+' of '+all.length+' chats match':'You have '+all.length+' previous chats with Claude and your bots'}</div>
  <div class="chat-list">${list.length?list.map(c=>`<button class="chat-item" data-open="${c[0]}" ${c[0]?'':'data-old'}><span class="avatar bot">${I(c[2]==='Claude'?'chat':'bot',15)}</span><span class="col grow" style="gap:2px"><b style="font-weight:500">${E(c[1])}</b>${c[4]?`<span class="t-sm t-mute truncate">${E(c[4])}</span>`:''}<span class="t-xs t-mute">${E(c[2])} · ${E(c[3])}</span></span></button>`).join(''):`<div class="empty">${I('search',22)}<div>No chats match "${E(chatQ)}".</div></div>`}</div></div>`;
}
function projectsPage(){
  return `<div class="page"><div class="page-head"><div class="col" style="gap:4px"><h1 class="t-title">Projects</h1><span class="t-mute">Chats, files and bots that belong together, with shared instructions.</span></div><button class="btn btn-primary" id="proj-new">${I('plus',15)}New project</button></div>
  <div class="chat-cards">${projects.map(p=>`<button class="chat-card" data-open="project-${p.id}"><b class="t-h">${E(p.name)}</b><span class="t-sm t-mute grow">${E(p.desc)}</span><span class="row wrap t-xs t-mute"><span class="pill">${p.chats.length} chat${p.chats.length===1?'':'s'}</span><span class="pill">${p.files.length} files</span><span class="pill">${p.bots.length} bot${p.bots.length===1?'':'s'}</span><span style="margin-left:auto">${E(p.upd)}</span></span></button>`).join('')}</div></div>`;
}
function projectPage(id){const p=projects.find(x=>x.id===id);if(!p)return projectsPage();
  return `<div class="page"><div><button class="btn btn-ghost btn-sm" data-open="projects">${I('arrow-left',14)}All projects</button></div>
  <div class="page-head"><div class="col" style="gap:4px"><h1 class="t-title">${E(p.name)}</h1><span class="t-mute">${E(p.desc)}</span></div><button class="icon-btn" aria-label="Project options" data-soon>${I('more',17)}</button></div>
  <div class="chat-proj"><div class="col" style="gap:20px">${composer('Start a chat in this project')}
   <div class="col"><div class="t-label">Chats in this project</div><div class="chat-list">${p.chats.length?p.chats.map(k=>`<button class="chat-item" data-open="${k}"><span class="avatar bot">${I('bot',15)}</span><span class="col grow" style="gap:2px"><b style="font-weight:500">${E(THREADS[k].title)}</b><span class="t-xs t-mute">${E(THREADS[k].bot)} · ${E(THREADS[k].when)}</span></span></button>`).join(''):`<div class="empty">${I('chat',22)}<div>No chats yet.</div><div class="t-xs">Start one above. It will use this project's files and instructions.</div></div>`}</div></div></div>
   <div class="col" style="gap:14px"><div class="card col"><div class="row between"><b class="t-h">Instructions</b><button class="btn btn-ghost btn-sm" data-soon>Edit</button></div><div class="t-sm t-2">${E(p.ins)}</div></div>
   <div class="card col"><div class="row between"><b class="t-h">Files</b><button class="icon-btn sm" aria-label="Add a file" data-soon>${I('plus',14)}</button></div>${p.files.map(f=>`<div class="row t-sm">${I('file',15)}<span class="truncate">${E(f)}</span></div>`).join('')}</div>
   <div class="card col"><b class="t-h">Bots on this project</b>${p.bots.map(n=>{const b=D.bots.find(x=>x.name===n);return `<button class="nav-item t-sm" data-go="bots" data-sub="${b?b.id:''}">${I('bot',15)}${E(n)}</button>`}).join('')}</div></div></div></div>`;
}
function thumb(kind){
  if(kind==='bars')return `<div class="chat-thumb"><i style="width:40%"></i><div class="bars"><i style="height:45%"></i><i style="height:70%"></i><i style="height:55%"></i><i style="height:90%"></i><i style="height:62%"></i><i style="height:78%"></i></div></div>`;
  if(kind==='sheet')return `<div class="chat-thumb"><div class="cells">${Array.from({length:25},(_,i)=>`<i style="background:${i<5?'var(--line-strong)':'var(--bg-raised)'};border:1px solid var(--line)"></i>`).join('')}</div></div>`;
  if(kind==='slide')return `<div class="chat-thumb"><div class="slide"><i style="width:60%;height:10px"></i><i style="width:85%"></i><i style="width:70%"></i></div></div>`;
  return `<div class="chat-thumb"><i style="width:55%;height:10px"></i><i></i><i style="width:92%"></i><i style="width:78%"></i><i></i><i style="width:64%"></i><i style="width:88%"></i></div>`;
}
function artifactsPage(){const list=ARTIFACTS.filter(a=>a[5]===artTab);
  return `<div class="page"><div class="page-head"><div class="col" style="gap:4px"><h1 class="t-title">Artifacts</h1><span class="t-mute">Documents, sheets, slides and dashboards that you and your bots have made.</span></div><button class="btn btn-primary" data-open="">${I('plus',15)}New artifact</button></div>
  <div class="tabs" role="tablist"><button class="tab" role="tab" aria-selected="${artTab==='mine'}" data-art="mine">Your artifacts</button><button class="tab" role="tab" aria-selected="${artTab==='shared'}" data-art="shared">Shared with you</button></div>
  <div class="chat-cards">${list.map(a=>`<button class="chat-card" data-artifact="${ARTIFACTS.indexOf(a)}">${thumb(a[4])}<b class="t-h">${E(a[0])}</b><span class="t-xs t-mute">${E(a[1])} · ${E(a[2])} · ${E(a[3])}</span></button>`).join('')}</div></div>`;
}
function render(root,sub){
  let body;
  if(sub==='halden')body=halden();else if(THREADS[sub])body=thread(sub);else if(sub==='chats')body=chatsPage();else if(sub==='projects')body=projectsPage();
  else if(sub&&sub.indexOf('project-')===0)body=projectPage(sub.slice(8));else if(sub==='artifacts')body=artifactsPage();else body=home();
  root.innerHTML=`<div class="split">${side(sub)}<div class="main" id="chat-main">${body}</div></div>`;
  const ta=root.querySelector('#chat-in');if(ta)ta.addEventListener('input',()=>{draft=ta.value});
  const bindQ=()=>{const q=root.querySelector('#chat-q');if(!q)return;q.addEventListener('input',()=>{chatQ=q.value;root.querySelector('#chat-main').innerHTML=chatsPage();bindQ();const n=root.querySelector('#chat-q');n.focus();n.setSelectionRange(chatQ.length,chatQ.length)})};bindQ();
}
CW.register('chat',{render});
CW.on('approvals',()=>{if(CW.mode==='chat')CW.go('chat',CW.sub)});
document.addEventListener('click',e=>{
  if(CW.mode!=='chat'||!e.target.closest('#view'))return;
  const o=e.target.closest('[data-open]'),g=e.target.closest('[data-go]'),f=e.target.closest('[data-fill]'),ap=e.target.closest('[data-ap]'),at=e.target.closest('[data-art]'),ar=e.target.closest('[data-artifact]');
  if(o){if(o.hasAttribute('data-old')){CW.toast('Only the six recent chats are written out in this concept.');return}CW.go('chat',o.dataset.open||null);return}
  if(g){CW.go(g.dataset.go,g.dataset.sub||null);return}
  if(f){draft=f.dataset.fill;const ta=document.getElementById('chat-in');ta.value=draft;ta.focus();return}
  if(ap){CW.resolveApproval('ap-discount',ap.dataset.ap);return}
  if(at){artTab=at.dataset.art;CW.go('chat','artifacts');return}
  if(ar){const a=ARTIFACTS[+ar.dataset.artifact];CW.modal({title:a[0],body:thumb(a[4])+`<div class="t-sm t-mute">${E(a[1])} · made by ${E(a[2])} · ${E(a[3])}</div><div class="t-sm">This is a preview. In the full product it opens as a live ${E(a[1].toLowerCase())} you can edit with Claude.</div>`,foot:`<button class="btn" data-close>Close</button><button class="btn btn-primary" data-close id="art-share">Share</button>`});return}
  if(e.target.closest('#proj-new')){const m=CW.modal({title:'New project',body:`<div class="field"><label for="pn">What are you working on?</label><input class="input" id="pn" placeholder="Name your project"></div><div class="field"><label for="pd">What are you trying to achieve?</label><textarea class="textarea" id="pd" rows="3" placeholder="Describe the project, its goals and anything bots should know"></textarea></div>`,foot:`<button class="btn" data-close>Cancel</button><button class="btn btn-primary" id="proj-create">Create project</button>`});
    m.querySelector('#proj-create').addEventListener('click',()=>{const n=m.querySelector('#pn').value.trim();if(!n){CW.toast('Give the project a name.');return}const id='p'+Date.now();projects.unshift({id,name:n,desc:m.querySelector('#pd').value.trim()||'No description yet.',upd:'Just now',chats:[],files:[],bots:[],ins:'No instructions yet.'});CW.closeModal();CW.go('chat','project-'+id)});return}
  if(e.target.closest('#chat-send')){if(draft.trim()){draft='';CW.go('chat','halden')}else CW.toast('Type a request first.');return}
  if(e.target.closest('#chat-wait')){document.getElementById('bell').click();return}
  if(e.target.closest('#chat-route')){CW.menu(e.target.closest('#chat-route'),[{label:'Best bot (automatic)',icon:'zap'}].concat(D.bots.slice(0,5).map(b=>({label:b.name,icon:'bot',hint:b.team}))));return}
  if(e.target.closest('[data-soon]'))CW.toast('Not part of this concept yet.');
});
document.addEventListener('click',e=>{if(e.target.id==='art-share')CW.toast('Sharing is not part of this concept yet.')});
})();
