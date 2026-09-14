/* ============================================================
   MERIDIAN DENTAL — Site behavior
   ============================================================ */
(() => {
  'use strict';

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  /* ---------------- Universal image fallback ---------------- */
  const FALLBACK = 'assets/img-fallback.svg';
  const armFallback = img => {
    if (img.dataset.fallbackArmed) return;
    img.dataset.fallbackArmed = '1';
    img.addEventListener('error', () => {
      img.src = FALLBACK;
      img.classList.add('img-fallback');
    }, { once: true });
  };
  $$('img[src]').forEach(armFallback);
  new MutationObserver(muts => muts.forEach(m => {
    if (m.type === 'attributes' && m.target.src) armFallback(m.target);
    if (m.type === 'childList') m.addedNodes.forEach(n => {
      if (n.nodeType === 1 && n.tagName === 'IMG' && n.src) armFallback(n);
    });
  })).observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['src'] });

  /* ---------------- Data ---------------- */
  const TREATMENTS = {
    'smile-makeover': {
      title: 'Smile Makeover',
      long: 'A smile makeover combines several treatments — typically veneers, whitening, and alignment — into one carefully designed result. We plan the entire outcome digitally before treatment begins, so you preview your new smile and refine it with your dentist before any work starts.',
      points: [
        '<b>Digital preview first.</b> See and adjust your future smile before treatment begins.',
        '<b>One master plan.</b> Every stage is sequenced around your timeline and budget.',
        '<b>Natural by design.</b> Results are matched to your face — never generic.',
        '<b>Typical timeline:</b> 3–6 visits over 4–10 weeks, depending on scope.'
      ]
    },
    'dental-implants': {
      title: 'Dental Implants',
      long: 'Implants are the closest thing to growing a new tooth. Using 3D cone-beam imaging and guided surgery, we place the implant with millimeter precision, then restore it with a custom ceramic crown that matches your natural teeth.',
      points: [
        '<b>Guided placement.</b> 3D-planned surgery for safety, precision, and faster healing.',
        '<b>Permanent solution.</b> With good care, implants routinely last decades.',
        '<b>Most patients eligible.</b> We assess bone, health, and goals at consultation.',
        '<b>Typical timeline:</b> 3–4 months from placement to final crown.'
      ]
    },
    'invisalign': {
      title: 'Invisalign & Clear Aligners',
      long: 'Clear aligners straighten teeth discreetly — no wires, no brackets, no interruptions to adult life. Your entire treatment is simulated digitally, so you can see the projected result and the number of aligners before you commit.',
      points: [
        '<b>Nearly invisible.</b> Most people will never notice you are wearing them.',
        '<b>Removable.</b> Eat, brush, and floss exactly as you always have.',
        '<b>Fewer visits.</b> Progress checks every 6–8 weeks.',
        '<b>Typical timeline:</b> 6–15 months for most adult cases.'
      ]
    },
    'cosmetic': {
      title: 'Cosmetic Dentistry',
      long: 'From subtle bonding and contouring to complete aesthetic redesigns, cosmetic dentistry refines what you already have. We favor conservative treatments that preserve healthy enamel and keep your smile unmistakably yours.',
      points: [
        '<b>Conservative first.</b> The least invasive option that achieves your goal.',
        '<b>Shade-matched artistry.</b> Work is invisible in daily life, not just in photos.',
        '<b>Mock-ups available.</b> Preview changes before anything permanent is done.',
        '<b>Typical timeline:</b> 1–3 visits for most cosmetic treatments.'
      ]
    },
    'veneers': {
      title: 'Veneers',
      long: 'Porcelain veneers are wafer-thin ceramic shells bonded to the front of teeth — correcting color, shape, spacing, and minor alignment in one treatment. Each veneer is designed digitally and crafted by master ceramists.',
      points: [
        '<b>Minimal preparation.</b> Modern techniques preserve most of your natural tooth.',
        '<b>Stain-resistant porcelain.</b> Stays bright for years with normal care.',
        '<b>Designed with you.</b> Shape and shade approved by you before final fitting.',
        '<b>Typical timeline:</b> 2 visits, about two weeks apart.'
      ]
    },
    'whitening': {
      title: 'Teeth Whitening',
      long: 'Professional whitening is safer, faster, and dramatically more effective than anything available over the counter. Choose an in-chair treatment for same-visit results, or a custom take-home kit for gradual brightening on your own schedule.',
      points: [
        '<b>Supervised & safe.</b> Gum protection and sensitivity management included.',
        '<b>In-chair results.</b> Visibly whiter in a single 60–90 minute visit.',
        '<b>Custom take-home kits.</b> Professional gel with fitted trays.',
        '<b>Typical timeline:</b> one visit, or two weeks at home.'
      ]
    },
    'general': {
      title: 'General Dentistry',
      long: 'Checkups, hygiene visits, fillings, and preventive care for the whole family. We practice prevention-first dentistry — finding small problems while they are still small, and always explaining your options honestly.',
      points: [
        '<b>Thorough, unrushed visits.</b> 45–60 minute new-patient appointments.',
        '<b>Prevention-first philosophy.</b> Fewer surprises, lower long-term costs.',
        '<b>Family scheduling.</b> Book the whole household back-to-back.',
        '<b>Recommended cadence:</b> checkup & hygiene every 6 months.'
      ]
    },
    'root-canal': {
      title: 'Root Canal Treatment',
      long: 'A modern root canal relieves pain — it does not cause it. Using rotary instruments and magnification, we treat infected teeth comfortably, usually in a single visit, saving your natural tooth whenever possible.',
      points: [
        '<b>Comfortable.</b> Effective anesthesia; most patients feel little to nothing.',
        '<b>Usually one visit.</b> With a custom crown fitted shortly after.',
        '<b>Tooth-saving.</b> Extraction is always the last resort, never the default.',
        '<b>Typical timeline:</b> 1 visit + crown fitting appointment.'
      ]
    },
    'pediatric': {
      title: 'Pediatric Dentistry',
      long: 'Children deserve dentistry without fear. First visits are kept short, playful, and pressure-free — building trust early so checkups stay easy for life. We see children from their first tooth through their teens.',
      points: [
        '<b>Gentle first visits.</b> Meet-and-greet appointments with zero pressure.',
        '<b>Growth monitoring.</b> Early spotting of alignment and development issues.',
        '<b>Parent partnership.</b> Clear guidance for home care between visits.',
        '<b>First visit by age one</b> — or whenever you are ready.'
      ]
    }
  };

  const DOCTORS = {
    elena: {
      name: 'Dr. Elena Vasquez',
      first: 'Elena',
      quals: 'DDS, FAGD — Founder & Lead Cosmetic Dentist',
      bio: 'Elena graduated with clinical honors and spent a decade in premium cosmetic practices before founding Meridian in 2011. She is known for natural-looking smile design, meticulous preparation, and a famously gentle chairside manner.',
      points: [
        '<b>15+ years of experience</b> in cosmetic and restorative dentistry.',
        '<b>Fellow, Academy of General Dentistry</b> (FAGD) — held by a small percentage of dentists.',
        '<b>Digital Smile Design certified</b> instructor and lecturer.',
        '<b>Focus areas:</b> veneers, smile makeovers, full-mouth rehabilitation.'
      ]
    },
    marcus: {
      name: 'Dr. Marcus Chen',
      first: 'Marcus',
      quals: 'DMD, MSD — Implantologist & Oral Surgery',
      bio: 'Marcus completed his implantology fellowship after residency and has placed more than 3,000 implants over his career. He leads Meridian\'s guided-surgery program and same-day full-arch treatments, and is beloved by anxious patients for his calm, methodical approach.',
      points: [
        '<b>3,000+ implants placed</b> with documented success above industry average.',
        '<b>Fellowship-trained</b> in implantology and oral surgery.',
        '<b>Guided-surgery workflows</b> for faster, safer, more predictable treatment.',
        '<b>Focus areas:</b> implants, bone grafting, full-arch restoration.'
      ]
    },
    amara: {
      name: 'Dr. Amara Osei',
      first: 'Amara',
      quals: 'DDS, MOrth — Orthodontist & Pediatric Dentistry',
      bio: 'Amara is an Invisalign-accredited orthodontist with a rare pediatric sixth sense. She aligns adult smiles by day and has a gift for turning nervous first-graders into kids who ask when they can come back.',
      points: [
        '<b>Invisalign-accredited</b> with 500+ completed aligner cases.',
        '<b>Membership in Orthodontics</b> (MOrth) — specialist-level qualification.',
        '<b>Pediatric specialist training</b> for gentle care from age one.',
        '<b>Focus areas:</b> clear aligners, early orthodontics, children\'s dentistry.'
      ]
    }
  };

  const CASES = [
    {
      tag: 'Porcelain Veneers', sub: '8 units · completed in 2 visits',
      before: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=1400&q=70',
      after: 'https://images.unsplash.com/photo-1576671081837-49000212a370?auto=format&fit=crop&w=1400&q=70',
      beforeAlt: 'Patient smile before veneer treatment', afterAlt: 'Patient smile after porcelain veneers'
    },
    {
      tag: 'Single Implant & Crown', sub: 'Guided surgery · 3 months',
      before: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=1400&q=70',
      after: 'https://images.unsplash.com/photo-1571772996211-2f02c9727629?auto=format&fit=crop&w=1400&q=70',
      beforeAlt: 'Patient smile before implant treatment', afterAlt: 'Patient smile after implant restoration'
    },
    {
      tag: 'Invisalign® Alignment', sub: '22 aligners · 11 months',
      before: 'https://images.unsplash.com/photo-1522252234503-e356532cafd5?auto=format&fit=crop&w=1400&q=70',
      after: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=1400&q=70',
      beforeAlt: 'Patient smile before clear aligner treatment', afterAlt: 'Patient smile after clear aligner treatment'
    },
    {
      tag: 'Professional Whitening', sub: 'In-chair treatment + take-home kit',
      before: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1400&q=70',
      after: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1400&q=70',
      beforeAlt: 'Patient smile before whitening treatment', afterAlt: 'Patient smile after professional whitening'
    }
  ];

  /* ---------------- Navbar scroll state ---------------- */
  const navbar = $('#navbar');
  const onScroll = () => navbar && navbar.classList.toggle('is-scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------------- Active nav link ---------------- */
  const navLinks = $$('.nav-links a');
  const navSections = navLinks.map(a => $(a.hash)).filter(Boolean);
  if ('IntersectionObserver' in window && navSections.length) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          navLinks.forEach(l => l.classList.toggle('is-active', l.hash === '#' + e.target.id));
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    navSections.forEach(s => io.observe(s));
  }

  /* ---------------- Mobile menu ---------------- */
  const navToggle = $('#navToggle');
  const mobileMenu = $('#mobileMenu');
  const mobileCta = $('#mobileCta');
  let lastFocus = null;

  const setMenu = open => {
    document.body.classList.toggle('nav-open', open);
    if (navToggle) {
      navToggle.setAttribute('aria-expanded', String(open));
      navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }
    if (mobileMenu) mobileMenu.setAttribute('aria-hidden', String(!open));
    if (mobileCta && open) mobileCta.classList.remove('is-visible');
    if (open) {
      lastFocus = document.activeElement;
      const first = $('.mnav-link', mobileMenu);
      if (first) setTimeout(() => first.focus(), 80);
    } else if (lastFocus && lastFocus.focus) {
      lastFocus.focus();
    }
  };
  if (navToggle) navToggle.addEventListener('click', () => setMenu(!document.body.classList.contains('nav-open')));
  $$('#mobileMenu a').forEach(a => a.addEventListener('click', () => setMenu(false)));

  /* ---------------- Modals ---------------- */
  let openModalEl = null;
  const openModal = m => {
    openModalEl = m;
    m.classList.add('is-open');
    m.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    if (mobileCta) mobileCta.classList.remove('is-visible');
    lastFocus = document.activeElement;
    const closeBtn = $('.modal-close', m);
    if (closeBtn) closeBtn.focus();
  };
  const closeModal = () => {
    if (!openModalEl) return;
    openModalEl.classList.remove('is-open');
    openModalEl.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
    openModalEl = null;
  };
  $$('.modal').forEach(m => $$('[data-close-modal]', m).forEach(el => el.addEventListener('click', closeModal)));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (openModalEl) closeModal();
      if (document.body.classList.contains('nav-open')) setMenu(false);
    }
    if (e.key === 'Tab' && openModalEl) {
      const focusables = $$('a[href], button, input, select, textarea', openModalEl)
        .filter(el => !el.disabled && el.offsetParent !== null);
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
      else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
    }
  });

  /* Treatment modal */
  const tm = $('#treatmentModal');
  const fillTreatmentModal = key => {
    const t = TREATMENTS[key];
    if (!t || !tm) return;
    $('#tmTitle').textContent = t.title;
    $('#tmLong').textContent = t.long;
    $('#tmPoints').innerHTML = t.points.map(p => `<li>${p}</li>`).join('');
    openModal(tm);
  };
  $$('[data-treatment]').forEach(btn => btn.addEventListener('click', () => fillTreatmentModal(btn.dataset.treatment)));
  $$('[data-treatment-link]').forEach(a => a.addEventListener('click', e => {
    e.preventDefault();
    fillTreatmentModal(a.dataset.treatmentLink);
  }));

  /* Doctor modal */
  const dm = $('#doctorModal');
  $$('[data-doctor]').forEach(a => a.addEventListener('click', e => {
    e.preventDefault();
    const d = DOCTORS[a.dataset.doctor];
    if (!d || !dm) return;
    $('#dmTitle').textContent = d.name;
    $('#dmQuals').textContent = d.quals;
    $('#dmBio').textContent = d.bio;
    $('#dmFirst').textContent = d.first;
    $('#dmPoints').innerHTML = d.points.map(p => `<li>${p}</li>`).join('');
    openModal(dm);
  }));

  /* Book buttons close any modal before scrolling */
  $$('a[data-book]').forEach(a => a.addEventListener('click', () => closeModal()));

  /* ---------------- Reveal on scroll ---------------- */
  const revealEls = $$('[data-reveal]');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          en.target.classList.add('is-visible');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------------- Animated counters ---------------- */
  const fmt = (n, f) => f === 'k' ? ((n / 1000).toFixed(n % 1000 === 0 ? 0 : 1) + 'k') : String(n);
  const runCounter = el => {
    const target = +el.dataset.count;
    const format = el.dataset.format;
    const dur = 1400;
    const t0 = performance.now();
    const tick = now => {
      const p = Math.min((now - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(Math.round(target * eased), format);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if ('IntersectionObserver' in window) {
    const cio = new IntersectionObserver(entries => entries.forEach(en => {
      if (en.isIntersecting) { runCounter(en.target); cio.unobserve(en.target); }
    }), { threshold: 0.6 });
    $$('[data-count]').forEach(el => cio.observe(el));
  }

  /* ---------------- Hero image fade-in ---------------- */
  const heroImg = $('#heroImg');
  if (heroImg) {
    if (heroImg.complete && heroImg.naturalWidth) heroImg.classList.add('is-loaded');
    else heroImg.addEventListener('load', () => heroImg.classList.add('is-loaded'));
  }

  /* ---------------- FAQ accordion ---------------- */
  $$('.faq-item').forEach(item => {
    const btn = $('.faq-q', item);
    if (!btn) return;
    btn.addEventListener('click', () => {
      const wasOpen = item.classList.contains('is-open');
      $$('.faq-item.is-open').forEach(o => {
        o.classList.remove('is-open');
        $('.faq-q', o).setAttribute('aria-expanded', 'false');
      });
      if (!wasOpen) {
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ---------------- Before / After slider ---------------- */
  const frame = $('#baFrame');
  const afterPane = $('#baAfter');
  const handle = $('#baHandle');
  let pos = 50;

  const setPos = v => {
    pos = Math.max(2, Math.min(98, v));
    if (frame) frame.style.setProperty('--pos', pos + '%');
    if (afterPane) afterPane.style.setProperty('--pos', pos + '%');
    if (handle) handle.setAttribute('aria-valuenow', String(Math.round(pos)));
    const nextBtn = $('#baNext');
    if (nextBtn) nextBtn.classList.toggle('at-end', pos >= 97);
  };
  const posFromEvent = e => {
    if (!frame) return pos;
    const r = frame.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    return ((clientX - r.left) / r.width) * 100;
  };
  let dragging = false;
  const startDrag = e => { dragging = true; setPos(posFromEvent(e)); };
  const onMove = e => { if (!dragging) return; if (e.cancelable) e.preventDefault(); setPos(posFromEvent(e)); };
  const endDrag = () => { dragging = false; };
  if (frame) {
    frame.addEventListener('pointerdown', startDrag);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', endDrag);
    if (handle) {
      handle.addEventListener('keydown', e => {
        if (e.key === 'ArrowLeft') { setPos(pos - 4); e.preventDefault(); }
        if (e.key === 'ArrowRight') { setPos(pos + 4); e.preventDefault(); }
        if (e.key === 'Home') { setPos(2); e.preventDefault(); }
        if (e.key === 'End') { setPos(98); e.preventDefault(); }
      });
    }
    setPos(50);
  }

  /* Gallery cases */
  const caseBtns = $$('.gallery-case');
  const loadCase = i => {
    const c = CASES[i];
    const beforeImg = $('#baBefore');
    const afterImg = $('#baAfter img');
    if (!c || !beforeImg || !afterImg) return;
    beforeImg.src = c.before;
    beforeImg.alt = c.beforeAlt;
    afterImg.src = c.after;
    afterImg.alt = c.afterAlt;
    const tag = $('#baCaptionTag');
    if (tag) tag.firstChild.textContent = c.tag;
    const sub = $('#baCaptionSub');
    if (sub) sub.textContent = c.sub;
    caseBtns.forEach((b, j) => b.classList.toggle('is-active', i === j));
    setPos(50);
  };
  caseBtns.forEach(b => b.addEventListener('click', () => loadCase(+b.dataset.case)));
  const nextBtn = $('#baNext');
  if (nextBtn) nextBtn.addEventListener('click', () => {
    const active = caseBtns.findIndex(b => b.classList.contains('is-active'));
    loadCase((active + 1) % caseBtns.length);
  });
  CASES.forEach(c => { const i1 = new Image(); i1.src = c.before; const i2 = new Image(); i2.src = c.after; });

  /* ---------------- Mobile sticky CTA ---------------- */
  if (mobileCta && 'IntersectionObserver' in window) {
    const hero = $('#hero');
    if (hero) {
      const io = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (document.body.classList.contains('nav-open') || openModalEl) return;
          mobileCta.classList.toggle('is-visible', !e.isIntersecting);
        });
      }, { threshold: 0.05 });
      io.observe(hero);
    }
  }

  /* ---------------- Appointment form ---------------- */
  const form = $('#appointmentForm');
  const success = $('#formSuccess');
  const validators = {
    name: v => v.trim().length >= 2,
    phone: v => { const digits = v.replace(/\D/g, ''); return digits.length >= 7 && digits.length <= 15; },
    email: v => !v.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
    treatment: v => !!v
  };
  const validateField = input => {
    const rule = validators[input.name];
    if (!rule) return true;
    const ok = rule(input.value);
    const field = input.closest('.form-field');
    if (field) field.classList.toggle('has-error', !ok);
    return ok;
  };

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      let valid = true;
      let firstBad = null;
      $$('input, select, textarea', form).forEach(f => {
        const ok = validateField(f);
        if (!ok) { valid = false; if (!firstBad) firstBad = f; }
      });
      if (!valid) { if (firstBad) firstBad.focus(); return; }

      const btn = $('#formSubmit');
      btn.classList.add('is-loading');
      btn.disabled = true;

      // Simulated request — replace with a real endpoint (fetch + FormData) in production.
      setTimeout(() => {
        btn.classList.remove('is-loading');
        btn.disabled = false;
        const firstName = form.elements['name'].value.trim().split(/\s+/)[0];
        const msg = $('#formSuccessMsg');
        if (msg) {
          msg.innerHTML = `Thank you, ${firstName} — our front desk team will confirm your appointment by text within one business hour. For urgent care, call <a href="tel:+15125550184">(512) 555-0184</a>.`;
        }
        form.style.display = 'none';
        if (success) success.classList.add('is-visible');
      }, 1400);
    });

    form.addEventListener('input', e => {
      const field = e.target.closest('.form-field');
      if (field && field.classList.contains('has-error')) validateField(e.target);
    });
    form.addEventListener('change', e => validateField(e.target));

    const resetBtn = $('#formReset');
    if (resetBtn) resetBtn.addEventListener('click', () => {
      form.reset();
      form.style.display = '';
      if (success) success.classList.remove('is-visible');
      $$('.has-error', form).forEach(f => f.classList.remove('has-error'));
    });

    const dateInput = $('#f-date');
    if (dateInput) dateInput.min = new Date().toISOString().split('T')[0];
  }
})();
