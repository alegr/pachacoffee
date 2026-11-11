/* Cielo: nubes, estrellas y lluvia generadas */
(function(){
  var cl = document.getElementById('clouds'), st = document.getElementById('stars'), rn = document.getElementById('rain');
  if(!cl) return;
  var CLOUD = '<svg viewBox="0 0 220 110"><path fill="url(#cloudG)" d="M46 98 C 20 98 8 80 14 64 C 19 50 33 44 46 47 C 48 26 66 12 88 14 C 102 15 113 22 119 33 C 127 24 140 20 153 23 C 172 27 184 44 182 62 C 198 64 210 76 208 88 C 207 94 202 98 194 98 Z"/></svg>';
  var C: [string,string,string,number,string,string,number][] = [ // x, y, ancho, opacidad, velocidad, demora, "few" (visibles con poco nublado)
    ['62%','6%','clamp(170px,20vw,300px)',.95,'18s','-4s',1],['18%','-4%','clamp(150px,18vw,260px)',.9,'22s','-9s',1],
    ['-6%','18%','clamp(180px,22vw,330px)',.85,'26s','-2s',0],['38%','14%','clamp(120px,13vw,200px)',.75,'20s','-12s',0],
    ['80%','30%','clamp(150px,17vw,260px)',.85,'24s','-6s',0],['50%','42%','clamp(110px,12vw,180px)',.6,'28s','-15s',0],
    ['4%','52%','clamp(120px,14vw,210px)',.55,'30s','-8s',0],['72%','62%','clamp(120px,13vw,200px)',.5,'26s','-3s',0],
    ['28%','70%','clamp(100px,11vw,170px)',.4,'32s','-18s',0]
  ];
  C.forEach(function(c){ var d = document.createElement('div'); d.className = 'cloud' + (c[6] ? ' few' : '');
    d.style.cssText = '--x:'+c[0]+';--y:'+c[1]+';--w:'+c[2]+';--o:'+c[3]+';--sp:'+c[4]+';--dl:'+c[5]; d.innerHTML = CLOUD; cl!.appendChild(d); });
  for(var i = 0; i < 34; i++){ var s = document.createElement('i'); var z = 1 + Math.random()*2.4;
    s.style.cssText = 'left:'+(Math.random()*100).toFixed(1)+'%;top:'+(Math.random()*100).toFixed(1)+'%;--s:'+z.toFixed(1)+'px;--t:'+(2+Math.random()*3).toFixed(1)+'s;--d:-'+(Math.random()*4).toFixed(1)+'s'; st!.appendChild(s); }
  for(var k = 0; k < 90; k++){ var r = document.createElement('i');
    r.style.cssText = '--x:'+(Math.random()*115).toFixed(1)+'%;--l:'+(14+Math.random()*16).toFixed(0)+'px;--t:'+(.6+Math.random()*.5).toFixed(2)+'s;--d:-'+(Math.random()*1.2).toFixed(2)+'s'; rn!.appendChild(r); }
})();

/* Clima del dia en Misiones (MET Norway, CC BY 4.0) */
(function(){
  var hero = document.querySelector('.hero') as HTMLElement | null, chip = document.getElementById('wxchip');
  if(!hero || !chip) return;
  var tEl = document.getElementById('wxTemp'), xEl = document.getElementById('wxTxt'), iEl = document.getElementById('wxIcon');
  var URL_WX = 'https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=-27.3671&lon=-55.8961';
  var KEY = 'pacha-wx-v1', MAXAGE = 30 * 60 * 1000;
  var ICONS: Record<string, string> = {
    sol:'<svg viewBox="0 0 26 26"><circle cx="13" cy="13" r="6" fill="#E9A23B"/><g stroke="#E9A23B" stroke-width="2.2" stroke-linecap="round"><path d="M13 1.5v3M13 21.5v3M1.5 13h3M21.5 13h3M4.9 4.9l2.1 2.1M19 19l2.1 2.1M4.9 21.1L7 19M19 7l2.1-2.1"/></g></svg>',
    solnube:'<svg viewBox="0 0 26 26"><circle cx="10" cy="10" r="5.5" fill="#E9A23B"/><path d="M9 22h11a4 4 0 0 0 0-8 6 6 0 0 0-11.3 1.6A3.3 3.3 0 0 0 9 22z" fill="#fff" stroke="#C18E60" stroke-width="1.6"/></svg>',
    nubes:'<svg viewBox="0 0 26 26"><path d="M7 21h13a5 5 0 0 0 0-10 7 7 0 0 0-13.3 2A4 4 0 0 0 7 21z" fill="#ECE8DE" stroke="#6B4A33" stroke-width="1.6"/></svg>',
    lluvia:'<svg viewBox="0 0 26 26"><path d="M7 15h13a4.5 4.5 0 0 0 0-9 6.5 6.5 0 0 0-12.4 1.9A3.6 3.6 0 0 0 7 15z" fill="#D9D5CC" stroke="#6B4A33" stroke-width="1.6"/><g stroke="#7FA2B8" stroke-width="2" stroke-linecap="round"><path d="M9 18l-1 4M14 18l-1 4M19 18l-1 4"/></g></svg>',
    tormenta:'<svg viewBox="0 0 26 26"><path d="M7 14h13a4.5 4.5 0 0 0 0-9 6.5 6.5 0 0 0-12.4 1.9A3.6 3.6 0 0 0 7 14z" fill="#BDB8AE" stroke="#4C280F" stroke-width="1.6"/><path d="M14 15l-4 6h3l-2 4 6-7h-3.5l2-3z" fill="#F2C14E"/></svg>',
    luna:'<svg viewBox="0 0 26 26"><path d="M15 3a10 10 0 1 0 8 15A8 8 0 1 1 15 3z" fill="#F2D9AE" stroke="#C18E60" stroke-width="1.4"/></svg>',
    lunanube:'<svg viewBox="0 0 26 26"><path d="M12 3a8 8 0 1 0 6 12A6.5 6.5 0 1 1 12 3z" fill="#F2D9AE" stroke="#C18E60" stroke-width="1.3"/><path d="M10 23h10a3.6 3.6 0 0 0 0-7 5 5 0 0 0-9.6 1.4A2.8 2.8 0 0 0 10 23z" fill="#fff" stroke="#C18E60" stroke-width="1.4"/></svg>'
  };
  function classify(code: string){
    code = code || '';
    var night = /_night$/.test(code), base = code.replace(/_(day|night|polartwilight)$/,'');
    if(/thunder/.test(base)) return {k:'tormenta', t:'Tormenta'};
    if(/rain|sleet|snow/.test(base)) return {k:'lluvia', t: /showers/.test(base) ? 'Chaparrones' : (/light/.test(base) ? 'Lluvia d\u00e9bil' : 'Lluvia')};
    if(base === 'fog') return {k:'nubes', t:'Niebla'};
    if(base === 'cloudy') return {k:'nubes', t:'Nublado'};
    if(base === 'partlycloudy') return {k: night ? 'lunanube' : 'solnube', t:'Parcialmente nublado'};
    if(base === 'fair') return {k: night ? 'lunanube' : 'solnube', t: night ? 'Noche mayormente despejada' : 'Mayormente soleado'};
    return {k: night ? 'luna' : 'sol', t: night ? 'Noche despejada' : 'Soleado'};
  }
  function render(temp: number, code: string){
    var c = classify(code);
    hero!.dataset.wx = c.k;
    hero!.classList.toggle('dark', /^(lluvia|tormenta|luna|lunanube)$/.test(c.k));
    iEl!.innerHTML = ICONS[c.k];
    tEl!.textContent = Math.round(temp) + '\u00b0C';
    xEl!.textContent = c.t;
    chip!.hidden = false;
  }
  function fromData(j: any){
    var ts = j && j.properties && j.properties.timeseries, now = Date.now(), row: any = null;
    if(!ts || !ts.length) return null;
    for(var i = 0; i < ts.length; i++){ if(new Date(ts[i].time).getTime() <= now + 30*60*1000) row = ts[i]; else break; }
    row = row || ts[0];
    var d = row.data, code = (d.next_1_hours && d.next_1_hours.summary.symbol_code) || (d.next_6_hours && d.next_6_hours.summary.symbol_code) || '';
    return {temp: d.instant.details.air_temperature, code: code};
  }
  var cached: {at: number; temp: number; code: string} | null = null;
  try{ cached = JSON.parse(localStorage.getItem(KEY) || 'null'); }catch(e){}
  if(cached && Date.now() - cached.at < MAXAGE){ render(cached.temp, cached.code); return; }
  if(cached) render(cached.temp, cached.code);
  var isPreview = /claude|^$|localhost/.test(location.hostname) || location.protocol === 'file:';
  function demo(){
    if(!isPreview){ if(!cached){ chip!.hidden = true; delete hero!.dataset.wx; } return; }
    var seq: [string,number,string][] = [['sol',27,'clearsky_day'],['solnube',25,'partlycloudy_day'],['nubes',22,'cloudy'],['lluvia',19,'rain'],['tormenta',21,'heavyrainandthunder'],['luna',18,'clearsky_night']], n = 0;
    render(seq[0][1], seq[0][2]); chip!.classList.add('demo');
    chip!.addEventListener('click', function(){ n = (n + 1) % seq.length; render(seq[n][1], seq[n][2]); });
  }
  if(!window.fetch){ demo(); return; }
  var ctrl = window.AbortController ? new AbortController() : null, to = setTimeout(function(){ if(ctrl) ctrl.abort(); }, 8000);
  fetch(URL_WX, ctrl ? {signal: ctrl.signal} : undefined)
    .then(function(r){ if(!r.ok) throw new Error(String(r.status)); return r.json(); })
    .then(function(j: any){
      clearTimeout(to);
      var w = fromData(j); if(!w) throw new Error('sin datos');
      render(w.temp, w.code);
      try{ localStorage.setItem(KEY, JSON.stringify({at: Date.now(), temp: w.temp, code: w.code})); }catch(e){}
    })
    .catch(function(){ clearTimeout(to); if(!cached) demo(); });
})();
