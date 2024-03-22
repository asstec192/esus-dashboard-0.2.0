import { createElement } from "react";
import { expose } from "comlink";

import type { PDFRelatorioRedeProps } from "./Document";

let log = console.info;

/* This prevents live reload problems during development
 * https://stackoverflow.com/questions/66472945/referenceerror-refreshreg-is-not-defined */
if (process.env.NODE_ENV != "production") {
  //@ts-expect-error
  global.$RefreshReg$ = () => {};
  //@ts-expect-error
  global.$RefreshSig$ = () => () => {};
}

const renderPDFInWorker = async (props: PDFRelatorioRedeProps) => {
  try {
    const { pdf } = await import("@react-pdf/renderer");
    const { GerenciamentoRedePDFRelatorios } = await import("./Document");

    return URL.createObjectURL(
      //@ts-expect-error
      await pdf(createElement(GerenciamentoRedePDFRelatorios, props)).toBlob(),
    );
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
