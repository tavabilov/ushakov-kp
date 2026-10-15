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

