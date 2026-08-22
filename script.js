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
      title: "Finland & Norway Ultimate Arctic Luxury Escape",
      badge: "ARCTIC LUXURY • 11 NIGHTS / 12 DAYS",
      img: "https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=1200&q=80",
      price: "₹5,29,761",
      unit: "Per Person (Incl. GST, TCS & Insurance)",
      phone: "7200669293",
      route: "Helsinki (4N Scandic Grand Marina) → Saariselkä (3N Kakslauttanen Luxury Glass Igloo) → Tromsø (4N Quality Hotel Grand Tromsø)",
      itinerary: [
        { day: "Day 1", desc: "Arrival in Helsinki – Transfer to Scandic Grand Marina, harbour & waterfront leisure." },
        { day: "Day 2", desc: "Tallinn Ferry Cruise – Baltic Sea ferry to Tallinn (Estonia), guided UNESCO Old Town tour & return." },
        { day: "Day 3", desc: "Helsinki to Saariselkä Arctic Resort – City tour, Flying Cinema, SkyWheel, flight to Ivalo, check-in at Kakslauttanen Glass Igloo & Aurora Quad Bike Safari." },
        { day: "Day 4", desc: "Husky Farm & Safari – Authentic Husky farm visit, Husky cart safari & warm drinks." },
        { day: "Day 5", desc: "Lake Inari & Horse Aurora – Great Lake Inari boat cruise & Aurora hunting by horse carriage." },
        { day: "Days 6-9", desc: "Tromsø Arctic Fjords – Flight to Tromsø (Norway), Full-Day Arctic Fjords tour at Sommarøy Island, Kvaløya guided scenic tour, traditional Norwegian lunch, Lake Cabin hike, bonfire & evening Northern Lights tour." },
        { day: "Days 10-11", desc: "Helsinki Linnanmäki – Return flight to Helsinki, full day at Linnanmäki Amusement Park with unlimited ride pass." },
        { day: "Day 12", desc: "Departure – Private airport transfer for return flight." }
      ],
      inclusions: [
        "11 Nights Accommodation (Scandic Grand Marina, Kakslauttanen Luxury Glass Igloo, Quality Hotel Grand Tromsø)",
        "Daily Breakfast + Traditional Norwegian Lunch + Arctic Warm Drinks",
        "3 Domestic Arctic Flights (Helsinki–Ivalo, Ivalo–Tromsø, Tromsø–Helsinki)",
        "Tallinn Baltic Sea Ferry Cruise & Guided UNESCO Tour",
        "Aurora Quad Bike Safari + Husky Cart Safari + Aurora Horse Carriage Tour",
        "Lake Inari Boat Cruise + Arctic Fjords Tour + Linnanmäki Unlimited Ride Pass"
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
      title: "Grand Kashmir Tour",
      badge: "PARADISE ON EARTH • 6 NIGHTS / 7 DAYS",
      img: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=80",
      price: "₹87,450",
      unit: "Total Package (Flights Excl.)",
      phone: "7200669293",
      route: "Srinagar (Hotel Kareem Residency/Leon) → Super Deluxe Houseboat (Dal Lake) → Pahalgam (Hotel Fifth Season)",
      itinerary: [
        { day: "Day 1", desc: "Arrival in Srinagar Airport – Private transfer to hotel, evening at leisure." },
        { day: "Day 2", desc: "Sonamarg Excursion – Srinagar to Sonamarg day trip, Sindh river view & return." },
        { day: "Day 3", desc: "Gulmarg Snow Point – Srinagar to Gulmarg day trip, snow view points & return." },
        { day: "Day 4", desc: "Srinagar to Pahalgam – Drive to Pahalgam, check-in at Hotel Fifth Season & overnight." },
        { day: "Day 5", desc: "Pahalgam to Srinagar – Return drive to Srinagar & leisure day." },
        { day: "Day 6", desc: "Srinagar & Houseboat – Srinagar local Mughal Gardens tour & Super Deluxe Houseboat stay on Dal Lake." },
        { day: "Day 7", desc: "Departure – Breakfast & drop at Srinagar Airport." }
      ],
      inclusions: [
        "1 Night Super Deluxe Houseboat on Dal Lake + 5 Nights Hotel Stay",
        "Daily Breakfast & Dinner",
        "Private Innova Vehicle for all transfers & sightseeing",
        "Complimentary Shikara Ride on Dal Lake"
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
      title: "Kashmir Paradise & Gulmarg Snow",
      badge: "NATURE & SNOW • 5 NIGHTS / 6 DAYS",
      img: "https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=1200&q=80",
      price: "₹28,500",
      unit: "Per Person",
      phone: "7200669293",
      route: "Srinagar → Gulmarg → Pahalgam → Sonamarg → Srinagar",
      itinerary: [
        { day: "Day 1", desc: "Arrival in Srinagar – Check-in at Deluxe Houseboat on Dal Lake, evening Shikara ride." },
        { day: "Day 2", desc: "Srinagar to Gulmarg – Gondola Cable Car Ride (Phase 1 & 2) & snow activities." },
        { day: "Day 3", desc: "Gulmarg to Pahalgam – Visit Pampore Saffron Fields, Awantipora Ruins & Betaab Valley." },
        { day: "Day 4", desc: "Pahalgam Valley Tour – Aru Valley, Chandanwari & pony rides along Lidder River." },
        { day: "Day 5", desc: "Sonamarg Day Excursion – Thajiwas Glacier pony ride & return to Srinagar Mughal Gardens." },
        { day: "Day 6", desc: "Departure – Breakfast & Srinagar airport drop." }
      ],
      inclusions: [
        "1 Night Deluxe Houseboat + 4 Nights 4★ Hotel Stay",
        "Daily Breakfast & Dinner",
        "Complimentary 1-Hour Shikara Ride on Dal Lake",
        "Gulmarg Gondola Cable Car Ticket (Phase 1)",
        "Private Heating Vehicle for all Sightseeing & Transfers"
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

    modalContent.innerHTML = `
      <div class="modal-header-banner">
        <img src="${data.img}" alt="${data.title}">
        <div class="modal-header-overlay">
          <span class="modal-badge">${data.badge}</span>
          <h2>${data.title}</h2>
        </div>
      </div>
      <div class="modal-body">
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
            <h4 class="modal-section-title">Package Inclusions</h4>
            <div class="inclusions-box">
              <ul>
                ${data.inclusions ? data.inclusions.map(inc => `
                  <li><i class="fa-solid fa-circle-check"></i> ${inc}</li>
                `).join('') : '<li><i class="fa-solid fa-circle-check"></i> Standard Package Inclusions</li>'}
              </ul>
            </div>
            <div style="background:#F0E8EA; padding:15px; border-radius:12px;">
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

    modalBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeTourModal() {
    if (modalBackdrop) modalBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  const existingModalClose = document.querySelector('#tour-modal .modal-close');
  existingModalClose?.addEventListener('click', closeTourModal);
  document.getElementById('tour-modal')?.addEventListener('click', (e) => {
    if (e.target === document.getElementById('tour-modal')) closeTourModal();
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

  function openEnquiryModal(placeName) {
    if (placeName && enquiryPlaceSelect) {
      let matchFound = false;
      for (let i = 0; i < enquiryPlaceSelect.options.length; i++) {
        const val = enquiryPlaceSelect.options[i].value.toLowerCase();
        const target = placeName.toLowerCase();
        if (val.includes(target) || target.includes(val)) {
          enquiryPlaceSelect.selectedIndex = i;
          matchFound = true;
          break;
        }
      }
      if (!matchFound) {
        const opt = document.createElement('option');
        opt.value = placeName;
        opt.textContent = placeName;
        opt.selected = true;
        enquiryPlaceSelect.appendChild(opt);
      }
    }
    if (enquiryModal) {
      enquiryModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeEnquiryModal() {
    if (enquiryModal) {
      enquiryModal.classList.remove('open');
      document.body.style.overflow = '';
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

  // Helper to extract enquiry form details
  function getFormDetails() {
    const name = document.getElementById('enquiry-name')?.value || '';
    const phone = document.getElementById('enquiry-phone')?.value || '';
    const adults = document.getElementById('enquiry-adults')?.value || '1';
    const kids = document.getElementById('enquiry-kids')?.value || 'None';
    const place = enquiryPlaceSelect?.value || 'Custom / Other Destination';
    const checkin = checkinInput?.value || todayStr;
    const checkout = checkoutInput?.value || defaultCheckoutStr;
    const hotelRadio = document.querySelector('input[name="hotel_category"]:checked');
    const hotel = hotelRadio ? hotelRadio.value : '4★ Deluxe';
    return { name, phone, adults, kids, place, checkin, checkout, hotel };
  }

  // Submit Handler: Automatically sends details via WhatsApp to JP Holidays contact number
  enquiryForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const d = getFormDetails();
    if (!d.name || !d.phone) {
      alert('Please fill in all required fields (Name and Phone Number)!');
      return;
    }

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

