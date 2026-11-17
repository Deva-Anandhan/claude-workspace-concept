/* Mail mode: a full mail client where bots read, sort, draft and (within limits) send, and everything a bot did is visible.
   All state lives in module scope so it survives leaving the mode and coming back. */
(function(){
const CW=window.CW,D=CW.data,I=CW.icon,E=CW.esc;
CW.css('mail',`
.mail-root{position:relative;display:grid;grid-template-columns:232px minmax(0,1fr);height:100%;min-height:0;overflow:hidden}
.mail-root input[type=checkbox]:not(.switch){accent-color:var(--accent);width:15px;height:15px;margin:0;cursor:pointer;flex:none}
.mail-side{gap:12px}
.mail-compose{justify-content:flex-start;gap:10px;padding:10px 14px;border-radius:var(--r-lg);font-weight:600;box-shadow:var(--shadow-1)}
.mail-compose .kbd{margin-left:auto;background:none;color:inherit;border-color:currentColor;opacity:.75}
.mail-compose-sm{display:none}
.mail-nav{display:flex;flex-direction:column;gap:1px}
.mail-side .nav-item{padding:5px 8px;font-size:13.5px}
.mail-side .nav-item .count{font-variant-numeric:tabular-nums}
.mail-side .nav-item.has-unread{color:var(--ink);font-weight:600}
.mail-side-head{display:flex;align-items:center;justify-content:space-between;padding:4px 2px 2px 8px;font-size:12px;color:var(--ink-3)}
.mail-ldot{width:9px;height:9px;border-radius:50%;flex:none;background:var(--c);margin:0 3.5px}
.mail-side-foot{margin-top:auto;display:flex;flex-direction:column;gap:6px;padding-top:8px;border-top:1px solid var(--line)}
.mail-quota{height:4px;border-radius:2px;background:var(--line);overflow:hidden;margin:0 8px}
.mail-quota i{display:block;height:100%;width:7%;background:var(--ink-3)}
.mail-center{display:grid;grid-template-rows:auto minmax(0,1fr);min-width:0;min-height:0}
.mail-top{display:flex;flex-direction:column;gap:8px;padding:10px 16px;border-bottom:1px solid var(--line);background:var(--bg)}
.mail-top .search{flex:1;max-width:760px}
.mail-top .search:focus-within{border-color:var(--accent)}
.mail-chips{display:flex;gap:6px;flex-wrap:wrap;align-items:center}
.mail-fchip{display:inline-flex;align-items:center;gap:6px;background:var(--accent-soft);color:var(--accent-strong);border:0;border-radius:12px;padding:2px 8px 2px 10px;font-size:12.5px;font-weight:500}
.mail-fchip:hover{background:var(--bg-active);color:var(--ink)}
.mail-body{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);min-height:0}
.mail-listcol{display:grid;grid-template-rows:auto minmax(0,1fr);min-width:0;min-height:0;border-right:1px solid var(--line)}
.mail-lrow{display:flex;align-items:center;gap:8px;min-height:40px;padding:0 10px 0 14px;border-bottom:1px solid var(--line);min-width:0}
.mail-lrow.tools{min-height:36px;background:var(--bg-side);color:var(--ink-3);font-size:12.5px}
.mail-tabs{border-bottom:0;align-self:stretch;min-width:0;overflow-x:auto;scrollbar-width:none;margin-left:-8px}
.mail-tabs .tab{display:flex;align-items:center;gap:6px;white-space:nowrap;padding:0 9px;font-size:13px;margin-bottom:0}
.mail-tabn{font-size:11px;font-weight:600;background:var(--bg-sunk);color:var(--ink-2);border-radius:9px;padding:0 6px;line-height:17px}
.tab[aria-selected="true"] .mail-tabn{background:var(--accent-soft);color:var(--accent-strong)}
.mail-list{overflow-y:auto;min-height:0}
.mail-row{position:relative;display:flex;align-items:flex-start;gap:2px;padding:0 8px 0 14px;border-bottom:1px solid var(--line)}
.mail-row:hover{background:var(--bg-hover)}
.mail-row.sel{background:var(--bg-active)}
.mail-row.open{background:var(--bg-sunk);box-shadow:inset 3px 0 0 var(--accent)}
.mail-row>input{margin:13px 6px 0 0!important}
.mail-star{margin-top:8px;color:var(--ink-4)}
.mail-star.on{color:var(--warn)} .mail-star.on svg{fill:currentColor}
.mail-row-main{flex:1;min-width:0;display:grid;grid-template-columns:128px minmax(0,1fr) auto;column-gap:10px;row-gap:4px;align-items:center;border:0;background:none;text-align:left;padding:10px 4px 10px 6px;color:var(--ink-2);font-size:13.5px}
.mail-from{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.mail-draftword{color:var(--bad);font-weight:500}
.mail-subj-line{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}
.mail-subj{color:var(--ink)} .mail-snip{color:var(--ink-3)}
.mail-time{display:inline-flex;align-items:center;gap:5px;font-size:12px;color:var(--ink-3);font-variant-numeric:tabular-nums;white-space:nowrap;justify-content:flex-end}
.mail-meta{grid-column:2 / 4;display:flex;gap:6px;align-items:center;min-width:0;overflow:hidden}
.mail-row.unread .mail-from,.mail-row.unread .mail-subj{font-weight:600;color:var(--ink)}
.mail-row.unread .mail-time{color:var(--ink);font-weight:600}
.mail-quick{position:absolute;right:8px;top:5px;display:none;gap:1px;padding:1px 1px 1px 10px;border-radius:var(--r-md);background:var(--bg-hover)}
.mail-row:hover .mail-quick,.mail-row:focus-within .mail-quick{display:flex}
.mail-row.sel .mail-quick,.mail-row.open .mail-quick{background:var(--bg-active)}
.mail-lchip{display:inline-flex;align-items:center;gap:5px;font-size:11.5px;border:1px solid var(--line-strong);border-radius:10px;padding:0 7px;color:var(--ink-2);white-space:nowrap;background:var(--bg-raised);line-height:18px}
.mail-lchip i{width:7px;height:7px;border-radius:50%;background:var(--c)}
button.mail-lchip:hover{background:var(--bg-hover)}
.mail-read{min-width:0;min-height:0;overflow-y:auto;display:flex;flex-direction:column;background:var(--bg)}
.mail-rbar{position:sticky;top:0;z-index:2;display:flex;align-items:center;gap:2px;padding:5px 12px;border-bottom:1px solid var(--line);background:var(--bg)}
.mail-rbar .sep{width:1px;height:18px;background:var(--line);margin:0 6px}
.mail-rhead{padding:18px 20px 6px;display:flex;flex-direction:column;gap:8px}
.mail-rhead h2{font-family:var(--serif);font-weight:400;font-size:22px;line-height:1.25;letter-spacing:-.01em;overflow-wrap:anywhere}
.mail-thread{padding:8px 20px 96px;display:flex;flex-direction:column;gap:10px}
.mail-note{display:flex;align-items:flex-start;gap:10px;border:1px solid var(--line);background:var(--bg-sunk);border-radius:var(--r-lg);padding:10px 12px;font-size:13px;color:var(--ink-2)}
.mail-note.warn{background:var(--warn-soft);border-color:transparent;color:var(--ink)}
.mail-msg{border:1px solid var(--line);border-radius:var(--r-lg);background:var(--bg-raised);min-width:0}
.mail-msg-head{display:flex;align-items:flex-start;gap:6px;padding:12px 10px 10px 14px}
.mail-msg-id{display:flex;align-items:flex-start;gap:10px;flex:1;min-width:0;border:0;background:none;text-align:left;padding:0}
button.mail-msg-id.shut{align-items:center;padding:10px 14px;width:100%;border-radius:var(--r-lg)}
button.mail-msg-id.shut:hover{background:var(--bg-hover)}
.mail-msg-who{font-weight:500;color:var(--ink);white-space:nowrap}
.mail-av{background:var(--bg-active);color:var(--ink-2)}
.mail-msg-body{padding:0 16px 14px 52px;white-space:pre-wrap;overflow-wrap:anywhere;color:var(--ink-2);line-height:1.58}
.mail-onbehalf{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin:0 14px 10px 52px;padding:6px 10px;background:var(--accent-soft);color:var(--accent-strong);border-radius:var(--r-md);font-size:12.5px;font-weight:500}
.mail-link{border:0;background:none;padding:0;color:inherit;text-decoration:underline;text-underline-offset:2px;font-weight:600;font-size:inherit}
.mail-link:hover{color:var(--ink)}
.mail-atts{display:flex;gap:8px;flex-wrap:wrap;padding:0 14px 14px 52px}
.mail-att{display:inline-flex;align-items:center;gap:8px;border:1px solid var(--line);background:var(--bg);border-radius:var(--r-md);padding:5px 10px;font-size:12.5px;color:var(--ink-2);max-width:100%}
button.mail-att:hover{background:var(--bg-hover)}
.mail-draft{border:1px solid var(--accent);border-radius:var(--r-lg);background:var(--bg-raised);overflow:hidden}
.mail-draft-head{display:flex;align-items:flex-start;gap:10px;padding:12px 14px;background:var(--accent-soft)}
.mail-draft-text{padding:14px 16px;white-space:pre-wrap;overflow-wrap:anywhere;line-height:1.58;color:var(--ink)}
.mail-draft-foot{display:flex;gap:8px;flex-wrap:wrap;padding:10px 14px;border-top:1px solid var(--line)}
.mail-replybar{display:flex;gap:8px;flex-wrap:wrap;padding-top:6px}
.mail-keys{display:flex;gap:14px;flex-wrap:wrap;justify-content:center;margin-top:8px;font-size:12px}
.mail-dock{position:absolute;right:16px;bottom:0;z-index:20;display:flex;flex-direction:row-reverse;align-items:flex-end;gap:12px;pointer-events:none;max-width:calc(100% - 32px)}
.mail-cw{pointer-events:auto;position:relative;width:500px;max-width:calc(100vw - 32px);height:560px;max-height:calc(100vh - var(--topbar) - 20px);display:flex;flex-direction:column;background:var(--bg-raised);border:1px solid var(--line-strong);border-bottom:0;border-radius:var(--r-lg) var(--r-lg) 0 0;box-shadow:var(--shadow-3);overflow:hidden}
.mail-cw.min{width:260px;height:auto}
.mail-cw.min>:not(.mail-cw-head){display:none}
.mail-cw.big{position:fixed;left:50%;top:calc(var(--topbar) + 4vh);transform:translateX(-50%);width:min(880px,calc(100vw - 48px));height:min(720px,calc(100vh - var(--topbar) - 8vh));max-height:none;border-bottom:1px solid var(--line-strong);border-radius:var(--r-lg);box-shadow:var(--shadow-3),0 0 0 100vmax color-mix(in srgb,var(--code-bg) 42%,transparent)}
.mail-cw-head{display:flex;align-items:center;gap:2px;padding:5px 6px 5px 4px;background:var(--bg-sunk);border-bottom:1px solid var(--line)}
.mail-cw-title{flex:1;min-width:0;border:0;background:none;text-align:left;font-weight:600;font-size:13px;padding:4px 10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;border-radius:var(--r-sm)}
.mail-cw-field{position:relative;display:flex;align-items:flex-start;gap:8px;padding:6px 14px;border-bottom:1px solid var(--line);min-height:36px}
.mail-cw-lab{width:30px;flex:none;color:var(--ink-3);font-size:13px;line-height:24px}
.mail-rcs{flex:1;min-width:0;display:flex;flex-wrap:wrap;gap:4px;align-items:center}
.mail-rc-list{display:contents}
.mail-rc{display:inline-flex;align-items:center;gap:2px;background:var(--bg-sunk);border:1px solid var(--line);border-radius:12px;padding:0 3px 0 9px;font-size:12.5px;line-height:22px;max-width:100%}
.mail-rc button{display:grid;place-items:center;width:16px;height:16px;border:0;background:none;border-radius:50%;color:var(--ink-3);padding:0}
.mail-rc button:hover{background:var(--bg-active);color:var(--ink)}
.mail-rcs input,.mail-cw-subj{flex:1;min-width:110px;border:0;outline:0;background:none;padding:0;line-height:24px}
.mail-cw-subj{font-weight:500}
.mail-cw-ccs{display:flex;gap:8px;line-height:24px;color:var(--ink-3);font-size:12.5px}
.mail-ac{position:absolute;left:52px;right:14px;top:calc(100% - 2px);z-index:5;background:var(--bg-raised);border:1px solid var(--line);border-radius:var(--r-md);box-shadow:var(--shadow-2);padding:4px;display:flex;flex-direction:column;gap:1px}
.mail-ac .avatar{width:22px;height:22px;font-size:9.5px}
.mail-cw-body{flex:1;min-height:72px;border:0;outline:0;resize:none;background:none;padding:12px 14px;line-height:1.58;width:100%}
.mail-cw-body.b{font-weight:600} .mail-cw-body.i{font-style:italic}
.mail-cw-atts{display:flex;gap:6px;flex-wrap:wrap;padding:0 14px 8px}
.mail-ai{display:flex;flex-direction:column;gap:8px;padding:10px 14px;border-top:1px solid var(--line);background:var(--accent-soft)}
.mail-ai .input{padding:5px 10px}
.mail-ai .chip{padding:2px 10px;font-size:12.5px;background:var(--bg-raised)}
.mail-ai .chip:hover{background:var(--bg-hover)}
.mail-cw-fmt{display:flex;align-items:center;gap:2px;padding:4px 10px;border-top:1px solid var(--line)}
.mail-cw-fmt .icon-btn{width:28px;height:28px;font-family:var(--serif);font-size:15px}
.mail-cw-fmt .icon-btn[aria-pressed="true"]{background:var(--bg-active);color:var(--ink)}
.mail-cw-fmt .sep{width:1px;height:18px;background:var(--line);margin:0 6px}
.mail-ai-btn{color:var(--accent-strong)}
.mail-ai-btn[aria-pressed="true"]{background:var(--accent-soft)}
.mail-cw-foot{display:flex;align-items:center;gap:8px;padding:8px 10px 10px}
.mail-split{display:inline-flex}
.mail-split .btn:first-child{border-radius:var(--r-md) 0 0 var(--r-md);padding:6px 16px}
.mail-split .btn:last-child{border-radius:0 var(--r-md) var(--r-md) 0;padding:6px 7px;border-left-color:color-mix(in srgb,var(--on-accent) 40%,transparent)}
.mail-toast{display:flex;align-items:center;gap:14px}
.mail-toast button{border:0;background:none;color:inherit;font-weight:600;text-decoration:underline;text-underline-offset:2px;padding:0}
.mail-sw{width:24px;height:24px;border-radius:50%;border:2px solid var(--bg-raised);background:var(--c);box-shadow:0 0 0 1px var(--line-strong);padding:0}
.mail-sw[aria-pressed="true"]{box-shadow:0 0 0 2px var(--ink)}
.mail-rule{display:flex;align-items:flex-start;gap:12px;padding:10px 0;border-bottom:1px solid var(--line)}
.mail-rule:last-child{border-bottom:0}
.mail-check{display:flex;align-items:flex-start;gap:8px;font-size:13px;color:var(--ink-2)}
.mail-check svg{color:var(--ok);margin-top:2px}
@media (max-width:1100px){
  .mail-body{grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,44%) minmax(0,1fr)}
  .mail-listcol{border-right:0;border-bottom:1px solid var(--line-strong)}
}
@media (max-width:900px){
  .mail-root{grid-template-columns:minmax(0,1fr)}
  .mail-compose-sm{display:inline-flex}
  .mail-dock{right:8px;max-width:calc(100% - 16px)}
}
`);

/* ---------- people ---------- */
const ME={name:D.me.name,email:D.me.email};
const P={
  marta:{name:'Marta Lindqvist',email:'marta.lindqvist@corvin-analytics.example'},
  corvinBilling:{name:'Corvin Analytics billing',email:'billing@corvin-analytics.example'},
  joel:{name:'Joel Okonkwo',email:'joel.okonkwo@haldendental.example'},
  ruth:{name:'Ruth Abara',email:'ruth.abara@pellowfreight.example'},
  kofi:{name:'Kofi Mensah',email:'kofi.mensah@brightwellclinics.example'},
  tomas:{name:'Tomas Reyes',email:'tomas.reyes@northgatesupply.example'},
  ngBilling:{name:'Northgate Supply accounts',email:'accounts@northgatesupply.example'},
  nadia:{name:'Nadia Brandt',email:'nadia@tarnvale.example'},
  ines:{name:'Ines Duarte',email:'ines.duarte@meridianledger.example'},
  irene:{name:'Irene Castell',email:'irene@larkfield.example'},
  priya:{name:'Priya Nair',email:'priya@larkfield.example'},
  dana:{name:'Dana Whitlock',email:'dana@larkfield.example'},
  omar:{name:'Omar Haddad',email:'omar@larkfield.example'},
  marcus:{name:'Marcus Bell',email:'marcus@larkfield.example'},
  lena:{name:'Lena Fischer',email:'lena@larkfield.example'},
  sam:{name:'Sam Okafor',email:'sam@larkfield.example'},
  helen:{name:'Helen Varga',email:'helen@larkfield.example'},
  people:{name:'Larkfield People team',email:'people@larkfield.example'},
  it:{name:'Larkfield IT help desk',email:'it-help@larkfield.example'},
  analyst:{name:'Analyst bot',email:'analyst-bot@larkfield.example',bot:true},
  quill:{name:'Quillstay bookings',email:'receipts@quillstay.example'},
  guild:{name:'The RevOps Guild',email:'hello@revopsguild.example'},
  spam1:{name:'Rewards Centre',email:'winner@prize-rewards.example'},
  spam2:{name:'RankBoost Team',email:'growth@rankboost.example'},
  expo:{name:'Ledger Expo events',email:'events@ledgerexpo.example'},
  lunch:{name:'Fern and Rye Kitchen',email:'orders@fernandrye.example'}
};
const CONTACTS=[P.marta,P.joel,P.ruth,P.kofi,P.tomas,P.nadia,P.ines,P.irene,P.priya,P.dana,P.omar,P.marcus,P.lena,P.sam,P.helen,P.ngBilling];

/* ---------- rules and labels ---------- */
const RULES=[
  {id:'reply',name:'Reply to existing threads',desc:'Bots may answer in a thread that someone else started, when the answer is a fact they can check. They never start a new conversation.',on:true},
  {id:'invoices',name:'File invoices',desc:'Match each invoice to a purchase order or subscription, label it Finance and schedule the payment. Mismatches come to you.',on:true},
  {id:'meetings',name:'Move and accept meetings',desc:'Accept or move a meeting when every attendee is free, inside working hours and in the same week.',on:true},
  {id:'drafts',name:'Draft replies for you',desc:'Prepare a reply and leave it under the thread. Nothing is sent until you press Send.',on:true},
  {id:'negotiate',name:'Negotiate within limits',desc:'Reply to vendors on price and terms, up to a 5% increase or $5,000 a year. Anything above that comes back to you.',on:false},
  {id:'customers',name:'Never email customers first without a person',desc:'Bots do not open a conversation with a customer and do not answer complaints. A person sends the first message.',on:true,locked:true},
  {id:'summary',name:'Send me a weekly summary',desc:'Every Monday at 08:00, a list of what bots sent, filed and drafted in your mail.',on:true}
];
const SWATCHES=['--info','--ok','--warn','--accent','--bad','--ink-3'];
const labels=[{id:'customers',name:'Customers',c:'--info'},{id:'finance',name:'Finance',c:'--ok'},{id:'legal',name:'Legal',c:'--warn'},{id:'hiring',name:'Hiring',c:'--accent'},{id:'internal',name:'Internal',c:'--ink-3'}];

/* ---------- time ---------- */
const NOW=Date.now(),DAY=1440,DAYS=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],MON=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const p2=n=>String(n).padStart(2,'0');
const hm=d=>p2(d.getHours())+':'+p2(d.getMinutes());
function fmtShort(ts){const d=new Date(ts),n=new Date();if(d.toDateString()===n.toDateString())return hm(d);return d.getDate()+' '+MON[d.getMonth()]+(d.getFullYear()!==n.getFullYear()?' '+d.getFullYear():'')}
function fmtLong(ts){const d=new Date(ts);return DAYS[d.getDay()]+' '+d.getDate()+' '+MON[d.getMonth()]+', '+hm(d)}
function at(days,h){const d=new Date();d.setDate(d.getDate()+days);d.setHours(h,0,0,0);return d.getTime()}
function nextDow(dow,h){const n=(dow-new Date().getDay()+7)%7||7;return at(n,h)}
function laterToday(){const d=new Date(Date.now()+3*3600e3);d.setMinutes(0,0,0);return d.getTime()}

/* ---------- threads ---------- */
let seq=0;const threads=[];
function msg(from,to,mins,body,x){return Object.assign({id:'m'+(++seq),from,to,cc:[],bcc:[],time:NOW-mins*60000,body,atts:[]},x||{})}
function add(t){const o=Object.assign({id:'t'+(++seq),folder:'inbox',starred:false,unread:false,snoozed:null,sched:null,labels:[],triage:null,botDraft:null,botNote:null,mark:null},t);threads.push(o);return o}
const A=(name,size)=>({name,size});

const corvin=add({subject:'Renewal terms for 2027',unread:true,triage:'needs',labels:['finance'],msgs:[
  msg(ME,[P.marta],3*DAY+95,`Hi Marta,

Our Corvin Analytics subscription renews on 1 January. Could you send the terms for 2027? We expect to stay at 60 seats, and finance has asked us to keep any increase at or below 5%.

Thanks,
Asha`,{cc:[P.marcus]}),
  msg(P.marta,[ME],26,`Hi Asha,

Thanks for your patience. The quote for 2027 is attached. In short:

- 60 seats on the Team plan at $41,200 for the year, an 8% increase on 2026
- A two-year term holds the increase at 3% a year, which is $39,295 for 2027
- Auto-renewal with 60 days' notice, as in the current agreement

The quote is valid until 12 December. I am happy to walk through it on a call if that is easier.

Best,
Marta Lindqvist
Account manager, Corvin Analytics`,{cc:[P.marcus],atts:[A('Corvin_quote_2027.pdf','184 KB')]})],
  botDraft:{bot:'procurement-bot',why:'The one-year price is 8% above 2026. Your renewal policy asks for 5% or less, and the two-year option meets it. The draft accepts two years and asks to drop auto-renewal, which finance flagged last year.',
    limit:'Procurement bot will reply in this thread for you. It may accept up to a 5% increase or $5,000 a year. Anything above that comes back to you.',
    text:`Hi Marta,

Thank you for the quote. We would like to take the two-year term at 3% a year for 60 seats, billed annually, which puts 2027 at $39,295.

One change before we sign: please replace auto-renewal with a renewal reminder 90 days before the end of the term. If that works, send the order form and we will return it this week.

Best,
Asha`}});

add({subject:'Third billing error in two months',unread:true,triage:'needs',labels:['customers'],mark:{text:'Needs a person',tone:'warn'},msgs:[
  msg(P.ruth,[ME],48,`Asha,

This is the third invoice in two months with the wrong seat count. We are being billed for 85 seats and we have had 70 since September. I raised this with support on 2 November and again on 9 November, and was told both times that it was fixed.

I need a corrected invoice and a credit for the overcharge by Friday, and I would like to understand why this keeps happening. If it is not resolved I will have to take it to our finance director, and we will be reviewing the contract in January.

Ruth Abara
Head of operations, Pellow Freight`,{atts:[A('Invoice_PF-3317.pdf','88 KB')]})],
  botNote:{bot:'revops-bot',rule:'customers',warn:true,text:'RevOps bot read this and did not reply. Complaints from customers always go to a person. It did find the likely cause: the September seat reduction was saved on the deal but not on the billing record.',
    checks:['The sender is a customer and the message is a complaint.','The rule "Never email customers first without a person" also covers complaints.','The bot checked the deal and the billing record so you have the facts before you reply.']}});

add({subject:'Data clause sign-off: Halden Dental agreement',unread:true,starred:true,triage:'needs',labels:['legal','customers'],msgs:[
  msg(P.irene,[ME],130,`Hi Asha,

I have signed off clause 9.3 (data processing) in the Halden Dental agreement as amended. The redline is attached. Two points to confirm before it goes out:

1. Patient scheduling data stays in the EU region. Halden asked for this in writing.
2. The sub-processor list in schedule C is the October version.

If both are right, reply to confirm and I will mark the agreement as cleared. I am out on Friday, so tomorrow is best.

Irene Castell
Legal counsel, Larkfield`,{cc:[P.priya],atts:[A('Halden_agreement_clause_9-3_redline.docx','62 KB')]})]});

add({subject:'Q3 pipeline review: can you check slide 6?',unread:true,triage:'needs',msgs:[
  msg(P.dana,[ME],185,`Asha, the deck from the Analyst bot looks good. One thing: slide 6 shows the mid-market win rate at 31%, but my notes from the forecast call say 27%. Can you check which is right before I present on Thursday?

If the bot counted by close date instead of created date, that would explain the gap.

Dana`,{atts:[A('Q3_pipeline_review_v2.pdf','2.1 MB')]})]});

add({subject:'Senior RevOps analyst: shortlist of three',unread:true,triage:'needs',labels:['hiring'],msgs:[
  msg(P.nadia,[ME],2*DAY+20,`Hi Asha,

Following our call, I have three candidates for the senior RevOps analyst role who fit the brief: strong on forecasting, comfortable owning the CRM data model, and available within eight weeks. Profiles to follow on Monday.

Nadia Brandt
Tarn and Vale Search`),
  msg(ME,[P.nadia],2*DAY-150,`Thanks Nadia. Please include notice periods and salary expectations. We can interview in the week of 30 November.

Asha`,{cc:[P.lena]}),
  msg(P.nadia,[ME],240,`Hi Asha,

The shortlist is attached. A quick summary:

- Yusuf Karim: five years in revenue operations at a logistics software company, four weeks' notice
- Elise Marchetti: led forecasting for a 60-person sales team, eight weeks' notice
- Tobias Lund: an analyst moving up from a data team, available immediately

All three are inside the salary band you gave me. Could you send two or three interview slots for the week of 30 November?

Nadia`,{cc:[P.lena],atts:[A('Shortlist_senior_RevOps_analyst.pdf','420 KB')]})]});

add({subject:'Seat true-up before we sign',triage:'needs',labels:['customers'],msgs:[
  msg(P.kofi,[ME],310,`Hi Asha,

We are ready to sign the Growth plan for 120 seats. One question from our finance team: if we add clinics during the year, are the extra seats billed from the day they are added or at the next true-up? The order form says quarterly true-up but the proposal says monthly.

Kofi Mensah
Operations lead, Brightwell Clinics`,{cc:[P.priya]})],
  botDraft:{bot:'revops-bot',why:'The order form is the binding document and it says quarterly. The draft confirms that and offers to correct the proposal. No price, term or seat count is changed.',
    limit:'RevOps bot will answer follow-up questions in this thread for you. It may not change price, term or seat count. Those come back to you.',
    text:`Hi Kofi,

Good question, and thank you for spotting the mismatch. The order form is correct: extra seats are counted at the quarterly true-up and billed from that date, not from the day they are added.

I will send a corrected proposal today so both documents match. If your finance team would like this confirmed on a call, I am free on Thursday afternoon.

Best,
Asha`}});

add({subject:'Halden want to add 10 seats in January',unread:true,triage:'needs',labels:['customers'],msgs:[
  msg(P.priya,[ME],395,`Asha, quick one. Joel at Halden Dental mentioned they are opening two more practices in January and will need about 10 more seats. Do we quote those at the corrected Growth price with the 12% discount, or at list? I would like to tell him this week.

Priya`)]});

add({subject:'Reforecast: your numbers by Thursday',triage:'needs',labels:['finance','internal'],msgs:[
  msg(P.marcus,[ME],DAY+120,`Hi Asha,

We are closing the Q4 reforecast on Friday. I need the following from RevOps by the end of Thursday:

- Expected new bookings for December, by segment
- Renewals at risk, with amounts
- Any tooling spend that is not already in the plan (the Corvin renewal is in at $40,000)

The template is in the finance folder. Shout if anything is unclear.

Marcus`,{cc:[P.dana]})]});

add({subject:'Thank you for the corrected contract',unread:true,triage:'handled',labels:['customers'],mark:{text:'Replied by RevOps bot',tone:'ok'},msgs:[
  msg(P.joel,[ME],2*DAY+110,`Hi Asha,

The contract we received on Friday shows the Starter tier price, but the quote we agreed with Priya was for Growth with 45 seats. Could you send a corrected version? We would like to sign this week.

Joel Okonkwo
Operations director, Halden Dental`,{cc:[P.priya]}),
  msg(ME,[P.joel],DAY+60,`Hi Joel,

You are right, and thank you for flagging it. The contract was generated at the wrong tier. The corrected version is attached: Growth tier, 45 seats, with the 12% discount Priya agreed with you.

Nothing else in the agreement has changed. If anything looks off, reply here and Asha or Priya will pick it up.

Sent by RevOps bot for Asha Raman, Larkfield`,{cc:[P.priya],atts:[A('Halden_Dental_contract_v3.pdf','238 KB')],byBot:'revops-bot',rule:'reply',
    checks:['Joel started this thread, so it is not a first contact with a customer.','The 12% discount was approved by Asha Raman earlier the same day.','The attachment is the contract version stored on the deal, unchanged.']}),
  msg(P.joel,[ME],75,`Thank you, this is exactly what we agreed. Our managing partner will sign on Thursday and I will send the countersigned copy straight after. I appreciate the fast turnaround.

Joel`,{cc:[P.priya]})],
  botNote:{bot:'revops-bot',rule:'reply',text:'RevOps bot read Joel\'s reply. Nothing is needed from you until the signed copy arrives on Thursday.',
    checks:['The reply is a thank you and asks no question.','A reminder is set for Thursday in case the signed copy does not arrive.']}});

add({subject:'Invoice NG-20418 for October',triage:'handled',labels:['finance'],mark:{text:'Filed',tone:'info'},msgs:[
  msg(P.ngBilling,[ME],95,`Hello,

Please find attached invoice NG-20418 for October deliveries.

Amount due: $2,318.40
Payment terms: 30 days
Purchase order: PO-4471

Questions about this invoice can be sent to accounts@northgatesupply.example.

Northgate Supply, accounts receivable`,{atts:[A('Invoice_NG-20418.pdf','96 KB')]})],
  botNote:{bot:'procurement-bot',rule:'invoices',text:'Procurement bot matched this invoice to purchase order PO-4471. The amounts agree at $2,318.40. It labelled the thread Finance and scheduled payment for 28 November.',
    checks:['The purchase order number on the invoice exists and is open.','The invoice total equals the purchase order total, $2,318.40.','The amount is below the bot\'s $5,000 spending limit.']}});

add({subject:'Can we move Thursday\'s review to Friday?',triage:'handled',mark:{text:'Replied by RevOps bot',tone:'ok'},msgs:[
  msg(P.tomas,[ME],200,`Hi Asha,

Something has come up on our side on Thursday afternoon. Could we move the quarterly supply review to Friday at 10:00 or 14:00? Same attendees, same link.

Tomas Reyes
Account lead, Northgate Supply`,{cc:[P.marcus]}),
  msg(ME,[P.tomas],188,`Hi Tomas,

Friday at 10:00 works for Asha and for Marcus. I have moved the invite and kept the same link. See you then.

Sent by RevOps bot for Asha Raman, Larkfield`,{cc:[P.marcus],byBot:'revops-bot',rule:'meetings',
    checks:['Tomas started this thread and asked for the change.','Asha and Marcus were both free on Friday at 10:00.','The new time is inside working hours and in the same week.']}),
  msg(P.tomas,[ME],170,`Perfect, thank you. See you on Friday.

Tomas`,{cc:[P.marcus]})]});

add({subject:'Supplier details form: please confirm',triage:'handled',labels:['finance'],mark:{text:'Replied by Procurement bot',tone:'ok'},msgs:[
  msg(P.ngBilling,[ME],DAY+260,`Hello,

We are updating our customer records before the year end. Could you send Larkfield's current supplier details form, including the billing address and the contact for remittance advice?

Thank you,
Northgate Supply, accounts receivable`),
  msg(ME,[P.ngBilling],DAY+245,`Hello,

Larkfield's current supplier details form is attached. It is the version our finance team approved in September. Remittance advice should go to finance@larkfield.example.

Sent by Procurement bot for Asha Raman, Larkfield`,{atts:[A('Larkfield_supplier_details_2026.pdf','74 KB')],byBot:'procurement-bot',rule:'reply',
    checks:['Northgate Supply started this thread and is an approved vendor.','The form is a standard document that finance approved for sharing.','No bank details or payment instructions were changed.']})]});

add({subject:'Invoice CA-88102 for November',triage:'handled',labels:['finance'],mark:{text:'Filed',tone:'info'},msgs:[
  msg(P.corvinBilling,[ME],DAY+180,`Hello Asha,

Your invoice for November is attached.

Plan: Team, 60 seats
Amount due: $3,179.17
Due date: 30 November

This invoice will be charged to the payment method on file.

Corvin Analytics billing`,{atts:[A('Invoice_CA-88102.pdf','71 KB')]})],
  botNote:{bot:'procurement-bot',rule:'invoices',text:'Procurement bot matched this invoice to the Corvin Analytics subscription. The amount is the same as last month. It was labelled Finance and needs no action.',
    checks:['The invoice matches the subscription record for 60 seats.','The monthly amount is unchanged from October.','Payment is automatic, so nothing was paid by the bot.']}});

add({subject:'Receipt for your stay in Leeds, 10 to 12 November',triage:'handled',labels:['finance'],mark:{text:'Filed',tone:'info'},msgs:[
  msg(P.quill,[ME],2*DAY+400,`Thank you for staying with us.

Guest: Asha Raman
Stay: 10 to 12 November, 2 nights
Total paid: $286.00

Your receipt is attached. We hope to see you again.

Quillstay`,{atts:[A('Quillstay_receipt_48213.pdf','54 KB')]})],
  botNote:{bot:'procurement-bot',rule:'invoices',text:'Procurement bot matched this receipt to your approved trip to the Halden Dental office and attached it to expense report EX-1182.',
    checks:['The dates match an approved trip in your calendar.','The amount is inside the travel policy for two nights.']}});

add({subject:'Weekly pipeline summary: week 46',unread:true,triage:'fyi',mark:{text:'From Analyst bot',tone:'info'},msgs:[
  msg(P.analyst,[ME],420,`Good morning Asha,

Here is the pipeline for the week ending 15 November.

- Open pipeline: $4.82M across 137 deals, up 6% on last week
- New this week: 19 deals worth $612,000
- Closed won: 7 deals, $288,400
- Closed lost: 4 deals, $131,000, mostly on price
- Slipped from November to December: 5 deals, $240,500

Worth a look: three deals over $100,000 have had no activity for 14 days (Brightwell Clinics, the Pellow Freight expansion and Osric Health).

The full report is attached. Reply with a question and I will answer from the same data.

Analyst bot, for Revenue operations`,{cc:[P.dana],atts:[A('Pipeline_week_46.xlsx','310 KB')]})]});

add({subject:'Office closed on Friday 27 November, and a simpler expense policy',unread:true,triage:'fyi',labels:['internal'],msgs:[
  msg(P.people,[ME],DAY+300,`Hello everyone,

Two things for your diary.

The office is closed on Friday 27 November for the floor refit. Please work from home that day. Desks on the third floor need to be cleared by Thursday at 17:00.

From 1 December the expense policy is simpler: receipts under $50 no longer need a manager's approval, and travel booked through the IT bot is approved automatically inside your team's budget. The full policy is on the People page.

Thank you,
The People team`)]});

add({subject:'All hands moved to Wednesday at 15:00',triage:'fyi',labels:['internal'],msgs:[
  msg(P.helen,[ME],520,`Hi all,

This month's all hands moves from Tuesday to Wednesday at 15:00 so the product team can show the invoice export live. Same room, same link. Questions can go in the usual channel beforehand.

Helen`)]});

add({subject:'CSV export on invoices ships this week',triage:'fyi',labels:['internal'],msgs:[
  msg(P.sam,[ME],600,`Asha, a heads up for your team. CSV export on invoices is in staging now and should reach production on Thursday once the release is approved. Fourteen customers asked for it, and the Builder bot will tell them when it is live.

If sales want a one-line description for calls: "Export any invoice list to CSV from the Billing page."

Sam`,{cc:[P.dana]})]});

add({subject:'Jo starts on Monday: first-week plan',triage:'fyi',labels:['hiring','internal'],msgs:[
  msg(P.lena,[ME],700,`Hi Asha,

Jo's first-week plan is attached. The IT bot has created the accounts and the laptop order is waiting for approval. Could you block an hour on Monday at 11:00 for a team introduction, and nominate someone to pair with Jo on the CRM walkthrough on Tuesday?

Thanks,
Lena`,{atts:[A('Jo_first_week_plan.pdf','128 KB')]})]});

add({subject:'Lead routing by region: dry run results',triage:'fyi',msgs:[
  msg(P.omar,[ME],DAY+70,`Asha,

The dry run finished. Out of 212 leads from last week, the new routing sent 209 to the rep we would have picked by hand. The three misses were leads with no country set, which now go to the review queue instead of a rep.

Results are attached. The workflow is ready to turn on once it is approved.

Omar`,{atts:[A('routing_dry_run.csv','38 KB')]})]});

add({subject:'Five ways teams are forecasting in 2027',triage:'fyi',msgs:[
  msg(P.guild,[ME],DAY+480,`This month in the Guild newsletter:

- Why weighted pipeline is losing ground to deal-level forecasts
- A simple template for a weekly forecast call
- How three teams cut slipped deals by a third
- Member survey: what you track and what you ignore
- Events near you in January

You are receiving this because you joined the RevOps Guild. You can change how often we write in your preferences.`)]});

add({subject:'Demo follow-up and pricing',triage:'fyi',snoozed:nextDow(1,8),msgs:[
  msg(P.ines,[ME],3*DAY+200,`Hi Asha,

Thank you for your time on Thursday. As promised, the pricing summary for Meridian Ledger is attached, along with answers to the two questions about CRM sync.

I know you are not looking at billing tools until the new year, so I will leave this with you. Happy to pick it up whenever suits.

Ines Duarte
Meridian Ledger`,{atts:[A('Meridian_Ledger_pricing_summary.pdf','156 KB')]})]});

add({folder:'sent',subject:'Halden discount approved at 12%',msgs:[
  msg(ME,[P.priya],DAY+90,`Priya,

I have approved the 12% discount on the Halden Dental contract. It is above the 10% policy, so it is recorded with the reason: we quoted the Growth price in writing and the contract was generated at the wrong tier.

The RevOps bot has regenerated the contract and sent it to Joel. Please keep future discounts for Halden inside 10% unless we talk first.

Asha`)]});

add({folder:'sent',starred:true,subject:'Notes from the forecast call',labels:['internal'],msgs:[
  msg(ME,[P.dana],2*DAY+300,`Dana,

Notes from this morning:

- December commit is $1.1M, best case $1.4M
- Mid-market win rate is 27% on created date, which is the number to use
- Two renewals at risk: Pellow Freight (billing errors) and Osric Health (champion left)
- Action for me: check the seat counts on every deal that changed in September

Asha`,{cc:[P.omar]})]});

add({folder:'sent',subject:'Agenda for the quarterly supply review',msgs:[
  msg(ME,[P.tomas],4*DAY+60,`Hi Tomas,

The agenda for Thursday is attached. The main items are delivery times in October, the price list for 2027 and moving invoices to monthly.

Asha`,{cc:[P.marcus],atts:[A('Supply_review_agenda.pdf','66 KB')]})]});

add({folder:'drafts',subject:'Reforecast numbers from RevOps',msgs:[
  msg(ME,[P.marcus],90,`Hi Marcus,

Here are the RevOps numbers for the Q4 reforecast.

New bookings for December, by segment:
- Mid-market:
- Enterprise:

Renewals at risk: Pellow Freight and Osric Health. Amounts to follow.`)]});

add({folder:'drafts',subject:'Interview slots for the week of 30 November',replyTo:null,msgs:[
  msg(ME,[P.nadia],230,`Hi Nadia,

Thank you for the shortlist. We would like to meet all three. Slots that work for us:`,{cc:[P.lena]})]});

add({folder:'scheduled',sched:at(1,8),subject:'Pipeline review prep: please update close dates',msgs:[
  msg(ME,[P.priya,P.omar],60,`Hi both,

Before Thursday's pipeline review, please check the close date on every open deal over $50,000. Five deals slipped last week without a date change, and the forecast is only as good as those dates.

It should take ten minutes. Thank you.

Asha`,{cc:[P.dana]})]});

add({folder:'archive',subject:'Quarterly business review notes: Halden Dental',labels:['customers'],msgs:[
  msg(P.priya,[ME],9*DAY,`Asha, notes from the Halden review are attached. They are happy with onboarding, want invoices by practice, and are planning two more practices early next year.

Priya`,{atts:[A('Halden_QBR_notes.pdf','112 KB')]})]});

add({folder:'archive',subject:'Reminder: new sign-in policy from 1 December',labels:['internal'],msgs:[
  msg(P.it,[ME],7*DAY,`Hello,

From 1 December every work app will ask for a passkey or a security key when you sign in. If you have not set one up yet, open your account page and follow the steps. It takes about two minutes.

Bots are not affected. They sign in with their own identities.

Larkfield IT help desk`)]});

add({folder:'archive',subject:'Usage report for Q3',labels:['finance'],msgs:[
  msg(P.marta,[ME],41*DAY,`Hi Asha,

Your Q3 usage report is attached. 57 of 60 seats were active each month, and the forecasting dashboards were the most used feature.

Best,
Marta`,{atts:[A('Corvin_usage_Q3.pdf','203 KB')]})]});

add({folder:'spam',unread:true,subject:'You have been selected for a reward',msgs:[
  msg(P.spam1,[ME],DAY+30,`Congratulations. Your address was selected in our monthly draw. Confirm your details within 24 hours to claim your reward. This offer cannot be transferred.`)]});

add({folder:'spam',subject:'Reach the first page in 7 days',msgs:[
  msg(P.spam2,[ME],3*DAY,`Hello, we looked at your website and found 14 issues that are holding back your ranking. Reply to this message for a free report.`)]});

add({folder:'trash',subject:'Last chance to register: Ledger Expo webinar',msgs:[
  msg(P.expo,[ME],5*DAY,`Registration for Thursday's webinar on revenue reporting closes tonight. Places are limited. Register from the link in your invitation.`)]});

add({folder:'trash',subject:'Your lunch order is confirmed',msgs:[
  msg(P.lunch,[ME],6*DAY,`Thanks for your order. 8 lunches for Thursday at 12:30, delivered to reception. Total: $94.00.`)]});

/* ---------- state ---------- */
const FOLDERS=[['inbox','Inbox','inbox'],['starred','Starred','star'],['snoozed','Snoozed','clock'],['sent','Sent','send'],['drafts','Drafts','file'],['scheduled','Scheduled','calendar'],['all','All mail','mail'],['spam','Spam','alert'],['trash','Trash','trash']];
const BOTVIEWS=[['bots-sent','Sent by bots','send'],['bots-drafted','Drafted for you','edit'],['bots-handled','Handled without you','check']];
const TABS=[['needs','Needs you'],['handled','Handled by bots'],['fyi','For your information'],['all','All']];
const DATES={today:'Today',7:'Last 7 days',30:'Last 30 days',older:'Older than 30 days'};
const FAKE_FILES=[A('Q4_reforecast_RevOps.xlsx','248 KB'),A('Meeting_notes.pdf','96 KB'),A('Pricing_summary_2027.pdf','132 KB'),A('Billing_record_screenshot.png','410 KB')];
let view='inbox',tab='needs',q='',openId=corvin.id,el=null,cseq=0,fileN=0,toastT=null;
const filters={from:null,att:false,unread:false,date:null,bot:false},checked=new Set(),expanded=new Set(),composes=[];
corvin.unread=false;

/* ---------- helpers ---------- */
const $=s=>el?el.querySelector(s):null;
const byId=id=>threads.find(t=>t.id===id);
const last=t=>t.msgs[t.msgs.length-1];
const isMe=p=>p.email===ME.email;
const live=t=>t.folder==='inbox'||t.folder==='archive'||t.folder==='sent';
const ini=n=>n.split(/\s+/).filter(w=>/^[A-Za-z]/.test(w)).slice(0,2).map(w=>w[0].toUpperCase()).join('')||'?';
const names=l=>l.map(p=>isMe(p)?'me':p.name).join(', ');
const snip=b=>b.replace(/\s+/g,' ').trim().slice(0,150);
const hasAtt=t=>t.msgs.some(m=>m.atts.length);
const touched=t=>!!(t.botDraft||t.botNote||t.msgs.some(m=>m.byBot||m.draftedBy||m.from.bot));
const plural=n=>n===1?'Conversation':n+' conversations';
const remove=t=>{const i=threads.indexOf(t);if(i>=0)threads.splice(i,1)};
const label=id=>labels.find(l=>l.id===id);
const validView=v=>FOLDERS.some(f=>f[0]===v)||BOTVIEWS.some(f=>f[0]===v)||(typeof v==='string'&&v.indexOf('label:')===0&&!!label(v.slice(6)));
function toast(t){const m=document.getElementById('mail-toast');if(m)m.remove();CW.toast(t)}
function actionToast(text,btn,fn,ms){const o=document.getElementById('toast');if(o)o.hidden=true;let t=document.getElementById('mail-toast');if(t)t.remove();
  t=document.createElement('div');t.id='mail-toast';t.className='toast mail-toast';t.setAttribute('role','status');t.innerHTML=`<span>${E(text)}</span><button>${E(btn)}</button>`;
  t.querySelector('button').addEventListener('click',()=>{t.remove();fn()});document.body.appendChild(t);clearTimeout(toastT);toastT=setTimeout(()=>t.remove(),ms||5000)}
/* CW.menu closes itself on the click that is still bubbling, so menus are opened on the next tick. */
const menu=(anchor,items)=>setTimeout(()=>CW.menu(anchor,items),0);
const soon=what=>toast(what+' is not part of this concept yet.');

function inView(t,v){
  switch(v){
    case 'inbox':return t.folder==='inbox'&&!t.snoozed;
    case 'starred':return t.starred&&t.folder!=='trash'&&t.folder!=='spam';
    case 'snoozed':return t.folder==='inbox'&&!!t.snoozed;
    case 'sent':return live(t)&&t.msgs.some(m=>isMe(m.from));
    case 'drafts':case 'scheduled':case 'spam':case 'trash':return t.folder===v;
    case 'all':return live(t);
    case 'bots-sent':return live(t)&&t.msgs.some(m=>m.byBot);
    case 'bots-drafted':return live(t)&&!!t.botDraft;
    case 'bots-handled':return live(t)&&t.triage==='handled';
    default:return live(t)&&t.labels.includes(v.slice(6));
  }
}
function viewName(){const f=FOLDERS.concat(BOTVIEWS).find(x=>x[0]===view);if(f)return f[1];const l=label(view.slice(6));return l?l.name:'Mail'}
function count(v){const l=threads.filter(t=>inView(t,v));
  if(v==='drafts'||v==='scheduled'||v==='snoozed'||v==='bots-drafted')return l.length;
  if(v==='inbox'||v==='spam'||v.indexOf('label:')===0)return l.filter(t=>t.unread).length;return 0}
function matches(t,s){if(!s)return true;
  return t.subject.toLowerCase().includes(s)||t.msgs.some(m=>(m.from.name+' '+m.from.email+' '+m.to.concat(m.cc).map(p=>p.name+' '+p.email).join(' ')+' '+m.body+' '+m.atts.map(a=>a.name).join(' ')).toLowerCase().includes(s))||(t.botDraft&&t.botDraft.text.toLowerCase().includes(s))}
function passes(t){const f=filters,ts=last(t).time;
  if(f.from&&!t.msgs.some(m=>m.from.email===f.from))return false;
  if(f.att&&!hasAtt(t))return false;if(f.unread&&!t.unread)return false;if(f.bot&&!touched(t))return false;
  if(f.date==='today'&&new Date(ts).toDateString()!==new Date().toDateString())return false;
  if((f.date==='7'||f.date==='30')&&ts<Date.now()-(+f.date)*864e5)return false;
  if(f.date==='older'&&ts>=Date.now()-30*864e5)return false;return true}
function visible(){const s=q.trim().toLowerCase(),junk=view==='spam'||view==='trash';
  return threads.filter(t=>(s&&!junk?t.folder!=='spam'&&t.folder!=='trash':inView(t,view)&&(view!=='inbox'||tab==='all'||t.triage===tab))&&matches(t,s)&&passes(t)).sort((a,b)=>last(b).time-last(a).time)}

/* ---------- side ---------- */
function drawSide(){const s=$('#mail-side');if(!s)return;
  const item=(id,name,icon,dot)=>{const n=count(id);return `<button class="nav-item${n&&(id==='inbox'||id.indexOf('label:')===0)?' has-unread':''}" data-act="view" data-view="${E(id)}" ${view===id&&!q.trim()?'aria-current="page"':''}>${dot||I(icon)}<span class="truncate">${E(name)}</span>${n?`<span class="count">${n}</span>`:''}</button>`};
  s.innerHTML=`<button class="btn btn-accent mail-compose" data-act="compose">${I('edit',16)}Compose<span class="kbd">c</span></button>
  <nav class="mail-nav" aria-label="Folders">${FOLDERS.map(f=>item(f[0],f[1],f[2])).join('')}</nav>
  <div class="mail-nav"><div class="mail-side-head"><span>Labels</span><button class="icon-btn sm" data-act="new-label" aria-label="Create label" title="Create label">${I('plus',14)}</button></div>
  ${labels.map(l=>item('label:'+l.id,l.name,'',`<span class="mail-ldot" style="--c:var(${l.c})"></span>`)).join('')}</div>
  <div class="mail-nav"><div class="mail-side-head"><span>Bots</span><span style="padding-right:6px">${I('bot',14)}</span></div>${BOTVIEWS.map(f=>item(f[0],f[1],f[2])).join('')}</div>
  <div class="mail-side-foot"><button class="nav-item" data-act="rules">${I('sliders')}<span class="grow">Mail rules</span><span class="count">${RULES.filter(r=>r.on).length} on</span></button>
  <div class="mail-quota" aria-hidden="true"><i></i></div><div class="t-xs t-mute" style="padding:0 8px">2.1 GB of 30 GB used</div></div>`}

/* ---------- top: search and filters ---------- */
function drawChips(){const c=$('#mail-chips');if(!c)return;const f=filters,l=[];
  if(f.from){const p=CONTACTS.concat(Object.values(P)).find(x=>x.email===f.from);l.push(['from','From: '+(p?p.name:f.from)])}
  if(f.att)l.push(['att','Has attachment']);if(f.unread)l.push(['unread','Unread']);if(f.bot)l.push(['bot','From a bot']);if(f.date)l.push(['date',DATES[f.date]]);
  c.hidden=!l.length;
  c.innerHTML=l.map(x=>`<button class="mail-fchip" data-act="unfilter" data-k="${x[0]}" aria-label="Remove filter: ${E(x[1])}">${E(x[1])}${I('x',12)}</button>`).join('')+(l.length>1?`<button class="btn btn-ghost btn-sm" data-act="clear-filters">Clear all</button>`:'');
  const x=$('#mail-qx');if(x)x.hidden=!q}
function filterMenu(a){const f=filters,on=v=>v?'On':'',set=(k,v)=>{f[k]=v;checked.clear();drawChips();drawList()};
  menu(a,[{label:'From a person',icon:'user',hint:f.from?'On':'',onClick:()=>{const seen=[];threads.forEach(t=>t.msgs.forEach(m=>{if(!isMe(m.from)&&!seen.includes(m.from))seen.push(m.from)}));
      menu(a,seen.slice(0,14).map(p=>({label:p.name,icon:p.bot?'bot':'user',onClick:()=>set('from',p.email)})))}},
    {label:'Has attachment',icon:'paperclip',hint:on(f.att),onClick:()=>set('att',!f.att)},
    {label:'Unread',icon:'mail',hint:on(f.unread),onClick:()=>set('unread',!f.unread)},
    {label:'From a bot',icon:'bot',hint:on(f.bot),onClick:()=>set('bot',!f.bot)},'sep']
   .concat(Object.keys(DATES).map(k=>({label:DATES[k],icon:'calendar',hint:on(f.date===k),onClick:()=>set('date',f.date===k?null:k)})))
   .concat(['sep',{label:'Clear all filters',icon:'x',onClick:clearFilters}]))}
function clearFilters(){Object.assign(filters,{from:null,att:false,unread:false,date:null,bot:false});drawChips();drawList()}

/* ---------- list ---------- */
function markHtml(t){const out=[];
  if(t.botDraft)out.push(`<span class="pill accent">${I('bot',12)}Draft ready</span>`);
  if(t.mark)out.push(`<span class="pill ${t.mark.tone}">${I('bot',12)}${E(t.mark.text)}</span>`);
  if(t.snoozed)out.push(`<span class="pill warn">${I('clock',12)}Until ${E(fmtLong(t.snoozed))}</span>`);
  if(t.sched)out.push(`<span class="pill info">${I('calendar',12)}Sends ${E(fmtLong(t.sched))}</span>`);
  t.labels.forEach(id=>{const l=label(id);if(l)out.push(`<span class="mail-lchip"><i style="--c:var(${l.c})"></i>${E(l.name)}</span>`)});
  return out.join('')}
function who(t){const m=last(t);
  if(t.folder==='drafts')return `<span class="mail-draftword">Draft</span> to ${E(names(m.to)||'no one yet')}`;
  const other=[...t.msgs].reverse().find(x=>!isMe(x.from));
  if(!other||t.folder==='scheduled'||view==='sent')return 'To: '+E(names(m.to));
  return E(other.from.name)+(t.msgs.length>1?` <span class="t-mute" style="font-weight:400">${t.msgs.length}</span>`:'')}
function rowHtml(t){const m=last(t),meta=markHtml(t),sel=checked.has(t.id);
  return `<div class="mail-row${t.unread?' unread':''}${sel?' sel':''}${t.id===openId?' open':''}" role="listitem">
  <input type="checkbox" data-chk="${t.id}" ${sel?'checked':''} aria-label="Select conversation: ${E(t.subject)}">
  <button class="icon-btn sm mail-star${t.starred?' on':''}" data-act="star" data-id="${t.id}" aria-label="${t.starred?'Remove star':'Add star'}" aria-pressed="${t.starred}">${I('star',15)}</button>
  <button class="mail-row-main" data-act="open" data-id="${t.id}"><span class="mail-from">${who(t)}</span>
  <span class="mail-subj-line"><span class="mail-subj">${E(t.subject)}</span><span class="mail-snip"> · ${E(snip(m.body))}</span></span>
  <span class="mail-time">${hasAtt(t)?I('paperclip',13):''}${E(fmtShort(m.time))}</span>${meta?`<span class="mail-meta">${meta}</span>`:''}</button>
  <div class="mail-quick"><button class="icon-btn sm" data-act="archive" data-id="${t.id}" aria-label="Archive" title="Archive">${I('archive',15)}</button>
  <button class="icon-btn sm" data-act="delete" data-id="${t.id}" aria-label="Delete" title="Delete">${I('trash',15)}</button>
  <button class="icon-btn sm" data-act="unread" data-id="${t.id}" aria-label="${t.unread?'Mark read':'Mark unread'}" title="${t.unread?'Mark read':'Mark unread'}">${I('mail',15)}</button>
  <button class="icon-btn sm" data-act="snooze" data-id="${t.id}" aria-label="Snooze" title="Snooze">${I('clock',15)}</button></div></div>`}
function emptyHtml(){const filtered=q.trim()||Object.values(filters).some(Boolean);
  if(filtered)return `<div class="empty">${I('search',22)}<div>No mail matches your search.</div><div class="t-xs">Try fewer words or remove a filter.</div><button class="btn btn-sm" data-act="reset-search" style="margin-top:6px">Clear search and filters</button></div>`;
  const M={inbox:{needs:['check','Nothing needs you right now.','Bots put mail here when it needs a person.'],handled:['bot','Bots have not handled anything yet.','Mail they reply to or file shows up here.'],fyi:['info','Nothing to read.','Newsletters, summaries and announcements land here.'],all:['inbox','Your inbox is empty.','New mail will appear here.']}[tab],
    starred:['star','No starred mail.','Star a conversation to find it again quickly.'],snoozed:['clock','Nothing is snoozed.','Snoozed mail comes back to the inbox at the time you choose.'],sent:['send','Nothing sent yet.','Mail sent by you or by a bot on your behalf appears here.'],
    drafts:['file','No drafts.','Closing a message you are writing saves it here.'],scheduled:['calendar','Nothing is scheduled.','Use the arrow next to Send to send a message later.'],all:['mail','No mail.','Archived and inbox mail appears here.'],
    spam:['shield','No spam.','Suspicious mail is kept here for 30 days.'],trash:['trash','Trash is empty.','Deleted mail stays here for 30 days.'],
    'bots-sent':['send','Bots have not sent anything.','Every message a bot sends on your behalf is listed here.'],'bots-drafted':['edit','No drafts are waiting.','When a bot prepares a reply, it waits here for you.'],'bots-handled':['check','Nothing was handled without you.','Mail that bots filed or answered appears here.']}[view]||['tag','No mail with this label.','Add the label to a conversation from the label menu.'];
  return `<div class="empty">${I(M[0],22)}<div>${M[1]}</div><div class="t-xs">${M[2]}</div></div>`}
function drawList(){const h=$('#mail-lhead'),l=$('#mail-list');if(!h||!l)return;const list=visible(),ids=list.map(t=>t.id);
  [...checked].forEach(id=>{if(!ids.includes(id))checked.delete(id)});const n=checked.size;
  let top;
  if(q.trim())top=`<b style="font-weight:600">Search results</b><span class="t-xs t-mute truncate">${view==='spam'||view==='trash'?'in '+viewName():'in all mail except Spam and Trash'}</span>`;
  else if(view==='inbox')top=`<div class="tabs mail-tabs" role="tablist" aria-label="Inbox triage">${TABS.map(x=>{const c=threads.filter(t=>inView(t,'inbox')&&(x[0]==='all'||t.triage===x[0])&&t.unread).length;
    return `<button class="tab" role="tab" aria-selected="${tab===x[0]}" data-act="tab" data-tab="${x[0]}">${x[1]}${c?`<span class="mail-tabn">${c}</span>`:''}</button>`}).join('')}</div>`;
  else top=`<b style="font-weight:600">${E(viewName())}</b><span class="t-xs t-mute truncate grow">${view==='spam'||view==='trash'?'Deleted for good after 30 days':view==='bots-sent'?'Sent on your behalf, with the rule that allowed it':view==='bots-drafted'?'Waiting for you to send, edit or discard':view==='bots-handled'?'Replied to or filed without asking you':''}</span>${view==='trash'&&list.length?`<button class="btn btn-sm btn-danger" data-act="empty-trash">Empty trash</button>`:''}`;
  const tools=n?`<span style="color:var(--ink);font-weight:500">${n} selected</span><span class="grow"></span>
    <button class="icon-btn sm" data-act="archive" aria-label="Archive selected" title="Archive">${I('archive',15)}</button><button class="icon-btn sm" data-act="delete" aria-label="Delete selected" title="Delete">${I('trash',15)}</button>
    <button class="icon-btn sm" data-act="read" aria-label="Mark selected as read" title="Mark read">${I('mail',15)}</button><button class="icon-btn sm" data-act="label" aria-label="Label selected" title="Label">${I('tag',15)}</button>
    <button class="icon-btn sm" data-act="move" aria-label="Move selected" title="Move">${I('folder',15)}</button><button class="btn btn-ghost btn-sm" data-act="clear-sel">Clear</button>`
   :`<span>${list.length===1?'1 conversation':list.length+' conversations'}</span><span class="grow"></span><button class="icon-btn sm" data-act="refresh" aria-label="Check for new mail" title="Check for new mail">${I('refresh',14)}</button>`;
  h.innerHTML=`<div class="mail-lrow">${top}</div><div class="mail-lrow tools"><input type="checkbox" data-chk-all aria-label="Select all conversations" ${list.length&&n===list.length?'checked':''} ${list.length?'':'disabled'}>${tools}</div>`;
  const all=h.querySelector('[data-chk-all]');all.indeterminate=n>0&&n<list.length;
  l.innerHTML=list.length?list.map(rowHtml).join(''):emptyHtml()}

/* ---------- reading pane ---------- */
function msgHtml(t,m,isLast){const open=isLast||expanded.has(m.id),bot=m.byBot?CW.bot(m.byBot):null,db=m.draftedBy?CW.bot(m.draftedBy):null;
  const av=bot||m.from.bot?`<span class="avatar bot">${I('bot',15)}</span>`:`<span class="avatar${isMe(m.from)?'':' mail-av'}">${E(ini(m.from.name))}</span>`;
  const nm=bot?bot.name+' for '+ME.name:m.from.name;
  if(!open)return `<div class="mail-msg"><button class="mail-msg-id shut" data-act="toggle-msg" data-mid="${m.id}" aria-expanded="false">${av}<span class="mail-msg-who">${E(nm)}</span><span class="truncate t-mute grow t-sm">${E(snip(m.body))}</span><span class="mail-time">${m.atts.length?I('paperclip',13):''}${E(fmtShort(m.time))}</span></button></div>`;
  const id=`${av}<span class="col grow" style="gap:0"><span class="truncate"><span class="mail-msg-who">${E(nm)}</span> <span class="t-xs t-mute">${E(m.from.email)}</span></span><span class="t-xs t-mute truncate">to ${E(names(m.to))}${m.cc.length?', cc '+E(names(m.cc)):''}${m.bcc.length?', bcc '+E(names(m.bcc)):''}</span></span>`;
  return `<div class="mail-msg"><div class="mail-msg-head">${isLast?`<div class="mail-msg-id">${id}</div>`:`<button class="mail-msg-id" data-act="toggle-msg" data-mid="${m.id}" aria-expanded="true">${id}</button>`}
  <span class="mail-time" style="padding-top:5px">${E(fmtLong(m.time))}</span><button class="icon-btn sm" data-act="reply" data-mid="${m.id}" aria-label="Reply" title="Reply">${I('reply',15)}</button><button class="icon-btn sm" data-act="msg-more" data-mid="${m.id}" aria-label="More actions for this message">${I('more',15)}</button></div>
  ${bot?`<div class="mail-onbehalf">${I('bot',14)}<span>Sent by ${E(bot.name)} on your behalf</span><button class="mail-link" data-act="why" data-mid="${m.id}">Why</button></div>`:''}
  ${db?`<div class="mail-onbehalf">${I('bot',14)}<span>Drafted by ${E(db.name)}, sent by you</span></div>`:''}
  <div class="mail-msg-body">${E(m.body)}</div>
  ${m.atts.length?`<div class="mail-atts">${m.atts.map(a=>`<button class="mail-att" data-act="att">${I('file',15)}<span class="truncate">${E(a.name)}</span><span class="t-mute">${E(a.size)}</span></button>`).join('')}</div>`:''}</div>`}
function draftHtml(t){const d=t.botDraft,b=CW.bot(d.bot);
  return `<div class="mail-draft"><div class="mail-draft-head"><span class="avatar bot">${I('bot',15)}</span><div class="col grow" style="gap:2px"><div class="row wrap"><b style="font-weight:600">Draft reply from ${E(b.name)}</b><span class="pill">Not sent</span></div>
  <div class="t-sm t-2"><b style="font-weight:500">Why this draft:</b> ${E(d.why)}</div></div></div>
  <div class="mail-draft-text">${E(d.text)}</div>
  <div class="mail-draft-foot"><button class="btn btn-accent" data-act="d-send">${I('send',14)}Send</button><button class="btn" data-act="d-edit">${I('edit',14)}Edit</button><button class="btn btn-ghost" data-act="d-discard">Discard</button><span class="grow"></span><button class="btn" data-act="d-negotiate">${I('zap',14)}Let the bot negotiate within limits</button></div></div>`}
function drawRead(){const r=$('#mail-read');if(!r)return;const t=byId(openId);
  if(!t){openId=null;r.innerHTML=`<div class="empty" style="flex:1">${I('mail',26)}<div>Select a conversation to read it.</div><div class="t-xs">Bots have sorted your inbox. "Needs you" is the short list.</div>
    <div class="mail-keys t-mute"><span><span class="kbd">c</span> Compose</span><span><span class="kbd">/</span> Search</span><span><span class="kbd">e</span> Archive</span><span><span class="kbd">#</span> Delete</span><span><span class="kbd">r</span> Reply</span></div></div>`;return}
  const tb=(act,icon,lab)=>`<button class="icon-btn" data-act="${act}" aria-label="${lab}" title="${lab}">${I(icon,16)}</button>`;
  const banner=t.sched?`<div class="mail-note">${I('calendar',16)}<div class="grow">Scheduled to send on ${E(fmtLong(t.sched))}.</div><button class="btn btn-sm" data-act="send-now">Send now</button><button class="btn btn-sm" data-act="cancel-send">Cancel send</button></div>`
    :t.snoozed?`<div class="mail-note">${I('clock',16)}<div class="grow">Snoozed until ${E(fmtLong(t.snoozed))}.</div><button class="btn btn-sm" data-act="unsnooze">Unsnooze</button></div>`
    :t.folder==='spam'?`<div class="mail-note warn">${I('alert',16)}<div class="grow">This conversation is in Spam. Links and attachments are switched off.</div><button class="btn btn-sm" data-act="not-spam">Not spam</button></div>`
    :t.folder==='trash'?`<div class="mail-note">${I('trash',16)}<div class="grow">This conversation is in Trash.</div><button class="btn btn-sm" data-act="restore">Restore</button></div>`:'';
  const note=t.botNote?`<div class="mail-note${t.botNote.warn?' warn':''}"><span class="avatar bot" style="width:24px;height:24px">${I('bot',13)}</span><div class="grow">${E(t.botNote.text)} <button class="mail-link" data-act="why-note">Why</button></div></div>`:'';
  const canReply=t.folder!=='scheduled'&&t.folder!=='drafts';
  r.innerHTML=`<div class="mail-rbar">${tb('archive','archive','Archive')}${tb('delete','trash','Delete')}${tb('unread','mail','Mark unread')}${tb('snooze','clock','Snooze')}<span class="sep"></span>${tb('label','tag','Label')}${tb('move','folder','Move to')}${tb('print','file','Print')}
  <span class="grow"></span><button class="icon-btn mail-star${t.starred?' on':''}" data-act="star" data-id="${t.id}" aria-label="${t.starred?'Remove star':'Add star'}" aria-pressed="${t.starred}">${I('star',16)}</button>${tb('close-read','x','Close conversation')}</div>
  <div class="mail-rhead"><h2>${E(t.subject)}</h2><div class="row wrap">${t.mark?`<span class="pill ${t.mark.tone}">${I('bot',12)}${E(t.mark.text)}</span>`:''}${t.botDraft?`<span class="pill accent">${I('bot',12)}Draft ready</span>`:''}
  ${t.labels.map(id=>{const l=label(id);return l?`<button class="mail-lchip" data-act="unlabel" data-l="${l.id}" aria-label="Remove label ${E(l.name)}"><i style="--c:var(${l.c})"></i>${E(l.name)}${I('x',11)}</button>`:''}).join('')}
  <span class="t-xs t-mute">${t.msgs.length===1?'1 message':t.msgs.length+' messages'}</span></div></div>
  <div class="mail-thread">${banner}${note}${t.msgs.map((m,i)=>msgHtml(t,m,i===t.msgs.length-1)).join('')}${t.botDraft?draftHtml(t):''}
  ${canReply?`<div class="mail-replybar"><button class="btn" data-act="reply">${I('reply',15)}Reply</button><button class="btn" data-act="reply-all">${I('users',15)}Reply all</button><button class="btn" data-act="forward">${I('forward',15)}Forward</button></div>`:''}</div>`}
function refresh(){drawSide();drawChips();drawList();drawRead()}

/* ---------- thread actions ---------- */
function mutate(ids,fn,text,close){const ts=ids.map(byId).filter(Boolean);if(!ts.length){toast('Select a conversation first.');return}
  const snap=ts.map(t=>({t,folder:t.folder,snoozed:t.snoozed,unread:t.unread,sched:t.sched}));ts.forEach(fn);
  ts.forEach(t=>{checked.delete(t.id);if(close&&t.id===openId)openId=null});refresh();
  if(text)actionToast(text.replace('%',plural(ts.length)),'Undo',()=>{snap.forEach(s=>{if(!threads.includes(s.t))threads.push(s.t);Object.assign(s.t,{folder:s.folder,snoozed:s.snoozed,unread:s.unread,sched:s.sched})});refresh()})}
const moveTo=(ids,folder,text)=>mutate(ids,t=>{t.folder=folder;t.snoozed=null;if(folder!=='scheduled')t.sched=null},text,folder!=='inbox');
function archive(ids){const ok=ids.filter(id=>{const t=byId(id);return t&&(t.folder==='inbox'||t.folder==='sent')});
  if(!ok.length){toast(ids.length?'Only mail in Inbox or Sent can be archived.':'Select a conversation first.');return}moveTo(ok,'archive','% archived.')}
function del(ids){const ts=ids.map(byId).filter(Boolean);if(!ts.length){toast('Select a conversation first.');return}
  const gone=ts.filter(t=>t.folder==='trash'),rest=ts.filter(t=>t.folder!=='trash');
  if(rest.length)moveTo(rest.map(t=>t.id),'trash','% moved to Trash.');
  if(gone.length)mutate(gone.map(t=>t.id),remove,'% deleted for good.',true)}
function setUnread(ids,v){mutate(ids,t=>{t.unread=v},null,v);toast(v?'Marked as unread.':'Marked as read.')}
function snoozeMenu(a,ids){const set=ts=>mutate(ids,t=>{if(t.folder!=='inbox')t.folder='inbox';t.snoozed=ts},'% snoozed until '+fmtLong(ts)+'.',true);
  const opts=[['Later today',laterToday()],['Tomorrow morning',at(1,8)],['This weekend',nextDow(6,9)],['Next week',nextDow(1,8)]];
  const items=opts.map(o=>({label:o[0],icon:'clock',hint:fmtLong(o[1]),onClick:()=>set(o[1])}));
  if(ids.some(id=>{const t=byId(id);return t&&t.snoozed}))items.push('sep',{label:'Unsnooze',icon:'inbox',onClick:()=>mutate(ids,t=>{t.snoozed=null},'% back in the inbox.')});
  menu(a,items)}
function labelMenu(a,ids){const ts=ids.map(byId).filter(Boolean);if(!ts.length){toast('Select a conversation first.');return}
  menu(a,labels.map(l=>{const all=ts.every(t=>t.labels.includes(l.id));return {label:l.name,icon:all?'check':'tag',hint:all?'Applied':'',onClick:()=>{
    ts.forEach(t=>{const i=t.labels.indexOf(l.id);if(all){if(i>=0)t.labels.splice(i,1)}else if(i<0)t.labels.push(l.id)});refresh();toast(all?'Label "'+l.name+'" removed.':'Labelled "'+l.name+'".')}}})
   .concat(['sep',{label:'Create label',icon:'plus',onClick:()=>newLabel(ts)}]))}
function moveMenu(a,ids){if(!ids.map(byId).filter(Boolean).length){toast('Select a conversation first.');return}
  menu(a,[['inbox','Inbox','inbox'],['archive','All mail (archive)','archive'],['spam','Spam','alert'],['trash','Trash','trash']].map(f=>({label:f[1],icon:f[2],onClick:()=>moveTo(ids,f[0],'% moved to '+f[1].replace(' (archive)','')+'.')})))}
function open(id){const t=byId(id);if(!t)return;if(t.folder==='drafts'){openDraft(t);return}t.unread=false;openId=id;refresh();const r=$('#mail-read');if(r)r.scrollTop=0}

/* ---------- modals ---------- */
function newLabel(applyTo){let c=SWATCHES[labels.length%SWATCHES.length];
  const m=CW.modal({title:'Create label',body:`<div class="field"><label for="mail-ln">Label name</label><input class="input" id="mail-ln" maxlength="24" placeholder="For example: Renewals"></div>
   <div class="field"><label>Colour</label><div class="row" id="mail-sws">${SWATCHES.map(s=>`<button class="mail-sw" style="--c:var(${s})" data-sw="${s}" aria-pressed="${s===c}" aria-label="Colour ${SWATCHES.indexOf(s)+1}"></button>`).join('')}</div></div>`,
   foot:`<button class="btn" data-close>Cancel</button><button class="btn btn-primary" id="mail-lsave">Create</button>`});
  const inp=m.querySelector('#mail-ln');
  m.querySelector('#mail-sws').addEventListener('click',e=>{const b=e.target.closest('[data-sw]');if(!b)return;c=b.dataset.sw;m.querySelectorAll('[data-sw]').forEach(x=>x.setAttribute('aria-pressed',x===b))});
  const save=()=>{const n=inp.value.trim();if(!n){toast('Give the label a name.');inp.focus();return}
    if(labels.some(l=>l.name.toLowerCase()===n.toLowerCase())){toast('A label with that name already exists.');return}
    const l={id:'l'+(++seq),name:n,c};labels.push(l);(applyTo||[]).forEach(t=>t.labels.push(l.id));CW.closeModal();refresh();toast('Label "'+n+'" created.')};
  m.querySelector('#mail-lsave').addEventListener('click',save);inp.addEventListener('keydown',e=>{if(e.key==='Enter')save()})}
function rulesModal(){
  const m=CW.modal({title:'Mail rules',body:`<div class="t-sm t-mute">What bots may do with your mail. Every action is marked on the thread and recorded in the audit log.</div>
   <div>${RULES.map(r=>`<div class="mail-rule"><div class="col grow" style="gap:2px"><div class="row"><b style="font-weight:500">${E(r.name)}</b>${r.locked?`<span class="pill">${I('lock',11)}Set by your admin</span>`:''}</div><div class="t-sm t-mute">${E(r.desc)}</div></div>
   <input type="checkbox" class="switch" data-rule="${r.id}" ${r.on?'checked':''} aria-label="${E(r.name)}"></div>`).join('')}</div>`,
   foot:`<button class="btn" id="mail-r-pol">Policies and limits</button><button class="btn btn-primary" data-close>Done</button>`});
  m.addEventListener('change',e=>{const s=e.target.closest('[data-rule]');if(!s)return;const r=RULES.find(x=>x.id===s.dataset.rule);
    if(r.locked){s.checked=true;toast('This rule is set for the whole workspace. Only an admin can change it.');return}
    r.on=s.checked;drawSide();toast(r.name+(r.on?' is on.':' is off. Bots will leave this to you.'))});
  m.querySelector('#mail-r-pol').addEventListener('click',()=>{CW.closeModal();CW.go('settings','policies')})}
function whyModal(botId,ruleId,checks){const b=CW.bot(botId),r=RULES.find(x=>x.id===ruleId)||RULES[0];
  const m=CW.modal({title:'Why '+b.name+' did this',body:`<div class="row"><span class="avatar bot">${I('bot',15)}</span><div class="col" style="gap:0"><b style="font-weight:500">${E(b.name)}</b><span class="t-xs t-mute">${E(b.team)} · owned by ${E(b.owner)} · ${E(b.mode)}</span></div></div>
   <div class="card col" style="gap:4px"><span class="t-label">Rule that applied</span><b style="font-weight:500">${E(r.name)}</b><span class="t-sm t-mute">${E(r.desc)}</span></div>
   <div class="col"><span class="t-label">What it checked first</span>${(checks||[]).map(c=>`<div class="mail-check">${I('check',15)}<span>${E(c)}</span></div>`).join('')}</div>
   <div class="t-xs t-mute">Signed in as ${E(b.id)}@larkfield.example with scope ${E(b.scope)}. Recorded in the audit log.</div>`,
   foot:`<button class="btn" id="mail-w-audit">Open audit log</button><button class="btn" id="mail-w-rules">Change this rule</button><button class="btn btn-primary" data-close>Done</button>`});
  m.querySelector('#mail-w-audit').addEventListener('click',()=>{CW.closeModal();CW.go('settings','audit')});
  m.querySelector('#mail-w-rules').addEventListener('click',rulesModal)}
function pickTime(cb){const d=new Date(at(1,9)),v=d.getFullYear()+'-'+p2(d.getMonth()+1)+'-'+p2(d.getDate())+'T'+hm(d);
  const m=CW.modal({title:'Pick a date and time',body:`<div class="field"><label for="mail-dt">Send on</label><input class="input" type="datetime-local" id="mail-dt" value="${v}"></div>`,foot:`<button class="btn" data-close>Cancel</button><button class="btn btn-primary" id="mail-dt-ok">Schedule send</button>`});
  m.querySelector('#mail-dt-ok').addEventListener('click',()=>{const ts=new Date(m.querySelector('#mail-dt').value).getTime();if(!ts||ts<Date.now()){toast('Pick a time in the future.');return}CW.closeModal();cb(ts)})}

/* ---------- bot drafts ---------- */
function draftTarget(t){const m=[...t.msgs].reverse().find(x=>!isMe(x.from))||last(t);return {to:[m.from],cc:m.cc.filter(p=>!isMe(p))}}
function sendBotDraft(t,asBot){const d=t.botDraft,b=CW.bot(d.bot),g=draftTarget(t),prev={mark:t.mark,triage:t.triage,note:t.botNote};
  const text=asBot?d.text.replace(/\n+Best,\nAsha\s*$/,'')+'\n\nSent by '+b.name+' for '+ME.name+', Larkfield':d.text;
  t.msgs.push(msg(ME,g.to,0,text,Object.assign({cc:g.cc,time:Date.now()},asBot?{byBot:d.bot,rule:'negotiate',checks:['You turned on "Let the bot negotiate within limits" for this thread.','The reply stays inside the limit: '+d.limit.split('. ').slice(1).join('. '),'The other side started this thread.']}:{draftedBy:d.bot})));
  t.botDraft=null;t.unread=false;
  if(asBot){t.triage='handled';t.mark={text:b.name+' is negotiating',tone:'accent'};t.botNote={bot:d.bot,rule:'negotiate',text:b.name+' is handling this thread within your limits and will bring it back if the other side asks for more.',checks:['You handed this thread to the bot.',d.limit]};
    const r=RULES.find(x=>x.id==='negotiate');r.on=true}
  else t.mark={text:'Sent, drafted by '+b.name,tone:'ok'};
  refresh();
  const undo=()=>{t.msgs.pop();t.botDraft=d;t.mark=prev.mark;t.triage=prev.triage;t.botNote=prev.note;refresh()};
  if(asBot){toast(d.limit);}else actionToast('Reply sent.','Undo',undo)}

/* ---------- compose ---------- */
function newCompose(init){
  if(composes.length>=4){toast('Close a message before you start another. Four can be open at once.');return null}
  const c=Object.assign({id:'c'+(++cseq),to:[],cc:[],bcc:[],showCc:false,showBcc:false,subject:'',body:'',atts:[],min:false,big:false,bold:false,italic:false,list:false,link:false,ai:true,threadId:null,draftId:null,fromBot:false,dirty:false},init||{});
  if(c.cc.length)c.showCc=true;if(c.bcc.length)c.showBcc=true;
  composes.forEach(x=>{x.min=true;x.big=false});composes.push(c);drawDock(c);return c}
function quote(m){return '\n\nOn '+fmtLong(m.time)+', '+m.from.name+' wrote:\n'+m.body.split('\n').map(l=>'> '+l).join('\n')}
function reply(t,m,all){m=m||last(t);const to=isMe(m.from)?m.to.slice():[m.from];
  const cc=all?m.to.concat(m.cc).filter(p=>!isMe(p)&&!to.some(x=>x.email===p.email)):[];
  newCompose({to,cc,subject:/^re:/i.test(t.subject)?t.subject:'Re: '+t.subject,body:quote(m),threadId:t.id,ai:false})}
function forward(t,m){m=m||last(t);newCompose({subject:/^fwd:/i.test(t.subject)?t.subject:'Fwd: '+t.subject,atts:m.atts.slice(),ai:false,
  body:'\n\n---------- Forwarded message ----------\nFrom: '+m.from.name+' <'+m.from.email+'>\nDate: '+fmtLong(m.time)+'\nSubject: '+t.subject+'\nTo: '+m.to.map(p=>p.name).join(', ')+'\n\n'+m.body})}
function openDraft(t){const ex=composes.find(c=>c.draftId===t.id);
  if(ex){composes.forEach(x=>{x.min=x!==ex;x.big=false});drawDock(ex);return}
  const m=last(t);newCompose({to:m.to.slice(),cc:m.cc.slice(),bcc:m.bcc.slice(),subject:t.subject==='(no subject)'?'':t.subject,body:m.body,atts:m.atts.slice(),draftId:t.id,threadId:t.replyTo||null,ai:false})}
function saveDraft(c){let t=c.draftId&&byId(c.draftId);const m=msg(ME,c.to.slice(),0,c.body,{cc:c.cc.slice(),bcc:c.bcc.slice(),atts:c.atts.slice(),time:Date.now()});
  if(t&&t.folder==='drafts'){t.subject=c.subject.trim()||'(no subject)';t.msgs=[m]}else t=add({folder:'drafts',subject:c.subject.trim()||'(no subject)',msgs:[m],replyTo:c.threadId});
  c.draftId=t.id}
function closeCompose(c,save){const i=composes.indexOf(c);if(i<0)return;composes.splice(i,1);
  if(save&&(c.dirty||c.draftId)&&(c.to.length||c.subject.trim()||c.body.trim()||c.atts.length)){saveDraft(c);toast('Saved to Drafts.')}
  drawDock();refresh()}
function discard(c){const t=c.draftId&&byId(c.draftId);if(t&&t.folder==='drafts')remove(t);const i=composes.indexOf(c);if(i>=0)composes.splice(i,1);drawDock();refresh();
  actionToast('Draft discarded.','Undo',()=>{c.draftId=null;c.dirty=true;composes.forEach(x=>{x.min=true;x.big=false});c.min=false;composes.push(c);drawDock(c)})}
function send(c,when){
  if(!c.to.length){toast('Add at least one recipient.');return}
  if(!c.subject.trim()&&!c.body.trim()){toast('Write a subject or a message first.');return}
  const m=msg(ME,c.to.slice(),0,c.body.trim(),{cc:c.cc.slice(),bcc:c.bcc.slice(),atts:c.atts.slice(),time:Date.now()}),subject=c.subject.trim()||'(no subject)';
  const dt=c.draftId&&byId(c.draftId);if(dt&&dt.folder==='drafts')remove(dt);
  const th=!when&&c.threadId&&byId(c.threadId);let undo;
  if(when){const t=add({folder:'scheduled',subject,sched:when,msgs:[m],replyTo:c.threadId});undo=()=>remove(t)}
  else if(th&&live(th)){const prev={d:th.botDraft,mark:th.mark};th.msgs.push(m);th.unread=false;if(c.fromBot&&th.botDraft){m.draftedBy=th.botDraft.bot;th.botDraft=null;th.mark={text:'Sent, edited by you',tone:'ok'}}
    undo=()=>{th.msgs.pop();th.botDraft=prev.d;th.mark=prev.mark}}
  else{const t=add({folder:'sent',subject,msgs:[m]});undo=()=>remove(t)}
  const i=composes.indexOf(c);if(i>=0)composes.splice(i,1);drawDock();refresh();
  actionToast(when?'Scheduled for '+fmtLong(when)+'.':'Message sent.','Undo',()=>{undo();c.draftId=null;c.dirty=true;composes.forEach(x=>{x.min=true;x.big=false});c.min=false;composes.push(c);drawDock(c);refresh();toast(when?'Schedule cancelled.':'Sending undone.')},5000)}

/* Draft with Claude: a small rule-based writer so the control works offline. */
const lcFirst=s=>s?s[0].toLowerCase()+s.slice(1):s;
function splitQuote(b){const i=b.search(/\n*(On [^\n]+ wrote:|-{10} Forwarded message)/);return i<0?[b,'']:[b.slice(0,i),b.slice(i)]}
function aiDraft(c,instr){const first=c.to[0]&&c.to[0].name.indexOf('@')<0?c.to[0].name.split(' ')[0]:'there',s=instr.trim(),topic=c.subject.replace(/^((re|fwd):\s*)+/i,'').trim(),l=(s||topic).toLowerCase();let p;
  if(/thank/.test(l))p=['Thank you for '+(topic?'your help with '+lcFirst(topic):'getting back to me so quickly')+'. It made a real difference on our side.','I will keep you posted as things move forward.'];
  else if(/declin|turn down|say no|not interested|pass on/.test(l))p=['Thank you for the offer. We have looked at it carefully and have decided not to go ahead at this time.','This is about timing and budget, not the quality of the proposal. If things change next quarter I will get back in touch.'];
  else if(/sorry|apolog|complain|error/.test(l))p=['I am sorry about this. You should not have had to raise it more than once, and I am now looking after it myself.','I have found the cause and I will send a corrected invoice and a credit for the difference by Friday. I will also confirm in writing what we have changed so it does not happen again.'];
  else if(/meet|call|slot|schedul|availab|interview/.test(l))p=['Could we find 30 minutes '+(topic?'to talk about '+lcFirst(topic):'to talk this through')+'? I am free on Wednesday at 10:00, Thursday at 14:00 or Friday at 11:00.','If none of those work, send me two or three times that suit you and I will make one of them work.'];
  else if(/invoice|credit|refund|billing|payment/.test(l))p=['I have checked the invoice against our records and the amounts agree. Payment is scheduled inside the 30 day terms.','If you need a purchase order number or a remittance advice, let me know and I will send it the same day.'];
  else if(/renew|price|discount|quote|terms|negotiat/.test(l))p=['Thank you for the quote. We would like to continue, but the increase is above what we have budgeted for next year.','Could you look at holding the increase at 3% in return for a two-year term? If that works, we can sign this week.'];
  else if(/confirm|sign.?off|approve|agree/.test(l))p=['I can confirm both points are correct as you describe them.','Please go ahead and mark this as cleared. Thank you for turning it around so quickly.'];
  else if(/follow|remind|chase|nudge|update/.test(l))p=['I am following up on '+(topic?lcFirst(topic):'my last message')+'. Do you have an update you can share?','If it helps, I am happy to join a short call to clear any open questions.'];
  else if(s)p=['I am writing about '+(topic?lcFirst(topic)+'. In short: ':'the following: ')+lcFirst(s).replace(/[.!?]+$/,'')+'.','Let me know if you need anything else from me to move this forward.'];
  else p=['Thank you for your message'+(topic?' about '+lcFirst(topic):'')+'. I have read it and will come back to you with a full answer by Thursday.','If anything is urgent before then, reply here and I will pick it up.'];
  return 'Hi '+first+',\n\n'+p.join('\n\n')+'\n\nBest,\n'+D.me.first}
const SIGN=/\n\n(Best|Warm regards|Kind regards|Thanks|Thank you|Regards),\n[^\n]+(\n[^\n]+)*\s*$/;
function tone(text,kind){let t=text.replace(/\s+$/,'');
  if(kind==='shorter'){const ps=t.split(/\n\n+/),greet=/^(hi|dear|hello)\b/i.test(ps[0])?ps.shift():'',sign=ps.length>1&&ps[ps.length-1].length<70&&/,\n/.test(ps[ps.length-1])?ps.pop():'';
    const sent=(ps[0]||'').match(/[^.!?]+[.!?]+/g)||[ps[0]||''];if(ps.length<2&&sent.length<3)return null;
    return [greet,sent.slice(0,2).join('').trim(),sign].filter(Boolean).join('\n\n')}
  if(kind==='warmer'){if(!/I hope your week is going well/.test(t))t=/^(Hi|Dear|Hello)[^\n]*\n\n/.test(t)?t.replace(/^((Hi|Dear|Hello)[^\n]*\n\n)/,'$1I hope your week is going well.\n\n'):'I hope your week is going well.\n\n'+t;
    if(!/really appreciate/.test(t))t=SIGN.test(t)?t.replace(SIGN,m=>'\n\nThank you again. I really appreciate your help with this.'+m):t+'\n\nThank you again. I really appreciate your help with this.';
    return SIGN.test(t)?t.replace(SIGN,'\n\nWarm regards,\n'+D.me.first):t+'\n\nWarm regards,\n'+D.me.first}
  t=t.replace(/^(Hi|Hello) ([^,\n]+),/,'Dear $2,').replace(/\bI'm\b/g,'I am').replace(/\bI'll\b/g,'I will').replace(/\bwe'll\b/gi,'we will').replace(/\bwe'd\b/gi,'we would').replace(/\bcan't\b/gi,'cannot').replace(/\bdon't\b/gi,'do not').replace(/\bit's\b/gi,'it is').replace(/\bThanks\b/g,'Thank you').replace(/I hope your week is going well\.\n\n/,'');
  const sign='\n\nKind regards,\n'+ME.name+'\n'+D.me.role+', '+D.company.name;return SIGN.test(t)?t.replace(SIGN,sign):t+sign}

function buildCw(c){const w=document.createElement('section');w.className='mail-cw';w.setAttribute('role','dialog');w.dataset.cid=c.id;
  const rc=(k,lab,extra)=>`<div class="mail-cw-field" data-f="${k}"><span class="mail-cw-lab">${lab}</span><div class="mail-rcs"><span class="mail-rc-list"></span><input aria-label="${lab} recipients" autocomplete="off" placeholder="${k==='to'?'Name or email address':''}"></div>${extra||''}<div class="mail-ac" hidden></div></div>`;
  w.innerHTML=`<header class="mail-cw-head"><button class="mail-cw-title" data-c="min"></button>
   <button class="icon-btn sm" data-c="min" aria-label="Minimise" title="Minimise">${I('chevron-down',15)}</button><button class="icon-btn sm" data-c="big" aria-label="Expand" title="Expand">${I('external',14)}</button><button class="icon-btn sm" data-c="close" aria-label="Save and close" title="Save and close">${I('x',15)}</button></header>
   ${rc('to','To',`<span class="mail-cw-ccs"><button class="mail-link" data-c="cc" style="font-weight:500">Cc</button><button class="mail-link" data-c="bcc" style="font-weight:500">Bcc</button></span>`)}${rc('cc','Cc')}${rc('bcc','Bcc')}
   <div class="mail-cw-field"><input class="mail-cw-subj" placeholder="Subject" aria-label="Subject"></div>
   <textarea class="mail-cw-body" aria-label="Message" placeholder="Write your message, or ask Claude to draft it"></textarea>
   <div class="mail-cw-atts"></div>
   <div class="mail-ai"><div class="row">${I('zap',15)}<input class="input grow mail-ai-in" aria-label="Instruction for Claude" placeholder="Say what the message should do, for example: ask to move the call to Friday"><button class="btn btn-primary btn-sm" data-c="ai-go">Draft</button></div>
   <div class="row wrap"><span class="t-xs t-mute">Rewrite</span><button class="chip" data-c="tone" data-tone="shorter">Shorter</button><button class="chip" data-c="tone" data-tone="warmer">Warmer</button><button class="chip" data-c="tone" data-tone="formal">More formal</button></div></div>
   <div class="mail-cw-fmt"><button class="icon-btn" data-c="fmt" data-k="bold" aria-label="Bold" title="Bold"><b>B</b></button><button class="icon-btn" data-c="fmt" data-k="italic" aria-label="Italic" title="Italic"><i>I</i></button>
   <button class="icon-btn" data-c="fmt" data-k="list" aria-label="Bulleted list" title="Bulleted list">${I('list',15)}</button><button class="icon-btn" data-c="fmt" data-k="link" aria-label="Link" title="Link">${I('globe',15)}</button><span class="sep"></span>
   <button class="icon-btn" data-c="attach" aria-label="Attach a file" title="Attach a file">${I('paperclip',15)}</button><span class="grow"></span><button class="btn btn-ghost btn-sm mail-ai-btn" data-c="ai">${I('zap',14)}Draft with Claude</button></div>
   <footer class="mail-cw-foot"><span class="mail-split"><button class="btn btn-accent" data-c="send">Send</button><button class="btn btn-accent" data-c="later" aria-label="Send later">${I('chevron-down',14)}</button></span>
   <span class="t-xs t-mute grow truncate">Closing saves to Drafts</span><button class="icon-btn" data-c="discard" aria-label="Discard draft" title="Discard draft">${I('trash',16)}</button></footer>`;
  const subj=w.querySelector('.mail-cw-subj'),body=w.querySelector('.mail-cw-body'),aiIn=w.querySelector('.mail-ai-in'),commits=[];
  subj.value=c.subject;body.value=c.body;
  const sync=()=>{w.classList.toggle('min',c.min);w.classList.toggle('big',c.big&&!c.min);
    const title=c.subject.trim()||(c.threadId?'Reply':'New message');w.setAttribute('aria-label',title);w.querySelector('.mail-cw-title').textContent=title;
    w.querySelector('[data-f="cc"]').hidden=!c.showCc;w.querySelector('[data-f="bcc"]').hidden=!c.showBcc;w.querySelector('[data-c="cc"]').hidden=c.showCc;w.querySelector('[data-c="bcc"]').hidden=c.showBcc;
    w.querySelector('.mail-ai').hidden=!c.ai;w.querySelector('[data-c="ai"]').setAttribute('aria-pressed',c.ai);
    w.querySelectorAll('[data-c="fmt"]').forEach(b=>b.setAttribute('aria-pressed',!!c[b.dataset.k]));body.classList.toggle('b',c.bold);body.classList.toggle('i',c.italic);
    const a=w.querySelector('.mail-cw-atts');a.hidden=!c.atts.length;a.innerHTML=c.atts.map((x,i)=>`<span class="mail-att">${I('file',14)}<span class="truncate">${E(x.name)}</span><span class="t-mute">${E(x.size)}</span><button class="icon-btn sm" data-c="unattach" data-i="${i}" aria-label="Remove ${E(x.name)}" style="width:18px;height:18px">${I('x',11)}</button></span>`).join('');
    const big=w.querySelector('[data-c="big"]');big.setAttribute('aria-label',c.big?'Dock to corner':'Expand');big.title=c.big?'Dock to corner':'Expand'};
  ['to','cc','bcc'].forEach(k=>{const f=w.querySelector('[data-f="'+k+'"]'),lst=f.querySelector('.mail-rc-list'),inp=f.querySelector('input'),ac=f.querySelector('.mail-ac');
    const known=e=>CONTACTS.find(p=>p.email===e);
    const draw=()=>{lst.innerHTML=c[k].map((p,i)=>`<span class="mail-rc" title="${E(p.email)}"><span class="truncate">${E(p.name)}</span><button data-rm="${i}" aria-label="Remove ${E(p.name)}">${I('x',11)}</button></span>`).join('');inp.placeholder=c[k].length||k!=='to'?'':'Name or email address'};
    const hide=()=>{ac.hidden=true;ac.innerHTML=''};
    const addP=p=>{if(p&&!c[k].some(x=>x.email===p.email))c[k].push(p);c.dirty=true;inp.value='';draw();hide()};
    const sugg=()=>{const v=inp.value.trim().toLowerCase();if(!v){hide();return}
      const l=CONTACTS.filter(p=>!c[k].some(x=>x.email===p.email)&&(p.name.toLowerCase().includes(v)||p.email.includes(v))).slice(0,5);if(!l.length){hide();return}
      ac.hidden=false;ac.innerHTML=l.map(p=>`<button class="menu-item" data-email="${E(p.email)}"><span class="avatar mail-av">${E(ini(p.name))}</span><span class="truncate" style="flex:none;max-width:45%">${E(p.name)}</span><span class="t-xs t-mute truncate grow">${E(p.email)}</span></button>`).join('')};
    const commit=()=>{const v=inp.value.trim().replace(/[,;]+$/,'');if(!v)return false;const first=ac.querySelector('[data-email]');
      if(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)){addP(known(v.toLowerCase())||{name:v,email:v.toLowerCase()});return true}
      if(first){addP(known(first.dataset.email));return true}return false};
    commits.push(commit);
    inp.addEventListener('input',sugg);
    inp.addEventListener('blur',()=>setTimeout(()=>{if(inp.value.indexOf('@')>0)commit();hide()},140));
    inp.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===','||e.key===';'){e.preventDefault();if(!commit()&&inp.value.trim())toast('Pick a contact or type a full email address.')}
      else if(e.key==='Tab'&&inp.value.trim()){if(commit())e.preventDefault()}
      else if(e.key==='Backspace'&&!inp.value&&c[k].length){c[k].pop();c.dirty=true;draw()}
      else if(e.key==='Escape'&&!ac.hidden){hide();e.stopPropagation()}});
    ac.addEventListener('mousedown',e=>e.preventDefault());
    ac.addEventListener('click',e=>{const b=e.target.closest('[data-email]');if(b){addP(known(b.dataset.email));inp.focus()}});
    lst.addEventListener('click',e=>{const b=e.target.closest('[data-rm]');if(b){c[k].splice(+b.dataset.rm,1);c.dirty=true;draw();inp.focus()}});
    f.querySelector('.mail-rcs').addEventListener('click',e=>{if(e.target===e.currentTarget)inp.focus()});draw()});
  subj.addEventListener('input',()=>{c.subject=subj.value;c.dirty=true;w.querySelector('.mail-cw-title').textContent=c.subject.trim()||(c.threadId?'Reply':'New message')});
  body.addEventListener('input',()=>{c.body=body.value;c.dirty=true});
  const setBody=v=>{c.body=v;body.value=v;c.dirty=true};
  const runAi=()=>{const parts=splitQuote(c.body);if(!aiIn.value.trim()&&!c.threadId&&!c.subject.trim()){toast('Say in a line what the message should do.');aiIn.focus();return}
    if(!c.subject.trim()&&aiIn.value.trim()){const s=aiIn.value.trim().replace(/[.!?]+$/,'');c.subject=s[0].toUpperCase()+s.slice(1,60);subj.value=c.subject}
    setBody(aiDraft(c,aiIn.value)+parts[1]);aiIn.value='';sync();toast('Claude drafted this. Read it before you send.')};
  aiIn.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();runAi()}});
  w.addEventListener('click',e=>{const b=e.target.closest('[data-c]');if(!b)return;const a=b.dataset.c;
    if(a==='min'){c.min=!c.min;c.big=false;if(!c.min)composes.forEach(x=>{if(x!==c)x.min=true});drawDock(c.min?null:c)}
    else if(a==='big'){c.big=!c.big;c.min=false;composes.forEach(x=>{if(x!==c){x.min=true;x.big=false}});drawDock(c)}
    else if(a==='close')closeCompose(c,true);
    else if(a==='discard')discard(c);
    else if(a==='cc'||a==='bcc'){c[a==='cc'?'showCc':'showBcc']=true;sync();w.querySelector('[data-f="'+a+'"] input').focus()}
    else if(a==='fmt'){const k=b.dataset.k;c[k]=!c[k];
      if(k==='list'&&c.list){const s=body.selectionStart,v=body.value,ls=v.lastIndexOf('\n',s-1)+1;setBody(v.slice(0,ls)+'- '+v.slice(ls));body.focus();body.setSelectionRange(s+2,s+2)}
      if(k==='link'){c.link=false;soon('Adding links')}sync()}
    else if(a==='attach'){const f=FAKE_FILES[fileN++%FAKE_FILES.length];c.atts.push(f);c.dirty=true;sync();toast('Attached '+f.name+'. This is a sample file.')}
    else if(a==='unattach'){c.atts.splice(+b.dataset.i,1);c.dirty=true;sync()}
    else if(a==='ai'){c.ai=!c.ai;sync();if(c.ai)aiIn.focus()}
    else if(a==='ai-go')runAi();
    else if(a==='tone'){const parts=splitQuote(c.body);if(!parts[0].trim()){toast('Write or draft something first.');return}
      const out=tone(parts[0],b.dataset.tone);if(out===null){toast('This is already short.');return}setBody(out+parts[1]);toast('Rewritten: '+b.textContent.toLowerCase()+'.')}
    else if(a==='send'){commits.forEach(f=>f());send(c)}
    else if(a==='later'){commits.forEach(f=>f());const go=ts=>send(c,ts);
      menu(b,[['Tomorrow morning',at(1,8)],['Tomorrow afternoon',at(1,13)],['Monday morning',nextDow(1,8)]].map(o=>({label:o[0],icon:'clock',hint:fmtLong(o[1]),onClick:()=>go(o[1])})).concat(['sep',{label:'Pick a date and time',icon:'calendar',onClick:()=>pickTime(go)}]))}
  });
  sync();return w}
function drawDock(focus){const d=$('#mail-dock');if(!d)return;d.innerHTML='';
  composes.forEach(c=>{const w=buildCw(c);d.appendChild(w);
    if(c===focus&&!c.min){const t=c.to.length?w.querySelector('.mail-cw-body'):w.querySelector('[data-f="to"] input');t.focus();if(t.setSelectionRange)try{t.setSelectionRange(0,0);t.scrollTop=0}catch(e){}}})}

/* ---------- events ---------- */
function targets(b){if(b.dataset.id)return [b.dataset.id];if(b.closest('#mail-lhead'))return [...checked];return openId?[openId]:[]}
function setView(v){view=v;q='';const i=$('#mail-q');if(i)i.value='';checked.clear();refresh();const l=$('#mail-list');if(l)l.scrollTop=0}
function onClick(e){const b=e.target.closest('[data-act]');if(!b||!el.contains(b)||b.closest('.mail-cw'))return;const a=b.dataset.act,ids=targets(b),t=byId(openId);
  const findMsg=()=>{let m=null;threads.some(x=>(m=x.msgs.find(y=>y.id===b.dataset.mid)));return m};
  switch(a){
    case 'compose':newCompose();break;
    case 'view':setView(b.dataset.view);break;
    case 'tab':tab=b.dataset.tab;checked.clear();drawList();break;
    case 'open':open(b.dataset.id);break;
    case 'star':{const x=byId(b.dataset.id);if(x){x.starred=!x.starred;refresh()}break}
    case 'archive':archive(ids);break;
    case 'delete':del(ids);break;
    case 'unread':{const x=byId(ids[0]);if(x)setUnread(ids,b.closest('.mail-row')?!x.unread:true);break}
    case 'read':setUnread(ids,false);break;
    case 'snooze':if(ids.length)snoozeMenu(b,ids);break;
    case 'label':labelMenu(b,ids);break;
    case 'move':moveMenu(b,ids);break;
    case 'print':toast('Sent to the print dialog. Printing is not connected in this concept.');break;
    case 'close-read':openId=null;refresh();break;
    case 'clear-sel':checked.clear();drawList();break;
    case 'refresh':toast('Mail is up to date.');break;
    case 'filter':filterMenu(b);break;
    case 'unfilter':filters[b.dataset.k]=b.dataset.k==='from'||b.dataset.k==='date'?null:false;drawChips();drawList();break;
    case 'clear-filters':clearFilters();break;
    case 'clear-q':q='';$('#mail-q').value='';refresh();$('#mail-q').focus();break;
    case 'reset-search':q='';$('#mail-q').value='';clearFilters();refresh();break;
    case 'new-label':newLabel();break;
    case 'rules':rulesModal();break;
    case 'empty-trash':{const n=threads.filter(x=>x.folder==='trash').length;
      const m=CW.modal({title:'Empty trash',body:`<div>${n===1?'1 conversation':n+' conversations'} will be deleted for good. This cannot be undone.</div>`,foot:`<button class="btn" data-close>Cancel</button><button class="btn btn-primary" id="mail-et">Delete for good</button>`});
      m.querySelector('#mail-et').addEventListener('click',()=>{threads.filter(x=>x.folder==='trash').forEach(remove);CW.closeModal();refresh();toast('Trash emptied.')});break}
    case 'toggle-msg':{const id=b.dataset.mid;if(expanded.has(id))expanded.delete(id);else expanded.add(id);drawRead();break}
    case 'reply':if(t)reply(t,b.dataset.mid?findMsg():null,false);break;
    case 'reply-all':if(t)reply(t,null,true);break;
    case 'forward':if(t)forward(t);break;
    case 'msg-more':{const m=findMsg();if(!t||!m)break;menu(b,[{label:'Reply',icon:'reply',onClick:()=>reply(t,m,false)},{label:'Reply all',icon:'users',onClick:()=>reply(t,m,true)},{label:'Forward',icon:'forward',onClick:()=>forward(t,m)},'sep',
      {label:'Copy message text',icon:'copy',onClick:()=>{try{navigator.clipboard.writeText(m.body).then(()=>toast('Message text copied.'),()=>toast('Copying is blocked in this browser.'))}catch(err){toast('Copying is blocked in this browser.')}}},{label:'Show original',icon:'file',onClick:()=>soon('Viewing the original message')},{label:'Report spam',icon:'alert',onClick:()=>moveTo([t.id],'spam','% moved to Spam.')}]);break}
    case 'att':toast(t&&t.folder==='spam'?'Attachments in Spam are switched off.':'Opening attachments is not part of this concept yet.');break;
    case 'why':{const m=findMsg();if(m)whyModal(m.byBot,m.rule,m.checks);break}
    case 'why-note':if(t&&t.botNote)whyModal(t.botNote.bot,t.botNote.rule,t.botNote.checks);break;
    case 'unlabel':if(t){t.labels=t.labels.filter(x=>x!==b.dataset.l);refresh()}break;
    case 'unsnooze':if(t)mutate([t.id],x=>{x.snoozed=null},'% back in the inbox.');break;
    case 'not-spam':if(t)moveTo([t.id],'inbox','% moved to Inbox.');break;
    case 'restore':if(t)moveTo([t.id],'inbox','% restored to Inbox.');break;
    case 'send-now':if(t){t.folder='sent';t.sched=null;last(t).time=Date.now();refresh();toast('Message sent.')}break;
    case 'cancel-send':if(t){t.folder='drafts';t.sched=null;openId=null;refresh();toast('Send cancelled. The message is in Drafts.')}break;
    case 'd-send':if(t&&t.botDraft)sendBotDraft(t,false);break;
    case 'd-edit':if(t&&t.botDraft){const g=draftTarget(t);newCompose({to:g.to,cc:g.cc,subject:'Re: '+t.subject,body:t.botDraft.text,threadId:t.id,fromBot:true,dirty:true,ai:true})}break;
    case 'd-discard':if(t&&t.botDraft){const d=t.botDraft;t.botDraft=null;refresh();actionToast('Draft discarded. The thread stays in "Needs you".','Undo',()=>{t.botDraft=d;refresh()})}break;
    case 'd-negotiate':if(t&&t.botDraft)sendBotDraft(t,true);break;
  }}
function onChange(e){const c=e.target;if(c.matches('[data-chk]')){c.checked?checked.add(c.dataset.chk):checked.delete(c.dataset.chk);drawList()}
  else if(c.matches('[data-chk-all]')){const l=visible();if(c.checked)l.forEach(t=>checked.add(t.id));else checked.clear();drawList()}}
function move(d){const l=visible();if(!l.length)return;const i=l.findIndex(t=>t.id===openId),n=l[Math.max(0,Math.min(l.length-1,i<0?0:i+d))];if(n&&n.folder!=='drafts'){open(n.id);const r=el.querySelector('.mail-row.open');if(r&&r.scrollIntoView)r.scrollIntoView({block:'nearest'})}}
document.addEventListener('keydown',e=>{if(CW.mode!=='mail'||!el||!el.isConnected)return;const a=document.activeElement,typing=a&&(/^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName)||a.isContentEditable);
  if(e.key==='Escape'){if(document.getElementById('scrim')||document.getElementById('menu'))return;const w=a&&a.closest&&a.closest('.mail-cw');
    if(w){const c=composes.find(x=>x.id===w.dataset.cid);if(c&&c.big){c.big=false;drawDock(c)}else a.blur()}else if(typing)a.blur();else if(checked.size){checked.clear();drawList()}return}
  if(typing||e.metaKey||e.ctrlKey||e.altKey||document.getElementById('scrim'))return;
  const ids=checked.size?[...checked]:openId?[openId]:[];
  if(e.key==='c'){e.preventDefault();newCompose()}
  else if(e.key==='/'){e.preventDefault();const i=$('#mail-q');i.focus();i.select()}
  else if(e.key==='e'){e.preventDefault();archive(ids)}
  else if(e.key==='#'){e.preventDefault();del(ids)}
  else if(e.key==='r'){const t=byId(openId);if(t&&t.folder!=='scheduled'){e.preventDefault();reply(t,null,false)}else toast('Open a conversation to reply.')}
  else if(e.key==='j'){move(1)}else if(e.key==='k'){move(-1)}});

/* ---------- render ---------- */
function render(root,sub){
  el=document.createElement('div');el.className='mail-root';
  el.innerHTML=`<aside class="side mail-side" id="mail-side" aria-label="Mail folders"></aside>
  <section class="mail-center"><div class="mail-top"><div class="row"><button class="btn btn-accent mail-compose-sm" data-act="compose" aria-label="Compose">${I('edit',15)}</button>
  <label class="search">${I('search',15)}<input id="mail-q" placeholder="Search mail by sender, subject or text" aria-label="Search mail" autocomplete="off"><button class="icon-btn sm" id="mail-qx" data-act="clear-q" aria-label="Clear search" hidden>${I('x',13)}</button><span class="kbd">/</span></label>
  <button class="btn" data-act="filter">${I('filter',14)}Filters${I('chevron-down',13)}</button></div><div class="mail-chips" id="mail-chips" hidden></div></div>
  <div class="mail-body"><div class="mail-listcol"><div id="mail-lhead"></div><div class="mail-list" id="mail-list" role="list" aria-label="Conversations"></div></div><div class="mail-read" id="mail-read" aria-label="Reading pane"></div></div></section>
  <div class="mail-dock" id="mail-dock"></div>`;
  root.appendChild(el);
  el.addEventListener('click',onClick);el.addEventListener('change',onChange);
  const qi=$('#mail-q');qi.value=q;qi.addEventListener('input',()=>{q=qi.value;checked.clear();drawSide();drawChips();drawList()});
  if(sub&&sub!=='compose'&&validView(sub)){view=sub;q='';qi.value=''}
  refresh();
  if(sub==='compose'){const blank=composes.find(c=>!c.dirty&&!c.threadId&&!c.draftId);
    if(blank){composes.forEach(x=>{x.min=x!==blank;x.big=false});drawDock(blank)}else if(!newCompose())drawDock()}
  else drawDock();
}
CW.register('mail',{render});
})();
