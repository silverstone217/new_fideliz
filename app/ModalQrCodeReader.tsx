import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { CameraView, useCameraPermissions } from "expo-camera";
import { primary } from "../constants/Colors";
import { TextSize } from "../constants/Size";
import { Redirect, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useClientsState } from "../lib/store";
import { setData } from "../utils/functions";

const { width, height } = Dimensions.get("window");
const overlayWidth = 300; // Largeur du carré central
const overlayHeight = 300; // Hauteur du carré central

const ModalQrCodeReader = () => {
  const [permission, requestPermission] = useCameraPermissions();

  const [userInfo, setUserInfo] = useState("");
  const { clients, setClients } = useClientsState();

  const router = useRouter();

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 20,
          gap: 30,
        }}
      >
        <Text
          style={{
            fontFamily: "Lato_400Regular",
            fontSize: 20,
          }}
        >
          Il faut votre autorisation pour utiliser la caméra afin de scanner le
          QR Code.
        </Text>
        <TouchableOpacity
          onPress={() => {
            requestPermission();
          }}
          disabled={false}
          style={{
            backgroundColor: primary,
            padding: 15,
            borderRadius: 5,
            elevation: 2,
          }}
        >
          <Text
            style={{
              fontSize: TextSize.md,

              color: "white",
            }}
          >
            {" "}
            Demander la permission
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const addUserIfNotExist = async (number: string) => {
    setUserInfo(number);
    const client = clients.find((c) => c.number === number);
    if (!client) {
      setClients([
        ...clients,
        { number: number, points: 0, createdAt: Date.now() },
      ]);
    }

    await setData("clients", clients);
  };

  if (userInfo) {
    return (
      <Redirect
        href={{
          pathname: "/action",
          params: { data: userInfo },
        }}
      />
    );
  }

  if (!userInfo) {
    return (
      <View style={{ flex: 1, position: "relative" }}>
        <CameraView
          style={StyleSheet.absoluteFillObject}
          facing="back"
          onBarcodeScanned={({ data }) => {
            // console.log("data: " + data);
            // Add user if Not exist already
            // const client = clients.find((c) => c.number === data);
            // if (!client) {
            //   setClients([
            //     ...clients,
            //     { number: data, points: 0, createdAt: Date.now() },
            //   ]);
            // }
            const addUser = async () => await addUserIfNotExist(data);
            addUser();
          }}
        />
        {/* Overlay */}
        <View style={styles.overlay}>
          <View style={styles.topMask} />
          <View style={styles.centerRow}>
            <View style={styles.sideMask} />
            <View style={styles.scannerBox} />
            <View style={styles.sideMask} />
          </View>
          <View style={styles.bottomMask} />
        </View>
        <StatusBar style="dark" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text>Modal Qr Code Reader</Text>
      <Text>QR Code Scanned: {userInfo}</Text>
      <TouchableOpacity
        onPress={() => setUserInfo("")}
        style={{
          padding: 15,
          backgroundColor: primary,
          borderRadius: 5,
          elevation: 2,
          marginTop: 20,
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>Annuler</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ModalQrCodeReader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    width: "100%",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width,
    height,
    zIndex: 1,
  },
  topMask: {
    height: (height - overlayHeight) / 2, // Utilise height au lieu de flex
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  centerRow: {
    flexDirection: "row",
    height: overlayHeight,
  },
  sideMask: {
    width: (width - overlayWidth) / 2,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  scannerBox: {
    width: overlayWidth,
    height: overlayHeight,
    borderWidth: 2,
    borderColor: "#fff",
    backgroundColor: "transparent",
  },
  bottomMask: {
    height: (height - overlayHeight) / 2, // Utilise height au lieu de flex
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  guide: {
    width: width * 0.8, // Width of the guide rectangle
    height: width * 0.8, // Height of the guide rectangle
    borderWidth: 2,
    borderColor: "white", // Color of the border
    borderRadius: 10, // Rounded corners
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
});
