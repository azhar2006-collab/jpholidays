/* ===== JP HOLIDAYS — Interactive JavaScript v5.0 ===== */

document.addEventListener('DOMContentLoaded', () => {

  /* ----- Sticky Header ----- */
  const header = document.getElementById('header');
  const backToTop = document.querySelector('.back-to-top');
  const handleScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
    if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 500);
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll();

  /* ----- Mobile Navigation ----- */
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mainNav = document.querySelector('.main-nav');

  const openMobileNav = () => {
    mobileToggle?.classList.add('active');
    mainNav?.classList.add('open');
    header?.classList.add('nav-open');
    document.body.style.overflow = 'hidden';
  };

  const closeMobileNav = () => {
    mobileToggle?.classList.remove('active');
    mainNav?.classList.remove('open');
    header?.classList.remove('nav-open');
    document.body.style.overflow = '';
  };

  mobileToggle?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (mainNav?.classList.contains('open')) {
      closeMobileNav();
    } else {
      openMobileNav();
    }
  });

  // Mobile Dropdown Accordion
  const dropdownLinks = document.querySelectorAll('.nav-item.dropdown .dropdown-link');
  dropdownLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      if (window.innerWidth <= 1024) {
        e.preventDefault();
        const parent = link.closest('.nav-item.dropdown');
        parent.classList.toggle('active-mobile');
      }
    });
  });

  // Close nav on link click
  mainNav?.querySelectorAll('a:not(.dropdown-link)').forEach(link => {
    link.addEventListener('click', () => {
      closeMobileNav();
    });
  });

  // Close nav on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mainNav?.classList.contains('open')) {
      closeMobileNav();
    }
  });

  /* ----- Hero Slider ----- */
  const slides = document.querySelectorAll('.hero-slide');
  const heroDots = document.querySelectorAll('.hero-dot');
  const heroSlider = document.querySelector('.hero-slider');
  let currentSlide = 0;
  let slideInterval;

  function goToSlide(index) {
    slides.forEach((s, i) => s.classList.toggle('active', i === index));
    heroDots.forEach((d, i) => d.classList.toggle('active', i === index));
    currentSlide = index;
  }

  function nextSlide() { goToSlide((currentSlide + 1) % slides.length); }
  function prevSlide() { goToSlide((currentSlide - 1 + slides.length) % slides.length); }
  function startSlider() {
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 5000);
  }

  heroDots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      goToSlide(i);
      startSlider();
    });
  });

  // Touch Swipe Support for Mobile
  if (heroSlider) {
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    heroSlider.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    heroSlider.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;
      const diffX = touchEndX - touchStartX;
      const diffY = touchEndY - touchStartY;
      // Trigger only if horizontal swipe dominates and exceeds threshold
      if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX < 0) {
          nextSlide();
        } else {
          prevSlide();
        }
        startSlider();
      }
    }, { passive: true });
  }

  if (slides.length) { goToSlide(0); startSlider(); }

  /* ----- Animated Counters ----- */
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        const suffix = el.dataset.suffix || '';
        const step = Math.ceil(target / (2000 / 16));
        let current = 0;
        const timer = setInterval(() => {
          current += step;
          if (current >= target) { current = target; clearInterval(timer); }
          el.textContent = current.toLocaleString('en-IN') + suffix;
        }, 16);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.counter').forEach(c => counterObserver.observe(c));

  /* ----- Testimonial Slider ----- */
  const track = document.querySelector('.testimonials-track');
  const tDots = document.querySelectorAll('.testimonial-dot');
  let currentTest = 0;
  let tInterval;

  function goToTestimonial(index) {
    if (!track) return;
    track.style.transform = `translateX(-${index * 100}%)`;
    tDots.forEach((d, i) => d.classList.toggle('active', i === index));
    currentTest = index;
  }

  tDots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      clearInterval(tInterval);
      goToTestimonial(i);
      tInterval = setInterval(() => goToTestimonial((currentTest + 1) % tDots.length), 6000);
    });
  });

  if (tDots.length) {
    goToTestimonial(0);
    tInterval = setInterval(() => goToTestimonial((currentTest + 1) % tDots.length), 6000);
  }

  /* ----- Wishlist Hearts ----- */
  document.querySelectorAll('.dest-wishlist').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      btn.classList.toggle('liked');
      const icon = btn.querySelector('i');
      icon.classList.toggle('fa-regular');
      icon.classList.toggle('fa-solid');
    });
  });

  /* ----- Scroll Reveal ----- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach((el, i) => {
    el.style.transitionDelay = `${i % 3 * 0.12}s`;
    revealObserver.observe(el);
  });

  /* ----- Smooth Scroll ----- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = header.offsetHeight + 10;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ----- Back to Top ----- */
  backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ----- Interactive Search & Package Filtering ----- */
  const searchForm = document.querySelector('.search-bar');
  const searchDestInput = document.getElementById('search-dest');
  const searchTypeSelect = document.getElementById('search-type');
  const searchDurationSelect = document.getElementById('search-duration');

  function filterPackages(isSubmit = false) {
    const destQuery = searchDestInput?.value.trim().toLowerCase() || '';
    const typeQuery = searchTypeSelect?.value || 'all';
    const durationQuery = searchDurationSelect?.value || 'any';

    const cards = document.querySelectorAll('.dest-card, .package-card');
    let matchCount = 0;

    cards.forEach(card => {
      const textContent = card.textContent.toLowerCase();
      const keywords = (card.dataset.keywords || '').toLowerCase();
      const cardType = (card.dataset.type || '').toLowerCase();
      const cardDuration = (card.dataset.duration || '').toLowerCase();

      // Destination / Keyword matching
      const matchesDest = !destQuery || textContent.includes(destQuery) || keywords.includes(destQuery);
      
      // Type matching
      const matchesType = (typeQuery === 'all') || cardType.includes(typeQuery) || textContent.includes(typeQuery);

      // Duration matching
      const matchesDuration = (durationQuery === 'any') || cardDuration.includes(durationQuery);

      if (matchesDest && matchesType && matchesDuration) {
        card.style.display = '';
        card.classList.remove('filtered-out');
        matchCount++;
      } else {
        card.style.display = 'none';
        card.classList.add('filtered-out');
      }
    });

    if (isSubmit) {
      if (matchCount > 0) {
        // Scroll smoothly to matching results
        const targetSec = document.getElementById('packages') || document.getElementById('destinations');
        if (targetSec) {
          const offset = (header?.offsetHeight || 70) + 10;
          const top = targetSec.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      } else if (destQuery) {
        // If custom search destination (e.g. Bali, Maldives, Singapore, Kashmir) has no featured card,
        // automatically open the Enquiry Form prefilled with their destination!
        const formattedDest = searchDestInput.value.trim();
        openEnquiryModal(formattedDest);
      }
    }
  }

  // Live filtering on input/select changes
  searchDestInput?.addEventListener('input', () => filterPackages(false));
  searchTypeSelect?.addEventListener('change', () => filterPackages(true));
  searchDurationSelect?.addEventListener('change', () => filterPackages(true));

  searchForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    filterPackages(true);
  });

  /* ----- Tour Data & Details Modal ----- */
  const tourData = {
    "valparai-group": {
      title: "Valparai Group Escape",
      tripId: "JP-152/VALPARAI",
      dates: "17 – 20 October 2026",
      groupSize: "16 Adults (4 Rooms – Four Sharing)",
      transport: "17-Seater Tempo Traveller",
      badge: "GROUP ESCAPE • 3 NIGHTS / 4 DAYS",
      img: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
      price: "₹8,195",
      unit: "Per Person (Total ₹1,31,120 for 16 Adults)",
      phone: "7200669293",
      route: "Chennai → Pollachi → Valparai → Chennai (via 40 Hairpin Bends)",
      hotels: [
        "Valparai (3 Nights): Premium Hill Resort / Hotel (4 Rooms – Four Sharing)"
      ],
      itinerary: [
        { day: "Day 1 (17 Oct)", desc: "Chennai ➝ Pollachi ➝ Valparai – Early morning departure from Chennai around 5:00 AM by 17-Seater Tempo Traveller. Breakfast en route. Proceed towards Valparai via Pollachi. En route sightseeing: Monkey Falls, Aliyar Dam, Loam’s View Point & famous 40 Hairpin Bends with scenic tea estate views. Check-in to resort, evening free to relax in lush tea gardens. Overnight stay: Valparai." },
        { day: "Day 2 (18 Oct)", desc: "Valparai Sightseeing – Places covered: Nallamudi View Point, Balaji Temple, Tea Estate & Tea Factory tour*, Chinna Kallar waterfall & Sholayar Dam. Enjoy breathtaking Western Ghats panoramas and tea garden walks. Overnight stay: Valparai." },
        { day: "Day 3 (19 Oct)", desc: "Nature • Relax • Explore – Relaxed day surrounded by misty hills. Optional experiences: Grass Hills* (subject to forest dept permission), Bird Watching, Nature Walk, Tea Estate visit, evening Campfire 🔥, group games & leisure. Overnight stay: Valparai." },
        { day: "Day 4 (20 Oct)", desc: "Valparai ➝ Chennai – Breakfast and check-out. Begin scenic descent towards Chennai via Aliyar. Lunch en route. Reach Chennai late night with wonderful hill station memories." }
      ],
      inclusions: [
        "3 Nights Hotel / Resort Stay (4 Rooms, Four Sharing)",
        "17-Seater Tempo Traveller for the entire 4-day trip",
        "Chennai – Valparai – Chennai transportation",
        "Sightseeing as mentioned in the itinerary",
        "Driver allowance, toll & fuel charges for included services"
      ],
      exclusions: [
        "Food & meals",
        "Van parking charges",
        "Entry tickets, if applicable",
        "Activity charges, if applicable",
        "Personal expenses",
        "Anything not specifically mentioned under inclusions"
      ],
      notes: [
        "Tea Factory visit is subject to availability.",
        "Grass Hills visit is subject to Forest Department permission.",
        "Sightseeing may be adjusted depending on local weather, road permissions and operational feasibility."
      ]
    },
    "maldives-yearend": {
      title: "Maldives Year-End Special (Maafushi)",
      dates: "29 December 2026 – 02 January 2027",
      groupSize: "2 Adults (Curated for Mr. Gaurav & Family)",
      transport: "Return Speedboat Transfers (SIC Basis)",
      badge: "YEAR-END SPECIAL • 4 NIGHTS / 5 DAYS",
      img: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=1200&q=80",
      price: "₹1,20,230",
      unit: "Per Room (Arena Beach) | ₹1,21,450 (Kaani Grand)",
      phone: "7200669293",
      route: "Velana International Airport ↔ Maafushi Island, Maldives",
      options: [
        { title: "Option 1 – Kaani Grand Sea View", desc: "Deluxe Double Room with Sea View & Balcony, Half Board (Breakfast & Dinner), Return Speedboat Transfers (SIC)", price: "₹1,21,450/- per room" },
        { title: "Option 2 – Arena Beach", desc: "Premium Double Room with Sea View & Balcony, Half Board (Breakfast & Dinner), Return Speedboat Transfers (SIC)", price: "₹1,20,230/- per room" }
      ],
      hotels: [
        "Maafushi Island (4 Nights): Kaani Grand Sea View (Deluxe Room Sea View & Balcony) OR Arena Beach (Premium Room Sea View & Balcony)"
      ],
      itinerary: [
        { day: "Day 1 (29 Dec)", desc: "Arrival in Maldives • Maafushi – Arrive at Velana International Airport, meet JP Holidays representative. Transfer to Maafushi by Speedboat (SIC basis). Hotel check-in, relax and enjoy the island. Evening at leisure & dinner at hotel. Overnight: Maafushi." },
        { day: "Day 2 (30 Dec)", desc: "Snorkeling • Sandbank • Dolphin Cruise (10:00 AM – 3:00 PM) – Fantastic half-day excursion: Biyadhoo Reef snorkeling, Turtle Reef snorkeling, Sandbank tour with delicious lunch on the sandbank, dolphin cruise, snorkeling equipment, photography, water, soft drinks & beach towel. Return around 3:00 PM. Evening beach time & shopping. Overnight: Maafushi." },
        { day: "Day 3 (31 Dec)", desc: "Maafushi • New Year's Eve Celebration 🎆 – Breakfast at hotel. Morning at leisure to explore Maafushi Island and beach. Optional water sports. In the evening, get ready to celebrate the arrival of 2027 in the Maldives! Festive countdown party, beach lights & Half Board festive dinner. Overnight: Maafushi." },
        { day: "Day 4 (01 Jan)", desc: "Happy New Year 2027 • Leisure Day 🎉 – Relaxed breakfast. Enjoy the turquoise lagoons of Maafushi, swimming, island strolls, sunset photography & dinner at hotel. Overnight: Maafushi." },
        { day: "Day 5 (02 Jan)", desc: "Maafushi • Airport Transfer • Departure – Breakfast at hotel, check-out. Speedboat transfer to Velana International Airport for onward journey with beautiful memories." }
      ],
      inclusions: [
        "4 Nights accommodation (Kaani Grand Sea View or Arena Beach)",
        "Half Board meal plan (Daily Breakfast & Dinner)",
        "Return Speedboat Transfers (Velana Airport ↔ Maafushi) on SIC Basis",
        "Biyadhoo Reef Snorkeling + Turtle Reef Snorkeling",
        "Sandbank Tour + Dolphin Watching Cruise",
        "Snorkeling Equipment & High-Resolution Photography",
        "Lunch on the Sandbank + Water & Soft Drinks + Beach Towel",
        "All applicable Maldives government taxes & service charges"
      ],
      exclusions: [
        "International flight tickets",
        "Maldives Green Tax / city levies (if applicable)",
        "Lunch on non-excursion days & alcohol",
        "Optional motorized water sports & diving",
        "Personal expenses & travel insurance"
      ],
      notes: [
        "Curated specially for Mr. Gaurav & Family by Jovita Prince (Founder - JP Holidays).",
        "Rates are subject to room availability at the time of final confirmation."
      ]
    },
    "pilgrimage-kashi-gaya": {
      title: "Sacred Pilgrimage Tour – Varanasi, Prayagraj, Ayodhya & Gaya",
      dates: "25th – 29th November 2026",
      groupSize: "6 Adults (3 Double-Sharing Rooms)",
      transport: "Innova Crysta for Road Sectors + Train to Gaya",
      badge: "SACRED PILGRIMAGE • 4 NIGHTS / 5 DAYS",
      img: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80",
      price: "₹24,340",
      unit: "Per Person (Total ₹1,46,040 for 6 Adults)",
      phone: "7200669293",
      route: "Varanasi (2N) → Prayagraj → Ayodhya (1N) → Gaya / Bodhgaya (1N)",
      hotels: [
        "Varanasi (2 Nights): Premium 3★ Hotel (3 Double Rooms, Breakfast & Dinner)",
        "Ayodhya (1 Night): Premium 3★ Hotel (3 Double Rooms, Breakfast & Dinner)",
        "Bodhgaya / Gaya (1 Night): Premium 3★ Hotel (3 Double Rooms, Breakfast & Dinner)"
      ],
      itinerary: [
        { day: "Day 1 (25 Nov)", desc: "Arrival in Varanasi – Arrive at Varanasi Airport at 6:30 PM. Transfer & check-in at hotel, dinner & overnight stay in Varanasi." },
        { day: "Day 2 (26 Nov)", desc: "Full Day Varanasi Divine Darshan – Sacred darshan at Shri Kashi Vishwanath Temple, Annapurna Devi Temple & Kaal Bhairav Temple. Morning/evening sacred Ganga boating & visit other important heritage temples. Dinner & overnight in Varanasi." },
        { day: "Day 3 (27 Nov)", desc: "Varanasi ➝ Prayagraj ➝ Ayodhya – Depart Varanasi by road (approx. 2.5–3 hrs drive). Prayagraj: Sacred Triveni Sangam boat ride, Hanuman Temple & Anand Bhavan. Continue by road to Ayodhya (approx. 3.5–4 hrs drive). Ayodhya: Hanuman Garhi, Ram Ki Paidi & Naya Sarayu Ghat. Dinner & overnight stay in Ayodhya." },
        { day: "Day 4 (28 Nov)", desc: "Ayodhya ➝ Gaya – Early morning auspicious darshan at Ram Lalla Temple. Proceed to railway station for the 11:30 AM train to Gaya. Arrive in Gaya at night, transfer & check-in at hotel, dinner & overnight stay in Bodhgaya/Gaya." },
        { day: "Day 5 (29 Nov)", desc: "Gaya Rituals ➝ Departure – Perform traditional sacred Pinda Daan rituals at holy Vishnupad Temple. Complete pilgrimage rites. 11:30 AM transfer to Gaya Airport for onward journey with divine blessings." }
      ],
      inclusions: [
        "Innova Crysta for all road sectors & sightseeing",
        "4 Nights accommodation in 3 Double-sharing rooms",
        "Daily Breakfast & Dinner at all hotels",
        "Ganga boat ride in Varanasi & Triveni Sangam boat ride in Prayagraj",
        "VIP assistance for temple darshans as per itinerary",
        "Gaya railway station pickup & Gaya airport drop"
      ],
      exclusions: [
        "Train tickets Ayodhya to Gaya & airfare",
        "Pooja, Pinda Daan priest charges (dakshina) & special darshan passes",
        "Lunch and meals outside breakfast & dinner",
        "Personal expenses & porterage"
      ],
      notes: [
        "Travel dates fall around the Diwali period, so hotel and travel tariffs reflect peak festive rates.",
        "Itinerary schedule may be fine-tuned based on train timings and temple darshan slots."
      ]
    },
    "spain-portugal": {
      title: "Spain & Portugal Escape",
      tripId: "JP-137",
      dates: "24 December 2026 – 01 January 2027",
      groupSize: "7 Adults (02 Standard Minivans)",
      transport: "02 Private Standard Minivans for all included transfers",
      badge: "EUROPE ESCAPE • 8 NIGHTS / 9 DAYS",
      img: "https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=1200&q=80",
      price: "₹1,32,670",
      unit: "Per Person (Triple Sharing) | ₹1,34,860 (Double/Twin)",
      phone: "7200669293",
      route: "Lisbon (3N) → Madrid (2N) → Barcelona (3N)",
      options: [
        { title: "Double / Twin Sharing (4 Adults)", desc: "Stay in standard double/twin rooms across Lisbon, Madrid & Barcelona with daily breakfast", price: "₹1,34,860 per person" },
        { title: "Triple Sharing (3 Adults)", desc: "Stay in spacious triple standard rooms across Lisbon, Madrid & Barcelona with daily breakfast", price: "₹1,32,670 per person" },
        { title: "Optional Madrid ➝ Barcelona Train", desc: "High-speed 2nd Class Train ticket (subject to availability at issuance)", price: "€90 (approx. ₹9,996) per adult" }
      ],
      hotels: [
        "Lisbon (3 Nights, 24–27 Dec): Fenicius Charme Hotel / Similar (1 Triple + 2 Twin Rooms, Daily Breakfast)",
        "Madrid (2 Nights, 27–29 Dec): Acta Pirámides / Similar (2 Double/Twin + 1 Triple Room, Daily Breakfast)",
        "Barcelona (3 Nights, 29 Dec–01 Jan): Hotel Sant Pau / Similar (2 Double + 1 Triple Room, Daily Breakfast)"
      ],
      itinerary: [
        { day: "Day 1 (24 Dec)", desc: "Arrival in Lisbon 🇵🇹 – Arrive at Lisbon Airport, meet representative. Private airport transfer by 2 minivans to hotel. Check-in and relax. Spend evening at leisure soaking in Lisbon's Christmas lights. Overnight: Lisbon." },
        { day: "Day 2 (25 Dec)", desc: "Lisbon Private Tuk-Tuk City Tour – After breakfast, enjoy a Private Tuk-Tuk City Tour with a Local Guide. Discover Lisbon's historic quarters, Alfama, miradouros viewpoints & iconic landmarks during the festive Christmas atmosphere. Overnight: Lisbon." },
        { day: "Day 3 (26 Dec)", desc: "Sintra • Pena Palace • Cabo da Roca • Cascais – Full-day shared excursion. Visit fairytale Sintra, Pena Park and Pena Palace (entrance included), mysterious Quinta da Regaleira (entrance included), dramatic cliffs of Cabo da Roca & seaside Cascais. Return to Lisbon. Overnight: Lisbon." },
        { day: "Day 4 (27 Dec)", desc: "Lisbon ➝ Madrid 🇪🇸 – Breakfast, check out. Private transfer to Lisbon Airport/Station. Proceed to Madrid. Arrive in Madrid, private transfer to hotel. Check-in and spend rest of day exploring Puerta del Sol and Gran Vía. Overnight: Madrid." },
        { day: "Day 5 (28 Dec)", desc: "Madrid City Exploration – 24-Hour Madrid Hop-On Hop-Off Bus Tour. Prado Museum entrance ticket included! Explore grand avenues, Plaza Mayor, Royal Palace exterior, and lively tapas bars. Overnight: Madrid." },
        { day: "Day 6 (29 Dec)", desc: "Madrid ➝ Barcelona – Breakfast, check-out. Private transfer to Madrid Station. High-speed train to Barcelona. Arrive Barcelona, private station transfer to Hotel Sant Pau. Check-in and relax. Overnight: Barcelona." },
        { day: "Day 7 (30 Dec)", desc: "Barcelona City Tour – 24-Hour Barcelona Hop-On Hop-Off Bus Tour. Iconic Sagrada Familia entry ticket included! Marvel at Gaudí's masterpiece, explore Gothic Quarter and Passeig de Gràcia. Overnight: Barcelona." },
        { day: "Day 8 (31 Dec)", desc: "Montserrat Excursion + New Year's Eve 🎆 – Shared half-day tour to spectacular Montserrat mountain monastery. Cogwheel train ascent & La Moreneta Black Madonna access included. Return to Barcelona. Evening at leisure: Welcome 2027 with Barcelona's spectacular New Year's Eve street celebrations! Overnight: Barcelona." },
        { day: "Day 9 (01 Jan)", desc: "Barcelona Departure – Final breakfast at hotel. Check out. Private hotel transfer to Barcelona Airport by minivans for onward flight home." }
      ],
      inclusions: [
        "8 Nights Hotel Accommodation (Lisbon 3N, Madrid 2N, Barcelona 3N)",
        "Daily Breakfast at all hotels",
        "Private Transfers by 02 Standard Minivans (Lisbon Airport ↔ Hotel, Madrid Airport ↔ Hotel ↔ Station, Barcelona Station ↔ Hotel ↔ Airport)",
        "Private Tuk-Tuk City Tour with Local Guide in Lisbon",
        "Full-Day Sintra, Pena Palace & Quinta da Regaleira Tour with Entrance Tickets",
        "24-Hour Madrid Hop-On Hop-Off Bus Pass",
        "Prado Museum Entrance Ticket",
        "24-Hour Barcelona Hop-On Hop-Off Bus Pass",
        "Sagrada Familia Entry Ticket",
        "Montserrat Half-Day Excursion with Cogwheel Train & La Moreneta Access"
      ],
      exclusions: [
        "Madrid to Barcelona Train Fare (optional at €90 / ~₹9,996 per adult)",
        "International airfare & Schengen visa charges",
        "Hotel city taxes (payable directly at the respective hotels)",
        "Airport/station transfers between 9:00 PM and 8:00 AM (20% night supplement)",
        "Lunch & dinner, driver tips, personal expenses"
      ],
      notes: [
        "INR conversion is based on approx €1 = ₹111.07 and may vary with the exchange rate at payment.",
        "Luggage allowance for minivans: 1 small handbag + 1 medium luggage per person.",
        "No rooms are blocked at quotation stage; rates subject to availability upon confirmation."
      ]
    },
    "japan-golden-route": {
      title: "Japan Golden Route 2026",
      dates: "19 – 28 October 2026",
      groupSize: "4 Adults",
      transport: "Private Toyota Alphard (7-Seater) + Shinkansen Bullet Train",
      badge: "ULTIMATE JAPAN • 9 NIGHTS / 10 DAYS",
      img: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80",
      price: "₹1,93,340",
      unit: "Per Adult (Total ₹7,73,360 for 4 Adults)",
      phone: "7200669293",
      route: "Tokyo (4N) → Mt. Fuji & Hakone → Bullet Train → Kyoto (2N) → Nara → Osaka (3N)",
      hotels: [
        "Tokyo (4 Nights, 19–23 Oct): Tmark City Hotel Tokyo Omori ⭐⭐⭐ (2 Double Rooms, Daily Breakfast)",
        "Kyoto (2 Nights, 23–25 Oct): Hotel MyStays Kyoto – Shijo ⭐⭐⭐ (2 Superior Queen Rooms, Daily Breakfast)",
        "Osaka (3 Nights, 25–28 Oct): Comfort Hotel Osaka Shinsaibashi ⭐⭐⭐ (2 Double Rooms, Daily Breakfast)"
      ],
      itinerary: [
        { day: "Day 1 (19 Oct)", desc: "Welcome to Tokyo 🇯🇵 – Narita Airport arrival, meet private driver with Toyota Alphard (7-Seater). Transfer to Tmark City Hotel Tokyo Omori, check-in and evening at leisure to rest." },
        { day: "Day 2 (20 Oct)", desc: "Tokyo Icons • Culture • City Lights – 10-Hour Private Sightseeing Tour: Meiji Shrine, Harajuku & Takeshita Street, world-famous Shibuya Crossing, historic Senso-ji Temple, Nakamise Shopping Street, Tokyo Skytree Tembo Deck panoramic views & Imperial Palace photo stop. Overnight: Tokyo." },
        { day: "Day 3 (21 Oct)", desc: "Mt. Fuji × Hakone Escape – Private full-day excursion: Breathtaking Mt. Fuji views, Owakudani geothermal valley, Lake Ashi scenic cruise & Hakone Ropeway aerial cableway. Private return transfer to Tokyo. Overnight: Tokyo." },
        { day: "Day 4 (22 Oct)", desc: "Tokyo – Your Day, Your Way – Free day to explore Tokyo at your own pace. Discover Akihabara electronics/anime hub, Ginza luxury shopping, teamLab digital art or trendy cafes. Overnight: Tokyo." },
        { day: "Day 5 (23 Oct)", desc: "Tokyo ➝ Kyoto by Bullet Train 🚄 – Private transfer to Tokyo Station. Board the high-speed Shinkansen Bullet Train (2nd Class) to Kyoto. Private station pickup and transfer to Hotel MyStays Kyoto – Shijo. Evening stroll in Gion. Overnight: Kyoto." },
        { day: "Day 6 (24 Oct)", desc: "Timeless Kyoto – 10-Hour Private Kyoto Tour: Fushimi Inari Taisha (iconic 10,000 Vermilion Torii Gates), Kiyomizu-dera hillside temple, historic Gion geisha district, Arashiyama Bamboo Grove, Kinkaku-ji (The Golden Pavilion) & Togetsukyo Bridge. Overnight: Kyoto." },
        { day: "Day 7 (25 Oct)", desc: "Kyoto ➝ Nara ➝ Osaka 🦌 – Depart Kyoto in private Alphard. Visit Nara Park with sacred Deer Feeding Experience, magnificent Todai-ji Temple (Giant Bronze Buddha), Kasuga Taisha Shrine & Naramachi historic district. Continue drive to Comfort Hotel Osaka Shinsaibashi. Overnight: Osaka." },
        { day: "Day 8 (26 Oct)", desc: "Vibrant Osaka – 10-Hour Private Osaka Tour: Majestic Osaka Castle, Kuromon Ichiba food market, bustling Shinsaibashi shopping arcade, Dotonbori neon lights & Glico running man, Namba, Umeda Sky Building Floating Garden Observatory & retro Shinsekai with Tsutenkaku Tower. Overnight: Osaka." },
        { day: "Day 9 (27 Oct)", desc: "Universal Studios Japan 🎢 – Full day thrills at Universal Studios Japan! 1-Day Studio Pass included. Private round-trip Alphard transfers. Experience Super Nintendo World, The Wizarding World of Harry Potter & exciting rollercoasters. Overnight: Osaka." },
        { day: "Day 10 (28 Oct)", desc: "Sayonara Japan 🇯🇵 – Relaxed breakfast, hotel check-out. Private Alphard transfer to Osaka International Airport for your departure flight with unforgettable memories of Japan." }
      ],
      inclusions: [
        "9 Nights 3★ Accommodation (Tokyo 4N, Kyoto 2N, Osaka 3N) with Daily Breakfast",
        "Private Toyota Alphard 7-Seater throughout all transfers & sightseeing tours",
        "Tokyo to Kyoto Shinkansen Bullet Train Tickets (2nd Class)",
        "Tokyo Skytree Tembo Deck Entrance Ticket",
        "Mt. Fuji & Hakone Excursion with Lake Ashi Cruise & Ropeway Pass",
        "Universal Studios Japan 1-Day Studio Pass",
        "Nara Park Deer Feeding Experience",
        "Umeda Sky Building & Osaka Castle Admission Tickets",
        "Driver accommodation, meals, fuel, tolls & parking for all included services"
      ],
      exclusions: [
        "International airfare & Japan tourist visa charges",
        "Travel insurance",
        "Hotel city taxes (payable directly at hotels)",
        "Lunch & dinner",
        "Driver tips & personal expenses",
        "Overtime vehicle usage beyond 10 hours/day"
      ],
      notes: [
        "October offers ideal autumn weather with crisp air, comfortable temperatures and clear views of Mt. Fuji.",
        "TCS, GST & government levies extra as applicable."
      ]
    },
    "kuala-lumpur-getaway": {
      title: "Kuala Lumpur Girls' Getaway",
      dates: "11 August – 15 August 2026",
      groupSize: "02 Adults (Ladies Special)",
      transport: "Private AC Vehicle Transfers + SIC City Tour",
      badge: "GIRLS' GETAWAY • 4 NIGHTS / 5 DAYS",
      img: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1200&q=80",
      price: "₹75,950",
      unit: "Total for 2 Adults (₹37,975 per person)",
      phone: "7200669293",
      route: "Kuala Lumpur International Airport ↔ Upper View Regalia Hotel ↔ Genting Highlands",
      hotels: [
        "Kuala Lumpur (4 Nights): Upper View Regalia Hotel – 4★ (Deluxe Double Room, Daily Breakfast)"
      ],
      itinerary: [
        { day: "Day 1 (11 Aug)", desc: "Welcome to Kuala Lumpur 🛬 – Arrive at KLIA, meet private driver and transfer to Upper View Regalia Hotel (4★). Check-in and relax. Evening: Kuala Lumpur Night City Tour with KL Tower Observation Deck ticket included – enjoy 360° panoramic views of Malaysia's glittering skyline. Overnight: Kuala Lumpur." },
        { day: "Day 2 (12 Aug)", desc: "Petronas Twin Towers Experience 🏙️ – Breakfast at hotel. Leisure day for shopping at Suria KLCC and Bukit Bintang cafes. Evening visit to the iconic Petronas Twin Towers with Sky Bridge and 86th floor Observation Deck entrance ticket included. Capture unforgettable pictures. Overnight: Kuala Lumpur." },
        { day: "Day 3 (13 Aug)", desc: "Genting Highlands Adventure 🎢 – Private transfer to the cool misty mountain retreat of Genting Highlands. Scenic Two-Way Cable Car ride + Genting SkyWorlds Theme Park ticket included! Enjoy world-class rides, rainforest scenery, casino & premier shopping. Return to KL. Overnight: Kuala Lumpur." },
        { day: "Day 4 (14 Aug)", desc: "Kuala Lumpur City Discovery Tour 🏛️ – 3.5-hour city tour covering the National Mosque, King’s Palace photo stop, Independence Square, National Monument, Cocoa Boutique & local shopping spots. Rest of day free for spa & shopping. Overnight: Kuala Lumpur." },
        { day: "Day 5 (15 Aug)", desc: "Departure with Beautiful Memories ✈️ – Breakfast at hotel, check-out and private transfer to Kuala Lumpur International Airport for your return flight." }
      ],
      inclusions: [
        "04 Nights Accommodation at Upper View Regalia Hotel (4★ Deluxe Double Room)",
        "Daily Breakfast at hotel",
        "Private Airport Arrival & Departure Transfers",
        "KL Tower Observation Deck Entrance Ticket",
        "Petronas Twin Towers Sky Bridge & Observation Deck Ticket",
        "Kuala Lumpur Night City Tour",
        "Genting Highlands Excursion with Two-Way Cable Car Ride",
        "Genting SkyWorlds Theme Park Entrance Ticket",
        "3.5-Hour SIC Kuala Lumpur City Tour",
        "All transfers in Air-Conditioned Vehicle"
      ],
      exclusions: [
        "International airfare",
        "Malaysia Visa & Tourism Taxes",
        "Entry Permit Form Filling (₹300 for 2 Pax)",
        "GST, travel insurance & meals not mentioned",
        "Tips, porterage & personal expenses"
      ],
      notes: [
        "Exchange rate based on 1 MYR ≈ ₹25 (current rate + ₹1 markup).",
        "Rates valid for 24 hours only and subject to room availability.",
        "100% cancellation charges apply within 21 days prior to arrival."
      ]
    },
    "phuket-luxury": {
      title: "Phuket Escape – 5-Star Luxury & Island Adventure",
      dates: "18 – 22 November 2026",
      groupSize: "2 Adults (Curated for Nakul & Friend)",
      transport: "Private Airport Transfers + Speed Boat & Big Boat Tours",
      badge: "5-STAR LUXURY • 4 NIGHTS / 5 DAYS",
      img: "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=1200&q=80",
      price: "₹45,450",
      unit: "Per Person (Total ₹90,900 for 2 Adults)",
      phone: "7200669293",
      route: "Phuket International Airport ↔ Amari Phuket 5★ ↔ Phi Phi & James Bond Islands",
      hotels: [
        "Phuket (4 Nights): Amari Phuket ⭐⭐⭐⭐⭐ (Superior Balcony Room, Double Occupancy, Daily Breakfast)"
      ],
      itinerary: [
        { day: "Day 1 (18 Nov)", desc: "Arrive • Check-in • Unwind 🌊 – Arrive at Phuket International Airport, meet private driver and transfer to the luxury 5-star Amari Phuket resort overlooking Patong Bay. Check into Superior Balcony Room and spend the evening enjoying resort amenities and sunset ocean views. Overnight: Phuket." },
        { day: "Day 2 (19 Nov)", desc: "Phi Phi + Khai Islands Speed Boat Tour 🏝️ – Private transfer to pier. Board high-speed boat to Phi Phi Don, Phi Phi Leh & Khai Islands. Snorkel in turquoise coral lagoons, swim with tropical fish and enjoy an island buffet lunch. Return transfer to resort. Overnight: Phuket." },
        { day: "Day 3 (20 Nov)", desc: "Phuket • Culture • Views • Tigers 🐯 – Private round-trip tour: Visit revered Wat Chalong temple, colorful Sino-Portuguese architecture in Phuket Old Town, panoramic Karon Viewpoint, the majestic Big Buddha & Tiger Park with Medium Tiger interaction experience included! Overnight: Phuket." },
        { day: "Day 4 (21 Nov)", desc: "James Bond Island Adventure 🛶 – Private transfer to pier. Big Boat tour through Phang Nga Bay, sea canoeing through hidden sea caves & limestone cliffs of James Bond Island (Koh Tapu). National Park Fee included! Return transfer to hotel. Overnight: Phuket." },
        { day: "Day 5 (22 Nov)", desc: "Check-out • Fly Home ✈️ – Relaxed breakfast overlooking the bay, check-out and private transfer to Phuket International Airport for your return flight." }
      ],
      inclusions: [
        "4 Nights Luxury Stay at Amari Phuket – 5 Star (Superior Balcony Room)",
        "Daily Breakfast for 2 Adults",
        "Private Airport Transfers (Round-Trip)",
        "Phi Phi + Khai Islands Speed Boat Tour with Island Buffet Lunch",
        "Phuket Cultural City Tour (Wat Chalong, Old Town, Karon Viewpoint, Big Buddha)",
        "Tiger Park Entrance – Medium Tiger Experience",
        "James Bond Island Big Boat Tour + Sea Canoeing",
        "James Bond National Park Fee Included",
        "Applicable hotel taxes and service charges"
      ],
      exclusions: [
        "Phi Phi National Park Fee (payable on spot, approx 400 THB/pax)",
        "International airfare, Thailand Visa & travel insurance",
        "Meals not specifically mentioned",
        "Hotel security deposit (refundable at check-out)",
        "Personal expenses & guide tips"
      ],
      notes: [
        "Quoted rates valid for 10 days; subject to room availability at booking.",
        "Maya Bay seasonal closure (Aug–Sep) does not affect November travel dates.",
        "Speed-boat island tours are not recommended for senior citizens or expectant mothers."
      ]
    },
    "srilanka-pdf": {
      title: "Sri Lanka Escape",
      badge: "HILLS & BEACHES • 4 NIGHTS / 5 DAYS",
      img: "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=1200&q=80",
      price: "₹25,450",
      unit: "Per Person",
      phone: "7200669293",
      route: "Kandy (1N Hotel Devon) → Nuwara Eliya (1N Sarlsburg) → Bentota (1N Hibiscus) → Colombo (1N Nally Marin)",
      itinerary: [
        { day: "Day 1", desc: "Arrival Bandaranaike Airport → Kandy. Pinnawala Elephant Orphanage, Spice Garden, Gem Museum, Temple of Sacred Tooth Relic, Royal Botanical Garden & Kandyan Cultural Dance Show. Overnight Kandy." },
        { day: "Day 2", desc: "Kandy → Nuwara Eliya. Scenic mountain drive, Ramboda Waterfalls, Tea Plantation & Tea Factory Tour with tasting, Seetha Amman Temple & Hanuman Temple. Overnight Nuwara Eliya." },
        { day: "Day 3", desc: "Nuwara Eliya → Bentota. Madu River Boat Safari, Turtle Hatchery visit, optional water sports & leisure at Bentota Beach. Overnight Bentota." },
        { day: "Day 4", desc: "Bentota → Colombo. Local market shopping, Gangaramaya Temple, Independence Square & Galle Face Green promenade. Overnight Colombo." },
        { day: "Day 5", desc: "Departure – Breakfast, check-out & transfer to Bandaranaike International Airport." }
      ],
      inclusions: [
        "4 Nights Accommodation in 3★ Hotels (Devon, Sarlsburg, Hibiscus Beach, Nally Marin)",
        "Daily Breakfast & Daily Dinner (4 Breakfasts + 4 Dinners)",
        "Private Air-Conditioned Comfortable Van throughout tour",
        "Gem Museum & Spice Garden Guided Visits",
        "Tea Factory Visit & Ceylon Tea Tasting",
        "Kandyan Cultural Dance Show Entrance"
      ]
    },
    "bhutan-pdf": {
      title: "Bhutan – Land of the Thunder Dragon",
      badge: "HIMALAYAN ESCAPE • 6 NIGHTS / 7 DAYS",
      img: "https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=1200&q=80",
      price: "₹26,560",
      unit: "Per Person (Based on 6 Adults)",
      phone: "7200669293",
      route: "Bagdogra → Phuentsholing (2N Hotel Damcen) → Thimphu (3N Hotel Lotus) → Punakha → Paro (1N Hotel Ratna Samphel)",
      itinerary: [
        { day: "Day 1", desc: "Bagdogra Airport → Phuentsholing. Check in & evening at leisure. Overnight Phuentsholing." },
        { day: "Day 2", desc: "Phuentsholing → Thimphu. Complete immigration formalities, visit Milarepa Gonpa, Gedu Stupas & scenic waterfalls. Overnight Thimphu." },
        { day: "Day 3", desc: "Thimphu Sightseeing. Buddha Dordenma statue, Durga/Shiva Temple, Simply Bhutan Living Museum, National Postal Museum, Takin Preservation Centre & Kaja Throm. Overnight Thimphu." },
        { day: "Day 4", desc: "Punakha Excursion. Scenic drive via Dochula Pass, Punakha Dzong, Bhutan's longest suspension bridge, return to Thimphu." },
        { day: "Day 5", desc: "Thimphu → Paro. Trek to world-famous Tiger's Nest Monastery (Taktsang), optional traditional Hot Stone Bath. Overnight Paro." },
        { day: "Day 6", desc: "Paro → Phuentsholing. National Museum, Nemazampa, Paro Airport View Point & drive back to Phuentsholing." },
        { day: "Day 7", desc: "Departure – Exit immigration formalities & transfer to Bagdogra Airport." }
      ],
      inclusions: [
        "6 Nights Premium 3★ Accommodation (Phuentsholing, Thimphu, Paro)",
        "Twin/Double Sharing Rooms with Daily Breakfast & Dinner",
        "Comfortable Toyota Hiace Van throughout Bhutan",
        "Private Bagdogra–Phuentsholing–Bagdogra Airport Transfers",
        "Licensed English-Speaking Bhutanese Guide",
        "Bhutan Immigration & Permit Assistance + 1 Tourist SIM Card for Group Leader"
      ]
    },
    "thailand-pdf": {
      title: "Thailand Islands & City Escape",
      badge: "ISLANDS & CITY • 6 NIGHTS / 7 DAYS",
      img: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1200&q=80",
      price: "₹37,470",
      unit: "Per Person (2 Adults) | ₹31,340 Extra Bed",
      phone: "7200669293",
      route: "Phuket (1N Ashlee Hub Patong 3★) → Koh Samui (1N Chaweng Noi Pool Villa 3★) → Krabi (1N Ava Sea Resort 4★) → Pattaya (2N Seasons Pattaya 3★) → Bangkok (1N The Ecotel 3★)",
      itinerary: [
        { day: "Day 1", desc: "Arrival in Phuket – Private transfer to Ashlee Hub Patong Deluxe Room." },
        { day: "Day 2", desc: "Phuket to Koh Samui – Transfer to airport, flight to Samui, check-in at Chaweng Noi Pool Villa Deluxe Room." },
        { day: "Day 3", desc: "Koh Samui to Krabi – Flight to Krabi, transfer to Ava Sea Resort Superior Room." },
        { day: "Day 4", desc: "Krabi to Pattaya – Flight to Bangkok, transfer to Seasons Pattaya Superior Room." },
        { day: "Day 5", desc: "Pattaya Leisure – Full day relaxing on Pattaya beach & shopping." },
        { day: "Day 6", desc: "Pattaya to Bangkok – Private transfer to The Ecotel Hotel Superior Room." },
        { day: "Day 7", desc: "Departure – Hotel transfer to Bangkok Airport for return flight." }
      ],
      inclusions: [
        "6 Nights Accommodation across 5 Premier Resorts (Phuket, Koh Samui, Krabi, Pattaya, Bangkok)",
        "Daily Breakfast at all hotels",
        "Private Airport Transfers at all destinations",
        "Private Intercity Transfers",
        "Confirmed entrance tickets as per itinerary"
      ]
    },
    "finland-norway-pdf": {
      title: "Finland & Norway – The Ultimate Arctic Luxury Escape",
      dates: "04 – 15 September 2026",
      groupSize: "2 Adults (Curated Exclusively by JP Holidays)",
      transport: "Private Airport Transfers + 3 Arctic Flights + Baltic Ferry",
      badge: "ARCTIC LUXURY • 11 NIGHTS / 12 DAYS",
      img: "https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=1200&q=80",
      price: "EUR 4,779.69",
      unit: "Per Person (Incl. 5% GST & 2% TCS | EUR 9,559.38 Total)",
      phone: "7200669293",
      route: "Helsinki (2N) → Tallinn → Saariselkä Lapland (3N Glass Igloo) → Tromsø Norway (4N) → Helsinki (2N)",
      hotels: [
        "Helsinki (2 Nights, 04–06 Sept): Scandic Grand Marina",
        "Saariselkä (3 Nights, 06–09 Sept): Kakslauttanen Arctic Resort | Luxury Kelo Glass Igloo",
        "Tromsø (4 Nights, 09–13 Sept): Quality Hotel Grand Tromsø",
        "Helsinki (2 Nights, 13–15 Sept): Scandic Grand Marina"
      ],
      itinerary: [
        { day: "Day 1 (04 Sept)", desc: "Welcome to Finland 🇫🇮 – Arrive in Helsinki. Private airport transfer to Scandic Grand Marina. Spend the evening exploring Helsinki’s beautiful harbour, seaside cafés and shopping streets at your own pace. Overnight: Helsinki." },
        { day: "Day 2 (05 Sept)", desc: "A Fairytale Day in Tallinn 🇪🇪 – Breakfast at hotel. Cruise across the Baltic Sea by high-speed ferry to Estonia. Enjoy a guided walking tour through the UNESCO-listed Old Town, cobbled alleys & medieval squares. Free time for cafes & photography. Return ferry to Helsinki. Overnight: Helsinki." },
        { day: "Day 3 (06 Sept)", desc: "Helsinki to Arctic Wonderland – Breakfast. Private Helsinki City Orientation Tour, Flying Cinema Experience & Helsinki SkyWheel. Fly north to Ivalo. Private transfer to Kakslauttanen Arctic Resort. Evening Aurora Hunting on a Quad Bike through Lapland wilderness! Overnight inside your Luxury Kelo Glass Igloo." },
        { day: "Day 4 (07 Sept)", desc: "Huskies & Arctic Adventures 🐺 – Breakfast. Meet adorable huskies at an authentic Arctic husky farm. Exhilarating Husky Cart Safari through pristine Lapland pine forests. Enjoy warm berry juice, cookies and fireside tales. Overnight: Kakslauttanen Glass Igloo." },
        { day: "Day 5 (08 Sept)", desc: "Lake Inari & Chasing the Northern Lights 🚤 – Breakfast. Scenic boat cruise on the sacred Great Lake Inari. Evening magical Aurora Hunting experience by Horse Carriage under the Arctic starlit sky. Overnight: Luxury Glass Igloo." },
        { day: "Day 6 (09 Sept)", desc: "Welcome to Norway 🇳🇴 – Breakfast. Private transfer to Ivalo Airport. Fly across the Arctic border to Tromsø, the 'Capital of the Arctic'. Private transfer to Quality Hotel Grand Tromsø. Relax and explore Tromsø's vibrant waterfront and Arctic Cathedral. Overnight: Tromsø." },
        { day: "Day 7 (10 Sept)", desc: "Arctic Fjords & Coastal Paradise 🌊 – Breakfast. Discover the breathtaking Arctic Fjords. Visit the stunning island of Sommarøy with white sandy beaches, crystal-clear turquoise waters and dramatic mountain peaks. Postcard photography opportunities. Overnight: Tromsø." },
        { day: "Day 8 (11 Sept)", desc: "Norwegian Scenic Escape 🏔️ – Breakfast. Guided panoramic journey through Kvaløya (Whale Island). Enjoy a traditional Norwegian hot lunch, endless fjords, reindeer sightings and dramatic mountain viewpoints. Overnight: Tromsø." },
        { day: "Day 9 (12 Sept)", desc: "Adventure & Aurora Magic 🔥 – Breakfast. Guided Lake Cabin hike through pristine Arctic nature. Authentic bonfire experience with hearty local food & warm drinks. Evening guided Northern Lights chase tour with professional aurora photography. Overnight: Tromsø." },
        { day: "Day 10 (13 Sept)", desc: "Back to Helsinki ✈️ – Breakfast. Private transfer to Tromsø Airport. Flight back to Helsinki. Private airport transfer and hotel check-in at Scandic Grand Marina. Evening at leisure for fine dining & Esplanadi shopping. Overnight: Helsinki." },
        { day: "Day 11 (14 Sept)", desc: "Fun, Thrills & Memories 🎢 – Breakfast. Full day of excitement at Linnanmäki Amusement Park with an Unlimited Rides Pass! Rollercoasters, panoramic park views and festive memories. Overnight: Helsinki." },
        { day: "Day 12 (15 Sept)", desc: "Departure 👋 – Breakfast, check-out and private airport transfer to Helsinki Airport. Fly home with unforgettable Arctic memories and magical Northern Lights experiences." }
      ],
      inclusions: [
        "11 Nights Premium Accommodation (Scandic Grand Marina, Kakslauttanen Luxury Glass Igloo, Quality Hotel Grand Tromsø)",
        "Daily Breakfast at all hotels + Traditional Norwegian Lunch + Arctic Warm Drinks & Treats",
        "Private Airport Transfers throughout Finland and Norway",
        "Helsinki City Orientation Tour + Flying Cinema Experience + Helsinki SkyWheel",
        "Tallinn Ferry Return Cruise & UNESCO Old Town Guided Tour",
        "Aurora Hunting Quad Bike Safari in Lapland",
        "Authentic Husky Farm Visit & Husky Cart Safari",
        "Great Lake Inari Scenic Boat Cruise",
        "Aurora Horse Carriage Experience under Arctic Skies",
        "Sommarøy & Arctic Fjords Guided Tour",
        "Kvaløya Scenic Mountain Tour with Traditional Norwegian Lunch",
        "Lake Cabin Nature Hike with Fireside Bonfire Experience",
        "Evening Northern Lights Guided Chase Tour",
        "Linnanmäki Amusement Park Unlimited Ride Pass"
      ],
      exclusions: [
        "International flights to/from India",
        "Schengen visa processing fees",
        "City Taxes (payable directly at hotels upon check-in)",
        "Lunches & dinners not specifically mentioned",
        "Travel & medical insurance",
        "Personal expenses & porterage"
      ],
      notes: [
        "Base Package: EUR 4,467 per person (EUR 8,934 for 2 Adults).",
        "Add GST @ 5%: EUR 446.70 + TCS @ 2%: EUR 178.68.",
        "Grand Total Payable: EUR 9,559.38 (EUR 4,779.69 per person including GST & TCS).",
        "Quotation valid for 48 hours only, subject to hotel availability and EUR exchange rate fluctuations."
      ]
    },
    "azerbaijan-georgia-pdf": {
      title: "Azerbaijan & Georgia Escape – Business Meets Leisure",
      badge: "EURASIA ESCAPE • 8 NIGHTS / 9 DAYS",
      img: "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=1200&q=80",
      price: "₹65,992",
      unit: "Per Person (Up to ₹76,371 for 4★/5★)",
      phone: "7200669293",
      route: "Baku (Baku Boulevard, Flame Towers, Shahdag) → Tbilisi (Narikala Fortress, Sulphur Baths) → Kakheti (KTW Wine Factory)",
      itinerary: [
        { day: "Day 1", desc: "Arrive Baku – Meet & greet, private transfer, check-in, free evening at Baku Boulevard & Nizami Street." },
        { day: "Day 2", desc: "Baku City Tour – Old City (Icherisheher), Maiden Tower, Palace of Shirvanshahs, Fountain Square, Highland Park funicular, Flame Towers & Heydar Aliyev Center." },
        { day: "Day 3", desc: "Baku Leisure – Free day for shopping, cafes or optional sightseeing." },
        { day: "Day 4", desc: "Shahdag Mountain Resort – 2-Line Cable Car ride included, alpine coaster & flight transfer to Tbilisi." },
        { day: "Days 5-6", desc: "Tbilisi City Tour – Narikala Fortress Cable Car, panoramic views, Sulphur Bath District, Historic Mosque, Shardeni Street & Clock Tower." },
        { day: "Day 7", desc: "Kakheti Wine Tour – KTW Wine Factory, wine tasting, Sighnaghi, Bodbe Monastery & Tsinandali Museum." },
        { day: "Days 8-9", desc: "Leisure & Departure – Shopping in Tbilisi & private airport transfer." }
      ],
      inclusions: [
        "8 Nights Hotel Accommodation (Metro City Baku + Astoria Tbilisi or Alba/Qafqaz/Novotel)",
        "Daily Breakfast at all hotels",
        "Private Airport Transfers & Private Vehicle with English Speaking Driver/Guide",
        "Highland Park Funicular Ticket + Shahdag 2-Line Cable Car Ride",
        "Narikala Cable Car Ticket + KTW Wine Tasting in Kakheti",
        "2 Bottles of Mineral Water Per Person Daily + All Hotel Taxes"
      ]
    },
    "malaysia-pdf": {
      title: "Kuala Lumpur Escape (Malaysia)",
      badge: "CITY BREAK • 3 NIGHTS / 4 DAYS",
      img: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1200&q=80",
      price: "₹18,450",
      unit: "Per Person Double Sharing",
      phone: "7200669293",
      route: "Kuala Lumpur (Ramada Encore by Wyndham Chinatown 3★ Deluxe Room)",
      itinerary: [
        { day: "Day 1", desc: "Arrive KLIA Airport – Meet & greet, private transfer to Ramada Encore Chinatown, evening KL Night Tour." },
        { day: "Day 2", desc: "KL City Tour & KL Tower – Half-Day KL City Tour, KL Tower Sky Deck ticket, major landmarks & shopping." },
        { day: "Day 3", desc: "Batu Caves & Genting Highlands – Batu Caves photo stop, Two-Way Genting Skyway Cable Car ticket & Genting Highlands tour." },
        { day: "Day 4", desc: "Putrajaya & Departure – Putrajaya City Tour, Joy Cruise experience & private transfer to KLIA." }
      ],
      inclusions: [
        "3 Nights Accommodation at Ramada Encore by Wyndham Chinatown 3★ (Deluxe Room)",
        "Daily Breakfast at hotel",
        "Private Airport Transfers (KLIA ↔ Hotel)",
        "Kuala Lumpur Night Tour + Half-Day KL City Tour",
        "KL Tower Sky Deck Entrance Ticket",
        "Two-Way Genting Skyway Cable Car Ticket + Batu Caves Photo Stop",
        "Putrajaya City Tour + Joy Cruise Ticket"
      ]
    },
    "bali-pdf": {
      title: "Bali Escape",
      badge: "TROPICAL LUXURY • 8 NIGHTS / 9 DAYS",
      img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80",
      price: "₹43,269",
      unit: "Per Adult",
      phone: "7200669293",
      route: "Ubud (3N Dedary Resort 4★ Pool Villa) → Kuta (5N Diamond Hotel 3★ Deluxe Balcony Room)",
      itinerary: [
        { day: "Day 1", desc: "Arrival in Bali – Airport pickup, transfer to Dedary Resort Ubud 4★ One Bedroom Villa with Private Pool & Bathtub." },
        { day: "Day 2", desc: "Jungle Swing & Coffee – Unlimited swing experience, photo spots, local lunch, Balinese coffee & tea tasting." },
        { day: "Day 3", desc: "Ubud Leisure – Full day relaxing in private pool villa." },
        { day: "Day 4", desc: "ATV & Ayung Rafting – 90-min tandem ATV ride through jungle/mud tracks, Ayung River rafting with lunch, transfer to Diamond Hotel Kuta." },
        { day: "Day 5", desc: "Nusa Penida West Island Tour – Speedboat transfer, Kelingking Beach viewpoint, Angel's Billabong, Broken Bay, Bubu Beach & local lunch." },
        { day: "Day 6", desc: "Kuta Leisure – Beach relaxation, cafes & shopping." },
        { day: "Day 7", desc: "Uluwatu Sunset & Kecak Dance – Uluwatu Cliff Temple sunset & Kecak Fire Dance show." },
        { day: "Day 8", desc: "Kintamani & Mount Batur – Kintamani viewpoint, Mount & Lake Batur, Coffee Plantation, Ubud Palace & Art Market." },
        { day: "Day 9", desc: "Departure – Breakfast, check-out & private airport transfer." }
      ],
      inclusions: [
        "3 Nights Dedary Resort Ubud 4★ Private Pool Villa + 5 Nights Diamond Hotel Kuta 3★",
        "Daily Breakfast at resorts",
        "Private Airport Transfers + Private Sightseeing Transportation",
        "Bali Jungle Swing + 90-Min ATV Tandem Ride + Ayung River Rafting with Lunch",
        "Nusa Penida West Speedboat Tour with Local Lunch",
        "Uluwatu Temple & Kecak Fire Dance Show + Kintamani Mount Batur Tour"
      ]
    },
    "kenya-pdf": {
      title: "Kenya Safari Escape",
      badge: "WILDLIFE SAFARI • 6 NIGHTS / 7 DAYS",
      img: "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=1200&q=80",
      price: "USD 2,250",
      unit: "Per Person (USD 2,480 for 4x4 Land Cruiser)",
      phone: "7200669293",
      route: "Nairobi (1N Hotel Boulevard HB) → Masai Mara (2N Drunken Elephant Camp FB) → Lake Naivasha (1N Blooming Suites FB) → Amboseli (2N Sentrim Lodge FB)",
      itinerary: [
        { day: "Day 1", desc: "Arrive Nairobi International Airport – Meet & greet, private transfer, dinner & overnight Hotel Boulevard." },
        { day: "Day 2", desc: "Nairobi to Masai Mara – 07:30 AM pickup, drive to Masai Mara, lodge check-in, lunch, afternoon game drive & dinner Drunken Elephant Camp." },
        { day: "Day 3", desc: "Full-Day Masai Mara Safari – Morning & afternoon game drives across savanna for Great Migration & Big Five with packed lunch." },
        { day: "Day 4", desc: "Masai Mara to Lake Naivasha – Drive to Naivasha, lunch, 1-hour Lake Naivasha boat ride & dinner Blooming Suites." },
        { day: "Days 5-6", desc: "Amboseli National Park – Drive to Amboseli, game drives with Mt. Kilimanjaro views, full-day wildlife exploration & dinner Sentrim Lodge." },
        { day: "Day 7", desc: "Drive to Nairobi – Lunch at local restaurant, transfer to JKIA airport for departure flight." }
      ],
      inclusions: [
        "Full Board Safari Accommodation (Nairobi, Masai Mara, Lake Naivasha, Amboseli)",
        "Private Game Drives in Toyota Land Cruiser / Safari Minivan with Pop-up Roof",
        "All National Park Entrance Fees & Government Taxes",
        "1-Hour Lake Naivasha Boat Ride",
        "1-Litre Mineral Water Per Person/Day in Safari Vehicle"
      ]
    },
    "kashmir-pdf": {
      title: "The Grand Kashmir & Vaishno Devi Katra Tour",
      badge: "PILGRIMAGE & PARADISE • 7 NIGHTS / 8 DAYS",
      img: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=80",
      price: "₹76,340",
      unit: "Total Package for 3 Adults (1 Triple Room)",
      phone: "7200669293",
      route: "Jammu Airport → Katra (2N) → Pahalgam (1N) → Srinagar (2N) → Gulmarg (1N) → Sonamarg (1N) → Srinagar Airport Drop",
      hotels: [
        "Katra (2 Nights): Hotel Zone Connect by Park Katra / Similar (3★)",
        "Pahalgam (1 Night): Hotel Grand Salween / Similar (3★)",
        "Srinagar (2 Nights): Hotel The Oriental Mansion / Similar (3★)",
        "Gulmarg (1 Night): Hotel Zahgeer Continental / Similar (3★)",
        "Sonamarg (1 Night): Hotel Thajwas Glacier / Similar (3★)"
      ],
      itinerary: [
        { day: "Day 1", desc: "Jammu ➝ Katra – Arrival at Jammu Airport and private transfer to Katra. Check-in at hotel and enjoy leisure time. Overnight Stay: Katra." },
        { day: "Day 2", desc: "Katra | Vaishno Devi Darshan – Proceed for the holy Mata Vaishno Devi Darshan pilgrimage. Return to Katra after darshan. Overnight Stay: Katra." },
        { day: "Day 3", desc: "Katra ➝ Pahalgam – Drive towards the breathtaking valley of Pahalgam. Enjoy scenic mountain landscapes and explore local surroundings. Overnight Stay: Pahalgam." },
        { day: "Day 4", desc: "Pahalgam ➝ Srinagar – Proceed to Srinagar after breakfast. Enjoy a local city tour and explore the beautiful surroundings & Dal Lake. Overnight Stay: Srinagar." },
        { day: "Day 5", desc: "Srinagar ➝ Gulmarg – Proceed towards Gulmarg, the world-famous 'Meadow of Flowers.' Enjoy spectacular mountain scenery and optional activities. Overnight Stay: Gulmarg." },
        { day: "Day 6", desc: "Gulmarg ➝ Sonamarg – After breakfast, drive towards Sonamarg, the majestic 'Meadow of Gold.' Enjoy pristine scenic beauty and leisure time. Overnight Stay: Sonamarg." },
        { day: "Day 7", desc: "Sonamarg ➝ Srinagar – Proceed to Srinagar. Enjoy local shopping and leisure time. Explore vibrant markets and shop for Kashmir handicrafts & souvenirs. Overnight Stay: Srinagar." },
        { day: "Day 8", desc: "Srinagar | Departure – After breakfast, check out and transfer to Srinagar Airport for your onward journey with unforgettable memories of Kashmir. ❤️" }
      ],
      inclusions: [
        "07 Nights Accommodation in 3★ Hotels",
        "1 Triple Room for 3 Adults",
        "Daily Breakfast & Dinner",
        "Private Sedan for Entire Tour Sightseeing & Transfers",
        "Jammu Airport Pickup & Srinagar Airport Drop",
        "Complimentary Shikara Ride on Dal Lake",
        "Traditional Kashmiri Kehwa & Shawl Welcome",
        "Guidance Throughout the Journey & 24/7 Assistance"
      ],
      exclusions: [
        "Airfare (Domestic/International)",
        "Lunch and meals outside stated meal plan",
        "Vaishno Devi Pony / Palki / Helicopter Charges",
        "Gondola Tickets in Gulmarg",
        "Local Union Taxi Charges wherever applicable",
        "Entry Tickets & Activity Charges",
        "Personal Expenses & Anything not mentioned above"
      ]
    },
    "kashmir-katra-pdf": {
      title: "The Grand Kashmir & Vaishno Devi Katra Tour",
      badge: "PILGRIMAGE & PARADISE • 7 NIGHTS / 8 DAYS",
      img: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=80",
      price: "₹76,340",
      unit: "Total Package for 3 Adults (1 Triple Room)",
      phone: "7200669293",
      route: "Jammu Airport → Katra (2N) → Pahalgam (1N) → Srinagar (2N) → Gulmarg (1N) → Sonamarg (1N) → Srinagar Airport Drop",
      hotels: [
        "Katra (2 Nights): Hotel Zone Connect by Park Katra / Similar (3★)",
        "Pahalgam (1 Night): Hotel Grand Salween / Similar (3★)",
        "Srinagar (2 Nights): Hotel The Oriental Mansion / Similar (3★)",
        "Gulmarg (1 Night): Hotel Zahgeer Continental / Similar (3★)",
        "Sonamarg (1 Night): Hotel Thajwas Glacier / Similar (3★)"
      ],
      itinerary: [
        { day: "Day 1", desc: "Jammu ➝ Katra – Arrival at Jammu Airport and private transfer to Katra. Check-in at hotel and enjoy leisure time. Overnight Stay: Katra." },
        { day: "Day 2", desc: "Katra | Vaishno Devi Darshan – Proceed for the holy Mata Vaishno Devi Darshan pilgrimage. Return to Katra after darshan. Overnight Stay: Katra." },
        { day: "Day 3", desc: "Katra ➝ Pahalgam – Drive towards the breathtaking valley of Pahalgam. Enjoy scenic mountain landscapes and explore local surroundings. Overnight Stay: Pahalgam." },
        { day: "Day 4", desc: "Pahalgam ➝ Srinagar – Proceed to Srinagar after breakfast. Enjoy a local city tour and explore the beautiful surroundings & Dal Lake. Overnight Stay: Srinagar." },
        { day: "Day 5", desc: "Srinagar ➝ Gulmarg – Proceed towards Gulmarg, the world-famous 'Meadow of Flowers.' Enjoy spectacular mountain scenery and optional activities. Overnight Stay: Gulmarg." },
        { day: "Day 6", desc: "Gulmarg ➝ Sonamarg – After breakfast, drive towards Sonamarg, the majestic 'Meadow of Gold.' Enjoy pristine scenic beauty and leisure time. Overnight Stay: Sonamarg." },
        { day: "Day 7", desc: "Sonamarg ➝ Srinagar – Proceed to Srinagar. Enjoy local shopping and leisure time. Explore vibrant markets and shop for Kashmir handicrafts & souvenirs. Overnight Stay: Srinagar." },
        { day: "Day 8", desc: "Srinagar | Departure – After breakfast, check out and transfer to Srinagar Airport for your onward journey with unforgettable memories of Kashmir. ❤️" }
      ],
      inclusions: [
        "07 Nights Accommodation in 3★ Hotels",
        "1 Triple Room for 3 Adults",
        "Daily Breakfast & Dinner",
        "Private Sedan for Entire Tour Sightseeing & Transfers",
        "Jammu Airport Pickup & Srinagar Airport Drop",
        "Complimentary Shikara Ride on Dal Lake",
        "Traditional Kashmiri Kehwa & Shawl Welcome",
        "Guidance Throughout the Journey & 24/7 Assistance"
      ],
      exclusions: [
        "Airfare (Domestic/International)",
        "Lunch and meals outside stated meal plan",
        "Vaishno Devi Pony / Palki / Helicopter Charges",
        "Gondola Tickets in Gulmarg",
        "Local Union Taxi Charges wherever applicable",
        "Entry Tickets & Activity Charges",
        "Personal Expenses & Anything not mentioned above"
      ]
    },
    "sea-trio-pdf": {
      title: "Singapore • Malaysia • Vietnam – Year-End Family Escape",
      badge: "TRI-COUNTRY ESCAPE • 13 NIGHTS / 14 DAYS",
      img: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=80",
      price: "₹2,98,340",
      unit: "Total Land Package (2 Adults + 1 Child)",
      phone: "7200669293",
      route: "Singapore (4N) → Express Coach to Kuala Lumpur (2N) → Flight to Ho Chi Minh City (3N) → Flight to Hanoi (2N) & Halong Bay → Flight to Da Nang (2N) & Ba Na Hills",
      hotels: [
        "Singapore (4 Nights): Days Inn by Wyndham Singapore Novena (Base Room, Daily Breakfast)",
        "Malaysia (2 Nights): Ramada Encore by Wyndham Chinatown / StarPoints Hotel (Deluxe / Superior Room, Daily Breakfast)",
        "Ho Chi Minh City (3 Nights): Prague Hotel Hồ Chí Minh (Superior Room with Window, Daily Breakfast)",
        "Hanoi (2 Nights): First Eden Hotel (Base Room, Daily Breakfast)",
        "Da Nang (2 Nights): Sepon Blue Hotel (Base Room, Daily Breakfast)"
      ],
      itinerary: [
        { day: "Day 1 (23 Dec)", desc: "Singapore Arrival – Changi Airport transfer to hotel. Night Safari with Admission + Tram Ride." },
        { day: "Day 2 (24 Dec)", desc: "Universal Studios Singapore – Full-day movie theme rides & shows with entrance ticket & 2-way hotel transfers." },
        { day: "Day 3 (25 Dec)", desc: "Sentosa Island – Round-Trip Sentosa Cable Car, Madame Tussauds 4-in-1 experience & Wings of Time laser show." },
        { day: "Day 4 (26 Dec)", desc: "Singapore ➝ Kuala Lumpur – Singapore City Tour, transfer to coach station & express coach to Kuala Lumpur." },
        { day: "Day 5 (27 Dec)", desc: "Kuala Lumpur Arrival – Arrive at KL Coach Station, hotel check-in, KL Night City Tour & KL Tower Observation Deck." },
        { day: "Day 6 (28 Dec)", desc: "Genting Highlands & Batu Caves – Full-Day Genting Highlands Tour, Batu Caves photo stop & Two-Way Skyway Cable Car." },
        { day: "Day 7 (29 Dec)", desc: "Kuala Lumpur ➝ Ho Chi Minh City – Transfer to KLIA, flight to Vietnam, Saigon Sky Deck (Bitexco) & evening leisure." },
        { day: "Day 8 (30 Dec)", desc: "Mekong Delta Excursion – Full-Day Mekong My Tho Excursion with island boating, local culture & fruit orchards." },
        { day: "Day 9 (31 Dec)", desc: "Ho Chi Minh City & Cu Chi Tunnels – Full-Day City Tour & historic Cu Chi Tunnels. Evening free for New Year's Eve celebrations!" },
        { day: "Day 10 (01 Jan)", desc: "Ho Chi Minh City ➝ Hanoi – Flight to Hanoi, Hanoi Half-Day City Tour (Tran Quoc Pagoda, Old Quarter) & evening leisure." },
        { day: "Day 11 (02 Jan)", desc: "Halong Bay Luxury Cruise – Full-Day Deluxe Halong Bay Cruise, Sung Sot Cave, Titop Island & Kayaking / Bamboo Boat." },
        { day: "Day 12 (03 Jan)", desc: "Hanoi ➝ Da Nang & Hoi An – Flight to Da Nang, visit Marble Mountains & lantern-lit Hoi An Ancient Town." },
        { day: "Day 13 (04 Jan)", desc: "Ba Na Hills & Golden Bridge – Full-Day Ba Na Hills with scenic Cable Car ride, Golden Giant Hand Bridge & Buffet Lunch." },
        { day: "Day 14 (05 Jan)", desc: "Da Nang Departure – Check-out and private airport transfer to Da Nang Airport for onward journey." }
      ],
      inclusions: [
        "13 Nights 3★ Hotel Accommodation across Singapore (4N), Malaysia (2N), and Vietnam (7N)",
        "Daily Breakfast at all hotels + Ba Na Hills International Buffet Lunch",
        "Universal Studios Singapore Ticket with 2-Way Hotel Transfers",
        "Night Safari Admission & Tram Ride Ticket (Singapore)",
        "Sentosa Cable Car (Round-Trip) + Madame Tussauds 4-in-1 + Wings of Time",
        "Singapore City Tour + Intercity AC Express Coach Singapore to Kuala Lumpur",
        "KL Night City Tour + KL Tower Observation Deck Ticket",
        "Full-Day Genting Highlands Tour with 2-Way Cable Car & Batu Caves Photo Stop",
        "Saigon Sky Deck (Bitexco) Admission Ticket",
        "Full-Day Mekong Delta (My Tho) Excursion with Boat Cruise",
        "Cu Chi Tunnels Tour & Ho Chi Minh City Guided Tour",
        "Hanoi Half-Day Guided City Tour",
        "Full-Day Deluxe Halong Bay Cruise with Sung Sot Cave, Titop Island & Kayaking",
        "Marble Mountains & Hoi An Ancient Town Guided Tour",
        "Ba Na Hills Full-Day Tour with Cable Car, Golden Bridge & Buffet Lunch",
        "All Private Airport Transfers in Singapore, Kuala Lumpur, Ho Chi Minh, Hanoi & Da Nang"
      ],
      exclusions: [
        "International & Domestic Airfare",
        "Visa Charges (Singapore, Malaysia, Vietnam)",
        "Guide Tipping in Vietnam",
        "Meals outside the stated meal plan",
        "Optional Experiences (Ice Cream Museum, Gardens by the Bay, Marina Bay Sands, KL Bird Park, etc.)",
        "Tourism taxes, compulsory supplements & refundable hotel deposits (where applicable)",
        "Personal Expenses & Travel Insurance"
      ]
    },
    "singapore-malaysia-vietnam-pdf": {
      title: "Singapore • Malaysia • Vietnam – Year-End Family Escape",
      badge: "TRI-COUNTRY ESCAPE • 13 NIGHTS / 14 DAYS",
      img: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=80",
      price: "₹2,98,340",
      unit: "Total Land Package (2 Adults + 1 Child)",
      phone: "7200669293",
      route: "Singapore (4N) → Express Coach to Kuala Lumpur (2N) → Flight to Ho Chi Minh City (3N) → Flight to Hanoi (2N) & Halong Bay → Flight to Da Nang (2N) & Ba Na Hills",
      hotels: [
        "Singapore (4 Nights): Days Inn by Wyndham Singapore Novena (Base Room, Daily Breakfast)",
        "Malaysia (2 Nights): Ramada Encore by Wyndham Chinatown / StarPoints Hotel (Deluxe / Superior Room, Daily Breakfast)",
        "Ho Chi Minh City (3 Nights): Prague Hotel Hồ Chí Minh (Superior Room with Window, Daily Breakfast)",
        "Hanoi (2 Nights): First Eden Hotel (Base Room, Daily Breakfast)",
        "Da Nang (2 Nights): Sepon Blue Hotel (Base Room, Daily Breakfast)"
      ],
      itinerary: [
        { day: "Day 1 (23 Dec)", desc: "Singapore Arrival – Changi Airport transfer to hotel. Night Safari with Admission + Tram Ride." },
        { day: "Day 2 (24 Dec)", desc: "Universal Studios Singapore – Full-day movie theme rides & shows with entrance ticket & 2-way hotel transfers." },
        { day: "Day 3 (25 Dec)", desc: "Sentosa Island – Round-Trip Sentosa Cable Car, Madame Tussauds 4-in-1 experience & Wings of Time laser show." },
        { day: "Day 4 (26 Dec)", desc: "Singapore ➝ Kuala Lumpur – Singapore City Tour, transfer to coach station & express coach to Kuala Lumpur." },
        { day: "Day 5 (27 Dec)", desc: "Kuala Lumpur Arrival – Arrive at KL Coach Station, hotel check-in, KL Night City Tour & KL Tower Observation Deck." },
        { day: "Day 6 (28 Dec)", desc: "Genting Highlands & Batu Caves – Full-Day Genting Highlands Tour, Batu Caves photo stop & Two-Way Skyway Cable Car." },
        { day: "Day 7 (29 Dec)", desc: "Kuala Lumpur ➝ Ho Chi Minh City – Transfer to KLIA, flight to Vietnam, Saigon Sky Deck (Bitexco) & evening leisure." },
        { day: "Day 8 (30 Dec)", desc: "Mekong Delta Excursion – Full-Day Mekong My Tho Excursion with island boating, local culture & fruit orchards." },
        { day: "Day 9 (31 Dec)", desc: "Ho Chi Minh City & Cu Chi Tunnels – Full-Day City Tour & historic Cu Chi Tunnels. Evening free for New Year's Eve celebrations!" },
        { day: "Day 10 (01 Jan)", desc: "Ho Chi Minh City ➝ Hanoi – Flight to Hanoi, Hanoi Half-Day City Tour (Tran Quoc Pagoda, Old Quarter) & evening leisure." },
        { day: "Day 11 (02 Jan)", desc: "Halong Bay Luxury Cruise – Full-Day Deluxe Halong Bay Cruise, Sung Sot Cave, Titop Island & Kayaking / Bamboo Boat." },
        { day: "Day 12 (03 Jan)", desc: "Hanoi ➝ Da Nang & Hoi An – Flight to Da Nang, visit Marble Mountains & lantern-lit Hoi An Ancient Town." },
        { day: "Day 13 (04 Jan)", desc: "Ba Na Hills & Golden Bridge – Full-Day Ba Na Hills with scenic Cable Car ride, Golden Giant Hand Bridge & Buffet Lunch." },
        { day: "Day 14 (05 Jan)", desc: "Da Nang Departure – Check-out and private airport transfer to Da Nang Airport for onward journey." }
      ],
      inclusions: [
        "13 Nights 3★ Hotel Accommodation across Singapore (4N), Malaysia (2N), and Vietnam (7N)",
        "Daily Breakfast at all hotels + Ba Na Hills International Buffet Lunch",
        "Universal Studios Singapore Ticket with 2-Way Hotel Transfers",
        "Night Safari Admission & Tram Ride Ticket (Singapore)",
        "Sentosa Cable Car (Round-Trip) + Madame Tussauds 4-in-1 + Wings of Time",
        "Singapore City Tour + Intercity AC Express Coach Singapore to Kuala Lumpur",
        "KL Night City Tour + KL Tower Observation Deck Ticket",
        "Full-Day Genting Highlands Tour with 2-Way Cable Car & Batu Caves Photo Stop",
        "Saigon Sky Deck (Bitexco) Admission Ticket",
        "Full-Day Mekong Delta (My Tho) Excursion with Boat Cruise",
        "Cu Chi Tunnels Tour & Ho Chi Minh City Guided Tour",
        "Hanoi Half-Day Guided City Tour",
        "Full-Day Deluxe Halong Bay Cruise with Sung Sot Cave, Titop Island & Kayaking",
        "Marble Mountains & Hoi An Ancient Town Guided Tour",
        "Ba Na Hills Full-Day Tour with Cable Car, Golden Bridge & Buffet Lunch",
        "All Private Airport Transfers in Singapore, Kuala Lumpur, Ho Chi Minh, Hanoi & Da Nang"
      ],
      exclusions: [
        "International & Domestic Airfare",
        "Visa Charges (Singapore, Malaysia, Vietnam)",
        "Guide Tipping in Vietnam",
        "Meals outside the stated meal plan",
        "Optional Experiences (Ice Cream Museum, Gardens by the Bay, Marina Bay Sands, KL Bird Park, etc.)",
        "Tourism taxes, compulsory supplements & refundable hotel deposits (where applicable)",
        "Personal Expenses & Travel Insurance"
      ]
    },
    "vietnam-pdf": {
      title: "Vietnam Romantic Honeymoon Escape",
      badge: "HONEYMOON SPECIAL • 5 NIGHTS / 6 DAYS",
      img: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80",
      price: "₹47,350",
      unit: "Per Person (₹94,700 Couple)",
      phone: "7200669293",
      route: "Hanoi (First Eden 3★) → Ha Long Bay Cruise (Verdure Lotus 4★) → Da Nang & Hoi An (De Lamour 3★) → Ba Na Hills Golden Bridge",
      itinerary: [
        { day: "Day 1", desc: "Arrival in Hanoi – Transfer to First Eden Hotel, Ho Chi Minh Mausoleum, One Pillar Pagoda, Tran Quoc Pagoda & Hanoi Old Quarter Train Street." },
        { day: "Day 2", desc: "Ha Long Bay Luxury Cruise – Scenic drive, welcome drink, Bai Tu Long Bay cruise, cave exploration, Vietnamese cooking demonstration, seafood dinner & squid fishing." },
        { day: "Day 3", desc: "Ha Long to Da Nang – Tai Chi morning, disembark cruise, flight to Da Nang & hotel check-in." },
        { day: "Day 4", desc: "Marble Mountain & Hoi An – Marble Mountain, Bay Mau Coconut Forest Basket Boat Ride, Hoi An Ancient Town & Japanese Covered Bridge." },
        { day: "Day 5", desc: "Golden Bridge & Ba Na Hills – Cable car ride to Golden Bridge, Le Jardin Flower Gardens, French Village, Fantasy Park & Chua Mountain Peak." },
        { day: "Day 6", desc: "Departure – Breakfast, free time & private airport transfer." }
      ],
      inclusions: [
        "5 Nights Hotel Accommodation + 1 Night Ha Long Bay 4★ Cruise Liner",
        "Daily Breakfast + Meals as specified on cruise",
        "Ba Na Hills Cable Car & Golden Bridge Entrance Pass",
        "Bay Mau Coconut Basket Boat Ride Ticket",
        "Private Airport Transfers & English Speaking Guide"
      ]
    },
    "kasol-pdf": {
      title: "Kasol Honeymoon (Himachal Pradesh)",
      badge: "HIMALAYAN TREK • 3 NIGHTS / 4 DAYS",
      img: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80",
      price: "₹35,000",
      unit: "Per Person",
      phone: "7200669293",
      route: "Chandigarh Railway Station → Kasol → Manikaran Sahib → Tosh Valley → Chalal Village Trek → Chandigarh",
      itinerary: [
        { day: "Day 1", desc: "Chandigarh to Kasol – Pickup from Chandigarh Railway Station, drive to Kasol, check-in, evening at Kasol Market & Parvati River." },
        { day: "Day 2", desc: "Manikaran & Tosh Excursion – Breakfast, Manikaran Sahib Hot Springs visit, drive to Tosh Valley & Tosh Village views." },
        { day: "Day 3", desc: "Chalal Village Trek – Leisure morning, scenic forest trail trek to Chalal Village along Parvati River, cafe hopping & shopping." },
        { day: "Day 4", desc: "Kasol to Chandigarh – Breakfast, check-out, scenic drive to Chandigarh & drop at Chandigarh Railway Station." }
      ],
      inclusions: [
        "3 Nights Hotel Stay in Kasol",
        "Daily Breakfast at Hotel",
        "Private Transfer (Chandigarh Railway Station ↔ Kasol)",
        "Manikaran Sahib & Tosh Valley Excursion",
        "Guided Chalal Village Forest Trail Trek"
      ]
    },
    malaysia: {
      title: "Malaysia Group Tour",
      badge: "GROUP TOUR • 4 NIGHTS / 5 DAYS",
      img: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1200&q=80",
      price: "₹39,999",
      unit: "Per Person",
      phone: "7200669293",
      route: "International, Malaysia (Kuala Lumpur → Genting Highlands → Batu Caves)",
      itinerary: [
        { day: "Day 1", desc: "Arrival in Kuala Lumpur – Airport pickup, check-in at 4★ hotel, evening KL Tower visit." },
        { day: "Day 2", desc: "Batu Caves & Genting Highlands – Visit Batu Caves Lord Murugan Statue & Genting Cable Car." },
        { day: "Day 3", desc: "Kuala Lumpur City Tour – Petronas Twin Towers, Independence Square & King's Palace." },
        { day: "Day 4", desc: "Putrajaya & Shopping – Putrajaya Pink Mosque tour & Bukit Bintang shopping." },
        { day: "Day 5", desc: "Departure – Breakfast & airport drop for return flight." }
      ],
      inclusions: [
        "4 Nights 4★ Hotel Stay in Kuala Lumpur",
        "Daily Breakfast & Dinner",
        "Two-way Genting Skyway Cable Car Tickets",
        "KL City Tour & Batu Caves Entry",
        "Airport Transfers & Local Sightseeing AC Bus"
      ]
    },
    thailand: {
      title: "Thailand Tour",
      badge: "POPULAR TROPICAL • 4 NIGHTS / 5 DAYS",
      img: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1200&q=80",
      price: "₹34,999",
      unit: "Per Person",
      phone: "7200669293",
      route: "International, Thailand (Bangkok ↔ Pattaya ↔ Coral Island)",
      itinerary: [
        { day: "Day 1", desc: "Arrival in Bangkok – Transfer to Pattaya, hotel check-in & Alcazar Cabaret Show." },
        { day: "Day 2", desc: "Coral Island Speedboat Tour – Water sports, parasailing & Indian lunch at beach." },
        { day: "Day 3", desc: "Pattaya to Bangkok – Golden Buddha & Marble Temple city tour." },
        { day: "Day 4", desc: "Safari World & Marine Park – Full day animal shows & buffet lunch." },
        { day: "Day 5", desc: "Shopping & Departure – Free time at Pratunam Market & airport transfer." }
      ],
      inclusions: [
        "2 Nights Pattaya + 2 Nights Bangkok 4★ Stay",
        "Daily Breakfast & Coral Island Lunch",
        "Coral Island Speedboat Cruise with Lunch",
        "Alcazar Cabaret Show Standard Seat",
        "Bangkok City Temple Tour & Airport Transfers"
      ]
    },
    singapore: {
      title: "Singapore Package",
      badge: "CITY & LUXURY • 4 NIGHTS / 5 DAYS",
      img: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=80",
      price: "₹49,999",
      unit: "Per Person",
      phone: "7200669293",
      route: "International, Singapore (Marina Bay ↔ Sentosa ↔ Universal Studios)",
      itinerary: [
        { day: "Day 1", desc: "Arrival in Singapore – Hotel check-in & Night Safari tram ride." },
        { day: "Day 2", desc: "Singapore City Tour – Merlion Park, Chinatown & Gardens by the Bay Light Show." },
        { day: "Day 3", desc: "Sentosa Island – Cable Car ride, SEA Aquarium & Wings of Time laser show." },
        { day: "Day 4", desc: "Universal Studios Singapore – Full day movie theme rides & shows." },
        { day: "Day 5", desc: "Jewel Changi Rain Vortex & return flight." }
      ],
      inclusions: [
        "4 Nights 4★ Hotel Stay in Singapore",
        "Daily Breakfast at Hotel",
        "Universal Studios Singapore Ticket",
        "Sentosa Cable Car + SEA Aquarium Ticket",
        "Night Safari Tram Ticket & Airport Transfers"
      ]
    },
    srilanka: {
      title: "Sri Lanka – Hills & Beach Group Tour",
      badge: "HILLS & BEACHES • 5 NIGHTS / 6 DAYS",
      img: "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=1200&q=80",
      price: "₹42,500",
      unit: "Per Person",
      phone: "7200669293",
      route: "International, Sri Lanka (Colombo → Kandy → Nuwara Eliya → Bentota)",
      itinerary: [
        { day: "Day 1", desc: "Colombo to Kandy – Pinnawala Elephant Orphanage visit & Kandy evening show." },
        { day: "Day 2", desc: "Kandy Tour – Temple of Tooth Relic & Royal Botanical Gardens." },
        { day: "Day 3", desc: "Kandy to Nuwara Eliya – Tea plantations, Ramboda Waterfalls & Gregory Lake." },
        { day: "Day 4", desc: "Nuwara Eliya to Bentota – Drive to Bentota beach resort & Madu River safari." },
        { day: "Day 5", desc: "Bentota Beach Day – Turtle Hatchery visit & beach relaxation/water sports." },
        { day: "Day 6", desc: "Colombo City & Shopping – Departure airport drop." }
      ],
      inclusions: [
        "5 Nights 4★ Hotel Accommodation",
        "Daily Breakfast & Dinner",
        "Pinnawala Elephant Orphanage Entry",
        "Madu River Boat Safari Ticket",
        "Private AC Coach & English speaking Guide"
      ]
    },
    andaman: {
      title: "Andaman Island Escape – Standard",
      badge: "BEACHES & ADVENTURE • 4 NIGHTS / 5 DAYS",
      img: "https://images.unsplash.com/photo-1537956965359-7573183d1f57?auto=format&fit=crop&w=1200&q=80",
      price: "₹24,950",
      unit: "Per Person (₹99,800 Total for 4 Pax)",
      phone: "7200669293",
      route: "Port Blair (TGS Emerald 3★) → Havelock Island (Sundazee Beach Resort) → Neil Island (Silver Pearl Resort)",
      itinerary: [
        { day: "Day 1", desc: "Port Blair → Havelock Island. Airport pickup & transfer to Port Blair Harbour. Early morning cruise ferry to Havelock Island. Visit world-famous Radhanagar Beach (Beach No. 7) for swimming, sea bathing & sunset photography. Overnight at Sundazee Beach Resort, Havelock." },
        { day: "Day 2", desc: "Havelock – Elephant Beach Excursion. Breakfast at resort, boat ride to Elephant Beach. Complimentary Snorkelling session, explore vibrant coral reefs & marine life, beach relaxation & photography. Overnight at Sundazee Beach Resort." },
        { day: "Day 3", desc: "Havelock → Neil Island. Breakfast & check-out. High-speed ferry to Neil Island. Sightseeing covering Bharatpur Beach (water sports hub), Laxmanpur Beach & the iconic Natural Howrah Bridge rock formation. Overnight at Silver Pearl Resort." },
        { day: "Day 4", desc: "Neil Island → Port Blair & Chidiya Tapu Sunset. Ferry transfer to Port Blair, check-in at TGS Emerald 3★. Proceed to Chidiya Tapu (Munda Pahad) for lush greenery, bird watching & a spectacular sunset over the Bay of Bengal. Overnight Port Blair." },
        { day: "Day 5", desc: "Goodbye Andaman – Breakfast, check-out and private transfer to Port Blair Airport for onward flight. Curated specially by JP Holidays for an unforgettable island experience." }
      ],
      inclusions: [
        "4 Nights Accommodation: TGS Emerald 3★ (Port Blair) + Sundazee Beach Resort (Havelock) + Silver Pearl Resort (Neil Island)",
        "Daily Breakfast at all properties",
        "Airport Pickup & Drop at Port Blair",
        "All Inter-Island High-Speed Catamaran Ferry Tickets (Port Blair ↔ Havelock ↔ Neil)",
        "Snorkelling Experience & Coral Reef Excursion at Elephant Beach",
        "Neil Island Sightseeing & Chidiya Tapu Sunset Visit",
        "Transfers & Sightseeing as per Itinerary"
      ]
    },
    "andaman-elite": {
      title: "Andaman Island Escape – Elite",
      badge: "BEACHES & ADVENTURE • 4 NIGHTS / 5 DAYS",
      img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
      price: "₹29,450",
      unit: "Per Person (4 Adults)",
      phone: "7200669293",
      route: "Port Blair (TGS Emerald 3★) → Havelock Island (TSG Blue) → Neil Island (TSG Auro)",
      itinerary: [
        { day: "Day 1", desc: "Port Blair → Havelock Island. Airport pickup & transfer to Port Blair Harbour. Early morning cruise ferry to Havelock Island. Visit world-famous Radhanagar Beach (Beach No. 7) for swimming, sea bathing & sunset photography. Overnight at TSG Blue, Havelock." },
        { day: "Day 2", desc: "Havelock – Elephant Beach Excursion. Breakfast at TSG Blue resort, boat ride to Elephant Beach. Complimentary Snorkelling session, explore vibrant coral reefs & marine life, beach relaxation & photography. Overnight at TSG Blue." },
        { day: "Day 3", desc: "Havelock → Neil Island. Breakfast & check-out. High-speed ferry to Neil Island. Sightseeing covering Bharatpur Beach (water sports hub), Laxmanpur Beach & the iconic Natural Howrah Bridge rock formation. Overnight at TSG Auro." },
        { day: "Day 4", desc: "Neil Island → Port Blair & Chidiya Tapu Sunset. Ferry transfer to Port Blair, check-in at TGS Emerald 3★. Proceed to Chidiya Tapu (Munda Pahad) for lush greenery, bird watching & a spectacular sunset over the Bay of Bengal. Overnight Port Blair." },
        { day: "Day 5", desc: "Goodbye Andaman – Breakfast, check-out and private transfer to Port Blair Airport for onward flight. Curated specially by JP Holidays for Lakshmi and family." }
      ],
      inclusions: [
        "4 Nights Premium Accommodation: TGS Emerald 3★ (Port Blair) + TSG Blue (Havelock) + TSG Auro (Neil Island)",
        "Daily Breakfast at all properties",
        "Airport Pickup & Drop at Port Blair",
        "All Inter-Island High-Speed Catamaran Ferry Tickets (Port Blair ↔ Havelock ↔ Neil)",
        "Snorkelling Experience & Coral Reef Excursion at Elephant Beach",
        "Neil Island Sightseeing & Chidiya Tapu Sunset Visit",
        "Transfers & Sightseeing as per Itinerary"
      ]
    },
    goldentriangle: {
      title: "Golden Triangle Family Heritage Tour",
      badge: "HERITAGE & CULTURE • 4 NIGHTS / 5 DAYS",
      img: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80",
      price: "₹24,999",
      unit: "Per Person",
      phone: "7200669293",
      route: "Delhi, India, Rajasthan, Uttar Pradesh (Delhi → Agra → Jaipur → Delhi)",
      itinerary: [
        { day: "Day 1", desc: "Delhi Sightseeing – Lotus Temple, Qutub Minar & India Gate." },
        { day: "Day 2", desc: "Delhi to Agra – Yamuna Expressway drive, Agra Fort & sunset Taj Mahal view." },
        { day: "Day 3", desc: "Taj Mahal Sunrise Tour – Drive to Jaipur via Fatehpur Sikri." },
        { day: "Day 4", desc: "Jaipur City Tour – Amber Fort jeep ride, Hawa Mahal, City Palace & Jal Mahal." },
        { day: "Day 5", desc: "Jaipur to Delhi – Shopping at Dilli Haat & departure drop." }
      ],
      inclusions: [
        "4 Nights 4★ Heritage Hotel Stay (Delhi, Agra, Jaipur)",
        "Daily Buffet Breakfast",
        "Private AC Sedan/SUV for entire circuit",
        "Amber Fort Jeep Ride Ticket",
        "Local Monument Tour Guides"
      ]
    },
    cruise: {
      title: "Chennai – Singapore Cordelia Cruise",
      badge: "LUXURY CRUISE • 10 NIGHTS / 11 DAYS",
      img: "https://images.unsplash.com/photo-1599640842225-85d111c60e6b?auto=format&fit=crop&w=1200&q=80",
      price: "₹1,39,999*",
      unit: "Per Person (Return Flight Included)",
      phone: "7200669293",
      route: "Chennai Port → Phuket → Langkawi → Kuala Lumpur → Singapore",
      departure: "July 18th 2026 | 6:00 PM",
      arrival: "July 28th 2026 | 2:00 PM",
      itinerary: [
        { day: "Day 1", desc: "Chennai Port – Welcome aboard Cordelia Cruises! Departure at 6:00 PM." },
        { day: "Day 2", desc: "At Sea – Enjoy world-class deck pools, casino & Starlight dining." },
        { day: "Day 3", desc: "At Sea – Balle Balle & Indian Cinemagic entertainment shows." },
        { day: "Day 4", desc: "At Sea – Unlimited beverage package & gourmet dining." },
        { day: "Day 5", desc: "Phuket Port – Disembark & explore Phuket island beaches & city." },
        { day: "Day 6", desc: "Phuket Port – Full day Phuket island sightseeing & night market." },
        { day: "Day 7", desc: "Langkawi Port – Cable car ride, Sky Bridge & island exploration." },
        { day: "Day 8", desc: "At Sea – Magician's Cut & Romance in Bollywood live show." },
        { day: "Day 9", desc: "Kuala Lumpur Port – Visit Petronas Twin Towers & Batu Caves." },
        { day: "Day 10", desc: "Singapore Port – Disembark & explore Marina Bay & Jewel Changi." },
        { day: "Day 11", desc: "Singapore Port – Take return flight Singapore to Chennai." }
      ],
      inclusions: [
        "Inclusive of all meals at Food Court & Starlight Restaurant",
        "All inclusive unlimited beverage package included",
        "10 Days Live Entertainment Shows (Razzmatazz, Balle Balle, Burlesque, Magician's Cut)",
        "Return flight from Singapore to Chennai",
        "Port charges & luxury liner accommodation"
      ]
    },
    kenya: {
      title: "Kenya Highlights & Masai Mara Safari",
      badge: "WILDLIFE SAFARI • 6 NIGHTS / 7 DAYS",
      img: "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=1200&q=80",
      price: "₹1,45,000",
      unit: "Per Person",
      phone: "7200669293",
      route: "Nairobi → Masai Mara → Lake Naivasha → Amboseli → Nairobi",
      itinerary: [
        { day: "Day 1", desc: "Arrival in Nairobi – Meet & greet at airport, Giraffe Centre visit, overnight in Nairobi." },
        { day: "Day 2", desc: "Nairobi to Masai Mara – Drive to Masai Mara Reserve, afternoon game drive, dinner at safari lodge." },
        { day: "Day 3", desc: "Full-Day Masai Mara Safari – Witness the Great Migration & Big Five with picnic lunch in savanna." },
        { day: "Day 4", desc: "Masai Mara to Lake Naivasha – Scenic drive, Lake Naivasha boat ride & Crescent Island walking safari." },
        { day: "Day 5", desc: "Lake Naivasha to Amboseli – Drive to Amboseli National Park, evening game drive with Mt. Kilimanjaro views." },
        { day: "Day 6", desc: "Amboseli to Nairobi – Morning safari, return to Nairobi, free time for local craft shopping." },
        { day: "Day 7", desc: "Departure – Breakfast & airport transfer for onward flight." }
      ],
      inclusions: [
        "Full board meals (Breakfast, Lunch, Dinner)",
        "Daily 4x4 Land Cruiser Game Drives with expert guide",
        "4★ Luxury Safari Lodges & Camps",
        "Lake Naivasha Boat Ride & Crescent Island entry",
        "All national park fees & local transfers"
      ]
    },
    "hk-macau": {
      title: "Hong Kong & Macau Highlights Special",
      badge: "POPULAR TOUR • 7 NIGHTS / 8 DAYS",
      img: "https://images.unsplash.com/photo-1506970845246-18f21d533b20?auto=format&fit=crop&w=1200&q=80",
      price: "₹1,00,000",
      unit: "Per Person",
      phone: "7200669293",
      route: "Macau (2 Nights) ↔ Hong Kong (5 Nights)",
      itinerary: [
        { day: "Days 1-2", desc: "Macau Stay (Regency Art Macau) – Macau City Tour: Lotus Square, Ruins of St. Paul, Fisherman's Wharf & Macau Tower." },
        { day: "Day 3", desc: "Scenic Ferry Connection – TurboJET Ferry transfer from Macau to Hong Kong." },
        { day: "Days 3-7", desc: "Hong Kong Stay (Harbour Plaza Metropolis) – Hong Kong Night Tour: Victoria Peak, Peak Tram, Star Ferry & Symphony of Lights." },
        { day: "Day 5", desc: "Ocean Park – Full day thrills, marine park attractions & exciting shows." },
        { day: "Day 6", desc: "Hong Kong Disneyland – Magical rides, parades & fireworks display." },
        { day: "Day 7", desc: "Lantau Island Tour – Ngong Ping 360 Cable Car, Ngong Ping Market & Big Buddha Statue." },
        { day: "Day 8", desc: "Departure – Airport transfer for return flight." }
      ],
      inclusions: [
        "2 Nights Regency Art Macau (Superior Room)",
        "5 Nights Harbour Plaza Metropolis Hong Kong (Superior Room)",
        "Roundtrip Macau ↔ Hong Kong Ferry Tickets",
        "Hong Kong Disneyland & Ocean Park Tickets",
        "Ngong Ping 360 Roundtrip Cable Car & Victoria Peak Tram",
        "Private AC Airport & Hotel Transfers"
      ]
    },
    canton: {
      title: "China Canton Fair 2026 Business Tour",
      badge: "CANTON FAIR • GUANGZHOU",
      img: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=1200&q=80",
      price: "$675",
      unit: "Per Person (Approx. ₹56,500)",
      phone: "7200669293",
      route: "Guangzhou, China (World's Largest Trade Fair)",
      itinerary: [
        { day: "Phase 1", desc: "15th – 19th October 2026 – Electronics, Machinery, Lighting, Hardware & Vehicles." },
        { day: "Phase 2", desc: "23rd – 27th October 2026 – Consumer Goods, Gifts, Home Decorations & Furniture." },
        { day: "Phase 3", desc: "30th Oct – 4th November 2026 – Textiles, Apparel, Shoes, Office Supplies & Medical Devices." }
      ],
      inclusions: [
        "Accommodation with Daily BBF at 4★ Hotel in Guangzhou",
        "Private Transfers: HKIA – HK Ferry Pier / GDH Ferry Pier – Hotel",
        "Ferry Tickets: HKG – GDH / GDH – HKIA",
        "Free Hotel Shuttle Transfers to Canton Fair Expo Center",
        "144 Hours China Visa Assistance (Guangdong Province Only)"
      ]
    },
    bali: {
      title: "Bali Tropical Luxury Escape",
      badge: "HONEYMOON & TROPICAL • 5 NIGHTS / 6 DAYS",
      img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80",
      price: "₹45,999",
      unit: "Per Person",
      phone: "7200669293",
      route: "Denpasar → Kuta → Ubud → Tanah Lot → Nusa Penida",
      itinerary: [
        { day: "Day 1", desc: "Arrival in Denpasar – Flower garland welcome, transfer to luxury pool villa in Kuta." },
        { day: "Day 2", desc: "Ubud Cultural Tour – Sacred Monkey Forest, Tegallalang Rice Terrace & Bali Swing." },
        { day: "Day 3", desc: "Kintamani Volcano & Temples – Mount Batur viewpoint, Tirta Empul Holy Water Spring & Coffee Plantation." },
        { day: "Day 4", desc: "Nusa Penida Island Tour – Fast boat ride, Kelingking T-Rex Beach, Broken Beach & Angel's Billabong." },
        { day: "Day 5", desc: "Sunset Tanah Lot Temple – Water sports at Tanjung Benoa & romantic candle light dinner." },
        { day: "Day 6", desc: "Spa & Departure – Traditional Balinese massage session & airport drop." }
      ],
      inclusions: [
        "3 Nights 4★ Kuta Resort + 2 Nights Private Pool Villa Ubud",
        "Daily Breakfast & 1 Romantic Candle Light Dinner",
        "Full Day Nusa Penida Island Speedboat Tour & Lunch",
        "Complimentary 60-Min Balinese Spa Couple Massage",
        "Private AC Car Transfers & Water Sports Package"
      ]
    },
    maldives: {
      title: "Maldives Overwater Resort Special",
      badge: "LUXURY & HONEYMOON • 4 NIGHTS / 5 DAYS",
      img: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80",
      price: "₹89,999",
      unit: "Per Person",
      phone: "7200669293",
      route: "Malé International Airport ↔ Luxury Island Resort Atoll",
      itinerary: [
        { day: "Day 1", desc: "Arrival in Malé – Speedboat/Seaplane transfer to 5★ Private Island Resort." },
        { day: "Day 2", desc: "Beach Villa Stay – Snorkeling, infinity pool, sunset cocktail lounge." },
        { day: "Day 3", desc: "Overwater Villa Transfer – Move to iconic lagoon water villa with direct ocean access." },
        { day: "Day 4", desc: "Dolphin Cruise & Watersports – Sunset dolphin watching excursion & kayak ride." },
        { day: "Day 5", desc: "Departure – Farewell breakfast & return speedboat transfer to Malé airport." }
      ],
      inclusions: [
        "2 Nights Beach Villa + 2 Nights Water Villa at 5★ Resort",
        "All-Inclusive Meal Plan (Breakfast, Lunch, Dinner & Drinks)",
        "Roundtrip Speedboat Transfers from Malé Airport",
        "Sunset Dolphin Cruise Excursion Included",
        "Complimentary Snorkeling Equipment & Kayak Rental"
      ]
    },
    kashmir: {
      title: "The Grand Kashmir & Vaishno Devi Katra Tour",
      badge: "PILGRIMAGE & PARADISE • 7 NIGHTS / 8 DAYS",
      img: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=80",
      price: "₹76,340",
      unit: "Total Package for 3 Adults (1 Triple Room)",
      phone: "7200669293",
      route: "Jammu Airport → Katra (2N) → Pahalgam (1N) → Srinagar (2N) → Gulmarg (1N) → Sonamarg (1N) → Srinagar Airport Drop",
      hotels: [
        "Katra (2 Nights): Hotel Zone Connect by Park Katra / Similar (3★)",
        "Pahalgam (1 Night): Hotel Grand Salween / Similar (3★)",
        "Srinagar (2 Nights): Hotel The Oriental Mansion / Similar (3★)",
        "Gulmarg (1 Night): Hotel Zahgeer Continental / Similar (3★)",
        "Sonamarg (1 Night): Hotel Thajwas Glacier / Similar (3★)"
      ],
      itinerary: [
        { day: "Day 1", desc: "Jammu ➝ Katra – Arrival at Jammu Airport and private transfer to Katra. Check-in at hotel and enjoy leisure time. Overnight Stay: Katra." },
        { day: "Day 2", desc: "Katra | Vaishno Devi Darshan – Proceed for the holy Mata Vaishno Devi Darshan pilgrimage. Return to Katra after darshan. Overnight Stay: Katra." },
        { day: "Day 3", desc: "Katra ➝ Pahalgam – Drive towards the breathtaking valley of Pahalgam. Enjoy scenic mountain landscapes and explore local surroundings. Overnight Stay: Pahalgam." },
        { day: "Day 4", desc: "Pahalgam ➝ Srinagar – Proceed to Srinagar after breakfast. Enjoy a local city tour and explore the beautiful surroundings & Dal Lake. Overnight Stay: Srinagar." },
        { day: "Day 5", desc: "Srinagar ➝ Gulmarg – Proceed towards Gulmarg, the world-famous 'Meadow of Flowers.' Enjoy spectacular mountain scenery and optional activities. Overnight Stay: Gulmarg." },
        { day: "Day 6", desc: "Gulmarg ➝ Sonamarg – After breakfast, drive towards Sonamarg, the majestic 'Meadow of Gold.' Enjoy pristine scenic beauty and leisure time. Overnight Stay: Sonamarg." },
        { day: "Day 7", desc: "Sonamarg ➝ Srinagar – Proceed to Srinagar. Enjoy local shopping and leisure time. Explore vibrant markets and shop for Kashmir handicrafts & souvenirs. Overnight Stay: Srinagar." },
        { day: "Day 8", desc: "Srinagar | Departure – After breakfast, check out and transfer to Srinagar Airport for your onward journey with unforgettable memories of Kashmir. ❤️" }
      ],
      inclusions: [
        "07 Nights Accommodation in 3★ Hotels",
        "1 Triple Room for 3 Adults",
        "Daily Breakfast & Dinner",
        "Private Sedan for Entire Tour Sightseeing & Transfers",
        "Jammu Airport Pickup & Srinagar Airport Drop",
        "Complimentary Shikara Ride on Dal Lake",
        "Traditional Kashmiri Kehwa & Shawl Welcome",
        "Guidance Throughout the Journey & 24/7 Assistance"
      ],
      exclusions: [
        "Airfare (Domestic/International)",
        "Lunch and meals outside stated meal plan",
        "Vaishno Devi Pony / Palki / Helicopter Charges",
        "Gondola Tickets in Gulmarg",
        "Local Union Taxi Charges wherever applicable",
        "Entry Tickets & Activity Charges",
        "Personal Expenses & Anything not mentioned above"
      ]
    },
    dubai: {
      title: "Dubai Luxury & Desert Safari",
      badge: "CITY & ADVENTURE • 5 NIGHTS / 6 DAYS",
      img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80",
      price: "₹54,999",
      unit: "Per Person",
      phone: "7200669293",
      route: "Dubai (Burj Khalifa → Desert Safari → Marina Cruise → Abu Dhabi)",
      itinerary: [
        { day: "Day 1", desc: "Arrival in Dubai – Airport pickup, 4★ hotel check-in & Dubai Marina Dhow Cruise Dinner." },
        { day: "Day 2", desc: "Dubai City Tour & Burj Khalifa – Half day city tour, Dubai Mall & 124th floor observation deck." },
        { day: "Day 3", desc: "Desert Safari with BBQ Dinner – Dune bashing, camel riding, belly dance & Tanoura show." },
        { day: "Day 4", desc: "Abu Dhabi Day Tour – Sheikh Zayed Grand Mosque & Louvre Museum / Ferrari World." },
        { day: "Day 5", desc: "Miracle Garden & Global Village – Floral displays & international shopping pavilions." },
        { day: "Day 6", desc: "Shopping & Departure – Gold Souk shopping & airport drop." }
      ],
      inclusions: [
        "5 Nights 4★ Hotel Stay in Central Dubai",
        "Daily Buffet Breakfast & Marina Dhow Cruise Dinner",
        "Desert Safari with 4x4 Dune Bashing & BBQ Buffet Dinner",
        "Burj Khalifa 124th Floor Ticket (Non-Prime Time)",
        "Abu Dhabi City Tour with Sheikh Zayed Mosque Entry & UAE Tourist Visa"
      ]
    },
    vietnam: {
      title: "Vietnam & Cambodia Heritage Tour",
      badge: "CULTURE & HERITAGE • 6 NIGHTS / 7 DAYS",
      img: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80",
      price: "₹48,999",
      unit: "Per Person",
      phone: "7200669293",
      route: "Hanoi → Ha Long Bay → Da Nang → Ba Na Hills → Siem Reap (Angkor Wat)",
      itinerary: [
        { day: "Day 1", desc: "Hanoi Arrival – City tour, Hoan Kiem Lake & Old Quarter." },
        { day: "Day 2", desc: "Ha Long Bay Cruise – Overnight luxury cruise liner, cave kayaking & seafood." },
        { day: "Day 3", desc: "Flight to Da Nang – Dragon Bridge & Hoi An Ancient Town lanterns." },
        { day: "Day 4", desc: "Ba Na Hills & Golden Bridge – Cable car ride & French Village." },
        { day: "Day 5", desc: "Flight to Siem Reap (Cambodia) – Pub Street & Night Market." },
        { day: "Day 6", desc: "Angkor Wat Temple Complex – Sunrise at Angkor Wat, Bayon & Ta Prohm." },
        { day: "Day 7", desc: "Departure – Airport drop for return flight." }
      ],
      inclusions: [
        "1 Night Ha Long Bay Cruise + 5 Nights 4★ Hotel Stay",
        "Daily Breakfast & Ha Long Bay Buffet Lunch",
        "Ba Na Hills Cable Car & Golden Bridge Entry Ticket",
        "Angkor Wat Temple Complex Entrance Pass",
        "All Domestic Flights & Airport Transfers"
      ]
    },
    japan: {
      title: "Japan Cherry Blossom & Tokyo Explorer",
      badge: "CULTURE & HIGH-TECH • 6 NIGHTS / 7 DAYS",
      img: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80",
      price: "₹1,25,000",
      unit: "Per Person",
      phone: "7200669293",
      route: "Tokyo → Mount Fuji → Hakone → Kyoto → Osaka",
      itinerary: [
        { day: "Day 1", desc: "Tokyo Arrival – Check-in, Shibuya Crossing & Skytree Tower night view." },
        { day: "Day 2", desc: "Tokyo Highlights – Sensoji Temple, Asakusa, Imperial Palace & Akihabara." },
        { day: "Day 3", desc: "Mt. Fuji & Hakone Excursion – Mt. Fuji 5th Station, Lake Ashi Pirate Cruise & Ropeway." },
        { day: "Day 4", desc: "Shinkansen Bullet Train to Kyoto – Fushimi Inari Shrine 10,000 Torii gates." },
        { day: "Day 5", desc: "Kyoto Heritage – Arashiyama Bamboo Grove & Kinkaku-ji Golden Pavilion." },
        { day: "Day 6", desc: "Osaka City Tour – Osaka Castle, Dotonbori food street & Umeda Sky Building." },
        { day: "Day 7", desc: "Kansai Departure – Airport transfer for return flight." }
      ],
      inclusions: [
        "6 Nights 4★ City Hotel Accommodation",
        "Daily Breakfast at Hotels",
        "Shinkansen Bullet Train Ticket (Tokyo → Kyoto)",
        "Mt. Fuji 5th Station & Lake Ashi Cruise Ticket",
        "Japan Tourist Visa Assistance"
      ]
    },
    "chardham-heli": {
      title: "Luxury Char Dham Heli Yatra",
      badge: "SACRED PILGRIMAGE • 4 NIGHTS / 5 DAYS",
      img: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80",
      price: "₹1,98,450",
      unit: "Per Person (Inclusive of All Applicable Taxes)",
      phone: "7200669293",
      route: "Dehradun → Kharsali (Yamunotri) → Harsil (Gangotri) → Guptkashi (Kedarnath) → Badrinath → Dehradun",
      itinerary: [
        { day: "Day 1", desc: "Dehradun to Kharsali (Yamunotri Dham) – Departure from Sahastradhara Helipad at 07:00 AM. Arrive Kharsali at 07:30 AM. Breakfast, proceed for VIP Darshan of Shri Yamunotri Dham via Palki (approx. 5 km). Evening visit to Shani Temple (winter abode of Goddess Yamuna). Dinner & overnight at Kharsali." },
        { day: "Day 2", desc: "Kharsali to Harsil (Gangotri Dham) – 07:45 AM flight to Harsil Helipad (08:30 AM arrival). Transfer by Toyota Innova (approx. 20 km) for VIP Darshan of Shri Gangotri Dham and Bhagirathi River banks. Evening leisure in scenic Harsil Valley. Dinner & overnight at Harsil." },
        { day: "Day 3", desc: "Harsil to Kedarnath & Guptkashi – 09:00 AM flight to Guptkashi. Board shuttle helicopter for Shri Kedarnath Ji VIP Darshan at the holy Jyotirlinga. Return by helicopter to Guptkashi. Check-in, dinner & overnight at Guptkashi." },
        { day: "Day 4", desc: "Guptkashi to Badrinath – 10:00 AM flight to Badrinath Helipad. Hotel check-in & lunch. VIP Darshan of Shri Badrinath Temple. Later visit Mana Village (India's Last Village), Vyas Gufa, Ganesh Gufa & Bhim Pul. Dinner & overnight at Badrinath." },
        { day: "Day 5", desc: "Badrinath to Dehradun Departure – Breakfast & check-out. 11:30 AM helicopter departure to Sahastradhara Helipad, Dehradun (12:30 PM arrival). Transfer to Airport / Railway Station for onward journey with divine blessings." }
      ],
      inclusions: [
        "01 Night Complimentary Luxury Stay in Dehradun before yatra",
        "04 Nights Luxury Accommodation (Kharsali, Harsil, Guptkashi, Badrinath)",
        "Helicopter Transfers between all Helipads as per itinerary",
        "VIP Darshan at all 4 Dhams (Yamunotri, Gangotri, Kedarnath & Badrinath)",
        "Daily Breakfast, Lunch & Dinner Included",
        "Palki (Sedan Chair) at Yamunotri & Toyota Innova Ground Transfers",
        "Dedicated Tour Assistance throughout journey & All Applicable Taxes"
      ]
    },
    meghalaya: {
      title: "Majestic Meghalaya Tour Package",
      badge: "NORTHEAST NATURE • 4 NIGHTS / 5 DAYS",
      img: "https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?auto=format&fit=crop&w=1200&q=80",
      price: "₹22,670",
      unit: "Per Person (Premium) | ₹24,450 (Budget)",
      phone: "7200669293",
      route: "Guwahati → Shillong (3N) → Cherrapunji (1N) → Dawki → Mawlynnong → Guwahati",
      itinerary: [
        { day: "Day 1", desc: "Guwahati Arrival → Shillong ('Scotland of the East'). Enroute visit Umananda Temple, Assam State Museum & the scenic Umiam Lake (Barapani). Check-in and evening at leisure in Shillong." },
        { day: "Day 2", desc: "Shillong Local Sightseeing – Breakfast, full day exploration of Shillong Peak, Elephant Falls, Don Bosco Museum of Indigenous Cultures, Ward's Lake & the breathtaking Laitlum Canyon. Overnight at Shillong." },
        { day: "Day 3", desc: "Dawki River & Mawlynnong → Cherrapunji. Full day excursion to crystal-clear Dawki (Umngot) River boating on the India-Bangladesh border, Mawlynnong (Asia's Cleanest Village) & the iconic Living Root Bridge. Transfer to misty Cherrapunji for overnight stay." },
        { day: "Day 4", desc: "Cherrapunji Sightseeing → Shillong. Visit majestic Seven Sisters Waterfalls, Nohkalikai Falls (India's tallest plunge waterfall), Mawsmai Limestone Cave, Eco Park, Garden of Caves & Mawkdok Dympep View Point. Drive back to Shillong for overnight stay." },
        { day: "Day 5", desc: "Shillong → Guwahati Departure. Breakfast & scenic drive to Guwahati. Visit Brahmaputra Heritage Centre, transfer to Guwahati Railway Station / Airport for departure." }
      ],
      inclusions: [
        "4 Nights Accommodation (3N Shillong at Blueberry Inn / Jessica + 1N Cherrapunji at Pyrkyns / Serenity)",
        "Daily Breakfast at all hotels",
        "Private AC Innova / Ertiga for entire trip transfers & sightseeing",
        "All Toll, Parking, Fuel, Interstate Permit & Driver Allowances",
        "Excursion to Dawki River, Mawlynnong Cleanest Village & Living Root Bridge",
        "Sightseeing to Seven Sisters Falls, Nohkalikai, Mawsmai Cave & Laitlum Canyon"
      ]
    },
    kerala: {
      title: "Kerala Backwaters & Houseboat Escape",
      badge: "GOD'S OWN COUNTRY • 4 NIGHTS / 5 DAYS",
      img: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80",
      price: "₹22,999",
      unit: "Per Person",
      phone: "7200669293",
      route: "Cochin → Munnar (2N) → Thekkady (1N) → Alleppey (1N Luxury Houseboat)",
      itinerary: [
        { day: "Day 1", desc: "Cochin Arrival → Munnar. Scenic drive passing Cheeyappara & Valara waterfalls, lush tea plantations, check-in & evening tea garden stroll." },
        { day: "Day 2", desc: "Munnar Sightseeing – Eravikulam National Park (Nilgiri Tahr), Mattupetty Dam, Echo Point, Tea Museum & Blossom Hydel Park." },
        { day: "Day 3", desc: "Munnar → Thekkady. Periyar Wildlife Sanctuary boat safari, spice plantation guided walk & optional Kathakali / Kalaripayattu martial art show." },
        { day: "Day 4", desc: "Thekkady → Alleppey Backwaters. Board traditional luxury AC Houseboat at noon. Cruise through emerald backwaters, village canals & lagoons. All meals on board." },
        { day: "Day 5", desc: "Alleppey → Cochin Departure. Breakfast on houseboat, check-out & transfer to Cochin Airport / Railway Station." }
      ],
      inclusions: [
        "3 Nights 4★ Resort Stay (Munnar & Thekkady) + 1 Night Deluxe Private AC Houseboat",
        "Daily Breakfast at Resorts + All Meals (Breakfast, Lunch, Dinner) on Houseboat",
        "Private AC Sedan for all transfers & sightseeing",
        "Spice Plantation Guided Tour & Tea Museum Entry",
        "Periyar Lake Wildlife Sanctuary Boat Ride Pass"
      ]
    },
    rajasthan: {
      title: "Rajasthan Royal Heritage Circuit",
      badge: "ROYAL HERITAGE • 6 NIGHTS / 7 DAYS",
      img: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80",
      price: "₹34,999",
      unit: "Per Person",
      phone: "7200669293",
      route: "Jaipur (2N) → Jodhpur (2N) → Jaisalmer (2N Desert Camp & Haveli)",
      itinerary: [
        { day: "Day 1", desc: "Arrival in Jaipur (Pink City) – Hotel check-in, visit Birla Mandir, Albert Hall Museum & colorful local bazaars." },
        { day: "Day 2", desc: "Jaipur Sightseeing – Amber Fort Jeep Ride, Jal Mahal photo stop, City Palace, Jantar Mantar & Hawa Mahal." },
        { day: "Day 3", desc: "Jaipur → Jodhpur (Blue City). Enroute visit Ajmer Sharif Dargah & sacred Pushkar Brahma Temple. Check-in at Jodhpur." },
        { day: "Day 4", desc: "Jodhpur Sightseeing – Mehrangarh Fort, Jaswant Thada, Umaid Bhawan Palace & Mandore Gardens." },
        { day: "Day 5", desc: "Jodhpur → Jaisalmer (Golden City). Check-in at Sam Sand Dunes Luxury Swiss Tent, Camel Safari & evening Rajasthani folk dance with dinner." },
        { day: "Day 6", desc: "Jaisalmer Fort & Havelis – Golden Fort (Sonar Qila), Patwon Ki Haveli, Salim Singh Ki Haveli & Gadisar Lake." },
        { day: "Day 7", desc: "Departure – Breakfast, transfer to Jodhpur / Jaisalmer Airport or Railway Station with royal memories." }
      ],
      inclusions: [
        "6 Nights Heritage Hotel & Desert Camp Stay (Jaipur, Jodhpur, Jaisalmer)",
        "Daily Buffet Breakfast + 1 Traditional Rajasthani Camp Dinner with Folk Dance",
        "Sam Sand Dunes Camel Safari & Jeep Dune Bashing",
        "Private AC Sedan/SUV for entire royal circuit",
        "Amber Fort Jeep Ride & Local Monument Guides"
      ]
    }
  };

  let modalBackdrop = document.getElementById('tour-modal');
  let modalContent = document.getElementById('modal-dynamic-content');

  function ensureTourModalExists() {
    if (!document.getElementById('tour-modal')) {
      const backdrop = document.createElement('div');
      backdrop.className = 'modal-backdrop';
      backdrop.id = 'tour-modal';
      backdrop.innerHTML = `
        <div class="modal-container">
          <button class="modal-close" aria-label="Close modal">&times;</button>
          <div class="modal-content" id="modal-dynamic-content"></div>
        </div>
      `;
      document.body.appendChild(backdrop);
      modalBackdrop = backdrop;
      modalContent = document.getElementById('modal-dynamic-content');
      
      const closeBtn = backdrop.querySelector('.modal-close');
      closeBtn?.addEventListener('click', closeTourModal);
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) closeTourModal();
      });
    } else {
      modalBackdrop = document.getElementById('tour-modal');
      modalContent = document.getElementById('modal-dynamic-content');
    }
  }

  function openTourModal(key) {
    ensureTourModalExists();
    const data = tourData[key];
    if (!data || !modalContent) return;

    const hotelsHtml = data.hotels && data.hotels.length ? `
      <div style="margin-bottom: 20px;">
        <h4 class="modal-section-title"><i class="fa-solid fa-hotel"></i> Hotel Accommodation</h4>
        <div class="hotels-box">
          <ul>
            ${data.hotels.map(h => `<li><i class="fa-solid fa-bed"></i> <span>${h}</span></li>`).join('')}
          </ul>
        </div>
      </div>
    ` : '';

    const optionsHtml = data.options && data.options.length ? `
      <div style="margin-bottom: 20px;">
        <h4 class="modal-section-title"><i class="fa-solid fa-layer-group"></i> Package &amp; Room Options</h4>
        <div style="display:flex; flex-direction:column; gap:10px;">
          ${data.options.map(opt => `
            <div style="background:#FDF5F6; border:1px solid #e0d0d2; border-left:4px solid #C8102E; border-radius:8px; padding:10px 14px;">
              <div style="font-weight:700; color:#1A0A0C; font-size:0.9rem;">${opt.title}</div>
              ${opt.desc ? `<div style="font-size:0.8rem; color:#666; margin-top:2px;">${opt.desc}</div>` : ''}
              <div style="font-weight:800; color:#C8102E; margin-top:4px; font-size:0.92rem;">${opt.price}</div>
            </div>
          `).join('')}
        </div>
      </div>
    ` : '';

    const exclusionsHtml = data.exclusions && data.exclusions.length ? `
      <div style="margin-bottom: 20px;">
        <h4 class="modal-section-title"><i class="fa-solid fa-circle-xmark" style="color:#dc2626;"></i> Package Exclusions</h4>
        <div class="exclusions-box">
          <ul>
            ${data.exclusions.map(ex => `<li><i class="fa-solid fa-xmark"></i> <span>${ex}</span></li>`).join('')}
          </ul>
        </div>
      </div>
    ` : '';

    const notesHtml = data.notes && data.notes.length ? `
      <div style="margin-bottom: 20px;">
        <h4 class="modal-section-title"><i class="fa-solid fa-circle-exclamation" style="color:#d97706;"></i> Important Notes &amp; Policies</h4>
        <div style="background:#FFFBEB; border:1px solid #FDE68A; border-radius:10px; padding:12px 16px;">
          <ul style="margin:0; padding-left:18px; font-size:0.82rem; color:#92400E; line-height:1.6;">
            ${data.notes.map(n => `<li>${n}</li>`).join('')}
          </ul>
        </div>
      </div>
    ` : '';

    const metaHtml = (data.tripId || data.dates || data.groupSize || data.transport) ? `
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:8px; margin-bottom:15px; font-size:0.8rem;">
        ${data.tripId ? `<div style="background:#F0E8EA; padding:8px 12px; border-radius:8px; color:#4A4A4A;"><strong>📌 Trip ID:</strong> ${data.tripId}</div>` : ''}
        ${data.dates ? `<div style="background:#F0E8EA; padding:8px 12px; border-radius:8px; color:#4A4A4A;"><strong>📅 Dates:</strong> ${data.dates}</div>` : ''}
        ${data.groupSize ? `<div style="background:#F0E8EA; padding:8px 12px; border-radius:8px; color:#4A4A4A;"><strong>👥 Group:</strong> ${data.groupSize}</div>` : ''}
        ${data.transport ? `<div style="background:#F0E8EA; padding:8px 12px; border-radius:8px; color:#4A4A4A;"><strong>🚐 Transport:</strong> ${data.transport}</div>` : ''}
      </div>
    ` : '';

    modalContent.innerHTML = `
      <div class="modal-header-banner">
        <img src="${data.img}" alt="${data.title}">
        <div class="modal-header-overlay">
          <span class="modal-badge">${data.badge}</span>
          <h2>${data.title}</h2>
        </div>
      </div>
      <div class="modal-body">
        ${metaHtml}
        <div class="modal-grid">
          <div>
            <h4 class="modal-section-title">Tour Itinerary &amp; Highlights</h4>
            <div class="itinerary-list">
              ${data.itinerary ? data.itinerary.map(item => `
                <div class="itinerary-item">
                  <span class="itinerary-day">${item.day}</span>
                  <span class="itinerary-desc">${item.desc}</span>
                </div>
              `).join('') : '<p>Detailed itinerary available on request.</p>'}
            </div>
          </div>
          <div>
            ${optionsHtml}
            ${hotelsHtml}
            <h4 class="modal-section-title">Package Inclusions</h4>
            <div class="inclusions-box">
              <ul>
                ${data.inclusions ? data.inclusions.map(inc => `
                  <li><i class="fa-solid fa-circle-check"></i> ${inc}</li>
                `).join('') : '<li><i class="fa-solid fa-circle-check"></i> Standard Package Inclusions</li>'}
              </ul>
            </div>
            ${exclusionsHtml}
            ${notesHtml}
            <div style="background:#F0E8EA; padding:15px; border-radius:12px; margin-bottom:15px;">
              <div style="font-size:0.78rem; color:#777; font-weight:700; text-transform:uppercase;">Tour Route / Location</div>
              <div style="font-size:0.88rem; font-weight:600; color:#1A0A0C; margin-top:4px;">${data.route || 'Worldwide'}</div>
            </div>
          </div>
        </div>

        <div class="modal-footer-cta">
          <div class="modal-price-box">
            <span class="price-label">Starting Price</span>
            <div class="price-val">${data.price} <small style="font-size:0.8rem; font-weight:normal; color:#666;">${data.unit || ''}</small></div>
          </div>
          <div class="modal-actions">
            <a href="tel:${data.phone || '7200669293'}" class="btn-call"><i class="fa-solid fa-phone"></i> Call Support</a>
            <button class="btn btn-primary btn-modal-book-now" data-place="${data.title}">Book Package Now</button>
          </div>
        </div>
      </div>
    `;

    // Ensure mobile navigation is closed when modal opens
    document.querySelector('.mobile-toggle')?.classList.remove('active');
    document.querySelector('.main-nav')?.classList.remove('open');

    // Bind close button
    const closeBtn = modalBackdrop.querySelector('.modal-close');
    if (closeBtn) {
      closeBtn.onclick = (e) => {
        e.stopPropagation();
        closeTourModal();
      };
    }

    modalBackdrop.classList.add('open');
    document.body.classList.add('modal-active');
    document.body.style.overflow = 'hidden';
  }

  function closeTourModal() {
    if (modalBackdrop) modalBackdrop.classList.remove('open');
    if (!enquiryModal || !enquiryModal.classList.contains('open')) {
      document.body.classList.remove('modal-active');
      document.body.style.overflow = '';
    }
  }

  // Global escape key listener
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeTourModal();
      closeEnquiryModal();
    }
  });

  /* ----- Package Book / Details Buttons ----- */
  document.querySelectorAll('.btn-details-outline, .package-book:not(.open-enquiry-btn)').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const key = btn.dataset.modal;
      if (key && tourData[key]) {
        openTourModal(key);
      }
    });
  });

  /* ----- Enquiry Form Modal Logic ----- */
  const enquiryModal = document.getElementById('enquiry-modal');
  const enquiryClose = document.getElementById('enquiry-modal-close');
  const enquiryForm = document.getElementById('enquiryForm');
  const enquiryPlaceSelect = document.getElementById('enquiry-place');
  const checkinInput = document.getElementById('enquiry-checkin');
  const checkoutInput = document.getElementById('enquiry-checkout');

  // Set default dates (today & 3 days later)
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const defaultCheckout = new Date(today);
  defaultCheckout.setDate(defaultCheckout.getDate() + 3);
  const defaultCheckoutStr = defaultCheckout.toISOString().split('T')[0];

  if (checkinInput) {
    checkinInput.min = todayStr;
    if (!checkinInput.value) checkinInput.value = todayStr;
    checkinInput.addEventListener('change', () => {
      if (checkoutInput) {
        checkoutInput.min = checkinInput.value;
        if (checkoutInput.value < checkinInput.value) {
          checkoutInput.value = checkinInput.value;
        }
      }
    });
  }
  if (checkoutInput) {
    checkoutInput.min = todayStr;
    if (!checkoutInput.value) checkoutInput.value = defaultCheckoutStr;
  }

  // Helper to remove any price mentions from package / destination strings
  function cleanPlaceName(text) {
    if (!text) return 'Custom / Other Destination';
    return text
      // Remove patterns like " - ₹76,340", " | ₹24,950", " - USD 2,250", " | 4 Pax: ₹99,800"
      .replace(/\s*[-–—|]\s*(?:4\s*Pax\s*:\s*)?(?:₹|rs\.?|inr|usd|\$)\s*[\d,.]+/gi, '')
      // Remove price prefixes inside parens e.g. "(₹24,950 | Sundazee + Silver Pearl)" -> "(Sundazee + Silver Pearl)"
      .replace(/\(\s*(?:₹|rs\.?|inr|usd|\$)\s*[\d,.]+\s*\|\s*/gi, '(')
      // Remove trailing/standalone prices inside parens e.g. "(4N/5D - ₹1,98,450)" -> "(4N/5D)"
      .replace(/\s*[-–—]\s*(?:₹|rs\.?|inr|usd|\$)\s*[\d,.]+/gi, '')
      // Remove parenthesized standalone price e.g. "(₹1,98,450)"
      .replace(/\s*\(\s*(?:₹|rs\.?|inr|usd|\$)\s*[\d,.]+\s*\)/gi, '')
      // Remove any leftover currency tokens and digits
      .replace(/(?:₹|rs\.?|inr|usd|\$)\s*[\d,.]+/gi, '')
      // Clean empty parentheses or dangling hyphens/pipes
      .replace(/\(\s*\)/g, '')
      .replace(/\s*[-–—|]\s*$/g, '')
      .replace(/\s{2,}/g, ' ')
      .trim();
  }

  function openEnquiryModal(placeName) {
    if (placeName && enquiryPlaceSelect) {
      const cleanTarget = cleanPlaceName(placeName).toLowerCase();
      let matchFound = false;
      for (let i = 0; i < enquiryPlaceSelect.options.length; i++) {
        const val = cleanPlaceName(enquiryPlaceSelect.options[i].value).toLowerCase();
        const text = cleanPlaceName(enquiryPlaceSelect.options[i].textContent).toLowerCase();
        if (val.includes(cleanTarget) || cleanTarget.includes(val) || text.includes(cleanTarget) || cleanTarget.includes(text)) {
          enquiryPlaceSelect.selectedIndex = i;
          matchFound = true;
          break;
        }
      }
      if (!matchFound) {
        const cleanName = cleanPlaceName(placeName);
        const opt = document.createElement('option');
        opt.value = cleanName;
        opt.textContent = cleanName;
        opt.selected = true;
        enquiryPlaceSelect.appendChild(opt);
      }
    }
    if (enquiryModal) {
      enquiryModal.classList.add('open');
      document.body.classList.add('modal-active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeEnquiryModal() {
    if (enquiryModal) {
      enquiryModal.classList.remove('open');
      if (!modalBackdrop || !modalBackdrop.classList.contains('open')) {
        document.body.classList.remove('modal-active');
        document.body.style.overflow = '';
      }
    }
  }

  enquiryClose?.addEventListener('click', closeEnquiryModal);
  enquiryModal?.addEventListener('click', (e) => {
    if (e.target === enquiryModal) closeEnquiryModal();
  });

  // Global event delegation for opening enquiry modal & details
  document.addEventListener('click', (e) => {
    const enquiryBtn = e.target.closest('.open-enquiry-btn');
    if (enquiryBtn) {
      e.preventDefault();
      const placeName = enquiryBtn.dataset.place || enquiryBtn.getAttribute('data-place');
      openEnquiryModal(placeName);
      return;
    }

    const detailsBtn = e.target.closest('.btn-details-outline');
    if (detailsBtn) {
      e.preventDefault();
      const key = detailsBtn.dataset.modal;
      if (key && tourData[key]) {
        openTourModal(key);
      }
      return;
    }

    const modalBookBtn = e.target.closest('.btn-modal-book-now');
    if (modalBookBtn) {
      e.preventDefault();
      const placeName = modalBookBtn.dataset.place;
      closeTourModal();
      openEnquiryModal(placeName);
      return;
    }
  });

  // Helper to extract enquiry form details without prices
  function getFormDetails() {
    const name = document.getElementById('enquiry-name')?.value.trim() || '';
    const phone = document.getElementById('enquiry-phone')?.value.trim() || '';
    const adults = document.getElementById('enquiry-adults')?.value || '1';
    const kids = document.getElementById('enquiry-kids')?.value.trim() || 'None';
    const rawPlace = enquiryPlaceSelect?.value || 'Custom / Other Destination';
    const place = cleanPlaceName(rawPlace);
    const checkin = checkinInput?.value || todayStr;
    const checkout = checkoutInput?.value || defaultCheckoutStr;
    const hotelRadio = document.querySelector('input[name="hotel_category"]:checked');
    const hotel = hotelRadio ? hotelRadio.value : '4★ Deluxe';
    return { name, phone, adults, kids, place, checkin, checkout, hotel };
  }

  // Submit Handler: Automatically sends details via WhatsApp to JP Holidays contact number (Strictly NO prices mentioned)
  enquiryForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const d = getFormDetails();
    if (!d.name || !d.phone) {
      alert('Please fill in all required fields (Name and Phone Number)!');
      return;
    }

    // Build WhatsApp message for Admin — strictly no package price mentioned
    const message = `Hello JP Holidays! I would like to book/enquire about a holiday package:

👤 Your Name: ${d.name}
👥 No. of Adults: ${d.adults}
🧒 No. of Kids (Below 12 Years) & Age: ${d.kids}
📍 Place of Visit: ${d.place}
📅 Check-in Date: ${d.checkin}
📆 Check-out Date: ${d.checkout}
🏨 Preferred Hotel Category: ${d.hotel}

📞 Contact Number: ${d.phone}`;

    const waUrl = `https://wa.me/917200669293?text=${encodeURIComponent(message)}`;
    
    // Open WhatsApp in a new tab with pre-filled message
    window.open(waUrl, '_blank');

    alert(`🎉 Thank you, ${d.name}!\n\nYour enquiry for "${d.place}" has been submitted and sent to JP Holidays (+91 7200669293) via WhatsApp.`);
    
    enquiryForm.reset();
    closeEnquiryModal();
  });

});

