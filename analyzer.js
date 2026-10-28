/* RedFlag analyzer v0.3 - deterministic, multilingual patterns (bs/hr/sr + en + de + es).
 * Returns category ids + verbatim quotes. Display strings live in plainlanguage.js.
 * No network access. No dependencies.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.RedFlag = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var VERSION = '0.3.0';
  var MAX_CHARS = 1000000;

  function normalizeText(text) {
    var t = String(text).normalize('NFC');
    var lines = t.split(/\r\n|[\n\r\v\f\x1c-\x1e\x85\u2028\u2029]/);
    var out = [], blank = false;
    for (var i = 0; i < lines.length; i++) {
      var ln = lines[i].replace(/^[\s\x1c-\x1f\x85]+|[\s\x1c-\x1f\x85]+$/g, '');
      if (ln) { out.push(ln); blank = false; }
      else if (!blank) { out.push(''); blank = true; }
    }
    return out.join('\n').replace(/^[\s\x1c-\x1f\x85]+|[\s\x1c-\x1f\x85]+$/g, '');
  }

  var ABBR = {'e.g':1,'i.e':1,'etc':1,'inc':1,'ltd':1,'corp':1,'co':1,'u.s':1,'u.k':1,
              'vs':1,'no':1,'mr':1,'mrs':1,'ms':1,'dr':1,'st':1,'jr':1,'sr':1,'approx':1,
              'npr':1,'itd':1,'tzv':1,'god':1,'z.b':1,'bzw':1,'usw':1,'p.ej':1,'etc.':1};

  function splitSentences(text) {
    var out = [], pos = 0, lines = text.split('\n');
    for (var li = 0; li < lines.length; li++) {
      var line = lines[li], base = pos;
      pos += line.length + 1;
      if (!line) continue;
      var re = /[.!?;]["')\]\u201d\u2019]*\s+/g, last = 0, m;
      while ((m = re.exec(line))) {
        var next = m.index + m[0].length;
        if (m[0][0] !== ';') {
          var before = line.slice(last, m.index).split(/\s+/).pop().toLowerCase().replace(/^[("'\[]+/, '');
          if (m[0][0] === '.' && ABBR[before]) continue;
          if (!/[A-Z0-9ČĆŽŠĐÄÖÜßÁÉÍÑÓÚÁ("'\u201c\[\u2022\-\u2013]/.test(line.charAt(next))) continue;
        }
        var stop = m.index + m[0].replace(/\s+$/, '').length;
        out.push({ start: base + last, end: base + stop });
        last = next;
      }
      if (last < line.length) out.push({ start: base + last, end: base + line.length });
    }
    return out;
  }

  var S = '[^.;]';
  function R(src, flags) { return new RegExp(src, flags === undefined ? 'i' : flags); }

  var CATEGORIES = [
    { id: 'third_party_sharing', risk: 'medium', patterns: [
      R('\\b(?:share|shares|shared|sharing|disclose|discloses|disclosing|transfer|transfers|make available|give access)\\b' + S + '{0,120}\\b(?:third[- ]part(?:y|ies)|partners?|affiliates?|advertisers?|advertising (?:partners|networks?)|service providers?|vendors?|subsidiar(?:y|ies)|other (?:companies|organi[sz]ations))\\b'),
      R('\\b(?:dijelit\\w*|podijelit\\w*|pristup\\w*)\\b' + S + '{0,120}(?:treće strane|partner\\w*)'),
      R('(?:treće strane|partner\\w*)' + S + '{0,120}\\b(?:dijelit\\w*|podijelit\\w*|pristup\\w*)'),
      R('\\b(?:weitergab\\w*|übermittl\\w*)\\b' + S + '{0,120}\\b(?:dritte|partner|werbetreibende)\\b'),
      R('\\b(?:compart\\w*|ceder\\w*|cesión)\\b' + S + '{0,120}\\b(?:terceros|socios|anunciantes)\\b')
    ]},
    { id: 'data_sale', risk: 'high', patterns: [
      R('\\b(?:sell|sells|selling|sold)\\b' + S + '{0,80}\\b(?:information|data)\\b'),
      R('\\bsale of (?:your |personal |user )?(?:information|data)\\b'),
      R('\\b(?:information|data)\\b' + S + '{0,60}\\b(?:is|are|may be|will be|has been|have been) sold\\b'),
      R('\\b(?:prodati|prodaj\\w*)\\b' + S + '{0,80}\\b(?:podat\\w*|informacij\\w*)\\b'),
      R('\\b(?:verkauf\\w*)\\b' + S + '{0,80}\\b(?:personenbezogene daten|daten)\\b'),
      R('\\b(?:vend\\w*|venta)\\b' + S + '{0,80}\\b(?:datos personales|datos)\\b')
    ]},
    { id: 'ads_tracking', risk: 'medium', patterns: [
      R('\\b(?:cookies?|web beacons?|pixels?|tracking technolog(?:y|ies)|device fingerprint\\w*|fingerprinting|advertising ids?|advertiser ids?|mobile advertising identifiers?|retargeting|remarketing)\\b'),
      R('\\bcross[- ](?:site|context|device|app) (?:tracking|behaviou?ral advertising|advertising)\\b'),
      R('\\b(?:interest[- ]based|behaviou?ral|targeted|personali[sz]ed) advertis\\w+'),
      R('\\b(?:kolačići|kolačić|praćenje|praćen|pratiti|identifikator\\w*)\\b'),
      R('\\b(?:cookies?|tracking|werbe-?ids?|fingerabdruck|wiedererkennung)\\b'),
      R('\\b(?:cookies?|rastreo|seguimiento|publicidad dirigida|huella digital)\\b')
    ]},
    { id: 'gov_disclosure', risk: 'high', patterns: [
      R('\\b(?:law enforcement|government (?:agenc\\w+|authorit\\w+|requests?)|subpoenas?|court orders?|legal process|lawful requests?|public authorit\\w+)\\b'),
      R('\\b(?:zakon\\w*|policija|policij\\w*|sud\\w*|pravni zahtjev\\w*)\\b'),
      R('\\b(?:behörden|strafverfolgung|gerichtsbeschluss|staatsanwaltschaft)\\b'),
      R('\\b(?:autoridades|policía|policia|orden judicial|requerimiento legal)\\b')
    ]},
    { id: 'identity_document_request', risk: 'high', patterns: [
      R('(?:upload|provide|submit|send|attach|photograph|photo|image|picture|copy|scan|uploading|photographing)' + S + '{0,120}(?:identity document|identity card|national id|passport|driver.?s license)'),
      R('(?:identity document|identity card|national id|passport|driver.?s license)' + S + '{0,120}(?:upload|provide|submit|send|attach|photograph|photo|image|picture|copy|scan)'),
      R('(?:učitaj\\w*|dostavi\\w*|pošalji\\w*|poslati|priloži\\w*|slika\\w*|fotografij\\w*|kopij\\w*|skenir\\w*)' + S + '{0,120}(?:ličn\\w* kart\\w*|osobn\\w* iskaznic\\w*|ličn\\w* dokument\\w*|pasoš\\w*|putovnic\\w*)'),
      R('(?:ličn\\w* kart\\w*|osobn\\w* iskaznic\\w*|ličn\\w* dokument\\w*|pasoš\\w*|putovnic\\w*)' + S + '{0,120}(?:učitaj\\w*|dostavi\\w*|pošalji\\w*|poslati|priloži\\w*|slika\\w*|fotografij\\w*|kopij\\w*|skenir\\w*)'),
      R('(?:upload|vorlegen|übermitteln|senden|foto|kopie|scan)\\w*' + S + '{0,120}(?:personalausweis|reisepass|führerschein|ausweisdokument)'),
      R('(?:subir|aportar|enviar|adjuntar|foto|copia|escanear)\\w*' + S + '{0,120}(?:documento de identidad|dni|pasaporte|carné de conducir)')
    ]},
    { id: 'international_data_transfer', risk: 'high', patterns: [
      R('(?:transfer|transfers|transferred|transferring|store|stored|process|processed|processing|host|hosted)' + S + '{0,120}(?:another countr(?:y|ies)|other countr(?:y|ies)|outside (?:the )?(?:country|european economic area|eea|eu|european union)|internationally|abroad)'),
      R('(?:another countr(?:y|ies)|other countr(?:y|ies)|outside (?:the )?(?:country|european economic area|eea|eu|european union)|internationally|abroad)' + S + '{0,120}(?:personal data|user data|your data|information)'),
      R('(?:pren(?:os|ijel|ošen|ose|osi|esemo|osimo)|pohranjuj\\w*|čuvaj\\w*|obrađuj\\w*)' + S + '{0,120}(?:druge države|drugim državama|inozemstvo|u inostranstvu|izvan (?:zemlje|države|evropske unije|eu|eea)|van (?:zemlje|države|evropske unije|eu|eea))'),
      R('(?:druge države|drugim državama|inozemstvo|u inostranstvu|izvan (?:zemlje|države|evropske unije|eu|eea)|van (?:zemlje|države|evropske unije|eu|eea))' + S + '{0,120}(?:ličn\\w* podac\\w*|korisničk\\w* podac\\w*|vaš\\w* podac\\w*|informacij\\w*)'),
      R('\\b(?:übermittl\\w*|transferier\\w*)\\b' + S + '{0,80}\\b(?:drittländer|andere länder|außerhalb (?:der )?(?:eu|ewr))\\b'),
      R('\\b(?:transferenc\\w*|transferencia)\\b' + S + '{0,80}\\b(?:terceros países|otros países|fuera de (?:la )?(?:ue|eee))\\b')
    ]},
    { id: 'credit_loan', risk: 'high', patterns: [
      R('\\b(?:micro[- ]?credit|micro[- ]?loan|payday loan|borrower|lender|interest rate|annual percentage rate|apr|instalment|installment|repayment schedule|collateral|guarantor|garnish\\w*|debt collect\\w*)\\b'),
      R('\\b(?:loan|credit)\\b' + S + '{0,80}\\b(?:agreement|contract|apr|interest|repay\\w*|instalment|installment|collateral|lender|borrower|fee)\\b'),
      R('\\b(?:mikrokredit\\w*|pozajmic\\w*|kamatn\\w*|ovrh\\w*|izvršitelj\\w*|zalog\\w*|jemstv\\w*|vjerovnik\\w*|dužnik\\w*)\\b'),
      R('\\b(?:kredit\\w*|zajam|pozajmica)\\b' + S + '{0,80}\\b(?:ugovor\\w*|kamat\\w*|otplat\\w*|rat\\w*|naknad\\w*|zalog\\w*|ovrh\\w*)\\b'),
      R('\\b(?:mikrokredit\\w*|darlehen|zinsen|tilgungsplan|pfändung\\w*|inkasso|bürge\\w*)\\b'),
      R('\\b(?:kredit\\w*)\\b' + S + '{0,80}\\b(?:vertrag|zinsen|rate|tilgung\\w*|sicherheit\\w*|schuldner\\w*|gläubiger\\w*)\\b'),
      R('\\b(?:microcrédito\\w*|préstamo\\w*|interés|intereses|embargo\\w*|aval\\w*|acreedor\\w*|deudor\\w*)\\b'),
      R('\\b(?:crédito\\w*)\\b' + S + '{0,80}\\b(?:contrato|interés|intereses|cuota\\w*|amortización\\w*|garantía\\w*)\\b')
    ]},
    { id: 'vehicle_purchase', risk: 'medium', patterns: [
      R('\\b(?:odometer|mileage|chassis number|vehicle identification number|vin)\\b'),
      R('\\b(?:vehicle|car|automobile|motor vehicle)\\b' + S + '{0,80}\\b(?:purchase|sale|sold|buy|sell|transfer of ownership|buyer|seller)\\b'),
      R('\\b(?:purchase|sale|sold|buy|sell)\\b' + S + '{0,80}\\b(?:vehicle|car|automobile|motor vehicle)\\b'),
      R('\\b(?:kilometraža|šasija|broj šasije|saobraćajna dozvola)\\b'),
      R('\\b(?:vozil\\w*|automobil\\w*|motorno vozilo)\\b' + S + '{0,80}\\b(?:kupovin\\w*|prodaj\\w*|kupoprodaj\\w*|prenos\\w*|vlasništv\\w*)\\b'),
      R('\\b(?:kupovin\\w*|prodaj\\w*|kupoprodaj\\w*)\\b' + S + '{0,80}\\b(?:vozil\\w*|automobil\\w*|motorno vozilo)\\b'),
      R('\\b(?:kilometerstand|fahrgestellnummer|fahrzeugbrief)\\b'),
      R('\\b(?:fahrzeug\\w*|kraftfahrzeug\\w*|auto)\\b' + S + '{0,80}\\b(?:kauf|verkauf|kaufvertrag|übereignung|eigentum)\\b'),
      R('\\b(?:kilometraje|número de bastidor|permiso de circulación)\\b'),
      R('\\b(?:vehículo\\w*|automóvil\\w*|coche)\\b' + S + '{0,80}\\b(?:compra|venta|compraventa|transferencia|propiedad)\\b')
    ]},
    { id: 'real_estate', risk: 'medium', patterns: [
      R('\\b(?:real estate|immovable property|land parcel|parcel|plot of land|cadastral\\w*|easement\\w*|encumbrance\\w*|lien\\w*|mortgage\\w*|notary public|deed of sale|land registry)\\b'),
      R('\\b(?:property|land)\\b' + S + '{0,60}\\b(?:purchase|sale|transfer|lease|mortgage|deed)\\b'),
      R('\\b(?:nekretnin\\w*|zemljišt\\w*|parcel\\w*|katastarsk\\w*|hipotek\\w*|služnost\\w*|uknjižb\\w*|vlasničk\\w* list\\w*|zemljišn\\w* knjig\\w*)\\b'),
      R('\\b(?:immobilie\\w*|grundstück\\w*|flurstück\\w*|grundbuch\\w*|grundschuld\\w*|hypothek\\w*|dienstbarkeit\\w*|notar\\w*)\\b'),
      R('\\b(?:inmueble\\w*|terreno\\w*|parcela\\w*|catastral\\w*|hipoteca\\w*|servidumbre\\w*|gravamen\\w*|registro de la propiedad)\\b')
    ]},
    { id: 'unfair_clauses', risk: 'medium', patterns: [
      R('\\b(?:penalt\\w*|liquidated damages|forfeit\\w*|unilateral\\w*|sole discretion|without (?:prior )?notice|auto[- ]?renew\\w*|automatic renewal|arbitration\\w*|class action waiver|limitation of liability|as is|with all faults)\\b'),
      R('\\b(?:ugovorna kazn\\w*|kaznen\\w* klauzul\\w*|jednostran\\w*|po vlastitom nahođenju|bez (?:prethodne )?najave|automatsko produženj\\w*|arbitraž\\w*|isključenje odgovornosti|viđeno[- ]kupljeno)\\b'),
      R('\\b(?:vertragsstrafe\\w*|einseitig\\w*|nach eigenem ermessen|ohne (?:vorherige )?ankündigung|automatische verlängerung\\w*|schiedsverfahren\\w*|haftungsausschluss\\w*|gekauft wie gesehen)\\b'),
      R('\\b(?:penalizació\\w*|cláusula penal|unilateral\\w*|a su sola discreción|sin (?:previo )?aviso|renovación automática|arbitraje\\w*|exención de responsabilidad|tal cual|como está)\\b')
    ]}
  ];

  function analyze(input) {
    var text = normalizeText(input == null ? '' : input);
    if (text.length > MAX_CHARS) throw new Error('Text too long (limit ' + MAX_CHARS + ' characters).');
    var sentences = splitSentences(text);
    var byCat = {};
    for (var si = 0; si < sentences.length; si++) {
      var s = sentences[si], sent = text.slice(s.start, s.end);
      for (var ci = 0; ci < CATEGORIES.length; ci++) {
        var cat = CATEGORIES[ci], hit = null;
        for (var pi = 0; pi < cat.patterns.length && !hit; pi++) {
          var m = cat.patterns[pi].exec(sent);
          if (m) hit = m;
        }
        if (!hit) continue;
        (byCat[cat.id] = byCat[cat.id] || []).push({ quote: sent });
      }
    }
    var categories = [];
    for (var k = 0; k < CATEGORIES.length; k++) {
      var c = CATEGORIES[k], f = byCat[c.id];
      if (f) categories.push({ id: c.id, risk: c.risk || 'low', count: f.length, findings: f });
    }
    return { version: VERSION, categories: categories };
  }

  return { VERSION: VERSION, CATEGORIES: CATEGORIES, normalizeText: normalizeText, analyze: analyze };
});
