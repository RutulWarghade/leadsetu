// LeadSetu retriever: BM25 keyword search over the supplier catalog,
// with Hinglish/synonym expansion and a same-city / same-state boost.
const SYN = {
  pipe: ["pipe", "tube", "nali"], nali: ["pipe"], tube: ["pipe", "tube"],
  box: ["box", "carton", "packaging", "dabba"], dabba: ["box", "carton"], carton: ["box", "carton"],
  shoe: ["shoe", "footwear", "joota"], joota: ["shoe"], joote: ["shoe"], jute: ["shoe"],
  kapda: ["fabric", "cloth"], cloth: ["fabric"], kapde: ["fabric"],
  wire: ["wire", "cable", "taar"], taar: ["wire", "cable"], cable: ["cable", "wire"],
  light: ["light", "led", "lamp"], batti: ["light", "led"], bulb: ["light", "led"],
  solar: ["solar", "panel"], panel: ["panel"],
  masala: ["masala", "spice", "powder"], haldi: ["turmeric"], mirchi: ["chilli"], mirch: ["chilli"], jeera: ["cumin"],
  chair: ["chair", "seating"], kursi: ["chair"], table: ["table", "workstation"],
  water: ["water", "ro", "purifier"], pani: ["water"], ro: ["ro", "purifier", "water"],
  tshirt: ["t-shirt", "tshirt", "shirt"], shirt: ["shirt", "t-shirt"], uniform: ["uniform", "garment"],
  helmet: ["helmet", "ppe"], jacket: ["jacket", "ppe"],
  steel: ["steel", "ms", "ss"], ss: ["stainless"], gi: ["galvanised", "gi"],
};
const STOP = new Set("i we need want a an the of for in at to and or with chahiye hai hain ka ki ke ko me mein se per urgent please pls bhai ji kg pcs piece pieces metre meter nos units unit".split(" "));

function tokenize(text) {
  return String(text).toLowerCase().replace(/t-shirt/g, "tshirt").replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/).filter(t => t && !STOP.has(t) && !/^\d+$/.test(t))
    .map(t => (t.length > 3 && t.endsWith("s") && !t.endsWith("ss")) ? t.slice(0, -1) : t);
}
function expand(tokens) {
  const out = [];
  for (const t of tokens) { out.push(t); for (const s of (SYN[t] || [])) out.push(...tokenize(s)); }
  return [...new Set(out)];
}

function buildIndex(catalog) {
  const docs = catalog.map(s => tokenize(`${s.category} ${s.category} ${s.products} ${s.products} ${s.specs}`));
  const df = {}; docs.forEach(d => new Set(d).forEach(t => df[t] = (df[t] || 0) + 1));
  const avgdl = docs.reduce((a, d) => a + d.length, 0) / docs.length;
  return { catalog, docs, df, avgdl, N: docs.length };
}

function search(index, { query, city = "", limit = 6 }) {
  const q = expand(tokenize(query)); const k1 = 1.4, b = 0.75;
  const cityL = String(city).toLowerCase().trim();
  const cityRow = index.catalog.find(s => s.city.toLowerCase() === cityL);
  const res = index.docs.map((d, i) => {
    let score = 0;
    for (const t of q) {
      const f = d.filter(x => x === t).length; if (!f) continue;
      const idf = Math.log(1 + (index.N - index.df[t] + 0.5) / (index.df[t] + 0.5));
      score += idf * (f * (k1 + 1)) / (f + k1 * (1 - b + b * d.length / index.avgdl));
    }
    const s = index.catalog[i]; let loc = "other";
    if (score > 0 && cityL) {
      if (s.city.toLowerCase() === cityL) { score *= 1.35; loc = "same city"; }
      else if (cityRow && s.state === cityRow.state) { score *= 1.15; loc = "same state"; }
    }
    return { s, score, loc };
  }).filter(r => r.score > 0.5).sort((a, b) => b.score - a.score).slice(0, limit);
  return res.map(r => ({ ...r.s, relevance: +r.score.toFixed(2), location_match: cityL ? r.loc : "not specified" }));
}
if (typeof module !== "undefined") module.exports = { buildIndex, search, tokenize };
