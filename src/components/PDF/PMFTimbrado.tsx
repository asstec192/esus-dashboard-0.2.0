import { View, Image } from "@react-pdf/renderer";
import logoPrefeitura from "public/images/logo-prefeitura.png";

export function PMFTimbrado() {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        width: "100%",
        marginBottom: 15,
      }}
    >
      <View
        style={{
          position: "relative",
          bottom: 20,
          width: "35%",
          height: 2,
          backgroundColor: "#fbb912",
        }}
      />
      <Image src={logoPrefeitura.src} style={{ width: 100 }} />
      <View
        style={{
          position: "relative",
          bottom: 20,
          width: "35%",
          height: 2,
          backgroundColor: "#fbb912",
        }}
      />
    </View>
  );
}
