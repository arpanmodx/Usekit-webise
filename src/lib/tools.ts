import { EXTRA_TOOLS } from './extraToolsData';
export { TOOL_COMPONENTS } from './toolLoaders';

export type CategorySlug =
  | 'calculators'
  | 'text-tools'
  | 'developer-tools'
  | 'image-tools'
  | 'pdf-tools'
  | 'security-internet'
  | 'color-design'
  | 'date-time'
  | 'seo-social'
  | 'random-everyday';

export interface CategoryDefinition {
  slug: CategorySlug;
  name: string;
  description: string;
  seoDescription: string;
  iconName: string;
}

export interface ToolFAQ {
  question: string;
  answer: string;
}

export interface ToolGuideSection {
  heading: string;
  paragraphs: string[];
}

export interface ToolDefinition {
  slug: string;
  name: string;
  category: string;
  categorySlug: CategorySlug;
  shortDescription: string;
  seoTitle: string;
  metaDescription: string;
  keywords: string[];
  iconName: string;
  dateAdded: string;
  isPopular?: boolean;
  isMostUsed?: boolean;
  isFileTool?: boolean;
  howTo: string[];
  faqs: ToolFAQ[];
  relatedSlugs: string[];
  guideSections: ToolGuideSection[];
}

export const CATEGORIES: CategoryDefinition[] = [
  {
    slug: 'calculators',
    name: 'Calculators',
    description: 'Financial, health, percentage, date, time, and unit conversion calculators.',
    seoDescription:
      'Free online calculators for finance, loans, EMI, GST, discounts, BMI, exact chronological age, time durations, and multi-unit conversions.',
    iconName: 'Calculator',
  },
  {
    slug: 'text-tools',
    name: 'Text Tools',
    description: 'Word counters, case converters, text cleaners, slug generators, and line utilities.',
    seoDescription:
      'Analyze, format, clean, and transform text instantly in your browser with word counters, case converters, duplicate line removers, and slug tools.',
    iconName: 'FileText',
  },
  {
    slug: 'developer-tools',
    name: 'Developer Tools',
    description: 'Formatters, minifiers, encoders, UUID generators, and regular expression testers.',
    seoDescription:
      'Essential web developer utilities: JSON formatter and validator, HTML/CSS/JS minifiers, Base64 and URL encoders, UUID v4 generator, and regex tester.',
    iconName: 'Code2',
  },
  {
    slug: 'image-tools',
    name: 'Image Tools',
    description: 'Client-side image compression, resizing, cropping, and format conversion.',
    seoDescription:
      'Compress, resize, crop, rotate, and convert JPG, PNG, WebP, and PDF images 100% locally in your browser without uploading files.',
    iconName: 'Image',
  },
  {
    slug: 'pdf-tools',
    name: 'PDF Tools',
    description: 'Merge, split, compress, rotate, extract pages, and convert PDF documents locally.',
    seoDescription:
      'Private, browser-based PDF tools to merge, split, optimize, rotate, extract pages, inspect metadata, and convert PDF pages to JPG images.',
    iconName: 'Files',
  },
  {
    slug: 'security-internet',
    name: 'Security & Internet',
    description: 'Password generators, strength analyzers, QR/barcode tools, and network inspectors.',
    seoDescription:
      'Generate cryptographic passwords, audit password entropy, create and scan QR codes and barcodes, parse URLs, and inspect IP and user-agent headers.',
    iconName: 'ShieldCheck',
  },
  {
    slug: 'color-design',
    name: 'Color & Design',
    description: 'Color pickers, HEX/RGB converters, CSS gradients, shadows, and border radius builders.',
    seoDescription:
      'Interactive CSS and color utilities for designers and frontend engineers: HEX to RGB converter, gradient maker, box-shadow builder, and radius generator.',
    iconName: 'Palette',
  },
  {
    slug: 'date-time',
    name: 'Date & Time',
    description: 'Precision stopwatch, countdown timers, world clock, time zone converter, and business days.',
    seoDescription:
      'Manage time across zones and schedules with an online stopwatch, interval timer, world clock, time zone converter, countdown, and business days calculator.',
    iconName: 'Clock',
  },
  {
    slug: 'seo-social',
    name: 'SEO & Social',
    description: 'Meta tag builders, Open Graph previews, robots.txt, sitemaps, and social copy templates.',
    seoDescription:
      'Rule-based technical SEO and social media utilities: meta tag generator and analyzer, Open Graph builder, robots.txt, XML sitemap, and structured templates.',
    iconName: 'Globe',
  },
  {
    slug: 'random-everyday',
    name: 'Random & Everyday',
    description: 'Random number and name pickers, coin flip, dice roller, binary converters, and number words.',
    seoDescription:
      'Everyday utilities and randomizers including cryptographic random number generator, name picker wheel/list, coin flipper, dice roller, and binary converters.',
    iconName: 'Sparkles',
  },
];

export const TOOLS: ToolDefinition[] = [
  // 1. Age Calculator
  {
    slug: 'age-calculator',
    name: 'Age Calculator',
    category: 'Calculators',
    categorySlug: 'calculators',
    shortDescription: 'Calculate exact chronological age in years, months, weeks, days, hours, and minutes.',
    seoTitle: 'Age Calculator — Calculate Exact Age in Years, Months & Days | UseKit',
    metaDescription:
      'Free online Age Calculator to find your exact chronological age in years, months, days, weeks, and hours from your date of birth, plus next birthday countdown.',
    keywords: ['age calculator', 'chronological age calculator', 'date of birth calculator', 'exact age in days', 'birthday countdown'],
    iconName: 'Calendar',
    dateAdded: '2025-01-10',
    isPopular: true,
    isMostUsed: true,
    howTo: [
      'Select or type your Date of Birth using the date input field.',
      'Optionally adjust the "Calculate Age As Of" date (defaults to today) to find your age on a past or future date.',
      'Review your exact age breakdown in years, months, and days, along with cumulative totals in weeks, days, hours, and minutes.',
      'Click "Copy Summary" or "Share Link" to save or share your exact calculation.',
    ],
    faqs: [
      {
        question: 'How does the Age Calculator handle leap years and February 29 birthdays?',
        answer:
          'Our chronological engine accounts for exact calendar month lengths (28, 29, 30, or 31 days) and every leap year between your birth date and the target date. In non-leap years, a February 29 birth date rolls cleanly to March 1 for full-year increments while preserving exact total day counts.',
      },
      {
        question: 'Can I calculate my age on a specific date in the future or past?',
        answer:
          'Yes. Change the "Age at the Date of" field from today to any past or future date. This is commonly used for verifying age eligibility for exams, retirement milestones, insurance policies, and sports categories.',
      },
      {
        question: 'Why do different age calculators sometimes differ by one day?',
        answer:
          'Some basic calculators divide total days by 365.25 instead of stepping through real calendar months. UseKit uses calendar-accurate month-by-month arithmetic so that someone born on March 15 is exactly 1 month old on April 15.',
      },
      {
        question: 'Does this tool store my birth date on a server?',
        answer:
          'No. All date calculations execute 100% locally inside your web browser. Your birth date is never transmitted to any server.',
      },
      {
        question: 'How is the next birthday countdown calculated?',
        answer:
          'The calculator determines your upcoming birthday anniversary in the current or following calendar year and computes the exact remaining months and days from the target date.',
      },
    ],
    relatedSlugs: ['date-difference-calculator', 'time-calculator', 'bmi-calculator', 'retirement-loan-calculator'.replace('retirement-', '')],
    guideSections: [
      {
        heading: 'How Chronological Age Calculation Works',
        paragraphs: [
          'Chronological age measures the exact elapsed calendar time between a person’s date of birth and a reference date. Because Gregorian calendar months vary in length—28 days in common Februaries, 29 days in leap-year Februaries, 30 days in April, June, September, and November, and 31 days in the remaining seven months—calculating exact years, months, and days requires calendar-aware date arithmetic rather than simple division.',
          'When you enter a birth date and a target date, UseKit first compares the day-of-month values. If the target day of the month is smaller than the birth day of the month, the algorithm borrows the exact number of days from the immediately preceding calendar month and decrements the month counter by one. Next, if the resulting month difference is negative, it borrows 12 months from the year difference. This matches legal, medical, and civil registration standards worldwide.',
        ],
      },
      {
        heading: 'Common Uses for Exact Age Verification',
        paragraphs: [
          'Government agencies, school admissions boards, civil service examinations, and financial institutions frequently require applicants to meet strict minimum or maximum age thresholds as of a specific cutoff date (for example, January 1 or August 31 of the application year). By setting the "Age at the Date of" input to the official cutoff date, you can immediately verify whether you meet the exact year, month, and day criteria.',
          'In pediatric healthcare and developmental assessments, practitioners also track chronological age in total weeks or total months to plot growth percentiles accurately. Alongside the standard years-months-days view, UseKit outputs total elapsed months, total weeks plus remainder days, total days, total hours, and total minutes.',
        ],
      },
    ],
  },

  // 2. BMI Calculator
  {
    slug: 'bmi-calculator',
    name: 'BMI Calculator',
    category: 'Calculators',
    categorySlug: 'calculators',
    shortDescription: 'Calculate Body Mass Index (BMI), healthy weight range, BMI Prime, and Ponderal Index.',
    seoTitle: 'BMI Calculator — Body Mass Index & Healthy Weight Range | UseKit',
    metaDescription:
      'Calculate your Body Mass Index (BMI) using Metric (kg/cm) or Imperial (lbs/ft/in) units. View WHO weight categories, ideal weight range, and BMI Prime.',
    keywords: ['bmi calculator', 'body mass index calculator', 'healthy weight range', 'bmi prime', 'metric and imperial bmi'],
    iconName: 'HeartPulse',
    dateAdded: '2025-01-10',
    isPopular: true,
    isMostUsed: true,
    howTo: [
      'Choose between Metric (kilograms and centimeters) or Imperial (pounds, feet, and inches) measurement units.',
      'Enter your current height and body weight in the labeled input fields.',
      'Instantly view your calculated BMI score, World Health Organization (WHO) classification, and healthy target weight span for your height.',
      'Check how many kilograms or pounds you are away from the normal BMI threshold (18.5 to 24.9 kg/m²) and copy your results if needed.',
    ],
    faqs: [
      {
        question: 'What is the mathematical formula for calculating BMI?',
        answer:
          'In metric units, BMI equals weight in kilograms divided by the square of height in meters: BMI = kg / m². In imperial units, BMI equals 703 multiplied by weight in pounds, divided by the square of height in inches: BMI = 703 × lbs / in².',
      },
      {
        question: 'What are the standard WHO BMI categories for adults?',
        answer:
          'According to the World Health Organization, a BMI under 18.5 is Underweight, 18.5 to 24.9 is Normal weight, 25.0 to 29.9 is Overweight, 30.0 to 34.9 is Class I Obesity, 35.0 to 39.9 is Class II Obesity, and 40.0 or higher is Class III Obesity.',
      },
      {
        question: 'What is BMI Prime and how is it interpreted?',
        answer:
          'BMI Prime is the ratio of your actual BMI to the upper limit of normal BMI (25.0). A BMI Prime below 0.74 indicates underweight, between 0.74 and 1.00 indicates normal weight, and above 1.00 indicates how many percentage points you are above the normal threshold (e.g., 1.12 means 12% above the upper normal limit).',
      },
      {
        question: 'What is the Ponderal Index and why is it included?',
        answer:
          'The Ponderal Index (PI = kg / m³) divides weight by the cube of height rather than the square. Because human bodies are three-dimensional, the Ponderal Index provides a fairer assessment for very tall or very short individuals where standard BMI can skew high or low.',
      },
      {
        question: 'Does BMI distinguish between muscle mass and body fat?',
        answer:
          'No. BMI is a screening metric based solely on height and total body mass. Strength athletes and muscular individuals may have a BMI above 25.0 despite having low body fat percentage.',
      },
    ],
    relatedSlugs: ['age-calculator', 'unit-converter', 'percentage-calculator', 'calorie-tip-calculator'.replace('calorie-', '')],
    guideSections: [
      {
        heading: 'Understanding Body Mass Index (BMI) and Healthy Weight Ranges',
        paragraphs: [
          'Body Mass Index (BMI), originally formulated as the Quetelet Index by Belgian mathematician Adolphe Quetelet in the 19th century, is the most widely adopted anthropometric screening metric for categorizing weight relative to height in adult men and women. By normalizing body mass against the square of stature (kg/m²), BMI provides a rapid, non-invasive reference point for population health and clinical triage.',
          'In addition to computing your exact BMI score, UseKit calculates the corresponding healthy weight window for your exact height by solving the inverse BMI equations for 18.5 kg/m² (lower normal boundary) and 24.9 kg/m² (upper normal boundary). If your current weight falls outside that span, the calculator displays the exact weight gain or reduction needed to reach the normal interval.',
        ],
      },
      {
        heading: 'Limitations of BMI and Complementary Metrics',
        paragraphs: [
          'While BMI correlates well with metabolic risk across broad populations, it measures excess weight rather than excess adipose tissue. It does not account for frame size, bone mineral density, sex-specific fat distribution, or lean skeletal muscle mass. Consequently, endurance or strength athletes frequently register in the overweight bracket while maintaining optimal cardiovascular markers.',
          'To offer better context, UseKit also computes BMI Prime—a dimensionless ratio comparing your BMI to the 25.0 upper normal cutoff—and the Ponderal Index (kg/m³), which scales cubically with height and reduces distortion at the extremes of human stature. Always treat BMI as an informational starting point alongside waist-to-height ratio and clinical guidance.',
        ],
      },
    ],
  },

  // 3. Percentage Calculator
  {
    slug: 'percentage-calculator',
    name: 'Percentage Calculator',
    category: 'Calculators',
    categorySlug: 'calculators',
    shortDescription: 'Calculate percentages, percentage of a number, percentage change, and markup/markdown.',
    seoTitle: 'Percentage Calculator — Find % of a Number & Percentage Change | UseKit',
    metaDescription:
      'All-in-one Percentage Calculator: find X% of Y, what percent X is of Y, percentage increase or decrease between two numbers, and add or subtract a percentage.',
    keywords: ['percentage calculator', 'percent change calculator', 'percentage increase calculator', 'what percent of', 'calculate percentage'],
    iconName: 'Percent',
    dateAdded: '2025-01-10',
    isPopular: true,
    isMostUsed: true,
    howTo: [
      'Select one of the four percentage modes at the top of the calculator or view all calculation modes.',
      'Enter your two numeric values (such as percentage rate and base value, or starting value and ending value).',
      'Read the instant result along with the exact mathematical equation used to derive the answer.',
      'Use the Copy button next to any result to copy the formatted number to your clipboard.',
    ],
    faqs: [
      {
        question: 'How do I calculate X percent of a number Y?',
        answer:
          'Convert the percentage X into a decimal by dividing by 100, then multiply by Y. The formula is Result = (X / 100) × Y. For example, 15% of 240 is (15 / 100) × 240 = 36.',
      },
      {
        question: 'How do I calculate percentage increase or decrease between two values?',
        answer:
          'Subtract the original value (V1) from the new value (V2), divide that difference by the absolute value of V1, and multiply by 100: ((V2 - V1) / |V1|) × 100. A positive result indicates a percentage increase; a negative result indicates a percentage decrease.',
      },
      {
        question: 'What is the difference between percentage change and percentage difference?',
        answer:
          'Percentage change measures directional growth or decline from a specific starting baseline ((New - Old) / Old × 100). Percentage difference compares two peer numbers without assuming one came first, dividing their absolute difference by their average: |A - B| / ((A + B) / 2) × 100.',
      },
      {
        question: 'Why does a 20% increase followed by a 20% decrease not return to the original number?',
        answer:
          'Because the second percentage applies to the new, larger base. Increasing 100 by 20% gives 120. Decreasing 120 by 20% subtracts 24 (which is 20% of 120), leaving 96—a net 4% reduction.',
      },
      {
        question: 'How do I find the original price before a percentage increase was added?',
        answer:
          'Divide the final number by (1 + Percentage / 100). Do not simply subtract the percentage from the final total. For example, if a bill is $115 after adding 15% tax, the pre-tax price is 115 / 1.15 = $100.',
      },
    ],
    relatedSlugs: ['discount-calculator', 'gst-calculator', 'profit-and-loss-calculator', 'tip-calculator'],
    guideSections: [
      {
        heading: 'Four Essential Percentage Formulas Explained',
        paragraphs: [
          'The word "percent" originates from the Latin per centum, meaning "by the hundred." A percentage is a dimensionless ratio expressed as a fraction of 100. In everyday finance, academic grading, retail shopping, and data analysis, almost every percentage question falls into one of four core algebraic patterns.',
          'First, finding a percentage of a quantity: (P / 100) × Base. Second, determining what percentage Part A represents of Whole B: (A / B) × 100. Third, measuring relative percentage change over time from an initial value V₁ to a final value V₂: ((V₂ − V₁) / |V₁|) × 100. Fourth, scaling a baseline number up or down by P percent: Base × (1 ± P / 100). UseKit provides dedicated, real-time calculators for all four operations along with step-by-step formula Substitution.',
        ],
      },
      {
        heading: 'Avoiding Common Percentage Traps in Finance and Retail',
        paragraphs: [
          'One of the most frequent numerical mistakes is confusing percentage points with relative percentage change. If a mortgage interest rate rises from 4.0% to 5.0%, it has increased by 1.0 percentage point, which represents a 25% relative increase ((5 − 4) / 4 × 100 = 25%).',
          'Another common pitfall occurs when reversing a percentage markup or tax. Because percentages compound multiplicatively rather than additively, reversing a +25% markup requires dividing by 1.25—equivalent to a 20% markdown from the final price, not 25%. Our calculator shows both the forward and inverse relationships clearly.',
        ],
      },
    ],
  },

  // 4. Discount Calculator
  {
    slug: 'discount-calculator',
    name: 'Discount Calculator',
    category: 'Calculators',
    categorySlug: 'calculators',
    shortDescription: 'Calculate sale price, total savings, stacked extra discounts, and sales tax.',
    seoTitle: 'Discount Calculator — Sale Price, Stacked Promo & Savings | UseKit',
    metaDescription:
      'Calculate final sale price and exact savings with our free Discount Calculator. Supports stacked promotional discounts (e.g. 30% off + extra 15% off) and sales tax.',
    keywords: ['discount calculator', 'sale price calculator', 'percent off calculator', 'double discount calculator', 'stacked discount'],
    iconName: 'Tag',
    dateAdded: '2025-01-10',
    isPopular: true,
    howTo: [
      'Enter the Original Price of the item before any markdowns.',
      'Enter the primary Discount Percentage (for example, 25 for 25% off).',
      'Optionally enter an Additional Stacked Discount % (such as an extra 10% coupon applied at checkout) and local Sales Tax %.',
      'View the final payable price, total dollar/currency savings, and the true combined effective discount rate.',
    ],
    faqs: [
      {
        question: 'How do stacked discounts (e.g., 40% off plus an extra 20% off) work?',
        answer:
          'Retailers apply stacked discounts sequentially, not by adding the percentages together. First, 40% is deducted from the original price (leaving 60%). Then the extra 20% is taken off that reduced 60% subtotal (20% of 60% = 12%), resulting in a combined effective discount of 52% off—not 60% off.',
      },
      {
        question: 'Does it matter whether sales tax is applied before or after a percentage discount?',
        answer:
          'Mathematically, multiplication is commutative: applying a 20% discount and then adding 8% tax (Price × 0.80 × 1.08) produces the exact same final total as adding 8% tax and discounting the taxed total by 20%. However, retail receipts always compute tax on the post-discount subtotal.',
      },
      {
        question: 'How do I calculate the effective discount percentage from a flat coupon?',
        answer:
          'Divide the total amount saved by the original list price and multiply by 100. For example, saving $18 on a $72 jacket equals an effective discount of (18 / 72) × 100 = 25%.',
      },
      {
        question: 'Can I calculate "Buy X Get Y" effective discounts?',
        answer:
          'Yes! Under standard retail pricing for identical items, "Buy 1 Get 1 Free" equals 50% off two items, "Buy 2 Get 1 Free" equals 33.33% off three items, and "Buy 1 Get 1 50% Off" equals 25% off two items.',
      },
      {
        question: 'Are currency symbols locked to USD?',
        answer:
          'No. The mathematical ratios work identically for any decimal currency (USD, EUR, GBP, INR, CAD, AUD, etc.).',
      },
    ],
    relatedSlugs: ['percentage-calculator', 'gst-calculator', 'profit-and-loss-calculator', 'tip-calculator'],
    guideSections: [
      {
        heading: 'How Single and Stacked Retail Discounts Are Calculated',
        paragraphs: [
          'During seasonal promotions, clearance events, and e-commerce flash sales, shoppers frequently encounter layered offers such as "Take 30% off storewide plus an extra 15% off with promo code." Many buyers instinctively add 30% + 15% and expect a 45% reduction. In reality, the second promotional code applies only to the already discounted balance.',
          'Using the formula Final Subtotal = Original Price × (1 − d₁/100) × (1 − d₂/100), a $100 item with 30% off drops to $70. Applying an extra 15% coupon deducts $10.50 (15% of $70), bringing the net price to $59.50. The true combined effective discount is 40.5%, and UseKit shows both the step-by-step markdown and your true effective savings percentage.',
        ],
      },
      {
        heading: 'Accounting for Sales Tax on Discounted Purchases',
        paragraphs: [
          'When budgeting for high-ticket purchases like electronics, appliances, or furniture, overlooking regional sales tax or VAT can make a discounted item exceed your budget. By entering your local sales tax percentage into the optional tax field, our Discount Calculator computes the exact tax amount levied on the discounted net subtotal and displays your true out-of-door checkout price.',
        ],
      },
    ],
  },

  // 5. GST Calculator
  {
    slug: 'gst-calculator',
    name: 'GST Calculator',
    category: 'Calculators',
    categorySlug: 'calculators',
    shortDescription: 'Add or remove GST (Inclusive & Exclusive) with CGST, SGST, and IGST tax breakdowns.',
    seoTitle: 'GST Calculator — Inclusive & Exclusive GST, CGST & SGST | UseKit',
    metaDescription:
      'Free online GST Calculator to add GST to net prices (Exclusive) or extract GST from gross MRP prices (Inclusive). Shows CGST, SGST, and IGST splits.',
    keywords: ['gst calculator', 'inclusive gst calculator', 'reverse gst calculator', 'cgst sgst calculator', 'add or remove gst'],
    iconName: 'Receipt',
    dateAdded: '2025-01-10',
    isPopular: true,
    howTo: [
      'Choose "GST Exclusive (Add GST)" if you have a pre-tax net price, or "GST Inclusive (Remove GST)" if you have a tax-included gross invoice total.',
      'Enter the base or gross amount in the Amount field.',
      'Select a standard GST rate preset (3%, 5%, 12%, 18%, 28%) or enter a custom tax rate (e.g., 10% for Australia or 15% for New Zealand).',
      'Inspect the Net Pre-Tax Price, Total GST Amount, split CGST/SGST components (50% each for intra-state supply), and Total Gross Invoice value.',
    ],
    faqs: [
      {
        question: 'How do you remove GST from a GST-inclusive price (Reverse GST formula)?',
        answer:
          'To find the pre-tax net price from a GST-inclusive total, divide the gross amount by (1 + GST Rate / 100). Do not subtract the percentage directly from the gross amount. For example, for ₹1,180 inclusive of 18% GST, Net Price = 1180 / 1.18 = ₹1,000, and GST = ₹180.',
      },
      {
        question: 'What is the difference between CGST, SGST, and IGST?',
        answer:
          'In dual-GST systems like India, intra-state transactions split the total GST equally between Central GST (CGST) and State GST (SGST)—for example, an 18% slab splits into 9% CGST + 9% SGST. Inter-state transactions and imports levy the full rate as a single Integrated GST (IGST of 18%).',
      },
      {
        question: 'Can I use this GST Calculator for Australian, Canadian, Singaporean, or New Zealand GST?',
        answer:
          'Yes. Simply choose "Custom Rate" and enter 10% (Australia), 5% (Canada federal GST), 9% (Singapore), or 15% (New Zealand). The inclusive and exclusive tax formulas are mathematically identical worldwide.',
      },
      {
        question: 'What are the standard GST tax slabs?',
        answer:
          'Common standard GST brackets include 0% (essential unbranded goods), 3% (gold and precious metals), 5% (household necessities and transport), 12% (processed foods and business class airfare), 18% (most IT services, electronics, and B2B services), and 28% (luxury goods and automobiles).',
      },
      {
        question: 'Why is subtracting 18% from a gross invoice incorrect when extracting GST?',
        answer:
          'Because the gross invoice equals 118% of the original net price, not 100%. The tax portion represents 18 / 118 (approx. 15.254%) of the gross amount, whereas subtracting 18% directly overstates the tax and understates the net revenue.',
      },
    ],
    relatedSlugs: ['percentage-calculator', 'discount-calculator', 'profit-and-loss-calculator', 'salary-calculator'],
    guideSections: [
      {
        heading: 'GST Exclusive vs. GST Inclusive Calculations',
        paragraphs: [
          'Goods and Services Tax (GST) is a multi-stage, destination-based value-added tax levied on the supply of goods and services. Businesses, freelancers, and consumers regularly need to perform two distinct calculations: adding GST to a wholesale or service quote (GST Exclusive), and extracting the embedded tax component from a retail Maximum Retail Price or gross receipt (GST Inclusive).',
          'For GST Exclusive pricing, the calculation is straightforward: GST Amount = Net Price × (Rate / 100), and Gross Price = Net Price + GST Amount. For GST Inclusive pricing, the gross price already includes the tax percentage, so you must divide by (1 + Rate / 100) to isolate the true base value: Net Price = Gross Price / (1 + Rate / 100), and GST Amount = Gross Price − Net Price.',
        ],
      },
      {
        heading: 'Invoicing Compliance with CGST, SGST, and IGST Splits',
        paragraphs: [
          'When preparing tax-compliant B2B or B2C invoices, showing the exact split between central and state tax components prevents reconciliation mismatches during tax filing. Whenever you compute a rate in UseKit, the results table automatically displays the full IGST figure alongside the 50/50 CGST and SGST breakdown rounded to two decimal places.',
        ],
      },
    ],
  },

  // 6. EMI Calculator
  {
    slug: 'emi-calculator',
    name: 'EMI Calculator',
    category: 'Calculators',
    categorySlug: 'calculators',
    shortDescription: 'Calculate monthly loan EMI, total interest cost, and yearly/monthly amortization schedule.',
    seoTitle: 'EMI Calculator — Home, Car & Personal Loan Monthly EMI | UseKit',
    metaDescription:
      'Calculate Equated Monthly Installment (EMI) for home loans, car loans, and personal loans. View principal vs. interest split and download full amortization schedule.',
    keywords: ['emi calculator', 'loan emi calculator', 'home loan emi', 'car loan emi calculator', 'amortization schedule'],
    iconName: 'Landmark',
    dateAdded: '2025-01-10',
    isPopular: true,
    isMostUsed: true,
    howTo: [
      'Enter the Loan Principal Amount you plan to borrow.',
      'Input the Annual Interest Rate (%) offered by your bank or lender.',
      'Enter the Loan Tenure and toggle between Years or Months.',
      'Review your exact Monthly EMI, Total Interest Payable, Total Repayment, and inspect or download the complete Amortization Schedule table.',
    ],
    faqs: [
      {
        question: 'What is the standard mathematical formula for calculating Loan EMI?',
        answer:
          'The standard reducing-balance EMI formula is EMI = P × r × (1 + r)^n / ((1 + r)^n − 1), where P is the loan principal, r is the monthly interest rate (Annual Rate / 12 / 100), and n is the total number of monthly installments.',
      },
      {
        question: 'Why does most of my EMI go toward interest in the early years of a loan?',
        answer:
          'Under reducing-balance amortization, interest each month is calculated on the remaining unpaid principal balance. Because your outstanding balance is highest at the start of the loan, the interest portion is largest in early installments and gradually decreases as principal is paid down.',
      },
      {
        question: 'How does shortening loan tenure affect EMI and total interest?',
        answer:
          'Shortening your loan tenure increases your monthly EMI payment but drastically reduces total cumulative interest paid over the life of the loan because the principal compounds over fewer months.',
      },
      {
        question: 'What happens if the interest rate is 0% (Zero-Cost EMI)?',
        answer:
          'When the interest rate is 0%, our calculator automatically switches to linear division (Principal / Total Months), showing zero interest cost and equal principal deductions each month.',
      },
      {
        question: 'Can I export the amortization schedule to a spreadsheet?',
        answer:
          'Yes. Click the "Download CSV Schedule" button above the amortization table to export every period’s opening balance, EMI, principal paid, interest paid, and closing balance.',
      },
    ],
    relatedSlugs: ['loan-calculator', 'compound-interest-calculator', 'simple-interest-calculator', 'salary-calculator'],
    guideSections: [
      {
        heading: 'How Equated Monthly Installments (EMI) Work',
        paragraphs: [
          'An Equated Monthly Installment (EMI) is a fixed monthly payment a borrower makes to a lender on a specified calendar date each month to pay off both principal and accrued interest over a predetermined tenure. By keeping the monthly cash outflow constant, reducing-balance EMI loans allow households and businesses to budget predictably for mortgages, auto financing, education loans, and personal credit lines.',
          'Internally, every EMI payment consists of two shifting components: interest accrued on the unpaid principal balance for that month (Outstanding Principal × Annual Rate / 12), and principal repayment (EMI − Monthly Interest). With each passing month, the outstanding principal shrinks slightly, causing the next month’s interest charge to drop and the principal repayment portion to grow.',
        ],
      },
      {
        heading: 'Using the Amortization Table to Plan Loan Repayment',
        paragraphs: [
          'Comparing loans solely by their monthly EMI can hide the true cost of borrowing. A 20-year mortgage and a 30-year mortgage may differ by only a modest monthly amount while differing by tens of thousands in cumulative interest. UseKit provides a visual principal-versus-interest bar alongside a complete yearly and monthly amortization ledger so you can see exactly when you cross the 50% equity milestone.',
        ],
      },
    ],
  },

  // 7. Loan Calculator
  {
    slug: 'loan-calculator',
    name: 'Loan Calculator',
    category: 'Calculators',
    categorySlug: 'calculators',
    shortDescription: 'Compare loan payment, maximum borrowing affordability, and extra prepayment savings.',
    seoTitle: 'Loan Calculator — Affordability, Payoff & Extra Payment Savings | UseKit',
    metaDescription:
      'Advanced Loan Calculator with 3 modes: Monthly Payment, Max Loan Affordability from target budget, and Prepayment Payoff Calculator showing interest & time saved.',
    keywords: ['loan calculator', 'loan payoff calculator', 'early loan payoff calculator', 'how much can i borrow', 'extra payment calculator'],
    iconName: 'Wallet',
    dateAdded: '2025-01-10',
    isPopular: true,
    howTo: [
      'Select your calculation goal: "Monthly Payment & Payoff", "Max Loan Affordability" (reverse solve principal from monthly budget), or "Extra Prepayment Impact".',
      'Enter your loan amount (or target monthly payment), annual interest rate, and loan term.',
      'Optionally add a recurring Extra Monthly Prepayment to see how much faster your loan will be paid off.',
      'Compare standard vs. accelerated payoff timelines, months saved, and total interest saved.',
    ],
    faqs: [
      {
        question: 'How is this Loan Calculator different from a basic EMI Calculator?',
        answer:
          'While our EMI Calculator focuses on standard installment schedules, the Loan Calculator includes reverse affordability solving (finding the maximum loan principal you can afford for a given monthly budget) and an Extra Monthly Prepayment engine that calculates exact months shaved off your loan and total interest saved.',
      },
      {
        question: 'How much interest can a small extra monthly payment save?',
        answer:
          'Because 100% of an extra principal payment goes directly toward reducing your unpaid principal balance, it prevents that amount from compounding for the remainder of the loan term. Even adding 10% to your monthly payment on a long-term loan can cut years off your payoff date.',
      },
      {
        question: 'How is maximum loan affordability calculated from a monthly payment?',
        answer:
          'We rearrange the standard annuity equation to solve for Principal: P = Payment × ((1 + r)^n − 1) / (r × (1 + r)^n), where r is the monthly interest rate and n is the number of months.',
      },
      {
        question: 'Does this calculator include origination fees or APR estimation?',
        answer:
          'Yes. You can enter an optional Upfront Processing / Origination Fee (%) to see your net disbursed proceeds and true effective cost of borrowing.',
      },
      {
        question: 'Should I check for prepayment penalties before making extra payments?',
        answer:
          'Always verify your loan agreement. Most federal student loans, credit union loans, and floating-rate mortgages allow penalty-free principal prepayments, while some fixed-rate commercial or auto loans may charge a small fee.',
      },
    ],
    relatedSlugs: ['emi-calculator', 'compound-interest-calculator', 'simple-interest-calculator', 'percentage-calculator'],
    guideSections: [
      {
        heading: 'Three Ways to Analyze Any Consumer or Business Loan',
        paragraphs: [
          'Borrowers typically approach a loan decision with one of three questions: (1) "If I borrow $X at Y% for Z years, what will my payment and total cost be?", (2) "I can comfortably afford $M per month—what is the maximum loan principal I can qualify for?", or (3) "If I pay an extra $E every month toward principal, how many months sooner will I be debt-free?"',
          'UseKit unifies all three financial models into a single interactive workbench. By toggling between Payment Mode and Affordability Mode, or by entering an Extra Monthly Prepayment amount, you can stress-test interest rate changes and see the exact dollar impact of accelerated principal reduction.',
        ],
      },
      {
        heading: 'The Mathematics of Principal Prepayment',
        paragraphs: [
          'In a standard amortized loan, your required monthly payment is fixed, and the interest charge for month t equals Balance(t−1) × (Annual Rate / 12). When you contribute an extra principal payment, Balance(t) drops immediately by that exact extra amount. In month t+1, the lender calculates interest on a smaller principal base, meaning a larger share of your regular required payment also goes toward principal—creating a snowball effect that accelerates debt payoff.',
        ],
      },
    ],
  },

  // 8. Simple Interest Calculator
  {
    slug: 'simple-interest-calculator',
    name: 'Simple Interest Calculator',
    category: 'Calculators',
    categorySlug: 'calculators',
    shortDescription: 'Calculate non-compounding simple interest (SI = P × R × T / 100) for days, months, or years.',
    seoTitle: 'Simple Interest Calculator — Calculate SI for Days, Months & Years | UseKit',
    metaDescription:
      'Free Simple Interest Calculator using I = P × R × T / 100. Calculate interest and total maturity value for any principal, annual rate, and time in days, months, or years.',
    keywords: ['simple interest calculator', 'si calculator', 'p r t calculator', 'non compounding interest', 'promissory note interest'],
    iconName: 'TrendingUp',
    dateAdded: '2025-01-10',
    howTo: [
      'Enter the initial Principal Amount (P).',
      'Enter the Annual Rate of Interest (R) as a percentage.',
      'Input the Time Period (T) and choose whether the duration is measured in Years, Months, or Days (365-day convention).',
      'View the calculated Simple Interest (SI), Total Maturity Value (P + SI), and monthly/daily accrual equivalents.',
    ],
    faqs: [
      {
        question: 'What is the formula for Simple Interest?',
        answer:
          'Simple Interest is calculated using the formula SI = (P × R × T) / 100, where P is the initial principal, R is the annual interest rate in percent, and T is the time in years. Total Maturity Amount = P + SI.',
      },
      {
        question: 'How is Simple Interest calculated when time is given in months or days?',
        answer:
          'When time is entered in months, T is converted to years by dividing by 12 (T = Months / 12). When time is entered in days, T is converted using the standard 365-day year convention (T = Days / 365).',
      },
      {
        question: 'Where is Simple Interest used in real life?',
        answer:
          'Simple interest is widely used for short-term personal promissory notes, Treasury bills, certain auto loans, bridge loans, security deposit interest statutes, and court-ordered judgment interest calculations.',
      },
      {
        question: 'Why is Simple Interest lower than Compound Interest over multiple years?',
        answer:
          'Simple interest only ever calculates interest on the original principal amount. Compound interest calculates interest on both the original principal and previously accumulated interest ("interest on interest").',
      },
      {
        question: 'Can I solve for the required rate or principal?',
        answer:
          'The results panel displays the exact linear accrual per year, per month, and per day, allowing you to scale principal or time proportionally.',
      },
    ],
    relatedSlugs: ['compound-interest-calculator', 'emi-calculator', 'loan-calculator', 'percentage-calculator'],
    guideSections: [
      {
        heading: 'How Simple Interest Accrues Linearly Over Time',
        paragraphs: [
          'Simple interest is the most transparent method of calculating the cost of borrowing or the return on a fixed principal sum. Unlike compound interest—where unpaid interest is periodically added back to the principal balance—simple interest grows strictly in a straight line. Every year, month, or day generates the exact same interest amount based solely on the starting principal.',
          'Because the formula SI = (P × R × T) / 100 requires the rate R and time T to share the same time unit (typically annual), converting partial periods is essential. For a 9-month note, T equals 9 / 12 = 0.75 years. For a 90-day commercial note, T equals 90 / 365 ≈ 0.246575 years. UseKit handles these unit conversions automatically and displays the step-by-step substitution.',
        ],
      },
      {
        heading: 'When to Use Simple Interest vs. Compound Interest',
        paragraphs: [
          'Legal contracts, private family loans, invoice late-payment penalties, and government bonds that pay out coupons without reinvestment rely on simple interest rules. If you are evaluating a savings account, certificate of deposit, or multi-year investment portfolio where returns are reinvested, switch to our Compound Interest Calculator to model exponential growth.',
        ],
      },
    ],
  },

  // 9. Compound Interest Calculator
  {
    slug: 'compound-interest-calculator',
    name: 'Compound Interest Calculator',
    category: 'Calculators',
    categorySlug: 'calculators',
    shortDescription: 'Calculate compound interest growth with recurring contributions and year-by-year breakdown.',
    seoTitle: 'Compound Interest Calculator — Daily, Monthly & Annual Growth | UseKit',
    metaDescription:
      'Calculate compound interest and investment growth with optional monthly contributions. Compare daily, monthly, quarterly, and annual compounding frequencies.',
    keywords: ['compound interest calculator', 'investment growth calculator', 'apy calculator', 'compounding frequency', 'savings calculator'],
    iconName: 'LineChart',
    dateAdded: '2025-01-10',
    isPopular: true,
    isMostUsed: true,
    howTo: [
      'Enter your Initial Principal Deposit (starting investment or loan balance).',
      'Optionally enter a Monthly Contribution amount if you plan to add savings each month.',
      'Set the Annual Interest Rate (%), Time Horizon in years, and Compounding Frequency (Monthly, Quarterly, Annually, Semi-Annually, or Daily).',
      'Inspect the Future Maturity Value, Total Contributions, Total Compound Interest Earned, Effective Annual Yield (APY), and the year-by-year table.',
    ],
    faqs: [
      {
        question: 'What is the mathematical formula for Compound Interest?',
        answer:
          'For a lump-sum principal P compounded n times per year at annual decimal rate r for t years, the future value is A = P × (1 + r/n)^(n×t). When recurring monthly contributions PMT are included, the future value of the annuity series is added to the compounded principal.',
      },
      {
        question: 'How much difference does compounding frequency (monthly vs. annually) make?',
        answer:
          'More frequent compounding credits interest to your balance sooner so it starts earning interest of its own earlier in the year. For example, a 10% nominal rate compounded annually yields 10.00% APY, compounded monthly yields 10.47% APY, and compounded daily yields 10.52% APY.',
      },
      {
        question: 'What is Effective Annual Yield (APY / EAR)?',
        answer:
          'Effective Annual Percentage Yield (APY) is the actual annual rate of return after accounting for intra-year compounding: APY = (1 + r/n)^n − 1. UseKit calculates and displays the exact APY for your chosen compounding frequency.',
      },
      {
        question: 'What is the Rule of 72?',
        answer:
          'The Rule of 72 is a mental math shortcut to estimate how many years it takes for a lump-sum investment to double: divide 72 by the annual return percentage. At 8% annual return, money doubles in approximately 72 / 8 = 9 years.',
      },
      {
        question: 'Can I set Initial Principal to 0 and calculate pure monthly SIP/recurring savings?',
        answer:
          'Yes. Setting Initial Principal to 0 and entering a Monthly Contribution calculates the exact future value of a recurring monthly investment or Systematic Investment Plan (SIP).',
      },
    ],
    relatedSlugs: ['simple-interest-calculator', 'emi-calculator', 'loan-calculator', 'percentage-calculator'],
    guideSections: [
      {
        heading: 'How Compound Interest Builds Exponential Growth',
        paragraphs: [
          'Compound interest occurs when the interest earned on a principal balance is reinvested so that in subsequent periods, interest is earned on both the original capital and the accumulated interest from prior periods. Over short horizons of one or two years, simple and compound interest produce similar figures; over 10, 20, or 30 years, compounding creates an exponential curve where accumulated interest frequently exceeds total out-of-pocket contributions.',
          'Our Compound Interest Calculator combines lump-sum compounding with optional monthly contributions, simulating real-world high-yield savings accounts, index fund portfolios, and retirement plans. It also computes the exact Effective Annual Rate (APY) and compares your compounded outcome against what the same principal would have earned under simple interest.',
        ],
      },
      {
        heading: 'Reading the Year-by-Year Compounding Schedule',
        paragraphs: [
          'Beneath the summary cards, the interactive Year-by-Year Growth Schedule displays each year’s cumulative deposits, yearly interest earned, cumulative interest earned, and ending portfolio balance. You can export this schedule or share a pre-filled link with colleagues or clients.',
        ],
      },
    ],
  },

  // 10. Profit and Loss Calculator
  {
    slug: 'profit-and-loss-calculator',
    name: 'Profit and Loss Calculator',
    category: 'Calculators',
    categorySlug: 'calculators',
    shortDescription: 'Calculate net profit, loss, markup percentage, gross profit margin, and break-even metrics.',
    seoTitle: 'Profit and Loss Calculator — Profit %, Margin & Markup | UseKit',
    metaDescription:
      'Calculate net profit or loss, profit percentage on cost (markup), gross profit margin on revenue, and unit economics with our free Profit and Loss Calculator.',
    keywords: ['profit and loss calculator', 'margin vs markup calculator', 'profit percentage calculator', 'cost price selling price', 'gross margin calculator'],
    iconName: 'BadgeDollarSign',
    dateAdded: '2025-01-10',
    howTo: [
      'Enter the Cost Price (CP) per unit and the Selling Price (SP) per unit.',
      'Enter the Quantity of units sold (defaults to 1) and any additional Operating/Shipping Expenses.',
      'Instantly view whether the transaction generates a Net Profit, Net Loss, or Break-Even result.',
      'Compare Markup % (profit relative to total cost) against Gross Margin % (profit relative to total revenue).',
    ],
    faqs: [
      {
        question: 'What is the difference between Profit Percentage (Markup) and Gross Profit Margin?',
        answer:
          'Profit Percentage (Markup) divides profit by total Cost Price: (Profit / Cost) × 100. Gross Profit Margin divides profit by total Selling Revenue: (Profit / Revenue) × 100. For example, buying an item for $50 and selling it for $100 gives a $50 profit, which is a 100% Markup on cost but a 50% Gross Margin on revenue.',
      },
      {
        question: 'How are Profit and Loss formulas defined in accounting and exams?',
        answer:
          'Profit = Selling Price (SP) − Total Cost Price (CP) when SP > CP. Loss = Total Cost Price (CP) − Selling Price (SP) when CP > SP. Profit % = (Profit / CP) × 100, and Loss % = (Loss / CP) × 100.',
      },
      {
        question: 'How do I calculate the Selling Price needed to achieve a target Gross Margin?',
        answer:
          'Divide the unit Cost Price by (1 − Target Margin / 100). For example, to achieve a 40% gross margin on an item that costs $60, the selling price must be $60 / (1 − 0.40) = $100.',
      },
      {
        question: 'Can I include shipping, packaging, or platform fees in the calculation?',
        answer:
          'Yes. Enter any overhead, fulfillment, or marketplace fees in the "Additional Expenses" field to compute true Net Profit after expenses.',
      },
      {
        question: 'Why can Gross Margin never reach 100% if Cost Price is greater than zero?',
        answer:
          'Because Gross Margin is (Revenue − Cost) / Revenue. As long as Cost is greater than zero, the numerator is strictly smaller than Revenue, whereas Markup ((Revenue − Cost) / Cost) can exceed 100%, 200%, or more.',
      },
    ],
    relatedSlugs: ['percentage-calculator', 'discount-calculator', 'gst-calculator', 'salary-calculator'],
    guideSections: [
      {
        heading: 'Mastering Cost Price, Selling Price, Markup, and Margin',
        paragraphs: [
          'Whether you are pricing e-commerce inventory, quoting freelance project rates, or solving commercial arithmetic problems, understanding the relationship between Cost Price (CP), Selling Price (SP), Markup, and Gross Margin is essential for profitability. Many small business owners accidentally price products using markup when they intended to achieve a specific gross margin, leaving their business short of cash to cover operating overhead.',
          'UseKit calculates both ratios simultaneously: Profit / Loss Percentage on Cost ((Net Profit / Total Cost) × 100) and Gross Margin Percentage on Revenue ((Net Profit / Total Revenue) × 100), across single units or multi-unit batches with additional operating costs.',
        ],
      },
      {
        heading: 'Target Pricing Reference Table',
        paragraphs: [
          'In addition to analyzing your current Cost and Selling Price, the calculator automatically generates a quick reference table showing the exact Selling Price required to hit 15%, 20%, 25%, 30%, 40%, and 50% gross margins for your entered unit cost.',
        ],
      },
    ],
  },

  // 11. Salary Calculator
  {
    slug: 'salary-calculator',
    name: 'Salary Calculator',
    category: 'Calculators',
    categorySlug: 'calculators',
    shortDescription: 'Convert between hourly, daily, weekly, bi-weekly, monthly, and annual salary with tax deductions.',
    seoTitle: 'Salary Calculator — Hourly to Annual Pay & Take-Home Converter | UseKit',
    metaDescription:
      'Convert your pay rate across hourly, daily, weekly, bi-weekly, semi-monthly, monthly, and annual salary. Adjust for hours per week, paid/unpaid holidays, and taxes.',
    keywords: ['salary calculator', 'hourly to salary calculator', 'annual to hourly pay', 'biweekly pay calculator', 'take home pay estimator'],
    iconName: 'Briefcase',
    dateAdded: '2025-01-10',
    isPopular: true,
    howTo: [
      'Enter your pay amount and select its frequency (Annual, Monthly, Bi-Weekly, Weekly, Daily, or Hourly).',
      'Confirm or adjust your Hours Worked per Week (default 40) and Days Worked per Week (default 5).',
      'Optionally enter Unpaid Vacation/Holidays per year and an Estimated Effective Tax & Deduction Rate (%).',
      'Compare Unadjusted, Holiday-Adjusted, and Net Take-Home Pay across all 7 pay frequencies side by side.',
    ],
    faqs: [
      {
        question: 'How many working hours are in a standard full-time year?',
        answer:
          'A standard full-time work year at 40 hours per week across 52 weeks equals 2,080 working hours (260 working days). Therefore, a $50/hour rate equals $104,000 per year before unpaid time off.',
      },
      {
        question: 'What is the difference between Bi-Weekly and Semi-Monthly paychecks?',
        answer:
          'Bi-Weekly pay runs every two weeks (typically every other Friday), resulting in 26 paychecks per year. Semi-Monthly pay runs twice a month on fixed dates (such as the 1st and 15th), resulting in 24 paychecks per year. Each Semi-Monthly paycheck is slightly larger than a Bi-Weekly paycheck for the same annual salary.',
      },
      {
        question: 'How do unpaid holidays and vacation days affect annual earnings?',
        answer:
          'For hourly contractors and freelancers without paid time off (PTO), taking 15 days of holidays and vacation reduces billable days from 260 to 245 per year (1,960 hours instead of 2,080). UseKit shows both the unadjusted 52-week baseline and the PTO-adjusted figure.',
      },
      {
        question: 'How do I convert an annual salary into an hourly rate?',
        answer:
          'Divide your annual gross salary by (Hours per Week × 52). For a 40-hour workweek, divide Annual Salary by 2,080.',
      },
      {
        question: 'How does the Effective Tax & Deduction % field work?',
        answer:
          'Because tax brackets vary by country, state, and filing status, you can input your combined effective deduction percentage (income tax + payroll tax + retirement contribution) to see your exact Net Take-Home paycheck for every pay frequency.',
      },
    ],
    relatedSlugs: ['percentage-calculator', 'emi-calculator', 'gst-calculator', 'profit-and-loss-calculator'],
    guideSections: [
      {
        heading: 'Converting Hourly Wage to Annual Salary and Paycheck Intervals',
        paragraphs: [
          'Comparing job offers or freelance consulting contracts often requires translating between hourly billing rates, bi-weekly paychecks, monthly retainers, and annual base salaries. While multiplying a weekly rate by 4 gives a rough approximation of a month, an actual calendar year contains 52 weeks (or 4.333 weeks per month on average), meaning a simple 4-week multiplier understates annual income by full four weeks of pay.',
          'UseKit normalizes any input pay rate into an exact annual baseline using your specified weekly hours and workdays, then divides that annual figure accurately across Annual (1×), Monthly (12×), Semi-Monthly (24×), Bi-Weekly (26×), Weekly (52×), Daily (52 × Days/Week), and Hourly (52 × Hours/Week) schedules.',
        ],
      },
      {
        heading: 'Freelancer Billable Hours vs. Salaried W-2 / Full-Time Employment',
        paragraphs: [
          'Independent contractors and hourly consultants only earn income for hours actually billed. By entering your expected unpaid holidays and vacation days per year alongside your estimated effective tax rate, you can immediately see your true adjusted annual and monthly net income.',
        ],
      },
    ],
  },

  // 12. Tip Calculator
  {
    slug: 'tip-calculator',
    name: 'Tip Calculator',
    category: 'Calculators',
    categorySlug: 'calculators',
    shortDescription: 'Calculate restaurant tips, exclude sales tax if desired, and split bills evenly among guests.',
    seoTitle: 'Tip Calculator — Fast Bill Splitter & Gratuity Calculator | UseKit',
    metaDescription:
      'Calculate restaurant gratuity and split the bill evenly across any number of people. Includes quick tip presets (10% to 25%), pre-tax tipping option, and per-person rounding.',
    keywords: ['tip calculator', 'bill splitter', 'restaurant gratuity calculator', 'split bill with tip', 'tip per person'],
    iconName: 'Utensils',
    dateAdded: '2025-01-10',
    howTo: [
      'Enter the Pre-Tax Bill Subtotal (and optional Sales Tax amount if you want to tip on the pre-tax amount while splitting the full taxed bill).',
      'Select a quick Tip Percentage button (10%, 15%, 18%, 20%, 25%) or enter any custom percentage.',
      'Set the Number of People splitting the bill (1 or more).',
      'Review the Total Tip, Grand Total, Tip per Person, and Total per Person—plus side-by-side comparison for 15%, 18%, 20%, and 22% tips.',
    ],
    faqs: [
      {
        question: 'Should you calculate restaurant tips on the pre-tax subtotal or the post-tax total?',
        answer:
          'Etiquette experts specify that gratuity is calculated on the pre-tax food and beverage subtotal rather than tipping on government sales tax. UseKit lets you enter the pre-tax bill and optional tax amount separately so the tip is computed strictly on the pre-tax subtotal while the final bill split includes the tax.',
      },
      {
        question: 'What are standard tipping percentages for dining and services?',
        answer:
          'In North America, 15% is standard for average sit-down service, 18% to 20% for good to excellent service, 22% to 25% for exceptional service or large groups, and 10% for buffet or counter pickup.',
      },
      {
        question: 'How does splitting the bill across multiple people handle odd cents?',
        answer:
          'Our calculator displays both the exact two-decimal share per person and an optional rounded-up whole dollar figure per person so groups paying in cash can settle the check cleanly.',
      },
      {
        question: 'Does the calculator show a quick comparison table of different tip rates?',
        answer:
          'Yes. Beneath the primary result, a reference table automatically shows the exact tip and per-person total for 10%, 15%, 18%, 20%, 22%, and 25% so you can compare at a glance.',
      },
    ],
    relatedSlugs: ['percentage-calculator', 'discount-calculator', 'gst-calculator', 'unit-converter'],
    guideSections: [
      {
        heading: 'How to Calculate Gratuity and Split Group Dining Bills Fairly',
        paragraphs: [
          'Settling a group restaurant check at the end of a meal shouldn’t require awkward mental math. When dining with friends or colleagues, you often need to compute a fair gratuity on the pre-tax subtotal, add back the sales tax, and divide the grand total equally across everyone at the table.',
          'UseKit’s Tip Calculator separates the pre-tax food subtotal from the tax line item. That way, if your meal is $120.00 plus $10.80 in tax, selecting a 20% tip adds $24.00 (20% of $120.00) rather than tipping on the tax, bringing the grand total to $154.80 and splitting it cleanly across your party size.',
        ],
      },
      {
        heading: 'Mental Math Tricks for Quick Tipping',
        paragraphs: [
          'To estimate a 10% tip without a device, move the decimal point one place to the left ($46.50 becomes $4.65). Double that figure for a 20% tip ($9.30), or add half of the 10% figure ($4.65 + $2.33 = $6.98) for a 15% tip.',
        ],
      },
    ],
  },

  // 13. Date Difference Calculator
  {
    slug: 'date-difference-calculator',
    name: 'Date Difference Calculator',
    category: 'Calculators',
    categorySlug: 'calculators',
    shortDescription: 'Calculate exact days, weeks, months, years, and business weekdays between two dates.',
    seoTitle: 'Date Difference Calculator — Days & Weeks Between Two Dates | UseKit',
    metaDescription:
      'Calculate the exact duration between any two dates in years, months, days, total calendar days, weeks, and business working days (excluding weekends).',
    keywords: ['date difference calculator', 'days between two dates', 'date duration calculator', 'weeks between dates', 'working days between dates'],
    iconName: 'CalendarRange',
    dateAdded: '2025-01-10',
    isPopular: true,
    howTo: [
      'Select your Start Date and End Date using the calendar date pickers.',
      'Check "Include End Date (+1 day)" if you want inclusive counting (for example, counting both Monday and Friday as 5 full days instead of 4 elapsed days).',
      'View the calendar breakdown in years, months, and days alongside Total Calendar Days, Weeks + Days, Weekday Business Days, and Weekend Days.',
      'Copy the formatted summary or share a link with your selected dates.',
    ],
    faqs: [
      {
        question: 'When should I check the "Include End Date (+1 day)" option?',
        answer:
          'Leave it unchecked when measuring elapsed time between two dates (e.g., May 1 to May 5 is 4 days apart). Check it when counting inclusive calendar days for hotel nights/bookings, vacation leave requests, or project schedules where both the start day and end day are active workdays (May 1 through May 5 inclusive is 5 days).',
      },
      {
        question: 'Does the Date Difference Calculator count weekday business days and weekend days?',
        answer:
          'Yes. In addition to total calendar days, the calculator iterates through the interval to count exact Monday–Friday weekdays and Saturday–Sunday weekend days.',
      },
      {
        question: 'What happens if the Start Date is later than the End Date?',
        answer:
          'Our calculator automatically handles reverse chronological order cleanly, computing the positive span between the two dates while noting that the end date precedes the start date.',
      },
      {
        question: 'Are leap years included when calculating days between dates across multiple years?',
        answer:
          'Yes. Every February 29 falling within your selected date interval is counted accurately in both the calendar breakdown and total day tally.',
      },
    ],
    relatedSlugs: ['age-calculator', 'time-calculator', 'unit-converter', 'percentage-calculator'],
    guideSections: [
      {
        heading: 'Measuring Elapsed Duration vs. Inclusive Calendar Days',
        paragraphs: [
          'In project management, legal compliance, visa stay tracking (such as the 90/180-day Schengen rule), and contract administration, off-by-one errors between exclusive elapsed days and inclusive calendar days are a common source of mistakes. Subtracting June 10 from June 15 yields 5 elapsed 24-hour spans, yet a conference running from June 10 through June 15 spans 6 inclusive calendar days.',
          'UseKit makes this distinction explicit with a one-click "Include End Date (+1 day)" toggle and simultaneously breaks down your date span into exact years/months/days, total weeks plus remainder days, Monday–Friday working days, and weekend days.',
        ],
      },
      {
        heading: 'Practical Applications for Date Span Analysis',
        paragraphs: [
          'Human resources teams use date difference calculations to verify employee tenure and probation periods; logistics coordinators track transit lead times in both calendar and working days; and lenders compute exact day counts (Actual/365) for interim interest accrual.',
        ],
      },
    ],
  },

  // 14. Time Calculator
  {
    slug: 'time-calculator',
    name: 'Time Calculator',
    category: 'Calculators',
    categorySlug: 'calculators',
    shortDescription: 'Add or subtract time durations (days, hours, minutes, seconds) or shift a date and time.',
    seoTitle: 'Time Calculator — Add & Subtract Hours, Minutes & Seconds | UseKit',
    metaDescription:
      'Free online Time Calculator to add or subtract two durations (days, hours, minutes, seconds) or add/subtract time from a specific starting date and clock time.',
    keywords: ['time calculator', 'add hours and minutes', 'time duration calculator', 'hours and minutes calculator', 'subtract time'],
    iconName: 'Timer',
    dateAdded: '2025-01-10',
    howTo: [
      'Choose between "Add / Subtract Two Durations" or "Add / Subtract Time from a Date".',
      'Select whether to Add (+) or Subtract (−) the time values.',
      'Enter Days, Hours, Minutes, and Seconds for Duration A and Duration B (values over 60 minutes or 24 hours roll over automatically).',
      'Inspect the normalized output in Days/Hours/Minutes/Seconds, Total Hours (decimal), Total Minutes, and Total Seconds.',
    ],
    faqs: [
      {
        question: 'Why can’t you add hours and minutes on a normal decimal calculator?',
        answer:
          'Standard calculators use base-10 decimal arithmetic, whereas clock time uses base-60 (sexagesimal) for minutes and seconds and base-24 for hours. On a normal calculator, 1.45 + 1.30 equals 2.75, whereas 1 hour 45 minutes + 1 hour 30 minutes actually equals 3 hours 15 minutes (3.25 decimal hours).',
      },
      {
        question: 'How do I convert hours and minutes into decimal hours for payroll timesheets?',
        answer:
          'Divide the minutes by 60 and add to the hours. For example, 7 hours 45 minutes equals 7 + (45 / 60) = 7.75 decimal hours. UseKit automatically shows the exact decimal hours for every calculation.',
      },
      {
        question: 'Can I enter more than 60 minutes or more than 24 hours into a single field?',
        answer:
          'Yes! If you enter 195 minutes into the Minutes field and 0 in the others, the Time Calculator automatically normalizes it into 3 hours 15 minutes (and 3.25 decimal hours).',
      },
      {
        question: 'What happens if Duration B is larger than Duration A when subtracting?',
        answer:
          'The calculator computes the exact absolute difference and prefixes the result with a negative sign (−) so you can see the exact time deficit.',
      },
    ],
    relatedSlugs: ['date-difference-calculator', 'age-calculator', 'unit-converter', 'salary-calculator'],
    guideSections: [
      {
        heading: 'How Sexagesimal (Base-60) Time Arithmetic Works',
        paragraphs: [
          'Adding and subtracting time durations—such as flight logs, video editing timelines, podcast segments, marathon splits, and employee timesheets—requires base-60 carry and borrow logic: 60 seconds make 1 minute, 60 minutes make 1 hour, and 24 hours make 1 calendar day.',
          'UseKit converts every input duration into total seconds, performs exact addition or subtraction, and then reconstructs the normalized result in Days, Hours, Minutes, and Seconds alongside Total Hours (in HH:MM:SS and decimal hours for payroll), Total Minutes, and Total Seconds.',
        ],
      },
      {
        heading: 'Adding or Subtracting Time from a Specific Timestamp',
        paragraphs: [
          'When scheduling server maintenance windows, international flights, medication doses, or baking/fermentation timers, you often need to know the exact calendar date and clock time 36 hours and 45 minutes from a starting timestamp. Switch to the "Date + Duration" tab in the Time Calculator to compute the exact resulting date and time.',
        ],
      },
    ],
  },

  // 15. Unit Converter
  {
    slug: 'unit-converter',
    name: 'Unit Converter',
    category: 'Calculators',
    categorySlug: 'calculators',
    shortDescription: 'Convert Length, Weight, Temperature, Area, Volume, Speed, and Digital Data units instantly.',
    seoTitle: 'Unit Converter — Length, Weight, Temp, Area, Volume & Data | UseKit',
    metaDescription:
      'All-in-one precision Unit Converter for Length, Weight/Mass, Temperature, Area, Volume, Speed, and Digital Storage. Instant Metric and Imperial conversions.',
    keywords: ['unit converter', 'metric to imperial converter', 'length converter', 'weight converter', 'temperature converter', 'area volume speed converter'],
    iconName: 'ArrowLeftRight',
    dateAdded: '2025-01-10',
    isPopular: true,
    isMostUsed: true,
    howTo: [
      'Select one of the 7 measurement categories: Length, Weight & Mass, Temperature, Area, Volume, Speed, or Digital Data.',
      'Enter the numeric value you want to convert.',
      'Choose the "From Unit" and "To Unit" from the dropdown selectors (or click the Swap button to reverse direction).',
      'Read the high-precision converted value at the top and inspect the "All Equivalent Units" comparison table below.',
    ],
    faqs: [
      {
        question: 'What measurement categories are supported in the UseKit Unit Converter?',
        answer:
          'Our converter supports 7 comprehensive measurement categories: Length (mm, cm, m, km, in, ft, yd, mi, nautical miles), Weight/Mass (mg, g, kg, metric ton, oz, lb, stone), Temperature (Celsius, Fahrenheit, Kelvin), Area (sq m, sq km, sq ft, sq yd, acre, hectare), Volume (ml, L, cubic meter, tsp, tbsp, fl oz, cup, pint, quart, gallon), Speed (m/s, km/h, mph, knots), and Digital Data (B, KB, MB, GB, TB, PB).',
      },
      {
        question: 'How are Temperature conversions calculated differently from other units?',
        answer:
          'Unlike length or weight which scale linearly from zero, Celsius, Fahrenheit, and Kelvin have different zero offsets. We use exact affine transformations: °F = (°C × 9/5) + 32, °C = (°F − 32) × 5/9, and K = °C + 273.15.',
      },
      {
        question: 'What is the exact conversion factor between inches and centimeters?',
        answer:
          'By international agreement (the 1959 International Yard and Pound Agreement), 1 inch is defined as exactly 2.54 centimeters (25.4 millimeters), and 1 pound is defined as exactly 0.45359237 kilograms.',
      },
      {
        question: 'Can I view my input converted into all units of that category at once?',
        answer:
          'Yes. Beneath the primary conversion box, the "All Equivalent Units" table displays your input value converted simultaneously into every unit in the active category.',
      },
    ],
    relatedSlugs: ['bmi-calculator', 'time-calculator', 'percentage-calculator', 'age-calculator'],
    guideSections: [
      {
        heading: 'Precision Metric (SI) and Imperial Unit Conversions',
        paragraphs: [
          'Engineering specifications, international shipping manifests, culinary recipes, real estate listings, and scientific datasets routinely mix International System of Units (SI / Metric) measurements with US Customary and British Imperial units. Relying on rounded mental approximations—such as multiplying kilograms by 2.2 instead of 2.20462262—can introduce significant cumulative error across large quantities.',
          'UseKit uses NIST-aligned standard base-unit conversion coefficients across all seven physical and digital domains. Every conversion first normalizes the input into the canonical SI base unit (meters for length, kilograms for mass, Kelvin/Celsius for temperature, square meters for area, liters for volume, meters per second for speed, and bytes for data) and then projects it into both your target unit and a complete multi-unit reference table.',
        ],
      },
      {
        heading: 'Quick Reference of Exact International Conversion Standards',
        paragraphs: [
          'Key exact definitions used in this tool include: 1 inch = 25.4 mm; 1 foot = 0.3048 m; 1 mile = 1,609.344 m; 1 nautical mile = 1,852 m; 1 avoirdupois pound = 453.59237 g; 1 acre = 4,046.8564224 m²; 1 hectare = 10,000 m²; and 1 US liquid gallon = 3.785411784 L.',
        ],
      },
    ],
  },
  ...EXTRA_TOOLS,
];

export function getToolBySlug(slug: string): ToolDefinition | undefined {
  return TOOLS.find((t) => t.slug === slug);
}

export function getCategoryBySlug(slug: string): CategoryDefinition | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getToolsByCategory(categorySlug: CategorySlug): ToolDefinition[] {
  return TOOLS.filter((t) => t.categorySlug === categorySlug);
}

export function getPopularTools(): ToolDefinition[] {
  return TOOLS.filter((t) => t.isPopular);
}

export function getMostUsedTools(): ToolDefinition[] {
  return TOOLS.filter((t) => t.isMostUsed);
}

export function getRecentlyAddedTools(limit = 6): ToolDefinition[] {
  return [...TOOLS]
    .sort((a, b) => b.dateAdded.localeCompare(a.dateAdded))
    .slice(0, limit);
}

export function getRelatedTools(tool: ToolDefinition): ToolDefinition[] {
  const related = tool.relatedSlugs
    .map((slug) => getToolBySlug(slug))
    .filter((t): t is ToolDefinition => Boolean(t));
  if (related.length >= 4) return related.slice(0, 6);

  const sameCategory = TOOLS.filter(
    (t) => t.categorySlug === tool.categorySlug && t.slug !== tool.slug && !tool.relatedSlugs.includes(t.slug)
  );
  return [...related, ...sameCategory].slice(0, 6);
}
