/* ═══════════════════════════════════════════════════
   VOYA TRAVEL DASHBOARD — MAIN SCRIPT
   Uses: Open-Meteo (free weather), Nominatim (geocoding),
   OpenStreetMap embed (maps), + local city data
═══════════════════════════════════════════════════ */

'use strict';

/* ─────────────────────────────────────────────────
   CITY DATABASE
   Rich local data used alongside live API calls
───────────────────────────────────────────────── */
const CITY_DATA = {
  "paris": {
    name: "Paris", country: "France", flag: "🇫🇷",
    lat: 48.8566, lon: 2.3522, tz: "Europe/Paris",
    color1: "#1a1035", color2: "#2d1b69",
    accent: "#9b59b6",
    attractions: [
      { name: "Eiffel Tower", type: "Landmark", emoji: "🗼" },
      { name: "The Louvre", type: "Museum", emoji: "🏛️" },
      { name: "Notre-Dame Cathedral", type: "Religious Site", emoji: "⛪" },
      { name: "Musée d'Orsay", type: "Museum", emoji: "🎨" },
      { name: "Montmartre", type: "Neighbourhood", emoji: "🎭" },
    ],
    facts: [
      { icon: "🧑‍🤝‍🧑", value: "2.1M", label: "Population" },
      { icon: "✈️", value: "92M", label: "Tourists/yr" },
      { icon: "📅", value: "987", label: "Founded" },
      { icon: "🌡️", value: "12°C", label: "Avg. Temp" },
      { icon: "🗣️", value: "French", label: "Language" },
    ],
    tempData: [4,5,9,13,17,20,23,23,19,14,8,4],
    rainData: [50,40,48,55,65,55,60,65,55,58,52,52],
    bgGradient: "linear-gradient(135deg, #1a1035 0%, #2d1b69 50%, #6b3fa0 100%)",
    // Best month scores (0–10 per month, Jan–Dec)
    visitScore: [3,4,5,7,9,8,7,8,9,7,5,4],
    bestMonths: "Apr, Sep & Oct",
    // Daily budget in USD
    budget: { low: 85, mid: 180, high: 450 },
    costs: [
      { label: "🏨 Hotel", mid: 120, max: 300 },
      { label: "🍽️ Food", mid: 35, max: 100 },
      { label: "🚇 Transport", mid: 15, max: 40 },
      { label: "🎭 Activities", mid: 25, max: 80 },
    ],
    // Visa info (generalised for most Western passports)
    visa: {
      status: "free",
      statusLabel: "Visa Free",
      rows: [
        { icon: "🛂", label: "Entry Type", value: "Visa-free (Schengen) for 90 days" },
        { icon: "📄", label: "Requirements", value: "Valid passport + return ticket" },
        { icon: "💉", label: "Health", value: "No vaccinations required" },
        { icon: "💶", label: "Currency", value: "Euro (EUR) — cards widely accepted" },
      ]
    },
    // Local phrases [english, local, phonetic]
    language: "French",
    phrases: [
      ["Hello", "Bonjour", "bon-ZHOOR"],
      ["Thank you", "Merci", "mair-SEE"],
      ["Where is…?", "Où est…?", "oo-EH"],
      ["How much?", "Combien?", "kom-BYEHN"],
      ["The bill please", "L'addition, s'il vous plaît", "lah-dee-SYOHN"],
    ],
    // Vibe scores /100
    vibe: {
      safety: 72, nightlife: 88, family: 80, food: 97, culture: 99,
    },
  },
  "tokyo": {
    name: "Tokyo", country: "Japan", flag: "🇯🇵",
    lat: 35.6762, lon: 139.6503, tz: "Asia/Tokyo",
    color1: "#0a0a1a", color2: "#1a0030",
    accent: "#ff0080",
    attractions: [
      { name: "Shibuya Crossing", type: "Landmark", emoji: "🚦" },
      { name: "Senso-ji Temple", type: "Temple", emoji: "⛩️" },
      { name: "Tokyo Skytree", type: "Tower", emoji: "🗼" },
      { name: "Shinjuku Gyoen", type: "Park", emoji: "🌸" },
      { name: "Tsukiji Market", type: "Market", emoji: "🐟" },
    ],
    facts: [
      { icon: "🧑‍🤝‍🧑", value: "13.9M", label: "Population" },
      { icon: "✈️", value: "31M", label: "Tourists/yr" },
      { icon: "📅", value: "1457", label: "Founded" },
      { icon: "🌡️", value: "15°C", label: "Avg. Temp" },
      { icon: "🗣️", value: "Japanese", label: "Language" },
    ],
    tempData: [5,6,10,15,20,23,27,29,25,19,13,8],
    rainData: [52,56,117,124,138,168,154,168,210,198,93,51],
    bgGradient: "linear-gradient(135deg, #0a0a1a 0%, #1a0030 50%, #3a0050 100%)",
    visitScore: [4,4,8,9,6,5,4,4,7,8,6,4],
    bestMonths: "Mar–Apr (Cherry Blossom) & Oct",
    budget: { low: 65, mid: 150, high: 380 },
    costs: [
      { label: "🏨 Hotel", mid: 90, max: 250 },
      { label: "🍜 Food", mid: 30, max: 80 },
      { label: "🚄 Transport", mid: 18, max: 35 },
      { label: "🎎 Activities", mid: 20, max: 60 },
    ],
    visa: {
      status: "free",
      statusLabel: "Visa Free",
      rows: [
        { icon: "🛂", label: "Entry Type", value: "Visa-free for 90 days (most countries)" },
        { icon: "📄", label: "Requirements", value: "Valid passport, onward ticket" },
        { icon: "💉", label: "Health", value: "No vaccinations required" },
        { icon: "💴", label: "Currency", value: "Yen (JPY) — cash preferred" },
      ]
    },
    language: "Japanese",
    phrases: [
      ["Hello", "Konnichiwa", "kon-NEE-chee-wa"],
      ["Thank you", "Arigatou", "ah-REE-gah-toh"],
      ["Excuse me", "Sumimasen", "soo-mee-MAH-sen"],
      ["How much?", "Ikura desu ka?", "ee-KOO-ra des-KA"],
      ["Delicious!", "Oishii!", "oh-EE-shee"],
    ],
    vibe: { safety: 97, nightlife: 85, family: 88, food: 98, culture: 96 },
  },
  "new york": {
    name: "New York", country: "United States", flag: "🇺🇸",
    lat: 40.7128, lon: -74.0060, tz: "America/New_York",
    color1: "#0a1628", color2: "#1a2a4a",
    accent: "#3b82f6",
    attractions: [
      { name: "Statue of Liberty", type: "Landmark", emoji: "🗽" },
      { name: "Central Park", type: "Park", emoji: "🌳" },
      { name: "Times Square", type: "District", emoji: "🎪" },
      { name: "Brooklyn Bridge", type: "Bridge", emoji: "🌉" },
      { name: "The Metropolitan Museum", type: "Museum", emoji: "🏛️" },
    ],
    facts: [
      { icon: "🧑‍🤝‍🧑", value: "8.3M", label: "Population" },
      { icon: "✈️", value: "66M", label: "Tourists/yr" },
      { icon: "📅", value: "1624", label: "Founded" },
      { icon: "🌡️", value: "12°C", label: "Avg. Temp" },
      { icon: "🗣️", value: "English", label: "Language" },
    ],
    tempData: [0,2,7,13,19,24,27,26,22,16,9,2],
    rainData: [94,87,109,109,100,108,116,109,102,108,104,100],
    bgGradient: "linear-gradient(135deg, #0a1628 0%, #1a2a4a 50%, #2a3a6a 100%)",
    visitScore: [4,4,6,8,9,7,7,7,9,8,6,5],
    bestMonths: "Apr–May & Sep–Oct",
    budget: { low: 120, mid: 250, high: 600 },
    costs: [
      { label: "🏨 Hotel", mid: 160, max: 450 },
      { label: "🍔 Food", mid: 50, max: 150 },
      { label: "🚇 Transport", mid: 15, max: 50 },
      { label: "🎭 Activities", mid: 35, max: 100 },
    ],
    visa: {
      status: "free",
      statusLabel: "Visa Free (ESTA)",
      rows: [
        { icon: "🛂", label: "Entry Type", value: "ESTA required for VWP countries ($21 fee)" },
        { icon: "📄", label: "Requirements", value: "Passport, ESTA approval, return ticket" },
        { icon: "💉", label: "Health", value: "No vaccinations required" },
        { icon: "💵", label: "Currency", value: "USD — cards universally accepted" },
      ]
    },
    language: "English",
    phrases: [
      ["Hello", "Hey!", "HEY"],
      ["Thank you", "Thanks a lot", "THANKS-a-lot"],
      ["Where is…?", "How do I get to…?", "how-do-I-GET-to"],
      ["How much?", "What's the price?", "whats-the-PRICE"],
      ["Delicious", "This is amazing!", "this-is-ah-MAY-zing"],
    ],
    vibe: { safety: 65, nightlife: 96, family: 72, food: 95, culture: 97 },
  },
  "bali": {
    name: "Bali", country: "Indonesia", flag: "🇮🇩",
    lat: -8.3405, lon: 115.0920, tz: "Asia/Makassar",
    color1: "#0a1a0a", color2: "#1a3010",
    accent: "#22c55e",
    attractions: [
      { name: "Tanah Lot Temple", type: "Temple", emoji: "⛩️" },
      { name: "Ubud Monkey Forest", type: "Nature", emoji: "🐒" },
      { name: "Mount Batur", type: "Volcano", emoji: "🌋" },
      { name: "Seminyak Beach", type: "Beach", emoji: "🏖️" },
      { name: "Tegallalang Rice Terrace", type: "Nature", emoji: "🌾" },
    ],
    facts: [
      { icon: "🧑‍🤝‍🧑", value: "4.3M", label: "Population" },
      { icon: "✈️", value: "6.3M", label: "Tourists/yr" },
      { icon: "📅", value: "914", label: "Founded" },
      { icon: "🌡️", value: "27°C", label: "Avg. Temp" },
      { icon: "🗣️", value: "Balinese", label: "Language" },
    ],
    tempData: [27,27,27,28,27,26,26,26,27,27,27,27],
    rainData: [295,210,180,73,53,67,39,26,36,101,175,270],
    bgGradient: "linear-gradient(135deg, #0a1a0a 0%, #1a3010 50%, #2a5020 100%)",
    visitScore: [3,4,5,7,8,8,9,9,8,7,5,3],
    bestMonths: "Jul–Aug (Dry Season)",
    budget: { low: 35, mid: 80, high: 220 },
    costs: [
      { label: "🏨 Hotel", mid: 45, max: 150 },
      { label: "🍛 Food", mid: 15, max: 40 },
      { label: "🛵 Transport", mid: 8, max: 25 },
      { label: "🌺 Activities", mid: 18, max: 60 },
    ],
    visa: {
      status: "on-arrival",
      statusLabel: "Visa on Arrival",
      rows: [
        { icon: "🛂", label: "Entry Type", value: "Visa on Arrival — 30 days ($35 USD)" },
        { icon: "📄", label: "Requirements", value: "Passport valid 6+ months, return ticket" },
        { icon: "💉", label: "Health", value: "Hepatitis A & Typhoid recommended" },
        { icon: "💵", label: "Currency", value: "IDR Rupiah — cash essential" },
      ]
    },
    language: "Indonesian / Balinese",
    phrases: [
      ["Hello", "Om Swastyastu", "om-swa-STYAS-tu"],
      ["Thank you", "Matur suksma", "mah-TUR sook-SMA"],
      ["How much?", "Berapa harganya?", "beh-RAH-pah HAR-ga-nya"],
      ["Delicious", "Enak sekali!", "eh-NAHK seh-KAH-lee"],
      ["Good morning", "Selamat pagi", "seh-LAH-mat PAH-gee"],
    ],
    vibe: { safety: 78, nightlife: 82, family: 85, food: 90, culture: 92 },
  },
  "cairo": {
    name: "Cairo", country: "Egypt", flag: "🇪🇬",
    lat: 30.0444, lon: 31.2357, tz: "Africa/Cairo",
    color1: "#1a1208", color2: "#3a2810",
    accent: "#f59e0b",
    attractions: [
      { name: "Great Pyramids of Giza", type: "Ancient Wonder", emoji: "🏛️" },
      { name: "The Sphinx", type: "Monument", emoji: "🦁" },
      { name: "Egyptian Museum", type: "Museum", emoji: "🏺" },
      { name: "Khan el-Khalili", type: "Bazaar", emoji: "🛍️" },
      { name: "Coptic Cairo", type: "Historic District", emoji: "⛪" },
    ],
    facts: [
      { icon: "🧑‍🤝‍🧑", value: "21M", label: "Population" },
      { icon: "✈️", value: "13M", label: "Tourists/yr" },
      { icon: "📅", value: "969", label: "Founded" },
      { icon: "🌡️", value: "22°C", label: "Avg. Temp" },
      { icon: "🗣️", value: "Arabic", label: "Language" },
    ],
    tempData: [14,16,19,24,28,31,32,32,30,26,21,15],
    rainData: [5,3,4,2,1,0,0,0,0,1,3,5],
    bgGradient: "linear-gradient(135deg, #1a1208 0%, #3a2810 50%, #6a4a18 100%)",
    visitScore: [7,7,8,7,5,3,2,2,4,8,9,8],
    bestMonths: "Oct–Mar (Cool & Dry)",
    budget: { low: 40, mid: 90, high: 200 },
    costs: [
      { label: "🏨 Hotel", mid: 55, max: 130 },
      { label: "🥙 Food", mid: 15, max: 40 },
      { label: "🚌 Transport", mid: 8, max: 20 },
      { label: "🏺 Activities", mid: 20, max: 55 },
    ],
    visa: {
      status: "on-arrival",
      statusLabel: "Visa on Arrival",
      rows: [
        { icon: "🛂", label: "Entry Type", value: "Visa on Arrival — 30 days ($25 USD)" },
        { icon: "📄", label: "Requirements", value: "Passport valid 6+ months" },
        { icon: "💉", label: "Health", value: "Hepatitis A recommended" },
        { icon: "💵", label: "Currency", value: "EGP — USD also widely accepted" },
      ]
    },
    language: "Arabic",
    phrases: [
      ["Hello", "Ahlan wa sahlan", "AH-lan wa SAH-lan"],
      ["Thank you", "Shukran", "SHOOK-ran"],
      ["How much?", "Bi kam?", "bee-KAM"],
      ["Yes / No", "Aywa / La", "AY-wa / LAH"],
      ["Good", "Quayyis", "KWI-yis"],
    ],
    vibe: { safety: 62, nightlife: 58, family: 70, food: 88, culture: 99 },
  },
  "london": {
    name: "London", country: "United Kingdom", flag: "🇬🇧",
    lat: 51.5074, lon: -0.1278, tz: "Europe/London",
    color1: "#0e1a20", color2: "#1a2a35",
    accent: "#64748b",
    attractions: [
      { name: "Tower of London", type: "Castle", emoji: "🏰" },
      { name: "Buckingham Palace", type: "Palace", emoji: "👑" },
      { name: "British Museum", type: "Museum", emoji: "🏛️" },
      { name: "Big Ben", type: "Landmark", emoji: "🕰️" },
      { name: "The Tate Modern", type: "Gallery", emoji: "🎨" },
    ],
    facts: [
      { icon: "🧑‍🤝‍🧑", value: "9M", label: "Population" },
      { icon: "✈️", value: "40M", label: "Tourists/yr" },
      { icon: "📅", value: "43", label: "Founded (AD)" },
      { icon: "🌡️", value: "11°C", label: "Avg. Temp" },
      { icon: "🗣️", value: "English", label: "Language" },
    ],
    tempData: [5,5,8,11,14,17,19,19,16,12,8,5],
    rainData: [55,40,45,43,49,45,45,59,49,68,59,55],
    bgGradient: "linear-gradient(135deg, #0e1a20 0%, #1a2a35 50%, #2a3a45 100%)",
    visitScore: [4,4,5,7,8,9,8,8,7,6,5,4],
    bestMonths: "May–Jul (Long days)",
    budget: { low: 100, mid: 220, high: 520 },
    costs: [
      { label: "🏨 Hotel", mid: 140, max: 380 },
      { label: "🍺 Food", mid: 45, max: 120 },
      { label: "🚇 Transport", mid: 20, max: 45 },
      { label: "🎭 Activities", mid: 30, max: 80 },
    ],
    visa: {
      status: "free",
      statusLabel: "Visa Free",
      rows: [
        { icon: "🛂", label: "Entry Type", value: "Visa-free for most countries (6 months)" },
        { icon: "📄", label: "Requirements", value: "Valid passport, proof of funds" },
        { icon: "💉", label: "Health", value: "No vaccinations required" },
        { icon: "💷", label: "Currency", value: "GBP Sterling — cards universally accepted" },
      ]
    },
    language: "English",
    phrases: [
      ["Hello", "Hiya! / Alright?", "HI-ya / al-RIGHT"],
      ["Thank you", "Cheers!", "CHEERZ"],
      ["Excuse me", "Sorry! / Pardon?", "SORE-ee"],
      ["Delicious", "Lovely / Smashing", "LUV-lee"],
      ["No problem", "No worries mate", "no-WUH-reez-mayt"],
    ],
    vibe: { safety: 75, nightlife: 90, family: 82, food: 88, culture: 98 },
  },
  "dubai": {
    name: "Dubai", country: "UAE", flag: "🇦🇪",
    lat: 25.2048, lon: 55.2708, tz: "Asia/Dubai",
    color1: "#0a0e1a", color2: "#1a1a2e",
    accent: "#ffd700",
    attractions: [
      { name: "Burj Khalifa", type: "Skyscraper", emoji: "🏙️" },
      { name: "Palm Jumeirah", type: "Island", emoji: "🌴" },
      { name: "Dubai Mall", type: "Shopping", emoji: "🛍️" },
      { name: "Dubai Frame", type: "Landmark", emoji: "🖼️" },
      { name: "Gold Souk", type: "Market", emoji: "✨" },
    ],
    facts: [
      { icon: "🧑‍🤝‍🧑", value: "3.5M", label: "Population" },
      { icon: "✈️", value: "16M", label: "Tourists/yr" },
      { icon: "📅", value: "1833", label: "Founded" },
      { icon: "🌡️", value: "28°C", label: "Avg. Temp" },
      { icon: "🗣️", value: "Arabic", label: "Language" },
    ],
    tempData: [19,21,24,28,33,35,37,38,35,31,25,21],
    rainData: [14,24,22,8,1,0,1,0,0,1,3,14],
    bgGradient: "linear-gradient(135deg, #0a0e1a 0%, #1a1a2e 50%, #2a2a4a 100%)",
    visitScore: [8,8,7,6,3,2,1,1,3,6,9,9],
    bestMonths: "Nov–Feb (Cool & Sunny)",
    budget: { low: 90, mid: 200, high: 600 },
    costs: [
      { label: "🏨 Hotel", mid: 130, max: 450 },
      { label: "🍢 Food", mid: 35, max: 120 },
      { label: "🚕 Transport", mid: 20, max: 60 },
      { label: "🎢 Activities", mid: 35, max: 100 },
    ],
    visa: {
      status: "free",
      statusLabel: "Visa Free",
      rows: [
        { icon: "🛂", label: "Entry Type", value: "Visa-free 30–90 days for 180+ countries" },
        { icon: "📄", label: "Requirements", value: "Valid passport, return ticket" },
        { icon: "💉", label: "Health", value: "No vaccinations required" },
        { icon: "💵", label: "Currency", value: "AED Dirham (pegged to USD)" },
      ]
    },
    language: "Arabic / English",
    phrases: [
      ["Hello", "Marhaba", "mar-HA-ba"],
      ["Thank you", "Shukran", "SHOOK-ran"],
      ["How much?", "Bikam?", "bee-KAM"],
      ["Welcome", "Ahlan", "AH-lan"],
      ["Goodbye", "Ma'a salama", "mah-ah sah-LAH-ma"],
    ],
    vibe: { safety: 92, nightlife: 78, family: 88, food: 85, culture: 80 },
  },
  "sydney": {
    name: "Sydney", country: "Australia", flag: "🇦🇺",
    lat: -33.8688, lon: 151.2093, tz: "Australia/Sydney",
    color1: "#001830", color2: "#002a50",
    accent: "#0ea5e9",
    attractions: [
      { name: "Sydney Opera House", type: "Arts Centre", emoji: "🎭" },
      { name: "Sydney Harbour Bridge", type: "Bridge", emoji: "🌉" },
      { name: "Bondi Beach", type: "Beach", emoji: "🏄" },
      { name: "The Rocks", type: "Historic District", emoji: "🪨" },
      { name: "Taronga Zoo", type: "Zoo", emoji: "🦘" },
    ],
    facts: [
      { icon: "🧑‍🤝‍🧑", value: "5.3M", label: "Population" },
      { icon: "✈️", value: "9M", label: "Tourists/yr" },
      { icon: "📅", value: "1788", label: "Founded" },
      { icon: "🌡️", value: "17°C", label: "Avg. Temp" },
      { icon: "🗣️", value: "English", label: "Language" },
    ],
    tempData: [26,26,24,22,18,15,14,15,18,21,23,25],
    rainData: [103,117,131,127,121,131,97,81,69,77,83,78],
    bgGradient: "linear-gradient(135deg, #001830 0%, #002a50 50%, #003a70 100%)",
    visitScore: [8,8,7,6,5,4,4,4,6,7,8,9],
    bestMonths: "Dec–Feb (Summer)",
    budget: { low: 80, mid: 180, high: 420 },
    costs: [
      { label: "🏨 Hotel", mid: 110, max: 300 },
      { label: "🥗 Food", mid: 40, max: 100 },
      { label: "🚌 Transport", mid: 15, max: 40 },
      { label: "🤿 Activities", mid: 30, max: 80 },
    ],
    visa: {
      status: "required",
      statusLabel: "eVisa Required",
      rows: [
        { icon: "🛂", label: "Entry Type", value: "eVisitor (subclass 651) — free, online" },
        { icon: "📄", label: "Requirements", value: "Passport, no criminal record" },
        { icon: "💉", label: "Health", value: "No vaccinations required" },
        { icon: "💵", label: "Currency", value: "AUD — cards widely accepted" },
      ]
    },
    language: "English",
    phrases: [
      ["Hello", "G'day!", "guh-DAY"],
      ["Thank you", "Ta / Cheers", "TAH"],
      ["Afternoon", "Arvo", "AR-voh"],
      ["Sunglasses", "Sunnies", "SUN-eez"],
      ["No worries", "No dramas", "no-DRAH-maz"],
    ],
    vibe: { safety: 86, nightlife: 84, family: 92, food: 90, culture: 85 },
  },
};

/* ─────────────────────────────────────────────────
   TOP DESTINATIONS FOR CAROUSEL
───────────────────────────────────────────────── */
const DESTINATIONS = [
  {
    city: "Paris", country: "France",
    badge: "Iconic",
    temp: "20°C", best: "Apr–Jun",
    bg: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=640&q=80",
    key: "paris",
  },
  {
    city: "Tokyo", country: "Japan",
    badge: "Trending",
    temp: "22°C", best: "Mar–May",
    bg: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=640&q=80",
    key: "tokyo",
  },
  {
    city: "Bali", country: "Indonesia",
    badge: "Escape",
    temp: "27°C", best: "Jul–Sep",
    bg: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=640&q=80",
    key: "bali",
  },
  {
    city: "New York", country: "USA",
    badge: "City Life",
    temp: "15°C", best: "Sep–Nov",
    bg: "https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?w=640&q=80",
    key: "new york",
  },
  {
    city: "Cairo", country: "Egypt",
    badge: "Ancient",
    temp: "30°C", best: "Oct–Apr",
    bg: "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=640&q=80",
    key: "cairo",
  },
  {
    city: "London", country: "UK",
    badge: "Classic",
    temp: "14°C", best: "May–Aug",
    bg: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=640&q=80",
    key: "london",
  },
  {
    city: "Dubai", country: "UAE",
    badge: "Luxury",
    temp: "28°C", best: "Nov–Mar",
    bg: "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=640&q=80",
    key: "dubai",
  },
  {
    city: "Sydney", country: "Australia",
    badge: "Adventure",
    temp: "22°C", best: "Dec–Feb",
    bg: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=640&q=80",
    key: "sydney",
  },
];

/* ─────────────────────────────────────────────────
   WEATHER ICONS (inline SVG)
───────────────────────────────────────────────── */
const WEATHER_ICONS = {
  sunny: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="12" fill="#f5c842"/>
    <g stroke="#f5c842" stroke-width="3" stroke-linecap="round">
      <line x1="32" y1="6" x2="32" y2="12"/>
      <line x1="32" y1="52" x2="32" y2="58"/>
      <line x1="6" y1="32" x2="12" y2="32"/>
      <line x1="52" y1="32" x2="58" y2="32"/>
      <line x1="13.9" y1="13.9" x2="18.1" y2="18.1"/>
      <line x1="45.9" y1="45.9" x2="50.1" y2="50.1"/>
      <line x1="50.1" y1="13.9" x2="45.9" y2="18.1"/>
      <line x1="18.1" y1="45.9" x2="13.9" y2="50.1"/>
    </g>
  </svg>`,
  cloudy: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="32" cy="42" rx="22" ry="10" fill="#94a3b8"/>
    <ellipse cx="24" cy="36" rx="14" ry="12" fill="#cbd5e1"/>
    <ellipse cx="38" cy="38" rx="12" ry="10" fill="#cbd5e1"/>
    <ellipse cx="32" cy="26" rx="10" ry="12" fill="#e2e8f0"/>
  </svg>`,
  rainy: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="32" cy="28" rx="20" ry="12" fill="#64748b"/>
    <ellipse cx="24" cy="26" rx="12" ry="10" fill="#94a3b8"/>
    <ellipse cx="38" cy="25" rx="10" ry="9" fill="#94a3b8"/>
    <g stroke="#5b8dee" stroke-width="2.5" stroke-linecap="round">
      <line x1="22" y1="44" x2="19" y2="52"/>
      <line x1="30" y1="44" x2="27" y2="52"/>
      <line x1="38" y1="44" x2="35" y2="52"/>
      <line x1="46" y1="44" x2="43" y2="52"/>
    </g>
  </svg>`,
  snowy: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="32" cy="28" rx="20" ry="12" fill="#e2e8f0"/>
    <ellipse cx="24" cy="26" rx="12" ry="10" fill="#f1f5f9"/>
    <g fill="#bfdbfe">
      <circle cx="22" cy="46" r="3"/>
      <circle cx="32" cy="50" r="3"/>
      <circle cx="42" cy="46" r="3"/>
      <circle cx="27" cy="54" r="2"/>
      <circle cx="37" cy="54" r="2"/>
    </g>
  </svg>`,
  partly_cloudy: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="24" r="10" fill="#f5c842"/>
    <g stroke="#f5c842" stroke-width="2" stroke-linecap="round">
      <line x1="20" y1="8" x2="20" y2="12"/>
      <line x1="6" y1="24" x2="10" y2="24"/>
      <line x1="9.9" y1="13.9" x2="13" y2="17"/>
    </g>
    <ellipse cx="36" cy="42" rx="20" ry="10" fill="#94a3b8"/>
    <ellipse cx="28" cy="36" rx="13" ry="11" fill="#cbd5e1"/>
    <ellipse cx="42" cy="38" rx="11" ry="9" fill="#cbd5e1"/>
  </svg>`,
  thunderstorm: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="32" cy="22" rx="20" ry="12" fill="#374151"/>
    <ellipse cx="24" cy="20" rx="12" ry="10" fill="#4b5563"/>
    <ellipse cx="38" cy="19" rx="10" ry="9" fill="#4b5563"/>
    <path d="M34 34 L29 46 L34 46 L28 58 L38 42 L32 42 L36 34 Z" fill="#fbbf24"/>
  </svg>`,
};

/* ─────────────────────────────────────────────────
   UTILITIES
───────────────────────────────────────────────── */

/** Map WMO weather code to icon key + description */
function getWeatherMeta(code) {
  if (code <= 1) return { key: 'sunny', desc: 'Clear' };
  if (code <= 3) return { key: 'partly_cloudy', desc: 'Partly Cloudy' };
  if (code <= 49) return { key: 'cloudy', desc: 'Cloudy' };
  if (code <= 67) return { key: 'rainy', desc: 'Rainy' };
  if (code <= 77) return { key: 'snowy', desc: 'Snowy' };
  if (code <= 82) return { key: 'rainy', desc: 'Showers' };
  return { key: 'thunderstorm', desc: 'Thunderstorm' };
}

/** Format a Date to local time string for a given timezone */
function getLocalTime(timezone) {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date());
}

/** Show a brief toast notification */
function showToast(message, type = 'info') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('visible'));
  });
  setTimeout(() => {
    toast.classList.remove('visible');
    setTimeout(() => toast.remove(), 500);
  }, 3000);
}

/** Debounce helper */
function debounce(fn, ms) {
  let timer;
  return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), ms); };
}

/** Capitalise each word */
function titleCase(str) {
  return str.replace(/\b\w/g, c => c.toUpperCase());
}

/* ─────────────────────────────────────────────────
   PARTICLE SYSTEM
───────────────────────────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  const PARTICLE_COUNT = 80;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.5 + 0.5,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -Math.random() * 0.4 - 0.1,
      alpha: Math.random() * 0.5 + 0.1,
      life: Math.random(),
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: PARTICLE_COUNT }, createParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = isDark
        ? `rgba(245, 200, 66, ${p.alpha})`
        : `rgba(180, 130, 20, ${p.alpha * 0.5})`;
      ctx.fill();

      p.x += p.vx;
      p.y += p.vy;
      p.life += 0.003;

      if (p.y < -10 || p.x < -10 || p.x > W + 10) {
        Object.assign(p, createParticle(), { y: H + 10 });
      }
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  init();
  draw();
})();

/* ─────────────────────────────────────────────────
   LIGHT / DARK THEME TOGGLE
───────────────────────────────────────────────── */
(function initTheme() {
  const html = document.documentElement;
  const btn = document.getElementById('theme-toggle');
  // Respect system preference on first load
  const preferred = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  const stored = localStorage.getItem('voya-theme') || preferred;
  html.setAttribute('data-theme', stored);

  btn.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('voya-theme', next);
  });
})();

/* ─────────────────────────────────────────────────
   SEARCH SUGGESTIONS (autocomplete from local data)
───────────────────────────────────────────────── */
(function initSearch() {
  const input = document.getElementById('city-input');
  const btn = document.getElementById('search-btn');
  const suggestionsEl = document.getElementById('search-suggestions');
  const tags = document.querySelectorAll('.tag');

  function showSuggestions(query) {
    if (!query || query.length < 2) {
      suggestionsEl.classList.remove('visible');
      return;
    }
    const matches = Object.values(CITY_DATA).filter(c =>
      c.name.toLowerCase().includes(query.toLowerCase())
    );
    if (!matches.length) {
      suggestionsEl.classList.remove('visible');
      return;
    }
    suggestionsEl.innerHTML = matches.slice(0, 5).map(c => `
      <div class="suggestion-item" data-city="${c.name}">
        <span class="suggestion-flag">${c.flag}</span>
        <div>
          <div class="suggestion-name">${c.name}</div>
          <div class="suggestion-country">${c.country}</div>
        </div>
      </div>
    `).join('');
    suggestionsEl.classList.add('visible');
  }

  const debouncedSuggest = debounce(e => showSuggestions(e.target.value), 180);
  input.addEventListener('input', debouncedSuggest);

  suggestionsEl.addEventListener('click', e => {
    const item = e.target.closest('.suggestion-item');
    if (!item) return;
    input.value = item.dataset.city;
    suggestionsEl.classList.remove('visible');
    searchCity(item.dataset.city);
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('.search-wrapper')) {
      suggestionsEl.classList.remove('visible');
    }
  });

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      suggestionsEl.classList.remove('visible');
      searchCity(input.value.trim());
    }
  });

  btn.addEventListener('click', () => {
    suggestionsEl.classList.remove('visible');
    searchCity(input.value.trim());
  });

  // Quick-search tags
  tags.forEach(tag => {
    tag.addEventListener('click', () => {
      const city = tag.dataset.city;
      input.value = city;
      searchCity(city);
    });
  });
})();

/* ─────────────────────────────────────────────────
   CITY SEARCH ORCHESTRATOR
───────────────────────────────────────────────── */
async function searchCity(rawQuery) {
  if (!rawQuery) { showToast('Please enter a city name.', 'error'); return; }

  const query = rawQuery.toLowerCase().trim();
  const cityKey = Object.keys(CITY_DATA).find(k =>
    k === query || k.startsWith(query) || CITY_DATA[k].name.toLowerCase() === query
  );
  const cityInfo = cityKey ? CITY_DATA[cityKey] : null;

  // Show search loading state on button
  const btn = document.getElementById('search-btn');
  btn.innerHTML = `<span>Loading…</span>`;
  btn.disabled = true;

  try {
    let lat, lon, cityName, countryName;

    if (cityInfo) {
      // Use local data
      lat = cityInfo.lat;
      lon = cityInfo.lon;
      cityName = cityInfo.name;
      countryName = cityInfo.country;
    } else {
      // Geocode via Nominatim
      const geoRes = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(rawQuery)}&limit=1`,
        { headers: { 'Accept-Language': 'en' } }
      );
      const geoData = await geoRes.json();
      if (!geoData.length) {
        showToast(`City "${titleCase(rawQuery)}" not found.`, 'error');
        return;
      }
      lat = parseFloat(geoData[0].lat);
      lon = parseFloat(geoData[0].lon);
      cityName = titleCase(rawQuery);
      countryName = geoData[0].display_name.split(', ').pop();
    }

    // Fetch live weather from Open-Meteo (free, no key needed)
    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
      `&current=temperature_2m,relative_humidity_2m,wind_speed_10m,apparent_temperature,weather_code` +
      `&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto&forecast_days=5`
    );
    const weatherData = await weatherRes.json();

    renderDashboard({
      cityInfo,
      lat, lon,
      cityName,
      countryName,
      weather: weatherData,
    });

  } catch (err) {
    console.error(err);
    showToast('Could not load city data. Check your connection.', 'error');
  } finally {
    btn.innerHTML = `<span>Explore</span><svg viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    btn.disabled = false;
  }
}

/* ─────────────────────────────────────────────────
   RENDER DASHBOARD
───────────────────────────────────────────────── */
function renderDashboard({ cityInfo, lat, lon, cityName, countryName, weather }) {
  const dashboard = document.getElementById('city-dashboard');
  const current = weather.current;
  const daily = weather.daily;
  const wMeta = getWeatherMeta(current.weather_code);
  const tz = weather.timezone || (cityInfo ? cityInfo.tz : 'UTC');

  /* ── Banner ── */
  document.getElementById('city-name').textContent = cityName.toUpperCase();
  document.getElementById('city-country').textContent = cityInfo ? `${cityInfo.flag}  ${countryName}` : countryName;
  document.getElementById('temp-value').textContent = `${Math.round(current.temperature_2m)}°C`;
  document.getElementById('temp-label').textContent = wMeta.desc;
  document.getElementById('map-coords').textContent = `${lat.toFixed(4)}°, ${lon.toFixed(4)}°`;

  // Apply city gradient to banner bg
  const bannerBg = document.getElementById('city-banner-bg');
  bannerBg.style.background = cityInfo
    ? cityInfo.bgGradient
    : `linear-gradient(135deg, #0e1420, #1a2a3a)`;

  /* ── Local Time (live clock) ── */
  const timeEl = document.getElementById('time-value');
  clearInterval(window._clockInterval);
  timeEl.textContent = getLocalTime(tz);
  window._clockInterval = setInterval(() => {
    timeEl.textContent = getLocalTime(tz);
  }, 10000);

  /* ── Weather Stats ── */
  document.getElementById('w-humidity').textContent = `${current.relative_humidity_2m}%`;
  document.getElementById('w-wind').textContent = `${Math.round(current.wind_speed_10m)} km/h`;
  document.getElementById('w-feels').textContent = `${Math.round(current.apparent_temperature)}°C`;
  document.getElementById('w-condition').textContent = wMeta.desc;

  document.getElementById('weather-icon-wrap').innerHTML = WEATHER_ICONS[wMeta.key] || WEATHER_ICONS.sunny;

  /* ── 5-Day Forecast ── */
  const forecastEl = document.getElementById('weather-forecast');
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  forecastEl.innerHTML = daily.time.slice(0, 5).map((dateStr, i) => {
    const dayName = i === 0 ? 'Today' : days[new Date(dateStr).getDay()];
    const fm = getWeatherMeta(daily.weather_code[i]);
    const iconEmoji = fm.key === 'sunny' ? '☀️' : fm.key === 'rainy' ? '🌧️' :
      fm.key === 'snowy' ? '❄️' : fm.key === 'thunderstorm' ? '⛈️' :
      fm.key === 'partly_cloudy' ? '⛅' : '☁️';
    return `
      <div class="forecast-day">
        <span class="f-day">${dayName}</span>
        <span class="f-icon">${iconEmoji}</span>
        <span class="f-temp">${Math.round(daily.temperature_2m_max[i])}°</span>
      </div>
    `;
  }).join('');

  /* ── Map ── */
  const mapIframe = document.getElementById('city-map');
  mapIframe.src = `https://www.openstreetmap.org/export/embed.html?bbox=${lon-0.1},${lat-0.1},${lon+0.1},${lat+0.1}&layer=mapnik&marker=${lat},${lon}`;

  /* ── Attractions ── */
  const attractionsList = document.getElementById('attractions-list');
  const attrs = cityInfo ? cityInfo.attractions : [
    { name: 'Old Town', type: 'Historic District', emoji: '🏛️' },
    { name: 'Central Market', type: 'Market', emoji: '🛍️' },
    { name: 'City Museum', type: 'Museum', emoji: '🎨' },
    { name: 'Main Park', type: 'Park', emoji: '🌳' },
    { name: 'Cathedral', type: 'Religious Site', emoji: '⛪' },
  ];
  attractionsList.innerHTML = attrs.map((a, i) => `
    <li class="attraction-item" style="animation-delay:${i * 0.1}s">
      <span class="attraction-rank">${String(i+1).padStart(2, '0')}</span>
      <div class="attraction-info">
        <div class="attraction-name">${a.emoji} ${a.name}</div>
        <div class="attraction-type">${a.type}</div>
      </div>
      <svg class="attraction-arrow" viewBox="0 0 24 24" fill="none">
        <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
    </li>
  `).join('');

  /* ── Climate Chart ── */
  renderClimateChart(cityInfo, cityName);

  /* ── Facts Grid ── */
  const factsGrid = document.getElementById('facts-grid');
  const factsData = cityInfo ? cityInfo.facts : [
    { icon: '🧑‍🤝‍🧑', value: 'N/A', label: 'Population' },
    { icon: '✈️', value: 'N/A', label: 'Tourists/yr' },
    { icon: '📅', value: 'N/A', label: 'Founded' },
    { icon: '🌡️', value: `${Math.round(current.temperature_2m)}°C`, label: 'Curr. Temp' },
    { icon: '💨', value: `${Math.round(current.wind_speed_10m)} km/h`, label: 'Wind Speed' },
  ];
  factsGrid.innerHTML = factsData.map(f => `
    <div class="fact-item">
      <span class="fact-icon">${f.icon}</span>
      <span class="fact-value">${f.value}</span>
      <span class="fact-label">${f.label}</span>
    </div>
  `).join('');

  /* ── NEW: Best Month ── */
  renderBestMonth(cityInfo);

  /* ── NEW: Cost Estimator ── */
  renderCostCard(cityInfo);

  /* ── NEW: Visa Card ── */
  renderVisaCard(cityInfo);

  /* ── NEW: Local Phrases ── */
  renderPhrasesCard(cityInfo);

  /* ── NEW: Jet Lag Calculator ── */
  renderJetLagCard(tz);

  /* ── NEW: Vibe Index ── */
  renderVibeCard(cityInfo);

  /* ── Reveal dashboard ── */
  dashboard.classList.add('visible');

  /* ── Smooth scroll to dashboard ── */
  setTimeout(() => {
    dashboard.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 200);

  showToast(`✈️  Exploring ${cityName}`, 'success');
}

/* ─────────────────────────────────────────────────
   CLIMATE CHART (Canvas 2D, no library)
───────────────────────────────────────────────── */
let activeChartType = 'temp';
let currentCityInfo = null;

function renderClimateChart(cityInfo, fallbackName) {
  currentCityInfo = cityInfo;
  drawChart(cityInfo, activeChartType);
}

function drawChart(cityInfo, type) {
  const canvas = document.getElementById('climate-chart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.offsetWidth || canvas.width;
  const H = canvas.offsetHeight || canvas.height;
  canvas.width = W;
  canvas.height = H;
  ctx.clearRect(0, 0, W, H);

  const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
  const months = ['J','F','M','A','M','J','J','A','S','O','N','D'];

  const raw = cityInfo
    ? (type === 'temp' ? cityInfo.tempData : cityInfo.rainData)
    : [10,12,15,18,22,25,27,26,23,18,13,10];

  const max = Math.max(...raw);
  const min = Math.min(...raw);
  const range = max - min || 1;

  const padL = 38, padR = 16, padT = 20, padB = 36;
  const cW = W - padL - padR;
  const cH = H - padT - padB;

  const accent = type === 'temp' ? '#f5c842' : '#5b8dee';
  const accentAlpha = type === 'temp' ? 'rgba(245,200,66,' : 'rgba(91,141,238,';

  // Grid lines
  const gridLines = 4;
  for (let i = 0; i <= gridLines; i++) {
    const y = padT + (cH / gridLines) * i;
    ctx.beginPath();
    ctx.moveTo(padL, y);
    ctx.lineTo(padL + cW, y);
    ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
    ctx.lineWidth = 1;
    ctx.stroke();

    const val = Math.round(max - (range / gridLines) * i);
    ctx.fillStyle = isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)';
    ctx.font = '10px DM Sans, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(type === 'temp' ? `${val}°` : `${val}mm`, padL - 4, y + 4);
  }

  // Build points
  const step = cW / (months.length - 1);
  const points = raw.map((v, i) => ({
    x: padL + step * i,
    y: padT + cH - ((v - min) / range) * cH,
  }));

  // Fill area
  const grad = ctx.createLinearGradient(0, padT, 0, padT + cH);
  grad.addColorStop(0, accentAlpha + '0.35)');
  grad.addColorStop(1, accentAlpha + '0.0)');

  ctx.beginPath();
  ctx.moveTo(points[0].x, padT + cH);
  points.forEach(p => ctx.lineTo(p.x, p.y));
  ctx.lineTo(points[points.length - 1].x, padT + cH);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  // Line
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    const cp1x = (points[i-1].x + points[i].x) / 2;
    ctx.bezierCurveTo(cp1x, points[i-1].y, cp1x, points[i].y, points[i].x, points[i].y);
  }
  ctx.strokeStyle = accent;
  ctx.lineWidth = 2.5;
  ctx.lineJoin = 'round';
  ctx.stroke();

  // Dots
  points.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = accent;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = isDark ? '#080c14' : '#f5f0e8';
    ctx.fill();
  });

  // X labels
  ctx.fillStyle = isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)';
  ctx.font = '10px DM Sans, sans-serif';
  ctx.textAlign = 'center';
  months.forEach((m, i) => {
    ctx.fillText(m, padL + step * i, H - padB + 18);
  });
}

// Chart toggle buttons
document.querySelectorAll('.chart-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.chart-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeChartType = btn.dataset.type;
    drawChart(currentCityInfo, activeChartType);
  });
});

// Redraw chart on resize
window.addEventListener('resize', debounce(() => {
  if (currentCityInfo) drawChart(currentCityInfo, activeChartType);
}, 300));

/* ─────────────────────────────────────────────────
   BEST MONTH TO VISIT
───────────────────────────────────────────────── */
function renderBestMonth(cityInfo) {
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const scores = cityInfo ? cityInfo.visitScore : [5,5,6,7,8,7,7,7,7,6,5,5];
  const peak = cityInfo ? cityInfo.bestMonths : 'Spring & Autumn';
  document.getElementById('bestmonth-peak').textContent = peak;
  document.getElementById('month-bars').innerHTML = scores.map((score, i) => {
    const pct = (score / 10) * 100;
    const cls = score >= 8 ? 'best' : score >= 6 ? 'great' : score >= 4 ? 'ok' : 'poor';
    const label = score >= 8 ? '★ Peak' : score >= 6 ? 'Good' : score >= 4 ? 'Fair' : 'Avoid';
    return `
      <div class="month-bar-wrap">
        <div class="month-bar ${cls}" style="height:${pct}%" data-tip="${months[i]}: ${label}"></div>
        <span class="month-bar-label">${months[i].slice(0,1)}</span>
      </div>`;
  }).join('');
}

/* ─────────────────────────────────────────────────
   TRAVEL COST ESTIMATOR
───────────────────────────────────────────────── */
function renderCostCard(cityInfo) {
  const budget = cityInfo ? cityInfo.budget : { low: 60, mid: 130, high: 350 };
  const costs  = cityInfo ? cityInfo.costs  : [
    { label: '🏨 Hotel', mid: 80, max: 250 }, { label: '🍽️ Food', mid: 30, max: 80 },
    { label: '🚌 Transport', mid: 12, max: 35 }, { label: '🎯 Activities', mid: 20, max: 60 },
  ];
  document.getElementById('cost-tiers').innerHTML = `
    <div class="cost-tier"><div class="tier-icon">🎒</div><div class="tier-name">Budget</div><div class="tier-price">$${budget.low}</div><div class="tier-unit">per day</div></div>
    <div class="cost-tier highlight"><div class="tier-icon">🧳</div><div class="tier-name">Mid-Range</div><div class="tier-price">$${budget.mid}</div><div class="tier-unit">per day</div></div>
    <div class="cost-tier"><div class="tier-icon">💎</div><div class="tier-name">Luxury</div><div class="tier-price">$${budget.high}</div><div class="tier-unit">per day</div></div>
  `;
  document.getElementById('cost-breakdown').innerHTML = costs.map(c => {
    const pct = Math.round((c.mid / c.max) * 100);
    return `<div class="cost-row">
      <span class="cost-row-label">${c.label}</span>
      <div class="cost-bar-track"><div class="cost-bar-fill" style="width:0%" data-target="${pct}"></div></div>
      <span class="cost-row-val">$${c.mid}/day</span>
    </div>`;
  }).join('');
  requestAnimationFrame(() => requestAnimationFrame(() => {
    document.querySelectorAll('.cost-bar-fill').forEach(bar => { bar.style.width = `${bar.dataset.target}%`; });
  }));
}

/* ─────────────────────────────────────────────────
   VISA & ENTRY REQUIREMENTS
───────────────────────────────────────────────── */
function renderVisaCard(cityInfo) {
  const visa = cityInfo ? cityInfo.visa : {
    status: 'on-arrival', statusLabel: 'Check Required',
    rows: [
      { icon: '🛂', label: 'Entry Type', value: 'Varies by nationality' },
      { icon: '📄', label: 'Requirements', value: 'Valid passport required' },
      { icon: '💉', label: 'Health', value: 'Check CDC recommendations' },
      { icon: '💵', label: 'Currency', value: 'Local currency preferred' },
    ]
  };
  const badge = document.getElementById('visa-badge');
  badge.textContent = visa.statusLabel;
  badge.className = `visa-badge ${visa.status}`;
  document.getElementById('visa-details').innerHTML = visa.rows.map(r => `
    <div class="visa-row">
      <span class="visa-row-icon">${r.icon}</span>
      <div><div class="visa-row-label">${r.label}</div><div class="visa-row-value">${r.value}</div></div>
    </div>`).join('');
}

/* ─────────────────────────────────────────────────
   LOCAL PHRASES (with Web Speech API)
───────────────────────────────────────────────── */
function renderPhrasesCard(cityInfo) {
  const lang = cityInfo ? cityInfo.language : 'Local';
  const phrases = cityInfo ? cityInfo.phrases : [
    ['Hello', 'Hello', 'heh-LOH'], ['Thank you', 'Thank you', 'THANK-yoo'],
  ];
  document.getElementById('phrases-lang').textContent = lang;
  document.getElementById('phrases-list').innerHTML = phrases.map(([en, local, phonetic]) => `
    <div class="phrase-item" data-text="${local}" data-lang="${lang}">
      <span class="phrase-english">${en}</span>
      <span class="phrase-local">${local}</span>
      <span class="phrase-phonetic">${phonetic}</span>
    </div>`).join('');
  document.querySelectorAll('.phrase-item').forEach(item => {
    item.addEventListener('click', () => {
      if (!window.speechSynthesis) return;
      const langMap = {
        'French':'fr-FR','Japanese':'ja-JP','Arabic':'ar-SA',
        'Indonesian / Balinese':'id-ID','Indonesian':'id-ID','English':'en-US',
      };
      const utt = new SpeechSynthesisUtterance(item.dataset.text);
      utt.lang = langMap[item.dataset.lang] || 'en-US';
      utt.rate = 0.85;
      speechSynthesis.cancel();
      speechSynthesis.speak(utt);
    });
  });
}

/* ─────────────────────────────────────────────────
   JET LAG CALCULATOR
───────────────────────────────────────────────── */
const TZ_OFFSETS = {
  'new york':-5,'los angeles':-8,'chicago':-6,'houston':-6,'miami':-5,
  'london':0,'paris':1,'berlin':1,'madrid':1,'rome':1,'amsterdam':1,'vienna':1,
  'dubai':4,'mumbai':5.5,'delhi':5.5,'bangkok':7,'singapore':8,'kuala lumpur':8,
  'tokyo':9,'seoul':9,'sydney':10,'auckland':12,'perth':8,'melbourne':10,
  'moscow':3,'istanbul':3,'cairo':2,'johannesburg':2,'nairobi':3,
  'toronto':-5,'vancouver':-8,'mexico city':-6,'sao paulo':-3,'buenos aires':-3,
  'lima':-5,'bogota':-5,'lagos':1,'casablanca':0,'riyadh':3,
  'beijing':8,'shanghai':8,'hong kong':8,'jakarta':7,'bali':8,
};

function getUtcOffset(tz) {
  try {
    const now = new Date();
    const utc = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
    const local = new Date(now.toLocaleString('en-US', { timeZone: tz }));
    return (local - utc) / 3600000;
  } catch { return 0; }
}

function renderJetLagCard(destTz) {
  const destOffset = getUtcOffset(destTz);
  const input = document.getElementById('jetlag-home');
  const diffEl = document.getElementById('jetlag-diff');
  const tipEl  = document.getElementById('jetlag-tip');
  const tipsEl = document.getElementById('jetlag-tips');

  function calculate() {
    const home = input.value.toLowerCase().trim();
    const homeOffset = TZ_OFFSETS[home];
    if (homeOffset === undefined) {
      diffEl.textContent = '?'; tipEl.textContent = 'Try "London", "Tokyo", "New York"…'; tipsEl.innerHTML = ''; return;
    }
    const diff = destOffset - homeOffset;
    const abs = Math.abs(diff);
    const dir = diff > 0 ? '▶ ahead' : diff < 0 ? '◀ behind' : '';
    diffEl.textContent = abs === 0 ? 'No lag!' : `${abs}h ${dir}`;
    if (abs === 0) { tipEl.textContent = 'Same timezone — no adjustment needed!'; tipsEl.innerHTML = ''; return; }
    const sev = abs <= 3 ? 'Mild' : abs <= 6 ? 'Moderate' : 'Severe';
    const days = abs <= 3 ? '1–2 days' : abs <= 6 ? '3–5 days' : '5–7 days';
    tipEl.textContent = `${sev} jet lag · recovery ~${days}`;
    const tips = [];
    if (diff > 0) {
      tips.push({ i:'🌅', t:'Sleep earlier the night before departure to shift east' });
      tips.push({ i:'☀️', t:'Seek bright morning light at destination to anchor your clock' });
    } else {
      tips.push({ i:'🌙', t:'Stay up later before flying west to ease the adjustment' });
      tips.push({ i:'🌆', t:'Get evening sunlight on arrival to push your clock back' });
    }
    if (abs >= 5) tips.push({ i:'💊', t:'Melatonin (0.5–3mg) at destination bedtime can help' });
    tips.push({ i:'💧', t:'Hydrate throughout the flight — dehydration worsens symptoms' });
    tips.push({ i:'🍽️', t:'Eat meals on destination schedule from day one' });
    tipsEl.innerHTML = tips.map(t =>
      `<div class="jetlag-tip-item"><span class="tip-icon">${t.i}</span><span>${t.t}</span></div>`
    ).join('');
  }

  input.removeEventListener('input', input._jetlagHandler);
  input._jetlagHandler = debounce(calculate, 380);
  input.addEventListener('input', input._jetlagHandler);
}

/* ─────────────────────────────────────────────────
   SAFETY & VIBE INDEX (animated SVG rings)
───────────────────────────────────────────────── */
function renderVibeCard(cityInfo) {
  const vibe = cityInfo ? cityInfo.vibe : { safety:70, nightlife:70, family:70, food:70, culture:70 };
  const cats = [
    { key:'safety',    label:'Safety',    icon:'🛡️', color:'#22c55e' },
    { key:'nightlife', label:'Nightlife', icon:'🎶', color:'#a855f7' },
    { key:'family',    label:'Family',    icon:'👨‍👩‍👧', color:'#0ea5e9' },
    { key:'food',      label:'Food',      icon:'🍽️', color:'#f5c842' },
    { key:'culture',   label:'Culture',   icon:'🎭', color:'#ff6b6b' },
  ];
  const r = 34;
  const C = 2 * Math.PI * r;
  document.getElementById('vibe-grid').innerHTML = cats.map(cat => {
    const score = vibe[cat.key];
    const offset = C - (score / 100) * C;
    return `
      <div class="vibe-item">
        <div class="vibe-icon-label"><span>${cat.icon}</span><span>${cat.label}</span></div>
        <div class="vibe-ring-wrap">
          <svg viewBox="0 0 80 80">
            <circle class="vibe-ring-bg" cx="40" cy="40" r="${r}"/>
            <circle class="vibe-ring-fill" cx="40" cy="40" r="${r}"
              stroke="${cat.color}" stroke-dasharray="${C}" stroke-dashoffset="${C}"
              data-offset="${offset}"/>
          </svg>
          <div class="vibe-score-text">${score}</div>
        </div>
      </div>`;
  }).join('');
  requestAnimationFrame(() => requestAnimationFrame(() => {
    document.querySelectorAll('.vibe-ring-fill').forEach(ring => {
      ring.style.strokeDashoffset = ring.dataset.offset;
    });
  }));
}

/* ─────────────────────────────────────────────────
   DESTINATION CAROUSEL
───────────────────────────────────────────────── */
(function initCarousel() {
  const track = document.getElementById('carousel-track');
  const dotsEl = document.getElementById('carousel-dots');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');

  let currentIdx = 0;
  const VISIBLE = () => window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 3;
  const CARD_W = () => window.innerWidth < 640 ? 280 + 20 : 320 + 20;

  // Render destination cards
  track.innerHTML = DESTINATIONS.map((d, i) => `
    <div class="dest-card" data-city="${d.key}" tabindex="0" role="button" aria-label="Explore ${d.city}">
      <div class="dest-card-inner">
        <div class="dest-card-bg" style="background-image:url('${d.bg}')"></div>
        <div class="dest-card-gradient"></div>
        <div class="dest-card-content">
          <span class="dest-card-badge">${d.badge}</span>
          <div class="dest-card-city">${d.city.toUpperCase()}</div>
          <div class="dest-card-country">${d.country}</div>
          <div class="dest-card-stats">
            <div class="dest-stat">
              <span class="dest-stat-val">${d.temp}</span>
              <span class="dest-stat-lbl">Avg Temp</span>
            </div>
            <div class="dest-stat">
              <span class="dest-stat-val">${d.best}</span>
              <span class="dest-stat-lbl">Best Time</span>
            </div>
          </div>
        </div>
        <div class="dest-card-btn">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  `).join('');

  // Render dots
  function renderDots() {
    const totalGroups = Math.ceil(DESTINATIONS.length / VISIBLE());
    dotsEl.innerHTML = Array.from({ length: totalGroups }, (_, i) =>
      `<button class="carousel-dot ${i === Math.floor(currentIdx / VISIBLE()) ? 'active' : ''}" data-idx="${i * VISIBLE()}" aria-label="Go to slide ${i+1}"></button>`
    ).join('');
    dotsEl.querySelectorAll('.carousel-dot').forEach(dot => {
      dot.addEventListener('click', () => goTo(parseInt(dot.dataset.idx)));
    });
  }

  function goTo(idx) {
    currentIdx = Math.max(0, Math.min(idx, DESTINATIONS.length - VISIBLE()));
    track.style.transform = `translateX(-${currentIdx * CARD_W()}px)`;
    renderDots();
  }

  prevBtn.addEventListener('click', () => goTo(Math.max(0, currentIdx - 1)));
  nextBtn.addEventListener('click', () => goTo(Math.min(DESTINATIONS.length - VISIBLE(), currentIdx + 1)));

  // Click on card to search
  track.addEventListener('click', e => {
    const card = e.target.closest('.dest-card');
    if (card) {
      const cityKey = card.dataset.city;
      document.getElementById('city-input').value = CITY_DATA[cityKey]?.name || titleCase(cityKey);
      searchCity(CITY_DATA[cityKey]?.name || titleCase(cityKey));
    }
  });

  // Keyboard
  track.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      const card = e.target.closest('.dest-card');
      if (card) {
        const cityKey = card.dataset.city;
        document.getElementById('city-input').value = CITY_DATA[cityKey]?.name || titleCase(cityKey);
        searchCity(CITY_DATA[cityKey]?.name || titleCase(cityKey));
      }
    }
  });

  // Auto-advance
  let autoTimer = setInterval(() => goTo((currentIdx + 1) % DESTINATIONS.length), 5000);
  track.addEventListener('mouseenter', () => clearInterval(autoTimer));
  track.addEventListener('mouseleave', () => {
    autoTimer = setInterval(() => goTo((currentIdx + 1) % DESTINATIONS.length), 5000);
  });

  window.addEventListener('resize', debounce(() => {
    goTo(0);
    renderDots();
  }, 300));

  renderDots();
})();

/* ─────────────────────────────────────────────────
   SCROLL REVEAL
───────────────────────────────────────────────── */
(function initScrollReveal() {
  const observer = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    }),
    { threshold: 0.1 }
  );

  document.querySelectorAll('.destinations-section, .dash-card').forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
  });
})();

/* ─────────────────────────────────────────────────
   PARALLAX HERO
───────────────────────────────────────────────── */
(function initParallax() {
  const hero = document.getElementById('hero');
  const plane = document.querySelector('.flying-plane');
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (hero) hero.style.transform = `translateY(${y * 0.3}px)`;
    if (plane) plane.style.top = `${20 + y * 0.05}%`;
  }, { passive: true });
})();

/* ─────────────────────────────────────────────────
   NAV SCROLL BEHAVIOUR
───────────────────────────────────────────────── */
(function initNavScroll() {
  const nav = document.querySelector('.nav');
  window.addEventListener('scroll', () => {
    nav.style.background = window.scrollY > 50
      ? (document.documentElement.getAttribute('data-theme') === 'light'
         ? 'rgba(245,240,232,0.95)' : 'rgba(8,12,20,0.95)')
      : '';
  }, { passive: true });
})();

/* ─────────────────────────────────────────────────
   LOADING SCREEN
───────────────────────────────────────────────── */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loading-overlay').classList.add('hidden');
    // Auto-search Paris on first load as a demo
    setTimeout(() => searchCity('Paris'), 600);
  }, 1200);
});