import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { primary, tintColorLight } from "../constants/Colors";
import { TextSize } from "../constants/Size";
import { useClientsState, useShopState } from "../lib/store";
import {
  clearData,
  convertToFCD,
  convertToUSD,
  isEmptyString,
  setData,
} from "../utils/functions";

const { height: HEIGHT } = Dimensions.get("window");
const DATE = new Date().getFullYear();

export default function HomeScreen() {
  const { shop, setShop } = useShopState();
  const { clients, setClients } = useClientsState();
  const [userLink, setUserLink] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const deleteAllKeys = async () => {
    Alert.alert(
      "Confirmation",
      "Êtes-vous sûr de vouloir supprimer toutes les données ?",
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            clearData();
            setShop(null);
            setClients([]);
            router.replace("/welcomescreen"); // navigate to welcome screen.
          },
        },
      ],
      { cancelable: false }
    );
  };

  if (!shop) {
    return null;
  }

  const handleRedirectUserByNumber = async () => {
    if (isEmptyString(userLink)) {
      setError("Veuillez entrer un numéro de client.");
      return;
    }

    const addUserIfNotExist = async (number: string) => {
      const client = clients.find((c) => c.number === number);
      if (!client) {
        setClients([
          ...clients,
          { number: number, points: 0, createdAt: Date.now() },
        ]);
      }

      const added = await setData("clients", clients);
      if (!added) {
        setError("Impossible d'ajouter le client!");
        return;
      }

      setTimeout(
        () =>
          router.push({
            pathname: "/action",
            params: { data: number },
          }),
        1000
      );
    };

    try {
      await addUserIfNotExist(userLink);
      setUserLink("");
    } catch (error) {
      setError("Impossible de continuer réessayez plus tard!");
    } finally {
      setTimeout(() => setLoading(false), 2000);
    }
  };

  if (!shop) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: TextSize.xxl }}>Aucun magasin trouvé.</Text>
        <Pressable
          onPress={deleteAllKeys}
          style={{
            marginTop: 20,
            paddingVertical: 15,
            backgroundColor: primary,
            borderRadius: 10,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 20,
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>
            Configurer votre boutique
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0} // Ajustez cette valeur
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          width: "100%",
        }}
      >
        <View style={styles.container}>
          {/* Header Top */}
          <View style={styles.headerTop}>
            {/* Texts */}
            <Text style={styles.headerTopText} numberOfLines={1}>
              {shop.name}
            </Text>
            <Text style={styles.headerTopSubText}>
              Bienvenue, votre boutique est ouverte!
            </Text>

            {/* History */}
            <View style={styles.history}>
              {/* first part */}
              <View
                style={{
                  flexDirection: "row",
                  width: "100%",
                  gap: 10,
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                {/* group 1 */}
                <View
                  style={{
                    flexDirection: "row",
                    gap: 10,
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <FontAwesome name="star" size={35} color="#FFD700" />
                  <View>
                    <Text
                      style={{
                        fontSize: TextSize.lg,
                        fontWeight: "bold",
                      }}
                      numberOfLines={1}
                    >
                      {clients.length}
                    </Text>
                    <Text
                      style={{
                        fontSize: TextSize.sm,
                        color: "gray",
                      }}
                    >
                      clients fideles
                    </Text>
                  </View>
                </View>

                {/* group 2 */}
                <TouchableOpacity
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 10,
                    borderRadius: 5,
                    backgroundColor: "#F0F0F2",
                    elevation: 2,
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                    gap: 10,
                  }}
                  onPress={() => router.push("/history")}
                >
                  <FontAwesome name="history" size={20} color="dodgerblue" />
                  <Text style={{ fontSize: TextSize.sm, color: primary }}>
                    Repertoire
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Actions Main */}
          <View style={styles.actionsMain}>
            {/* conversions */}
            <View style={styles.conversions}>
              {/* TOP */}
              <View
                style={{
                  flexDirection: "row",
                  gap: 10,
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ fontSize: TextSize.lg, fontWeight: "bold" }}>
                  Conversions
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-end",

                    alignItems: "center",
                    gap: 15,
                  }}
                >
                  <TouchableOpacity onPress={() => router.push("/modal")}>
                    <FontAwesome6 name="edit" size={26} color="black" />
                  </TouchableOpacity>

                  <Pressable onPress={deleteAllKeys}>
                    <FontAwesome6 name="trash" size={26} color="#f1948a" />
                  </Pressable>
                </View>
              </View>
              {/* Currency */}
              <View
                style={{
                  backgroundColor: "#C7D2E7",
                  padding: 15,
                  width: "100%",
                  gap: 10,
                }}
              >
                {/* USD TO POINTS */}
                <View
                  style={{
                    flexDirection: "row",
                    gap: 10,
                    alignItems: "center",
                    width: "100%",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={{ fontSize: TextSize.md }}>
                    {convertToUSD(shop.usd)}{" "}
                  </Text>
                  {/* <Text
                    style={{
                      fontSize: TextSize.md,
                      marginRight: 10,
                      alignItems: "center",
                      textAlign: "center",
                    }}
                  >
                    →
                  </Text> */}
                  <Text style={{ fontSize: TextSize.md }}>
                    {shop.pointUsd} Points
                  </Text>
                </View>
                {/*FCD TO POINTS */}
                <View
                  style={{
                    flexDirection: "row",
                    gap: 10,
                    alignItems: "center",
                    width: "100%",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={{ fontSize: TextSize.md }}>
                    {convertToFCD(shop.fcd)}
                  </Text>
                  {/* <Text
                    style={{
                      fontSize: TextSize.md,
                      marginRight: 10,
                      alignItems: "center",
                      textAlign: "center",
                    }}
                  >
                    →
                  </Text> */}
                  <Text style={{ fontSize: TextSize.md }}>
                    {shop.pointFcd} Points
                  </Text>
                </View>
              </View>
            </View>

            {/* Actions */}
            <View style={styles.actions}>
              <Text style={{ fontSize: TextSize.lg, fontWeight: "bold" }}>
                Mes actions
              </Text>

              {/* actions */}
              <View style={{ gap: 10 }}>
                {/* Scan QR code */}
                <TouchableOpacity
                  style={[
                    styles.buttonX,
                    { backgroundColor: !loading ? primary : "gray" },
                  ]}
                  disabled={loading}
                  onPress={() => router.push("/ModalQrCodeReader")}
                >
                  <FontAwesome name="qrcode" size={24} color="white" />
                  <Text style={{ fontSize: TextSize.md, color: "white" }}>
                    Scanner le QR Code
                  </Text>
                </TouchableOpacity>

                {/* Input Text */}
                <View style={styles.inputGroup}>
                  <TextInput
                    style={styles.input}
                    placeholder="Entrez le numero"
                    placeholderTextColor="gray"
                    returnKeyType="done"
                    onChangeText={(text) => setUserLink(text)}
                    value={userLink}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="phone-pad"
                    maxLength={9}
                  />
                  <TouchableOpacity
                    style={{
                      paddingHorizontal: 15,
                      paddingVertical: 10,
                      borderRadius: 5,
                      backgroundColor:
                        loading || isEmptyString(userLink) ? "gray" : primary,
                      elevation: 2,
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "row",
                      gap: 10,
                    }}
                    disabled={loading || isEmptyString(userLink)}
                    onPress={() => handleRedirectUserByNumber()}
                  >
                    <Entypo name="arrow-right" size={22} color="white" />
                  </TouchableOpacity>
                </View>
                {userLink && userLink.length > 4 ? (
                  <Text
                    style={{
                      fontSize: TextSize.sm,
                      color: "gray",
                    }}
                  >
                    Le numero ne doit pas avoir un 0 au debut ou un +243
                  </Text>
                ) : null}

                {/* transactions */}
                <TouchableOpacity
                  style={[
                    styles.buttonX,
                    {
                      backgroundColor: !loading ? tintColorLight : "gray",
                      marginTop: 15,
                    },
                  ]}
                  disabled={loading}
                  onPress={() => router.push("/transactions")}
                >
                  <AntDesign name="linechart" size={24} color="white" />
                  <Text style={{ fontSize: TextSize.md, color: "white" }}>
                    Transactions
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* <TouchableOpacity onPress={deleteAllKeys}>
            <Text>Supprimer toutes les données</Text>
          </TouchableOpacity> */}

          {/* footer */}
          <View
            style={{
              // position: "absolute",
              // bottom: 0,
              width: "100%",
              padding: 20,
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: TextSize.xs, color: "dimgray" }}>
              Fideliz by SERVI Group © {DATE}
            </Text>
          </View>

          <StatusBar style="light" animated />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
  },
  headerTop: {
    backgroundColor: primary,
    paddingHorizontal: 20,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    paddingTop: 50,
    paddingBottom: 25,
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "lightgray",
    height: HEIGHT / 3.3,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerTopText: {
    fontSize: TextSize.xxl2,
    fontWeight: "bold",
    color: "#fff",
    textTransform: "capitalize",
  },
  headerTopSubText: {
    fontSize: TextSize.sm,
    color: "gainsboro",
    lineHeight: 20,
  },
  history: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "white",
    borderRadius: 10,
    width: "100%",
    justifyContent: "center",
    marginTop: 20,
    flex: 1,
  },
  actionsMain: {
    flex: 1,
    width: "100%",
    padding: 20,
    marginTop: 10,
  },
  conversions: {
    width: "100%",
    gap: 10,
  },
  actions: {
    width: "100%",
    paddingTop: 25,
    gap: 10,
  },
  buttonX: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 5,
    backgroundColor: primary,
    elevation: 2,
    marginBottom: 10,
    width: "100%",
  },
  inputGroup: {
    flexDirection: "row",
    gap: 15,
    width: "100%",
    alignItems: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 5,
    flex: 1,
  },
});
