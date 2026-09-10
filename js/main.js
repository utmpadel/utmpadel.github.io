(function(){
  // Changing this address — or moving the site to a new domain — appears to
  // require a fresh FormSubmit activation click before submissions are
  // delivered again. Re-test the form end to end after either change.
  var EMAIL = 'utmpadel@studentorg.utoronto.ca';
  var MAILTO = 'mailto:' + EMAIL + '?subject=UTM%20Padel%20Sponsorship';

  var TIERS = [
    { id:'supporter', name:'Supporter', subtitle:'Friend of the Club', dots:3, price:'In-Kind', per:'prizes · vouchers · gear',
      blurb:'No cash needed — fuel our socials with prizes, vouchers, or product, and get thanked in front of the whole community.' },
    { id:'bronze', name:'Bronze', subtitle:'Community Partner', dots:7, price:'$250', per:'CAD / season',
      blurb:'For brands starting the relationship — visibility with an engaged, first-time-heavy student community.' },
    { id:'silver', name:'Silver', subtitle:'Court Partner', dots:12, price:'$600', per:'CAD / season',
      blurb:'Regular presence across our content and events, in front of a steady, growing audience.' },
    { id:'gold', name:'Gold', subtitle:'Match Partner', dots:18, price:'$1,250', per:'CAD / season',
      blurb:'Kit placement and full event presence — visible every time we step on court.' },
    { id:'platinum', name:'Platinum', subtitle:'Title Partner', dots:25, price:'$2,500', per:'CAD / season',
      blurb:'One brand, front and centre — naming rights, exclusivity, and direct athlete access.' }
  ];

  var CATEGORIES = [
    { label:'Visibility', rows:[
      { supporter:'Listed as a Friend of the Club on our link page', bronze:'Logo on @utmpadel Instagram bio & link page', silver:'Logo on select event merch & event banners', gold:'Logo on competitive match kits', platinum:'Primary logo — kits, merch & event signage, plus "Presented by" placement in our bio' }
    ]},
    { label:'Content', rows:[
      { supporter:'Story thank-you whenever your product or vouchers feature at an event', bronze:'1 dedicated shoutout post per semester', silver:'2 dedicated posts + story features / semester', gold:'Monthly dedicated content (reel or post)', platinum:'Full content series + quarterly recap from the President' }
    ]},
    { label:'Presence', rows:[
      { supporter:'Verbal recognition at the event your contribution supports', bronze:'Recognition at socials & events', silver:'Booth / table at 1 event per semester', gold:'Booth presence at every tournament & flagship event', platinum:'Naming rights on one flagship event per season' }
    ]},
    { label:'Giveaways & prizing', rows:[
      { supporter:'Your vouchers, merch, or product handed out as event prizes', bronze:'Product included in event prize pools (if provided)', silver:'Branded prize feature at 1 event per semester', gold:'Branded prize feature at every flagship event', platinum:'Season-long branded prize program named after you' }
    ]},
    { label:'Partnership status', rows:[
      { supporter:'Open in-kind partner — unlimited spots, non-exclusive', bronze:'Open partner', silver:'Open partner', gold:'Recognized official category partner', platinum:'Exclusive category partner + direct athlete engagement' }
    ]}
  ];

  var TIER_ORDER = ['supporter','bronze','silver','gold','platinum'];
  var TIER_OPTION = {
    supporter:'Supporter (In-Kind)',
    bronze:'Bronze — $250',
    silver:'Silver — $600',
    gold:'Gold — $1,250',
    platinum:'Platinum — $2,500'
  };

  function renderDots(container, filled){
    container.innerHTML = '';
    var order = [];
    for(var r=4; r>=0; r--){
      for(var c=0;c<5;c++){ order.push(r*5+c); }
    }
    var filledSet = {};
    for(var i=0;i<filled;i++){ filledSet[order[i]] = true; }
    for(var idx=0; idx<25; idx++){
      var dot = document.createElement('i');
      if(filledSet[idx]) dot.classList.add('filled');
      container.appendChild(dot);
    }
  }

  var cardsWrap = document.getElementById('tierCards');
  TIERS.forEach(function(t){
    var card = document.createElement('button');
    card.type = 'button';
    card.className = 'tier-card' + (t.id==='platinum' ? ' is-platinum' : '');
    card.setAttribute('data-tier', t.id);
    card.setAttribute('aria-pressed','false');
    card.innerHTML =
      '<span class="check-badge" aria-hidden="true">&#10003;</span>' +
      '<div class="dotgrid" aria-hidden="true"></div>' +
      '<div><span class="tier-name">' + t.subtitle + '</span><h3>' + t.name + '</h3>' +
      '<div class="tier-price"><span class="amount">' + t.price + '</span><span class="per">' + t.per + '</span></div></div>' +
      '<p class="tier-blurb">' + t.blurb + '</p>' +
      '<span class="tier-select-hint">Select this tier &nbsp;&rarr;</span>';
    cardsWrap.appendChild(card);
    renderDots(card.querySelector('.dotgrid'), t.dots);
  });

  var body = document.getElementById('compareBody');
  CATEGORIES.forEach(function(cat){
    cat.rows.forEach(function(row){
      var tr = document.createElement('tr');
      var rowLabel = document.createElement('th');
      rowLabel.textContent = cat.label;
      tr.appendChild(rowLabel);
      TIER_ORDER.forEach(function(tid){
        var td = document.createElement('td');
        td.setAttribute('data-tier', tid);
        if(tid==='platinum') td.classList.add('is-platinum');
        td.innerHTML = '<span class="yes">' + row[tid] + '</span>';
        tr.appendChild(td);
      });
      body.appendChild(tr);
    });
  });

  var selected = null;
  var mobileIndex = 0;
  var cards = Array.prototype.slice.call(document.querySelectorAll('.tier-card'));
  var colHeaders = Array.prototype.slice.call(document.querySelectorAll('th.tier-col'));
  var selectbar = document.getElementById('selectbar');
  var selectbarTier = document.getElementById('selectbarTier');
  var tierSelect = document.getElementById('f-tier');

  function renderMobileCompare(){
    var tid = TIER_ORDER[mobileIndex];
    var t = TIERS[mobileIndex];
    var nameEl = document.getElementById('compareMobileName');
    var priceEl = document.getElementById('compareMobilePrice');
    var stack = document.getElementById('compareMobileStack');
    nameEl.textContent = t.name;
    priceEl.textContent = t.subtitle + ' · ' + t.price;
    stack.innerHTML = '';
    CATEGORIES.forEach(function(cat, i){
      var d = document.createElement('details');
      if(i===0) d.open = true;
      var summary = document.createElement('summary');
      summary.textContent = cat.label;
      var p = document.createElement('p');
      p.textContent = cat.rows[0][tid];
      d.appendChild(summary);
      d.appendChild(p);
      stack.appendChild(d);
    });
  }

  function applySelection(tid, fromMobile){
    selected = (selected === tid && !fromMobile) ? null : tid;
    if(selected){
      mobileIndex = TIER_ORDER.indexOf(selected);
      if(mobileIndex < 0) mobileIndex = 0;
    }

    cards.forEach(function(c){
      var active = c.getAttribute('data-tier') === selected;
      c.classList.toggle('active', active);
      c.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    colHeaders.forEach(function(th){
      th.classList.toggle('col-active', th.getAttribute('data-tier') === selected);
    });

    document.querySelectorAll('td[data-tier]').forEach(function(td){
      td.classList.toggle('col-active', td.getAttribute('data-tier') === selected);
    });

    if(selected){
      var t = TIERS.filter(function(x){return x.id===selected;})[0];
      selectbarTier.textContent = t.name + ' — ' + t.subtitle;
      selectbar.classList.add('show');
    } else {
      selectbar.classList.remove('show');
    }

    renderMobileCompare();
  }

  cards.forEach(function(c){
    c.addEventListener('click', function(){ applySelection(c.getAttribute('data-tier')); });
  });
  colHeaders.forEach(function(th){
    th.addEventListener('click', function(){ applySelection(th.getAttribute('data-tier')); });
  });

  document.getElementById('comparePrev').addEventListener('click', function(){
    mobileIndex = (mobileIndex + TIER_ORDER.length - 1) % TIER_ORDER.length;
    applySelection(TIER_ORDER[mobileIndex], true);
  });
  document.getElementById('compareNext').addEventListener('click', function(){
    mobileIndex = (mobileIndex + 1) % TIER_ORDER.length;
    applySelection(TIER_ORDER[mobileIndex], true);
  });
  renderMobileCompare();

  document.getElementById('selectbarCta').addEventListener('click', function(){
    if(selected && TIER_OPTION[selected]){ tierSelect.value = TIER_OPTION[selected]; }
  });

  var partnerForm = document.getElementById('partnerForm');
  var formStatus = document.getElementById('formStatus');
  var partnerSubmit = document.getElementById('partnerSubmit');

  partnerForm.addEventListener('submit', function(e){
    e.preventDefault();
    if(partnerSubmit.disabled) return;
    partnerSubmit.disabled = true;
    partnerSubmit.textContent = 'Sending…';
    formStatus.className = 'form-status';
    formStatus.textContent = '';

    var payload = {};
    new FormData(partnerForm).forEach(function(v, k){ payload[k] = v; });
    if(!payload.tier) payload.tier = 'Not sure yet';

    fetch('https://formsubmit.co/ajax/' + EMAIL, {
      method:'POST',
      headers:{ 'Content-Type':'application/json', 'Accept':'application/json' },
      body: JSON.stringify(payload)
    }).then(function(res){
      // FormSubmit answers 200 even when the recipient/domain pair is not yet
      // activated, so HTTP status alone is not proof of delivery. Only an
      // explicit success flag counts; anything else falls through to the
      // "email us directly" path. success is a string in their API.
      return res.json().catch(function(){ return {}; }).then(function(data){
        if(!res.ok || String(data.success) !== 'true'){
          throw new Error(data.message || 'Request failed');
        }
        return data;
      });
    }).then(function(){
      partnerForm.reset();
      formStatus.textContent = "Thanks — we'll reply within 48 hours.";
      formStatus.className = 'form-status show success';
      partnerSubmit.disabled = false;
      partnerSubmit.textContent = 'Send partnership note';
    }).catch(function(){
      formStatus.innerHTML = 'Something went wrong sending that — email us directly at <a href="' + MAILTO + '">' + EMAIL + '</a> and we\'ll take it from there.';
      formStatus.className = 'form-status show error';
      partnerSubmit.disabled = false;
      partnerSubmit.textContent = 'Send partnership note';
    });
  });

  var field = document.getElementById('dotfield');
  var total = 12*10;
  for(var i=0;i<total;i++){
    var s = document.createElement('span');
    s.style.animationDelay = (Math.random()*1.2).toFixed(2) + 's';
    field.appendChild(s);
  }

  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('siteNav');
  function closeNav(){
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded','false');
  }
  toggle.addEventListener('click', function(){
    var open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  nav.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', closeNav);
  });
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape') closeNav();
  });

  var track = document.getElementById('partnerTrack');
  if(track && track.children.length){
    track.innerHTML = track.innerHTML + track.innerHTML;
  }

  var igViewport = document.getElementById('igViewport');
  var igDots = document.getElementById('igDots');
  var igPrev = document.getElementById('igPrev');
  var igNext = document.getElementById('igNext');
  var igStatus = document.getElementById('igStatus');
  var igCarousel = document.getElementById('igCarousel');

  if(igViewport && igDots){
    var igSlides = Array.prototype.slice.call(igViewport.querySelectorAll('.ig-slide'));
    var igIndex = 0;
    var igTimer = null;
    var igReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var igAutoplayMs = 5000;

    igSlides.forEach(function(slide, i){
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', 'Post ' + (i + 1));
      dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      dot.addEventListener('click', function(){ goIg(i); });
      igDots.appendChild(dot);
    });

    var igDotButtons = Array.prototype.slice.call(igDots.querySelectorAll('button'));

    function goIg(index, userDriven){
      if(!igSlides.length) return;
      igIndex = (index + igSlides.length) % igSlides.length;
      igViewport.scrollTo({
        left: igIndex * igViewport.clientWidth,
        behavior: igReducedMotion ? 'auto' : 'smooth'
      });
      igDotButtons.forEach(function(btn, i){
        btn.setAttribute('aria-selected', i === igIndex ? 'true' : 'false');
      });
      if(igStatus){
        igStatus.textContent = 'Showing Instagram post ' + (igIndex + 1) + ' of ' + igSlides.length;
      }
      if(userDriven) restartIgAutoplay();
    }

    function syncIgFromScroll(){
      if(!igViewport.clientWidth) return;
      var nearest = Math.round(igViewport.scrollLeft / igViewport.clientWidth);
      if(nearest < 0) nearest = 0;
      if(nearest >= igSlides.length) nearest = igSlides.length - 1;
      if(nearest !== igIndex){
        igIndex = nearest;
        igDotButtons.forEach(function(btn, i){
          btn.setAttribute('aria-selected', i === igIndex ? 'true' : 'false');
        });
        if(igStatus){
          igStatus.textContent = 'Showing Instagram post ' + (igIndex + 1) + ' of ' + igSlides.length;
        }
      }
    }

    function stopIgAutoplay(){
      if(igTimer){
        clearInterval(igTimer);
        igTimer = null;
      }
    }

    function startIgAutoplay(){
      if(igReducedMotion || igSlides.length < 2) return;
      stopIgAutoplay();
      igTimer = setInterval(function(){
        goIg(igIndex + 1);
      }, igAutoplayMs);
    }

    function restartIgAutoplay(){
      stopIgAutoplay();
      startIgAutoplay();
    }

    igPrev.addEventListener('click', function(){ goIg(igIndex - 1, true); });
    igNext.addEventListener('click', function(){ goIg(igIndex + 1, true); });

    igViewport.addEventListener('scroll', function(){
      window.requestAnimationFrame(syncIgFromScroll);
    }, { passive: true });

    igViewport.addEventListener('keydown', function(e){
      if(e.key === 'ArrowLeft'){
        e.preventDefault();
        goIg(igIndex - 1, true);
      } else if(e.key === 'ArrowRight'){
        e.preventDefault();
        goIg(igIndex + 1, true);
      }
    });

    if(igCarousel){
      igCarousel.addEventListener('mouseenter', stopIgAutoplay);
      igCarousel.addEventListener('mouseleave', startIgAutoplay);
      igCarousel.addEventListener('focusin', stopIgAutoplay);
      igCarousel.addEventListener('focusout', function(e){
        if(!igCarousel.contains(e.relatedTarget)) startIgAutoplay();
      });
    }

    window.addEventListener('resize', function(){
      goIg(igIndex);
    });

    goIg(0);
    startIgAutoplay();
  }
})();
