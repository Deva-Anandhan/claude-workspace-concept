/* Chat mode: the home composer and one worked conversation. Also the reference for how a view is written. */
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
`);
const RECENTS=[['halden','Halden Dental contract tier'],['deck','Q3 pipeline review deck'],['renew','Analytics renewal'],['jo','Set up Jo for Monday'],['csv','CSV export on invoices'],['notes','Notes from the pricing review']];
let draft='';
function side(sub){
  return `<aside class="side"><button class="nav-item chat-new" data-open="">${'<i>'+I('plus',14)+'</i>'}New chat</button>
  <div class="col" style="gap:1px"><button class="nav-item" data-open="">${I('chat')}Chats</button><button class="nav-item" data-soon>${I('folder')}Projects</button><button class="nav-item" data-soon>${I('layers')}Artifacts</button></div>
  <div class="col" style="gap:1px"><div class="side-label">Recents</div>${RECENTS.map(r=>`<button class="nav-item t-sm" data-open="${r[0]}" ${sub===r[0]?'aria-current="page"':''}><span class="truncate">${E(r[1])}</span></button>`).join('')}</div>
  </aside>`;
}
function composer(ph){
  return `<div class="composer"><textarea id="chat-in" rows="2" placeholder="${E(ph)}" aria-label="Message">${E(draft)}</textarea>
  <div class="bar"><div class="row"><button class="icon-btn" aria-label="Attach">${I('plus',17)}</button><button class="icon-btn" aria-label="Tools and connected apps">${I('sliders',16)}</button></div>
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
function halden(){
  const a=D.approvals.find(x=>x.id==='ap-discount');
  const tool=(icon,title,meta,body)=>`<details class="tool"><summary>${I(icon,15)}<span class="grow"><b style="font-weight:500">${title}</b></span><span class="t-xs t-mute">${meta}</span>${I('chevron-down',13)}</summary><div class="tool-body">${body}</div></details>`;
  let end='';
  if(a.status==='pending')end=`<div class="notice"><div class="row between"><b>Approval needed from you</b><span class="pill warn">Above policy</span></div><div>Matching the price the customer was told needs a 12% discount. Policy allows 10% without approval.</div><div class="t-sm t-mute">If you approve: ${E(a.after)}</div><div class="row wrap"><button class="btn btn-primary" data-ap="approved">Approve</button><button class="btn" data-ap="declined">Decline</button><button class="btn btn-ghost" data-ask>Ask a question first</button></div></div>`;
  else if(a.status==='approved')end=`<div>${tool('check','Approved by '+E(D.me.name),'logged','Approval ap-discount\nPolicy: discounts above 10% need the RevOps manager\nRecorded in the audit log')}${tool('globe','Claude Browser · updated the opportunity and regenerated the contract','6 min in total','Opened deal HD-2291\nSet tier: Growth\nSet discount: 12%\nRegenerated contract v3')}</div>
   <div class="msg-claude">Done. The contract now shows the Growth tier with the approved 12% discount, and I have replied to Priya with the new version.</div><div><span class="file-chip">${I('file',18)}<span><b style="font-weight:500">Halden Dental contract, corrected</b><br><span class="t-mute">Document · attached to the deal</span></span></span></div>`;
  else end=`<div class="msg-claude">Understood. I have left the contract as it was and told Priya that the discount was declined. She can come back with a price inside the 10% policy.</div>`;
  return `<div class="chat-head"><div class="row"><span class="avatar bot">${I('bot',15)}</span><div class="col" style="gap:0"><b style="font-weight:500">Halden Dental contract tier</b><span class="t-xs t-mute">RevOps bot · asked by Priya Nair, Sales</span></div></div><div class="row"><button class="btn btn-sm" data-go="bots" data-sub="revops-bot">${I('bot',14)}Open bot session</button><button class="btn btn-sm" data-go="browser">${I('globe',14)}View in Browser</button></div></div>
  <div class="thread grow"><div class="msg-user"><div class="t-xs t-mute">Priya Nair · Sales</div>The Halden Dental contract has the wrong pricing tier. Can you fix it?</div>
  <div class="msg-claude">I'll take this. I checked the deal against the signed quote: it was sold on the Growth tier, but the contract was generated at the Starter price.</div>
  <div>${tool('shield','Claude Auth · signed in as RevOps bot','CRM, contract tool','Identity: revops-bot@larkfield.example\nRole: Deals and contracts\nScopes: deals:write, contracts:write')}${tool('key','Claude Vault · used 2 keys','not shown to the model','crm-service-key ········ used 10:48\ncontract-tool-key ········ used 10:48')}${tool('globe','Claude Browser · opened the Halden Dental deal','deal HD-2291','Quote: Growth tier, 45 seats\nContract v2: Starter tier price\nDifference: 12% below Growth list price')}</div>
  ${end}</div><div class="chat-foot">${composer('Reply to RevOps bot')}</div>`;
}
function generic(title){return `<div class="chat-head"><b style="font-weight:500">${E(title)}</b></div><div class="thread grow"><div class="empty">${I('chat',22)}<div>This conversation is a placeholder.</div><div class="t-xs">Open "Halden Dental contract tier" for the worked example.</div></div></div><div class="chat-foot">${composer('Reply')}</div>`}
function render(root,sub){
  const rec=RECENTS.find(r=>r[0]===sub);
  root.innerHTML=`<div class="split">${side(sub)}<div class="main" id="chat-main">${sub==='halden'?halden():rec?generic(rec[1]):home()}</div></div>`;
  const ta=root.querySelector('#chat-in');if(ta)ta.addEventListener('input',()=>{draft=ta.value});
}
CW.register('chat',{render});
CW.on('approvals',()=>{if(CW.mode==='chat')CW.go('chat',CW.sub)});
document.addEventListener('click',e=>{
  if(CW.mode!=='chat'||!e.target.closest('#view'))return;
  const o=e.target.closest('[data-open]'),g=e.target.closest('[data-go]'),f=e.target.closest('[data-fill]'),ap=e.target.closest('[data-ap]');
  if(o){CW.go('chat',o.dataset.open||null);return}
  if(g){CW.go(g.dataset.go,g.dataset.sub);return}
  if(f){draft=f.dataset.fill;const ta=document.getElementById('chat-in');ta.value=draft;ta.focus();return}
  if(ap){CW.resolveApproval('ap-discount',ap.dataset.ap);return}
  if(e.target.closest('#chat-send')){if(draft.trim()){draft='';CW.go('chat','halden')}else CW.toast('Type a request first.');return}
  if(e.target.closest('#chat-wait')){document.getElementById('bell').click();return}
  if(e.target.closest('#chat-route')){CW.menu(e.target.closest('#chat-route'),[{label:'Best bot (automatic)',icon:'zap'}].concat(D.bots.slice(0,5).map(b=>({label:b.name,icon:'bot',hint:b.team}))));return}
  if(e.target.closest('[data-soon]')||e.target.closest('[data-ask]')){CW.toast('Not part of this concept yet.')}
});
})();
