(function(){
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var io = ('IntersectionObserver' in window) && !reduce;

  /* Entradas: solo se arman fuera de pantalla, asi la pagina queda completa en reposo */
  function arm(el: Element, cls?: string, cb?: (el: Element) => void){
    if(!io) return;
    var r = el.getBoundingClientRect();
    if(r.top < innerHeight * 0.92) return; // ya visible: no se anima
    if(cls) el.classList.add(cls);
    var o = new IntersectionObserver(function(es){
      es.forEach(function(e){
        if(e.isIntersecting){ el.classList.add('in'); if(cls) el.classList.remove(cls); cb && cb(el); o.disconnect(); }
      });
    }, {rootMargin:'0px 0px -12% 0px'});
    o.observe(el);
  }
  document.querySelectorAll('.reveal').forEach(function(el){
    if(!io) return;
    var r = el.getBoundingClientRect();
    if(r.top < innerHeight * 0.92) return;
    el.classList.add('armed');
    var o = new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ el.classList.add('in'); el.classList.remove('armed'); o.disconnect(); } }); }, {rootMargin:'0px 0px -10% 0px'});
    o.observe(el);
  });
  document.querySelectorAll('.stagger').forEach(function(el){
    if(!io) return;
    var r = el.getBoundingClientRect();
    if(r.top < innerHeight * 0.92) return;
    var o = new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ el.classList.add('in'); o.disconnect(); } }); }, {rootMargin:'0px 0px 8% 0px'});
    o.observe(el);
  });
  (function(){ var nh = document.querySelector('.neg-head'); if(nh && io && nh.getBoundingClientRect().top > innerHeight*0.9){ nh.classList.add('armed'); var o = new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ setTimeout(function(){ nh.classList.remove('armed'); }, 350); o.disconnect(); } }); }, {rootMargin:'0px 0px -15% 0px'}); o.observe(nh); } })();
  ['tl','contacto'].forEach(function(id){
    var el = document.getElementById(id); if(!el || !io) return;
    var r = el.getBoundingClientRect(); if(r.top < innerHeight * 0.9) return;
    el.classList.add('armed');
    var o = new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ el.classList.add('in'); requestAnimationFrame(function(){ el.classList.remove('armed'); }); o.disconnect(); } }); }, {rootMargin:'0px 0px -15% 0px'});
    o.observe(el);
  });

  /* Granos interactivos del inicio */
  var hc = document.querySelector('.hero .cherries') as HTMLElement | null;
  if(hc){
    var goLive = function(){ hc!.classList.add('live'); var pl = hc!.closest('.plant'); if(pl) pl.classList.add('grown'); };
    if(reduce) goLive(); else setTimeout(goLive, 2500);
    hc.querySelectorAll('.cherry').forEach(function(c){
      c.addEventListener('click', function(){ c.classList.add('tap'); setTimeout(function(){ c.classList.remove('tap'); }, 450); });
    });
  }
  /* Sello "Somos Pacha Coffee" */
  var se = document.getElementById('sello');
  if(se){
    se.addEventListener('animationend', function(e: AnimationEvent){ if(e.target===se) se!.style.animation='none'; });
    se.addEventListener('click', function(){
      se!.classList.remove('inked'); se!.style.animation='none'; void (se as HTMLElement).offsetWidth;
      if(!reduce) se!.style.animation='stamp .55s cubic-bezier(.3,1.6,.5,1)';
      se!.classList.add('inked');
    });
  }

  /* Cajas: brillo que sigue al cursor */
  var fine = window.matchMedia && matchMedia('(hover:hover) and (pointer:fine)').matches;
  document.querySelectorAll('[data-tilt]').forEach(function(el){
    (el as HTMLElement).addEventListener('pointermove', function(e: PointerEvent){
      var r = el.getBoundingClientRect(), x = (e.clientX - r.left)/r.width, y = (e.clientY - r.top)/r.height;
      (el as HTMLElement).style.setProperty('--mx', (x*100)+'%'); (el as HTMLElement).style.setProperty('--my', (y*100)+'%');
    });
  });

  /* Contadores */
  function fmt(n: number){ return n.toLocaleString('es-AR'); }
  function countUp(el: HTMLElement){
    var target = +(el.dataset.count || 0), small = el.querySelector('small'), smallHTML = small ? small.outerHTML : '';
    if(reduce){ return; }
    var t0: number | null = null, dur = target > 1000 ? 1600 : 900;
    function step(t: number){ if(!t0) t0 = t; var p = Math.min(1,(t-t0)/dur), e = 1 - Math.pow(1-p,3);
      el.innerHTML = fmt(Math.round(target*e)) + smallHTML; if(p<1) requestAnimationFrame(step); }
    requestAnimationFrame(step);
  }
  function watchCounts(scope: HTMLElement | null){
    if(!scope) return;
    scope.querySelectorAll('[data-count]').forEach(function(el){
      if(!io){ return; }
      var o = new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ countUp(el as HTMLElement); o.disconnect(); } }); }, {threshold:.6});
      o.observe(el);
    });
  }
  watchCounts(document.getElementById('panel-0'));

  /* Export for use in interactions.ts tab switching */
  (window as any).__pacha_watchCounts = watchCounts;
  (window as any).__pacha_reduce = reduce;
})();
