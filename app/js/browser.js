/* Browser mode: a browser that the person and their bots both use. Bots browse as themselves in their own tabs.
   All sites are invented and rendered locally. State lives in module scope so it survives leaving the mode. */
(function(){
const CW=window.CW,D=CW.data,I=CW.icon,E=CW.esc,M=CW.money;
CW.css('browser',`
.br{display:flex;flex-direction:column;height:100%;min-height:0;background:var(--bg-side);position:relative}
.br-tone-accent{--tone:var(--accent-strong);--tone-soft:var(--accent-soft)} .br-tone-info{--tone:var(--info);--tone-soft:var(--info-soft)} .br-tone-ok{--tone:var(--ok);--tone-soft:var(--ok-soft)}
.br-tone-warn{--tone:var(--warn);--tone-soft:var(--warn-soft)} .br-tone-bad{--tone:var(--bad);--tone-soft:var(--bad-soft)} .br-tone-ink{--tone:var(--ink-2);--tone-soft:var(--bg-active)}
.br-glyph{width:16px;height:16px;border-radius:calc(var(--r-sm) - 2px);background:var(--tone-soft);color:var(--tone);display:grid;place-items:center;font-size:10px;font-weight:700;flex:none;line-height:1}
.br-glyph.big{width:28px;height:28px;border-radius:var(--r-sm);font-size:14px}
.br .icon-btn:disabled{opacity:.35;cursor:default;background:none}

/* tab strip */
.br-strip{display:flex;align-items:flex-end;gap:8px;padding:6px 8px 0;height:42px;flex:none;border-bottom:1px solid var(--line);min-width:0}
.br-zone{display:flex;align-items:flex-end;gap:2px;min-width:0;flex:0 1 auto;height:35px}
.br-zone.bots{background:var(--accent-soft);border-radius:var(--r-md) var(--r-md) 0 0;padding:0 4px}
.br-zl{flex:none;display:flex;align-items:center;gap:5px;height:34px;padding:0 6px 0 4px;font-size:11.5px;font-weight:600;color:var(--ink-3);white-space:nowrap}
.br-zone.bots .br-zl{color:var(--accent-strong)}
.br-tab{display:flex;align-items:center;height:34px;flex:0 1 184px;min-width:34px;border-radius:var(--r-md) var(--r-md) 0 0;position:relative;color:var(--ink-3);border:1px solid transparent;border-bottom:0;overflow:hidden}
.br-tab.bot{flex-basis:216px}
.br-tab:hover{background:var(--bg-hover);color:var(--ink)}
.br-tab.on{background:var(--bg);color:var(--ink);border-color:var(--line);height:35px;margin-bottom:-1px}
.br-tab.pin{flex:none;width:36px}
.br-tab.grouped::after{content:"";position:absolute;left:6px;right:6px;bottom:0;height:2px;border-radius:2px;background:var(--tone)}
.br-tab-main{flex:1;min-width:0;display:flex;align-items:center;gap:8px;border:0;background:none;height:100%;padding:0 4px 0 9px;text-align:left;color:inherit;font-size:12.5px}
.br-tab-main:focus-visible{outline-offset:-2px}
.br-tab-t{flex:1}
.br-tab-bn{color:var(--accent-strong);font-weight:600}
.br-tab-mark{position:absolute;left:18px;top:15px;width:13px;height:13px;border-radius:50%;background:var(--accent);color:var(--on-accent);display:grid;place-items:center;pointer-events:none}
.br-tab-mark svg{width:9px;height:9px}
.br-tab-b{flex:none;display:none;width:20px;height:20px;border:0;background:none;border-radius:var(--r-sm);color:var(--ink-3);place-items:center;padding:0;margin-right:2px}
.br-tab-b:hover{background:var(--bg-active);color:var(--ink)}
.br-tab:hover .br-tab-b,.br-tab.on .br-tab-b,.br-tab:focus-within .br-tab-b{display:grid}
.br-group{flex:none;display:inline-flex;align-items:center;gap:5px;height:22px;margin:0 2px 6px;border:0;border-radius:var(--r-sm);padding:0 8px;font-size:11.5px;font-weight:600;background:var(--tone-soft);color:var(--tone);white-space:nowrap}
.br-group:hover{box-shadow:inset 0 0 0 1px var(--tone)}
.br-new{margin:0 0 5px 2px;flex:none}

/* toolbar */
.br-bar{display:flex;align-items:center;gap:4px;padding:6px 8px;background:var(--bg);flex:none}
.br-addr{flex:1;min-width:0;display:flex;align-items:center;gap:4px;height:32px;background:var(--bg-sunk);border:1px solid transparent;border-radius:var(--r-lg);padding:0 4px;position:relative;margin:0 4px}
.br-addr:hover{border-color:var(--line)}
.br-addr:focus-within{background:var(--bg-raised);border-color:var(--accent)}
.br-addr input{flex:1;border:0;background:none;outline:0;min-width:0;font-size:13px;padding:0 4px}
.br-addr input::placeholder{color:var(--ink-4)}
.br-star[aria-pressed="true"]{color:var(--accent-strong)} .br-star[aria-pressed="true"] svg{fill:var(--accent)}
.br-tog[aria-pressed="true"]{background:var(--bg-active);color:var(--ink)}
.br-profbtn{display:inline-flex;align-items:center;gap:4px;border:0;background:none;border-radius:var(--r-md);padding:3px 6px 3px 4px;color:var(--ink-3);height:30px}
.br-profbtn:hover{background:var(--bg-hover)}
.br-profbtn .avatar{width:22px;height:22px;font-size:9.5px} .br-profbtn .avatar.bot{border-radius:var(--r-sm)}
.br-dd{position:absolute;top:36px;left:-1px;right:-1px;z-index:30;background:var(--bg-raised);border:1px solid var(--line);border-radius:var(--r-lg);box-shadow:var(--shadow-3);padding:6px;display:flex;flex-direction:column;gap:1px}
.br-dd-row{display:flex;align-items:center;gap:10px;border:0;background:none;text-align:left;padding:7px 10px;border-radius:var(--r-sm);width:100%;min-width:0;font-size:13px}
.br-dd-row:hover,.br-dd-row.on{background:var(--bg-hover)}
.br-dd-row.ask{color:var(--accent-strong);font-weight:500}
.br-dd-sep{font-size:11px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--ink-3);padding:8px 10px 2px}
.br-load{height:2px;flex:none;position:relative;overflow:hidden;background:var(--bg)}
.br-load i{position:absolute;inset:0;background:var(--accent);transform:translateX(-101%)}
.br-load.on i{animation:br-load .6s ease-out}
@keyframes br-load{from{transform:translateX(-101%)}70%{transform:translateX(-12%)}to{transform:translateX(0)}}

/* bookmarks bar */
.br-bm{display:flex;align-items:center;gap:2px;padding:0 8px 6px;background:var(--bg);flex:none;overflow:hidden;white-space:nowrap}
.br-bm-item{display:inline-flex;align-items:center;gap:6px;border:0;background:none;border-radius:var(--r-sm);padding:3px 8px;font-size:12.5px;color:var(--ink-2);max-width:190px;flex:none}
.br-bm-item:hover{background:var(--bg-hover);color:var(--ink)}
.br-bm-sep{width:1px;height:16px;background:var(--line);margin:0 4px;flex:none}

/* bot session bar */
.br-sess{display:flex;align-items:center;gap:12px;padding:7px 12px;background:var(--accent-soft);border-top:1px solid var(--line);font-size:13px;flex:none}
.br-sess.taken{background:var(--info-soft)}
.br-sess .avatar{width:26px;height:26px;background:var(--bg-raised)}
.br-sess-step{display:flex;align-items:center;gap:6px;color:var(--ink-2);min-width:0}
.br-sess .dot.run{animation:br-blink 1.4s ease-in-out infinite}
@keyframes br-blink{50%{opacity:.3}}

/* stage, viewport, bot cursor */
.br-stage{flex:1;min-height:0;display:flex;border-top:1px solid var(--line);position:relative}
.br-wrap{flex:1;min-width:0;position:relative;display:flex}
.br-view{flex:1;min-width:0;overflow-y:auto;overflow-x:hidden;position:relative;background:var(--bg)}
.br-doc{min-height:100%;display:flex;flex-direction:column}
.br-frame{position:absolute;inset:0;pointer-events:none;border:2px solid var(--accent);opacity:.55;z-index:5}
.br-cursor{position:absolute;left:0;top:0;z-index:4;pointer-events:none;transition:transform .7s cubic-bezier(.3,.7,.2,1);display:flex;align-items:flex-start}
.br-cursor svg{fill:var(--accent);stroke:var(--bg-raised);stroke-width:1.5;stroke-linejoin:round;flex:none}
.br-cursor b{margin:14px 0 0 -2px;background:var(--accent);color:var(--on-accent);font-size:11px;font-weight:600;border-radius:var(--r-sm);padding:1px 6px;white-space:nowrap;box-shadow:var(--shadow-1)}
.br-cursor i{position:absolute;left:-9px;top:-9px;width:24px;height:24px;border-radius:50%;border:2px solid var(--accent);opacity:0;animation:br-pulse 1.6s ease-out infinite}
.br-cursor.still i{animation:none}
@keyframes br-pulse{from{transform:scale(.4);opacity:.8}to{transform:scale(1.7);opacity:0}}
.br-hl{outline:2px solid var(--accent);outline-offset:3px;border-radius:var(--r-sm);transition:outline-color .3s}
@media (prefers-reduced-motion:reduce){.br-cursor,.br-hl{transition:none}.br-cursor i,.br-sess .dot.run,.br-load.on i{animation:none}}

/* popovers and the pay sheet */
.br-pop{position:absolute;z-index:35;width:340px;max-width:calc(100% - 16px);max-height:calc(100% - 100px);overflow:auto;background:var(--bg-raised);border:1px solid var(--line);border-radius:var(--r-lg);box-shadow:var(--shadow-3)}
.br-pop-row{display:flex;align-items:flex-start;gap:10px;padding:10px 14px;border-bottom:1px solid var(--line)}
.br-pop-row:last-child{border-bottom:0}
.br-pop-row>svg{margin-top:2px;color:var(--ink-3)}
.br-perm{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:5px 0;font-size:13px}
.br-prog{height:4px;border-radius:2px;background:var(--bg-active);overflow:hidden;margin:4px 0 2px}
.br-prog i{display:block;height:100%;background:var(--accent);border-radius:2px;transition:width .4s}
.br-scrim{position:absolute;inset:0;z-index:20;background:color-mix(in srgb,var(--ink) 28%,transparent);display:grid;place-items:start center;padding:32px 16px;overflow:auto}
.br-sheet{width:min(440px,100%);background:var(--bg-raised);border:1px solid var(--line);border-radius:var(--r-xl);box-shadow:var(--shadow-3);display:flex;flex-direction:column}
.br-sheet-head{display:flex;align-items:center;gap:8px;padding:12px 16px;border-bottom:1px solid var(--line)}
.br-sheet-body{padding:16px;display:flex;flex-direction:column;gap:12px}
.br-sheet-foot{display:flex;justify-content:flex-end;gap:8px;padding:12px 16px;border-top:1px solid var(--line)}
.br-amt{font-family:var(--serif);font-size:34px;line-height:1.1;letter-spacing:-.01em}
.br-kv{display:grid;grid-template-columns:96px minmax(0,1fr);gap:6px 12px;font-size:13px}
.br-kv dt{color:var(--ink-3)} .br-kv dd{margin:0}
.br-rule{display:flex;gap:8px;align-items:flex-start;border-radius:var(--r-md);padding:8px 10px;font-size:13px;background:var(--ok-soft);color:var(--ok)}
.br-rule.warn{background:var(--warn-soft);color:var(--warn)}
.br-rule svg{margin-top:2px}
.br-done-ico{width:40px;height:40px;border-radius:50%;background:var(--ok-soft);color:var(--ok);display:grid;place-items:center}

/* side panel */
.br-panel{width:360px;flex:none;border-left:1px solid var(--line);background:var(--bg-side);display:flex;flex-direction:column;min-height:0}
.br-ph{display:flex;align-items:center;gap:8px;padding:8px 8px 8px 14px;border-bottom:1px solid var(--line);flex:none}
.br-spark{width:22px;height:22px;border-radius:var(--r-sm);background:var(--accent);color:var(--on-accent);display:grid;place-items:center;flex:none}
.br-pb{flex:1;min-height:0;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:16px}
.br-pb ul{margin:0;padding-left:18px;display:flex;flex-direction:column;gap:4px;font-size:13.5px;color:var(--ink-2)}
.br-pc{padding:10px 12px 12px;flex:none}
.br-pc .composer{border-radius:var(--r-lg);padding:8px 8px 8px 10px;box-shadow:var(--shadow-1);gap:4px}
.br-pc .composer textarea{font-size:13.5px;min-height:36px}
.br-pc .send{width:28px;height:28px}
.br-trail{display:flex;flex-direction:column;gap:0;font-size:13px}
.br-trail li{list-style:none}
.br-step{display:grid;grid-template-columns:18px minmax(0,1fr) auto;gap:8px;padding:5px 0;align-items:start}
.br-step .m{width:16px;height:16px;border-radius:50%;display:grid;place-items:center;margin-top:1px;border:1.5px solid var(--line-strong);color:var(--ink-4)}
.br-step.done .m{background:var(--ok-soft);border-color:transparent;color:var(--ok)}
.br-step.now .m{border-color:var(--accent);background:var(--accent-soft)} .br-step.now{font-weight:500}
.br-step.wait .m{border-color:var(--warn);background:var(--warn-soft)} .br-step.stop .m{border-color:var(--bad);background:var(--bad-soft);color:var(--bad)}
.br-step.next{color:var(--ink-3)}
.br-q{align-self:flex-end;background:var(--bg-active);border-radius:var(--r-lg);padding:7px 11px;max-width:88%;font-size:13.5px}
.br-ans{font-family:var(--serif);font-size:15px;line-height:1.55}

/* shared page furniture for the invented sites */
.br-sh{display:flex;align-items:center;gap:20px;padding:0 24px;height:52px;border-bottom:1px solid var(--line);background:var(--bg-raised);flex:none}
.br-brand{display:flex;align-items:center;gap:10px;font-size:15px;white-space:nowrap}
.br-snav{display:flex;gap:2px;min-width:0}
.br-snav button,.br-snav span{border:0;background:none;border-radius:var(--r-sm);padding:5px 10px;color:var(--ink-3);font-weight:500;font-size:13px;white-space:nowrap}
.br-snav button:hover{background:var(--bg-hover);color:var(--ink)}
.br-snav span{color:var(--ink);box-shadow:inset 0 -2px 0 var(--tone,var(--ink))}
.br-who{display:flex;align-items:center;gap:8px;font-size:12.5px;color:var(--ink-2);white-space:nowrap}
.br-who .avatar{width:24px;height:24px;font-size:10px}
.br-body{max-width:1080px;width:100%;margin:0 auto;padding:24px;display:flex;flex-direction:column;gap:16px}
.br-body.sunk-bg{max-width:none} .br-fill{background:var(--bg-sunk);flex:1}
.br-cols{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,3fr);gap:16px;align-items:start}
.br-crumb{font-size:12.5px;color:var(--ink-3);display:flex;gap:6px;align-items:center}
.br-link{border:0;background:none;padding:0;color:var(--info);font-weight:500;text-align:left}
.br-link:hover{text-decoration:underline}
.br-fields{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:14px 20px}
.br-fields dt{font-size:12px;color:var(--ink-3)} .br-fields dd{margin:2px 0 0;font-weight:500}
.br-stages{display:flex;gap:4px}
.br-stages span{flex:1;text-align:center;font-size:12px;font-weight:500;padding:5px 8px;background:var(--bg-sunk);color:var(--ink-3);border-radius:var(--r-sm);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.br-stages span.past{background:var(--info-soft);color:var(--info)} .br-stages span.cur{background:var(--info);color:var(--bg-raised)}
.br-act{display:grid;grid-template-columns:28px minmax(0,1fr) auto;gap:10px;padding:10px 16px;border-bottom:1px solid var(--line);font-size:13px;align-items:start}
.br-act:last-child{border-bottom:0}
.br-banner{display:flex;align-items:center;gap:10px;border-radius:var(--r-md);padding:9px 12px;font-size:13px;background:var(--warn-soft);color:var(--warn)}
.br-banner.ok{background:var(--ok-soft);color:var(--ok)} .br-banner.info{background:var(--info-soft);color:var(--info)}
.br-stripe{background:var(--warn-soft);color:var(--warn);font-size:12px;font-weight:600;padding:4px 24px;display:flex;gap:8px;align-items:center;flex:none}
.br-stepper{display:inline-flex;align-items:center;border:1px solid var(--line-strong);border-radius:var(--r-md);overflow:hidden;background:var(--bg-raised)}
.br-stepper button{border:0;background:none;width:32px;height:34px;font-size:16px;color:var(--ink-2)}
.br-stepper button:hover:not(:disabled){background:var(--bg-hover)} .br-stepper button:disabled{opacity:.4;cursor:not-allowed}
.br-stepper output{min-width:52px;text-align:center;font-family:var(--mono);font-size:15px;font-weight:500;border-left:1px solid var(--line);border-right:1px solid var(--line);line-height:34px}
.br-meter{height:8px;border-radius:4px;background:var(--bg-active);overflow:hidden}
.br-meter i{display:block;height:100%;background:var(--ok);border-radius:4px}
.br-sum{display:flex;justify-content:space-between;gap:12px;padding:6px 0;font-size:13.5px}
.br-sum.total{border-top:1px solid var(--line);margin-top:6px;padding-top:12px;font-weight:600;font-size:15px}
.br-payline{display:flex;gap:10px;align-items:flex-start;border:1px solid var(--accent);background:var(--accent-soft);border-radius:var(--r-md);padding:10px 12px;font-size:13px}

/* new tab page */
.br-nt{max-width:920px;width:100%;margin:0 auto;padding:56px 24px 48px;display:flex;flex-direction:column;gap:24px}
.br-nt h1{text-align:center}
.br-nt-search{max-width:600px;width:100%;margin:0 auto;padding:10px 14px;border-radius:var(--r-xl);box-shadow:var(--shadow-2)}
.br-nt-search:focus-within{border-color:var(--accent)}
.br-nt-search input{font-size:15px}
.br-nt-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(128px,1fr));gap:8px}
.br-short{display:flex;flex-direction:column;align-items:center;gap:8px;border:1px solid transparent;background:none;border-radius:var(--r-lg);padding:14px 8px;min-width:0}
.br-short:hover{background:var(--bg-hover);border-color:var(--line)}
.br-short .br-glyph{width:40px;height:40px;border-radius:var(--r-md);font-size:18px}
.br-short b{font-weight:500;font-size:13px;max-width:100%} .br-short span.h{font-size:11.5px;color:var(--ink-3);max-width:100%}

/* sign-in, checkout, docs, results, internal pages */
.br-si{flex:1;display:grid;place-items:center;padding:40px 24px;background:var(--bg-sunk)}
.br-si-box{display:flex;gap:16px;align-items:flex-start;flex-wrap:wrap;justify-content:center}
.br-si-card{width:360px;max-width:100%;display:flex;flex-direction:column;gap:14px;padding:24px}
.br-vault{width:300px;max-width:100%;background:var(--bg-raised);border:1px solid var(--accent);border-radius:var(--r-lg);box-shadow:var(--shadow-2);padding:14px;display:flex;flex-direction:column;gap:10px;position:relative;margin-top:86px}
.br-vault::before{content:"";position:absolute;left:-6px;top:22px;width:10px;height:10px;background:var(--bg-raised);border-left:1px solid var(--accent);border-bottom:1px solid var(--accent);transform:rotate(45deg)}
.br-vnote{display:flex;align-items:center;gap:5px;font-size:11.5px;color:var(--ok);font-weight:500}
.br-masked{background:var(--bg-sunk);letter-spacing:.12em}
.br-docs{display:grid;grid-template-columns:220px minmax(0,1fr);gap:40px;max-width:1000px;width:100%;margin:0 auto;padding:32px 24px 64px}
.br-toc{position:sticky;top:24px;align-self:start;display:flex;flex-direction:column;gap:1px}
.br-art{max-width:660px;font-family:var(--serif);font-size:16.5px;line-height:1.65;display:flex;flex-direction:column;gap:14px}
.br-art h2{font-family:var(--serif);font-weight:500;font-size:21px;margin-top:14px;letter-spacing:-.005em}
.br-art ol{margin:0;padding-left:22px;display:flex;flex-direction:column;gap:6px}
.br-art code{font-family:var(--mono);font-size:13.5px;background:var(--bg-sunk);border-radius:4px;padding:1px 5px}
.br-art .br-banner{font-family:var(--sans)}
.br-res{display:flex;gap:12px;align-items:flex-start;border:0;background:none;text-align:left;padding:12px;border-radius:var(--r-md);width:100%}
.br-res:hover{background:var(--bg-hover)}
.br-res b{font-family:var(--serif);font-weight:500;font-size:17px;color:var(--info)}
.br-int{max-width:820px;width:100%;margin:0 auto;padding:32px 24px 56px;display:flex;flex-direction:column;gap:16px}
.br-dl{display:grid;grid-template-columns:32px minmax(0,1fr) auto;gap:10px;align-items:center;padding:10px 14px;border-bottom:1px solid var(--line)}
.br-dl:last-child{border-bottom:0}
.br-dl-ico{width:32px;height:32px;border-radius:var(--r-sm);background:var(--bg-sunk);color:var(--ink-3);display:grid;place-items:center}
@media (max-width:900px){.br-panel{position:absolute;right:0;top:0;bottom:0;z-index:15;box-shadow:var(--shadow-3);max-width:100%}.br-cols,.br-docs{grid-template-columns:minmax(0,1fr)}.br-toc{display:none}.br-zl{display:none}}
`);

/* ---------- sites and pages ---------- */
const HOME='claude://newtab';
const U={crm:'https://crm.larkfield.example/deals/HD-2291',bill:'https://billing.corvin.example/subscription',docs:'https://docs.corvin.example/guides/change-seats',
  signin:'https://portal.northgate.example/sign-in',checkout:'https://portal.northgate.example/checkout',inv:'https://staging.larkfield.example/invoices',hist:'claude://history',dl:'claude://downloads'};
const SITES={
  'claude':{name:'Claude',letter:'C',tone:'accent'},
  'crm.larkfield.example':{name:'Larkfield CRM',letter:'L',tone:'info',login:'Larkfield single sign-on'},
  'billing.corvin.example':{name:'Corvin Analytics',letter:'C',tone:'ok',login:'billing@larkfield.example'},
  'docs.corvin.example':{name:'Corvin Docs',letter:'C',tone:'ok',login:'billing@larkfield.example'},
  'portal.northgate.example':{name:'Northgate Supply',letter:'N',tone:'warn',login:'purchasing@larkfield.example'},
  'staging.larkfield.example':{name:'Larkfield staging',letter:'S',tone:'bad',login:'Larkfield single sign-on'}
};
const VAULT_LOGIN='purchasing@larkfield.example';
const hostOf=u=>u.indexOf('claude://')===0?'claude':u.replace(/^https?:\/\//,'').split(/[/?]/)[0];
const site=u=>SITES[hostOf(u)]||{name:hostOf(u),letter:(hostOf(u)[0]||'?').toUpperCase(),tone:'ink'};
const shortUrl=u=>u.replace(/^https:\/\//,'');
const qOf=u=>{try{return decodeURIComponent(u.split('?q=')[1]||'')}catch(e){return ''}};
const pad=n=>(n<10?'0':'')+n;
const clock=d=>pad(d.getHours())+':'+pad(d.getMinutes());
const nowT=()=>clock(new Date());
const ago=min=>clock(new Date(Date.now()-min*60000));
const today=()=>new Date().toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'});
const apr=()=>D.approvals.find(a=>a.id==='ap-discount')||{status:'approved'};

const PAGES={};
PAGES[HOME]={title:'New tab',icon:'plus',desc:'Search, shortcuts and what your bots are doing.',render:pNew};
PAGES[U.crm]={title:'Halden Dental · Deal HD-2291',tab:'Halden Dental deal',desc:'Deal record in the Larkfield CRM: fields, activity and contract versions.',render:pCrm};
PAGES[U.bill]={title:'Billing · Corvin Analytics',tab:'Corvin billing',desc:'Subscription seats, renewal amount and past invoices for Corvin Analytics.',render:pBill};
PAGES[U.docs]={title:'Change seats mid-term · Corvin Docs',tab:'Change seats mid-term',desc:'Guide: how seat changes and renewal pricing work on Corvin Analytics.',render:pDocs};
PAGES[U.signin]={title:'Sign in · Northgate Supply',tab:'Northgate sign in',desc:'Customer portal sign-in for Northgate Supply.',render:pSignin};
PAGES[U.checkout]={title:'Checkout · Northgate Supply',tab:'Northgate checkout',desc:'Order NS-48213: three items, $1,280.00.',render:pCheckout};
PAGES[U.inv]={title:'Invoices · Larkfield staging',tab:'Invoices (staging)',desc:'Staging build of the Larkfield invoices screen with CSV export.',render:pInv};
PAGES[U.hist]={title:'History',icon:'clock',desc:'Pages you and your bots have visited.',render:pHist};
PAGES[U.dl]={title:'Downloads',icon:'download',desc:'Files saved by you and your bots.',render:pDl};
function pageFor(u){
  if(PAGES[u])return PAGES[u];
  if(u.indexOf('claude://search')===0)return {title:(qOf(u)||'Search')+' · Search',tab:qOf(u)||'Search',icon:'search',render:pSearch};
  return {title:'Page not found',icon:'alert',render:pMissing};
}
function glyph(u,big){const s=site(u),p=pageFor(u);return `<span class="br-glyph br-tone-${s.tone}${big?' big':''}">${p.icon?I(p.icon,big?15:11):E(s.letter)}</span>`}

/* ---------- state (module scope, survives leaving the mode) ---------- */
let seq=0,el=null,timer=null,activeId,showBm=true,panelOpen=false,pop=null,sheet=null,askDraft='';
const dd={open:false,idx:-1,items:[],touched:false};
const mk=(owner,u,o)=>Object.assign({id:'t'+(++seq),owner,home:u,hist:[u],hi:0,pinned:false,group:null,scroll:0,chat:[],mode:'drive',step:0,times:[],t0:ago(14)},o||{});
const groups=[{id:'g1',name:'Halden renewal',tone:'info',collapsed:false}];
const TONES=['info','ok','warn','bad','accent'];
const tabs=[mk('me',HOME),mk('me',U.crm,{group:'g1'}),mk('me',U.docs,{group:'g1'}),mk('me',U.signin),
  mk('procurement-bot',U.bill,{t0:ago(2)}),mk('revops-bot',U.crm,{step:2,times:[ago(25),ago(24)],t0:ago(26)}),mk('qa-bot',U.inv,{t0:ago(1)})];
activeId=tabs[0].id;
const st={seats:60,corvinPaid:null,receiptSent:false,signedIn:false,vault:'ask',orderPaid:null,invQ:'',invStatus:'All',histQ:'',budget:{sw:18400,ops:3150},payN:0};
const perms={};
const bookmarks=[{title:'Halden Dental deal',url:U.crm},{title:'Corvin billing',url:U.bill},
  {folder:'Vendors',items:[{title:'Corvin Analytics billing',url:U.bill},{title:'Corvin Docs: change seats',url:U.docs},{title:'Northgate Supply portal',url:U.signin}]},
  {folder:'Larkfield',items:[{title:'CRM: Halden Dental',url:U.crm},{title:'Staging: invoices',url:U.inv}]},
  {folder:'Reading list',items:[]}];
const history=[{url:U.bill,who:'Procurement bot',time:ago(2)},{url:U.inv,who:'QA bot',time:ago(1)},{url:U.crm,who:'You',time:ago(12)},{url:U.docs,who:'You',time:ago(20)},
  {url:U.crm,who:'RevOps bot',time:ago(26)},{url:U.bill,who:'You',time:ago(34)},{url:U.signin,who:'You',time:ago(41)}];
let dlSeq=0;
const downloads=[{id:'d'+(++dlSeq),name:'Q3-pipeline-export.csv',size:'48.2 MB',from:'crm.larkfield.example',by:'You',p:.38,rate:.03,time:nowT()},
  {id:'d'+(++dlSeq),name:'Halden-Dental-contract-v2.pdf',size:'184 KB',from:'crm.larkfield.example',by:'You',p:1,rate:0,time:ago(52)}];

const isBot=t=>t.owner!=='me';
const driven=t=>isBot(t)&&t.mode!=='taken';
const url=t=>t.hist[t.hi];
const cur=()=>tabs.find(t=>t.id===activeId)||tabs[0];
const $=id=>el&&el.querySelector('#'+id);
const whoOf=t=>isBot(t)?CW.bot(t.owner).name:'You';
const ident=t=>isBot(t)?{name:CW.bot(t.owner).name,email:t.owner+'@larkfield.example',bot:true}:{name:D.me.name,email:D.me.email,initials:D.me.initials};
const flatBm=()=>bookmarks.reduce((a,b)=>a.concat(b.folder?b.items:[b]),[]);
const isBm=u=>flatBm().some(b=>b.url===u);
function addDl(o){downloads.unshift(Object.assign({id:'d'+(++dlSeq),p:1,rate:0,time:nowT()},o));updBadge()}

/* ---------- bot step trails ---------- */
const TRAILS={
  'procurement-bot':[
    {doing:'Checking seat usage for the last 90 days',done:'Checked usage: 45 of 60 seats in use',t:'usage'},
    {doing:'Reducing seats from 60 to 45',done:'Reduced seats to 45',t:'seats',fx(){if(!st.corvinPaid)st.seats=45}},
    {doing:'Paying with Claude Pay',done:'Paid with Claude Pay',t:'pay',fx(){payCorvin('Procurement bot')}},
    {doing:'Sending the receipt to Marcus Bell',done:'Sent the receipt to Marcus Bell',t:'receipt',fx(){st.receiptSent=true}}],
  'revops-bot':[
    {doing:'Opening deal HD-2291',done:'Opened deal HD-2291',t:'fields'},
    {doing:'Comparing the signed quote with contract v2',done:'Compared the signed quote with contract v2',t:'contracts'},
    {doing:'Waiting for approval of the 12% discount',done:'Discount approved by '+D.me.name,t:'tier',gate:()=>apr().status!=='pending'},
    {doing:'Regenerating the contract as v3',done:'Regenerated the contract as v3',t:'contracts'}],
  'qa-bot':[
    {doing:'Loading the Invoices page on staging',done:'Invoices page loaded in 0.8 seconds',t:'table'},
    {doing:'Checking that all 8 invoices show a total',done:'All 8 invoices show a total',t:'total'},
    {doing:'Clicking Export CSV',done:'Exported the invoices to CSV',t:'export',fx(){exportCsv('QA bot')}},
    {doing:'Comparing the file with the table',done:'File matches the table, 8 of 8 rows',t:'table'}]
};
const FIN={'procurement-bot':'Finished. Renewal paid and receipt sent.','revops-bot':'Finished. Contract v3 is attached to the deal.','qa-bot':'Finished. The export matches the table.'};
function trailOf(t){
  const steps=TRAILS[t.owner]||[],b=CW.bot(t.owner),stop=t.owner==='revops-bot'&&apr().status==='declined';
  const items=[{text:'Signed in with Claude Auth as '+b.name,time:t.t0,state:'done'}];
  steps.forEach((s,i)=>{
    if(i<t.step)items.push({text:s.done,time:t.times[i]||'',state:'done'});
    else if(stop)return;
    else if(i===t.step)items.push({text:s.doing,state:s.gate&&!s.gate()?'wait':'now'});
    else items.push({text:s.doing,state:'next'});
  });
  if(stop)items.push({text:'Stopped. The discount was declined.',state:'stop'});
  const fin=stop||t.step>=steps.length,c=steps[t.step];
  return {items,fin,stop,gated:!fin&&!!c.gate&&!c.gate(),now:stop?'Stopped. The discount was declined.':fin?(FIN[t.owner]||'Idle.'):c.doing,
    n:Math.min(t.step+1,steps.length),total:steps.length,target:!fin&&url(t)===t.home?c.t:null};
}
function advance(t){
  const steps=TRAILS[t.owner],tr=trailOf(t);
  if(!steps||tr.fin||tr.gated||url(t)!==t.home)return;
  const s=steps[t.step];if(s.fx)s.fx(t);
  t.times[t.step]=nowT();t.step++;
  drawSess();drawPage();drawPanelBody();
}
function payCorvin(by){
  if(st.corvinPaid)return st.corvinPaid;
  const amt=st.seats*90,ref='CP-'+(20417+st.payN++);
  st.corvinPaid={ref,amt,by,time:nowT(),seats:st.seats};st.budget.sw-=amt;
  addDl({name:'Corvin-Analytics-receipt-'+ref+'.pdf',size:'86 KB',from:'Claude Pay',by});
  return st.corvinPaid;
}
function payNorthgate(by){
  if(st.orderPaid)return st.orderPaid;
  const ref='CP-'+(20417+st.payN++);
  st.orderPaid={ref,amt:1280,by,time:nowT()};st.budget.ops-=1280;
  addDl({name:'Northgate-Supply-receipt-'+ref+'.pdf',size:'74 KB',from:'Claude Pay',by});
  return st.orderPaid;
}
function exportCsv(by){addDl({name:'invoices-'+new Date().toISOString().slice(0,10)+'.csv',size:'2 KB',from:'staging.larkfield.example',by,p:0,rate:.5})}
function tick(){
  if(CW.mode!=='browser'||!el||!el.isConnected)return;
  let moved=false;
  downloads.forEach(d=>{if(d.p<1){d.p=Math.min(1,d.p+d.rate);moved=true}});
  if(moved){updBadge();if(pop==='dl')drawPop();if(url(cur())===U.dl)drawPage()}
  const t=cur();if(isBot(t)&&t.mode==='drive'&&!sheet)advance(t);
}

/* ---------- navigation ---------- */
function loadBar(){const b=$('br-load');if(!b)return;b.classList.remove('on');void b.offsetWidth;b.classList.add('on');setTimeout(()=>{if(b.isConnected)b.classList.remove('on')},650)}
function nav(t,u){
  if(u!==url(t)){t.hist=t.hist.slice(0,t.hi+1);t.hist.push(u);t.hi++;t.scroll=0;
    if(u!==HOME)history.unshift({url:u,who:whoOf(t),time:nowT()})}
  closeFloating();drawAll();loadBar();
}
function resolve(text){
  const q=text.trim();if(!q)return null;
  const n=q.toLowerCase().replace(/^https?:\/\//,'').replace(/\/$/,''),all=Object.keys(PAGES);
  if(n.indexOf('claude://search')===0)return q;
  return all.find(u=>u.toLowerCase()===q.toLowerCase())||all.find(u=>shortUrl(u).toLowerCase()===n)||all.find(u=>hostOf(u)===n&&n!=='claude')
    ||(n==='newtab'||n==='claude://newtab'?HOME:null)||'claude://search?q='+encodeURIComponent(q);
}
function activate(id){const t=tabs.find(x=>x.id===id);if(!t)return;activeId=id;const g=groups.find(x=>x.id===t.group);if(g)g.collapsed=false;closeFloating();drawAll()}
function newTab(u,owner){const t=mk(owner||'me',u||HOME);tabs.push(t);activeId=t.id;closeFloating();drawAll();if(!u){const i=$('br-nt-q');if(i)i.focus()}return t}
function ordered(){
  for(let i=groups.length-1;i>=0;i--)if(!tabs.some(t=>t.group===groups[i].id))groups.splice(i,1);
  const mine=tabs.filter(t=>!isBot(t)),out=[],seen={};
  mine.filter(t=>t.pinned).forEach(t=>out.push({t}));
  mine.filter(t=>!t.pinned).forEach(t=>{const g=t.group&&groups.find(x=>x.id===t.group);
    if(!g){out.push({t});return}
    if(seen[g.id])return;seen[g.id]=1;
    const ms=mine.filter(x=>!x.pinned&&x.group===g.id);out.push({g,n:ms.length});if(!g.collapsed)ms.forEach(x=>out.push({t:x}))});
  return out;
}
const visible=()=>ordered().filter(o=>o.t).map(o=>o.t).concat(tabs.filter(isBot));
function closeTab(id,quiet){
  const t=tabs.find(x=>x.id===id);if(!t)return;
  const vis=visible(),k=vis.indexOf(t);tabs.splice(tabs.indexOf(t),1);
  if(isBot(t)&&!quiet)CW.toast(CW.bot(t.owner).name+"'s tab is closed. The bot has stopped browsing.");
  if(!tabs.length)tabs.push(mk('me',HOME));
  if(activeId===id){const nx=vis[k+1]||vis[k-1];activeId=nx&&tabs.indexOf(nx)>=0?nx.id:tabs[0].id}
  if(!visible().some(x=>x.id===activeId)){const v=visible()[0];if(v)activeId=v.id;else groups.forEach(g=>{g.collapsed=false})}
  closeFloating();drawAll();
}
function closeFloating(){pop=null;sheet=null;dd.open=false;const p=$('br-pop');if(p)p.remove();const s=$('br-sheet');if(s)s.innerHTML=''}

/* ---------- chrome: tabs, toolbar, bookmarks, session bar ---------- */
function tabHtml(t){
  const u=url(t),p=pageFor(u),b=isBot(t)?CW.bot(t.owner):null,g=t.group&&groups.find(x=>x.id===t.group),on=t.id===activeId,label=(b?b.name+': ':'')+p.title;
  return `<div class="br-tab${on?' on':''}${t.pinned?' pin':''}${g?' grouped br-tone-'+g.tone:''}${b?' bot':''}" data-tab="${t.id}" title="${E(label)}">
    <button class="br-tab-main" data-a="tab" data-id="${t.id}" aria-label="${E(label+(t.pinned?', pinned':''))}" ${on?'aria-current="page"':''}>${glyph(u)}${b?`<span class="br-tab-mark">${I('bot',9)}</span>`:''}${t.pinned?'':`<span class="br-tab-t truncate">${b?`<span class="br-tab-bn">${E(b.name)}</span> · `:''}${E(p.tab||p.title)}</span>`}</button>
    ${t.pinned?'':`<button class="br-tab-b" data-a="tab-menu" data-id="${t.id}" aria-label="Tab options">${I('more',13)}</button><button class="br-tab-b" data-a="tab-x" data-id="${t.id}" aria-label="Close tab">${I('x',12)}</button>`}</div>`;
}
function drawTabs(){
  const bots=tabs.filter(isBot);
  $('br-strip').innerHTML=`<div class="br-zone"><span class="br-zl">${I('user',12)}Your tabs</span>${ordered().map(o=>o.g
      ?`<button class="br-group br-tone-${o.g.tone}" data-a="group" data-id="${o.g.id}" aria-expanded="${!o.g.collapsed}" title="${o.g.collapsed?'Expand':'Collapse'} group">${E(o.g.name)}${o.g.collapsed?` · ${o.n}`:''}${I(o.g.collapsed?'chevron-right':'chevron-down',11)}</button>`
      :tabHtml(o.t)).join('')}<button class="icon-btn sm br-new" data-a="new" aria-label="New tab" title="New tab">${I('plus',15)}</button></div>
    ${bots.length?`<div class="br-zone bots"><span class="br-zl">${I('bot',12)}Bot tabs</span>${bots.map(tabHtml).join('')}</div>`:''}`;
}
function drawBar(){
  const t=cur(),u=url(t),internal=hostOf(u)==='claude',b=isBot(t)?CW.bot(t.owner):null,act=downloads.filter(d=>d.p<1).length;
  $('br-bar').innerHTML=`<button class="icon-btn" data-a="back" aria-label="Back" title="Back" ${t.hi>0?'':'disabled'}>${I('arrow-left',17)}</button>
    <button class="icon-btn" data-a="fwd" aria-label="Forward" title="Forward" ${t.hi<t.hist.length-1?'':'disabled'}>${I('arrow-right',17)}</button>
    <button class="icon-btn" data-a="reload" aria-label="Reload" title="Reload">${I('refresh',16)}</button>
    <div class="br-addr"><button class="icon-btn sm" data-a="pop" data-pop="site" aria-label="Site information" title="Site information">${I(internal?'info':'lock',14)}</button>
      <input id="br-url" value="${E(u===HOME?'':shortUrl(u))}" placeholder="Search, enter an address or ask Claude" spellcheck="false" autocomplete="off" aria-label="Address and search" role="combobox" aria-expanded="false" aria-controls="br-dd">
      ${b?`<span class="pill accent" title="This tab is signed in as ${E(b.name)}">${I('bot',12)}${E(b.name)}</span>`:''}
      <button class="icon-btn sm br-star" data-a="star" aria-pressed="${isBm(u)}" aria-label="${isBm(u)?'Remove bookmark':'Bookmark this page'}" title="${isBm(u)?'Remove bookmark':'Bookmark this page'}">${I('star',15)}</button>
      <div class="br-dd" id="br-dd" hidden></div></div>
    <button class="icon-btn br-tog" data-a="pop" data-pop="dl" aria-label="Downloads" title="Downloads" aria-pressed="${pop==='dl'}">${I('download',16)}<span class="badge" id="br-dl-n" ${act?'':'hidden'}>${act}</span></button>
    <button class="icon-btn br-tog" data-a="panel" aria-label="Claude side panel" title="Claude side panel" aria-pressed="${panelOpen}">${I('panel',16)}</button>
    <button class="br-profbtn" data-a="profile" aria-label="Switch profile. Current: ${E(b?b.name:'You')}" title="Profile: ${E(b?b.name:'You')}">${b?`<span class="avatar bot">${I('bot',13)}</span>`:`<span class="avatar">${E(D.me.initials)}</span>`}${I('chevron-down',12)}</button>
    <button class="icon-btn" data-a="more" aria-label="Browser menu" title="Browser menu">${I('more',17)}</button>`;
}
function updBadge(){const n=$('br-dl-n');if(!n)return;const a=downloads.filter(d=>d.p<1).length;n.textContent=a;n.hidden=!a}
function drawBm(){
  const box=$('br-bm');box.hidden=!showBm;box.className='br-bm';if(!showBm)return;
  box.innerHTML=bookmarks.length?bookmarks.map((b,i)=>b.folder
      ?`<button class="br-bm-item" data-a="bm-folder" data-i="${i}" aria-haspopup="menu">${I('folder',14)}<span class="truncate">${E(b.folder)}</span></button>`
      :`<button class="br-bm-item" data-a="go" data-u="${E(b.url)}" title="${E(shortUrl(b.url))}">${glyph(b.url)}<span class="truncate">${E(b.title)}</span></button>`).join('')
      +`<span class="br-bm-sep"></span><button class="br-bm-item" data-a="go" data-u="${U.hist}">${I('clock',14)}History</button>`
    :`<span class="t-xs t-mute" style="padding:3px 8px">Bookmarks you add with the star appear here.</span>`;
}
function drawSess(){
  const box=$('br-sess'),t=cur();
  if(!isBot(t)){box.hidden=true;box.innerHTML='';return}
  const b=CW.bot(t.owner),tr=trailOf(t),taken=t.mode==='taken',paused=t.mode==='paused';
  box.hidden=false;box.className='br-sess'+(taken?' taken':'');
  const dot=taken?'':tr.stop?'bad':tr.fin?'ok':tr.gated||paused?'wait':'run';
  const stepTxt=taken?`${E(b.name)} is waiting and will pick up from step ${tr.n} of ${tr.total} when you hand back.`
    :`${paused?'Paused at: ':''}${E(tr.now)}${tr.fin?'':` · step ${tr.n} of ${tr.total}`}`;
  box.innerHTML=`<span class="avatar bot">${I(taken?'user':'bot',15)}</span>
    <div class="col grow" style="gap:0"><div class="truncate">${taken?`<b style="font-weight:600">You have taken over.</b> Still signed in as ${E(b.name)} with Claude Auth`:`<b style="font-weight:600">${E(b.name)}</b> is browsing as itself · signed in with Claude Auth`}</div>
      <div class="t-xs br-sess-step" aria-live="polite">${dot?`<span class="dot ${dot}"></span>`:''}<span class="truncate">${stepTxt}</span></div></div>
    ${tr.gated&&!taken?`<button class="btn btn-sm" data-a="review" data-id="ap-discount">Review approval</button>`:''}
    ${taken?`<button class="btn btn-primary btn-sm" data-a="sess-back">${I('reply',13)}Hand back</button>`
      :`${tr.fin?'':`<button class="btn btn-sm" data-a="sess-pause">${I(paused?'play':'pause',13)}${paused?'Resume':'Pause'}</button>`}<button class="btn btn-primary btn-sm" data-a="sess-take">Take over</button>`}`;
}

/* ---------- page area ---------- */
function drawPage(){
  const t=cur(),v=$('br-view'),doc=$('br-doc'),d=driven(t);
  doc.innerHTML=pageFor(url(t)).render(t);
  doc.inert=d;doc.toggleAttribute('inert',d);
  $('br-frame').hidden=!(d&&t.mode==='drive'&&!trailOf(t).fin);
  v.scrollTop=t.scroll;
  placeCursor();
}
function placeCursor(){
  const t=cur(),c=$('br-cursor'),v=$('br-view'),tr=isBot(t)?trailOf(t):null;
  const target=tr&&driven(t)&&tr.target?$('br-doc').querySelector('[data-bt="'+tr.target+'"]'):null;
  if(!target){c.hidden=true;return}
  target.classList.add('br-hl');
  let r=target.getBoundingClientRect(),vr=v.getBoundingClientRect();
  if(r.bottom>vr.bottom-24||r.top<vr.top+8){v.scrollTop+=r.top-vr.top-Math.max(40,(vr.height-r.height)/2);t.scroll=v.scrollTop;r=target.getBoundingClientRect()}
  const x=r.left-vr.left+v.scrollLeft+Math.min(r.width-10,Math.max(12,r.width*.5)),y=r.top-vr.top+v.scrollTop+r.height*.55;
  c.hidden=false;c.classList.toggle('still',t.mode!=='drive'||tr.gated);
  c.querySelector('b').textContent=CW.bot(t.owner).name;
  c.style.transform='translate('+Math.round(x)+'px,'+Math.round(y)+'px)';
}
function head(u,nav,on,right){
  const s=site(u);
  return `<header class="br-sh br-tone-${s.tone}"><div class="br-brand">${glyph(u,1)}<b style="font-weight:600">${E(s.name)}</b></div>
    <nav class="br-snav" aria-label="${E(s.name)}">${nav.map(n=>n===on?`<span aria-current="page">${E(n)}</span>`:`<button data-a="stub" data-what="${E(s.name+': '+n)}">${E(n)}</button>`).join('')}</nav><div class="grow"></div>${right||''}</header>`;
}
function whoChip(t){const id=ident(t);return `<div class="br-who">${id.bot?`<span class="avatar bot">${I('bot',13)}</span>`:`<span class="avatar">${E(id.initials)}</span>`}<span>${E(id.name)}</span></div>`}

function pNew(){
  const bots=tabs.filter(isBot),sc=[U.crm,U.bill,U.docs,U.signin,U.inv,U.hist];
  const pill=a=>a.status==='pending'?'<span class="pill warn">Waiting for you</span>':a.status==='approved'?'<span class="pill ok">Approved</span>':'<span class="pill bad">Declined</span>';
  return `<div class="br-nt"><h1 class="t-title">Where to, ${E(D.me.first)}?</h1>
    <div class="search br-nt-search">${I('search',17)}<input id="br-nt-q" placeholder="Search, enter an address or ask Claude" aria-label="Search or enter an address" autocomplete="off"><span class="kbd">↵</span></div>
    <div class="br-nt-grid">${sc.map(u=>`<button class="br-short" data-a="go" data-u="${u}">${glyph(u,1)}<b class="truncate">${E(pageFor(u).tab||pageFor(u).title)}</b><span class="h truncate">${E(hostOf(u)==='claude'?'Built in':hostOf(u))}</span></button>`).join('')}</div>
    <div class="grid-2"><section class="card flush"><div class="card-head"><span class="t-h">Bots browsing now</span><span class="t-xs t-mute">${bots.length} ${bots.length===1?'tab':'tabs'}</span></div>
      ${bots.length?bots.map(t=>{const b=CW.bot(t.owner),tr=trailOf(t);
        return `<button class="list-row" data-a="tab" data-id="${t.id}" aria-label="Go to ${E(b.name)}'s tab"><span class="avatar bot">${I('bot',15)}</span><span class="col grow" style="gap:0"><span class="truncate"><b style="font-weight:500">${E(b.name)}</b> <span class="t-mute">on ${E(site(url(t)).name)}</span></span><span class="t-xs t-mute truncate">${E(t.mode==='taken'?'You have taken over this tab':t.mode==='paused'?'Paused: '+tr.now:tr.now)}</span></span>
        <span class="dot ${tr.stop?'bad':tr.fin?'ok':tr.gated||t.mode!=='drive'?'wait':'run'}"></span>${I('chevron-right',14)}</button>`}).join('')
      :`<div class="empty">${I('bot',22)}<div>No bots are browsing right now.</div><div class="t-xs">When a bot opens a site, its tab appears here.</div></div>`}</section>
    <section class="card flush"><div class="card-head"><span class="t-h">Recent approvals</span><button class="btn btn-ghost btn-sm" data-a="bell">Open approvals</button></div>
      ${D.approvals.length?D.approvals.map(a=>{const b=CW.bot(a.bot);return `<div class="list-row"><span class="col grow" style="gap:0"><span class="truncate" style="font-weight:500">${E(a.title)}</span><span class="t-xs t-mute truncate">${E(b?b.name:'Bot')} · ${E(a.reason)}</span></span>${pill(a)}${a.status==='pending'?`<button class="btn btn-sm" data-a="review" data-id="${a.id}">Review</button>`:''}</div>`}).join('')
      :`<div class="empty">${I('check',22)}<div>No approvals yet.</div></div>`}</section></div></div>`;
}
function pCrm(t){
  const fixed=apr().status==='approved',who=whoChip(t);
  const acts=[['RB','RevOps bot','flagged that contract v2 uses the Starter price, but the signed quote is for Growth.',ago(24)],['PN','Priya Nair','asked for the contract tier to be fixed.',ago(27)],
    ['PN','Priya Nair','sent contract v2 to Halden Dental for signature.','Yesterday'],['HD','Dr. Ines Halden','accepted the quote: Growth tier, 45 seats.','12 Nov'],['PN','Priya Nair','created the deal from a demo request.','4 Nov']];
  if(fixed)acts.unshift(['RB','RevOps bot','regenerated the contract as v3 with the Growth tier and the approved 12% discount.',nowT()],['AR',D.me.name,'approved a 12% discount.',nowT()]);
  const vers=[['v1','Draft from quote','Growth','4 Nov','Superseded'],['v2','Sent for signature','Starter','16 Nov',fixed?'Superseded':'Tier mismatch']];
  if(fixed)vers.push(['v3','Corrected','Growth, 12% discount',today().slice(0,6),'Current']);
  return head(U.crm,['Home','Deals','Accounts','Reports'],'Deals',who)+`<div class="br-fill"><div class="br-body">
    <div class="br-crumb"><span>Deals</span>${I('chevron-right',12)}<span>Halden Dental</span>${I('chevron-right',12)}<span>HD-2291</span></div>
    <div class="row between wrap"><div><h1 class="t-title">Halden Dental, 45 seats</h1><div class="t-sm t-mute">Deal HD-2291 · owned by Priya Nair · created 4 Nov 2026</div></div>
      <div class="row"><button class="btn" data-a="stub" data-what="Editing the deal">${I('edit',14)}Edit</button><button class="btn" data-a="stub" data-what="Logging an activity">${I('plus',14)}Log activity</button></div></div>
    <div class="br-stages" aria-label="Deal stage"><span class="past">Qualified</span><span class="past">Proposal</span><span class="cur">Contract sent</span><span>Closed won</span></div>
    ${fixed?`<div class="br-banner ok">${I('check',15)}<span>Contract v3 matches the signed quote: Growth tier with the approved 12% discount.</span></div>`
      :`<div class="br-banner">${I('alert',15)}<span>Contract v2 was generated at the Starter price. The signed quote is for the Growth tier.</span></div>`}
    <div class="br-cols"><div class="col" style="gap:16px">
      <section class="card" data-bt="fields"><div class="t-h" style="margin-bottom:12px">Deal details</div><dl class="br-fields" style="margin:0">
        <div><dt>Account</dt><dd>Halden Dental</dd></div><div><dt>Contact</dt><dd>Dr. Ines Halden</dd></div><div><dt>Amount (annual)</dt><dd class="t-mono">$22,809.60</dd></div>
        <div data-bt="tier"><dt>Pricing tier</dt><dd>${fixed?'Growth <span class="pill ok">Matches quote</span>':'Starter <span class="pill warn">Quote says Growth</span>'}</dd></div>
        <div><dt>Seats</dt><dd class="t-mono">45</dd></div><div><dt>Discount</dt><dd>${fixed?'12% <span class="pill ok">Approved</span>':apr().status==='declined'?'None <span class="pill bad">12% declined</span>':'None <span class="pill warn">12% requested</span>'}</dd></div>
        <div><dt>Close date</dt><dd>28 Nov 2026</dd></div><div><dt>Next step</dt><dd>${fixed?'Send contract v3 for signature':'Correct the contract tier'}</dd></div></dl></section>
      <section class="card flush" data-bt="contracts"><div class="card-head"><span class="t-h">Contract versions</span><span class="t-xs t-mute">${vers.length} versions</span></div><div class="table-wrap"><table class="tbl"><thead><tr><th>Version</th><th>Note</th><th>Tier</th><th>Date</th><th>Status</th><th></th></tr></thead><tbody>
        ${vers.slice().reverse().map(v=>`<tr><td><b style="font-weight:500">${v[0]}</b></td><td>${v[1]}</td><td>${v[2]}</td><td>${v[3]}</td><td><span class="pill ${v[4]==='Current'?'ok':v[4]==='Tier mismatch'?'warn':''}">${v[4]}</span></td><td style="text-align:right"><button class="btn btn-ghost btn-sm" data-a="dl-file" data-name="Halden-Dental-contract-${v[0]}.pdf" data-size="184 KB">${I('download',13)}PDF</button></td></tr>`).join('')}</tbody></table></div></section></div>
      <section class="card flush"><div class="card-head"><span class="t-h">Activity</span></div>${acts.map(a=>`<div class="br-act"><span class="avatar${a[0]==='RB'?' bot':''}" style="width:26px;height:26px;font-size:10px">${a[0]==='RB'?I('bot',13):a[0]}</span><span><b style="font-weight:500">${E(a[1])}</b> ${E(a[2])}</span><span class="t-xs t-mute">${a[3]}</span></div>`).join('')}</section></div></div></div>`;
}
function pBill(t){
  const paid=st.corvinPaid,seats=paid?paid.seats:st.seats,amt=seats*90,botPaying=isBot(t)&&t.owner==='procurement-bot'&&t.mode==='drive'&&t.step===2&&!paid;
  return head(U.bill,['Overview','Usage','Billing','Team'],'Billing',whoChip(t))+`<div class="br-body">
    <div class="row between wrap"><div><h1 class="t-title">Billing</h1><div class="t-sm t-mute">Larkfield workspace · Team plan, billed annually</div></div>${paid?'<span class="pill ok">Renewed for 12 months</span>':'<span class="pill warn">Renews 1 Dec 2026</span>'}</div>
    ${paid?`<div class="br-banner ok" data-bt="receipt">${I('check',15)}<span class="grow">Renewal paid. ${M(paid.amt)} with Claude Pay at ${paid.time}, reference ${paid.ref}.${st.receiptSent?' Receipt sent to Marcus Bell.':''}</span><button class="btn btn-sm" data-a="go" data-u="${U.dl}">View receipt</button></div>`:''}
    <div class="br-cols"><div class="col" style="gap:16px">
      <section class="card col" style="gap:14px"><div class="row between"><span class="t-h">Subscription seats</span><span class="t-xs t-mute">$90.00 a seat each year</span></div>
        <div class="row wrap" style="gap:16px"><div class="br-stepper" data-bt="seats" role="group" aria-label="Seats"><button data-a="seat" data-d="-1" aria-label="Remove a seat" ${paid?'disabled':''}>−</button><output aria-live="polite">${seats}</output><button data-a="seat" data-d="1" aria-label="Add a seat" ${paid?'disabled':''}>+</button></div>
          <span class="t-sm t-mute">${seats===60?'Current term: 60 seats.':`Changed from 60 to ${seats} seats for the next term.`}</span>${!paid&&seats!==45?`<button class="btn btn-ghost btn-sm" data-a="seat" data-set="45">Match usage (45)</button>`:''}</div>
        <div class="col" style="gap:6px" data-bt="usage"><div class="row between t-sm"><span>Seats in use, last 90 days</span><span class="t-mono">45 of 60</span></div><div class="br-meter"><i style="width:75%"></i></div><div class="t-xs t-mute">15 seats have not signed in since August.</div></div></section>
      <section class="card flush"><div class="card-head"><span class="t-h">Invoices</span></div><div class="table-wrap"><table class="tbl"><thead><tr><th>Invoice</th><th>Period</th><th>Seats</th><th class="num">Amount</th><th>Status</th><th></th></tr></thead><tbody>
        ${paid?`<tr><td>CA-2026-1187</td><td>Dec 2026 to Nov 2027</td><td>${paid.seats}</td><td class="num">${M(paid.amt)}</td><td><span class="pill ok">Paid</span></td><td style="text-align:right"><button class="btn btn-ghost btn-sm" data-a="dl-file" data-name="Corvin-invoice-CA-2026-1187.pdf" data-size="92 KB">${I('download',13)}PDF</button></td></tr>`:''}
        <tr><td>CA-2025-0932</td><td>Dec 2025 to Nov 2026</td><td>60</td><td class="num">$5,400.00</td><td><span class="pill ok">Paid</span></td><td style="text-align:right"><button class="btn btn-ghost btn-sm" data-a="dl-file" data-name="Corvin-invoice-CA-2025-0932.pdf" data-size="90 KB">${I('download',13)}PDF</button></td></tr>
        <tr><td>CA-2024-0611</td><td>Dec 2024 to Nov 2025</td><td>40</td><td class="num">$3,600.00</td><td><span class="pill ok">Paid</span></td><td style="text-align:right"><button class="btn btn-ghost btn-sm" data-a="dl-file" data-name="Corvin-invoice-CA-2024-0611.pdf" data-size="88 KB">${I('download',13)}PDF</button></td></tr></tbody></table></div></section></div>
      <section class="card col" style="gap:4px"><div class="t-h" style="margin-bottom:6px">Renewal summary</div>
        <div class="br-sum"><span>Team plan, ${seats} seats</span><span class="t-mono">${M(amt)}</span></div><div class="br-sum t-mute"><span>Term</span><span>1 Dec 2026 to 30 Nov 2027</span></div><div class="br-sum t-mute"><span>Tax</span><span class="t-mono">$0.00</span></div>
        <div class="br-sum total"><span>${paid?'Paid':'Due on renewal'}</span><span class="t-mono">${M(amt)}</span></div>
        ${botPaying?`<div class="br-payline">${I('wallet',16)}<span><b style="font-weight:600">Claude Pay</b> · ${M(amt)} from Finance · Software subscriptions.<br>Under the $5,000 renewal limit, no approval needed.</span></div>`:''}
        ${paid?`<button class="btn" style="margin-top:8px" data-a="go" data-u="${U.dl}">${I('file',14)}Receipt in Downloads</button>`:`<button class="btn btn-accent" style="margin-top:8px;padding:9px 12px" data-a="pay" data-k="corvin" data-bt="pay">Pay ${M(amt)}</button>`}
        <div class="t-xs t-mute" style="margin-top:6px">Last year: $5,400.00 for 60 seats. <button class="br-link" data-a="go" data-u="${U.docs}">How seat changes work</button></div></section></div></div>`;
}
function pDocs(){
  const toc=[['d-top','Change seats mid-term'],['d-before','Before you start'],['d-reduce','Reduce seats'],['d-price','How the renewal price is calculated'],['d-credit','Refunds and credits']];
  return head(U.docs,['Guides','API reference','Changelog'],'Guides',`<div class="search" style="width:220px;padding:4px 10px">${I('search',14)}<input id="br-docs-q" placeholder="Search the docs" aria-label="Search the docs"></div>`)+`<div class="br-docs">
    <nav class="br-toc" aria-label="On this page"><div class="side-label">On this page</div>${toc.map(x=>`<button class="nav-item t-sm" data-a="toc" data-id="${x[0]}"><span class="truncate">${x[1]}</span></button>`).join('')}
      <div class="side-label" style="margin-top:12px">Related</div><button class="nav-item t-sm" data-a="go" data-u="${U.bill}"><span class="truncate">Open billing</span></button></nav>
    <article class="br-art"><div class="br-crumb" style="font-family:var(--sans)"><span>Guides</span>${I('chevron-right',12)}<span>Billing</span></div>
      <h1 class="t-display" id="d-top" style="font-size:34px">Change seats mid-term</h1>
      <p class="t-2">Seats on a Corvin Analytics annual plan can be added at any time and reduced at renewal. This guide explains what changes when, and what you pay.</p>
      <div class="br-banner info">${I('info',15)}<span>Only workspace billing admins can change seats. Updated 3 November 2026.</span></div>
      <h2 id="d-before">Before you start</h2>
      <p>Open <b>Usage</b> and check how many seats signed in during the last 90 days. A seat counts as used when its owner has opened at least one dashboard. Seats that have never been assigned do not count.</p>
      <p>If you plan to remove seats, reassign or archive the dashboards owned by those people first. Dashboards owned by a removed seat become read only after 30 days.</p>
      <h2 id="d-reduce">Reduce seats</h2>
      <ol><li>Go to <b>Billing</b> and find <b>Subscription seats</b>.</li><li>Lower the seat count. You cannot go below the number of seats currently assigned.</li><li>Review the renewal summary, then pay or wait for the renewal date.</li></ol>
      <p>A reduction takes effect at the start of the next term. Until then everyone keeps access, so there is no gap for people you are about to remove.</p>
      <h2 id="d-price">How the renewal price is calculated</h2>
      <p>The renewal price is the seat count on the renewal date multiplied by the annual seat price on your plan. On the Team plan that is <code>seats × $90.00</code>. A workspace renewing with 45 seats pays $4,050.00, and one renewing with 60 seats pays $5,400.00.</p>
      <p>Seats added during a term are charged pro rata for the months that remain, on the next invoice.</p>
      <h2 id="d-credit">Refunds and credits</h2>
      <p>Seats removed during a term are not refunded. If you paid a renewal and then reduce seats within 14 days, the difference is added to your account as credit and applied to the next invoice.</p>
      <p class="t-sm t-mute" style="font-family:var(--sans)">Was this page useful? <button class="br-link" data-a="stub" data-what="Docs feedback">Send feedback</button></p></article></div>`;
}
function pSignin(t){
  const filling=st.vault==='fill',ng=head(U.signin,['Catalogue','Orders','Help'],'',st.signedIn?`<div class="br-who"><span class="avatar">LF</span><span>${VAULT_LOGIN}</span></div>`:'');
  if(st.signedIn)return ng+`<div class="br-si"><div class="card br-si-card" style="align-items:flex-start"><span class="br-done-ico">${I('check',20)}</span><h1 class="t-title">You are signed in</h1><div class="t-2">Signed in to the Larkfield account as ${VAULT_LOGIN}. The password came from Claude Vault and was never shown.</div>
    <div class="row"><button class="btn btn-primary" data-a="go" data-u="${U.checkout}">Continue to checkout</button><button class="btn" data-a="signout">Sign out</button></div></div></div>`;
  return ng+`<div class="br-si"><div class="br-si-box"><div class="card br-si-card"><div><h1 class="t-title">Sign in</h1><div class="t-sm t-mute">Northgate Supply customer portal</div></div>
      <div class="field"><label for="br-si-email">Work email</label><input class="input${filling?' br-masked':''}" id="br-si-email" type="email" autocomplete="off" placeholder="name@company.example" ${filling?`value="${VAULT_LOGIN}" readonly`:''}>${filling?`<span class="br-vnote">${I('key',12)}filled by Vault, hidden from the model</span>`:''}</div>
      <div class="field"><label for="br-si-pass">Password</label><input class="input${filling?' br-masked':''}" id="br-si-pass" type="password" autocomplete="off" ${filling?'value="••••••••••••••" readonly':''}>${filling?`<span class="br-vnote">${I('key',12)}filled by Vault, hidden from the model</span>`:''}</div>
      <button class="btn btn-primary" style="padding:9px 12px" data-a="signin" ${filling?'disabled':''}>${filling?'Signing in':'Sign in'}</button>
      <div class="row between t-sm"><button class="br-link" data-a="stub" data-what="Password reset">Forgot password</button>${st.vault==='no'?`<button class="br-link" data-a="vault-open">${I('key',12)} Fill from Claude Vault</button>`:''}</div></div>
    ${st.vault==='ask'?`<div class="br-vault" role="dialog" aria-label="Claude Vault"><div class="row"><span class="br-spark">${I('key',13)}</span><b style="font-weight:600">Fill from Claude Vault?</b></div>
      <div class="row" style="align-items:flex-start">${glyph(U.signin,1)}<div class="col" style="gap:0"><span style="font-weight:500">Northgate Supply</span><span class="t-sm t-mute">${VAULT_LOGIN}</span><span class="t-xs t-mute">Saved by Marcus Bell · shared with ${E(whoOf(t)==='You'?'you':whoOf(t))}</span></div></div>
      <div class="t-xs t-mute">Vault types the login into the page for you. Claude never sees the password.</div>
      <div class="row"><button class="btn btn-primary btn-sm" data-a="vault-yes">Fill and sign in</button><button class="btn btn-sm" data-a="vault-no">Not now</button></div></div>`:''}</div></div>`;
}
function pCheckout(t){
  const paid=st.orderPaid,items=[['Thermal label rolls, box of 40','NS-2210',1,480],['Packing tape, case of 12','NS-0871',1,312],['Shipping scale, 50 kg','NS-5534',1,396]];
  return head(U.checkout,['Catalogue','Orders','Help'],'',st.signedIn?`<div class="br-who"><span class="avatar">LF</span><span>${VAULT_LOGIN}</span></div>`:`<button class="btn btn-sm" data-a="go" data-u="${U.signin}">Sign in</button>`)+`<div class="br-fill"><div class="br-body">
    <div><h1 class="t-title">${paid?'Order confirmed':'Checkout'}</h1><div class="t-sm t-mute">Order NS-48213 · 3 items</div></div>
    ${paid?`<div class="br-banner ok">${I('check',15)}<span class="grow">Paid ${M(paid.amt)} with Claude Pay at ${paid.time}, reference ${paid.ref}. Delivery is expected on Friday.</span><button class="btn btn-sm" data-a="go" data-u="${U.dl}">View receipt</button></div>`
      :st.signedIn?'':`<div class="br-banner info">${I('info',15)}<span class="grow">You are checking out as a guest. Sign in to use the Larkfield delivery details and account prices.</span><button class="btn btn-sm" data-a="go" data-u="${U.signin}">Sign in</button></div>`}
    <div class="br-cols"><div class="col" style="gap:16px"><section class="card flush"><div class="card-head"><span class="t-h">Items</span></div><div class="table-wrap"><table class="tbl"><thead><tr><th>Item</th><th>Code</th><th class="num">Qty</th><th class="num">Price</th></tr></thead><tbody>
        ${items.map(i=>`<tr><td>${i[0]}</td><td class="t-mono t-mute">${i[1]}</td><td class="num">${i[2]}</td><td class="num">${M(i[3])}</td></tr>`).join('')}</tbody></table></div></section>
      <section class="card grid-2"><div class="col" style="gap:2px"><span class="t-label">Deliver to</span><span style="font-weight:500">Larkfield, Goods in</span><span class="t-sm t-2">18 Quarry Lane, Unit 4<br>Standard delivery, 3 working days</span></div>
        <div class="col" style="gap:2px"><span class="t-label">Payment</span><span class="row" style="font-weight:500">${I('wallet',15)}Claude Pay</span><span class="t-sm t-2">Paid from the Larkfield wallet. No card details are entered on this site.</span></div></section></div>
      <section class="card col" style="gap:4px"><div class="t-h" style="margin-bottom:6px">Order summary</div><div class="br-sum"><span>Subtotal</span><span class="t-mono">$1,188.00</span></div><div class="br-sum t-mute"><span>Delivery</span><span class="t-mono">$0.00</span></div><div class="br-sum t-mute"><span>Tax</span><span class="t-mono">$92.00</span></div>
        <div class="br-sum total"><span>${paid?'Paid':'Total'}</span><span class="t-mono">$1,280.00</span></div>
        ${paid?`<button class="btn" style="margin-top:8px" data-a="go" data-u="${U.dl}">${I('file',14)}Receipt in Downloads</button>`:`<button class="btn btn-accent" style="margin-top:8px;padding:9px 12px" data-a="pay" data-k="northgate">${I('wallet',15)}Pay with Claude Pay</button><div class="t-xs t-mute" style="margin-top:6px">You will see the amount, the budget and the rule that applies before anything is paid.</div>`}</section></div></div></div>`;
}
const INV=[['INV-1048','Halden Dental','12 Nov 2026','12 Dec 2026','Draft',22809.6],['INV-1047','Brightwater Clinics','10 Nov 2026','10 Dec 2026','Sent',8640],['INV-1046','Oakline Logistics','6 Nov 2026','6 Dec 2026','Sent',14250],['INV-1045','Tessel Labs','3 Nov 2026','3 Dec 2026','Paid',3120],
  ['INV-1044','Marlow Print','28 Oct 2026','27 Nov 2026','Paid',1980.5],['INV-1043','Kestrel Freight','21 Oct 2026','20 Nov 2026','Overdue',11400],['INV-1042','Juniper Health','14 Oct 2026','13 Nov 2026','Overdue',6375],['INV-1041','Fenwick and Marsh','9 Oct 2026','8 Nov 2026','Paid',2760]];
function invRows(){
  const q=st.invQ.trim().toLowerCase(),rows=INV.filter(r=>(st.invStatus==='All'||r[4]===st.invStatus)&&(!q||(r[0]+' '+r[1]).toLowerCase().indexOf(q)>=0)),tone={Sent:'info',Paid:'ok',Overdue:'bad',Draft:''};
  return (rows.length?rows.map(r=>`<tr><td class="t-mono">${r[0]}</td><td>${E(r[1])}</td><td>${r[2]}</td><td>${r[3]}</td><td><span class="pill ${tone[r[4]]}">${r[4]}</span></td><td class="num">${M(r[5])}</td></tr>`).join('')
    :`<tr><td colspan="6"><div class="empty" style="padding:28px 16px">${I('search',20)}<div>No invoices match these filters.</div></div></td></tr>`)
    +`<tr data-bt="total"><td colspan="5" class="t-mute">${rows.length} of ${INV.length} invoices</td><td class="num"><b>${M(rows.reduce((s,r)=>s+r[5],0))}</b></td></tr>`;
}
function pInv(t){
  return `<div class="br-stripe">${I('alert',13)}Staging environment · build 4.18.0-rc2 · test data only</div>`+head(U.inv,['Dashboard','Invoices','Customers','Settings'],'Invoices',whoChip(t))+`<div class="br-body">
    <div class="row between wrap"><div><h1 class="t-title">Invoices</h1><div class="t-sm t-mute">New in this build: CSV export</div></div>
      <div class="row"><button class="btn" data-a="stub" data-what="Creating an invoice on staging">${I('plus',14)}New invoice</button><button class="btn btn-primary" data-a="export" data-bt="export">${I('download',14)}Export CSV</button></div></div>
    <div class="row wrap"><div class="search" style="width:280px">${I('search',14)}<input id="br-inv-q" data-in="inv" value="${E(st.invQ)}" placeholder="Filter by number or customer" aria-label="Filter invoices"></div>
      <select class="select" id="br-inv-s" style="width:150px" aria-label="Status">${['All','Draft','Sent','Paid','Overdue'].map(s=>`<option ${s===st.invStatus?'selected':''}>${s}</option>`).join('')}</select></div>
    <section class="card flush" data-bt="table"><div class="table-wrap"><table class="tbl"><thead><tr><th>Number</th><th>Customer</th><th>Issued</th><th>Due</th><th>Status</th><th class="num">Amount</th></tr></thead><tbody id="br-inv-body">${invRows()}</tbody></table></div></section></div>`;
}
function pSearch(t){
  const q=qOf(url(t)),words=q.toLowerCase().split(/\s+/).filter(Boolean),all=Object.keys(PAGES).filter(u=>u!==HOME);
  const hits=all.filter(u=>{const p=PAGES[u],hay=(p.title+' '+u+' '+p.desc+' '+site(u).name).toLowerCase();return words.length&&words.every(w=>hay.indexOf(w)>=0)}),list=hits.length?hits:all;
  return `<div class="br-int"><div class="search br-nt-search" style="max-width:none;box-shadow:var(--shadow-1)">${I('search',17)}<input id="br-nt-q" value="${E(q)}" aria-label="Search" autocomplete="off"><span class="kbd">↵</span></div>
    <div class="notice" style="flex-direction:row;align-items:center"><span class="br-spark">${I('zap',13)}</span><span class="grow">Ask Claude instead: <b style="font-weight:500">${E(q||'a question')}</b></span><button class="btn btn-sm" data-a="ask-q" data-q="${E(q)}">Ask Claude</button></div>
    <div class="t-sm t-mute">${hits.length?`${hits.length} ${hits.length===1?'result':'results'} for "${E(q)}"`:`Nothing matches "${E(q)}". These are the pages in this concept.`}</div>
    <div class="col" style="gap:2px">${list.map(u=>`<button class="br-res" data-a="go" data-u="${E(u)}">${glyph(u,1)}<span class="col" style="gap:0;min-width:0"><span class="t-xs t-mute truncate">${E(shortUrl(u))}</span><b>${E(PAGES[u].title)}</b><span class="t-sm t-2">${E(PAGES[u].desc)}</span></span></button>`).join('')}</div></div>`;
}
function histRows(){
  const q=st.histQ.trim().toLowerCase(),rows=history.filter(h=>!q||(pageFor(h.url).title+' '+h.url+' '+h.who).toLowerCase().indexOf(q)>=0);
  return rows.length?rows.map(h=>`<button class="list-row" data-a="go" data-u="${E(h.url)}"><span class="t-xs t-mono t-mute" style="width:40px">${E(h.time)}</span>${glyph(h.url)}<span class="grow truncate"><span style="font-weight:500">${E(pageFor(h.url).title)}</span> <span class="t-mute t-sm">${E(shortUrl(h.url))}</span></span><span class="pill ${h.who==='You'?'':'accent'}">${h.who==='You'?'':I('bot',11)}${E(h.who)}</span></button>`).join('')
    :`<div class="empty">${I('clock',22)}<div>${history.length?'No history matches that search.':'No history yet.'}</div><div class="t-xs">Pages opened by you and by your bots are listed here.</div></div>`;
}
function pHist(){
  return `<div class="br-int"><div class="row between wrap"><h1 class="t-title">History</h1><div class="row"><div class="search" style="width:260px">${I('search',14)}<input id="br-hist-q" data-in="hist" value="${E(st.histQ)}" placeholder="Search history" aria-label="Search history"></div><button class="btn" data-a="hist-clear" ${history.length?'':'disabled'}>${I('trash',14)}Clear history</button></div></div>
    <div class="t-label">Today, ${today()}</div><section class="card flush" id="br-hist-list">${histRows()}</section></div>`;
}
function dlRow(d){
  const busy=d.p<1,pct=Math.round(d.p*100);
  return `<div class="br-dl"><span class="br-dl-ico">${I('file',16)}</span><div class="col" style="gap:0;min-width:0"><span class="truncate" style="font-weight:500">${E(d.name)}</span>
    ${busy?`<div class="br-prog" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100" aria-label="Downloading ${E(d.name)}"><i style="width:${pct}%"></i></div><span class="t-xs t-mute">${pct}% of ${E(d.size)} · from ${E(d.from)}</span>`
      :`<span class="t-xs t-mute truncate">${E(d.size)} · from ${E(d.from)} · ${E(d.by)} · ${E(d.time)}</span>`}</div>
    <div class="row" style="gap:2px">${busy?'':`<button class="icon-btn sm" data-a="dl-open" data-id="${d.id}" aria-label="Open ${E(d.name)}" title="Open">${I('external',14)}</button>`}<button class="icon-btn sm" data-a="dl-x" data-id="${d.id}" aria-label="${busy?'Cancel download':'Remove from list'}" title="${busy?'Cancel':'Remove from list'}">${I('x',14)}</button></div></div>`;
}
const dlEmpty=()=>`<div class="empty">${I('download',22)}<div>No downloads yet.</div><div class="t-xs">Receipts from Claude Pay and files your bots save appear here.</div></div>`;
function pDl(){return `<div class="br-int"><div class="row between"><h1 class="t-title">Downloads</h1><span class="t-sm t-mute">${downloads.length} ${downloads.length===1?'file':'files'}</span></div><section class="card flush">${downloads.length?downloads.map(dlRow).join(''):dlEmpty()}</section></div>`}
function pMissing(t){return `<div class="empty" style="flex:1">${I('alert',24)}<div class="t-h">This page is not part of the concept</div><div class="t-sm">${E(shortUrl(url(t)))} is not one of the invented sites.</div><button class="btn" data-a="go" data-u="${HOME}">Open a new tab page</button></div>`}

/* ---------- side panel ---------- */
function info(t){
  const u=url(t),bots=tabs.filter(isBot);
  if(u===U.crm){const f=apr().status==='approved';return {sum:['Deal HD-2291 for Halden Dental: 45 seats, $22,809.60 a year, at the contract stage.',f?'Contract v3 matches the signed quote: Growth tier with a 12% discount.':'Contract v2 was generated at the Starter price. The signed quote says Growth.','Priya Nair owns the deal. The close date is 28 November.'],
    acts:[["Compare with last year's price",'Halden Dental is a new customer, so there is no price from last year. Against this year\'s list price, $22,809.60 is 12% below the Growth tier for 45 seats.'],['Draft a reply','Draft to Priya Nair: "Hi Priya, the Halden Dental contract was generated at the Starter price, but the signed quote is for Growth. Matching the quoted amount on Growth needs a 12% discount, which is above the 10% policy, so it is waiting for approval. I will send the corrected contract as soon as it is approved."']]}}
  if(u===U.bill){const s=st.corvinPaid?st.corvinPaid.seats:st.seats;return {sum:[`Corvin Analytics Team plan, ${s} seats, ${st.corvinPaid?'renewed until 30 November 2027':'renewing on 1 December 2026'}.`,`The renewal is ${M(s*90)}. Last year was $5,400.00 for 60 seats.`,'45 of 60 seats were used in the last 90 days.'],
    acts:[["Compare with last year's price",`Last year Larkfield paid $5,400.00 for 60 seats at $90.00 a seat. This renewal is ${M(s*90)} for ${s} seats at the same seat price, a difference of ${M(Math.abs(5400-s*90))} ${s*90<=5400?'less':'more'}.`],['Draft a reply','Draft to Marcus Bell: "Hi Marcus, the Corvin Analytics renewal is set to 45 seats, which matches actual usage over the last 90 days. That brings the renewal to $4,050.00, down from $5,400.00. It is under the $5,000 renewal limit, so no approval is needed. The receipt will be in Downloads."']]}}
  if(u===U.docs)return {sum:['A Corvin Docs guide on changing seats on an annual plan.','Seats can be added at any time and reduced at renewal. A reduction starts with the next term.','Renewal price is seats multiplied by $90.00 on the Team plan.'],
    acts:[['Summarise the steps','Check usage for the last 90 days, reassign dashboards owned by people you will remove, lower the seat count under Billing, then review the renewal summary and pay.'],['Draft a reply','Draft to Marcus Bell: "Per the Corvin guide, we can reduce seats at renewal with no gap in access, and there is no refund for seats removed mid-term. Reducing to 45 seats before 1 December is the cheapest option."']]};
  if(u===U.signin)return {sum:['The sign-in page for the Northgate Supply customer portal.',st.signedIn?'You are signed in with the login from Claude Vault.':'Claude Vault holds one login for this site. It can fill the form without showing the password to Claude.'],
    acts:[['Is this the real Northgate site?','The address is portal.northgate.example and it matches the site saved with the Vault login. Vault only offers a login on the address it was saved for.'],['Draft a reply','Draft to Northgate Supply: "Hello, please confirm the delivery date for order NS-48213 to 18 Quarry Lane. Thank you, Larkfield purchasing."']]};
  if(u===U.checkout)return {sum:['Checkout for Northgate Supply order NS-48213: three items, $1,280.00 including $92.00 tax.',st.orderPaid?'The order is paid and a receipt is in Downloads.':'Paying with Claude Pay draws on Operations · Office supplies. It is over $1,000, so it needs approval.'],
    acts:[["Compare with last year's price",'The last Northgate Supply order with the same three items was $1,214.00 in November 2025. This one is $66.00 more, all of it on the shipping scale.'],['Draft a reply','Draft to Northgate Supply: "Hello, we have placed order NS-48213. Please deliver to Goods in at 18 Quarry Lane and send the invoice to accounts@larkfield.example."']]};
  if(u===U.inv)return {sum:['A staging build of the Larkfield invoices screen with 8 test invoices totalling $71,335.10.','Two invoices are overdue: Kestrel Freight and Juniper Health.','This build adds an Export CSV button.'],
    acts:[['What should I test here?','Check that the export has one row per invoice, that amounts keep two decimal places, and that the status filter is respected. QA bot runs the same three checks after every build.'],['Draft a reply','Draft to Sam Okafor: "CSV export works on staging build 4.18.0-rc2. The file has 8 rows and the totals match the table. Ready for release once you approve."']]};
  if(u===HOME)return {sum:[`${bots.length} ${bots.length===1?'bot is':'bots are'} browsing in ${bots.length===1?'its own tab':'their own tabs'}.`,`${CW.pending().length} approvals are waiting for you.`],
    acts:[['What are my bots doing?',bots.length?bots.map(b=>CW.bot(b.owner).name+': '+trailOf(b).now).join(' '):'No bots have a tab open right now.'],['Which approvals are waiting?',CW.pending().length?CW.pending().map(a=>a.title).join('. ')+'.':'Nothing is waiting for you.']]};
  return {sum:['A built-in Claude page: '+pageFor(u).title+'.'],acts:[['What can I do here?','History lists every page opened by you and by your bots. Downloads lists files and Claude Pay receipts. Both can be searched or cleared.']]};
}
function answer(t,q){return 'This concept does not run a live model, so this is a sample answer to "'+q+'". From the page: '+info(t).sum[0]}
function drawPanel(){
  const box=$('br-panel');box.hidden=!panelOpen;if(!panelOpen){box.innerHTML='';return}
  const t=cur();
  box.innerHTML=`<div class="br-ph"><span class="br-spark">${I('zap',13)}</span><b style="font-weight:600">Claude</b><span class="t-xs t-mute truncate grow">${E(pageFor(url(t)).title)}</span><button class="icon-btn sm" data-a="panel" aria-label="Close side panel">${I('x',14)}</button></div>
    <div class="br-pb" id="br-pb"></div>
    <div class="br-pc"><div class="composer"><textarea id="br-ask" rows="2" placeholder="Ask about this page" aria-label="Ask Claude about this page">${E(askDraft)}</textarea><div class="bar"><span class="t-xs t-mute">${isBot(t)?'Reads this tab as '+E(CW.bot(t.owner).name):'Reads only this page'}</span><button class="send" data-a="ask-send" aria-label="Send">${I('arrow-up',14)}</button></div></div></div>`;
  drawPanelBody();
}
function drawPanelBody(toEnd){
  const box=$('br-pb');if(!box)return;
  const t=cur(),inf=info(t),tr=isBot(t)?trailOf(t):null,keep=box.scrollTop;
  box.innerHTML=`<div class="col"><span class="t-label">Summary of this page</span><ul>${inf.sum.map(s=>`<li>${E(s)}</li>`).join('')}</ul></div>
    <div class="col"><span class="t-label">Suggested</span><div class="row wrap">${inf.acts.map((a,i)=>`<button class="chip" data-a="sug" data-i="${i}">${E(a[0])}</button>`).join('')}</div></div>
    ${tr?`<div class="col"><div class="row between"><span class="t-label">${E(CW.bot(t.owner).name)} in this tab</span><span class="t-xs t-mute">${t.mode==='taken'?'You have taken over':t.mode==='paused'?'Paused':tr.fin?'Finished':'Working'}</span></div>
      <ol class="br-trail" style="margin:0;padding:0">${tr.items.map(s=>`<li class="br-step ${s.state}"><span class="m">${s.state==='done'?I('check',10):s.state==='stop'?I('x',10):''}</span><span>${E(s.text)}</span><span class="t-xs t-mono t-mute">${E(s.time||(s.state==='now'?'now':s.state==='wait'?'waiting':''))}</span></li>`).join('')}</ol></div>`:''}
    ${t.chat.length?`<hr class="divider">${t.chat.map(m=>m.me?`<div class="br-q">${E(m.text)}</div>`:`<div class="br-ans">${E(m.text)}</div>`).join('')}`:''}`;
  box.scrollTop=toEnd?box.scrollHeight:keep;
}
function askClaude(q,ans){
  const t=cur();q=(q||'').trim()||'What is on this page?';
  t.chat.push({me:1,text:q},{text:ans||answer(t,q)});
  if(!panelOpen){panelOpen=true;drawBar();drawPanel();placeCursor()}
  drawPanelBody(true);
}

/* ---------- popovers: site info, downloads ---------- */
function permsFor(h){return perms[h]||(perms[h]={notif:false,clip:false,dl:true,pay:/corvin|northgate/.test(h)})}
function popHtml(){
  const t=cur(),u=url(t),h=hostOf(u),s=site(u);
  if(pop==='dl')return `<div class="card-head"><span class="t-h">Downloads</span><button class="btn btn-ghost btn-sm" data-a="go" data-u="${U.dl}">Show all</button></div>${downloads.length?downloads.slice(0,5).map(dlRow).join(''):dlEmpty()}`;
  if(h==='claude')return `<div class="br-pop-row">${glyph(u,1)}<div class="col" style="gap:0"><b style="font-weight:600">${E(pageFor(u).title)}</b><span class="t-sm t-mute">A built-in Claude page. It is stored on this device and has no site permissions.</span></div></div>`;
  const id=ident(t),p=permsFor(h),guest=h==='portal.northgate.example'&&!st.signedIn;
  const perm=(k,l)=>`<label class="br-perm"><span>${l}</span><input type="checkbox" class="switch" data-perm="${k}" ${p[k]?'checked':''}></label>`;
  return `<div class="br-pop-row" style="align-items:center">${glyph(u,1)}<div class="col grow" style="gap:0"><b style="font-weight:600">${E(s.name)}</b><span class="t-xs t-mute truncate">${E(h)}</span></div><button class="icon-btn sm" data-a="pop-x" aria-label="Close">${I('x',14)}</button></div>
    <div class="br-pop-row">${I('lock',16)}<div class="col" style="gap:0"><span style="font-weight:500">Connection is secure</span><span class="t-xs t-mute">Encrypted. The certificate is valid and issued to ${E(h)}.</span></div></div>
    <div class="br-pop-row">${I(id.bot?'bot':'shield',16)}<div class="col" style="gap:0"><span style="font-weight:500">${guest?'Not signed in to this site':'Signed in as '+E(id.name)+(id.bot?'':' (you)')}</span><span class="t-xs t-mute">${guest?'This tab belongs to '+E(id.name)+'.':E(id.email)+' · through Claude Auth'}${id.bot?'<br>The bot uses its own identity, not yours.':''}</span></div></div>
    <div class="br-pop-row" style="flex-direction:column;gap:2px"><span class="t-label" style="margin-bottom:2px">Permissions for this site</span>${perm('notif','Notifications')}${perm('clip','Read the clipboard')}${perm('dl','Save downloads without asking')}${perm('pay','Pay with Claude Pay')}</div>
    <div class="br-pop-row" style="align-items:center">${I('key',16)}<div class="col grow" style="gap:0"><span style="font-weight:500">Saved in Claude Vault: 1 login</span><span class="t-xs t-mute truncate">${E(s.login||h)}</span></div><button class="btn btn-sm" data-a="open-vault">Open Vault</button></div>`;
}
function drawPop(){
  let p=$('br-pop');
  if(!pop){if(p)p.remove();return}
  const anchor=el.querySelector('[data-pop="'+pop+'"]');if(!anchor){pop=null;if(p)p.remove();return}
  if(!p){p=document.createElement('div');p.id='br-pop';p.className='br-pop';p.setAttribute('role','dialog');el.appendChild(p)}
  p.setAttribute('aria-label',pop==='dl'?'Downloads':'Site information');p.innerHTML=popHtml();
  const a=anchor.getBoundingClientRect(),r=el.getBoundingClientRect(),w=p.offsetWidth;
  const left=pop==='dl'?a.right-r.left-w:a.left-r.left-4;
  p.style.top=(a.bottom-r.top+8)+'px';p.style.left=Math.max(8,Math.min(left,r.width-w-8))+'px';
}
function togglePop(k){pop=pop===k?null:k;dd.open=false;drawDd();drawPop();const b=el.querySelector('.br-tog[data-pop="dl"]');if(b)b.setAttribute('aria-pressed',pop==='dl')}

/* ---------- Claude Pay sheet ---------- */
function payInfo(k,t){
  const by=isBot(t)?'You, in '+CW.bot(t.owner).name+"'s tab":'You';
  if(k==='corvin'){const amt=st.seats*90,ok=amt<=5000;return {k,by,vendor:'Corvin Analytics',what:'Team plan, annual renewal',detail:st.seats+' seats at $90.00 a seat · 1 Dec 2026 to 30 Nov 2027',amt,budget:'Finance · Software subscriptions',left:st.budget.sw,ok,rule:ok?'Under the $5,000 renewal limit, no approval needed':'Over the $5,000 renewal limit, needs approval'}}
  return {k,by,vendor:'Northgate Supply',what:'Order NS-48213',detail:'3 items · delivery to 18 Quarry Lane',amt:1280,budget:'Operations · Office supplies',left:st.budget.ops,ok:false,rule:'Over $1,000, needs approval'};
}
function drawSheet(){
  const box=$('br-sheet');if(!sheet){box.innerHTML='';return}
  const s=sheet,i=s.info,done=s.state==='done',busy=s.state==='busy';
  box.innerHTML=`<div class="br-scrim" data-scrim><div class="br-sheet" role="dialog" aria-modal="true" aria-label="Claude Pay">
    <div class="br-sheet-head"><span class="br-spark">${I('wallet',13)}</span><b class="grow" style="font-weight:600">Claude Pay</b><button class="icon-btn sm" data-a="sheet-x" aria-label="Close">${I('x',14)}</button></div>
    ${done?`<div class="br-sheet-body" style="align-items:flex-start"><span class="br-done-ico">${I('check',20)}</span><div><div class="t-h">Paid ${M(i.amt)} to ${E(i.vendor)}</div><div class="t-sm t-mute">${E(i.what)} · ${E(s.rec.time)} · reference ${E(s.rec.ref)}</div></div>
        <dl class="br-kv" style="margin:0"><dt>From</dt><dd>${E(i.budget)}<br><span class="t-xs t-mute">${M(i.left-i.amt)} left this quarter</span></dd><dt>Paid by</dt><dd>${E(i.by)}</dd><dt>Receipt</dt><dd class="row">${I('file',14)}<span class="truncate">${E(s.file)}</span></dd></dl>
        <div class="t-xs t-mute">The receipt is saved to Downloads and the payment is in the audit log.</div></div>
      <div class="br-sheet-foot"><button class="btn" data-a="sheet-dl">Show in Downloads</button><button class="btn btn-primary" data-a="sheet-x">Done</button></div>`
    :`<div class="br-sheet-body"><div class="row" style="align-items:flex-start">${glyph(url(cur()),1)}<div class="col" style="gap:0"><b style="font-weight:600">${E(i.vendor)}</b><span class="t-sm t-2">${E(i.what)}</span><span class="t-xs t-mute">${E(i.detail)}</span></div></div>
        <div class="br-amt">${M(i.amt)}</div>
        <dl class="br-kv" style="margin:0"><dt>Wallet budget</dt><dd>${E(i.budget)}<br><span class="t-xs t-mute">${M(i.left)} left this quarter, ${M(i.left-i.amt)} after this payment</span></dd><dt>Paid by</dt><dd>${E(i.by)}</dd><dt>Site sees</dt><dd>A one-time payment token. No card or bank details.</dd></dl>
        <div class="br-rule${i.ok?'':' warn'}">${I(i.ok?'check':'alert',15)}<span><b style="font-weight:600">${E(i.rule)}</b>${i.ok?'':'<br>You are an approver for this budget, so paying here records your approval.'}</span></div></div>
      <div class="br-sheet-foot"><button class="btn" data-a="sheet-x" ${busy?'disabled':''}>Cancel</button><button class="btn btn-accent" data-a="sheet-pay" ${busy?'disabled':''}>${busy?'Paying':(i.ok?'Pay ':'Approve and pay ')+M(i.amt)}</button></div>`}</div></div>`;
  const f=box.querySelector(done?'.btn-primary':'.btn-accent');if(f&&!busy)f.focus();
}

/* ---------- address bar dropdown ---------- */
function suggest(q){
  const s=q.trim().toLowerCase(),m=(title,u)=>!s||title.toLowerCase().indexOf(s)>=0||u.toLowerCase().indexOf(s)>=0,seen={},out=[{kind:'ask',q:q.trim()}];
  tabs.filter(t=>t.id!==activeId&&m(pageFor(url(t)).title+' '+whoOf(t),url(t))).slice(0,4).forEach(t=>out.push({kind:'tab',id:t.id,url:url(t),title:pageFor(url(t)).title,hint:isBot(t)?whoOf(t)+"'s tab":'Switch to tab'}));
  flatBm().filter(b=>m(b.title,b.url)).forEach(b=>{if(!seen[b.url]&&out.length<8){seen[b.url]=1;out.push({kind:'bm',url:b.url,title:b.title,hint:'Bookmark'})}});
  history.filter(h=>m(pageFor(h.url).title,h.url)).forEach(h=>{if(!seen[h.url]&&out.length<11){seen[h.url]=1;out.push({kind:'hist',url:h.url,title:pageFor(h.url).title,hint:'History'})}});
  return out;
}
function drawDd(){
  const box=$('br-dd'),inp=$('br-url');if(!box||!inp)return;
  inp.setAttribute('aria-expanded',dd.open);
  if(!dd.open){box.hidden=true;return}
  dd.items=suggest(dd.touched?inp.value:'');if(dd.idx>=dd.items.length)dd.idx=dd.items.length-1;
  let last='';const label={tab:'Open tabs',bm:'Bookmarks',hist:'History'};
  box.hidden=false;box.innerHTML=dd.items.map((it,i)=>{
    const sep=it.kind!=='ask'&&it.kind!==last?`<div class="br-dd-sep">${label[it.kind]}</div>`:'';last=it.kind;
    return sep+(it.kind==='ask'?`<button class="br-dd-row ask${i===dd.idx?' on':''}" data-a="dd" data-i="${i}" tabindex="-1">${I('zap',15)}<span class="grow truncate">${it.q?'Ask Claude: '+E(it.q):'Ask Claude about this page'}</span><span class="t-xs t-mute">Side panel</span></button>`
      :`<button class="br-dd-row${i===dd.idx?' on':''}" data-a="dd" data-i="${i}" tabindex="-1">${glyph(it.url)}<span class="grow truncate">${E(it.title)} <span class="t-mute">· ${E(shortUrl(it.url))}</span></span><span class="t-xs t-mute">${E(it.hint)}</span></button>`)}).join('');
}
function pickDd(i){
  const it=dd.items[i];if(!it)return;dd.open=false;
  if(it.kind==='ask'){const inp=$('br-url');if(inp)inp.blur();drawBar();askClaude(it.q)}
  else if(it.kind==='tab')activate(it.id);
  else nav(cur(),it.url);
}
function submitAddr(text){
  const t=cur(),u=resolve(text);
  if(!u){CW.toast('Type an address or something to search for.');return}
  if(u===url(t)){closeFloating();drawAll();loadBar();return}
  nav(t,u);
}

/* ---------- tab menus ---------- */
function tabMenu(anchor,id){
  const t=tabs.find(x=>x.id===id);if(!t)return;const bot=isBot(t);
  CW.menu(anchor,[
    {label:t.pinned?'Unpin':'Pin',icon:'bookmark',onClick(){t.pinned=!t.pinned;if(t.pinned)t.group=null;drawTabs()}},
    {label:bot?'Duplicate into your tabs':'Duplicate',icon:'copy',onClick(){const n=newTab(url(t));if(!bot&&t.group){n.group=t.group;drawTabs()}}},
    {label:'Add to group',icon:'folder',onClick(){if(bot){CW.toast('Bot tabs stay in the bot\'s own profile and cannot join your groups.');return}setTimeout(()=>groupMenu(t),0)}},'sep',
    {label:bot?'Close other bot tabs':'Close others',icon:'layers',onClick(){tabs.filter(x=>x!==t&&isBot(x)===bot&&!x.pinned).forEach(x=>tabs.splice(tabs.indexOf(x),1));activeId=t.id;closeFloating();drawAll()}},
    {label:'Close',icon:'x',onClick(){closeTab(id)}}]);
}
function groupMenu(t){
  const anchor=el.querySelector('[data-tab="'+t.id+'"]')||$('br-strip');
  const items=groups.map(g=>({label:g.name,icon:'tag',hint:t.group===g.id?'Current':'',onClick(){t.group=g.id;t.pinned=false;g.collapsed=false;drawTabs()}}));
  items.push({label:'New group',icon:'plus',onClick(){
    const m=CW.modal({title:'New tab group',body:`<div class="field"><label for="br-gname">Group name</label><input class="input" id="br-gname" value="New group" maxlength="24"></div><div class="t-sm t-mute">The tab "${E(pageFor(url(t)).tab||pageFor(url(t)).title)}" will be added to it.</div>`,foot:`<button class="btn" data-close>Cancel</button><button class="btn btn-primary" id="br-gok">Create group</button>`});
    const inp=m.querySelector('#br-gname'),ok=()=>{const g={id:'g'+Date.now(),name:inp.value.trim()||'New group',tone:TONES[groups.length%TONES.length],collapsed:false};groups.push(g);t.group=g.id;t.pinned=false;CW.closeModal();if(el&&el.isConnected)drawTabs()};
    inp.select();m.querySelector('#br-gok').addEventListener('click',ok);inp.addEventListener('keydown',e=>{if(e.key==='Enter')ok()})}});
  if(t.group)items.push('sep',{label:'Remove from group',icon:'x',onClick(){t.group=null;drawTabs()}});
  CW.menu(anchor,items);
}

/* ---------- actions ---------- */
const stub=what=>CW.toast((what||'This')+' is not part of this concept.');
const ACT={
  tab(b){activate(b.dataset.id)},
  'tab-x'(b){closeTab(b.dataset.id)},
  'tab-menu'(b){tabMenu(b,b.dataset.id)},
  'new'(){newTab()},
  group(b){const g=groups.find(x=>x.id===b.dataset.id);if(!g)return;g.collapsed=!g.collapsed;
    if(g.collapsed&&cur().group===g.id){const v=visible()[0];if(v)activeId=v.id;else g.collapsed=false;closeFloating();drawAll()}else drawTabs()},
  back(){const t=cur();if(t.hi>0){t.hi--;t.scroll=0;closeFloating();drawAll();loadBar()}},
  fwd(){const t=cur();if(t.hi<t.hist.length-1){t.hi++;t.scroll=0;closeFloating();drawAll();loadBar()}},
  reload(){closeFloating();drawAll();loadBar()},
  go(b){nav(cur(),b.dataset.u)},
  pop(b){togglePop(b.dataset.pop)},
  'pop-x'(){togglePop(pop)},
  star(){const t=cur(),u=url(t);
    if(hostOf(u)==='claude'){CW.toast('Built-in pages cannot be bookmarked.');return}
    if(isBm(u)){for(let i=bookmarks.length-1;i>=0;i--){const b=bookmarks[i];if(b.folder)b.items=b.items.filter(x=>x.url!==u);else if(b.url===u)bookmarks.splice(i,1)}CW.toast('Bookmark removed.')}
    else{const at=bookmarks.findIndex(b=>b.folder);bookmarks.splice(at<0?bookmarks.length:at,0,{title:pageFor(u).tab||pageFor(u).title,url:u});CW.toast(showBm?'Added to the bookmarks bar.':'Bookmark added.')}
    drawBar();drawBm()},
  panel(){panelOpen=!panelOpen;drawBar();drawPanel();placeCursor();if(panelOpen){const a=$('br-ask');if(a)a.focus()}},
  profile(b){
    const mine=tabs.filter(t=>!isBot(t)),ids=[];tabs.filter(isBot).forEach(t=>{if(ids.indexOf(t.owner)<0)ids.push(t.owner)});
    const items=[{label:'You · '+D.me.name,icon:'user',hint:mine.length+(mine.length===1?' tab':' tabs'),onClick(){const t=visible().find(x=>!isBot(x))||mine[0];if(t)activate(t.id);else newTab()}}];
    if(ids.length)items.push('sep');
    ids.forEach(id=>{const n=tabs.filter(t=>t.owner===id).length;items.push({label:CW.bot(id).name,icon:'bot',hint:n+(n===1?' tab':' tabs'),onClick(){activate(tabs.find(t=>t.owner===id).id)}})});
    items.push('sep',{label:'Manage identities',icon:'shield',onClick(){CW.go('settings','identity')}});
    CW.menu(b,items)},
  more(b){CW.menu(b,[
    {label:'New tab',icon:'plus',onClick(){newTab()}},{label:'New window',icon:'external',onClick(){CW.toast('New windows are not part of this concept. Open a new tab instead.')}},'sep',
    {label:'History',icon:'clock',onClick(){nav(cur(),U.hist)}},{label:showBm?'Hide bookmarks bar':'Show bookmarks bar',icon:'bookmark',onClick(){showBm=!showBm;drawBm();placeCursor()}},
    {label:'Downloads',icon:'download',onClick(){nav(cur(),U.dl)}},'sep',{label:'Settings',icon:'settings',onClick(){CW.go('settings')}}])},
  'bm-folder'(b){const f=bookmarks[+b.dataset.i];if(!f||!f.items.length){CW.toast('This folder is empty. Bookmark a page with the star to fill it.');return}
    CW.menu(b,f.items.map(x=>({label:x.title,icon:'globe',onClick(){nav(cur(),x.url)}})))},
  stub(b){stub(b.dataset.what)},
  bell(){const x=document.getElementById('bell');if(x)x.click()},
  review(b){const a=D.approvals.find(x=>x.id===b.dataset.id);if(a)CW.go(a.mode,a.sub)},
  'sess-pause'(){const t=cur();t.mode=t.mode==='paused'?'drive':'paused';CW.toast(CW.bot(t.owner).name+(t.mode==='paused'?' is paused.':' is working again.'));drawSess();drawPage();drawPanelBody()},
  'sess-take'(){const t=cur();t.mode='taken';CW.toast('You have taken over. '+CW.bot(t.owner).name+' is waiting.');drawSess();drawPage();drawPanelBody()},
  'sess-back'(){const t=cur();t.mode='drive';CW.toast('Handed back to '+CW.bot(t.owner).name+'.');if(url(t)!==t.home)nav(t,t.home);else{drawSess();drawPage();drawPanelBody()}},
  seat(b){if(st.corvinPaid)return;st.seats=b.dataset.set?+b.dataset.set:Math.max(1,Math.min(200,st.seats+(+b.dataset.d)));drawPage();drawPanelBody()},
  pay(b){const t=cur(),k=b.dataset.k;
    if(!permsFor(hostOf(url(t))).pay){CW.toast('Claude Pay is switched off for this site. Turn it on from the lock in the address bar.');return}
    sheet={info:payInfo(k,t),state:'confirm'};drawSheet()},
  'sheet-x'(){if(sheet&&sheet.state==='busy')return;sheet=null;drawSheet()},
  'sheet-pay'(){if(!sheet||sheet.state!=='confirm')return;const s=sheet;s.state='busy';drawSheet();
    setTimeout(()=>{if(sheet!==s)return;s.rec=s.info.k==='corvin'?payCorvin(s.info.by):payNorthgate(s.info.by);s.file=downloads[0].name;s.state='done';
      if(el&&el.isConnected){drawPage();drawPanelBody();drawSheet()}},700)},
  'sheet-dl'(){sheet=null;drawSheet();nav(cur(),U.dl)},
  'vault-yes'(){const t=cur();st.vault='fill';drawPage();
    setTimeout(()=>{if(st.vault!=='fill')return;st.signedIn=true;st.vault='done';CW.toast('Signed in to Northgate Supply with the login from Claude Vault.');
      if(el&&el.isConnected){if(url(t)===U.signin&&tabs.indexOf(t)>=0){t.hist=t.hist.slice(0,t.hi+1);t.hist.push(U.checkout);t.hi++;t.scroll=0;history.unshift({url:U.checkout,who:whoOf(t),time:nowT()})}closeFloating();drawAll();loadBar()}},1100)},
  'vault-no'(){st.vault='no';drawPage()},
  'vault-open'(){st.vault='ask';drawPage()},
  signin(){const e=$('br-si-email'),p=$('br-si-pass');
    if(!e||!p||!e.value.trim()||!p.value){CW.toast('Enter an email and a password, or fill them from Claude Vault.');return}
    st.signedIn=true;st.vault='done';CW.toast('Signed in to Northgate Supply.');nav(cur(),U.checkout)},
  signout(){st.signedIn=false;st.vault='ask';CW.toast('Signed out of Northgate Supply.');drawAll()},
  'export'(){exportCsv(whoOf(cur())==='You'?'You':'You, in '+whoOf(cur())+"'s tab");CW.toast('Exporting 8 invoices to CSV. See Downloads.');if(pop==='dl')drawPop()},
  'dl-file'(b){addDl({name:b.dataset.name,size:b.dataset.size,from:hostOf(url(cur())),by:'You'});CW.toast(b.dataset.name+' saved to Downloads.')},
  'dl-x'(b){const i=downloads.findIndex(d=>d.id===b.dataset.id);if(i<0)return;const d=downloads.splice(i,1)[0];CW.toast(d.p<1?'Download cancelled.':'Removed from the list. The file was not deleted.');updBadge();if(pop==='dl')drawPop();if(url(cur())===U.dl)drawPage()},
  'dl-open'(){CW.toast('Opening files is not part of this concept.')},
  'hist-clear'(){history.length=0;st.histQ='';CW.toast('History cleared for you and your bots.');drawPage()},
  toc(b){const h=$('br-doc').querySelector('#'+b.dataset.id),v=$('br-view');if(h)v.scrollTop+=h.getBoundingClientRect().top-v.getBoundingClientRect().top-20},
  sug(b){const a=info(cur()).acts[+b.dataset.i];if(a)askClaude(a[0],a[1])},
  'ask-send'(){const a=$('br-ask');if(!a||!a.value.trim()){CW.toast('Type a question about this page first.');return}const q=a.value;askDraft='';a.value='';askClaude(q);a.focus()},
  'ask-q'(b){askClaude(b.dataset.q)},
  'open-vault'(){CW.go('settings','vault')},
  dd(b){pickDd(+b.dataset.i)}
};

function bind(){
  el.addEventListener('click',e=>{
    if(pop&&!e.target.closest('.br-pop')&&!e.target.closest('[data-pop]')){pop=null;drawPop();const d=el.querySelector('.br-tog[data-pop="dl"]');if(d)d.setAttribute('aria-pressed','false')}
    if(e.target.hasAttribute&&e.target.hasAttribute('data-scrim')){ACT['sheet-x']();return}
    const b=e.target.closest('[data-a]'),t=cur();
    if(e.target.closest('#br-view')&&driven(t)&&(!b||b.closest('#br-doc'))){CW.toast(CW.bot(t.owner).name+' is driving this tab. Take over to click the page.');return}
    if(!b||b.disabled)return;
    const f=ACT[b.dataset.a];if(f)f(b,e);
  });
  el.addEventListener('contextmenu',e=>{const tb=e.target.closest('[data-tab]');if(tb){e.preventDefault();tabMenu(tb,tb.dataset.tab)}});
  el.addEventListener('mousedown',e=>{if(e.target.closest('#br-dd'))e.preventDefault()});
  el.addEventListener('focusin',e=>{if(e.target.id==='br-url'){const i=e.target;dd.open=true;dd.idx=-1;dd.touched=false;if(pop){pop=null;drawPop()}drawDd();setTimeout(()=>{if(document.activeElement===i)i.select()},0)}});
  el.addEventListener('focusout',e=>{if(e.target.id==='br-url')setTimeout(()=>{if(el&&document.activeElement!==$('br-url')){dd.open=false;drawDd()}},120)});
  el.addEventListener('input',e=>{const x=e.target;
    if(x.id==='br-url'){dd.open=true;dd.touched=true;dd.idx=-1;drawDd()}
    else if(x.id==='br-inv-q'){st.invQ=x.value;$('br-inv-body').innerHTML=invRows()}
    else if(x.id==='br-hist-q'){st.histQ=x.value;$('br-hist-list').innerHTML=histRows()}
    else if(x.id==='br-ask')askDraft=x.value});
  el.addEventListener('change',e=>{const x=e.target;
    if(x.id==='br-inv-s'){st.invStatus=x.value;$('br-inv-body').innerHTML=invRows()}
    else if(x.dataset.perm){permsFor(hostOf(url(cur())))[x.dataset.perm]=x.checked;CW.toast('Permission '+(x.checked?'allowed':'blocked')+' for '+site(url(cur())).name+'.')}});
  el.addEventListener('keydown',e=>{const x=e.target;
    if(x.id==='br-url'){
      if(e.key==='Enter'){e.preventDefault();if(dd.open&&dd.idx>=0)pickDd(dd.idx);else{x.blur();submitAddr(x.value)}}
      else if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();if(!dd.open){dd.open=true;dd.idx=-1}const n=dd.items.length||1;dd.idx=e.key==='ArrowDown'?(dd.idx+1)%n:(dd.idx<=0?n-1:dd.idx-1);drawDd()}
    }else if(x.id==='br-nt-q'&&e.key==='Enter'){e.preventDefault();submitAddr(x.value)}
    else if(x.id==='br-docs-q'&&e.key==='Enter'){e.preventDefault();if(x.value.trim())nav(cur(),'claude://search?q='+encodeURIComponent(x.value.trim()));else CW.toast('Type something to search the docs for.')}
    else if(x.id==='br-ask'&&e.key==='Enter'&&!e.shiftKey){e.preventDefault();ACT['ask-send']()}
    else if((x.id==='br-si-email'||x.id==='br-si-pass')&&e.key==='Enter'){e.preventDefault();ACT.signin()}});
  $('br-view').addEventListener('scroll',()=>{cur().scroll=$('br-view').scrollTop},{passive:true});
}
document.addEventListener('keydown',e=>{
  if(e.key!=='Escape'||CW.mode!=='browser'||!el||!el.isConnected)return;
  if(sheet){ACT['sheet-x']();return}
  if(pop){togglePop(pop);return}
  const i=$('br-url');if(dd.open||document.activeElement===i){dd.open=false;drawDd();drawBar()}
});
window.addEventListener('resize',()=>{if(CW.mode==='browser'&&el&&el.isConnected){placeCursor();if(pop)drawPop()}});
CW.on('approvals',()=>{if(CW.mode==='browser'&&el&&el.isConnected){drawSess();drawPage();drawPanelBody()}});

function drawAll(){drawTabs();drawBar();drawBm();drawSess();drawPage();drawPanel();drawPop();drawSheet()}
function render(root,sub){
  el=document.createElement('div');el.className='br';pop=null;sheet=null;dd.open=false;
  el.innerHTML=`<div class="br-strip" id="br-strip" aria-label="Tabs"></div><div class="br-bar" id="br-bar" role="toolbar" aria-label="Browser toolbar"></div><div class="br-load" id="br-load"><i></i></div>
    <div id="br-bm" class="br-bm" aria-label="Bookmarks"></div><div id="br-sess" hidden></div>
    <div class="br-stage"><div class="br-wrap"><div class="br-view" id="br-view" tabindex="-1"><div class="br-doc" id="br-doc"></div>
      <div class="br-cursor" id="br-cursor" hidden aria-hidden="true"><i></i><svg width="18" height="18" viewBox="0 0 24 24"><path d="M4 3l15 8.500-6.500 1.500L10 19.500z"/></svg><b></b></div></div>
      <div class="br-frame" id="br-frame" hidden></div><div id="br-sheet"></div></div><aside class="br-panel" id="br-panel" aria-label="Claude side panel" hidden></aside></div>`;
  root.appendChild(el);bind();
  if(sub){const t=tabs.find(x=>x.owner===sub);if(t){activeId=t.id;const g=groups.find(x=>x.id===t.group);if(g)g.collapsed=false}}
  if(st.vault==='fill')st.vault='ask';
  drawAll();
  if(!timer)timer=setInterval(tick,2600);
}
CW.register('browser',{render});
})();
