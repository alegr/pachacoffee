(function(){
  var vc = document.getElementById('vcursor'), vx = 0, vy = 0, tx = 0, ty = 0, vraf: number | null = null, overCard: HTMLElement | null = null;
  if(!vc) return;
  function vtext(){ vc!.textContent = overCard && overCard.classList.contains('flip') ? 'Hac\u00e9 click para volver' : 'Hac\u00e9 click para ver'; }
  function vloop(){ vx += (tx - vx) * .45; vy += (ty - vy) * .45; vc!.style.transform = 'translate(' + (vx + 16).toFixed(1) + 'px,' + (vy + 18).toFixed(1) + 'px)';
    if(Math.abs(tx-vx) > .3 || Math.abs(ty-vy) > .3) vraf = requestAnimationFrame(vloop); else vraf = null; }
  document.querySelectorAll('.vcard').forEach(function(c){
    c.addEventListener('click', function(){ var f = c.classList.toggle('flip'); c.setAttribute('aria-pressed', String(f)); vtext(); });
    c.addEventListener('mouseenter', function(e: Event){ overCard = c as HTMLElement; vtext(); if(!vc!.classList.contains('show')){ vx = tx = (e as MouseEvent).clientX; vy = ty = (e as MouseEvent).clientY; vc!.style.transform = 'translate(' + (vx+16) + 'px,' + (vy+18) + 'px)'; } vc!.classList.add('show'); });
    c.addEventListener('mouseleave', function(){ overCard = null; vc!.classList.remove('show'); });
    c.addEventListener('mousemove', function(e: Event){ tx = (e as MouseEvent).clientX; ty = (e as MouseEvent).clientY; if(!vraf) vraf = requestAnimationFrame(vloop); });
  });
})();
