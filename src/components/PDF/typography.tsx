import { Text, View } from "@react-pdf/renderer";
import { ReactNode } from "react";

export function PDFHeader(props: { children: ReactNode }) {
  return (
    <View
      style={{
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
      }}
    >
      {props.children}
    </View>
  );
}

export function PDFFooterText(props: { children: ReactNode }) {
  return (
    <Text style={{ fontSize: 8, fontFamily: "Open Sans", textAlign: "center" }}>
      {props.children}
    </Text>
  );
}

export function PDFTitle(props: { children: ReactNode }) {
  return (
    <Text
      style={{
        fontSize: 18,
        fontWeight: "semibold",
        fontFamily: "Open Sans",
        marginBottom: 10,
      }}
    >
      {props.children}
    </Text>
  );
}

export function PDFSubTitle(props: { children: ReactNode }) {
  return (
    <Text
      style={{
        fontSize: 14,
        fontWeight: "semibold",
        fontFamily: "Open Sans",
        marginTop: 10,
      }}
    >
      {props.children}
    </Text>
  );
}

export function PDFParagraph(props: { children: ReactNode }) {
  return (
    <Text
      style={{
        fontSize: 11,
        fontFamily: "Open Sans",
      }}
    >
      {props.children}
    </Text>
  );
}

export function PDFSmall(props: { children: ReactNode }) {
  return (
    <Text
      style={{
        fontSize: 11,
        fontWeight: "semibold",
        fontFamily: "Open Sans",
      }}
    >
      {props.children}
    </Text>
  );
}

export function PDFLegend(props: { children: ReactNode }) {
  return (
    <Text
      style={{
        fontSize: 10,
        // fontStyle: "italic",
        fontFamily: "Open Sans",
      }}
    >
      {props.children}
    </Text>
  );
}
