import satori from 'satori';
import { Resvg, initWasm } from '@resvg/resvg-wasm';
import { PDFDocument } from 'pdf-lib';
import { PAGE_W, PAGE_H, PDF_W, PDF_H, type SatoriNode, type FontData } from './types.ts';

let wasmInitialized = false;

function ts(): string {
  return new Date().toISOString();
}

/**
 * Initialize resvg WASM (once per cold start).
 * Uses jsDelivr CDN (fastest, globally distributed).
 */
async function _initWasmOnce(): Promise<void> {
  if (wasmInitialized) return;

  console.log(`[${ts()}] [WASM] Initializing resvg WASM...`);
  // jsDelivr is much faster than unpkg for large binaries
  const wasmUrl = 'https://cdn.jsdelivr.net/npm/@resvg/resvg-wasm@2.6.2/index_bg.wasm';

  const fetchStart = Date.now();
  const wasmRes = await fetch(wasmUrl);
  if (!wasmRes.ok) throw new Error(`WASM fetch failed: HTTP ${wasmRes.status}`);

  const wasmBuf = await wasmRes.arrayBuffer();
  console.log(`[${ts()}] [WASM] Fetched ${(wasmBuf.byteLength / 1024 / 1024).toFixed(2)} MB in ${Date.now() - fetchStart}ms`);

  await initWasm(wasmBuf);
  wasmInitialized = true;
  console.log(`[${ts()}] [WASM] ✓ Initialized (total: ${Date.now() - fetchStart}ms)`);
}

/**
 * Promise that starts WASM loading immediately at module import time.
 * This overlaps with Deno's cold start, so WASM may already be ready
 * by the time the first request arrives.
 */
export const wasmReady: Promise<void> = _initWasmOnce().catch((err) => {
  console.error(`[${ts()}] [WASM] Module-level init failed, will retry on request:`, err.message);
  wasmInitialized = false;
});

async function ensureWasm() {
  if (wasmInitialized) return;
  // Retry if module-level init failed
  await _initWasmOnce();
}

/**
 * Render a satori element tree to PNG bytes
 */
export async function renderPageToPng(
  element: SatoriNode,
  fonts: FontData[],
): Promise<Uint8Array> {
  // Ensure WASM is ready
  await ensureWasm();

  // satori → SVG
  console.log(`[${ts()}] [RENDER] Running satori (${PAGE_W}x${PAGE_H})...`);
  const satoriStart = Date.now();
  let svg: string;
  try {
    svg = await satori(element as any, {
      width: PAGE_W,
      height: PAGE_H,
      fonts: fonts.map((f) => ({
        name: f.name,
        data: f.data,
        weight: f.weight as any,
        style: f.style,
      })),
    });
  } catch (satoriErr) {
    console.error(`[${ts()}] [RENDER] ✗ satori FAILED:`, satoriErr);
    throw new Error(`satori failed: ${satoriErr instanceof Error ? satoriErr.message : satoriErr}`);
  }
  const satoriMs = Date.now() - satoriStart;
  console.log(`[${ts()}] [RENDER] ✓ satori → SVG: ${svg.length} chars in ${satoriMs}ms`);

  // SVG → PNG via resvg
  console.log(`[${ts()}] [RENDER] Running resvg (SVG → PNG)...`);
  const resvgStart = Date.now();
  let pngBytes: Uint8Array;
  try {
    const resvg = new Resvg(svg, {
      fitTo: { mode: 'width', value: PAGE_W },
    });
    const rendered = resvg.render();
    pngBytes = rendered.asPng();
  } catch (resvgErr) {
    console.error(`[${ts()}] [RENDER] ✗ resvg FAILED:`, resvgErr);
    throw new Error(`resvg failed: ${resvgErr instanceof Error ? resvgErr.message : resvgErr}`);
  }
  const resvgMs = Date.now() - resvgStart;
  console.log(`[${ts()}] [RENDER] ✓ resvg → PNG: ${pngBytes.length} bytes (${(pngBytes.length / 1024).toFixed(1)} KB) in ${resvgMs}ms`);

  return pngBytes;
}

/**
 * Assemble multiple PNG pages into a single PDF
 */
export async function assemblePdf(pngPages: Uint8Array[]): Promise<Uint8Array> {
  console.log(`[${ts()}] [PDF] Creating PDF document with ${pngPages.length} pages...`);
  const pdfDoc = await PDFDocument.create();

  for (let i = 0; i < pngPages.length; i++) {
    console.log(`[${ts()}] [PDF] Embedding page ${i + 1}/${pngPages.length} (${pngPages[i].length} bytes)...`);
    try {
      const image = await pdfDoc.embedPng(pngPages[i]);
      const page = pdfDoc.addPage([PDF_W, PDF_H]);
      page.drawImage(image, {
        x: 0,
        y: 0,
        width: PDF_W,
        height: PDF_H,
      });
      console.log(`[${ts()}] [PDF] ✓ Page ${i + 1} embedded`);
    } catch (embedErr) {
      console.error(`[${ts()}] [PDF] ✗ Page ${i + 1} embed FAILED:`, embedErr);
      throw new Error(`PDF embed page ${i + 1} failed: ${embedErr instanceof Error ? embedErr.message : embedErr}`);
    }
  }

  console.log(`[${ts()}] [PDF] Saving PDF document...`);
  const pdfBytes = await pdfDoc.save();
  console.log(`[${ts()}] [PDF] ✓ PDF saved: ${pdfBytes.length} bytes`);
  return pdfBytes;
}
