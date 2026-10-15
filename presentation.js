const scenes=[...document.querySelectorAll('.scene')];
const motionPreference=matchMedia('(prefers-reduced-motion: reduce)');
function animatePart(el,photo=false){
 if(motionPreference.matches||!el?.animate)return;
 el.getAnimations().forEach(a=>a.cancel());
 el.animate(photo?[{clipPath:'inset(0 24% 0 0)',opacity:.5},{clipPath:'inset(0)',opacity:1}]:[{transform:'translateY(30px)',opacity:.25},{transform:'none',opacity:1}],{duration:photo?900:650,easing:'cubic-bezier(.16,1,.3,1)'});
}
scenes.forEach((scene,index)=>{
 const points=[...scene.querySelectorAll(':scope > .scene-inner > .scene-copy > .spoken-points > li')];
 points.forEach((p,i)=>p.hidden=i>0);
 const reveal=scene.querySelector('.reveal-next');
 const next=scene.querySelector('.next-scene');
 const nextScene=scenes[index+1];
 if(nextScene){next.href='#'+nextScene.id;next.textContent='Продолжить';}
 else{next.href='#main';next.textContent='К началу';}
 function update(){const count=points.filter(p=>!p.hidden).length;reveal.hidden=count===points.length;reveal.textContent=`Следующий тезис (${count}/${points.length})`;}
 reveal.addEventListener('click',()=>{const p=points.find(p=>p.hidden);if(p){p.hidden=false;animatePart(p);}update();if(reveal.hidden)next.focus({preventScroll:true});});update();
 scene.addEventListener('keydown',event=>{
  if(event.target.closest('details,button,a,input,select,textarea'))return;
  if(event.key==='ArrowRight'){event.preventDefault();if(!reveal.hidden)reveal.click();else next.click();}
 });
});
let headerTick=false;
window.addEventListener('scroll',()=>{if(headerTick)return;headerTick=true;requestAnimationFrame(()=>{document.querySelector('header')?.setAttribute('data-scrolled',String(scrollY>8));headerTick=false;});},{passive:true});
const observed=new WeakSet();
const observer=new IntersectionObserver(entries=>entries.forEach(({target,isIntersecting})=>{
 if(isIntersecting&&!observed.has(target)){observed.add(target);animatePart(target.querySelector('.scene-copy'));animatePart(target.querySelector('.scene-photo,.scene-proof'),true);}
 else if(!isIntersecting)observed.delete(target);
}),{threshold:.2});
scenes.forEach(x=>observer.observe(x));
motionPreference.addEventListener('change',e=>{if(e.matches)document.getAnimations().forEach(a=>a.cancel());});
let pointPrintState;
window.addEventListener('beforeprint',()=>{pointPrintState=[...document.querySelectorAll('.spoken-points li')].map(x=>[x,x.hidden]);pointPrintState.forEach(([x])=>x.hidden=false);});
window.addEventListener('afterprint',()=>pointPrintState?.forEach(([x,h])=>x.hidden=h));
