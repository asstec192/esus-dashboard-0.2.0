"use client";

import { QueryParamProvider } from "use-query-params";
import NextAdapterApp from "next-query-params/app";
import { ReactNode } from "react";

export const NextQueryParamProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <QueryParamProvider adapter={NextAdapterApp}>{children}</QueryParamProvider>
  );
};
