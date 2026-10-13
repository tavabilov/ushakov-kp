const phaseButtons = [...document.querySelectorAll('[data-phase]')];
const phases = [...document.querySelectorAll('.phase')];
const phaseBar = document.querySelector('.phase-controls');
phaseBar.setAttribute('role','tablist');
function choosePhase(button) {
  phaseButtons.forEach(item => {
    const selected = item === button;
    item.setAttribute('aria-selected', String(selected));
    item.tabIndex = selected ? 0 : -1;
  });
  phases.forEach(panel => panel.hidden = panel.id !== button.dataset.phase);
}
phaseButtons.forEach((button, index) => {
  button.id = `tab-${index}`;
  button.setAttribute('role','tab');
  button.setAttribute('aria-controls',button.dataset.phase);
  const panel = document.getElementById(button.dataset.phase);
  panel.setAttribute('role','tabpanel');
  panel.setAttribute('aria-labelledby',button.id);
  panel.tabIndex = 0;
  button.addEventListener('click',()=>choosePhase(button));
  button.addEventListener('keydown',event => {
    let next;
    if(event.key==='ArrowRight') next=(index+1)%phaseButtons.length;
    if(event.key==='ArrowLeft') next=(index+phaseButtons.length-1)%phaseButtons.length;
    if(event.key==='Home') next=0;
    if(event.key==='End') next=phaseButtons.length-1;
    if(next !== undefined){event.preventDefault();choosePhase(phaseButtons[next]);phaseButtons[next].focus();}
  });
});
choosePhase(phaseButtons[0]);
const formatPrice = value => `${new Intl.NumberFormat('ru-RU').format(value)} ₽`;
document.querySelectorAll('.select-package').forEach(button => button.addEventListener('click',()=>{
  document.querySelectorAll('.select-package').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
  document.getElementById('selected-name').textContent = button.dataset.name;
  document.getElementById('selected-total').textContent = (button.dataset.minimum ? 'от ' : '') + formatPrice(Number(button.dataset.price));
  document.querySelector('.subtotal>p:last-child').textContent = `${button.dataset.minimum ? 'от ' : ''}${formatPrice(Number(button.dataset.price))} за месяц. Стоимость контента за месяц. Съёмка, монтаж и другие дополнительные работы согласуются отдельно.`;
}));
document.querySelectorAll('.print').forEach(button=>button.addEventListener('click',()=>window.print()));
let detailState;
window.addEventListener('beforeprint',()=>{
  detailState=[...document.querySelectorAll('details')].map(item=>[item,item.open]);
  detailState.forEach(([item])=>item.open=true);
});
window.addEventListener('afterprint',()=>detailState?.forEach(([item,open])=>item.open=open));

// Motion follows the proposal's reading path; content never depends on it.
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const arrivalEase = 'cubic-bezier(.16,1,.3,1)';
let planAnimation;
phaseButtons.forEach(button => button.addEventListener('click', () => {
  planAnimation?.cancel();
  const panel = document.getElementById(button.dataset.phase);
  if (!reduceMotion.matches) planAnimation = panel.animate([
    { opacity: .65, transform: 'translateY(8px)' },
    { opacity: 1, transform: 'translateY(0)' }
  ], { duration: 280, easing: arrivalEase });
}));
function introduceProposal() {
  if (reduceMotion.matches || !Element.prototype.animate) return;
  const title = document.querySelector('.hero h1');
  const portrait = document.querySelector('.hero figure');
  const actions = document.querySelector('.hero .actions');
  title?.animate([{ opacity: .55, transform: 'translateY(16px)' }, { opacity: 1, transform: 'none' }], { duration: 620, easing: arrivalEase });
  portrait?.animate([{ clipPath: 'inset(0 12% 0 0)', opacity: .7 }, { clipPath: 'inset(0 0 0 0)', opacity: 1 }], { duration: 720, easing: arrivalEase });
  actions?.animate([{ opacity: .6 }, { opacity: 1 }], { duration: 450, delay: 120, easing: arrivalEase });
}
if (document.readyState === 'complete') introduceProposal();
else window.addEventListener('load', introduceProposal, { once: true });
const navigationLinks = [...document.querySelectorAll('.nav nav a[href^="#"]')];
const trackedSections = navigationLinks.map(link => document.querySelector(link.hash)).filter(Boolean).sort((a,b) => a.offsetTop-b.offsetTop);
const progressLine = document.querySelector('.reading-progress span');
let readingTick = false;
function reflectReadingPosition() {
  document.querySelector("header")?.setAttribute("data-scrolled",String(scrollY>8));
  const available = document.documentElement.scrollHeight - innerHeight;
  if (progressLine) progressLine.style.transform = `scaleX(${available > 0 ? Math.min(1, Math.max(0, scrollY / available)) : 1})`;
  let active;
  trackedSections.forEach(section => { if (section.getBoundingClientRect().top <= innerHeight * .35) active = section.id; });
  navigationLinks.forEach(link => { if (link.hash === '#' + active) link.setAttribute('aria-current', 'true'); else link.removeAttribute('aria-current'); });
  readingTick = false;
}
window.addEventListener('scroll', () => { if (!readingTick) { readingTick = true; requestAnimationFrame(reflectReadingPosition); } }, { passive: true });
window.addEventListener('resize', reflectReadingPosition);
reflectReadingPosition();
reduceMotion.addEventListener('change', event => { if (event.matches) document.getAnimations().forEach(animation => animation.cancel()); });

// Presentation choreography: entrances restart after a section has left the viewport.
// No hidden CSS state; headings and controls remain available without animation.
const presentationRuns = new Map();
function runPresentationEntrance(element, kind) {
  if (reduceMotion.matches || !Element.prototype.animate) return;
  presentationRuns.get(element)?.forEach(animation => animation.cancel());
  const runs = [];
  const arrive = (target, frames, duration=950, delay=0) => {
    if (target) runs.push(target.animate(frames, { duration, delay, easing: arrivalEase }));
  };
  if (kind === 'pair') {
    [...element.children].forEach((panel, index) => {
      arrive(panel, [{ opacity:.25, transform:'translateY(64px)' }, { opacity:1, transform:'translateY(0)' }], 1050, index*160);
      arrive(panel.querySelector('img'), [{ transform:'scale(1.1)' }, { transform:'scale(1)' }], 1200, index*160);
    });
  } else if (kind === 'photo') {
    arrive(element, [{ clipPath:'inset(0 28% 0 0)', opacity:.4 }, { clipPath:'inset(0 0 0 0)', opacity:1 }], 1100);
    arrive(element.querySelector('img'), [{ transform:'scale(1.08)' }, { transform:'scale(1)' }], 1300);
  } else if (kind === 'group') {
    [...element.children].forEach((item,index) => arrive(item, [{opacity:.3,transform:'translateY(44px)'},{opacity:1,transform:'translateY(0)'}], 900, Math.min(index*110,330)));
  } else {
    arrive(element, [{ opacity:.3, transform:'translateY(38px)' }, { opacity:1, transform:'translateY(0)' }], 850);
  }
  presentationRuns.set(element,runs);
}
if ('IntersectionObserver' in window) {
  const entrances = new Map();
  document.querySelectorAll('.section-head').forEach(e=>entrances.set(e,'heading'));
  document.querySelectorAll('.content-pair').forEach(e=>entrances.set(e,'pair'));
  document.querySelectorAll('.photo-chapter,.content-selling,.clinic-gallery').forEach(e=>entrances.set(e,'photo'));
  document.querySelectorAll('.work-list,.price-grid').forEach(e=>entrances.set(e,'group'));
  const entered = new WeakSet();
  const presentationObserver = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if (entry.intersectionRatio >= .12 && !entered.has(entry.target)) {
        entered.add(entry.target);
        runPresentationEntrance(entry.target,entrances.get(entry.target));
      } else if (!entry.isIntersecting) {
        const box=entry.target.getBoundingClientRect();
        if (box.bottom<0 || box.top>innerHeight) entered.delete(entry.target);
      }
    });
  }, { threshold: [0,.12] });
  entrances.forEach((kind,element)=>presentationObserver.observe(element));
}
