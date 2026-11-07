import React, { lazy } from 'react';

export const TOOL_COMPONENTS: Record<string, React.LazyExoticComponent<React.ComponentType>> = {
  // Calculators (19)
  'age-calculator': lazy(() => import('../components/tools/AgeCalculator')),
  'bmi-calculator': lazy(() => import('../components/tools/BmiCalculator')),
  'percentage-calculator': lazy(() => import('../components/tools/PercentageCalculator')),
  'discount-calculator': lazy(() => import('../components/tools/DiscountCalculator')),
  'gst-calculator': lazy(() => import('../components/tools/GstCalculator')),
  'emi-calculator': lazy(() => import('../components/tools/EmiCalculator')),
  'loan-calculator': lazy(() => import('../components/tools/LoanCalculator')),
  'simple-interest-calculator': lazy(() => import('../components/tools/SimpleInterestCalculator')),
  'compound-interest-calculator': lazy(() => import('../components/tools/CompoundInterestCalculator')),
  'profit-and-loss-calculator': lazy(() => import('../components/tools/ProfitAndLossCalculator')),
  'salary-calculator': lazy(() => import('../components/tools/SalaryCalculator')),
  'tip-calculator': lazy(() => import('../components/tools/TipCalculator')),
  'date-difference-calculator': lazy(() => import('../components/tools/DateDifferenceCalculator')),
  'time-calculator': lazy(() => import('../components/tools/TimeCalculator')),
  'unit-converter': lazy(() => import('../components/tools/UnitConverter')),
  'sip-calculator': lazy(() => import('../components/tools/ExtraCalculators').then((m) => ({ default: m.SipCalculator }))),
  'fd-calculator': lazy(() => import('../components/tools/ExtraCalculators').then((m) => ({ default: m.FdCalculator }))),
  'rd-calculator': lazy(() => import('../components/tools/ExtraCalculators').then((m) => ({ default: m.RdCalculator }))),
  'income-tax-estimator': lazy(() => import('../components/tools/ExtraCalculators').then((m) => ({ default: m.IncomeTaxEstimator }))),

  // Image Tools (10)
  'image-compressor': lazy(() => import('../components/tools/ImageTools').then((m) => ({ default: m.ImageCompressor }))),
  'image-resizer': lazy(() => import('../components/tools/ImageTools').then((m) => ({ default: m.ImageResizer }))),
  'image-cropper': lazy(() => import('../components/tools/ImageTools').then((m) => ({ default: m.ImageCropper }))),
  'jpg-to-png': lazy(() => import('../components/tools/ImageTools').then((m) => ({ default: m.JpgToPng }))),
  'png-to-jpg': lazy(() => import('../components/tools/ImageTools').then((m) => ({ default: m.PngToJpg }))),
  'png-to-webp': lazy(() => import('../components/tools/ImageTools').then((m) => ({ default: m.PngToWebp }))),
  'webp-to-jpg': lazy(() => import('../components/tools/ImageTools').then((m) => ({ default: m.WebpToJpg }))),
  'image-to-pdf': lazy(() => import('../components/tools/ImageTools').then((m) => ({ default: m.ImageToPdf }))),
  'image-rotator': lazy(() => import('../components/tools/ImageTools').then((m) => ({ default: m.ImageRotator }))),
  'image-flipper': lazy(() => import('../components/tools/ImageTools').then((m) => ({ default: m.ImageFlipper }))),

  // PDF Tools (7)
  'pdf-merger': lazy(() => import('../components/tools/PdfTools').then((m) => ({ default: m.PdfMerger }))),
  'pdf-splitter': lazy(() => import('../components/tools/PdfTools').then((m) => ({ default: m.PdfSplitter }))),
  'pdf-compressor': lazy(() => import('../components/tools/PdfTools').then((m) => ({ default: m.PdfCompressor }))),
  'pdf-to-jpg': lazy(() => import('../components/tools/PdfTools').then((m) => ({ default: m.PdfToJpg }))),
  'pdf-page-rotator': lazy(() => import('../components/tools/PdfTools').then((m) => ({ default: m.PdfPageRotator }))),
  'pdf-page-extractor': lazy(() => import('../components/tools/PdfTools').then((m) => ({ default: m.PdfPageExtractor }))),
  'pdf-metadata-viewer': lazy(() => import('../components/tools/PdfTools').then((m) => ({ default: m.PdfMetadataViewer }))),

  // Text Tools (9)
  'word-counter': lazy(() => import('../components/tools/TextTools').then((m) => ({ default: m.WordCounter }))),
  'character-counter': lazy(() => import('../components/tools/TextTools').then((m) => ({ default: m.CharacterCounter }))),
  'case-converter': lazy(() => import('../components/tools/TextTools').then((m) => ({ default: m.CaseConverter }))),
  'text-reverser': lazy(() => import('../components/tools/TextTools').then((m) => ({ default: m.TextReverser }))),
  'remove-duplicate-lines': lazy(() => import('../components/tools/TextTools').then((m) => ({ default: m.RemoveDuplicateLines }))),
  'text-cleaner': lazy(() => import('../components/tools/TextTools').then((m) => ({ default: m.TextCleaner }))),
  'text-to-slug': lazy(() => import('../components/tools/TextTools').then((m) => ({ default: m.TextToSlug }))),
  'lorem-ipsum-generator': lazy(() => import('../components/tools/TextTools').then((m) => ({ default: m.LoremIpsumGenerator }))),
  'text-sorter': lazy(() => import('../components/tools/TextTools').then((m) => ({ default: m.TextSorter }))),

  // Developer Tools (9)
  'json-formatter': lazy(() => import('../components/tools/DeveloperTools').then((m) => ({ default: m.JsonFormatterValidator }))),
  'html-formatter': lazy(() => import('../components/tools/DeveloperTools').then((m) => ({ default: m.HtmlFormatter }))),
  'css-minifier': lazy(() => import('../components/tools/DeveloperTools').then((m) => ({ default: m.CssMinifier }))),
  'javascript-minifier': lazy(() => import('../components/tools/DeveloperTools').then((m) => ({ default: m.JsMinifier }))),
  'base64-encoder-decoder': lazy(() => import('../components/tools/DeveloperTools').then((m) => ({ default: m.Base64EncoderDecoder }))),
  'url-encoder-decoder': lazy(() => import('../components/tools/DeveloperTools').then((m) => ({ default: m.UrlEncoderDecoder }))),
  'html-entity-encoder-decoder': lazy(() => import('../components/tools/DeveloperTools').then((m) => ({ default: m.HtmlEntityEncoderDecoder }))),
  'uuid-generator': lazy(() => import('../components/tools/DeveloperTools').then((m) => ({ default: m.UuidGenerator }))),
  'regex-tester': lazy(() => import('../components/tools/DeveloperTools').then((m) => ({ default: m.RegexTester }))),

  // Security & Internet (8)
  'password-generator': lazy(() => import('../components/tools/SecurityInternetTools').then((m) => ({ default: m.PasswordGenerator }))),
  'password-strength-checker': lazy(() => import('../components/tools/SecurityInternetTools').then((m) => ({ default: m.PasswordStrengthChecker }))),
  'qr-code-generator': lazy(() => import('../components/tools/SecurityInternetTools').then((m) => ({ default: m.QrCodeGenerator }))),
  'qr-code-reader': lazy(() => import('../components/tools/SecurityInternetTools').then((m) => ({ default: m.QrCodeReader }))),
  'barcode-generator': lazy(() => import('../components/tools/SecurityInternetTools').then((m) => ({ default: m.BarcodeGenerator }))),
  'url-parser': lazy(() => import('../components/tools/SecurityInternetTools').then((m) => ({ default: m.UrlParser }))),
  'ip-address-info': lazy(() => import('../components/tools/SecurityInternetTools').then((m) => ({ default: m.IpAddressInfo }))),
  'user-agent-viewer': lazy(() => import('../components/tools/SecurityInternetTools').then((m) => ({ default: m.UserAgentViewer }))),

  // Color & Design (6)
  'color-picker': lazy(() => import('../components/tools/ColorDesignTools').then((m) => ({ default: m.ColorPickerTool }))),
  'hex-to-rgb': lazy(() => import('../components/tools/ColorDesignTools').then((m) => ({ default: m.HexToRgb }))),
  'rgb-to-hex': lazy(() => import('../components/tools/ColorDesignTools').then((m) => ({ default: m.RgbToHex }))),
  'gradient-generator': lazy(() => import('../components/tools/ColorDesignTools').then((m) => ({ default: m.GradientGenerator }))),
  'box-shadow-generator': lazy(() => import('../components/tools/ColorDesignTools').then((m) => ({ default: m.BoxShadowGenerator }))),
  'border-radius-generator': lazy(() => import('../components/tools/ColorDesignTools').then((m) => ({ default: m.BorderRadiusGenerator }))),

  // Date & Time (6)
  'stopwatch': lazy(() => import('../components/tools/DateTimeTools').then((m) => ({ default: m.StopwatchTool }))),
  'online-timer': lazy(() => import('../components/tools/DateTimeTools').then((m) => ({ default: m.OnlineTimer }))),
  'world-clock': lazy(() => import('../components/tools/DateTimeTools').then((m) => ({ default: m.WorldClock }))),
  'time-zone-converter': lazy(() => import('../components/tools/DateTimeTools').then((m) => ({ default: m.TimeZoneConverter }))),
  'countdown-timer': lazy(() => import('../components/tools/DateTimeTools').then((m) => ({ default: m.CountdownTimer }))),
  'business-days-calculator': lazy(() => import('../components/tools/DateTimeTools').then((m) => ({ default: m.BusinessDaysCalculator }))),

  // SEO & Social (9)
  'meta-tag-generator': lazy(() => import('../components/tools/SeoSocialTools').then((m) => ({ default: m.MetaTagGenerator }))),
  'meta-tag-analyzer': lazy(() => import('../components/tools/SeoSocialTools').then((m) => ({ default: m.MetaTagAnalyzer }))),
  'open-graph-generator': lazy(() => import('../components/tools/SeoSocialTools').then((m) => ({ default: m.OpenGraphGenerator }))),
  'robots-txt-generator': lazy(() => import('../components/tools/SeoSocialTools').then((m) => ({ default: m.RobotsTxtGenerator }))),
  'xml-sitemap-generator': lazy(() => import('../components/tools/SeoSocialTools').then((m) => ({ default: m.XmlSitemapGenerator }))),
  'hashtag-generator': lazy(() => import('../components/tools/SeoSocialTools').then((m) => ({ default: m.HashtagGenerator }))),
  'youtube-title-generator': lazy(() => import('../components/tools/SeoSocialTools').then((m) => ({ default: m.YoutubeTitleGenerator }))),
  'youtube-description-generator': lazy(() => import('../components/tools/SeoSocialTools').then((m) => ({ default: m.YoutubeDescriptionGenerator }))),
  'social-bio-generator': lazy(() => import('../components/tools/SeoSocialTools').then((m) => ({ default: m.SocialBioGenerator }))),

  // Random & Everyday (7)
  'random-number-generator': lazy(() => import('../components/tools/RandomEverydayTools').then((m) => ({ default: m.RandomNumberGenerator }))),
  'random-name-picker': lazy(() => import('../components/tools/RandomEverydayTools').then((m) => ({ default: m.RandomNamePicker }))),
  'coin-flip': lazy(() => import('../components/tools/RandomEverydayTools').then((m) => ({ default: m.CoinFlip }))),
  'dice-roller': lazy(() => import('../components/tools/RandomEverydayTools').then((m) => ({ default: m.DiceRoller }))),
  'text-to-binary': lazy(() => import('../components/tools/RandomEverydayTools').then((m) => ({ default: m.TextToBinary }))),
  'binary-to-text': lazy(() => import('../components/tools/RandomEverydayTools').then((m) => ({ default: m.BinaryToText }))),
  'number-to-words': lazy(() => import('../components/tools/RandomEverydayTools').then((m) => ({ default: m.NumberToWords }))),
};
