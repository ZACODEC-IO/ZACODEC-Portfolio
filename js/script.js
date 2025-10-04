// Reveal on scroll
(function(){
  const els = Array.from(document.querySelectorAll('[data-observe]'));
  if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches){
    els.forEach(el=>el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if (e.isIntersecting){
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, {threshold: 0.15});
  els.forEach(el=>io.observe(el));
})();

// Lightweight 3D tilt effect for cards with pointer-following shadow
(function(){
  const supportsPointer = 'PointerEvent' in window;
  const els = document.querySelectorAll('[data-tilt]');
  els.forEach(card => {
    let raf = 0;
    const rectFor = () => card.getBoundingClientRect();
    const onMove = (x, y) => {
      const r = rectFor();
      const cx = r.left + r.width/2;
      const cy = r.top + r.height/2;
      const dx = (x - cx) / (r.width/2);
      const dy = (y - cy) / (r.height/2);
      const rx = (dy * -6).toFixed(2);
      const ry = (dx * 6).toFixed(2);
      // 3D tilt
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
      // Pointer-following shadow
      const shx = (-dx * 12).toFixed(2);
      const shy = (-dy * 12).toFixed(2);
      card.style.boxShadow = `0 10px 40px rgba(0,0,0,.35), ${shx}px ${shy}px 24px rgba(59,130,246,.18)`;
    };
    const reset = () => {
      card.style.transform = '';
      card.style.boxShadow = '';
    };
    const enterHandler = ()=>{
      card.style.transition = '';
    };
    const moveHandler = (e)=>{
      cancelAnimationFrame(raf);
      const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const y = 'touches' in e ? e.touches[0].clientY : e.clientY;
      raf = requestAnimationFrame(()=>onMove(x,y));
    };
    const leaveHandler = ()=>{
      cancelAnimationFrame(raf);
      card.style.transition = 'transform .25s ease, box-shadow .25s ease';
      reset();
      setTimeout(()=>{card.style.transition = '';}, 260);
    };
    if (supportsPointer){
      card.addEventListener('pointerenter', enterHandler);
      card.addEventListener('pointermove', moveHandler);
      card.addEventListener('pointerleave', leaveHandler);
    } else {
      card.addEventListener('mouseenter', enterHandler);
      card.addEventListener('mousemove', moveHandler);
      card.addEventListener('mouseleave', leaveHandler);
      card.addEventListener('touchmove', moveHandler, {passive: true});
      card.addEventListener('touchend', leaveHandler);
    }
  });
})();

// Soft parallax for decorative blobs
(function(){
  const blobs = document.querySelectorAll('.blob');
  if (!blobs.length) return;
  let sx = 0, sy = 0, tx = 0, ty = 0;
  const update = ()=>{
    sx += (tx - sx) * 0.06;
    sy += (ty - sy) * 0.06;
    blobs.forEach((b, i)=>{
      const depth = (i+1) * 4; // different layers
      b.style.transform = `translate(${sx/depth}px, ${sy/depth}px)`;
    });
    requestAnimationFrame(update);
  };
  window.addEventListener('mousemove', (e)=>{
    tx = (e.clientX - window.innerWidth/2) * 0.15;
    ty = (e.clientY - window.innerHeight/2) * 0.15;
  });
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches){
    update();
  }
})();

// Simple client-side validation with Gmail compose + graceful fallbacks (no OS mailto prompt)
(function(){
  const form = document.getElementById('contactForm');
  if (!form) return;
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function showToast(html){
    let t = document.querySelector('.toast');
    if (t) t.remove();
    t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML = `<div>${html}</div>`;
    document.body.appendChild(t);
    setTimeout(()=>{ t.style.opacity = '0'; setTimeout(()=>t.remove(), 500); }, 6000);
  }

  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const data = new FormData(form);
    const name = String(data.get('name')||'').trim();
    const email = String(data.get('email')||'').trim();
    const message = String(data.get('message')||'').trim();
    let valid = true;
    if (!name){ valid = false; mark('name', 'Please enter your name'); }
    if (!emailRe.test(email)){ valid = false; mark('email', 'Please enter a valid email'); }
    if (message.length < 10){ valid = false; mark('message', 'Please add more details'); }
    if (!valid) return;

    const to = 'f2023266257@umt.edu.pk';
    const subjectText = 'New project inquiry';
    const subject = encodeURIComponent(subjectText);
    const bodyText = `Name: ${name}\nEmail: ${email}\n\n${message}`;
    const body = encodeURIComponent(bodyText);

    // Try Gmail compose in a new tab (web-based, avoids OS mailto handler)
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${subject}&body=${body}`;
    let opened = null;
    try { opened = window.open(gmailUrl, '_blank', 'noopener'); } catch(_) {}

    if (!opened){
      // Fallback: traditional mailto
      window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
    }

    // User feedback + quick fallback link
    const safeMailto = `mailto:${to}?subject=${subject}&body=${body}`;
    showToast(`Opening a draft in your email. If nothing opens, <a href="${safeMailto}">click here to send via your mail app</a>.`);

    // Convenience: copy the message to clipboard (best-effort)
    if (navigator.clipboard && window.isSecureContext){
      try { await navigator.clipboard.writeText(`To: ${to}\nSubject: ${subjectText}\n\n${bodyText}`); } catch(_) {}
    }

    form.reset();
  });

  function mark(id, msg){
    const el = document.getElementById(id);
    if (!el) return;
    el.setAttribute('aria-invalid', 'true');
    el.style.borderColor = 'rgba(255,77,77,.8)';
    el.title = msg;
    el.addEventListener('input', ()=>{
      el.removeAttribute('aria-invalid');
      el.style.borderColor = '';
      el.title = '';
    }, {once:false});
  }
})();


// Background hue shift on scroll + header progress width
(function(){
  const root = document.documentElement;
  const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const update = ()=>{
    const max = Math.max(1, document.body.scrollHeight - window.innerHeight);
    const p = Math.min(1, Math.max(0, window.scrollY / max));
    if (!prefersReduced){
      root.style.setProperty('--scroll-hue', (p * 90).toFixed(1) + 'deg');
    }
    root.style.setProperty('--scroll-pct', (p * 100).toFixed(1) + '%');
  };
  window.addEventListener('scroll', update, {passive:true});
  update();
})();


// ScrollSpy: highlight active nav link on scroll
(function(){
  const links = Array.from(document.querySelectorAll('.menu a[href^="#"]'));
  if (!links.length) return;
  const map = new Map();
  const sections = links.map(l => {
    const id = l.getAttribute('href').slice(1);
    const sec = document.getElementById(id);
    if (sec) map.set(id, l);
    return sec;
  }).filter(Boolean);
  const activate = (id)=>{
    map.forEach((a, key)=> a.classList.toggle('active', key === id));
  };
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if (e.isIntersecting && e.target.id){
        activate(e.target.id);
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] });
  sections.forEach(s=>io.observe(s));
  if (sections[0]) activate(sections[0].id);
})();

// Marquee: robust duplication for seamless loop with distance-based animation
(function(){
  const marquee = document.querySelector('.marquee');
  const track = marquee && marquee.querySelector('.marquee__track');
  if (!track) return;
  const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const initial = track.innerHTML;
  const ensure = ()=>{
    // Reset to initial and duplicate until >= 2× container width
    track.innerHTML = initial;
    const containerW = marquee.offsetWidth || window.innerWidth;
    let guard = 0;
    while (track.scrollWidth < containerW * 2 && guard < 20){
      track.insertAdjacentHTML('beforeend', initial);
      guard++;
    }
    const distance = Math.round(track.scrollWidth / 2);
    track.style.setProperty('--marquee-distance', distance + 'px');
    // Gentle speed for reduced motion users
    const speed = prefersReduced ? 35 : 70; // px per second
    track.style.animationDuration = (distance / speed).toFixed(2) + 's';
  };
  ensure();
  let rid = 0;
  const onResize = ()=>{
    cancelAnimationFrame(rid);
    rid = requestAnimationFrame(()=>{
      const prev = track.style.animation;
      track.style.animation = 'none';
      ensure();
      // reflow to restart
      void track.offsetHeight;
      track.style.animation = prev || '';
    });
  };
  window.addEventListener('resize', onResize, {passive:true});
})();

// Experience: sticky detail panel — structured render (no duplication of card UI)
(function(){
  const panel = document.querySelector('.exp-detail .exp-detail__inner');
  const items = Array.from(document.querySelectorAll('#experience .timeline__item'));
  if (!panel || !items.length) return;

  const escape = (s='')=> s.replace(/[&<>"']/g, m=>({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'
  })[m] || m);

  const pickTags = (txt='')=>{
    const tests = [
      {re:/react|frontend|ui/i, t:'UI/React'},
      {re:/node|express|api/i, t:'Node/API'},
      {re:/perf|lighthouse|speed|performance/i, t:'Performance'},
      {re:/design|system|architecture|clean/i, t:'Design System'},
      {re:/accessib|a11y/i, t:'Accessibility'},
      {re:/dashboard|admin|rbac|analytics|charts/i, t:'Dashboards'}
    ];
    const set = new Set();
    tests.forEach(x=>{ if (x.re.test(txt)) set.add(x.t); });
    return Array.from(set).slice(0, 4);
  };

  const render = (li)=>{
    const content = li.querySelector('.content');
    const title = content?.querySelector('h3')?.textContent?.trim() || 'Experience';
    const when = content?.querySelector('.muted')?.textContent?.trim() || '';
    const ds = (li.dataset && li.dataset.summary) ? li.dataset.summary.trim() : '';
    const sum = ds || Array.from(content?.querySelectorAll('p:not(.muted)')||[]).map(p=>p.textContent.trim()).join(' ');
    const tags = pickTags(`${title} ${sum}`);
    panel.innerHTML = `
      <div class="exp-meta">${when ? `<span class="chip chip--soft">${escape(when)}</span>` : ''}</div>
      <h4 class="exp-role">${escape(title)}</h4>
      ${sum ? `<p class="exp-summary">${escape(sum)}</p>` : ''}
      ${tags.length ? `<div class="exp-tags">${tags.map(t=>`<span class="tag">${escape(t)}</span>`).join('')}</div>` : ''}
    `;
  };

  const io = new IntersectionObserver((entries)=>{
    let chosen = null;
    entries.forEach(e=>{
      if (e.isIntersecting){
        if (!chosen || e.intersectionRatio > chosen.intersectionRatio){ chosen = e; }
      }
    });
    if (chosen) render(chosen.target);
  }, { rootMargin: '-35% 0px -55% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] });

  items.forEach(item=>io.observe(item));
  render(items[0]);
})();


// Footer: Copy email to clipboard with toast
(function(){
  document.addEventListener('click', async (e)=>{
    const btn = e.target.closest('[data-copy]');
    if (!btn) return;
    const text = String(btn.getAttribute('data-copy')||'').trim();
    let ok = false;
    if (navigator.clipboard && window.isSecureContext){
      try { await navigator.clipboard.writeText(text); ok = true; } catch(_) {}
    }
    if (!ok){
      try{
        const ta = document.createElement('textarea');
        ta.value = text; ta.style.position='fixed'; ta.style.left='-999px';
        document.body.appendChild(ta); ta.select();
        ok = document.execCommand('copy');
        ta.remove();
      }catch(_){ ok=false; }
    }
    const t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML = `<div>${ok ? 'Email copied to clipboard' : 'Copy failed'}: <strong>${text}</strong></div>`;
    document.body.appendChild(t);
    setTimeout(()=>{ t.style.opacity='0'; setTimeout(()=>t.remove(), 500); }, 3000);
  });
})();

// Cursor glow follower under pointer
(function(){
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (matchMedia('(hover: none)').matches) return;
  const glow = document.createElement('div');
  glow.className = 'cursor-glow';
  document.body.appendChild(glow);
  let x = 0, y = 0, tx = 0, ty = 0, raf = 0;
  const update = ()=>{
    x += (tx - x) * 0.18;
    y += (ty - y) * 0.18;
    glow.style.transform = `translate(${x}px, ${y}px)`;
    raf = 0;
  };
  const move = (e)=>{
    tx = e.clientX; ty = e.clientY;
    if (!raf) raf = requestAnimationFrame(update);
  };
  window.addEventListener('pointermove', move, {passive:true});
  document.addEventListener('mouseleave', ()=>{ glow.style.opacity = '.3'; });
  document.addEventListener('mouseenter', ()=>{ glow.style.opacity = '.9'; });
})();
