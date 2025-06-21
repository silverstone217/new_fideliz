import { FlatList, Platform, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useClientsState, useShopState } from "../lib/store";
import { primary, tintColorLight } from "../constants/Colors";
import { TextSize } from "../constants/Size";
import AntDesign from "@expo/vector-icons/AntDesign";
import { StatusBar } from "expo-status-bar";

const HistoryScreen = () => {
  const { shop, setShop } = useShopState();
  const { clients, setClients } = useClientsState();

  if (!shop || !clients) {
    return null;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={clients}
        keyExtractor={(item) => item.number}
        renderItem={({ item, index }) => (
          <View
            style={[
              styles.item,
              {
                backgroundColor: index % 2 === 0 ? "#bcd" : "#eef",
                shadowColor: "#000000",
                shadowOffset: {
                  width: 0,
                  height: 1,
                },
                shadowOpacity: 0.16,
                shadowRadius: 1.51,
                elevation: 2,
              },
            ]}
          >
            <Text style={styles.number}>+(243)-{item.number}</Text>
            <Text style={styles.points}>
              {item.points}{" "}
              <Text style={{ fontSize: 12 }}>
                point{item.points > 1 ? "s" : ""}
              </Text>
            </Text>
            <Text style={styles.createdAt}>
              {new Date(item.createdAt).toLocaleString("fr-FR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>
          </View>
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 20,
        }}
        style={{
          width: "100%",
        }}
        ListEmptyComponent={
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text>Aucun client enregistré pour le moment.</Text>
          </View>
        }
        ListFooterComponent={null}
        refreshing={false}
        onEndReached={null}
        onEndReachedThreshold={0.5}
      />
      <StatusBar
        style={Platform.OS === "android" ? "dark" : "light"}
        animated
      />
    </View>
  );
};

export default HistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
    width: "100%",
  },
  item: {
    padding: 15,
    width: "100%",
    borderRadius: 10,
    elevation: 2,
    marginBottom: 10,
    gap: 5,
  },
  number: {
    color: "black",
  },
  points: {
    fontSize: TextSize.xxl,
    color: "black",
  },
  createdAt: {
    fontSize: TextSize.sm,
    color: "gray",
  },
});
