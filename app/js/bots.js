/* Bots mode: persistent agent sessions. Sidebar of sessions, a transcript with tool cards and approvals, and a right pane (Setup, Activity, Browser, Files). */
(function(){
const CW=window.CW,D=CW.data,I=CW.icon,E=CW.esc;
CW.css('bots',`
.bots{display:grid;height:100%;min-height:0;grid-template-columns:280px minmax(0,1fr)}
.bots.has-pane{grid-template-columns:280px minmax(0,1fr) 400px}
.bots-side{background:var(--bg-side);border-right:1px solid var(--line);display:flex;flex-direction:column;min-height:0;min-width:0}
.bots-side-top{padding:12px 12px 8px;display:flex;flex-direction:column;gap:8px}
.bots-side-top .btn{width:100%}
.bots-list{flex:1;min-height:0;overflow-y:auto;padding:0 8px 12px}
.bots-glabel{display:flex;justify-content:space-between;font-size:12px;color:var(--ink-3);padding:12px 8px 4px}
.bots-row{display:flex;align-items:center;border-radius:var(--r-md);margin-bottom:1px}
.bots-row:hover{background:var(--bg-hover)}
.bots-row.on{background:var(--bg-active)}
.bots-row-main{flex:1;min-width:0;display:flex;align-items:flex-start;gap:10px;border:0;background:none;text-align:left;padding:8px 4px 8px 8px;border-radius:var(--r-md)}
.bots-row-main .dot{margin-top:7px}
.bots-row-text{flex:1;min-width:0;display:flex;flex-direction:column}
.bots-row-top{display:flex;align-items:center;gap:6px;min-width:0}
.bots-row-name{font-weight:500;font-size:13.5px;flex:1}
.bots-row-task{font-size:12.5px;color:var(--ink-3)}
.bots-n{font-size:11.5px;color:var(--ink-3);font-variant-numeric:tabular-nums;flex:none}
.bots-row-more{flex:none;margin-right:4px;opacity:0}
.bots-row:hover .bots-row-more,.bots-row:focus-within .bots-row-more,.bots-row.on .bots-row-more{opacity:1}
.bots .dot.run{animation:bots-pulse 1.4s ease-in-out infinite}
@keyframes bots-pulse{50%{opacity:.35}}
.bots-counts{display:grid;grid-template-columns:repeat(3,1fr);border-top:1px solid var(--line)}
.bots-count{padding:10px 12px;display:flex;flex-direction:column;min-width:0}
.bots-count+.bots-count{border-left:1px solid var(--line)}
.bots-count b{font-family:var(--serif);font-size:20px;font-weight:400;line-height:1.25}
.bots-count span{font-size:11.5px;color:var(--ink-3);white-space:nowrap}
.bots-cols{display:grid;grid-template-columns:minmax(0,1fr);min-width:0;min-height:0}
.bots-cols.two{grid-template-columns:repeat(2,minmax(0,1fr))}
.bots-col{display:flex;flex-direction:column;min-width:0;min-height:0;background:var(--bg)}
.bots-col+.bots-col{border-left:1px solid var(--line)}
.bots-head{padding:10px 12px 8px 16px;border-bottom:1px solid var(--line);display:flex;flex-direction:column;gap:6px}
.bots-head-row{display:flex;align-items:center;gap:10px;min-width:0}
.bots-head-title{flex:1;min-width:0;display:flex;align-items:center;gap:8px}
.bots-head-title h2{font-size:15px;font-weight:600}
.bots-head-meta{display:flex;align-items:center;gap:6px;flex-wrap:wrap;font-size:12px;color:var(--ink-3);padding-left:38px}
.bots-chip{display:inline-flex;align-items:center;gap:4px;border:1px solid var(--line);border-radius:10px;padding:0 8px;font-size:11.5px;color:var(--ink-2);background:var(--bg-raised);white-space:nowrap}
.bots .icon-btn[aria-pressed="true"]{background:var(--bg-active);color:var(--ink)}
.bots-tx{flex:1;min-height:0;overflow-y:auto}
.bots-thread{max-width:720px;width:100%;margin:0 auto;padding:24px 24px 16px;display:flex;flex-direction:column;gap:14px}
.bots-item{display:flex;flex-direction:column;min-width:0}
.bots-in{animation:bots-in .28s ease-out}
@keyframes bots-in{from{opacity:0;transform:translateY(6px)}}
.bots-user{align-self:flex-end;max-width:84%;background:var(--bg-sunk);border-radius:var(--r-lg);padding:10px 14px;font-size:14.5px}
.bots-say{font-size:14.5px;line-height:1.6}
.bots-note{font-size:12px;color:var(--ink-3);margin-top:4px}
.bots-tools{display:flex;flex-direction:column;gap:6px}
.bots-tools .tool+.tool{margin-top:0}
.bots-tools .tool>summary:hover{background:var(--bg-hover)}
.bots-tools .tool>summary b{font-weight:500}
.bots-tools .tool>summary .bots-rest{color:var(--ink-2)}
.bots-tic{width:22px;height:22px;border-radius:var(--r-sm);background:var(--bg-sunk);color:var(--ink-2);display:grid;place-items:center;flex:none}
.bots-meta{flex:none;white-space:nowrap}
.bots-chev{display:grid;place-items:center;color:var(--ink-3);transition:transform .15s}
.tool[open]>summary .bots-chev,.bots-tasks[open]>summary .bots-chev{transform:rotate(180deg)}
.bots-tools .tool-body{max-height:280px;overflow:auto}
.bots-tools .tool-body.bots-diffbody,.bots-diffbody{padding:0;white-space:normal}
.bots-diff{font-family:var(--mono);font-size:12.5px;line-height:1.6;overflow-x:auto;background:var(--bg);color:var(--ink-2)}
.bots-diff-in{display:inline-block;min-width:100%;padding:6px 0}
.bots-dl{display:flex;white-space:pre;padding-right:12px}
.bots-dl i{font-style:normal;width:38px;flex:none;text-align:right;padding-right:8px;color:var(--ink-4);user-select:none}
.bots-dl u{text-decoration:none;width:16px;flex:none;user-select:none}
.bots-dl.add{background:var(--ok-soft);color:var(--ink)} .bots-dl.add u{color:var(--ok)}
.bots-dl.del{background:var(--bad-soft);color:var(--ink)} .bots-dl.del u{color:var(--bad)}
.bots-dl.hunk{background:var(--bg-sunk);color:var(--ink-3)}
.bots-progress{display:flex;align-items:center;gap:10px;font-size:13px;color:var(--ink-3);flex-direction:row}
.bots-spin{width:14px;height:14px;border-radius:50%;border:2px solid var(--line-strong);border-top-color:var(--accent);animation:bots-spin .8s linear infinite;flex:none}
@keyframes bots-spin{to{transform:rotate(360deg)}}
.bots-perm{border:1px solid var(--accent);background:var(--bg-raised);border-radius:var(--r-lg);overflow:hidden;box-shadow:var(--shadow-2)}
.bots-perm-head{padding:10px 14px;background:var(--accent-soft);display:flex;gap:10px;align-items:center}
.bots-perm-body{padding:12px 14px 14px;display:flex;flex-direction:column;gap:12px}
.bots-kv{display:grid;grid-template-columns:132px minmax(0,1fr);gap:4px 12px;font-size:13px}
.bots-kv dt{color:var(--ink-3)} .bots-kv dd{margin:0}
.bots-opts{display:flex;flex-direction:column;gap:6px}
.bots-opt{display:flex;align-items:center;gap:10px;width:100%;text-align:left;border:1px solid var(--line);background:var(--bg-raised);border-radius:var(--r-md);padding:8px 12px}
.bots-opt:hover{background:var(--bg-hover);border-color:var(--line-strong)}
.bots-opt.yes{background:var(--ink);border-color:var(--ink);color:var(--bg)} .bots-opt.yes:hover{background:var(--ink-2)}
.bots-opt small{font-size:12px;color:var(--ink-3);margin-left:auto;text-align:right}
.bots-sum{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));border:1px solid var(--line);border-radius:var(--r-lg);background:var(--bg-raised);overflow:hidden}
.bots-sum div{padding:12px 14px;display:flex;flex-direction:column;min-width:0}
.bots-sum div+div{border-left:1px solid var(--line)}
.bots-sum b{font-family:var(--serif);font-size:22px;font-weight:400;line-height:1.3}
.bots-sum .good{color:var(--ok)}
.bots-doc{border:1px solid var(--line);border-radius:var(--r-lg);background:var(--bg-raised);padding:20px 24px;display:flex;flex-direction:column;gap:12px;font-size:13.5px}
.bots-doc h3{font-family:var(--serif);font-weight:400;font-size:22px;letter-spacing:-.01em}
.bots-doc h4{font-size:12px;font-weight:600;color:var(--ink-3);margin-bottom:2px}
.bots-doc ul{margin:0;padding-left:18px}
.bots-foot{padding:0 16px 14px}
.bots-foot-in{max-width:720px;margin:0 auto;display:flex;flex-direction:column;gap:8px}
.bots-tasks{border:1px solid var(--line);border-radius:var(--r-lg);background:var(--bg-raised);font-size:13px}
.bots-tasks>summary{display:flex;align-items:center;gap:10px;padding:8px 12px;list-style:none;cursor:pointer;border-radius:var(--r-lg)}
.bots-tasks>summary::-webkit-details-marker{display:none}
.bots-tasks>summary:hover{background:var(--bg-hover)}
.bots-bar{flex:1;height:4px;border-radius:2px;background:var(--bg-sunk);overflow:hidden;max-width:140px;margin-left:auto}
.bots-bar i{display:block;height:100%;background:var(--ok);border-radius:2px;transition:width .3s}
.bots-tasklist{list-style:none;margin:0;padding:2px 12px 10px;display:flex;flex-direction:column;gap:4px;max-height:132px;overflow-y:auto}
.bots-tasklist li{display:flex;align-items:center;gap:8px;color:var(--ink-2)}
.bots-tasklist li.done{color:var(--ink-3)}
.bots-box{width:16px;height:16px;border-radius:5px;border:1.5px solid var(--line-strong);display:grid;place-items:center;flex:none;color:var(--on-accent)}
.done .bots-box{background:var(--ok);border-color:var(--ok);color:var(--bg-raised)}
.now .bots-box{border-color:var(--accent)}
.bots-composer{border-radius:var(--r-lg);padding:10px 10px 8px;box-shadow:var(--shadow-1)}
.bots-composer:focus-within{border-color:var(--line-strong);box-shadow:var(--shadow-2)}
.bots-composer textarea{font-size:14.5px;min-height:40px}
.bots-stop{background:var(--bg-raised);border:1px solid var(--line-strong)}
.bots-pane{border-left:1px solid var(--line);background:var(--bg);display:flex;flex-direction:column;min-height:0;min-width:0}
.bots-pane-head{display:flex;align-items:center;justify-content:space-between;padding:0 8px 0 8px;border-bottom:1px solid var(--line);min-height:45px}
.bots-pane-head .tabs{border-bottom:0;align-self:flex-end}
.bots-pane-body{flex:1;min-height:0;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:16px}
.bots-pane-foot{padding:10px 16px;border-top:1px solid var(--line);display:flex;align-items:center;gap:8px}
.bots-sec{display:flex;flex-direction:column;gap:6px}
.bots-sec>h3{font-size:12.5px;font-weight:600;color:var(--ink-2)}
.bots-id{display:flex;align-items:center;gap:6px;border:1px solid var(--line);border-radius:var(--r-md);padding:3px 4px 3px 10px;background:var(--bg-sunk);font-family:var(--mono);font-size:12.5px;min-width:0}
.bots-acc{border:1px solid var(--line);border-radius:var(--r-md);background:var(--bg-raised)}
.bots-acc-row{display:flex;align-items:center;gap:8px;padding:7px 10px;font-size:13px}
.bots-acc-row+.bots-acc-row{border-top:1px solid var(--line)}
.bots-scope{font-family:var(--mono);font-size:11.5px;background:var(--bg-sunk);border-radius:5px;padding:1px 6px;color:var(--ink-2);white-space:nowrap}
.bots-money{display:flex;align-items:center;gap:6px}
.bots-money span{color:var(--ink-3)}
.bots-act{list-style:none;margin:0;padding:0;display:flex;flex-direction:column}
.bots-act li{display:grid;grid-template-columns:48px 22px minmax(0,1fr);gap:8px;align-items:start;padding:7px 0;font-size:13px;border-bottom:1px solid var(--line)}
.bots-act li:last-child{border-bottom:0}
.bots-act time{font-family:var(--mono);font-size:11.5px;color:var(--ink-3);padding-top:2px}
.bots-frame{border:1px solid var(--line-strong);border-radius:var(--r-lg);overflow:hidden;background:var(--bg-raised);box-shadow:var(--shadow-1)}
.bots-frame-bar{display:flex;align-items:center;gap:8px;padding:8px 10px;background:var(--bg-sunk);border-bottom:1px solid var(--line)}
.bots-frame-dots{display:flex;gap:4px} .bots-frame-dots i{width:8px;height:8px;border-radius:50%;background:var(--line-strong)}
.bots-frame-url{flex:1;min-width:0;display:flex;gap:6px;align-items:center;background:var(--bg-raised);border:1px solid var(--line);border-radius:12px;padding:2px 10px;font-size:12px;color:var(--ink-3)}
.bots-frame-page{padding:14px;display:flex;flex-direction:column;gap:10px;min-height:220px}
.bots-frame-page h4{font-size:15px;font-weight:600}
.bots-prow{display:grid;grid-template-columns:96px minmax(0,1fr);gap:10px;font-size:12.5px;padding:6px 8px;border-radius:var(--r-sm);border:1px solid transparent}
.bots-prow span:first-child{color:var(--ink-3)}
.bots-prow.hot{background:var(--accent-soft);border-color:var(--accent)}
.bots-here{display:inline-flex;align-items:center;gap:4px;font-size:11px;font-weight:600;color:var(--accent-strong);margin-top:2px}
.bots-file{display:flex;align-items:center;gap:10px;width:100%;text-align:left;border:0;background:none;padding:8px 10px;border-radius:var(--r-md);min-width:0}
.bots-file:hover{background:var(--bg-hover)}
.bots-file[aria-pressed="true"]{background:var(--bg-active)}
.bots-file .t-mono{font-size:12.5px}
.bots-prev{border:1px solid var(--line);border-radius:var(--r-md);overflow:hidden;background:var(--bg-raised)}
.bots-prev-head{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:6px 10px;border-bottom:1px solid var(--line);font-size:12px;color:var(--ink-3)}
.bots-prev pre{margin:0;padding:10px 12px;font-family:var(--mono);font-size:12.5px;line-height:1.6;white-space:pre-wrap;color:var(--ink-2);background:var(--bg)}
.bots-checks{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:4px 12px}
.bots-checks label{display:flex;align-items:center;gap:8px;font-size:13px;padding:2px 0}
.bots-err{color:var(--bad);font-size:12.5px}
@media (max-width:1140px){.bots.has-pane{grid-template-columns:240px minmax(0,1fr) 340px}.bots{grid-template-columns:240px minmax(0,1fr)}}
@media (max-width:900px){.bots,.bots.has-pane{grid-template-columns:minmax(0,1fr)}.bots-side,.bots-pane{display:none}.bots-cols.two{grid-template-columns:minmax(0,1fr)}.bots-cols.two .bots-col+.bots-col{display:none}}
`);

/* ---------- state (survives leaving the mode) ---------- */
const MODES=[['Ask before changes','Stops before every change to a live system'],['Auto-accept edits','Edits files freely, asks before running or sending'],['Plan first','Shows a plan and waits before doing anything'],['Auto within limits','Works alone until it reaches a limit']];
const MODELS=[['Largest','Most capable, slower'],['Balanced','Good for most work'],['Fastest','Quick answers, simple tasks']];
const ACCESS={'CRM':'deals:write','CRM (read)':'pipeline:read','Mail':'mail:send','Calendar':'calendar:write','Docs':'docs:write','Slides':'slides:write','Issue tracker':'issues:write','Code repository':'code:write','Staging':'tests:run','Browser':'browser:use','Vendor portals':'billing:write','Wallet':'pay:spend'};
const st={cur:null,split:null,pane:true,tab:'setup',q:'',pinned:['automation-bot'],open:{},declining:null,jump:null,file:{},sess:{}};
const run={n:2,fresh:false,stopped:false,timer:null};
let root=null;
const reduced=()=>{try{return matchMedia('(prefers-reduced-motion: reduce)').matches}catch(e){return false}};
const mapMode=m=>MODES.some(x=>x[0]===m)?m:(m==='Auto'||m==='Ask above limits')?'Auto within limits':'Ask before changes';
function S(id){if(!st.sess[id]){const b=CW.bot(id);st.sess[id]={extra:[],draft:'',model:'Balanced',perm:mapMode(b?b.mode:''),form:{},paused:false,note:'',always:false,inst:null}}return st.sess[id]}
const apOf=id=>D.approvals.find(a=>a.bot===id);
const pend=id=>CW.pending().find(a=>a.bot===id);
function status(b){
  if(S(b.id).paused)return{dot:'',pill:'',label:'Paused'};
  if(pend(b.id))return{dot:'wait',pill:'warn',label:'Needs you'};
  if(b.status==='run')return{dot:'run',pill:'accent',label:'Working'};
  if(b.status==='done')return{dot:'ok',pill:'ok',label:'Done'};
  if(b.status==='sched')return{dot:'',pill:'info',label:'Scheduled'};
  return{dot:'',pill:'',label:'Idle'};
}

/* ---------- diffs ---------- */
const D_ROUTING=String.raw`@workflows/lead-routing.yaml
 name: Lead routing by region
 trigger: lead.created
-assign:
-  queue: all-new-leads
-  owner: round_robin(sales)
+rules:
+  - when: country in EMEA
+    assign: round_robin(team-emea)
+  - when: country in AMERICAS
+    assign: round_robin(team-americas)
+  - when: country in APAC
+    assign: round_robin(team-apac)
+fallback:
+  queue: needs-region
+  notify: omar@larkfield.example
+sla:
+  first_touch: 15m
 enabled: false`.split('\n');
const D_EXPORT=String.raw`@src/invoices/export.js (new file)
+const COLUMNS = ['number', 'customer', 'issued', 'due', 'status', 'total'];
+
+function cell(value) {
+  const text = String(value ?? '');
+  return /[",\n]/.test(text) ? '"' + text.replace(/"/g, '""') + '"' : text;
+}
+
+export function invoicesToCsv(invoices) {
+  const rows = invoices.map(inv => COLUMNS.map(key => cell(inv[key])).join(','));
+  return [COLUMNS.join(','), ...rows].join('\n');
+}`.split('\n');
const D_ROUTES=String.raw`@src/invoices/routes.js
 router.get('/invoices', requireRole('billing:read'), listInvoices);
-router.get('/invoices/export', notImplemented);
+router.get('/invoices/export', requireRole('billing:read'), async (req, res) => {
+  const invoices = await findInvoices(req.account, req.query);
+  res.type('text/csv');
+  res.attachment('invoices-' + today() + '.csv');
+  res.send(invoicesToCsv(invoices));
+});
 router.get('/invoices/:id', requireRole('billing:read'), showInvoice);`.split('\n');
function diff(start,lines){let n=start;
  return '<div class="bots-diff"><div class="bots-diff-in">'+lines.map(l=>{const c=l[0],t=l.slice(1);
    if(c==='@')return `<div class="bots-dl hunk"><i></i><u></u><span>${E(t)}</span></div>`;
    const num=c==='-'?'':n++;
    return `<div class="bots-dl${c==='+'?' add':c==='-'?' del':''}"><i>${num}</i><u>${c==='+'?'+':c==='-'?'−':''}</u><span>${E(t)||' '}</span></div>`}).join('')+'</div></div>'}
function dstat(lines){const a=lines.filter(l=>l[0]==='+').length,d=lines.filter(l=>l[0]==='-').length;return '+'+a+(d?' −'+d:'')}

/* ---------- transcript helpers ---------- */
function helpers(bot){let k=0;const h={
  U:(who,text)=>`<div class="bots-user"><div class="t-xs t-mute">${E(who)}</div>${E(text)}</div>`,
  A:(text,note)=>`<div class="bots-say">${E(text)}${note?`<div class="bots-note">${E(note)}</div>`:''}</div>`,
  T:(icon,layer,rest,meta,body)=>{const id=bot.id+'-t'+(k++),isDiff=typeof body!=='string';
    return `<details class="tool" data-tool="${id}"${st.open[id]?' open':''}><summary><span class="bots-tic">${I(icon,14)}</span><span class="grow truncate"><b>${E(layer)}</b><span class="bots-rest">${rest?' · '+E(rest):''}</span></span><span class="t-xs t-mute bots-meta">${E(meta)}</span><span class="bots-chev">${I('chevron-down',13)}</span></summary><div class="tool-body${isDiff?' bots-diffbody':''}">${isDiff?diff(body[0],body[1]):E(body)}</div></details>`},
  G:(...tools)=>`<div class="bots-tools">${tools.join('')}</div>`,
  F:(icon,name,meta)=>`<div><span class="file-chip">${I(icon,18)}<span><b style="font-weight:500">${E(name)}</b><br><span class="t-mute">${E(meta)}</span></span></span></div>`,
  auth:(access)=>h.T('shield','Claude Auth','signed in as '+bot.name,access,`Identity: ${bot.id}@larkfield.example\nOwner: ${bot.owner}\nScopes: ${bot.scope}\nSession: expires when this request is closed`),
  vault:(n,body)=>h.T('key','Claude Vault',`used ${n} key${n>1?'s':''} (not shown to the model)`,'logged',body),
  ok:(extra)=>h.T('check','Approved','by '+D.me.name,'logged',`Approver: ${D.me.name}, ${D.me.role}\nRecorded in the audit log${extra?'\n'+extra:''}`)
};return h}

/* ---------- sessions ---------- */
const SESS={
'automation-bot':{who:'Omar Haddad · Sales Ops',
  inst:'You build and maintain CRM workflows for the sales team.\nAlways test a workflow in the sandbox on real leads from the last week before proposing it.\nNever turn a workflow on in the live CRM without approval.\nWhen you finish, tell the person who asked what changed and how to undo it.',
  tasks:['Read the current assignment rules','Draft the routing workflow','Replay last week\'s leads in the sandbox','Turn it on in the live CRM'],
  rule:'Workflow changes that passed a sandbox replay',
  detail:[['Change','Workflow "Lead routing by region", new leads only'],['Tested','200 of 200 leads routed correctly in the sandbox'],['Undo','One switch. Leads go back to the shared queue']],
  base:h=>[
    h.U('Omar Haddad · Sales Ops','New leads all land in one queue and sit there for hours. Can you route them by region so each one reaches the right rep straight away? EMEA to Ines and her team, Americas to Tom\'s team, APAC to Mei\'s team.'),
    h.A('I\'ll build this as a CRM workflow and prove it in the sandbox before anything touches live leads.'),
    h.G(h.auth('CRM workflows'),h.vault(1,'crm-workflow-key ········ used 09:12\nThe key was passed to the CRM directly. The model never saw its value.'),
      h.T('eye','Read','current lead assignment rules','1 rule, 1 queue','Rule 1: every new lead goes to queue "all-new-leads"\nOwner: round robin across 14 reps\nMedian time to first assignment last week: 3 h 12 min'),
      h.T('globe','Claude Browser','opened CRM workflows in the sandbox','crm.larkfield.example','Opened Workflows, then New workflow\nEnvironment: sandbox (copy of live from Monday 06:00)')),
    h.A('Today there is a single catch-all rule. I have replaced it with three regional branches, a fallback queue for leads with no country, and a 15 minute first-touch target.'),
    h.G(h.T('edit','Write','workflows/lead-routing.yaml',dstat(D_ROUTING),[1,D_ROUTING]),
      h.T('check','Test','replayed 200 leads from last week','200 of 200 routed','EMEA      83 leads   83 correct\nAmericas  79 leads   79 correct\nAPAC      31 leads   31 correct\nNo country 7 leads    7 sent to "needs-region"\n\nMedian time to assign: 41 s (was 3 h 12 min)')),
    h.A('The replay routed all 200 leads to the right team. Seven had no country, so they go to a small "needs region" queue and Omar is notified. The workflow is saved but switched off. Turning it on changes a live system, so I need a yes from you.')],
  after:(h,s)=>[
    h.G(h.ok(s.always?'Rule saved: '+SESS['automation-bot'].rule+' will not ask again':''),
      h.T('terminal','Run','enabled "Lead routing by region" in the live CRM','live','workflow lead-routing: enabled\nprevious rule "all-new-leads": archived, can be restored in one step'),
      h.T('globe','Claude Browser','watched the first live leads arrive','3 leads','Lead 1  Lyon, France       team-emea      assigned in 38 s\nLead 2  Austin, USA        team-americas  assigned in 44 s\nLead 3  Osaka, Japan       team-apac      assigned in 36 s')),
    h.A('Done. Lead routing by region is live. The first three leads reached the right rep in under a minute, and I have told Omar what changed and how to switch it off.')],
  declined:'Understood. The workflow stays switched off in the live CRM and the sandbox copy is kept. I have told Omar it was declined.',
  act:[['09:12','shield','Signed in to the CRM as Automation bot'],['09:12','key','Used 1 key from the vault'],['09:14','eye','Read the current assignment rules'],['09:21','edit','Wrote workflows/lead-routing.yaml'],['09:26','check','Replayed 200 leads in the sandbox'],['09:27','alert','Asked for approval to turn it on in the live CRM']],
  actAfter:[['Now','check','Approved by Asha Raman'],['Now','terminal','Enabled the workflow in the live CRM'],['Now','mail','Told Omar what changed']],
  page:{url:'crm.larkfield.example/workflows/lead-routing',title:'Lead routing by region',rows:[['Trigger','Lead created'],['EMEA','Round robin, team EMEA'],['Americas','Round robin, team Americas'],['APAC','Round robin, team APAC'],['Fallback','Queue: needs region'],['Status','Off in live. Passed in sandbox']],last:['Status','On in live since a moment ago']},
  files:[{name:'workflows/lead-routing.yaml',meta:'Changed',d:[1,D_ROUTING]},{name:'reports/routing-replay.txt',meta:'New',text:'Replay of 200 leads, 9 to 15 November\n\nEMEA       83 of 83 correct\nAmericas   79 of 79 correct\nAPAC       31 of 31 correct\nNo country  7 sent to needs-region\n\nMedian time to assign: 41 s'}]},
'it-bot':{who:'Lena Fischer · People team',
  inst:'You set up new starters and handle everyday IT requests for the People team.\nCreate identities and assign roles from the role template for the job title. Never grant admin roles.\nYou may buy standard equipment up to the spend limit. Above it, ask.\nSend the manager a summary when everything is ready.',
  tasks:['Create Jo\'s identity and mailbox','Assign the account executive role in 6 work apps','Build a first-week calendar','Order and pay for a laptop'],
  rule:'Standard laptops for new hires, up to $1,500.00',
  detail:[['Item','Standard laptop, 14 inch, 16 GB, from Northgate Supply'],['Amount','$1,400.00 from the People and IT wallet'],['Limit','$1,000.00 per purchase for this bot']],
  base:h=>[
    h.U('Lena Fischer · People team','Jo Brandt starts on Monday as an account executive in Sales. Can you get everything ready: accounts, the sales apps, a laptop and a first-week calendar?'),
    h.A('Yes. I\'ll use the account executive template, so Jo gets the same access as the rest of the team and nothing more.'),
    h.G(h.auth('Identity, 6 work apps'),h.vault(1,'identity-admin-key ········ used 08:40\nThe key was passed to the identity service directly. The model never saw its value.'),
      h.T('terminal','Run','created the identity jo.brandt@larkfield.example','new user','User: Jo Brandt\nAddress: jo.brandt@larkfield.example\nManager: Dana Whitlock\nStart date: Monday 23 November\nSign-in: passkey invite sent to personal address on file'),
      h.T('terminal','Run','assigned the account executive role in 6 work apps','6 of 6','Mail            member\nCalendar        member\nCRM             account executive\nContract tool   sender\nTeam chat       member, #sales and #new-starters\nExpenses        submitter'),
      h.T('edit','Write','first-week calendar for Jo','9 events','Mon 09:30  Welcome with Lena Fischer\nMon 11:00  Laptop and passkey setup\nMon 14:00  Meet the team, Dana Whitlock\nTue 10:00  CRM walkthrough, Omar Haddad\nTue 14:00  Product demo, Sam Okafor\nWed 10:00  Shadow two customer calls, Priya Nair\nThu 11:00  Pricing and contracts\nFri 10:00  First pipeline review\nFri 15:30  Week one check-in with Lena')),
    h.A('Accounts, access and the calendar are done. The last item is the laptop.'),
    h.G(h.T('globe','Claude Browser','opened the Northgate Supply catalogue','basket ready','Standard laptop, 14 inch, 16 GB memory, 512 GB storage\nPrice: $1,400.00, tax included\nDelivery: Friday 20 November to the Larkfield front desk\nBasket saved. Nothing has been paid.')),
    h.A('The standard sales laptop costs $1,400.00, which is above my $1,000.00 limit for a single purchase. If you approve, I\'ll order it today so it arrives on Friday.')],
  after:(h,s)=>[
    h.G(h.ok(s.always?'Rule saved: '+SESS['it-bot'].rule+' will not ask again':''),
      h.T('wallet','Claude Pay','paid $1,400.00 to Northgate Supply','one-time card','Amount: $1,400.00\nPaid to: Northgate Supply\nMethod: one-time virtual card ending 4417, closed after use\nWallet: People and IT\nLimit: $1,000.00 per purchase, raised once by approval ap-laptop\nReceipt: filed to People and IT, Receipts'),
      h.T('globe','Claude Browser','placed order NS-58213','arrives Friday','Order NS-58213 confirmed\nDelivery: Friday 20 November, front desk, marked for Jo Brandt\nTracking link added to the Monday 11:00 calendar event')),
    h.A('Jo is ready for Monday. The laptop is ordered and paid for, it arrives on Friday, and I have sent Lena and Dana a summary with the calendar attached.'),
    h.F('file','Welcome pack for Jo Brandt','Document · sent to Lena Fischer and Dana Whitlock')],
  declined:'Understood. Nothing has been bought and the basket is still saved. Jo\'s accounts and calendar are ready, and I have told Lena the laptop still needs a decision.',
  act:[['08:40','shield','Signed in to Identity as IT bot'],['08:41','user','Created jo.brandt@larkfield.example'],['08:44','users','Assigned roles in 6 work apps'],['08:52','calendar','Wrote a first-week calendar, 9 events'],['09:03','globe','Opened the Northgate Supply catalogue'],['09:05','alert','Asked for approval: laptop, $1,400.00']],
  actAfter:[['Now','check','Approved by Asha Raman'],['Now','wallet','Paid $1,400.00 with Claude Pay'],['Now','mail','Sent the welcome pack to Lena and Dana']],
  page:{url:'shop.northgate-supply.example/basket',title:'Your basket',rows:[['Item','Standard laptop, 14 inch, 16 GB'],['Quantity','1'],['Delivery','Friday 20 November, front desk'],['Total','$1,400.00'],['Payment','Waiting for approval']],last:['Payment','Paid. Order NS-58213']},
  files:[{name:'onboarding/jo-brandt-access.md',meta:'New',text:'Access for Jo Brandt, account executive\n\nMail            member\nCalendar        member\nCRM             account executive\nContract tool   sender\nTeam chat       member\nExpenses        submitter\n\nNo admin roles. Review date: 23 February.'},{name:'onboarding/jo-brandt-week-one.ics',meta:'New',text:'9 events, Monday 23 to Friday 27 November\nOrganiser: it-bot@larkfield.example\nInvited: Jo Brandt, Lena Fischer, Dana Whitlock, Omar Haddad, Sam Okafor, Priya Nair'}]},
'builder-bot':{who:'Sam Okafor · Product',
  inst:'You implement specs written by Planner bot in the Larkfield billing app.\nWork on a branch. Keep changes small and covered by tests.\nDeploy to staging yourself. A production release always needs approval.\nAfter a release, update the help article and tell the customers who asked.',
  tasks:['Read the spec and the invoices code','Build the export','Run the tests','Check it on staging','Release to production'],
  rule:'Releases where every test passes and staging was checked',
  detail:[['Change','CSV export on the invoices page, 2 files, 1 new route'],['Checks','38 of 38 tests passing. Export verified on staging'],['Undo','Roll back to build 2290 in one step']],
  base:h=>[
    h.U('Sam Okafor · Product','Planner bot\'s spec for CSV export on invoices is approved. Please build it and tell me when it is ready to release.'),
    h.A('On it. I\'ll follow the spec as written: one export button, the six columns customers asked for, and the same filters as the list.'),
    h.G(h.auth('Code repository, Staging'),
      h.T('eye','Read','docs/specs/invoice-csv-export.md','1 page','Spec INV-482, approved by Sam Okafor\nColumns: number, customer, issued, due, status, total\nRespects the filters on the list\nOut of scope: scheduled exports, other formats'),
      h.T('eye','Read','src/invoices/list.js, routes.js, test/invoices','3 files','routes.js already has a placeholder for /invoices/export\nfindInvoices(account, query) returns the filtered list, reusable as is')),
    h.A('The list already has a query I can reuse, so the change is small: one new file for the CSV and a real handler for the placeholder route.'),
    h.G(h.T('edit','Write','src/invoices/export.js',dstat(D_EXPORT),[1,D_EXPORT]),
      h.T('edit','Write','src/invoices/routes.js',dstat(D_ROUTES),[21,D_ROUTES]),
      h.T('check','Test','38 tests passing','4.2 s','$ npm test -- invoices\n PASS  test/invoices/export.test.js   12 tests\n PASS  test/invoices/routes.test.js    9 tests\n PASS  test/invoices/list.test.js     17 tests\n\nTests: 38 passed, 38 total\nTime:  4.2 s'),
      h.T('terminal','Run','deployed branch csv-export to staging','build 2291','build 2291 from branch csv-export\nstaging.larkfield.example updated at 10:31\nhealth check: ok'),
      h.T('globe','Claude Browser','opened staging and downloaded an export','412 rows','Opened Invoices, filtered to "Overdue", pressed Export\nDownloaded invoices-2026-11-17.csv\n412 rows, 6 columns, matches the list on screen\nOpened cleanly in a spreadsheet, commas and quotes intact')),
    h.A('It works on staging and all 38 tests pass. Releasing to production needs your approval.')],
  after:(h,s)=>[
    h.G(h.ok(s.always?'Rule saved: '+SESS['builder-bot'].rule+' will not ask again':''),
      h.T('terminal','Run','released build 2291 to production','live','merged csv-export into main\nbuild 2291 promoted to production\nhealth check: ok, error rate unchanged after 5 min'),
      h.T('edit','Write','help article "Export your invoices"','published','Added a section on the Export button, the six columns and how filters apply'),
      h.T('mail','Claude Mail','told the 14 customers who asked','14 sent','From: builder-bot@larkfield.example on behalf of Sam Okafor\nSubject: You can now export invoices as CSV\n14 sent, 0 bounced')),
    h.A('Released. CSV export is live on the invoices page, the help article is updated and the 14 customers who asked have been told. Issue INV-482 is closed.')],
  declined:'Understood. Nothing has been released. The change stays on staging as build 2291 and the branch is kept. I have told Sam the release was declined.',
  act:[['10:02','shield','Signed in to the code repository as Builder bot'],['10:04','eye','Read spec INV-482'],['10:19','edit','Wrote src/invoices/export.js'],['10:22','edit','Changed src/invoices/routes.js'],['10:27','check','Ran the tests: 38 passing'],['10:31','terminal','Deployed build 2291 to staging'],['10:36','alert','Asked for approval to release to production']],
  actAfter:[['Now','check','Approved by Asha Raman'],['Now','terminal','Released build 2291 to production'],['Now','mail','Told 14 customers']],
  page:{url:'staging.larkfield.example/invoices?status=overdue',title:'Invoices',rows:[['INV-2291','Halden Dental · $4,860.00 · Overdue'],['INV-2288','Morrow Freight · $1,240.00 · Overdue'],['INV-2279','Pell and Rowe · $9,015.00 · Overdue'],['Showing','412 invoices'],['Export','Download CSV, 412 rows']],last:['Export','Download CSV. Live in production']},
  files:[{name:'src/invoices/export.js',meta:'New',d:[1,D_EXPORT]},{name:'src/invoices/routes.js',meta:'Changed',d:[21,D_ROUTES]},{name:'test/invoices/export.test.js',meta:'New',text:'12 tests\n\n  writes a header row with six columns\n  quotes values that contain commas\n  doubles quotes inside quoted values\n  keeps line breaks inside a cell\n  respects the status filter\n  returns only the header for an empty list\n  and 6 more'}]},
'analyst-bot':{who:'Dana Whitlock · VP Sales',
  inst:'You prepare pipeline analysis and review decks for sales leadership.\nRead from the CRM only. Never change a deal.\nUse last quarter\'s deck as the template and check every figure against the CRM before you finish.\nSay clearly when a number is an estimate.',
  page:{url:'slides.larkfield.example/q3-pipeline-review',title:'Q3 pipeline review',rows:[['Slide 1','Summary: $6.42M open, up 9%'],['Slide 2','Pipeline by stage'],['Slide 3','Conversion, Q2 against Q3'],['Slide 4','Deals that slipped'],['Editing','Speaker notes and charts']]},
  files:[{name:'Q3 pipeline review.slides',meta:'In progress',text:'1  Summary\n2  Pipeline by stage\n3  Pipeline by region\n4  Conversion, Q2 against Q3\n5  Proposal to close, by team\n6  Deals that slipped out of Q3\n7  Top 10 open deals\n8  Forecast for Q4\n9  Risks\n10 What we are changing\n11 Asks for leadership\n12 Appendix: method and sources'},{name:'queries/open-pipeline.sql',meta:'New',text:'select stage, region, count(*) as deals, sum(amount) as value\nfrom deals\nwhere status = \'open\' and close_date <= date \'2026-12-31\'\ngroup by stage, region\norder by stage, region;'}]},
'procurement-bot':{who:'Marcus Bell · Finance',
  inst:'You renew and right-size software subscriptions for Finance.\nBefore any renewal, check real usage for the last 90 days and remove unused seats.\nPay from the Finance wallet. You may spend up to the limit without asking.\nFile every receipt and tell the owner what was paid and what was saved.',
  tasks:['Check seat usage for the last 90 days','Compare plans and pick the cheapest that fits','Renew and pay','File the receipt and tell Marcus'],
  base:h=>[
    h.U('Marcus Bell · Finance','The analytics subscription renews on the 20th. Check whether we still need 60 seats and renew at the best price you can get.'),
    h.A('I\'ll look at who has actually signed in over the last 90 days before I renew anything.'),
    h.G(h.auth('Vendor portals, Wallet'),h.vault(1,'corvane-billing-login ········ used 07:02\nThe sign-in was filled by the vault. The model never saw its value.'),
      h.T('globe','Claude Browser','opened the Corvane Analytics billing portal','billing.corvane.example','Plan: Team, annual\nSeats: 60 at $90.00 per seat\nRenewal: 20 November, $5,400.00'),
      h.T('terminal','Run','counted active seats over the last 90 days','44 of 60 used','Signed in at least once: 44\nNever signed in: 11\nLeft Larkfield: 5\nSuggested seats: 45, one spare')),
    h.A('Only 44 of the 60 seats are in use. Renewing with 45 seats costs $4,050.00 instead of $5,400.00, and that is under my $5,000.00 limit, so I can pay it without asking.'),
    h.G(h.T('globe','Claude Browser','changed the plan to 45 seats and started the renewal','45 seats','Removed 15 unused seats, none of them assigned to a current employee\nNew annual total: 45 x $90.00 = $4,050.00'),
      h.T('wallet','Claude Pay','paid $4,050.00 to Corvane Analytics','within limit','Amount: $4,050.00\nPaid to: Corvane Analytics\nMethod: one-time virtual card ending 2086, closed after use\nWallet: Finance\nLimit: $5,000.00 per purchase, no approval needed\nReceipt: filed to Finance, Receipts, 2026-11'),
      h.T('edit','Write','filed the receipt and updated the renewals sheet','2 files','Finance/Receipts/2026-11/corvane-analytics.pdf\nFinance/Renewals.sheet: next renewal 20 November 2027, 45 seats')),
    `<div class="bots-sum"><div><span class="t-xs t-mute">Paid</span><b>${CW.money(4050)}</b></div><div><span class="t-xs t-mute">Saved against last year</span><b class="good">${CW.money(1350)}</b></div><div><span class="t-xs t-mute">Next renewal</span><b>20 Nov 2027</b></div></div>`,
    h.A('Renewed. Larkfield paid $4,050.00 for 45 seats and saved $1,350.00 against last year. The receipt is filed and I have sent Marcus the list of the 15 seats I removed in case anyone needs one back.')],
  act:[['07:00','clock','Started the daily renewal check'],['07:02','shield','Signed in to the Corvane billing portal'],['07:05','terminal','Counted active seats: 44 of 60'],['07:09','globe','Changed the plan to 45 seats'],['07:10','wallet','Paid $4,050.00 with Claude Pay'],['07:11','file','Filed the receipt'],['07:12','mail','Told Marcus what was paid and saved']],
  page:{url:'billing.corvane.example/subscription',title:'Subscription',rows:[['Plan','Team, annual'],['Seats','45, was 60'],['Paid','$4,050.00 on 17 November'],['Next renewal','20 November 2027'],['Receipt','Sent to finance@larkfield.example']]},
  files:[{name:'Finance/Receipts/2026-11/corvane-analytics.pdf',meta:'New',text:'Corvane Analytics\nReceipt 20261117-0448\n\nTeam plan, annual, 45 seats at $90.00   $4,050.00\nTotal paid                              $4,050.00\n\nPaid by one-time card ending 2086'},{name:'Finance/Renewals.sheet',meta:'Changed',d:[14,['@Finance/Renewals.sheet','-Corvane Analytics   60 seats   $5,400.00   renews 20 Nov 2026','+Corvane Analytics   45 seats   $4,050.00   renews 20 Nov 2027',' Northgate Supply    hardware   on order    no renewal']]}]},
'revops-bot':{who:'Priya Nair · Sales',inChat:true,left:2,
  inst:'You fix deal and contract records for the revenue operations team.\nCheck every change against the signed quote.\nDiscounts above 10% need approval from the RevOps manager.\nReply to the person who asked in the thread where they asked.',
  tasks:['Check the deal against the signed quote','Find the price difference','Get approval for the 12% discount','Regenerate the contract and reply to Priya'],
  base:(h,s,ap)=>[
    h.U('Priya Nair · Sales','The Halden Dental contract has the wrong pricing tier. Can you fix it?'),
    h.A('I checked the deal against the signed quote. It was sold on the Growth tier, but the contract was generated at the Starter price.'),
    h.G(h.auth('CRM, Contract tool'),h.vault(2,'crm-service-key ········ used 10:48\ncontract-tool-key ········ used 10:48'),
      h.T('globe','Claude Browser','opened the Halden Dental deal','deal HD-2291','Quote: Growth tier, 45 seats\nContract v2: Starter tier price\nDifference: 12% below Growth list price')),
    `<div class="notice"><div class="row between"><b>${ap.status==='pending'?'This request is waiting for you in Chat':ap.status==='approved'?'Finished in Chat':'Declined in Chat'}</b><span class="pill ${ap.status==='pending'?'warn':ap.status==='approved'?'ok':''}">${ap.status==='pending'?'Above policy':ap.status==='approved'?'Approved':'Declined'}</span></div>
     <div>${ap.status==='pending'?'Priya asked in a Chat thread, so the approval for the 12% discount lives there with the full conversation.':ap.status==='approved'?'The contract now shows the Growth tier with the approved 12% discount, and Priya has the new version.':'The contract was left as it was and Priya has been told.'}</div>
     <div class="row"><button class="btn btn-primary" data-go="chat" data-sub="halden">${I('chat',14)}Open the Chat thread</button></div></div>`],
  act:[['10:48','shield','Signed in to the CRM and the contract tool'],['10:48','key','Used 2 keys from the vault'],['10:50','globe','Opened deal HD-2291'],['10:53','alert','Asked for approval: 12% discount']],
  page:{url:'crm.larkfield.example/deals/HD-2291',title:'Halden Dental',rows:[['Stage','Contract sent'],['Quote','Growth tier, 45 seats'],['Contract','v2, Starter tier price'],['Discount','12% needed, 10% allowed']]},
  files:[{name:'Halden Dental contract v2.pdf',meta:'Read only',text:'Tier: Starter\nSeats: 45\nNot changed in this session. A corrected v3 is created after approval.'}]},
'planner-bot':{who:'Sam Okafor · Product',
  inst:'You turn customer requests into one-page specs that Builder bot can pick up.\nRead the requests and the existing code first. Keep the scope small.\nEvery spec has: problem, what to build, out of scope, acceptance checks and a size.\nCreate one issue per spec and link the requests to it.',
  tasks:['Read the customer requests','Read the invoices code','Write the one-page spec','Create the issue and hand over to Builder bot'],
  base:h=>[
    h.U('Sam Okafor · Product','Fourteen customers have asked for a CSV export on the invoices page. Write a one-page spec that Builder bot can pick up.'),
    h.A('I\'ll read the requests first so the spec covers what people actually asked for, not more.'),
    h.G(h.auth('Issue tracker, Docs'),
      h.T('eye','Read','14 customer requests tagged "invoice export"','14 requests','11 want a spreadsheet of the filtered list for their accountant\n2 want totals by month\n1 wants a scheduled email\nAll 14 named CSV. Nobody asked for another format.'),
      h.T('eye','Read','src/invoices/list.js and routes.js','2 files','The list query is reusable. A placeholder route for /invoices/export already exists.'),
      h.T('edit','Write','docs/specs/invoice-csv-export.md','1 page','Saved to Docs, Product specs. Shared with Sam Okafor and Builder bot.'),
      h.T('terminal','Run','created issue INV-482 and linked the 14 requests','assigned','INV-482 CSV export on invoices\nAssignee: Builder bot\nLinked: 14 customer requests\nStatus: ready after approval from Sam Okafor')),
    `<div class="bots-doc"><div><span class="t-label">Spec · INV-482</span><h3>CSV export on invoices</h3></div>
      <div><h4>Problem</h4>Customers copy invoices by hand into spreadsheets for their accountants. Fourteen have asked for an export in the last quarter.</div>
      <div><h4>What to build</h4><ul><li>An Export button on the invoices page that downloads a CSV file.</li><li>Six columns: number, customer, issued, due, status, total.</li><li>The export respects whatever filters are set on the list.</li></ul></div>
      <div><h4>Out of scope</h4>Scheduled exports, monthly totals and other file formats. Three requests asked for these and are linked for later.</div>
      <div><h4>Acceptance checks</h4><ul><li>The file opens cleanly in a spreadsheet, including names with commas and quotes.</li><li>The row count matches the list on screen.</li><li>Only people with billing access can export.</li></ul></div>
      <div><h4>Size</h4>Small. About one day for Builder bot, including tests.</div></div>`,
    h.A('The spec is one page and the issue is assigned to Builder bot. Sam approved it at 09:48, so Builder bot has already picked it up.')],
  act:[['09:20','shield','Signed in to the issue tracker as Planner bot'],['09:22','eye','Read 14 customer requests'],['09:31','eye','Read the invoices code'],['09:40','edit','Wrote the spec'],['09:42','terminal','Created issue INV-482'],['09:48','check','Spec approved by Sam Okafor']],
  page:{url:'issues.larkfield.example/INV-482',title:'INV-482 CSV export on invoices',rows:[['Assignee','Builder bot'],['Spec','docs/specs/invoice-csv-export.md'],['Linked','14 customer requests'],['Status','In progress']]},
  files:[{name:'docs/specs/invoice-csv-export.md',meta:'New',text:'# CSV export on invoices\n\nProblem: customers copy invoices by hand into spreadsheets.\nBuild: an Export button, six columns, respects filters.\nOut of scope: scheduled exports, monthly totals, other formats.\nChecks: opens cleanly, row count matches, billing access only.\nSize: small, about one day.'}]},
'qa-bot':{inst:'You test every build on staging before it is released.\nRun the smoke tests, then click through the pages a change touched in Claude Browser.\nReport what failed with the steps to see it again. Do not change code.',
  suggest:['Run the smoke tests on build 2291','Click through the invoices page on staging and report anything odd','Check the CSV export with 10,000 invoices'],
  act:[['06:10','check','Smoke tests on build 2289: 64 passing'],['08:15','check','Smoke tests on build 2290: 64 passing'],['10:32','check','Smoke tests on build 2291: 64 passing']]}
};

/* analyst-bot run: one step appears per tick */
const RUN=[
  {label:'Reading the open pipeline',act:['terminal','Queried the open pipeline: 214 deals'],item:h=>h.G(h.T('terminal','Run','queried the open pipeline','214 deals','Open deals closing by 31 December: 214\nTotal value: $6,420,000.00\nBy region: EMEA $2.71M, Americas $2.64M, APAC $1.07M'))},
  {label:'Comparing conversion with last quarter',act:['terminal','Compared stage conversion with Q2'],item:h=>h.G(h.T('terminal','Run','compared stage conversion with Q2','5 stages','Lead to qualified      Q2 38%   Q3 41%\nQualified to proposal  Q2 52%   Q3 50%\nProposal to close      Q2 31%   Q3 27%\nAverage days to close  Q2 47    Q3 53'))},
  {label:'Writing up what changed',act:['edit','Noted the drop from proposal to close'],item:h=>h.A('The open pipeline is $6.42M across 214 deals, up 9% on Q2. The weak spot is proposal to close, which fell from 31% to 27%, so I am giving that its own slide.')},
  {label:'Finding deals that slipped',act:['terminal','Found 17 deals that slipped out of Q3'],item:h=>h.G(h.T('terminal','Run','found deals that slipped out of Q3','17 deals','17 deals moved their close date from Q3 into Q4\nValue: $1,180,000.00\nMost common reason logged: waiting on legal review, 8 deals'))},
  {label:'Building slides 1 to 6',act:['edit','Wrote slides 1 to 6'],item:h=>h.G(h.T('edit','Write','slides 1 to 6','summary and stages','1 Summary\n2 Pipeline by stage\n3 Pipeline by region\n4 Conversion, Q2 against Q3\n5 Proposal to close, by team\n6 Deals that slipped out of Q3'))},
  {label:'Building slides 7 to 12',act:['edit','Wrote slides 7 to 12'],item:h=>h.G(h.T('edit','Write','slides 7 to 12','forecast and asks','7 Top 10 open deals\n8 Forecast for Q4\n9 Risks\n10 What we are changing\n11 Asks for leadership\n12 Appendix: method and sources'))},
  {label:'Checking every figure against the CRM',act:['check','Checked 46 figures against the CRM'],item:h=>h.G(h.T('check','Test','checked every figure against the CRM','46 figures, 0 mismatches','46 figures on 12 slides compared with live CRM queries\n0 mismatches\n2 figures marked as estimates: Q4 forecast, expected slip rate'))},
  {label:'Finishing',act:['mail','Shared the deck with Dana Whitlock'],item:h=>h.A('The deck is ready: 12 slides in the same structure as last quarter, plus a new slide on the 17 deals that slipped. Every figure matches the CRM, and the two estimates are labelled. I have shared it with Dana for Thursday.')+`<div style="margin-top:10px">${h.F('layers','Q3 pipeline review','Slides · 12 slides · shared with Dana Whitlock')}</div>`}
];
const RUN_TASKS=[['Pull the open pipeline',1],['Compare conversion with Q2',2],['Find deals that slipped',4],['Build the slides',6],['Check every figure against the CRM',7]];

function taskState(b){
  if(b.id==='analyst-bot')return RUN_TASKS.map(t=>({t:t[0],done:run.n>=t[1]}));
  const X=SESS[b.id];if(!X||!X.tasks)return[];
  const ap=apOf(b.id),left=ap&&ap.status!=='approved'?(X.left||1):0;
  return X.tasks.map((t,i)=>({t,done:i<X.tasks.length-left}));
}
function thread(b){
  const X=SESS[b.id]||{},s=S(b.id),h=helpers(b),ap=apOf(b.id);let items=[];
  if(b.id==='analyst-bot'){
    items=[h.U(X.who,'I need the Q3 pipeline review deck for Thursday\'s leadership meeting. Same structure as last quarter, plus a slide on deals that slipped.'),
      h.A('I\'ll rebuild last quarter\'s deck with Q3 numbers straight from the CRM and add the slide on slipped deals.'),
      h.G(h.auth('CRM (read), Slides'),h.vault(1,'crm-readonly-key ········ used 10:51\nThe key was passed to the CRM directly. The model never saw its value.'),h.T('eye','Read','Q2 pipeline review deck','11 slides','Template: 11 slides\nSections: summary, stages, regions, conversion, top deals, forecast, risks, asks'))];
    RUN.slice(0,run.n).forEach(r=>items.push(r.item(h)));
    if(run.stopped)items.push(`<div class="bots-say">Stopped by you at step ${Math.min(run.n+1,RUN.length)} of ${RUN.length}. What I had finished is saved as a draft.</div><div class="row" style="margin-top:8px"><button class="btn btn-sm" data-resume="${b.id}">${I('play',13)}Resume</button></div>`);
    else if(b.status==='run'&&run.n<RUN.length)items.push(s.paused?`<div class="bots-progress">${I('pause',14)}<span>Paused at step ${run.n+1} of ${RUN.length} · ${E(RUN[run.n].label)}</span></div>`:`<div class="bots-progress" role="status"><span class="bots-spin"></span><span>Working · step ${run.n+1} of ${RUN.length} · ${E(RUN[run.n].label)}</span></div>`);
  }else if(X.base){
    items=X.base(h,s,ap);
    if(ap&&!X.inChat){
      if(ap.status==='approved')items=items.concat(X.after(h,s));
      else if(ap.status==='declined')items.push(h.A(X.declined+(s.note?' Your note has been passed on: "'+s.note+'"':'')));
    }
  }
  s.extra.forEach(e=>items.push(e.u?h.U(D.me.name,e.u):h.A(e.a,'Concept note: follow-up requests are acknowledged here but not run.')));
  if(ap&&ap.status==='pending'&&!X.inChat)items.push(permCard(b,ap,X));
  if(!items.length){
    const sug=X.suggest||['Summarise what you can access and what you would do first','Draft a plan for your first week of requests'];
    return `<div class="empty" style="height:100%"><span class="avatar bot" style="width:40px;height:40px">${I('bot',20)}</span><div class="t-h" style="color:var(--ink)">${E(b.name)} has no requests in this session</div><div class="t-sm" style="max-width:420px">${E(b.schedule&&b.schedule!=='On request'?'It also runs on a schedule: '+b.schedule+'. ':'')}Tell it what to do below, or start with one of these.</div><div class="col" style="margin-top:8px;align-items:center">${sug.map(t=>`<button class="chip" data-fill="${E(t)}" data-for="${b.id}">${I('zap',14)}${E(t)}</button>`).join('')}</div></div>`;
  }
  const last=items.length-1;
  return `<div class="bots-thread">${items.map((x,i)=>`<div class="bots-item${run.fresh&&b.id==='analyst-bot'&&i===last?' bots-in':''}">${x}</div>`).join('')}</div>`;
}
function permCard(b,ap,X){
  const dec=st.declining===ap.id;
  return `<div class="bots-perm" role="group" aria-label="Approval needed"><div class="bots-perm-head">${I('alert',16)}<b class="grow">${E(b.name)} needs your approval</b><span class="pill warn">${E(ap.reason)}</span></div>
  <div class="bots-perm-body"><div class="t-h">${E(ap.title)}</div>
  <dl class="bots-kv" style="margin:0"><dt>Asked by</dt><dd>${E(ap.asker)}</dd><dt>Why it stopped</dt><dd>${E(ap.reason)}</dd>${(X.detail||[]).map(d=>`<dt>${E(d[0])}</dt><dd>${E(d[1])}</dd>`).join('')}<dt>What happens after</dt><dd>${E(ap.after)}</dd></dl>
  ${dec?`<div class="field"><label for="bots-note">Tell ${E(b.name)} what to change</label><textarea class="textarea" id="bots-note" data-note data-keep="note" rows="3" placeholder="For example: wait until Monday, or use a cheaper option">${E(S(b.id).note)}</textarea></div>
   <div class="row"><button class="btn btn-primary" data-perm="send" data-ap="${ap.id}">Decline and send</button><button class="btn" data-perm="cancel">Back</button></div>`
  :`<div class="bots-opts"><button class="bots-opt yes" data-perm="yes" data-ap="${ap.id}">${I('check',15)}<span>Yes</span></button>
   <button class="bots-opt" data-perm="always" data-ap="${ap.id}">${I('check',15)}<span>Yes, and don't ask again for this</span><small>${E(X.rule||'Requests like this one')}</small></button>
   <button class="bots-opt" data-perm="no" data-ap="${ap.id}">${I('x',15)}<span>No, and tell the bot what to change</span></button></div>`}</div></div>`;
}
function tasksHTML(b){
  const t=taskState(b);if(!t.length)return '';
  const n=t.filter(x=>x.done).length,id='tasks-'+b.id,open=st.open[id]!==false,live=b.status==='run'||!!pend(b.id);let first=true;
  return `<details class="bots-tasks" data-tool="${id}"${open?' open':''}><summary>${I('list',15)}<b style="font-weight:500">Tasks</b><span class="t-mute">${n} of ${t.length} done</span><span class="bots-bar" aria-hidden="true"><i style="width:${Math.round(n/t.length*100)}%"></i></span><span class="bots-chev">${I('chevron-down',13)}</span></summary>
  <ul class="bots-tasklist">${t.map(x=>{const now=!x.done&&first&&live;if(!x.done)first=false;return `<li class="${x.done?'done':now?'now':''}"><span class="bots-box">${x.done?I('check',11):''}</span><span class="truncate">${E(x.t)}</span>${now?`<span class="t-xs t-mute" style="margin-left:auto;white-space:nowrap">${pend(b.id)?'Waiting for approval':'In progress'}</span>`:''}</li>`}).join('')}</ul></details>`;
}

/* ---------- regions ---------- */
function listHTML(){
  const q=st.q.trim().toLowerCase(),match=b=>!q||[b.name,b.task,b.team,b.owner].join(' ').toLowerCase().includes(q);
  const row=b=>{const s=status(b),p=pend(b.id),on=b.id===st.cur||b.id===st.split;
    return `<div class="bots-row${on?' on':''}"><button class="bots-row-main" data-open="${b.id}"${b.id===st.cur?' aria-current="page"':''}><span class="dot ${s.dot}" title="${s.label}"></span><span class="bots-row-text"><span class="bots-row-top"><span class="bots-row-name truncate">${E(b.name)}</span>${p?'<span class="pill warn">Needs you</span>':b.id===st.split?`<span class="bots-n" title="Open in split view">${I('split',13)}</span>`:b.doneToday?`<span class="bots-n" title="${b.doneToday} requests done today">${b.doneToday}</span>`:''}</span><span class="bots-row-task truncate">${E(S(b.id).paused?'Paused':b.task||'No request yet')}</span></span></button><button class="icon-btn sm bots-row-more" data-more="${b.id}" aria-label="More actions for ${E(b.name)}">${I('more',15)}</button></div>`};
  const group=(label,list)=>list.length?`<div class="bots-glabel"><span>${E(label)}</span><span>${list.length}</span></div>${list.map(row).join('')}`:'';
  const all=D.bots.filter(match),pinned=all.filter(b=>st.pinned.includes(b.id)),rest=all.filter(b=>!st.pinned.includes(b.id)),teams=[];
  rest.forEach(b=>{if(!teams.includes(b.team))teams.push(b.team)});
  return all.length?group('Pinned',pinned)+teams.map(t=>group(t,rest.filter(b=>b.team===t))).join(''):`<div class="empty">${I('search',20)}<div>No sessions match "${E(st.q)}".</div><button class="btn btn-sm" data-clearq>Clear search</button></div>`;
}
function countsHTML(){
  const w=D.bots.filter(b=>b.status==='run'&&!S(b.id).paused).length,n=D.bots.filter(b=>pend(b.id)).length,d=D.bots.reduce((a,b)=>a+(b.doneToday||0),0);
  return `<div class="bots-count"><b>${w}</b><span>working</span></div><div class="bots-count"><b>${n}</b><span>${n===1?'needs you':'need you'}</span></div><div class="bots-count"><b>${d}</b><span>done today</span></div>`;
}
function headHTML(b){
  const s=status(b),tg=(tab,icon,label)=>`<button class="icon-btn" data-ptoggle="${tab}" aria-pressed="${st.pane&&st.tab===tab}" aria-label="${label}" title="${label}">${I(icon,16)}</button>`;
  return `<div class="bots-head-row"><span class="avatar bot">${I('bot',15)}</span><div class="bots-head-title"><h2 class="truncate">${E(b.name)}</h2><span class="pill ${s.pill}"><span class="dot ${s.dot}"></span>${s.label}</span></div>
  <div class="row" style="gap:2px">${st.split?`<button class="btn btn-sm" data-split-close="${b.id}" aria-label="Close ${E(b.name)} and leave split view">${I('x',13)}Close</button>`
    :tg('setup','sliders','Setup')+tg('activity','clock','Activity')+tg('browser','globe','Browser')+tg('files','file','Files')+`<button class="icon-btn" data-splitpick aria-label="Open another session in split view" title="Split view">${I('split',16)}</button>`}<button class="icon-btn" data-more="${b.id}" aria-label="More actions for ${E(b.name)}">${I('more',16)}</button></div></div>
  <div class="bots-head-meta"><span>Owner ${E(b.owner)} · ${E(b.team)}</span>${b.access.map(a=>`<span class="bots-chip">${I(a==='Wallet'?'wallet':'lock',11)}${E(a)}</span>`).join('')}${b.limit?`<span class="bots-chip">Up to ${CW.money(b.limit)}</span>`:''}</div>`;
}
function composerHTML(b){
  const s=S(b.id),running=b.status==='run'&&!s.paused;
  return `<div class="composer bots-composer"><textarea rows="2" data-in="${b.id}" data-keep="in:${b.id}" placeholder="Tell ${E(b.name)} what to do next" aria-label="Message to ${E(b.name)}">${E(s.draft)}</textarea>
  <div class="bar"><div class="row" style="gap:2px;min-width:0"><button class="icon-btn" data-attach aria-label="Attach a file">${I('paperclip',16)}</button><button class="btn btn-ghost btn-sm" data-modepick="${b.id}" aria-label="Permission mode: ${E(s.perm)}">${I('shield',13)}<span class="truncate">${E(s.perm)}</span>${I('chevron-down',12)}</button></div>
  <div class="row" style="gap:4px"><button class="btn btn-ghost btn-sm" data-modelpick="${b.id}" aria-label="Model: ${E(s.model)}">${E(s.model)}${I('chevron-down',12)}</button>${running?`<button class="btn btn-sm bots-stop" data-stop="${b.id}">${I('stop',13)}Stop</button>`:''}<button class="send" data-send="${b.id}" aria-label="Send">${I('arrow-up',16)}</button></div></div></div>`;
}
function colHTML(b){
  return `<section class="bots-col" data-col="${b.id}" aria-label="${E(b.name)} session"><div class="bots-head" data-part="head:${b.id}">${headHTML(b)}</div>
  <div class="bots-tx" data-scroll="tx:${b.id}">${thread(b)}</div>
  <div class="bots-foot"><div class="bots-foot-in"><div data-part="tasks:${b.id}">${tasksHTML(b)}</div>${composerHTML(b)}</div></div></section>`;
}
function activity(b){
  const X=SESS[b.id]||{},ap=apOf(b.id);let a=(X.act||[]).slice();
  if(b.id==='analyst-bot'){a=[['10:51','shield','Signed in to the CRM as Analyst bot, read only'],['10:51','eye','Read the Q2 pipeline review deck']].concat(RUN.slice(0,run.n).map((r,i)=>['10:'+(52+i),r.act[0],r.act[1]]));if(run.stopped)a.push(['Now','stop','Stopped by Asha Raman'])}
  if(ap&&!X.inChat&&ap.status==='approved')a=a.concat(X.actAfter||[]);
  if(ap&&!X.inChat&&ap.status==='declined')a.push(['Now','x','Declined by Asha Raman']);
  return a;
}
function paneBody(b){
  const X=SESS[b.id]||{},s=S(b.id),f=s.form,ap=apOf(b.id);
  if(st.tab==='activity'){const a=activity(b).slice().reverse();
    return a.length?`<div class="row between"><span class="t-h">Today</span><span class="t-xs t-mute">${a.length} events · newest first</span></div><ol class="bots-act">${a.map(r=>`<li><time>${E(r[0])}</time><span class="bots-tic">${I(r[1],13)}</span><span>${E(r[2])}</span></li>`).join('')}</ol><button class="btn btn-sm" style="align-self:flex-start" data-go="settings" data-sub="audit">${I('list',13)}Open the audit log</button>`
     :`<div class="empty">${I('clock',22)}<div>Nothing yet today.</div><div class="t-xs">Every sign-in, key use, payment and change this bot makes is listed here.</div></div>`}
  if(st.tab==='browser'){const P=X.page;
    if(!P)return `<div class="empty">${I('globe',22)}<div>No page open.</div><div class="t-xs">When ${E(b.name)} uses Claude Browser, the page it is on shows here.</div><button class="btn btn-sm" data-go="browser">${I('external',13)}Open Browser</button></div>`;
    const live=(b.status==='run'&&!s.paused)||!!pend(b.id),rows=P.rows.slice();if(P.last&&ap&&ap.status==='approved')rows[rows.length-1]=P.last;
    return `<div class="row between"><span class="row">${live?'<span class="pill accent"><span class="dot run"></span>Live</span>':'<span class="pill">Last page</span>'}<span class="t-xs t-mute">${live?'Updates as the bot works':'The bot has closed this page'}</span></span><button class="btn btn-sm" data-go="browser">${I('external',13)}Open in Browser</button></div>
    <div class="bots-frame"><div class="bots-frame-bar"><span class="bots-frame-dots"><i></i><i></i><i></i></span><span class="bots-frame-url">${I('lock',11)}<span class="truncate">${E(P.url)}</span></span></div>
    <div class="bots-frame-page"><h4>${E(P.title)}</h4>${rows.map((r,i)=>`<div class="bots-prow${i===rows.length-1?' hot':''}"><span>${E(r[0])}</span><span>${E(r[1])}${i===rows.length-1&&live?`<br><span class="bots-here">${I('bot',12)}${E(b.name)} is here</span>`:''}</span></div>`).join('')}</div></div>
    <div class="t-xs t-mute">Signed in with Claude Auth as ${E(b.id)}@larkfield.example. Passwords and keys stay in the vault and are never shown on this page.</div>`}
  if(st.tab==='files'){const F=X.files||[];
    if(!F.length)return `<div class="empty">${I('file',22)}<div>No files yet.</div><div class="t-xs">Files this bot creates or changes in this session are listed here.</div></div>`;
    const k=Math.min(st.file[b.id]||0,F.length-1),cur=F[k];
    return `<div class="row between"><span class="t-h">Changed in this session</span><span class="t-xs t-mute">${F.length} file${F.length>1?'s':''}</span></div>
    <div class="col" style="gap:1px">${F.map((x,i)=>`<button class="bots-file" data-file="${i}" aria-pressed="${i===k}">${I('file',15)}<span class="grow truncate t-mono">${E(x.name)}</span>${x.d?`<span class="t-xs t-mono t-mute">${dstat(x.d[1])}</span>`:''}<span class="pill ${x.meta==='New'?'ok':''}">${E(x.meta)}</span></button>`).join('')}</div>
    <div class="bots-prev"><div class="bots-prev-head"><span class="truncate t-mono">${E(cur.name)}</span><span>${cur.d?'Diff':'Preview'}</span></div>${cur.d?`<div class="bots-diffbody">${diff(cur.d[0],cur.d[1])}</div>`:`<pre>${E(cur.text)}</pre>`}</div>`}
  /* setup */
  const v=(k,d)=>f[k]!=null?f[k]:d,owners=[D.me.name].concat(D.people.map(p=>p.name));if(!owners.includes(b.owner))owners.push(b.owner);
  const wallet=b.access.includes('Wallet'),inst=v('inst',s.inst!=null?s.inst:X.inst||'');
  return `<div class="bots-sec"><h3><label for="bots-inst">Instructions</label></h3><textarea class="textarea" id="bots-inst" rows="7" data-set="inst" data-keep="set-inst" placeholder="Describe what this bot is for, what it must check and when it should stop and ask.">${E(inst)}</textarea><span class="t-xs t-mute">The bot reads these at the start of every request.</span></div>
  <div class="grid-2" style="gap:12px"><div class="field"><label for="bots-owner">Owner</label><select class="select" id="bots-owner" data-set="owner" data-keep="set-owner">${owners.map(o=>`<option${o===v('owner',b.owner)?' selected':''}>${E(o)}</option>`).join('')}</select></div>
  <div class="field"><label>Identity</label><div class="bots-id"><span class="grow truncate">${E(b.id)}@larkfield.example</span><button class="icon-btn sm" data-copy="${E(b.id)}@larkfield.example" aria-label="Copy address">${I('copy',13)}</button></div></div></div>
  <div class="bots-sec"><div class="row between"><h3>What it can access</h3><button class="btn btn-ghost btn-sm" data-go="settings" data-sub="identity">Manage access</button></div>
  <div class="bots-acc">${b.access.length?b.access.map(a=>`<div class="bots-acc-row">${I(a==='Wallet'?'wallet':'lock',14)}<span class="grow">${E(a)}</span><span class="t-xs t-mute">through Claude Auth</span></div>`).join(''):'<div class="bots-acc-row t-mute">No access yet. This bot can only talk.</div>'}</div>
  ${b.scope?`<div class="row wrap" style="gap:4px"><span class="t-xs t-mute">Scopes</span>${b.scope.split(',').map(x=>`<span class="bots-scope">${E(x.trim())}</span>`).join('')}</div>`:''}</div>
  <div class="grid-2" style="gap:12px"><div class="field"><label for="bots-limit">Spend limit per purchase</label><div class="bots-money"><span>$</span><input class="input" id="bots-limit" type="number" min="0" step="50" data-set="limit" data-keep="set-limit" value="${E(v('limit',b.limit||0))}"${wallet?'':' disabled'}></div><span class="t-xs t-mute">${wallet?'Above this, it stops and asks.':'No wallet access, so it cannot spend.'}</span></div>
  <div class="field"><label for="bots-mode">Permission mode</label><select class="select" id="bots-mode" data-set="perm" data-keep="set-perm">${MODES.map(m=>`<option${m[0]===v('perm',s.perm)?' selected':''}>${m[0]}</option>`).join('')}</select><span class="t-xs t-mute">${E((MODES.find(m=>m[0]===v('perm',s.perm))||MODES[0])[1])}.</span></div></div>
  ${s.always?`<div class="bots-sec"><h3>Rules you have saved</h3><div class="bots-acc"><div class="bots-acc-row">${I('check',14)}<span class="grow">Do not ask again: ${E(X.rule||'requests like the last one')}</span><button class="btn btn-ghost btn-sm" data-unrule="${b.id}">Remove</button></div></div></div>`:''}
  <div class="field"><label for="bots-sched">Schedule</label><input class="input" id="bots-sched" data-set="schedule" data-keep="set-schedule" value="${E(v('schedule',b.schedule||'On request'))}"><span class="t-xs t-mute">Plain words work, for example "On request" or "Weekdays 07:00".</span></div>`;
}
function paneHTML(b){
  const tabs=[['setup','Setup'],['activity','Activity'],['browser','Browser'],['files','Files']],dirty=Object.keys(S(b.id).form).length>0;
  return `<aside class="bots-pane" aria-label="${E(b.name)} details"><div class="bots-pane-head"><div class="tabs" role="tablist">${tabs.map(t=>`<button class="tab" role="tab" data-tab="${t[0]}" aria-selected="${st.tab===t[0]}">${t[1]}</button>`).join('')}</div><button class="icon-btn sm" data-pane-close aria-label="Close the side pane">${I('x',14)}</button></div>
  <div class="bots-pane-body" id="bots-pane-body" role="tabpanel" data-scroll="pane:${st.tab}:${b.id}">${paneBody(b)}</div>
  ${st.tab==='setup'?`<div class="bots-pane-foot"><button class="btn btn-primary" data-save="${b.id}">Save</button>${dirty?`<button class="btn btn-ghost" data-discard="${b.id}">Discard</button><span class="t-xs t-mute">Unsaved changes</span>`:''}</div>`:''}</aside>`;
}

/* ---------- drawing ---------- */
function keep(fn){
  if(!root)return;const a=document.activeElement,k=a&&a.dataset&&root.contains(a)?a.dataset.keep:null;let s1,s2;if(k){try{s1=a.selectionStart;s2=a.selectionEnd}catch(e){}}
  const sc={};root.querySelectorAll('[data-scroll]').forEach(el=>{sc[el.dataset.scroll]=el.scrollTop});
  fn();
  root.querySelectorAll('[data-scroll]').forEach(el=>{if(sc[el.dataset.scroll]!=null)el.scrollTop=sc[el.dataset.scroll]});
  if(st.jump){const t=root.querySelector(`[data-scroll="tx:${st.jump}"]`);if(t)t.scrollTop=t.scrollHeight;st.jump=null}
  if(k){const n=root.querySelector(`[data-keep="${k}"]`);if(n){n.focus();try{if(s1!=null)n.setSelectionRange(s1,s2)}catch(e){}}}
}
function draw(){
  if(!CW.bot(st.cur))st.cur=(D.bots[0]||{}).id;
  if(st.split&&(!CW.bot(st.split)||st.split===st.cur))st.split=null;
  const b=CW.bot(st.cur),b2=st.split?CW.bot(st.split):null,pane=st.pane&&!b2;
  keep(()=>{root.innerHTML=`<div class="bots${pane?' has-pane':''}"><aside class="bots-side" aria-label="Bot sessions"><div class="bots-side-top"><button class="btn btn-primary" data-new>${I('plus',15)}New bot</button><label class="search">${I('search',15)}<input id="bots-q" data-keep="q" placeholder="Search sessions" aria-label="Search sessions" value="${E(st.q)}"></label></div>
   <div class="bots-list" id="bots-list" data-scroll="list">${listHTML()}</div><div class="bots-counts" id="bots-counts" aria-label="Summary">${countsHTML()}</div></aside>
   <div class="bots-cols${b2?' two':''}">${b?colHTML(b):''}${b2?colHTML(b2):''}</div>${pane&&b?paneHTML(b):''}</div>`});
}
function drawList(){const l=root&&root.querySelector('#bots-list'),c=root&&root.querySelector('#bots-counts');if(l)l.innerHTML=listHTML();if(c)c.innerHTML=countsHTML()}
function tick(){
  const b=CW.bot('analyst-bot');if(!b||!root||CW.mode!=='bots'||b.status!=='run'||S(b.id).paused||(st.cur!==b.id&&st.split!==b.id))return;
  const tx=root.querySelector('[data-scroll="tx:analyst-bot"]');if(!tx)return;
  const near=tx.scrollHeight-tx.scrollTop-tx.clientHeight<140;
  run.n++;run.fresh=true;
  if(run.n>=RUN.length){run.n=RUN.length;b.status='done';b.doneToday++;if(near)st.jump=b.id;draw()}
  else{tx.innerHTML=thread(b);const t=root.querySelector('[data-part="tasks:analyst-bot"]');if(t)t.innerHTML=tasksHTML(b);drawList();
    if(st.cur===b.id&&!st.split&&st.pane&&st.tab==='activity'){const p=root.querySelector('#bots-pane-body');if(p)p.innerHTML=paneBody(b)}
    if(near)tx.scrollTop=tx.scrollHeight}
  run.fresh=false;
}
function render(el,sub){
  root=el;
  const a=CW.bot('analyst-bot');
  if(a&&a.status==='run'&&reduced()){run.n=RUN.length;a.status='done';a.doneToday++}
  else if(!run.timer&&!reduced())run.timer=setInterval(tick,1300);
  if(sub&&CW.bot(sub)){if(st.split===sub)st.split=null;if(st.cur!==sub||!el.firstChild)st.jump=sub;st.cur=sub}
  if(!CW.bot(st.cur)){const p=CW.pending().find(x=>x.mode==='bots');st.cur=p?p.bot:(D.bots[0]||{}).id;st.jump=st.cur}
  else if(!st.jump)st.jump=st.cur;
  draw();
}
CW.register('bots',{render});
CW.on('approvals',a=>{if(CW.mode!=='bots'||!root)return;st.declining=null;if(a&&a.bot)st.jump=a.bot;draw()});

/* ---------- actions ---------- */
function uniq(base){let id=base,i=2;while(CW.bot(id))id=base+'-'+(i++);return id}
function open(id){if(id===st.split){st.split=null}CW.go('bots',id)}
function rowMenu(anchor,id){
  const b=CW.bot(id),s=S(id),pin=st.pinned.includes(id);
  CW.menu(anchor,[
    {label:pin?'Unpin':'Pin to top',icon:'bookmark',onClick:()=>{st.pinned=pin?st.pinned.filter(x=>x!==id):st.pinned.concat(id);draw();CW.toast(pin?b.name+' unpinned.':b.name+' pinned to the top.')}},
    {label:s.paused?'Resume':'Pause',icon:s.paused?'play':'pause',onClick:()=>{s.paused=!s.paused;draw();CW.toast(s.paused?b.name+' is paused. It will not start new work until you resume it.':b.name+' resumed.')}},
    {label:'Duplicate',icon:'copy',onClick:()=>{const c=Object.assign({},b,{id:uniq(id+'-copy'),name:b.name+' copy',status:'idle',task:'',doneToday:0,access:b.access.slice()});
      D.bots.splice(D.bots.indexOf(b)+1,0,c);S(c.id).inst=s.inst!=null?s.inst:(SESS[id]||{}).inst||'';CW.toast('Duplicated. The copy has the same setup and an empty session.');open(c.id)}},
    'sep',
    st.split===id||(st.split&&st.cur===id)?{label:'Close split view',icon:'x',onClick:()=>closeSplit(id)}
      :{label:'Open in split view',icon:'split',onClick:()=>{if(id===st.cur){CW.toast(b.name+' is already open. Choose another session for the second column.');return}st.split=id;st.jump=id;draw()}}
  ]);
}
function closeSplit(id){if(id===st.cur&&st.split){const o=st.split;st.split=null;CW.go('bots',o)}else{st.split=null;draw()}}
function send(id){
  const b=CW.bot(id),s=S(id),t=s.draft.trim();if(!t){CW.toast('Type a request first.');return}
  const ack=s.paused?'Noted. I am paused, so I will pick this up when you resume me.':pend(id)?'Noted. I am still waiting for the approval before I change anything, and I will take this into account when I continue.':b.status==='run'?'Noted. I will fold that in as soon as the current step finishes.':'Got it. I have added this to the session as the next request.';
  s.extra.push({u:t},{a:ack});s.draft='';if(!b.task)b.task=t.length>60?t.slice(0,57)+'...':t;st.jump=id;draw();
  const ta=root.querySelector(`[data-in="${id}"]`);if(ta)ta.focus();
}
function newBot(){
  const teams=[];D.bots.forEach(b=>{if(!teams.includes(b.team))teams.push(b.team)});
  const owners=[D.me.name].concat(D.people.map(p=>p.name));
  const m=CW.modal({title:'New bot',body:`
   <div class="grid-2" style="gap:12px"><div class="field"><label for="nb-name">Name</label><input class="input" id="nb-name" placeholder="For example, Renewals bot" autocomplete="off"><span class="bots-err" id="nb-err" hidden>Give the bot a name.</span></div>
   <div class="field"><label for="nb-team">Team</label><select class="select" id="nb-team">${teams.map(t=>`<option>${E(t)}</option>`).join('')}</select></div></div>
   <div class="grid-2" style="gap:12px"><div class="field"><label for="nb-owner">Owner</label><select class="select" id="nb-owner">${owners.map(o=>`<option>${E(o)}</option>`).join('')}</select></div>
   <div class="field"><label for="nb-sched">Schedule</label><input class="input" id="nb-sched" value="On request"></div></div>
   <div class="field"><label for="nb-inst">What it should do</label><textarea class="textarea" id="nb-inst" rows="4" placeholder="Describe the job in plain words: what it is for, what it must check, and when it should stop and ask."></textarea></div>
   <div class="field"><label>What it can access</label><div class="bots-checks">${Object.keys(ACCESS).map(a=>`<label><input type="checkbox" value="${E(a)}"${a==='Browser'?' checked':''}>${E(a)}</label>`).join('')}</div></div>
   <div class="grid-2" style="gap:12px"><div class="field"><label for="nb-limit">Spend limit per purchase</label><div class="bots-money"><span>$</span><input class="input" id="nb-limit" type="number" min="0" step="50" value="0"></div><span class="t-xs t-mute">Needs Wallet access. 0 means it cannot spend.</span></div>
   <div class="field"><label for="nb-mode">Permission mode</label><select class="select" id="nb-mode">${MODES.map(x=>`<option>${x[0]}</option>`).join('')}</select></div></div>`,
   foot:`<button class="btn" data-close>Cancel</button><button class="btn btn-primary" id="nb-create">Create bot</button>`});
  const g=id=>m.querySelector(id);
  g('#nb-create').addEventListener('click',()=>{
    const name=g('#nb-name').value.trim();if(!name){g('#nb-err').hidden=false;g('#nb-name').focus();return}
    const access=[...m.querySelectorAll('.bots-checks input:checked')].map(c=>c.value),id=uniq(name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'bot');
    const mode=g('#nb-mode').value;
    D.bots.push({id,name,team:g('#nb-team').value,owner:g('#nb-owner').value,status:'idle',task:'',access,scope:access.map(a=>ACCESS[a]).join(', '),limit:access.includes('Wallet')?Math.max(0,Number(g('#nb-limit').value)||0):0,mode,schedule:g('#nb-sched').value.trim()||'On request',doneToday:0});
    const s=S(id);s.inst=g('#nb-inst').value;s.perm=mode;st.tab='setup';
    CW.closeModal();CW.toast(name+' created. It is idle until you give it a request.');CW.go('bots',id);
  });
  g('#nb-name').addEventListener('input',()=>{g('#nb-err').hidden=true});
}

document.addEventListener('click',e=>{
  if(CW.mode!=='bots'||!root||!e.target.closest('#view'))return;
  const q=sel=>e.target.closest(sel);let el;
  if(q('[data-new]')){newBot();return}
  if((el=q('[data-more]'))){e.stopPropagation();rowMenu(el,el.dataset.more);return}
  if((el=q('[data-open]'))){open(el.dataset.open);return}
  if(q('[data-clearq]')){st.q='';draw();return}
  if((el=q('[data-go]'))){CW.go(el.dataset.go,el.dataset.sub);return}
  if((el=q('[data-ptoggle]'))){const t=el.dataset.ptoggle;if(st.pane&&st.tab===t)st.pane=false;else{st.pane=true;st.tab=t}draw();return}
  if((el=q('[data-tab]'))){st.tab=el.dataset.tab;draw();return}
  if(q('[data-pane-close]')){st.pane=false;draw();return}
  if((el=q('[data-splitpick]'))){e.stopPropagation();CW.menu(el,D.bots.filter(b=>b.id!==st.cur).map(b=>({label:b.name,icon:'bot',hint:status(b).label,onClick:()=>{st.split=b.id;st.jump=b.id;draw()}})));return}
  if((el=q('[data-split-close]'))){closeSplit(el.dataset.splitClose);return}
  if((el=q('[data-perm]'))){const k=el.dataset.perm,id=el.dataset.ap,ap=D.approvals.find(a=>a.id===id);
    if(k==='cancel'){st.declining=null;draw();return}
    if(k==='no'){st.declining=id;st.jump=ap.bot;draw();const n=root.querySelector('[data-note]');if(n)n.focus();return}
    if(k==='send'){CW.resolveApproval(id,'declined');return}
    if(k==='always')S(ap.bot).always=true;
    CW.resolveApproval(id,'approved');return}
  if((el=q('[data-send]'))){send(el.dataset.send);return}
  if((el=q('[data-stop]'))){const b=CW.bot(el.dataset.stop);b.status='idle';if(b.id==='analyst-bot')run.stopped=true;st.jump=b.id;draw();CW.toast(b.name+' stopped. Nothing further will run.');return}
  if((el=q('[data-resume]'))){const b=CW.bot(el.dataset.resume);b.status='run';run.stopped=false;st.jump=b.id;draw();return}
  if(q('[data-attach]')){CW.toast('Attaching files is not part of this concept yet.');return}
  if((el=q('[data-modepick]'))){e.stopPropagation();const id=el.dataset.modepick,s=S(id);CW.menu(el,MODES.map(m=>({label:m[0],icon:m[0]===s.perm?'check':'shield',hint:m[0]===s.perm?'Current':'',onClick:()=>{s.perm=m[0];delete s.form.perm;CW.bot(id).mode=m[0];draw();CW.toast('Permission mode: '+m[0]+'. '+m[1]+'.')}})));return}
  if((el=q('[data-modelpick]'))){e.stopPropagation();const id=el.dataset.modelpick,s=S(id);CW.menu(el,MODELS.map(m=>({label:m[0],icon:m[0]===s.model?'check':'zap',hint:m[1],onClick:()=>{s.model=m[0];draw()}})));return}
  if((el=q('[data-fill]'))){const id=el.dataset.for,s=S(id);s.draft=el.dataset.fill;const ta=root.querySelector(`[data-in="${id}"]`);if(ta){ta.value=s.draft;ta.focus()}return}
  if((el=q('[data-file]'))){st.file[st.cur]=+el.dataset.file;draw();return}
  if((el=q('[data-copy]'))){const t=el.dataset.copy;try{navigator.clipboard.writeText(t).then(()=>CW.toast('Address copied.'),()=>CW.toast('Copy is blocked here. The address is '+t))}catch(x){CW.toast('Copy is blocked here. The address is '+t)}return}
  if((el=q('[data-unrule]'))){S(el.dataset.unrule).always=false;draw();CW.toast('Rule removed. The bot will ask again next time.');return}
  if((el=q('[data-discard]'))){S(el.dataset.discard).form={};draw();return}
  if((el=q('[data-save]'))){const b=CW.bot(el.dataset.save),s=S(b.id),f=s.form;
    if(f.inst!=null)s.inst=f.inst;if(f.owner)b.owner=f.owner;if(f.limit!=null)b.limit=Math.max(0,Number(f.limit)||0);if(f.perm){s.perm=f.perm;b.mode=f.perm}if(f.schedule!=null)b.schedule=f.schedule.trim()||'On request';
    s.form={};draw();CW.toast('Setup saved for '+b.name+'.');return}
});
document.addEventListener('input',e=>{
  if(CW.mode!=='bots'||!root)return;const t=e.target;if(!t.dataset||!root.contains(t))return;
  if(t.id==='bots-q'){st.q=t.value;drawList();return}
  if(t.dataset.in){S(t.dataset.in).draft=t.value;return}
  if(t.dataset.note!=null){const ap=D.approvals.find(a=>a.id===st.declining);if(ap)S(ap.bot).note=t.value.trim();return}
  if(t.dataset.set){const s=S(st.cur),was=Object.keys(s.form).length;s.form[t.dataset.set]=t.value;if(!was||t.tagName==='SELECT')draw()}
});
document.addEventListener('keydown',e=>{
  if(CW.mode!=='bots'||!e.target.dataset||!e.target.dataset.in)return;
  if(e.key==='Enter'&&!e.shiftKey&&!e.isComposing){e.preventDefault();send(e.target.dataset.in)}
});
document.addEventListener('toggle',e=>{const t=e.target;if(t&&t.dataset&&t.dataset.tool&&t.closest&&t.closest('.bots'))st.open[t.dataset.tool]=t.open},true);
})();
