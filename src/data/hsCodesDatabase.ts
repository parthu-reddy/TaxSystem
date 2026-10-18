export interface WcoSection {
  id: number;
  romanNumeral: string;
  title: string;
  shortTitle: string;
  chaptersRange: string;
  chapters: WcoChapter[];
}

export interface WcoChapter {
  chapterCode: string; // "01" to "97"
  title: string;
  description: string;
  averageMfnDuty: number;
  cbamApplicable?: boolean;
  commonSubheadings: HsSubheading[];
}

export interface HsSubheading {
  code: string; // e.g. "1509.10", "8471.30"
  description: string;
  defaultDuty: number;
  dutyType: 'Ad-Valorem' | 'Specific' | 'Compound' | 'Duty-Free';
  antiDumpingRisk?: boolean;
  cbamRequired?: boolean;
  exportControlRisk?: 'Low' | 'Dual-Use (EAR99)' | 'Strategic / License Required';
  statutoryUnit: string;
  wcoSourceNotes?: string;
}

export const WCO_HS_SECTIONS: WcoSection[] = [
  // =========================================================================
  // SECTION I: LIVE ANIMALS; ANIMAL PRODUCTS (Chapters 01 - 05)
  // =========================================================================
  {
    id: 1,
    romanNumeral: 'Section I',
    title: 'Live Animals & Animal Products',
    shortTitle: 'Live Animals & Meat',
    chaptersRange: 'Chapters 01 - 05',
    chapters: [
      {
        chapterCode: '01',
        title: 'Live Animals',
        description: 'Horses, asses, mules, bovine animals, swine, sheep, goats, poultry',
        averageMfnDuty: 2.5,
        commonSubheadings: [
          { code: '0101.21', description: 'Pure-bred breeding horses', defaultDuty: 0.0, dutyType: 'Duty-Free', statutoryUnit: 'Number', wcoSourceNotes: 'WTO Bound Tariff Concession' },
          { code: '0102.29', description: 'Other live bovine animals (cattle for beef/dairy)', defaultDuty: 2.5, dutyType: 'Ad-Valorem', statutoryUnit: 'Number', wcoSourceNotes: 'USDA / EU SPS Animal Health Certificate required' },
          { code: '0105.11', description: 'Fowls of the species Gallus domesticus (chicks <= 185g)', defaultDuty: 1.8, dutyType: 'Ad-Valorem', statutoryUnit: 'Number' },
        ],
      },
      {
        chapterCode: '02',
        title: 'Meat & Edible Meat Offal',
        description: 'Bovine, swine, sheep, poultry fresh, chilled or frozen',
        averageMfnDuty: 12.0,
        commonSubheadings: [
          { code: '0201.30', description: 'Boneless meat of bovine animals, fresh or chilled (Beef primal cuts)', defaultDuty: 10.0, dutyType: 'Ad-Valorem', statutoryUnit: 'kg', wcoSourceNotes: 'Veterinary quarantine inspection required' },
          { code: '0203.29', description: 'Meat of swine, frozen (Pork bellies and loins)', defaultDuty: 4.5, dutyType: 'Ad-Valorem', statutoryUnit: 'kg' },
          { code: '0207.14', description: 'Cuts and offal of fowls, frozen (Poultry cuts)', defaultDuty: 14.0, dutyType: 'Ad-Valorem', antiDumpingRisk: true, statutoryUnit: 'kg' },
        ],
      },
      {
        chapterCode: '03',
        title: 'Fish, Crustaceans & Molluscs',
        description: 'Live, fresh, chilled, frozen, dried, salted, or smoked aquatic invertebrates',
        averageMfnDuty: 5.0,
        commonSubheadings: [
          { code: '0302.14', description: 'Atlantic salmon & Danube salmon, fresh or chilled', defaultDuty: 2.0, dutyType: 'Ad-Valorem', statutoryUnit: 'kg' },
          { code: '0306.17', description: 'Other shrimps and prawns, frozen (Vannamei & Black Tiger)', defaultDuty: 6.0, dutyType: 'Ad-Valorem', antiDumpingRisk: true, statutoryUnit: 'kg' },
          { code: '0307.43', description: 'Cuttle fish and squid, frozen', defaultDuty: 4.5, dutyType: 'Ad-Valorem', statutoryUnit: 'kg' },
        ],
      },
      {
        chapterCode: '04',
        title: 'Dairy Produce, Eggs & Natural Honey',
        description: 'Milk, cream, butter, cheese, bird eggs, honey, edible animal products',
        averageMfnDuty: 15.0,
        commonSubheadings: [
          { code: '0406.90', description: 'Other cheese, including cheddar, gouda, and parmesan', defaultDuty: 12.5, dutyType: 'Ad-Valorem', statutoryUnit: 'kg', wcoSourceNotes: 'TRQ Tariff Rate Quota rules apply in US/EU' },
          { code: '0409.00', description: 'Natural honey, raw or processed', defaultDuty: 8.0, dutyType: 'Ad-Valorem', antiDumpingRisk: true, statutoryUnit: 'kg' },
        ],
      },
      {
        chapterCode: '05',
        title: 'Products of Animal Origin, Not Elsewhere Specified',
        description: 'Guts, bladders, stomachs, bones, horns, animal raw materials',
        averageMfnDuty: 2.0,
        commonSubheadings: [
          { code: '0505.10', description: 'Feathers and down for stuffing, cleaned and disinfected', defaultDuty: 3.0, dutyType: 'Ad-Valorem', statutoryUnit: 'kg' },
        ],
      },
    ],
  },

  // =========================================================================
  // SECTION II: VEGETABLE PRODUCTS (Chapters 06 - 14)
  // =========================================================================
  {
    id: 2,
    romanNumeral: 'Section II',
    title: 'Vegetable Products',
    shortTitle: 'Produce, Grains & Coffee',
    chaptersRange: 'Chapters 06 - 14',
    chapters: [
      {
        chapterCode: '07',
        title: 'Edible Vegetables & Certain Roots',
        description: 'Potatoes, tomatoes, onions, garlic, cabbages, legumes fresh or frozen',
        averageMfnDuty: 8.0,
        commonSubheadings: [
          { code: '0702.00', description: 'Tomatoes, fresh or chilled (Vine, plum, cherry)', defaultDuty: 8.5, dutyType: 'Ad-Valorem', statutoryUnit: 'kg' },
          { code: '0703.10', description: 'Onions and shallots, fresh or chilled', defaultDuty: 6.0, dutyType: 'Ad-Valorem', statutoryUnit: 'kg' },
        ],
      },
      {
        chapterCode: '08',
        title: 'Edible Fruit & Nuts; Peel of Citrus/Melons',
        description: 'Bananas, dates, citrus, grapes, apples, pears, berries, avocados',
        averageMfnDuty: 6.5,
        commonSubheadings: [
          { code: '0804.40', description: 'Avocados (Hass), fresh or dried', defaultDuty: 4.5, dutyType: 'Ad-Valorem', statutoryUnit: 'kg', wcoSourceNotes: 'Phytosanitary inspection mandatory' },
          { code: '0808.10', description: 'Apples, fresh', defaultDuty: 5.0, dutyType: 'Ad-Valorem', statutoryUnit: 'kg' },
        ],
      },
      {
        chapterCode: '09',
        title: 'Coffee, Tea, Maté & Spices',
        description: 'Coffee beans, green tea, black tea, pepper, vanilla, cinnamon, cloves',
        averageMfnDuty: 5.0,
        commonSubheadings: [
          { code: '0901.11', description: 'Coffee, not roasted, not decaffeinated (Green Arabica & Robusta beans)', defaultDuty: 0.0, dutyType: 'Duty-Free', statutoryUnit: 'kg', wcoSourceNotes: 'International Coffee Agreement standards' },
          { code: '0901.21', description: 'Coffee, roasted, not decaffeinated', defaultDuty: 7.5, dutyType: 'Ad-Valorem', statutoryUnit: 'kg' },
          { code: '0902.10', description: 'Green tea in immediate packings <= 3 kg', defaultDuty: 4.0, dutyType: 'Ad-Valorem', statutoryUnit: 'kg' },
        ],
      },
      {
        chapterCode: '10',
        title: 'Cereals',
        description: 'Wheat, rye, barley, oats, maize (corn), rice, grain sorghum',
        averageMfnDuty: 6.0,
        commonSubheadings: [
          { code: '1001.99', description: 'Other wheat and meslin (Hard amber durum and soft wheat)', defaultDuty: 3.5, dutyType: 'Ad-Valorem', statutoryUnit: 'Tonne' },
          { code: '1006.30', description: 'Semi-milled or wholly milled rice, whether or not polished or glazed (Basmati & Jasmine)', defaultDuty: 11.0, dutyType: 'Ad-Valorem', statutoryUnit: 'kg' },
        ],
      },
      {
        chapterCode: '12',
        title: 'Oil Seeds and Oleaginous Fruits',
        description: 'Soybeans, sunflower seeds, rapeseeds, sesame seeds, medicinal plants',
        averageMfnDuty: 3.0,
        commonSubheadings: [
          { code: '1201.90', description: 'Soya beans, whether or not broken (other than seed)', defaultDuty: 0.0, dutyType: 'Duty-Free', statutoryUnit: 'Tonne', wcoSourceNotes: 'Key global trade commodity, zero MFN duty in most major regimes' },
        ],
      },
    ],
  },

  // =========================================================================
  // SECTION III: ANIMAL OR VEGETABLE FATS AND OILS (Chapter 15) - SPECIFICALLY REQUESTED
  // =========================================================================
  {
    id: 3,
    romanNumeral: 'Section III',
    title: 'Animal or Vegetable Fats, Oils & Waxes',
    shortTitle: 'Fats, Oils & Waxes',
    chaptersRange: 'Chapter 15',
    chapters: [
      {
        chapterCode: '15',
        title: 'Animal or Vegetable Fats & Oils and Their Cleavage Products',
        description: 'Lard, tallow, soybean oil, olive oil, palm oil, coconut oil, sunflower oil, vegetable waxes',
        averageMfnDuty: 6.8,
        commonSubheadings: [
          { code: '1509.20', description: 'Extra virgin olive oil (EVOO) obtained solely by mechanical means', defaultDuty: 7.5, dutyType: 'Ad-Valorem', statutoryUnit: 'kg / Liter', wcoSourceNotes: 'International Olive Council (IOC) chemical acidity certification (<0.8%) required' },
          { code: '1509.40', description: 'Other virgin olive oil', defaultDuty: 6.5, dutyType: 'Ad-Valorem', statutoryUnit: 'kg / Liter' },
          { code: '1511.10', description: 'Crude palm oil (CPO), whether or not degummed', defaultDuty: 0.0, dutyType: 'Duty-Free', statutoryUnit: 'Tonne', wcoSourceNotes: 'RSPO (Roundtable on Sustainable Palm Oil) & EU Deforestation Regulation (EUDR) compliant' },
          { code: '1511.90', description: 'Refined palm oil and its fractions (RBD Palm Olein)', defaultDuty: 8.0, dutyType: 'Ad-Valorem', statutoryUnit: 'Tonne' },
          { code: '1507.10', description: 'Crude soybean oil, whether or not degummed', defaultDuty: 4.0, dutyType: 'Ad-Valorem', statutoryUnit: 'kg' },
          { code: '1512.11', description: 'Sunflower-seed or safflower oil, crude', defaultDuty: 5.0, dutyType: 'Ad-Valorem', statutoryUnit: 'kg' },
          { code: '1513.11', description: 'Crude coconut (copra) oil', defaultDuty: 3.0, dutyType: 'Ad-Valorem', statutoryUnit: 'kg' },
          { code: '1521.90', description: 'Other vegetable waxes (carnauba wax, candelilla wax)', defaultDuty: 0.0, dutyType: 'Duty-Free', statutoryUnit: 'kg' },
        ],
      },
    ],
  },

  // =========================================================================
  // SECTION IV: PREPARED FOODSTUFFS; BEVERAGES, SPIRITS, VINEGAR; TOBACCO (Chapters 16 - 24)
  // =========================================================================
  {
    id: 4,
    romanNumeral: 'Section IV',
    title: 'Prepared Foodstuffs, Beverages, Spirits & Tobacco',
    shortTitle: 'Food, Beverages & Tobacco',
    chaptersRange: 'Chapters 16 - 24',
    chapters: [
      {
        chapterCode: '18',
        title: 'Cocoa and Cocoa Preparations',
        description: 'Cocoa beans, cocoa paste, cocoa butter, chocolate confectionery',
        averageMfnDuty: 7.5,
        commonSubheadings: [
          { code: '1801.00', description: 'Cocoa beans, whole or broken, raw or roasted', defaultDuty: 0.0, dutyType: 'Duty-Free', statutoryUnit: 'kg', wcoSourceNotes: 'EUDR traceability verification applicable' },
          { code: '1806.32', description: 'Chocolate and other cocoa preparations in blocks, slabs or bars, not filled', defaultDuty: 8.0, dutyType: 'Ad-Valorem', statutoryUnit: 'kg' },
        ],
      },
      {
        chapterCode: '21',
        title: 'Miscellaneous Edible Preparations',
        description: 'Extracts of coffee/tea, yeasts, sauces, mixed condiments, soups, protein concentrates',
        averageMfnDuty: 6.4,
        commonSubheadings: [
          { code: '2103.90', description: 'Other sauces and preparations therefor; mixed condiments (Sriracha, BBQ, marinades)', defaultDuty: 6.4, dutyType: 'Ad-Valorem', statutoryUnit: 'kg' },
        ],
      },
      {
        chapterCode: '22',
        title: 'Beverages, Spirits and Vinegar',
        description: 'Mineral waters, beer, wine of fresh grapes, whiskies, rum, gin, vodka, spirits',
        averageMfnDuty: 14.5,
        commonSubheadings: [
          { code: '2203.00', description: 'Beer made from malt', defaultDuty: 5.0, dutyType: 'Ad-Valorem', statutoryUnit: 'Liter', wcoSourceNotes: 'Excise alcohol stamp required in destination jurisdiction' },
          { code: '2204.21', description: 'Wine of fresh grapes in containers holding <= 2 liters (Bordeaux, Rioja, Napa Valley)', defaultDuty: 6.8, dutyType: 'Ad-Valorem', statutoryUnit: 'Liter', wcoSourceNotes: 'Certificate of Protected Designation of Origin (PDO/AOC) often needed' },
          { code: '2208.30', description: 'Whiskies (Bourbon, Scotch, Irish, Japanese whiskey)', defaultDuty: 12.0, dutyType: 'Ad-Valorem', statutoryUnit: 'Proof Liter', wcoSourceNotes: 'Specific federal excise tax applies per proof gallon/liter' },
        ],
      },
      {
        chapterCode: '24',
        title: 'Tobacco and Manufactured Tobacco Substitutes; Nicotine Products',
        description: 'Unmanufactured tobacco, cigars, cigarettes, e-liquid nicotine products',
        averageMfnDuty: 35.0,
        commonSubheadings: [
          { code: '2402.20', description: 'Cigarettes containing tobacco', defaultDuty: 35.0, dutyType: 'Compound', statutoryUnit: '1,000 sticks', wcoSourceNotes: 'Subject to high sin taxes, track-and-trace security stamps' },
          { code: '2404.12', description: 'Products containing nicotine intended for inhalation without combustion (Vape cartridges)', defaultDuty: 15.0, dutyType: 'Ad-Valorem', statutoryUnit: 'Number' },
        ],
      },
    ],
  },

  // =========================================================================
  // SECTION V: MINERAL PRODUCTS (Chapters 25 - 27)
  // =========================================================================
  {
    id: 5,
    romanNumeral: 'Section V',
    title: 'Mineral Products & Energy',
    shortTitle: 'Minerals, Ores & Fuel',
    chaptersRange: 'Chapters 25 - 27',
    chapters: [
      {
        chapterCode: '25',
        title: 'Salt, Sulphur, Earths and Stone, Plastering Materials, Lime and Cement',
        description: 'Industrial salt, quartz, gypsum, limestone, Portland cement',
        averageMfnDuty: 2.0,
        cbamApplicable: true,
        commonSubheadings: [
          { code: '2523.29', description: 'Portland cement, other than white cement', defaultDuty: 0.0, dutyType: 'Duty-Free', cbamRequired: true, statutoryUnit: 'Tonne', wcoSourceNotes: 'EU CBAM carbon emissions verification mandatory' },
        ],
      },
      {
        chapterCode: '26',
        title: 'Ores, Slag and Ash',
        description: 'Iron ores, copper, nickel, aluminum, lead, zinc, tin, precious metal ores',
        averageMfnDuty: 0.0,
        commonSubheadings: [
          { code: '2601.11', description: 'Iron ores and concentrates, non-agglomerated', defaultDuty: 0.0, dutyType: 'Duty-Free', statutoryUnit: 'Tonne' },
          { code: '2603.00', description: 'Copper ores and concentrates', defaultDuty: 0.0, dutyType: 'Duty-Free', statutoryUnit: 'Tonne' },
          { code: '2604.00', description: 'Nickel ores and concentrates', defaultDuty: 0.0, dutyType: 'Duty-Free', statutoryUnit: 'Tonne' },
        ],
      },
      {
        chapterCode: '27',
        title: 'Mineral Fuels, Oils & Products of Their Distillation',
        description: 'Petroleum oils, crude, refined fuels, natural gas, coal, electrical energy',
        averageMfnDuty: 1.5,
        commonSubheadings: [
          { code: '2709.00', description: 'Petroleum oils and oils obtained from bituminous minerals, crude', defaultDuty: 0.0, dutyType: 'Duty-Free', statutoryUnit: 'Barrel / Tonne' },
          { code: '2710.12', description: 'Light petroleum oils and preparations (Motor gasoline / petrol)', defaultDuty: 2.5, dutyType: 'Ad-Valorem', statutoryUnit: 'Liter' },
          { code: '2711.11', description: 'Liquefied natural gas (LNG)', defaultDuty: 0.0, dutyType: 'Duty-Free', statutoryUnit: 'Cubic Meter' },
        ],
      },
    ],
  },

  // =========================================================================
  // SECTION VI: CHEMICAL & ALLIED INDUSTRIES (Chapters 28 - 38)
  // =========================================================================
  {
    id: 6,
    romanNumeral: 'Section VI',
    title: 'Products of Chemical & Allied Industries',
    shortTitle: 'Chemicals & Pharma',
    chaptersRange: 'Chapters 28 - 38',
    chapters: [
      {
        chapterCode: '28',
        title: 'Inorganic Chemicals & Compounds',
        description: 'Chemical elements, inorganic acids, halogen, metal oxides, salts, isotopes',
        averageMfnDuty: 4.5,
        commonSubheadings: [
          { code: '2804.10', description: 'Hydrogen, pure industrial grade', defaultDuty: 3.7, dutyType: 'Ad-Valorem', cbamRequired: true, statutoryUnit: 'Cubic Meter' },
          { code: '2814.10', description: 'Anhydrous ammonia (fertilizer and chemical feedstock)', defaultDuty: 5.5, dutyType: 'Ad-Valorem', cbamRequired: true, statutoryUnit: 'kg' },
        ],
      },
      {
        chapterCode: '29',
        title: 'Organic Chemicals',
        description: 'Hydrocarbons, alcohols, phenols, ethers, hormones, heterocyclic compounds',
        averageMfnDuty: 5.0,
        commonSubheadings: [
          { code: '2905.11', description: 'Methanol (methyl alcohol)', defaultDuty: 5.5, dutyType: 'Ad-Valorem', statutoryUnit: 'Liter' },
          { code: '2933.39', description: 'Heterocyclic compounds containing an unfused pyridine ring (Pharma precursors)', defaultDuty: 0.0, dutyType: 'Duty-Free', exportControlRisk: 'Dual-Use (EAR99)', statutoryUnit: 'kg' },
        ],
      },
      {
        chapterCode: '30',
        title: 'Pharmaceutical Products',
        description: 'Medicaments, vaccines, toxins, cultures, blood fractions, surgical sutures',
        averageMfnDuty: 0.0, // WTO Pharma zero-tariff
        commonSubheadings: [
          { code: '3002.41', description: 'Vaccines for human medicine (COVID, Influenza, mRNA)', defaultDuty: 0.0, dutyType: 'Duty-Free', statutoryUnit: 'kg', wcoSourceNotes: 'Covered by WTO Agreement on Trade in Pharmaceutical Products (Zero Tariff)' },
          { code: '3004.90', description: 'Medicaments consisting of mixed or unmixed products for therapeutic uses (Tablets, Vials)', defaultDuty: 0.0, dutyType: 'Duty-Free', statutoryUnit: 'kg' },
          { code: '3006.10', description: 'Sterile surgical catgut and suture materials', defaultDuty: 0.0, dutyType: 'Duty-Free', statutoryUnit: 'kg' },
        ],
      },
      {
        chapterCode: '31',
        title: 'Fertilizers',
        description: 'Mineral or chemical nitrogenous, phosphatic and potassic fertilizers',
        averageMfnDuty: 4.0,
        cbamApplicable: true,
        commonSubheadings: [
          { code: '3102.10', description: 'Urea, whether or not in aqueous solution', defaultDuty: 3.5, dutyType: 'Ad-Valorem', cbamRequired: true, statutoryUnit: 'kg' },
          { code: '3105.20', description: 'Mineral or chemical fertilizers containing nitrogen, phosphorus and potassium (NPK)', defaultDuty: 4.5, dutyType: 'Ad-Valorem', cbamRequired: true, statutoryUnit: 'kg' },
        ],
      },
      {
        chapterCode: '33',
        title: 'Essential Oils & Resinoids; Perfumery, Cosmetic or Toilet Preparations',
        description: 'Essential oils, perfumes, beauty or make-up preparations, haircare, oral hygiene',
        averageMfnDuty: 5.2,
        commonSubheadings: [
          { code: '3303.00', description: 'Perfumes and toilet waters (Fine fragrances)', defaultDuty: 0.0, dutyType: 'Duty-Free', statutoryUnit: 'Liter' },
          { code: '3304.99', description: 'Other beauty or make-up preparations and preparations for the care of the skin (anti-aging serums, sunscreens)', defaultDuty: 3.5, dutyType: 'Ad-Valorem', statutoryUnit: 'kg' },
        ],
      },
    ],
  },

  // =========================================================================
  // SECTION VII: PLASTICS & RUBBER (Chapters 39 - 40)
  // =========================================================================
  {
    id: 7,
    romanNumeral: 'Section VII',
    title: 'Plastics & Articles Thereof; Rubber',
    shortTitle: 'Plastics & Rubber',
    chaptersRange: 'Chapters 39 - 40',
    chapters: [
      {
        chapterCode: '39',
        title: 'Plastics and Articles Thereof',
        description: 'Polymers of ethylene, propylene, styrene, vinyl chloride in primary forms, sheets, pipes',
        averageMfnDuty: 5.5,
        commonSubheadings: [
          { code: '3901.10', description: 'Polyethylene having a specific gravity of < 0.94 (LDPE virgin resin pellets)', defaultDuty: 6.5, dutyType: 'Ad-Valorem', statutoryUnit: 'kg' },
          { code: '3923.30', description: 'Carboys, bottles, flasks and similar plastic articles for packaging', defaultDuty: 5.3, dutyType: 'Ad-Valorem', statutoryUnit: 'Number' },
          { code: '3926.90', description: 'Other articles of plastics (Gaskets, fittings, protective covers)', defaultDuty: 5.3, dutyType: 'Ad-Valorem', statutoryUnit: 'kg' },
        ],
      },
      {
        chapterCode: '40',
        title: 'Rubber and Articles Thereof',
        description: 'Natural rubber, synthetic rubber, conveyor belts, pneumatic tires, gaskets',
        averageMfnDuty: 4.0,
        commonSubheadings: [
          { code: '4011.10', description: 'New pneumatic tires, of rubber, of a kind used on motor cars', defaultDuty: 4.0, dutyType: 'Ad-Valorem', antiDumpingRisk: true, statutoryUnit: 'Number' },
          { code: '4016.93', description: 'Gaskets, washers and other seals of vulcanized rubber', defaultDuty: 2.5, dutyType: 'Ad-Valorem', statutoryUnit: 'kg' },
        ],
      },
    ],
  },

  // =========================================================================
  // SECTION VIII: RAW HIDES, LEATHER & TRAVEL GOODS (Chapters 41 - 43)
  // =========================================================================
  {
    id: 8,
    romanNumeral: 'Section VIII',
    title: 'Raw Hides, Skins, Leather, Furskins & Travel Goods',
    shortTitle: 'Leather & Travel Goods',
    chaptersRange: 'Chapters 41 - 43',
    chapters: [
      {
        chapterCode: '41',
        title: 'Raw Hides and Skins (Other than Furskins) and Leather',
        description: 'Bovine, equine, sheep and goat skin leather, whole or split',
        averageMfnDuty: 4.2,
        commonSubheadings: [
          { code: '4107.12', description: 'Grain splits of bovine leather, without hair on', defaultDuty: 4.5, dutyType: 'Ad-Valorem', statutoryUnit: 'Square Meter' },
        ],
      },
      {
        chapterCode: '42',
        title: 'Articles of Leather; Saddlery and Harness; Travel Goods, Handbags',
        description: 'Trunks, suitcases, vanity cases, executive-cases, briefcases, school satchels, handbags',
        averageMfnDuty: 9.8,
        commonSubheadings: [
          { code: '4202.11', description: 'Trunks, suitcases, vanity cases with outer surface of leather', defaultDuty: 8.0, dutyType: 'Ad-Valorem', statutoryUnit: 'Number' },
          { code: '4202.21', description: 'Handbags, whether or not with shoulder strap, with outer surface of leather', defaultDuty: 9.0, dutyType: 'Ad-Valorem', statutoryUnit: 'Number' },
          { code: '4203.30', description: 'Belts and bandoliers of leather or composition leather', defaultDuty: 4.0, dutyType: 'Ad-Valorem', statutoryUnit: 'Number' },
        ],
      },
    ],
  },

  // =========================================================================
  // SECTION IX: WOOD & ARTICLES OF WOOD; CORK (Chapters 44 - 46)
  // =========================================================================
  {
    id: 9,
    romanNumeral: 'Section IX',
    title: 'Wood & Articles of Wood; Wood Charcoal; Cork & Basketware',
    shortTitle: 'Wood, Timber & Cork',
    chaptersRange: 'Chapters 44 - 46',
    chapters: [
      {
        chapterCode: '44',
        title: 'Wood and Articles of Wood; Wood Charcoal',
        description: 'Fuel wood, rough wood, sawn timber, particle board, plywood, wooden packing cases',
        averageMfnDuty: 3.8,
        commonSubheadings: [
          { code: '4407.11', description: 'Sawn or chipped coniferous wood of pine, thickness > 6mm', defaultDuty: 0.0, dutyType: 'Duty-Free', statutoryUnit: 'Cubic Meter', wcoSourceNotes: 'CITES certification check required for rare timber species' },
          { code: '4412.33', description: 'Other plywood consisting solely of sheets of wood <= 6mm', defaultDuty: 8.0, dutyType: 'Ad-Valorem', antiDumpingRisk: true, statutoryUnit: 'Cubic Meter' },
          { code: '4415.20', description: 'Pallets, box pallets and other load boards of wood (ISPM-15 certified)', defaultDuty: 0.0, dutyType: 'Duty-Free', statutoryUnit: 'Number' },
        ],
      },
      {
        chapterCode: '45',
        title: 'Cork and Articles of Cork',
        description: 'Natural cork, agglomerated cork, cork stoppers for wine bottles',
        averageMfnDuty: 2.0,
        commonSubheadings: [
          { code: '4503.10', description: 'Corks and stoppers of natural cork for sparkling and still wine', defaultDuty: 0.0, dutyType: 'Duty-Free', statutoryUnit: 'kg' },
        ],
      },
    ],
  },

  // =========================================================================
  // SECTION X: PULP OF WOOD, PAPER, PAPERBOARD & PRINTED BOOKS (Chapters 47 - 49)
  // =========================================================================
  {
    id: 10,
    romanNumeral: 'Section X',
    title: 'Pulp of Wood; Paper & Paperboard; Printed Books & Media',
    shortTitle: 'Paper, Pulp & Books',
    chaptersRange: 'Chapters 47 - 49',
    chapters: [
      {
        chapterCode: '47',
        title: 'Pulp of Wood or Other Fibrous Cellulosic Material; Recovered Waste Paper',
        description: 'Chemical wood pulp, mechanical wood pulp, recovered corrugated paper',
        averageMfnDuty: 0.0,
        commonSubheadings: [
          { code: '4703.21', description: 'Chemical wood pulp, soda or sulphate, semi-bleached or bleached, coniferous', defaultDuty: 0.0, dutyType: 'Duty-Free', statutoryUnit: 'Tonne' },
        ],
      },
      {
        chapterCode: '48',
        title: 'Paper and Paperboard; Articles of Paper Pulp',
        description: 'Kraft paper, carton boxes, paper towels, self-adhesive paper, stationery',
        averageMfnDuty: 2.5,
        commonSubheadings: [
          { code: '4819.10', description: 'Cartons, boxes and cases, of corrugated paper or paperboard', defaultDuty: 0.0, dutyType: 'Duty-Free', statutoryUnit: 'kg' },
          { code: '4802.56', description: 'Uncoated writing and printing paper in sheets (A4 copy paper)', defaultDuty: 2.0, dutyType: 'Ad-Valorem', statutoryUnit: 'kg' },
        ],
      },
      {
        chapterCode: '49',
        title: 'Printed Books, Newspapers, Pictures and Other Products of Printing',
        description: 'Printed books, brochures, leaflets, dictionaries, children pictures, music',
        averageMfnDuty: 0.0, // UNESCO Florence Agreement zero duty
        commonSubheadings: [
          { code: '4901.99', description: 'Printed books, brochures, leaflets and similar printed matter (Literary, educational)', defaultDuty: 0.0, dutyType: 'Duty-Free', statutoryUnit: 'Number', wcoSourceNotes: 'UNESCO Florence Agreement duty-free educational status' },
          { code: '4907.00', description: 'Unused postage, revenue stamps; cheque forms, banknotes, stock certificates', defaultDuty: 0.0, dutyType: 'Duty-Free', exportControlRisk: 'Strategic / License Required', statutoryUnit: 'Number' },
        ],
      },
    ],
  },

  // =========================================================================
  // SECTION XI: TEXTILES AND TEXTILE ARTICLES (Chapters 50 - 63)
  // =========================================================================
  {
    id: 11,
    romanNumeral: 'Section XI',
    title: 'Textiles & Textile Articles (Apparel, Fabrics & Fibers)',
    shortTitle: 'Textiles & Apparel',
    chaptersRange: 'Chapters 50 - 63',
    chapters: [
      {
        chapterCode: '52',
        title: 'Cotton & Woven Fabrics',
        description: 'Cotton yarn, sewing thread, denim and twill fabrics',
        averageMfnDuty: 7.0,
        commonSubheadings: [
          { code: '5208.11', description: 'Plain weave cotton fabrics, unbleached <= 100g/m2', defaultDuty: 7.5, dutyType: 'Ad-Valorem', statutoryUnit: 'Square Meter' },
          { code: '5209.42', description: 'Denim fabrics of cotton, weighing more than 200 g/m2', defaultDuty: 8.5, dutyType: 'Ad-Valorem', statutoryUnit: 'Square Meter' },
        ],
      },
      {
        chapterCode: '61',
        title: 'Articles of Apparel & Clothing Accessories, Knitted or Crocheted',
        description: 'Jerseys, pullovers, cardigans, t-shirts, dresses, suits, tracksuits',
        averageMfnDuty: 14.0,
        commonSubheadings: [
          { code: '6109.10', description: 'T-shirts, singlets and other vests, of cotton, knitted or crocheted', defaultDuty: 12.0, dutyType: 'Ad-Valorem', statutoryUnit: 'Number' },
          { code: '6110.20', description: 'Jerseys, pullovers, cardigans, of cotton, knitted', defaultDuty: 16.5, dutyType: 'Ad-Valorem', statutoryUnit: 'Number' },
          { code: '6115.95', description: 'Other pantyhose and tights, of cotton', defaultDuty: 14.6, dutyType: 'Ad-Valorem', statutoryUnit: 'Pair' },
        ],
      },
      {
        chapterCode: '62',
        title: 'Articles of Apparel & Clothing Accessories, Not Knitted (Woven)',
        description: "Men's, women's or boys' suits, ensembles, jackets, trousers, shirts, coats",
        averageMfnDuty: 14.5,
        commonSubheadings: [
          { code: '6203.42', description: "Men's or boys' trousers, bib and brace overalls and shorts, of cotton (Denim jeans)", defaultDuty: 14.5, dutyType: 'Ad-Valorem', statutoryUnit: 'Number' },
          { code: '6204.62', description: "Women's or girls' trousers and shorts, of cotton", defaultDuty: 14.0, dutyType: 'Ad-Valorem', statutoryUnit: 'Number' },
          { code: '6205.20', description: "Men's or boys' shirts, of cotton, woven", defaultDuty: 19.7, dutyType: 'Ad-Valorem', statutoryUnit: 'Number' },
        ],
      },
      {
        chapterCode: '63',
        title: 'Other Made Up Textile Articles; Sets; Worn Clothing',
        description: 'Blankets, bed linen, curtains, sacks, tarpaulins, camping goods',
        averageMfnDuty: 8.5,
        commonSubheadings: [
          { code: '6302.21', description: 'Other bed linen, printed, of cotton', defaultDuty: 6.8, dutyType: 'Ad-Valorem', statutoryUnit: 'Number' },
        ],
      },
    ],
  },

  // =========================================================================
  // SECTION XII: FOOTWEAR, HEADGEAR, UMBRELLAS (Chapters 64 - 67)
  // =========================================================================
  {
    id: 12,
    romanNumeral: 'Section XII',
    title: 'Footwear, Headgear, Umbrellas & Artificial Flowers',
    shortTitle: 'Footwear & Headgear',
    chaptersRange: 'Chapters 64 - 67',
    chapters: [
      {
        chapterCode: '64',
        title: 'Footwear, Gaiters and the Like; Parts of Such Articles',
        description: 'Waterproof footwear, sports shoes, athletic sneakers, leather shoes, boots',
        averageMfnDuty: 11.8,
        commonSubheadings: [
          { code: '6403.99', description: 'Other footwear with outer soles of rubber/plastics and uppers of leather (Dress & casual shoes)', defaultDuty: 8.5, dutyType: 'Ad-Valorem', statutoryUnit: 'Pair' },
          { code: '6404.11', description: 'Sports footwear; tennis shoes, basketball shoes, gym shoes, training shoes', defaultDuty: 20.0, dutyType: 'Ad-Valorem', statutoryUnit: 'Pair' },
          { code: '6402.91', description: 'Other footwear covering the ankle, with outer soles and uppers of rubber or plastics', defaultDuty: 9.0, dutyType: 'Ad-Valorem', statutoryUnit: 'Pair' },
        ],
      },
      {
        chapterCode: '65',
        title: 'Headgear and Parts Thereof',
        description: 'Safety headgear, motorcycle helmets, hats, caps, hairnets',
        averageMfnDuty: 6.5,
        commonSubheadings: [
          { code: '6506.10', description: 'Safety headgear (Industrial hardhats, motorcycle helmets, sports helmets)', defaultDuty: 0.0, dutyType: 'Duty-Free', statutoryUnit: 'Number' },
        ],
      },
    ],
  },

  // =========================================================================
  // SECTION XIII: ARTICLES OF STONE, PLASTER, CERAMICS & GLASS (Chapters 68 - 70)
  // =========================================================================
  {
    id: 13,
    romanNumeral: 'Section XIII',
    title: 'Articles of Stone, Plaster, Cement, Ceramics & Glass',
    shortTitle: 'Ceramics, Stone & Glass',
    chaptersRange: 'Chapters 68 - 70',
    chapters: [
      {
        chapterCode: '68',
        title: 'Articles of Stone, Plaster, Cement, Asbestos, Mica or Similar Materials',
        description: 'Worked monumental stone (granite, marble tiles), friction materials, mineral wool',
        averageMfnDuty: 4.0,
        commonSubheadings: [
          { code: '6802.21', description: 'Cut or sawn marble, travertine and alabaster with flat/even surface', defaultDuty: 3.5, dutyType: 'Ad-Valorem', statutoryUnit: 'Square Meter' },
        ],
      },
      {
        chapterCode: '69',
        title: 'Ceramic Products',
        description: 'Refractory bricks, ceramic flags and paving, tiles, porcelain tableware',
        averageMfnDuty: 6.5,
        commonSubheadings: [
          { code: '6907.21', description: 'Ceramic flags and paving, hearth or wall tiles of a water absorption <= 0.5% (Porcelain tile)', defaultDuty: 8.5, dutyType: 'Ad-Valorem', antiDumpingRisk: true, statutoryUnit: 'Square Meter' },
        ],
      },
      {
        chapterCode: '70',
        title: 'Glass and Glassware',
        description: 'Float glass, automotive safety glass, glass containers, laboratory glassware, optical fiber blanks',
        averageMfnDuty: 5.0,
        commonSubheadings: [
          { code: '7007.11', description: 'Toughened (tempered) safety glass of size and shape suitable for motor vehicles', defaultDuty: 4.5, dutyType: 'Ad-Valorem', statutoryUnit: 'Square Meter' },
          { code: '7013.37', description: 'Glassware of a kind used for table or kitchen purposes (drinking glasses)', defaultDuty: 6.0, dutyType: 'Ad-Valorem', statutoryUnit: 'Number' },
        ],
      },
    ],
  },

  // =========================================================================
  // SECTION XIV: PEARLS, PRECIOUS STONES, PRECIOUS METALS & COIN (Chapter 71)
  // =========================================================================
  {
    id: 14,
    romanNumeral: 'Section XIV',
    title: 'Pearls, Precious Stones, Precious Metals & Jewellery',
    shortTitle: 'Jewellery & Precious Metals',
    chaptersRange: 'Chapter 71',
    chapters: [
      {
        chapterCode: '71',
        title: 'Natural/Cultured Pearls, Precious Stones, Precious Metals & Jewellery',
        description: 'Diamonds, emeralds, rubies, unwrought gold, silver bullion, platinum, jewelry, coins',
        averageMfnDuty: 3.5,
        commonSubheadings: [
          { code: '7102.39', description: 'Non-industrial diamonds, worked, but not mounted or set (Cut polished diamonds)', defaultDuty: 0.0, dutyType: 'Duty-Free', statutoryUnit: 'Carat', wcoSourceNotes: 'Kimberley Process Certification Scheme (KPCS) conflict-free verification required' },
          { code: '7108.12', description: 'Gold in other unwrought forms (Investment bullion bars 99.99%)', defaultDuty: 0.0, dutyType: 'Duty-Free', statutoryUnit: 'Troy Ounce / kg', wcoSourceNotes: 'Exempt from VAT/GST in most jurisdictions under qualifying investment gold rules' },
          { code: '7113.19', description: 'Articles of jewelry and parts thereof, of precious metal (Gold & platinum rings, necklaces)', defaultDuty: 5.5, dutyType: 'Ad-Valorem', statutoryUnit: 'Gram' },
        ],
      },
    ],
  },

  // =========================================================================
  // SECTION XV: BASE METALS & ARTICLES OF BASE METAL (Chapters 72 - 83)
  // =========================================================================
  {
    id: 15,
    romanNumeral: 'Section XV',
    title: 'Base Metals & Articles of Base Metal (Steel, Aluminum, Copper)',
    shortTitle: 'Steel, Aluminum & Metals',
    chaptersRange: 'Chapters 72 - 83',
    chapters: [
      {
        chapterCode: '72',
        title: 'Iron and Steel',
        description: 'Flat-rolled products of iron/non-alloy steel, hot-rolled, cold-rolled, stainless steel, wire',
        averageMfnDuty: 5.0,
        cbamApplicable: true,
        commonSubheadings: [
          { code: '7208.39', description: 'Flat-rolled products of iron/non-alloy steel, in coils, hot-rolled', defaultDuty: 0.0, dutyType: 'Duty-Free', antiDumpingRisk: true, cbamRequired: true, statutoryUnit: 'Tonne', wcoSourceNotes: 'Subject to US Section 232 tariffs (25%) and EU CBAM verified emissions' },
          { code: '7219.34', description: 'Flat-rolled products of stainless steel, cold-rolled, thickness < 0.5mm', defaultDuty: 5.0, dutyType: 'Ad-Valorem', antiDumpingRisk: true, cbamRequired: true, statutoryUnit: 'kg' },
        ],
      },
      {
        chapterCode: '73',
        title: 'Articles of Iron or Steel',
        description: 'Tubes, pipes, hollow profiles, structures, containers, wire, nails, screws',
        averageMfnDuty: 6.5,
        cbamApplicable: true,
        commonSubheadings: [
          { code: '7326.90', description: 'Other articles of iron or steel, not elsewhere specified', defaultDuty: 7.5, dutyType: 'Ad-Valorem', antiDumpingRisk: true, cbamRequired: true, statutoryUnit: 'kg' },
          { code: '7304.19', description: 'Line pipe of a kind used for oil or gas pipelines, seamless', defaultDuty: 3.2, dutyType: 'Ad-Valorem', cbamRequired: true, statutoryUnit: 'Tonne' },
        ],
      },
      {
        chapterCode: '74',
        title: 'Copper and Articles Thereof',
        description: 'Refined copper, copper alloys, copper cathode, wire, tubes, pipe fittings',
        averageMfnDuty: 2.5,
        commonSubheadings: [
          { code: '7403.11', description: 'Copper cathodes and sections of cathodes, refined', defaultDuty: 0.0, dutyType: 'Duty-Free', statutoryUnit: 'Tonne' },
          { code: '7408.11', description: 'Copper wire of refined copper of which the maximum cross-sectional dimension exceeds 6 mm', defaultDuty: 3.0, dutyType: 'Ad-Valorem', statutoryUnit: 'kg' },
        ],
      },
      {
        chapterCode: '76',
        title: 'Aluminum and Articles Thereof',
        description: 'Unwrought aluminum, bars, rods, profiles, wire, plates, foil, structures',
        averageMfnDuty: 4.5,
        cbamApplicable: true,
        commonSubheadings: [
          { code: '7601.10', description: 'Aluminum, not alloyed, unwrought (ingots)', defaultDuty: 2.6, dutyType: 'Ad-Valorem', antiDumpingRisk: true, cbamRequired: true, statutoryUnit: 'Tonne', wcoSourceNotes: 'Subject to US Section 232 (10%) and EU CBAM scope' },
          { code: '7606.12', description: 'Aluminum alloy plates, sheets and strip, rectangular, thickness > 0.2mm', defaultDuty: 6.0, dutyType: 'Ad-Valorem', cbamRequired: true, statutoryUnit: 'kg' },
        ],
      },
      {
        chapterCode: '82',
        title: 'Tools, Implements, Cutlery, Spoons and Forks of Base Metal',
        description: 'Hand tools, saws, files, wrenches, interchangeable drill bits, cutting blades',
        averageMfnDuty: 5.0,
        commonSubheadings: [
          { code: '8207.30', description: 'Interchangeable tools for pressing, stamping or punching', defaultDuty: 3.5, dutyType: 'Ad-Valorem', statutoryUnit: 'Number' },
        ],
      },
    ],
  },

  // =========================================================================
  // SECTION XVI: MACHINERY, MECHANICAL APPLIANCES & ELECTRONICS (Chapters 84 - 85)
  // =========================================================================
  {
    id: 16,
    romanNumeral: 'Section XVI',
    title: 'Machinery, Mechanical Appliances & Electronics',
    shortTitle: 'Machinery & High-Tech',
    chaptersRange: 'Chapters 84 - 85',
    chapters: [
      {
        chapterCode: '84',
        title: 'Nuclear Reactors, Boilers, Machinery & Mechanical Appliances',
        description: 'Turbines, pumps, refrigerators, computers, semiconductor manufacturing equipment, automated machinery',
        averageMfnDuty: 1.5,
        commonSubheadings: [
          { code: '8471.30', description: 'Portable automatic data processing machines (Laptops, Tablets, Handhelds <= 10kg)', defaultDuty: 0.0, dutyType: 'Duty-Free', exportControlRisk: 'Dual-Use (EAR99)', statutoryUnit: 'Number', wcoSourceNotes: 'Covered by WTO Information Technology Agreement (ITA-1 & ITA-2 Duty-Free)' },
          { code: '8471.41', description: 'Other automatic data processing machines comprising CPU and memory (Enterprise AI Servers)', defaultDuty: 0.0, dutyType: 'Duty-Free', exportControlRisk: 'Dual-Use (EAR99)', statutoryUnit: 'Number' },
          { code: '8471.70', description: 'Storage units for automatic data processing machines (Solid State Drives / NVMe / HDD)', defaultDuty: 0.0, dutyType: 'Duty-Free', statutoryUnit: 'Number' },
          { code: '8486.20', description: 'Machines and apparatus for manufacture of semiconductor devices (EUV/DUV Lithography & Steppers)', defaultDuty: 0.0, dutyType: 'Duty-Free', exportControlRisk: 'Strategic / License Required', statutoryUnit: 'Number', wcoSourceNotes: 'Strict multilateral export licensing (Wassenaar Arrangement / US BIS ECCN 3B001)' },
        ],
      },
      {
        chapterCode: '85',
        title: 'Electrical Machinery, Equipment & Sound Recorders',
        description: 'Transformers, electric batteries, smartphones, microchips, semiconductors, printed circuits',
        averageMfnDuty: 1.8,
        commonSubheadings: [
          { code: '8517.13', description: 'Smartphones and other cellular telephone handsets (5G mobile phones)', defaultDuty: 0.0, dutyType: 'Duty-Free', statutoryUnit: 'Number', wcoSourceNotes: 'WTO ITA Duty-Free classification' },
          { code: '8504.40', description: 'Static converters (Solar photovoltaic inverters, Industrial rectifiers, EV fast chargers)', defaultDuty: 1.5, dutyType: 'Ad-Valorem', statutoryUnit: 'Number' },
          { code: '8507.60', description: 'Lithium-ion accumulators (EV batteries and energy storage battery cells)', defaultDuty: 3.4, dutyType: 'Ad-Valorem', antiDumpingRisk: true, statutoryUnit: 'Number / kg' },
          { code: '8541.43', description: 'Photovoltaic cells assembled in modules or made up into panels (Solar Panels)', defaultDuty: 0.0, dutyType: 'Duty-Free', antiDumpingRisk: true, statutoryUnit: 'Watt / Number', wcoSourceNotes: 'High anti-dumping and countervailing duty litigation globally' },
          { code: '8542.31', description: 'Electronic integrated circuits: Processors and controllers (CPUs, GPUs, AI Accelerators)', defaultDuty: 0.0, dutyType: 'Duty-Free', exportControlRisk: 'Strategic / License Required', statutoryUnit: 'Number', wcoSourceNotes: 'WTO ITA-1 Zero Duty; strategic export control threshold under US BIS / EU Dual-Use list' },
        ],
      },
    ],
  },

  // =========================================================================
  // SECTION XVII: VEHICLES, AIRCRAFT, VESSELS & TRANSPORT (Chapters 86 - 89)
  // =========================================================================
  {
    id: 17,
    romanNumeral: 'Section XVII',
    title: 'Vehicles, Aircraft, Vessels & Associated Transport Equipment',
    shortTitle: 'Vehicles & Aerospace',
    chaptersRange: 'Chapters 86 - 89',
    chapters: [
      {
        chapterCode: '86',
        title: 'Railway or Tramway Locomotives, Rolling-Stock and Parts',
        description: 'Locomotives, passenger coaches, freight cars, track fixtures and signaling equipment',
        averageMfnDuty: 3.2,
        commonSubheadings: [
          { code: '8607.19', description: 'Axles and wheels for railway locomotives or rolling-stock', defaultDuty: 0.0, dutyType: 'Duty-Free', statutoryUnit: 'kg' },
        ],
      },
      {
        chapterCode: '87',
        title: 'Vehicles Other Than Railway or Tramway Rolling-Stock',
        description: 'Tractors, motor cars, passenger vehicles, goods transport trucks, chassis, automotive parts',
        averageMfnDuty: 8.5,
        commonSubheadings: [
          { code: '8703.23', description: 'Motor cars for passenger transport, spark-ignition engine > 1500cc but <= 3000cc (Sedans/SUVs)', defaultDuty: 10.0, dutyType: 'Ad-Valorem', statutoryUnit: 'Number' },
          { code: '8703.80', description: 'Other vehicles, with only electric motor for propulsion (Battery Electric Vehicles / BEVs)', defaultDuty: 10.0, dutyType: 'Ad-Valorem', antiDumpingRisk: true, statutoryUnit: 'Number', wcoSourceNotes: 'EU anti-subsidy duties (up to 35.3%) and US Section 301 duties (100%) on certain origins' },
          { code: '8708.29', description: 'Other parts and accessories of bodies for motor vehicles', defaultDuty: 2.5, dutyType: 'Ad-Valorem', statutoryUnit: 'kg' },
          { code: '8704.22', description: 'Motor vehicles for transport of goods, g.v.w. > 5 tonnes but <= 20 tonnes (Commercial freight trucks)', defaultDuty: 25.0, dutyType: 'Ad-Valorem', statutoryUnit: 'Number', wcoSourceNotes: 'US "Chicken Tax" 25% duty rate on light trucks' },
        ],
      },
      {
        chapterCode: '88',
        title: 'Aircraft, Spacecraft, and Parts Thereof',
        description: 'Airplanes, helicopters, spacecraft, satellites, suborbital and launch vehicles, drones',
        averageMfnDuty: 0.0, // WTO Civil Aircraft zero
        commonSubheadings: [
          { code: '8802.40', description: 'Aeroplanes and other powered aircraft of an unladen weight > 15,000 kg (Commercial passenger airliners)', defaultDuty: 0.0, dutyType: 'Duty-Free', exportControlRisk: 'Strategic / License Required', statutoryUnit: 'Number', wcoSourceNotes: 'Covered by WTO Agreement on Trade in Civil Aircraft (1979) Zero-Tariff' },
          { code: '8806.24', description: 'Unmanned aircraft (commercial cargo and surveillance drones) max take-off weight > 25 kg but <= 150 kg', defaultDuty: 0.0, dutyType: 'Duty-Free', exportControlRisk: 'Strategic / License Required', statutoryUnit: 'Number' },
        ],
      },
      {
        chapterCode: '89',
        title: 'Ships, Boats and Floating Structures',
        description: 'Cruise ships, ferry-boats, cargo vessels, tankers, fishing vessels, tugs',
        averageMfnDuty: 1.5,
        commonSubheadings: [
          { code: '8901.90', description: 'Other vessels for the transport of goods and other vessels for transport of persons (Container ships)', defaultDuty: 0.0, dutyType: 'Duty-Free', statutoryUnit: 'Gross Tonnage' },
        ],
      },
    ],
  },

  // =========================================================================
  // SECTION XVIII: OPTICAL, PHOTOGRAPHIC, PRECISION & MEDICAL (Chapters 90 - 92)
  // =========================================================================
  {
    id: 18,
    romanNumeral: 'Section XVIII',
    title: 'Optical, Precision, Measuring & Medical Instruments; Clocks',
    shortTitle: 'Medical, Optical & Precision',
    chaptersRange: 'Chapters 90 - 92',
    chapters: [
      {
        chapterCode: '90',
        title: 'Optical, Photographic, Measuring, Checking, Precision & Medical Instruments',
        description: 'Optical fibers, lenses, cameras, medical diagnostic apparatus, CT scanners, MRI machines',
        averageMfnDuty: 1.0,
        commonSubheadings: [
          { code: '9018.90', description: 'Instruments and appliances used in medical, surgical or veterinary sciences', defaultDuty: 0.0, dutyType: 'Duty-Free', statutoryUnit: 'Number', wcoSourceNotes: 'FDA / CE Medical Device Regulation (MDR) certification mandatory' },
          { code: '9022.14', description: 'Apparatus based on the use of X-rays for medical or surgical uses (Computed Tomography / CT scanners)', defaultDuty: 0.0, dutyType: 'Duty-Free', statutoryUnit: 'Number' },
          { code: '9031.80', description: 'Other measuring or checking instruments, appliances and machines (Laser metrology, Coordinate measuring machines)', defaultDuty: 1.4, dutyType: 'Ad-Valorem', statutoryUnit: 'Number' },
        ],
      },
      {
        chapterCode: '91',
        title: 'Clocks and Watches and Parts Thereof',
        description: 'Wrist-watches, pocket-watches, stopwatches, clock movements',
        averageMfnDuty: 4.8,
        commonSubheadings: [
          { code: '9102.11', description: 'Wrist-watches, electrically operated, with mechanical display only (Quartz wristwatches)', defaultDuty: 4.2, dutyType: 'Compound', statutoryUnit: 'Number' },
        ],
      },
      {
        chapterCode: '92',
        title: 'Musical Instruments; Parts and Accessories of Such Articles',
        description: 'Pianos, string instruments, brass-wind, acoustic guitars, electronic synthesizers',
        averageMfnDuty: 3.5,
        commonSubheadings: [
          { code: '9202.90', description: 'Other string musical instruments (Guitars, violins, harps)', defaultDuty: 4.5, dutyType: 'Ad-Valorem', statutoryUnit: 'Number', wcoSourceNotes: 'CITES rosewood (Dalbergia) permit check' },
        ],
      },
    ],
  },

  // =========================================================================
  // SECTION XIX: ARMS AND AMMUNITION; PARTS AND ACCESSORIES (Chapter 93)
  // =========================================================================
  {
    id: 19,
    romanNumeral: 'Section XIX',
    title: 'Arms & Ammunition; Parts & Accessories',
    shortTitle: 'Defense & Ammunition',
    chaptersRange: 'Chapter 93',
    chapters: [
      {
        chapterCode: '93',
        title: 'Arms and Ammunition; Parts and Accessories Thereof',
        description: 'Military weapons, sporting firearms, revolvers, cartridges, bombs, grenades, guided missiles',
        averageMfnDuty: 3.0,
        commonSubheadings: [
          { code: '9301.90', description: 'Military weapons, other than revolvers and pistols (Rifles, machine guns)', defaultDuty: 0.0, dutyType: 'Duty-Free', exportControlRisk: 'Strategic / License Required', statutoryUnit: 'Number', wcoSourceNotes: 'Subject to UN Arms Trade Treaty (ATT) and ITAR / Military end-use controls' },
          { code: '9306.30', description: 'Other cartridges and parts thereof (Caliber sporting & defense ammunition)', defaultDuty: 4.0, dutyType: 'Ad-Valorem', exportControlRisk: 'Strategic / License Required', statutoryUnit: '1,000 units' },
        ],
      },
    ],
  },

  // =========================================================================
  // SECTION XX: MISCELLANEOUS MANUFACTURED ARTICLES (Chapters 94 - 96)
  // =========================================================================
  {
    id: 20,
    romanNumeral: 'Section XX',
    title: 'Miscellaneous Manufactured Articles (Furniture, Toys, Sports)',
    shortTitle: 'Furniture, Toys & Prefab',
    chaptersRange: 'Chapters 94 - 96',
    chapters: [
      {
        chapterCode: '94',
        title: 'Furniture; Bedding, Mattresses, Lamps & Prefabricated Buildings',
        description: 'Seats, office furniture, bedroom furniture, illuminated signs, modular buildings',
        averageMfnDuty: 4.5,
        commonSubheadings: [
          { code: '9403.20', description: 'Other metal furniture (Modular office desks, warehouse shelving systems)', defaultDuty: 0.0, dutyType: 'Duty-Free', statutoryUnit: 'Number' },
          { code: '9403.60', description: 'Other wooden furniture of a kind used in bedrooms and offices', defaultDuty: 3.5, dutyType: 'Ad-Valorem', antiDumpingRisk: true, statutoryUnit: 'Number' },
          { code: '9405.42', description: 'Other electric luminaires and light fittings: Photovoltaic, designed for use with LED', defaultDuty: 3.9, dutyType: 'Ad-Valorem', statutoryUnit: 'Number' },
          { code: '9406.90', description: 'Prefabricated buildings of other materials (Modular housing units, Cleanrooms)', defaultDuty: 4.0, dutyType: 'Ad-Valorem', statutoryUnit: 'Number' },
        ],
      },
      {
        chapterCode: '95',
        title: 'Toys, Games and Sports Requisites; Parts and Accessories',
        description: 'Tricycles, dolls, video game consoles, gym equipment, tennis rackets, fishing tackle',
        averageMfnDuty: 0.0,
        commonSubheadings: [
          { code: '9504.50', description: 'Video game consoles and machines, other than coin-operated (PlayStation, Xbox, Switch)', defaultDuty: 0.0, dutyType: 'Duty-Free', statutoryUnit: 'Number', wcoSourceNotes: 'Duty-free under WTO ITA' },
          { code: '9506.91', description: 'Articles and equipment for general physical exercise, gymnastics or athletics (Treadmills, rowers)', defaultDuty: 4.0, dutyType: 'Ad-Valorem', statutoryUnit: 'Number' },
        ],
      },
    ],
  },

  // =========================================================================
  // SECTION XXI: WORKS OF ART, COLLECTORS' PIECES AND ANTIQUES (Chapter 97)
  // =========================================================================
  {
    id: 21,
    romanNumeral: 'Section XXI',
    title: 'Works of Art, Collectors’ Pieces & Antiques',
    shortTitle: 'Art & Antiques',
    chaptersRange: 'Chapter 97',
    chapters: [
      {
        chapterCode: '97',
        title: 'Works of Art, Collectors’ Pieces and Antiques',
        description: 'Paintings, drawings, original sculptures, postage stamps, collections of zoology, antiques > 100 years',
        averageMfnDuty: 0.0, // Duty-Free internationally under UNESCO Florence Agreement
        commonSubheadings: [
          { code: '9701.21', description: 'Paintings, drawings and pastels, executed entirely by hand (> 50 years old)', defaultDuty: 0.0, dutyType: 'Duty-Free', statutoryUnit: 'Number', wcoSourceNotes: 'Universal 0% customs duty under UNESCO Florence Agreement; cultural export permits needed' },
          { code: '9703.10', description: 'Original sculptures and statuary, in any material (> 50 years old)', defaultDuty: 0.0, dutyType: 'Duty-Free', statutoryUnit: 'Number' },
          { code: '9706.90', description: 'Antiques of an age exceeding 100 years, other than furniture', defaultDuty: 0.0, dutyType: 'Duty-Free', statutoryUnit: 'Number', wcoSourceNotes: 'Certified genuine antiques (> 100 yrs) qualify for duty-free entry and reduced VAT in many regimes' },
        ],
      },
    ],
  },
];
