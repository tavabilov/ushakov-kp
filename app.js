document.querySelectorAll('.print').forEach(b=>b.addEventListener('click',()=>window.print()));
let beforePrint;
window.addEventListener('beforeprint',()=>{beforePrint=[...document.querySelectorAll('details')].map(x=>[x,x.open]);beforePrint.forEach(([x])=>x.open=true);});
window.addEventListener('afterprint',()=>beforePrint?.forEach(([x,open])=>x.open=open));
