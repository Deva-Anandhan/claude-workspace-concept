/* Claude Workspace concept: app shell, router and shared helpers.
   API FOR VIEW AUTHORS (all on window.CW)
   CW.register(name, {render(root, sub)})   name: 'chat' | 'mail' | 'bots' | 'browser' | 'settings'. render fills root (the #view element).
   CW.go(mode, sub)                          navigate; sub is an optional string the view interprets (for example a bot id or a settings section).
   CW.icon(name, size=16)                    returns an inline SVG string. Names are the keys of ICONS below.
   CW.data                                   shared example data (js/data.js): me, company, people, bots, approvals.
   CW.bot(id)                                look up a bot.
   CW.resolveApproval(id, 'approved'|'declined')   updates shared state, the bell and fires 'approvals'.
   CW.on(event, fn) / CW.emit(event, detail) events: 'approvals', 'theme'.
   CW.toast(text)                            short confirmation at the bottom of the screen.
   CW.modal({title, body, foot})             body and foot are HTML strings; returns the modal element; CW.closeModal() closes it. Buttons with data-close close it.
   CW.menu(anchorEl, items)                  items: [{label, icon?, onClick}] or 'sep'.
   CW.css(id, cssText)                       inject a view's own stylesheet once.
   CW.esc(text)                              escape text for HTML.
   CW.money(n)                               formats as $1,234.00 */
(function(){
const ICONS={
 plus:'<path d="M12 5v14M5 12h14"/>',x:'<path d="M6 6l12 12M18 6L6 18"/>',check:'<path d="M5 12.5l4.5 4.5L19 7.5"/>',
 search:'<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>',bell:'<path d="M6 16V11a6 6 0 0112 0v5l1.5 2h-15z"/><path d="M10 20.5h4"/>',
 'chevron-down':'<path d="M6 9l6 6 6-6"/>','chevron-right':'<path d="M9 6l6 6-6 6"/>','chevron-left':'<path d="M15 6l-6 6 6 6"/>',
 'arrow-up':'<path d="M12 19V5M6 11l6-6 6 6"/>','arrow-left':'<path d="M19 12H5M11 6l-6 6 6 6"/>','arrow-right':'<path d="M5 12h14M13 6l6 6-6 6"/>',
 refresh:'<path d="M20 11a8 8 0 10-2.3 6.2"/><path d="M20 5v6h-6"/>',more:'<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
 chat:'<path d="M4 6a2 2 0 012-2h12a2 2 0 012 2v9a2 2 0 01-2 2h-7l-5 4v-4H6a2 2 0 01-2-2z"/>',mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.5 7l8.5 6 8.5-6"/>',
 bot:'<rect x="5" y="8" width="14" height="11" rx="3"/><path d="M12 4v4M9 13v1.5M15 13v1.5"/><circle cx="12" cy="3.5" r="1"/>',globe:'<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c3 3 3 14 0 17M12 3.5c-3 3-3 14 0 17"/>',
 settings:'<circle cx="12" cy="12" r="3"/><path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M5.6 18.4l1.8-1.8M16.6 7.4l1.8-1.8"/>',
 sliders:'<path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/>',
 user:'<circle cx="12" cy="8" r="3.5"/><path d="M5 20c.8-3.6 3.5-5.5 7-5.5s6.200 1.900 7 5.500"/>',users:'<circle cx="9" cy="8" r="3"/><path d="M3 19c.6-3 2.800-4.500 6-4.500s5.400 1.500 6 4.500"/><path d="M16 5.500a3 3 0 010 5.500M17.500 14.800c2 .500 3.200 1.900 3.600 4.200"/>',
 lock:'<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/>',key:'<circle cx="8" cy="15" r="4"/><path d="M11 12l8.500-8.500M16 6.500l2.500 2.500"/>',
 shield:'<path d="M12 3l7 3v5.500c0 4.500-3 7.800-7 9.500-4-1.700-7-5-7-9.500V6z"/>',card:'<rect x="3" y="5.500" width="18" height="13" rx="2"/><path d="M3 10h18M7 15h4"/>',
 wallet:'<path d="M4 7.500A2.500 2.500 0 016.500 5H18v3"/><rect x="4" y="8" width="16" height="11" rx="2"/><circle cx="16" cy="13.500" r="1"/>',
 clock:'<circle cx="12" cy="12" r="8.500"/><path d="M12 7.500V12l3 2"/>',calendar:'<rect x="4" y="5.500" width="16" height="14.500" rx="2"/><path d="M4 10h16M8 3.500v4M16 3.500v4"/>',
 star:'<path d="M12 4l2.400 5 5.400.700-4 3.800 1 5.400-4.800-2.600-4.800 2.600 1-5.400-4-3.800 5.400-.700z"/>',trash:'<path d="M5 7h14M10 7V5h4v2M7 7l1 12h8l1-12"/>',
 archive:'<rect x="3.500" y="5" width="17" height="4" rx="1"/><path d="M5 9v9a1 1 0 001 1h12a1 1 0 001-1V9M10 13h4"/>',inbox:'<path d="M4 13l2.500-7h11l2.500 7v5a1 1 0 01-1 1H5a1 1 0 01-1-1z"/><path d="M4 13h5l1 2h4l1-2h5"/>',
 send:'<path d="M20 4L3.500 10.500l6.500 3 3 6.500z"/><path d="M10 13.500L20 4"/>',reply:'<path d="M9 7l-5 5 5 5"/><path d="M4 12h9a6 6 0 016 6v1"/>',forward:'<path d="M15 7l5 5-5 5"/><path d="M20 12h-9a6 6 0 00-6 6v1"/>',
 paperclip:'<path d="M19 11.500l-7.500 7.500a4.500 4.500 0 01-6.400-6.400L13 4.700a3 3 0 014.300 4.300l-7.600 7.600a1.500 1.500 0 01-2.200-2.200L14 8"/>',edit:'<path d="M4 20h4l11-11-4-4L4 16z"/><path d="M13.500 6.500l4 4"/>',
 tag:'<path d="M4 4h7l9 9-7 7-9-9z"/><circle cx="8" cy="8" r="1.200"/>',file:'<path d="M7 3.500h7l4 4V20a.500.500 0 01-.500.500h-10.500a.500.500 0 01-.500-.500V4a.500.500 0 01.500-.500z"/><path d="M14 3.500V8h4"/>',
 folder:'<path d="M3.500 7a1.500 1.500 0 011.500-1.500h4l2 2.500h8a1.500 1.500 0 011.500 1.500v8a1.500 1.500 0 01-1.500 1.500H5A1.500 1.500 0 013.500 17.500z"/>',
 terminal:'<rect x="3" y="4.500" width="18" height="15" rx="2"/><path d="M7 9.500l3 2.500-3 2.500M12.500 15h4"/>',split:'<rect x="3.500" y="4.500" width="17" height="15" rx="2"/><path d="M12 4.500v15"/>',
 play:'<path d="M8 5.500v13l10-6.500z"/>',pause:'<path d="M8 5.500v13M16 5.500v13"/>',stop:'<rect x="6.500" y="6.500" width="11" height="11" rx="1.500"/>',
 bookmark:'<path d="M7 4h10v16l-5-3.500L7 20z"/>',download:'<path d="M12 4v11M7 11l5 5 5-5M5 20h14"/>',external:'<path d="M14 5h5v5M19 5l-8 8M11 6H6v12h12v-5"/>',
 alert:'<path d="M12 4l9 15.500H3z"/><path d="M12 10v4M12 17v.500"/>',info:'<circle cx="12" cy="12" r="8.500"/><path d="M12 11v5.500M12 7.500v.500"/>',
 sun:'<circle cx="12" cy="12" r="3.500"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.600 5.600L7 7M17 17l1.400 1.400M5.600 18.400L7 17M17 7l1.400-1.400"/>',moon:'<path d="M19.500 14.500A8 8 0 019.500 4.500a8 8 0 1010 10z"/>',
 eye:'<path d="M2.500 12S6 5.500 12 5.500 21.500 12 21.500 12 18 18.500 12 18.500 2.500 12 2.500 12z"/><circle cx="12" cy="12" r="2.500"/>',copy:'<rect x="8" y="8" width="11.500" height="11.500" rx="2"/><path d="M5 15.500V6a1.500 1.500 0 011.500-1.500H15"/>',
 list:'<path d="M8 6.500h12M8 12h12M8 17.500h12"/><circle cx="4" cy="6.500" r=".800"/><circle cx="4" cy="12" r=".800"/><circle cx="4" cy="17.500" r=".800"/>',filter:'<path d="M4 5.500h16l-6 7.500v5.500l-4 1.500v-7z"/>',
 panel:'<rect x="3.500" y="4.500" width="17" height="15" rx="2"/><path d="M9 4.500v15"/>',home:'<path d="M4 11l8-6.500 8 6.500v8.500a.500.500 0 01-.500.500H14v-5.500h-4V20H4.500a.500.500 0 01-.500-.500z"/>',
 zap:'<path d="M13 3L5 13.500h6L10 21l8-10.500h-6z"/>',layers:'<path d="M12 4l8.500 4.500L12 13 3.500 8.500z"/><path d="M3.500 12.500L12 17l8.500-4.500M3.500 16.500L12 21l8.500-4.500"/>',
 logout:'<path d="M10 4.500H6a1.500 1.500 0 00-1.500 1.500v12A1.500 1.500 0 006 19.500h4M15 8l4 4-4 4M19 12H9"/>'
};
const D=window.CWDATA, listeners={};
const CW=window.CW={views:{},data:D,mode:null,sub:null};
CW.icon=(n,s=16)=>`<svg class="ico" width="${s}" height="${s}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n]||ICONS.info}</svg>`;
CW.esc=t=>String(t==null?'':t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
CW.money=n=>'$'+Number(n).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
CW.bot=id=>D.bots.find(b=>b.id===id);
CW.on=(e,f)=>{(listeners[e]=listeners[e]||[]).push(f)};
CW.emit=(e,d)=>{(listeners[e]||[]).forEach(f=>{try{f(d)}catch(err){console.error(err)}})};
CW.css=(id,text)=>{if(document.getElementById('css-'+id))return;const s=document.createElement('style');s.id='css-'+id;s.textContent=text;document.head.appendChild(s)};
CW.register=(name,view)=>{CW.views[name]=view};

let toastT;
CW.toast=t=>{let el=document.getElementById('toast');if(!el){el=document.createElement('div');el.id='toast';el.className='toast';el.setAttribute('role','status');document.body.appendChild(el)}
  el.textContent=t;el.hidden=false;clearTimeout(toastT);toastT=setTimeout(()=>{el.hidden=true},2600)};
CW.closeModal=()=>{const s=document.getElementById('scrim');if(s)s.remove()};
CW.modal=({title,body,foot})=>{CW.closeModal();const s=document.createElement('div');s.id='scrim';s.className='scrim';
  s.innerHTML=`<div class="modal" role="dialog" aria-modal="true" aria-label="${CW.esc(title)}"><div class="modal-head"><span class="t-h">${CW.esc(title)}</span><button class="icon-btn sm" data-close aria-label="Close">${CW.icon('x',14)}</button></div><div class="modal-body">${body||''}</div>${foot?`<div class="modal-foot">${foot}</div>`:''}</div>`;
  s.addEventListener('click',e=>{if(e.target===s||e.target.closest('[data-close]'))CW.closeModal()});document.body.appendChild(s);
  const f=s.querySelector('input,textarea,select,button:not([data-close])');if(f)f.focus();return s.querySelector('.modal')};
let menuH=null;
CW.closeMenu=()=>{const m=document.getElementById('menu');if(m)m.remove();if(menuH){document.removeEventListener('click',menuH);menuH=null}};
CW.menu=(anchor,items)=>{CW.closeMenu();const m=document.createElement('div');m.id='menu';m.className='menu';m.setAttribute('role','menu');
  items.forEach(it=>{if(it==='sep'){const d=document.createElement('div');d.className='menu-sep';m.appendChild(d);return}
    const b=document.createElement('button');b.className='menu-item';b.setAttribute('role','menuitem');b.innerHTML=(it.icon?CW.icon(it.icon,15):'')+`<span class="grow">${CW.esc(it.label)}</span>`+(it.hint?`<span class="t-xs t-mute">${CW.esc(it.hint)}</span>`:'');
    b.addEventListener('click',()=>{CW.closeMenu();it.onClick&&it.onClick()});m.appendChild(b)});
  document.body.appendChild(m);const r=anchor.getBoundingClientRect();m.style.position='fixed';
  m.style.top=Math.min(r.bottom+4,innerHeight-m.offsetHeight-8)+'px';m.style.left=Math.max(8,Math.min(r.left,innerWidth-m.offsetWidth-8))+'px';
  setTimeout(()=>{if(!m.isConnected)return;menuH=e=>{if(!m.contains(e.target))CW.closeMenu()};document.addEventListener('click',menuH)},0);return m};

CW.pending=()=>D.approvals.filter(a=>a.status==='pending');
CW.resolveApproval=(id,status)=>{const a=D.approvals.find(x=>x.id===id);if(!a||a.status!=='pending')return;a.status=status;
  const b=CW.bot(a.bot);if(b&&!CW.pending().some(x=>x.bot===a.bot))b.status=status==='approved'?'done':'idle';
  bell();CW.emit('approvals',a);CW.toast(status==='approved'?'Approved. '+(b?b.name:'The bot')+' is continuing.':'Declined. '+(b?b.name:'The bot')+' has been told.')};

const MODES=[['chat','Chat','chat'],['mail','Mail','mail'],['bots','Bots','bot'],['browser','Browser','globe']];
function shell(){
  document.getElementById('app').innerHTML=`<header class="topbar"><div class="row"><span class="wordmark">Claude</span><span class="concept-note">Concept proposal. Not an Anthropic product.</span></div>
  <nav class="modes" aria-label="Modes">${MODES.map(m=>`<button class="mode" data-mode="${m[0]}">${CW.icon(m[2],15)}<span>${m[1]}</span></button>`).join('')}</nav>
  <div class="top-right"><button class="btn btn-ghost btn-sm" id="open-palette">${CW.icon('search',14)}<span class="t-mute">Search</span><span class="kbd">⌘K</span></button>
  <button class="icon-btn" id="bell" aria-label="Approvals">${CW.icon('bell',17)}<span class="badge" id="bell-n"></span></button>
  <button class="icon-btn" id="theme" aria-label="Switch theme">${CW.icon('moon',16)}</button>
  <button class="avatar" id="me" aria-label="Account menu">${D.me.initials}</button></div></header><div id="view"></div>`;
  document.querySelector('.modes').addEventListener('click',e=>{const b=e.target.closest('[data-mode]');if(b)CW.go(b.dataset.mode)});
  document.getElementById('bell').addEventListener('click',e=>{e.stopPropagation();togglePop()});
  document.getElementById('open-palette').addEventListener('click',palette);
  document.getElementById('theme').addEventListener('click',()=>{const d=document.documentElement,dark=d.dataset.theme==='dark';d.dataset.theme=dark?'light':'dark';
    document.getElementById('theme').innerHTML=CW.icon(dark?'moon':'sun',16);try{localStorage.setItem('cw-theme',d.dataset.theme)}catch(e){}CW.emit('theme',d.dataset.theme)});
  document.getElementById('me').addEventListener('click',e=>{e.stopPropagation();CW.menu(e.currentTarget,[
    {label:'Settings',icon:'settings',onClick:()=>CW.go('settings','general')},{label:'Wallet and billing',icon:'wallet',onClick:()=>CW.go('settings','wallet')},
    {label:'Identity and access',icon:'shield',onClick:()=>CW.go('settings','identity')},{label:'Vault',icon:'key',onClick:()=>CW.go('settings','vault')},
    {label:'Policies and limits',icon:'sliders',onClick:()=>CW.go('settings','policies')},{label:'Audit log',icon:'list',onClick:()=>CW.go('settings','audit')},'sep',
    {label:D.me.name+' · '+D.company.name,icon:'user',onClick:()=>CW.go('settings','general')},{label:'Log out',icon:'logout',onClick:()=>CW.toast('This is a concept. There is nothing to log out of.')}])});
  bell();
}
function bell(){const n=CW.pending().length,el=document.getElementById('bell-n');if(el){el.textContent=n;el.hidden=!n}const p=document.getElementById('pop');if(p)drawPop(p)}
function drawPop(p){const list=CW.pending();
  p.innerHTML=`<div class="card-head"><span class="t-h">Waiting for you</span><span class="t-xs t-mute">${list.length} pending</span></div>`+(list.length?list.map(a=>{const b=CW.bot(a.bot);
    return `<div class="list-row" style="align-items:flex-start"><span class="avatar bot">${CW.icon('bot',15)}</span><div class="col grow" style="gap:4px"><div><b style="font-weight:500">${CW.esc(a.title)}</b></div>
    <div class="t-xs t-mute">${CW.esc(b.name)} · asked by ${CW.esc(a.asker)} · ${CW.esc(a.reason)}</div>
    <div class="row" style="margin-top:4px"><button class="btn btn-primary btn-sm" data-ap="${a.id}">Approve</button><button class="btn btn-sm" data-de="${a.id}">Decline</button><button class="btn btn-ghost btn-sm" data-open="${a.id}">Open</button></div></div></div>`}).join('')
   :`<div class="empty">${CW.icon('check',22)}<div>Nothing is waiting for you.</div><div class="t-xs">Bots stop here when they reach a limit.</div></div>`)}
function togglePop(){let p=document.getElementById('pop');if(p){p.remove();return}p=document.createElement('div');p.id='pop';p.className='popover';drawPop(p);
  p.addEventListener('click',e=>{const a=e.target.closest('[data-ap]'),d=e.target.closest('[data-de]'),o=e.target.closest('[data-open]');
    if(a)CW.resolveApproval(a.dataset.ap,'approved');else if(d)CW.resolveApproval(d.dataset.de,'declined');else if(o){const x=D.approvals.find(v=>v.id===o.dataset.open);p.remove();CW.go(x.mode,x.sub)}});
  document.body.appendChild(p);setTimeout(()=>document.addEventListener('click',function h(e){if(!p.contains(e.target)&&!e.target.closest('#bell')){p.remove();document.removeEventListener('click',h)}}),0)}
function palette(){const items=[['Chat','chat','chat'],['Mail: Inbox','mail','mail'],['Mail: Compose','mail','mail','compose'],['Bots','bot','bots'],['Browser','globe','browser'],['Wallet and billing','wallet','settings','wallet'],['Identity and access','shield','settings','identity'],['Vault','key','settings','vault'],['Policies and limits','sliders','settings','policies'],['Audit log','list','settings','audit']]
    .concat(D.bots.map(b=>[b.name,'bot','bots',b.id]));
  const m=CW.modal({title:'Search',body:`<div class="search">${CW.icon('search',15)}<input id="pal-q" placeholder="Go to a place, a bot or a setting" aria-label="Search"></div><div id="pal-list" class="col" style="gap:1px"></div>`});
  const q=m.querySelector('#pal-q'),l=m.querySelector('#pal-list');
  const draw=()=>{const t=q.value.trim().toLowerCase(),f=items.filter(i=>i[0].toLowerCase().includes(t)).slice(0,9);
    l.innerHTML=f.length?f.map((i,k)=>`<button class="menu-item" data-k="${items.indexOf(i)}">${CW.icon(i[1],15)}<span class="grow">${CW.esc(i[0])}</span>${k===0?'<span class="kbd">↵</span>':''}</button>`).join(''):'<div class="t-mute t-sm" style="padding:8px">No matches.</div>'};
  const pick=k=>{const i=items[k];CW.closeModal();CW.go(i[2],i[3])};
  q.addEventListener('input',draw);q.addEventListener('keydown',e=>{if(e.key==='Enter'){const b=l.querySelector('[data-k]');if(b)pick(+b.dataset.k)}});
  l.addEventListener('click',e=>{const b=e.target.closest('[data-k]');if(b)pick(+b.dataset.k)});draw();q.focus()}

CW.go=(mode,sub)=>{CW.closeMenu();CW.mode=mode;CW.sub=sub||null;
  document.querySelectorAll('.mode').forEach(b=>b.dataset.mode===mode?b.setAttribute('aria-current','page'):b.removeAttribute('aria-current'));
  const root=document.getElementById('view'),v=CW.views[mode];root.innerHTML='';
  if(v){try{v.render(root,CW.sub)}catch(err){console.error(err);root.innerHTML=`<div class="empty">${CW.icon('alert',22)}<div>This screen failed to load.</div><div class="t-xs t-mono">${CW.esc(err.message)}</div></div>`}}
  else root.innerHTML=`<div class="empty">${CW.icon('info',22)}<div>This screen is not built yet.</div></div>`;
  const hash='#'+mode+(sub?'-'+sub:'');
  try{if(location.hash===hash||CW._fromHistory||!CW._booted)history.replaceState(null,'',hash);else history.pushState(null,'',hash)}catch(e){}};
function fromHash(){const h=location.hash.slice(1),i=h.indexOf('-'),mode=i>0?h.slice(0,i):h,sub=i>0?h.slice(i+1):null;
  CW._fromHistory=true;try{CW.go(CW.views[mode]?mode:'chat',CW.views[mode]?sub:null)}finally{CW._fromHistory=false}}
CW.boot=()=>{try{const t=localStorage.getItem('cw-theme');if(t)document.documentElement.dataset.theme=t}catch(e){}
  shell();if(document.documentElement.dataset.theme==='dark')document.getElementById('theme').innerHTML=CW.icon('sun',16);
  fromHash();CW._booted=true;
  window.addEventListener('popstate',()=>{CW.closeModal();const p=document.getElementById('pop');if(p)p.remove();fromHash()});
  document.addEventListener('keydown',e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();palette()}if(e.key==='Escape'){CW.closeModal();CW.closeMenu();const p=document.getElementById('pop');if(p)p.remove()}})};
})();
