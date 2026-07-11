/**
 * Thin client for the SwiftLaTeX pdfTeX engine (WASM, runs in a Web Worker).
 * The engine assets live in /public/swiftlatex/ (swiftlatexpdftex.js + .wasm,
 * from https://github.com/SwiftLaTeX/SwiftLaTeX). The TeX format and every
 * LaTeX package the template needs are self-hosted under
 * /public/swiftlatex/texlive/ (SwiftLaTeX's own mirror is dead), so compiles
 * have zero external network dependencies.
 *
 * Browser-only: never import this from server code. The loaded engine is
 * cached module-wide, so the first click pays the WASM download and every
 * later compile is fast.
 */

const ENGINE_URL = "/swiftlatex/swiftlatexpdftex.js";
const TEXLIVE_PATH = "/swiftlatex/texlive/";
const MAIN_FILE = "main.tex";

interface WorkerReply {
  result?: string;
  cmd?: string;
  log?: string;
  status?: number;
  pdf?: ArrayBuffer;
}

class PdfTexEngine {
  private worker: Worker;
  private busy = false;

  private constructor(worker: Worker) {
    this.worker = worker;
  }

  /** Spawn the worker and wait for the WASM engine to report ready. */
  static async load(): Promise<PdfTexEngine> {
    const worker = new Worker(ENGINE_URL);
    await new Promise<void>((resolve, reject) => {
      worker.onmessage = (ev: MessageEvent<WorkerReply>) =>
        ev.data.result === "ok"
          ? resolve()
          : reject(new Error("The PDF engine failed to initialize."));
      worker.onerror = () =>
        reject(new Error("Could not load the PDF engine (worker error)."));
    });
    worker.onmessage = null;
    worker.onerror = null;
    // Point the engine at our self-hosted TeXLive files (same origin)
    worker.postMessage({ cmd: "settexliveurl", url: location.origin + TEXLIVE_PATH });
    return new PdfTexEngine(worker);
  }

  /** Compile a .tex source to a PDF. Throws with the TeX log on failure. */
  async compile(tex: string): Promise<Uint8Array> {
    if (this.busy) throw new Error("A compile is already running.");
    this.busy = true;
    try {
      this.worker.postMessage({ cmd: "writefile", url: MAIN_FILE, src: tex });
      this.worker.postMessage({ cmd: "setmainfile", url: MAIN_FILE });
      const reply = await new Promise<WorkerReply>((resolve, reject) => {
        this.worker.onmessage = (ev: MessageEvent<WorkerReply>) => {
          if (ev.data.cmd === "compile") resolve(ev.data);
        };
        this.worker.onerror = () => reject(new Error("The PDF engine crashed."));
        this.worker.postMessage({ cmd: "compilelatex" });
      });
      this.worker.onmessage = null;
      this.worker.onerror = null;

      if (reply.result !== "ok" || !reply.pdf) {
        // Surface the tail of the TeX log — that's where the actual error is
        const log = (reply.log ?? "").trim();
        console.error("LaTeX compile failed:\n" + log);
        throw new Error("The CV failed to compile — see the console for the LaTeX log.");
      }
      return new Uint8Array(reply.pdf);
    } finally {
      this.busy = false;
    }
  }
}

let enginePromise: Promise<PdfTexEngine> | null = null;

/** Compile LaTeX source into a PDF blob, loading the engine on first use. */
export async function compileTexToPdf(tex: string): Promise<Blob> {
  if (!enginePromise) {
    enginePromise = PdfTexEngine.load().catch((error) => {
      // Don't cache a failed load — a retry should start fresh
      enginePromise = null;
      throw error;
    });
  }
  const engine = await enginePromise;
  const pdf = await engine.compile(tex);
  // Copy into a fresh buffer so the Blob never holds a view over a larger one
  return new Blob([new Uint8Array(pdf).buffer], { type: "application/pdf" });
}
