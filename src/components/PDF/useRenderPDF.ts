import { useEffect } from "react";
import { useAsync } from "react-use";

import { proxy, wrap } from "comlink";
import type { WorkerType } from "./web.worker";
/* eslint-disable import/no-webpack-loader-syntax */
//@ts-ignore
import Worker from "worker-loader!./web.worker.ts";

export const pdfWorker = wrap<WorkerType>(new Worker());
pdfWorker.onProgress(proxy((info: any) => console.log(info)));

export const useRenderPDF = ({
  text,
}: Parameters<WorkerType["renderPDFInWorker"]>[0]) => {
  const {
    value: url,
    loading,
    error,
  } = useAsync(async () => {
    return pdfWorker.renderPDFInWorker({ text });
  }, [text]);

  useEffect(() => (url ? () => URL.revokeObjectURL(url) : undefined), [url]);
  return { url, loading, error };
};
