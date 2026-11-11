(function(){
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  var sec = document.getElementById('proceso'), pv = document.getElementById('pv'), pfill = document.getElementById('pfill');
  if(!sec || !pv || !pfill) return;
  var steps = [].slice.call(sec.querySelectorAll('.pstep')) as HTMLElement[], nodes = [].slice.call(sec.querySelectorAll('.pn')) as HTMLElement[];
  var POS = [0, 1/3, 2/3, 1], extra = 0, hh = 70, cur = 0;
  function setStage(n: number){
    if(n === cur) return; cur = n;
    pv!.dataset.stage = String(n);
    steps.forEach(function(s,i){ s.classList.toggle('on', i+1 === n); s.classList.toggle('past', i+1 < n); });
    nodes.forEach(function(d,i){ d.classList.toggle('on', i+1 <= n); d.classList.toggle('cur', i+1 === n); });
  }
  function layout(){
    hh = document.getElementById('top')!.offsetHeight;
    sec!.style.setProperty('--hh', hh + 'px');
    extra = Math.round(innerHeight * 1.8);
    sec!.classList.add('pinned');
    sec!.style.height = (innerHeight - hh + extra) + 'px';
  }
  function prog(){
    var r = sec!.getBoundingClientRect();
    return Math.max(0, Math.min(1, (hh - r.top) / extra));
  }
  var ticking = false;
  function upd(){
    ticking = false;
    var raw = prog(), p = Math.max(0, Math.min(1, (raw - 0.04) / 0.84));
    pfill!.style.setProperty('--p', p.toFixed(4));
    var n = 1; POS.forEach(function(v,i){ if(p >= v - 0.002) n = i+1; });
    setStage(n);
  }
  nodes.forEach(function(d,i){
    d.addEventListener('click', function(){
      var top = sec!.getBoundingClientRect().top + scrollY - hh + (0.04 + POS[i] * 0.84) * extra + 4;
      window.scrollTo({top: top, behavior: reduce ? 'auto' : 'smooth'});
    });
  });
  setStage(1); layout(); upd();
  addEventListener('scroll', function(){ if(!ticking){ ticking = true; requestAnimationFrame(upd); } }, {passive:true});
  addEventListener('resize', function(){ layout(); upd(); });
})();
