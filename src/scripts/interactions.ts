(function(){
  var reduce = (window as any).__pacha_reduce !== undefined ? (window as any).__pacha_reduce : (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  var watchCounts: ((scope: HTMLElement | null) => void) = (window as any).__pacha_watchCounts || function(){};

  /* Header sombra */
  var top = document.getElementById('top');
  function onScroll(){ top!.classList.toggle('scrolled', window.scrollY > 8); }
  addEventListener('scroll', onScroll, {passive:true}); onScroll();

  /* Linea de tiempo: se completa con el scroll */
  var tl2 = document.getElementById('tl2');
  if(tl2){
    var tfill = document.getElementById('tlFill'), hitos = [].slice.call(tl2.querySelectorAll('.hito2')) as HTMLElement[];
    var countYears = function(h: HTMLElement){
      if(!h.dataset.from || h.dataset.done) return; h.dataset.done = '1';
      var a = h.querySelector('.a') as HTMLElement, bb = h.querySelector('.b') as HTMLElement, f = +h.dataset.from, t = +(h.dataset.to || 0), t0: number | null = null;
      var st = function(ts: number){ if(!t0) t0 = ts; var k = Math.min(1,(ts-t0)/700), e = 1-Math.pow(1-k,3);
        a.textContent = String(Math.round(f-40+40*e)); bb.textContent = String(Math.round(t-40+40*e)); if(k<1) requestAnimationFrame(st); };
      requestAnimationFrame(st);
    };
    if(reduce || !('requestAnimationFrame' in window)){ hitos.forEach(function(h){ h.classList.add('on'); }); }
    else {
      tl2.classList.add('armed');
      var hsec = document.getElementById('historia')!, pin = hsec.querySelector('.hist-pin') as HTMLElement, pinTop = 70, extra = 0;
      var ticking = false;
      var upd = function(){
        ticking = false;
        var r = tl2!.getBoundingClientRect(), vh = innerHeight, vert = innerWidth <= 700, p: number;
        if(!vert){ var sr = hsec.getBoundingClientRect(); p = (pinTop - sr.top - extra*0.08)/(extra*0.84); }
        else { p = (vh*0.62 - r.top)/r.height; }
        p = Math.max(0, Math.min(1, p));
        tfill!.style.setProperty('--p', p.toFixed(4));
        hitos.forEach(function(h){
          var d = h.querySelector('.dot')!.getBoundingClientRect(), on: boolean;
          if(!vert){ on = (d.left + d.width/2 - r.left) <= p * r.width + 1; }
          else { on = (d.top + d.height/2 - r.top) <= p * r.height + 1; }
          if(on && !h.classList.contains('on')){ h.classList.add('on'); countYears(h); }
          else if(!on && h.classList.contains('on')){ h.classList.remove('on'); }
        });
      };
      var layout = function(){
        if(innerWidth <= 700){ hsec.classList.remove('pinned'); hsec.style.height = ''; return; }
        var vh = innerHeight, ph = pin.offsetHeight, hh = document.getElementById('top')!.offsetHeight;
        extra = Math.round(vh * 0.8);
        pinTop = Math.max(hh, Math.round((vh - ph)/2 + hh/2));
        hsec.style.setProperty('--pintop', pinTop + 'px');
        hsec.style.height = (ph + extra) + 'px';
        hsec.classList.add('pinned');
      };
      var req = function(){ if(!ticking){ ticking = true; requestAnimationFrame(upd); } };
      layout();
      addEventListener('scroll', req, {passive:true}); addEventListener('resize', function(){ layout(); req(); }); upd();
    }
  }

  /* Por que ahora?: la explicacion se escribe en el espacio reservado */
  document.querySelectorAll('.wcard').forEach(function(card){
    var ghost = card.querySelector('.ghost') as HTMLElement, out = card.querySelector('.typed') as HTMLElement, full = ghost.textContent || '', timer: ReturnType<typeof setInterval> | null = null;
    var measure = function(){ (card as HTMLElement).style.setProperty('--eh', ((card.querySelector('.wexp') as HTMLElement).offsetHeight + 12) + 'px'); (card as HTMLElement).style.setProperty('--bh', ((card.querySelector('.wbody') as HTMLElement).offsetHeight) + 'px'); };
    measure(); addEventListener('resize', measure); if(document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
    function start(){
      clearInterval(timer!);
      if(reduce){ out.textContent = full; return; }
      var i = (out.textContent || '').length; out.classList.add('on');
      timer = setInterval(function(){
        i = Math.min(full.length, i + 2); out.textContent = full.slice(0, i);
        if(i >= full.length){ clearInterval(timer!); setTimeout(function(){ out.classList.remove('on'); }, 900); }
      }, 22);
    }
    function stop(){
      clearInterval(timer!); out.classList.remove('on');
      if(reduce){ out.textContent = ''; return; }
      timer = setInterval(function(){
        var t = out.textContent || ''; if(!t.length){ clearInterval(timer!); return; }
        out.textContent = t.slice(0, Math.max(0, t.length - 6));
      }, 12);
    }
    card.addEventListener('mouseenter', start); card.addEventListener('focus', start);
    card.addEventListener('mouseleave', stop); card.addEventListener('blur', stop);
  });

  /* Pestanas Comunidad / Propuesta */
  var sw = document.getElementById('sw');
  if(sw){
    var tabs = [].slice.call(sw.querySelectorAll('[role=tab]')) as HTMLElement[];
    var seen: Record<number, boolean> = {0:true};
    function selectTab(i: number, focus?: boolean){
      sw!.dataset.on = String(i);
      tabs.forEach(function(t,j){ var on = j===i; t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1; var p = document.getElementById('panel-'+j)!; (p as HTMLElement).hidden = !on; if(on){ p.classList.remove('enter'); void (p as HTMLElement).offsetWidth; p.classList.add('enter'); } });
      if(focus) tabs[i].focus();
      if(!seen[i]){ seen[i] = true; var p = document.getElementById('panel-'+i)!; p.querySelectorAll('.stagger').forEach(function(s){ s.classList.add('in'); }); watchCounts(p as HTMLElement);
        var sp = document.getElementById('split65'); if(sp && i===1 && !reduce){ sp.classList.add('armed'); requestAnimationFrame(function(){ requestAnimationFrame(function(){ sp.classList.remove('armed'); }); }); } }
    }
    tabs.forEach(function(t,i){
      t.addEventListener('click', function(){ selectTab(i); });
      t.addEventListener('keydown', function(e: KeyboardEvent){ if(e.key==='ArrowRight'||e.key==='ArrowLeft'){ e.preventDefault(); selectTab(i===0?1:0, true); } });
    });
  }

  /* Card de WhatsApp: inclinacion suave que sigue al mouse */
  (function(){
    var wrap = document.getElementById('tilt'), card = document.getElementById('waCard');
    if(!wrap || reduce || !(window.matchMedia && matchMedia('(hover:hover) and (pointer:fine)').matches)) return;
    var rx = 0, ry = 0, trx = 0, try_ = 0, raf: number | null = null;
    function loop(){
      rx += (trx - rx) * .12; ry += (try_ - ry) * .12;
      card!.style.setProperty('--rx', rx.toFixed(2) + 'deg'); card!.style.setProperty('--ry', ry.toFixed(2) + 'deg');
      if(Math.abs(trx - rx) > .02 || Math.abs(try_ - ry) > .02) raf = requestAnimationFrame(loop); else raf = null;
    }
    function kick(){ if(!raf) raf = requestAnimationFrame(loop); }
    wrap.addEventListener('pointermove', function(e: PointerEvent){
      var r = card!.getBoundingClientRect(), x = (e.clientX - r.left)/r.width, y = (e.clientY - r.top)/r.height;
      trx = (.5 - y) * 14; try_ = (x - .5) * 16;
      card!.style.setProperty('--gx', (x*100) + '%'); card!.style.setProperty('--gy', (y*100) + '%');
      kick();
    });
    wrap.addEventListener('pointerleave', function(){ trx = 0; try_ = 0; kick(); });
  })();

  /* Menu mobile */
  var mb = document.getElementById('menuBtn'), mn = document.getElementById('mnav');
  if(mb && mn){
    var setMenu = function(open: boolean){ mb!.setAttribute('aria-expanded', String(open)); mb!.setAttribute('aria-label', open ? 'Cerrar men\u00fa' : 'Abrir men\u00fa'); (mn as HTMLElement).hidden = !open; };
    mb.addEventListener('click', function(){ setMenu(mb!.getAttribute('aria-expanded') !== 'true'); });
    mn.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', function(){ setMenu(false); }); });
    addEventListener('resize', function(){ if(innerWidth > 860) setMenu(false); });
  }

  /* Card Comunidad: ancho de la foto 3:4 segun el alto de la card */
  (function(){ var c = document.querySelector('.bx--tostado') as HTMLElement | null, f = c && c.querySelector('.bxph'); if(!c || !f) return;
    var fit = function(){ if(innerWidth <= 820){ c!.style.removeProperty('--phw'); return; }
      var l = c!.querySelector('.bxl') as HTMLElement, w = 0; for(var k = 0; k < 6; k++){ c!.style.setProperty('--phw', w + 'px'); var nw = Math.round(l.offsetHeight*0.75); if(Math.abs(nw - w) < 2) break; w = nw; } c!.style.setProperty('--phw', Math.round(l.offsetHeight*0.75) + 'px'); };
    fit(); addEventListener('resize', fit); if(document.fonts && document.fonts.ready) document.fonts.ready.then(fit); })();

  /* Copiar numero */
  var cb = document.getElementById('copyBtn');
  if(cb){
    cb.addEventListener('click', function(){
      var txt = '+5493513515559';
      function done(){ cb!.textContent = 'Copiado'; cb!.classList.add('ok'); setTimeout(function(){ cb!.textContent='Copiar n\u00famero'; cb!.classList.remove('ok'); }, 1800); }
      function sel(){ var r = document.createRange(); r.selectNodeContents(document.getElementById('tel')!); var s = getSelection()!; s.removeAllRanges(); s.addRange(r); cb!.textContent = 'Seleccionado: copialo'; }
      try{ navigator.clipboard.writeText(txt).then(done, sel); }catch(e){ sel(); }
    });
  }
})();
