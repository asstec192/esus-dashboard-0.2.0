import { expose } from "comlink";
import { PDFProps } from "./PDF";
let log = console.info;

/* This prevents live reload problems during development
 * https://stackoverflow.com/questions/66472945/referenceerror-refreshreg-is-not-defined */
if (process.env.NODE_ENV != "production") {
  //@ts-ignore
  global.$RefreshReg$ = () => {};
  //@ts-ignore
  global.$RefreshSig$ = () => () => {};
}

const renderPDFInWorker = async (props: PDFProps) => {
  try {
    const { renderPDF } = await import("./renderPDF");
    return URL.createObjectURL(await renderPDF(props));
  } catch (error) {
    log(error);
    throw error;
  }
};
const onProgress = (cb: typeof console.info) => (log = cb);

expose({
  renderPDFInWorker,
  onProgress,
});

export type WorkerType = {
  renderPDFInWorker: typeof renderPDFInWorker;
  onProgress: typeof onProgress;
};
