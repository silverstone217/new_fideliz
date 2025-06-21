import { primary } from "@/constants/Colors";
import {
  useClientsState,
  useShopState,
  useTransactionState,
} from "@/lib/store";
import { ClientType, ShopStateType, TransactionType } from "@/types";
import { getData } from "@/utils/functions";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import "react-native-reanimated";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  const { shop, setShop } = useShopState();
  const { clients, setClients } = useClientsState();
  const { setTransactions, transactions } = useTransactionState();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (error) {
      console.error("Font loading error:", error);
      SplashScreen.hideAsync();
    }
  }, [error]);

  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);

      try {
        const shop = (await getData("shop")) as ShopStateType | null;
        const clients = (await getData("clients")) as ClientType[];
        const transactions = (await getData(
          "transactions"
        )) as TransactionType[];

        setShop(shop ?? null);
        setClients(clients ?? []);
        setTransactions(transactions ?? []);
      } catch (error) {
        console.error("Erreur lors du chargement du shop :", error);
        setShop(null);
        setClients([]);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };
    loadAllData();
  }, [setClients, setShop, setTransactions]);

  useEffect(() => {
    if (loaded) {
      setTimeout(() => {
        SplashScreen.hideAsync();
      }, 500); // Réduisez le délai
    }
  }, [loaded]);

  if (!loaded || loading) {
    // Affichez un écran de chargement
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={primary} />
      </View>
    );
  }

  return (
    <>
      <Stack initialRouteName={shop === null ? "welcomescreen" : "index"}>
        <Stack.Protected guard={shop === null}>
          <Stack.Screen name="welcomescreen" options={{ headerShown: false }} />
        </Stack.Protected>

        <Stack.Protected guard={shop !== null}>
          <Stack.Screen
            name="index"
            options={{ headerShown: false, title: "Accueil" }}
          />
          <Stack.Screen
            name="modal"
            options={{
              presentation: "modal",
              title: "Modifier votre boutique",
            }}
          />
          <Stack.Screen
            name="ModalQrCodeReader"
            options={{ presentation: "modal", title: "Scanner le code QR" }}
          />
          <Stack.Screen
            name="action"
            options={{ title: "Vos actions", presentation: "card" }}
          />

          <Stack.Screen
            name="history"
            options={{ presentation: "modal", title: "Repertoire" }}
          />
          <Stack.Screen
            name="transactions"
            options={{ presentation: "modal", title: "Transactions" }}
          />
          <Stack.Screen
            name="list"
            options={{ presentation: "modal", title: "Liste de transactions" }}
          />
        </Stack.Protected>
      </Stack>

      <StatusBar style="auto" animated />
    </>
  );
}
