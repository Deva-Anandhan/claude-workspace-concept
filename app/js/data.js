/* Shared, cross-surface example data. Everything here is invented. Views own their surface-specific data. */
window.CWDATA={
  me:{name:'Asha Raman',first:'Asha',initials:'AR',role:'RevOps manager',email:'asha@larkfield.example'},
  company:{name:'Larkfield',size:400,plan:'Team'},
  people:[
    {name:'Priya Nair',team:'Sales',initials:'PN'},{name:'Dana Whitlock',team:'VP Sales',initials:'DW'},{name:'Omar Haddad',team:'Sales Ops',initials:'OH'},
    {name:'Marcus Bell',team:'Finance',initials:'MB'},{name:'Lena Fischer',team:'People team',initials:'LF'},{name:'Sam Okafor',team:'Product',initials:'SO'}
  ],
  /* status: run | wait (needs approval) | idle | done | sched */
  bots:[
    {id:'revops-bot',name:'RevOps bot',team:'Revenue operations',owner:'Asha Raman',status:'wait',task:'Fix the Halden Dental contract tier',access:['CRM','Contract tool'],scope:'deals:write, contracts:write',limit:0,mode:'Ask before changes',schedule:'On request',doneToday:9},
    {id:'analyst-bot',name:'Analyst bot',team:'Revenue operations',owner:'Dana Whitlock',status:'run',task:'Build the Q3 pipeline review deck',access:['CRM (read)','Slides'],scope:'pipeline:read, slides:write',limit:0,mode:'Auto',schedule:'On request, plus Mondays 08:00',doneToday:4},
    {id:'automation-bot',name:'Automation bot',team:'Revenue operations',owner:'Omar Haddad',status:'wait',task:'Route new leads by region',access:['CRM workflows'],scope:'workflows:write',limit:0,mode:'Ask before changes',schedule:'On request',doneToday:2},
    {id:'procurement-bot',name:'Procurement bot',team:'Finance',owner:'Marcus Bell',status:'done',task:'Renew the analytics subscription',access:['Vendor portals','Wallet'],scope:'billing:write, pay:spend',limit:5000,mode:'Ask above limits',schedule:'Daily 07:00 renewal check',doneToday:3},
    {id:'it-bot',name:'IT bot',team:'People and IT',owner:'Lena Fischer',status:'wait',task:'Set up Jo for Monday',access:['Identity','6 work apps','Wallet'],scope:'users:create, roles:assign, pay:spend',limit:1000,mode:'Ask above limits',schedule:'On request',doneToday:5},
    {id:'planner-bot',name:'Planner bot',team:'Product and engineering',owner:'Sam Okafor',status:'done',task:'Spec: CSV export on invoices',access:['Issue tracker','Docs'],scope:'issues:write, docs:write',limit:0,mode:'Auto',schedule:'On request',doneToday:2},
    {id:'builder-bot',name:'Builder bot',team:'Product and engineering',owner:'Sam Okafor',status:'wait',task:'Ship CSV export on invoices',access:['Code repository','Staging'],scope:'code:write, deploy:request',limit:0,mode:'Ask before changes',schedule:'On request',doneToday:1},
    {id:'qa-bot',name:'QA bot',team:'Product and engineering',owner:'Sam Okafor',status:'idle',task:'',access:['Staging','Browser'],scope:'tests:run',limit:0,mode:'Auto',schedule:'After every build',doneToday:6}
  ],
  /* Approvals are shown by the shell's bell and inline by the surface that owns them. status: pending | approved | declined */
  approvals:[
    {id:'ap-discount',status:'pending',bot:'revops-bot',asker:'Priya Nair, Sales',title:'12% discount on the Halden Dental contract',reason:'Discount above the 10% policy',after:'Update the opportunity, regenerate the contract and reply to Priya.',mode:'chat',sub:'halden'},
    {id:'ap-routing',status:'pending',bot:'automation-bot',asker:'Omar Haddad, Sales Ops',title:'Turn on lead routing in the live CRM',reason:'Change to a live system',after:'Enable the workflow. New leads reach the right rep within a minute.',mode:'bots',sub:'automation-bot'},
    {id:'ap-laptop',status:'pending',bot:'it-bot',asker:'Lena Fischer, People team',title:'Laptop for a new hire, $1,400.00',reason:'Purchase above the $1,000 limit',after:'Order for delivery on Friday and pay from the wallet.',mode:'bots',sub:'it-bot',amount:1400},
    {id:'ap-release',status:'pending',bot:'builder-bot',asker:'Sam Okafor, Product',title:'Release CSV export to production',reason:'Production release',after:'Deploy, update the help article and tell the 14 customers who asked.',mode:'bots',sub:'builder-bot'}
  ]
};
