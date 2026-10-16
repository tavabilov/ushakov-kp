const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)');
function changeEntrance(panel){
 if(reduceMotion.matches||!panel.animate)return;
 panel.getAnimations().forEach(a=>a.cancel());
 panel.animate([{opacity:.4,transform:'translateY(18px)'},{opacity:1,transform:'none'}],{duration:520,easing:'cubic-bezier(.16,1,.3,1)'});
 const image=panel.querySelector('.proof-photo,.content-photo');
 image?.animate([{clipPath:'inset(0 16% 0 0)'},{clipPath:'inset(0)'}],{duration:800,easing:'cubic-bezier(.16,1,.3,1)'});
}
document.querySelectorAll('[data-exhibit]').forEach(group=>{
 const bar=group.querySelector('.exhibit-tabs'),buttons=[...bar.children],panels=[...group.querySelectorAll(':scope > .exhibit-panel')];
 bar.setAttribute('role','tablist');
 const labels={radius:'Конкуренты по расстоянию',benchmark:'Решения конкурентов',rubric:'Виды контента',workcycle:'Этапы работы'};
 bar.setAttribute('aria-label',labels[buttons[0].dataset.tab.replace(/-\d+$/,'')]||'Варианты');
 function select(button,animate=true){
  buttons.forEach(b=>{const active=b===button;b.setAttribute('aria-selected',String(active));b.tabIndex=active?0:-1;});
  panels.forEach(panel=>panel.hidden=panel.id!==button.dataset.tab);
  if(animate)changeEntrance(document.getElementById(button.dataset.tab));
 }
 buttons.forEach((button,i)=>{
  button.setAttribute('role','tab');button.setAttribute('aria-controls',button.dataset.tab);
  const panel=document.getElementById(button.dataset.tab);panel.setAttribute('role','tabpanel');panel.setAttribute('aria-labelledby',button.id);panel.tabIndex=0;
  button.addEventListener('click',()=>select(button));
  button.addEventListener('keydown',event=>{let j;if(event.key==='ArrowRight')j=(i+1)%buttons.length;if(event.key==='ArrowLeft')j=(i+buttons.length-1)%buttons.length;if(event.key==='Home')j=0;if(event.key==='End')j=buttons.length-1;if(j!==undefined){event.preventDefault();select(buttons[j]);buttons[j].focus();}});
 });select(buttons[0],false);
});
let tick=false;const reflectHeader=()=>{document.querySelector('header')?.setAttribute('data-scrolled',String(scrollY>8));tick=false;};
window.addEventListener('scroll',()=>{if(!tick){tick=true;requestAnimationFrame(reflectHeader);}},{passive:true});reflectHeader();
const entered=new WeakSet();
const observer=new IntersectionObserver(entries=>entries.forEach(({target,isIntersecting})=>{
 if(isIntersecting&&!entered.has(target)){
  entered.add(target);if(reduceMotion.matches)return;
  const image=target.querySelector('.editor-photo,.clinic-strip,.content-photo,.proof-photo');
  image?.animate([{clipPath:'inset(0 22% 0 0)',opacity:.5},{clipPath:'inset(0)',opacity:1}],{duration:1000,easing:'cubic-bezier(.16,1,.3,1)'});
 }else if(!isIntersecting)entered.delete(target);
}),{threshold:.18});
document.querySelectorAll('.talk-section').forEach(section=>observer.observe(section));
reduceMotion.addEventListener('change',event=>{if(event.matches)document.getAnimations().forEach(a=>a.cancel());});
// Cover choreography follows the approved reference without hiding content by default.
function enterCover(){
 if(reduceMotion.matches)return;
 const cover=document.querySelector('.hero');
 cover?.querySelector('figure')?.animate([{clipPath:'inset(0 22% 0 0)',opacity:.45},{clipPath:'inset(0)',opacity:1}],{duration:1050,easing:'cubic-bezier(.16,1,.3,1)'});
 cover?.querySelector('.hero-copy')?.animate([{transform:'translateY(26px)',opacity:.4},{transform:'none',opacity:1}],{duration:850,easing:'cubic-bezier(.16,1,.3,1)'});
}
if(document.readyState==='complete')enterCover();else window.addEventListener('load',enterCover,{once:true});
