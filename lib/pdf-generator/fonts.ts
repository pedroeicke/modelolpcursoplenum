import type { FontData, DesignSystemData } from './types';

// ─── WOFF → SFNT (raw TrueType/OpenType) decompressor ──────────────
// Satori sometimes fails to parse WOFF containers. This converts WOFF
// back to the underlying SFNT format that satori handles natively.
async function decompressWoff(buf: ArrayBuffer): Promise<ArrayBuffer> {
  const view = new DataView(buf);
  const sig = String.fromCharCode(view.getUint8(0), view.getUint8(1), view.getUint8(2), view.getUint8(3));

  // Not WOFF → return as-is (already TTF/OTF)
  if (sig !== 'wOFF') return buf;

  console.log('[PDF Fonts] Decompressing WOFF → SFNT...');

  const flavor = view.getUint32(4);       // 0x00010000 (TrueType) or 'OTTO' (CFF)
  const numTables = view.getUint16(12);

  // Read WOFF table directory (starts at byte 44, each entry 20 bytes)
  interface WoffEntry { tag: number; offset: number; compLength: number; origLength: number; checksum: number; }
  const entries: WoffEntry[] = [];
  for (let i = 0; i < numTables; i++) {
    const off = 44 + i * 20;
    entries.push({
      tag: view.getUint32(off),
      offset: view.getUint32(off + 4),
      compLength: view.getUint32(off + 8),
      origLength: view.getUint32(off + 12),
      checksum: view.getUint32(off + 16),
    });
  }

  // Decompress each table
  const tableData: Uint8Array[] = [];
  for (const entry of entries) {
    const raw = new Uint8Array(buf, entry.offset, entry.compLength);
    if (entry.compLength < entry.origLength) {
      // zlib-compressed → decompress using browser DecompressionStream
      const ds = new DecompressionStream('deflate');
      const writer = ds.writable.getWriter();
      const reader = ds.readable.getReader();
      writer.write(raw).then(() => writer.close());
      const chunks: Uint8Array[] = [];
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
      }
      const totalLen = chunks.reduce((s, c) => s + c.length, 0);
      const decompressed = new Uint8Array(totalLen);
      let pos = 0;
      for (const ch of chunks) { decompressed.set(ch, pos); pos += ch.length; }
      tableData.push(decompressed);
    } else {
      // Uncompressed — just copy
      tableData.push(new Uint8Array(raw));
    }
  }

  // Build SFNT output
  // Header: 12 bytes + numTables * 16 bytes table records
  const sfntHeaderSize = 12 + numTables * 16;
  const pow2 = Math.pow(2, Math.floor(Math.log2(numTables)));
  const searchRange = pow2 * 16;
  const entrySelector = Math.floor(Math.log2(numTables));
  const rangeShift = numTables * 16 - searchRange;

  // Calculate table offsets (each padded to 4-byte boundary)
  let dataOffset = sfntHeaderSize;
  const offsets: number[] = [];
  for (const td of tableData) {
    offsets.push(dataOffset);
    dataOffset += td.length;
    if (dataOffset % 4 !== 0) dataOffset += 4 - (dataOffset % 4);
  }

  // Write output
  const out = new ArrayBuffer(dataOffset);
  const ov = new DataView(out);
  const ob = new Uint8Array(out);

  // SFNT header
  ov.setUint32(0, flavor);
  ov.setUint16(4, numTables);
  ov.setUint16(6, searchRange);
  ov.setUint16(8, entrySelector);
  ov.setUint16(10, rangeShift);

  // Table records
  for (let i = 0; i < numTables; i++) {
    const recOff = 12 + i * 16;
    ov.setUint32(recOff, entries[i].tag);
    ov.setUint32(recOff + 4, entries[i].checksum);
    ov.setUint32(recOff + 8, offsets[i]);
    ov.setUint32(recOff + 12, tableData[i].length);
  }

  // Table data
  for (let i = 0; i < numTables; i++) {
    ob.set(tableData[i], offsets[i]);
  }

  console.log(`[PDF Fonts] WOFF decompressed: ${buf.byteLength} → ${out.byteLength} bytes`);
  return out;
}

// ─── Fetch + auto-decompress font ─────────────────────────────────
async function fetchFont(url: string): Promise<ArrayBuffer> {
  console.log(`[PDF Fonts] Fetching: ${url}`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch font: ${url.slice(0, 80)} (${res.status})`);
  let buf = await res.arrayBuffer();

  // Check signature
  if (buf.byteLength >= 4) {
    const sig = String.fromCharCode(...new Uint8Array(buf.slice(0, 4)));
    if (sig === 'wOF2') {
      throw new Error(`Font is WOFF2 (not supported). URL: ${url.slice(0, 60)}`);
    }
    // Auto-decompress WOFF → SFNT for maximum compatibility
    if (sig === 'wOFF') {
      buf = await decompressWoff(buf);
    }
  }

  console.log(`[PDF Fonts] Font ready: ${url.split('/').pop()} (${(buf.byteLength / 1024).toFixed(0)}KB)`);
  return buf;
}

/**
 * Load the Inter fallback fonts from local TTF files.
 */
async function loadInterFallback(weightsToLoad: number[]): Promise<FontData[]> {
  const fonts: FontData[] = [];

  const localWeightFiles: Record<number, string> = {
    400: '/fonts/inter-400.ttf',
    700: '/fonts/inter-700.ttf',
  };

  let localSuccess = false;
  for (const weight of weightsToLoad) {
    const path = localWeightFiles[weight];
    if (!path) continue;
    try {
      const data = await fetchFont(path);
      fonts.push({ name: 'Inter', data, weight, style: 'normal' });
      localSuccess = true;
    } catch (e) {
      console.warn(`[PDF Fonts] Local Inter ${weight} failed:`, e instanceof Error ? e.message : e);
    }
  }

  if (localSuccess && fonts.length > 0) {
    console.log(`[PDF Fonts] Loaded ${fonts.length} Inter font(s) from local /fonts/`);
    return fonts;
  }

  // Fallback: gstatic CDN
  const gstaticUrls: Record<number, string> = {
    400: 'https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfMZhrj72A.ttf',
    700: 'https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYMZhrj72A.ttf',
  };

  for (const weight of weightsToLoad) {
    const url = gstaticUrls[weight];
    if (!url) continue;
    try {
      const data = await fetchFont(url);
      fonts.push({ name: 'Inter', data, weight, style: 'normal' });
    } catch (e) {
      console.warn(`[PDF Fonts] gstatic Inter ${weight} failed:`, e instanceof Error ? e.message : e);
    }
  }

  if (fonts.length > 0) {
    console.log(`[PDF Fonts] Loaded ${fonts.length} Inter font(s) from gstatic CDN`);
    return fonts;
  }

  throw new Error('All Inter font loading strategies failed.');
}

/**
 * Known local font files in public/fonts/.
 * Used when design system font_*_urls are empty.
 */
const LOCAL_FONT_MAP: Record<string, { path: string; weights: number[] }[]> = {
  // PPRadioGrotesk: only "regular" WOFF exists — register at 400/700/800 so satori
  // always finds a match regardless of which fontWeight the page uses.
  PPRadioGrotesk: [
    { path: '/fonts/pp-radio-grotesk-regular.woff', weights: [400, 700, 800] },
  ],
  // "Bricolage Grotesque" is used as font_heading in some design systems but
  // the actual font file is PPRadioGrotesk (see globals.css --font-bricolage)
  'Bricolage Grotesque': [
    { path: '/fonts/pp-radio-grotesk-regular.woff', weights: [400, 700, 800] },
  ],
  // Satoshi: OTF files exist for regular, medium, bold, black
  Satoshi: [
    { path: '/fonts/Satoshi-Regular.otf', weights: [400] },
    { path: '/fonts/Satoshi-Medium.otf', weights: [500] },
    { path: '/fonts/Satoshi-Bold.otf', weights: [700] },
    { path: '/fonts/Satoshi-Black.otf', weights: [900] },
  ],
};

async function loadLocalFonts(fontName: string, registeredName: string): Promise<FontData[]> {
  const entries = LOCAL_FONT_MAP[fontName];
  if (!entries) {
    console.warn(`[PDF Fonts] No LOCAL_FONT_MAP entry for "${fontName}"`);
    return [];
  }

  const fonts: FontData[] = [];
  for (const entry of entries) {
    try {
      const data = await fetchFont(entry.path);
      for (const weight of entry.weights) {
        fonts.push({ name: registeredName, data: data.slice(0), weight, style: 'normal' });
      }
      console.log(`[PDF Fonts] ✓ ${fontName} ${entry.path} → weights [${entry.weights.join(',')}]`);
    } catch (e) {
      console.error(`[PDF Fonts] ✗ ${fontName} FAILED (${entry.path}):`, e instanceof Error ? e.message : e);
    }
  }

  if (fonts.length > 0) {
    console.log(`[PDF Fonts] Loaded ${fonts.length} ${fontName} weight(s) from local /fonts/`);
  } else {
    console.error(`[PDF Fonts] Could not load any weights for "${fontName}"`);
  }
  return fonts;
}

export async function loadFonts(ds: DesignSystemData): Promise<FontData[]> {
  const fonts: FontData[] = [];

  console.log(`[PDF Fonts] DS heading="${ds.font_heading}" body="${ds.font_body}"`);
  console.log(`[PDF Fonts] DS heading_urls=${JSON.stringify(ds.font_heading_urls)}`);
  console.log(`[PDF Fonts] DS body_urls=${JSON.stringify(ds.font_body_urls)}`);

  // ── Heading font ──────────────────────────────────────────
  if (ds.font_heading_urls && ds.font_heading_urls.length > 0) {
    for (const entry of ds.font_heading_urls) {
      try {
        const data = await fetchFont(entry.url);
        fonts.push({ name: ds.font_heading, data, weight: entry.weight, style: 'normal' });
      } catch (e) {
        console.warn(`[PDF Fonts] DS heading URL failed:`, e instanceof Error ? e.message : e);
      }
    }
  }

  // If no heading fonts loaded from URLs, try local files
  if (!fonts.some((f) => f.name === ds.font_heading)) {
    console.log(`[PDF Fonts] No DS heading URLs loaded → trying local files for "${ds.font_heading}"`);
    const localHeading = await loadLocalFonts(ds.font_heading, ds.font_heading);
    fonts.push(...localHeading);
  }

  // ── Body font ─────────────────────────────────────────────
  if (ds.font_body_urls && ds.font_body_urls.length > 0) {
    for (const entry of ds.font_body_urls) {
      try {
        const data = await fetchFont(entry.url);
        fonts.push({ name: ds.font_body, data, weight: entry.weight, style: 'normal' });
      } catch (e) {
        console.warn(`[PDF Fonts] DS body URL failed:`, e instanceof Error ? e.message : e);
      }
    }
  }

  // If no body fonts loaded from URLs, try local files
  if (!fonts.some((f) => f.name === ds.font_body)) {
    console.log(`[PDF Fonts] No DS body URLs loaded → trying local files for "${ds.font_body}"`);
    const localBody = await loadLocalFonts(ds.font_body, ds.font_body);
    fonts.push(...localBody);
  }

  // ── Inter fallback (always load as ultimate fallback) ─────
  const interFonts = await loadInterFallback([400, 700]);
  for (const f of interFonts) {
    fonts.push(f);
  }

  if (fonts.length === 0) throw new Error('No fonts could be loaded.');

  // Log final font registry
  const summary = [...new Set(fonts.map(f => `${f.name}@${f.weight}`))].join(', ');
  console.log(`[PDF Fonts] ═══ Final font registry (${fonts.length}): ${summary}`);
  return fonts;
}

export function getFontFamily(ds: DesignSystemData, type: 'heading' | 'body', fonts: FontData[]): string {
  const targetName = type === 'heading' ? ds.font_heading : ds.font_body;
  const found = fonts.some((f) => f.name === targetName);
  console.log(`[PDF Fonts] getFontFamily(${type}) → target="${targetName}" found=${found}`);
  return found ? targetName : 'Inter';
}
