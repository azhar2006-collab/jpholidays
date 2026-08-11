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

  mobileToggle?.addEventListener('click', () => {
    mobileToggle.classList.toggle('active');
    mainNav.classList.toggle('open');
    document.body.style.overflow = mainNav.classList.contains('open') ? 'hidden' : '';
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
      mainNav.classList.remove('open');
      mobileToggle?.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  /* ----- Hero Slider ----- */
  const slides = document.querySelectorAll('.hero-slide');
  const heroDots = document.querySelectorAll('.hero-dot');
  let currentSlide = 0;
  let slideInterval;

  function goToSlide(index) {
    slides.forEach((s, i) => s.classList.toggle('active', i === index));
    heroDots.forEach((d, i) => d.classList.toggle('active', i === index));
    currentSlide = index;
  }

  function nextSlide() { goToSlide((currentSlide + 1) % slides.length); }
  function startSlider() { slideInterval = setInterval(nextSlide, 5000); }

  heroDots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      clearInterval(slideInterval);
      goToSlide(i);
      startSlider();
    });
  });

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
        // If custom search destination (e.g. Bali, Maldives, Europe, Kashmir) has no featured card,
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
      title: "Andaman Family Tour",
      badge: "ISLAND PARADISE • 4 NIGHTS / 5 DAYS",
      img: "https://images.unsplash.com/photo-1537956965359-7573183d1f57?auto=format&fit=crop&w=1200&q=80",
      price: "₹29,999",
      unit: "Per Person",
      phone: "7200669293",
      route: "Andaman And Nicobar Islands, India (Port Blair ↔ Havelock ↔ Neil Island)",
      itinerary: [
        { day: "Day 1", desc: "Port Blair Arrival – Cellular Jail visit & Light and Sound show." },
        { day: "Day 2", desc: "Port Blair to Havelock Island – Cruise ferry ride & Radhanagar Beach sunset." },
        { day: "Day 3", desc: "Elephant Beach Snorkeling – Water sports & glass bottom boat ride." },
        { day: "Day 4", desc: "Havelock to Neil Island – Bharatpur & Laxmanpur beach, return to Port Blair." },
        { day: "Day 5", desc: "Port Blair departure airport drop." }
      ],
      inclusions: [
        "4 Nights Beach Resort Stay",
        "Daily Breakfast at Resorts",
        "High-Speed Catamaran Cruise Ferry Tickets (Makruzz/Green Ocean)",
        "Complimentary Snorkeling Session at Elephant Beach",
        "All Island Airport & Jetty Transfers"
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
      img: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80",
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
    europe: {
      title: "Europe 5-Country Grand Tour",
      badge: "GRAND INTERNATIONAL • 9 NIGHTS / 10 DAYS",
      img: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1200&q=80",
      price: "₹1,85,000",
      unit: "Per Person",
      phone: "7200669293",
      route: "France (Paris) → Belgium (Brussels) → Netherlands (Amsterdam) → Germany → Switzerland (Titlis & Lucerne)",
      itinerary: [
        { day: "Days 1-2", desc: "Paris (France) – Eiffel Tower 2nd level, Seine River Cruise & Louvre Museum." },
        { day: "Day 3", desc: "Paris to Brussels & Amsterdam – Manneken Pis, Atomium & Amsterdam Canal Cruise." },
        { day: "Day 4", desc: "Zaanse Schans Windmills & Keukenhof Tulip Gardens." },
        { day: "Day 5", desc: "Drive to Cologne (Germany) – Cologne Cathedral & Rhine River Valley cruise." },
        { day: "Days 6-8", desc: "Switzerland (Engelberg/Lucerne) – Mt. Titlis Rotair Cable Car, Ice Flyer & Chapel Bridge." },
        { day: "Day 9", desc: "Black Forest & Rhine Falls (Schaffhausen) boat ride." },
        { day: "Day 10", desc: "Zurich Departure – City tour & return flight." }
      ],
      inclusions: [
        "9 Nights 4★ Hotel Accommodation across Europe",
        "Daily Continental Breakfast & Indian Dinners",
        "Eiffel Tower Ticket & Seine River Cruise Ticket",
        "Mt. Titlis Cable Car Ticket & Ice Flyer",
        "Luxury AC Coach Transportation & Schengen Visa Support"
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
    switzerland: {
      title: "Switzerland Alpine Dream Expedition",
      badge: "ALPINES & LAKES • 6 NIGHTS / 7 DAYS",
      img: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80",
      price: "₹1,42,000",
      unit: "Per Person",
      phone: "7200669293",
      route: "Zurich → Interlaken → Jungfraujoch → Lucerne → Mt Titlis → Geneva",
      itinerary: [
        { day: "Day 1", desc: "Zurich Arrival – Lake Zurich cruise, Bahnhofstrasse shopping & hotel check-in." },
        { day: "Day 2", desc: "Zurich to Interlaken – Golden Pass scenic train ride & Lake Brienz cruise." },
        { day: "Day 3", desc: "Jungfraujoch Top of Europe – Cogwheel train to snow glacier peak & Ice Palace." },
        { day: "Day 4", desc: "Interlaken to Lucerne – Chapel Bridge, Lion Monument & Lucerne lake promenade." },
        { day: "Day 5", desc: "Mount Titlis Excursion – Rotair 360 Cable Car, Cliff Walk & Glacier Cave." },
        { day: "Day 6", desc: "Lucerne to Geneva – Jet d'Eau fountain & United Nations headquarters." },
        { day: "Day 7", desc: "Geneva Departure – Airport transfer for return flight." }
      ],
      inclusions: [
        "6 Nights 4★ Swiss Hotel Stay with Breakfast",
        "7-Day Swiss Travel Pass (Unlimited Trains, Buses & Boats)",
        "Jungfraujoch Top of Europe Train Ticket",
        "Mt. Titlis Cable Car Excursion Pass",
        "Visa Assistance & Travel Insurance"
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
    }
  };

  const modalBackdrop = document.getElementById('tour-modal');
  const modalContent = document.getElementById('modal-dynamic-content');
  const modalClose = modalBackdrop?.querySelector('.modal-close');

  function openTourModal(key) {
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
              ${data.itinerary.map(item => `
                <div class="itinerary-item">
                  <span class="itinerary-day">${item.day}</span>
                  <span class="itinerary-desc">${item.desc}</span>
                </div>
              `).join('')}
            </div>
          </div>
          <div>
            <h4 class="modal-section-title">Package Inclusions</h4>
            <div class="inclusions-box">
              <ul>
                ${data.inclusions.map(inc => `
                  <li><i class="fa-solid fa-circle-check"></i> ${inc}</li>
                `).join('')}
              </ul>
            </div>
            <div style="background:#F0E8EA; padding:15px; border-radius:12px;">
              <div style="font-size:0.78rem; color:#777; font-weight:700; text-transform:uppercase;">Tour Route / Location</div>
              <div style="font-size:0.88rem; font-weight:600; color:#1A0A0C; margin-top:4px;">${data.route}</div>
            </div>
          </div>
        </div>

        <div class="modal-footer-cta">
          <div class="modal-price-box">
            <span class="price-label">Starting Price</span>
            <div class="price-val">${data.price} <small style="font-size:0.8rem; font-weight:normal; color:#666;">${data.unit}</small></div>
          </div>
          <div class="modal-actions">
            <a href="tel:${data.phone}" class="btn-call"><i class="fa-solid fa-phone"></i> Call ${data.phone}</a>
            <button class="btn btn-primary btn-modal-book-now" data-place="${data.title}">Book Package Now</button>
          </div>
        </div>
      </div>
    `;

    modalBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeTourModal() {
    modalBackdrop?.classList.remove('open');
    document.body.style.overflow = '';
  }

  modalClose?.addEventListener('click', closeTourModal);
  modalBackdrop?.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeTourModal();
  });

  /* ----- Package Book / Details Buttons ----- */
  document.querySelectorAll('.package-book:not(.open-enquiry-btn)').forEach(btn => {
    btn.addEventListener('click', () => {
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

