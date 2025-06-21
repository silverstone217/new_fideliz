import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { Redirect, useLocalSearchParams } from "expo-router";
import { TextSize } from "../constants/Size";
import { primary } from "../constants/Colors";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AddPoints from "../components/AddPoints";
import { StatusBar } from "expo-status-bar";
import ReadPoints from "../components/ReadPoints";

const ActionScreen = () => {
  const params = useLocalSearchParams();
  const { data } = params;

  const [isAdding, setIsAdding] = useState(false);
  const [isReading, setIsReading] = useState(false);

  if (!data) {
    return <Redirect href={"/"} />;
  }

  if (isAdding) {
    return <AddPoints userInfo={data as string} />;
  }
  if (isReading) {
    return <ReadPoints userInfo={data as string} />;
  }

  return (
    <View style={styles.container}>
      <View
        style={{
          gap: 30,
          width: "100%",
        }}
      >
        {/* client */}
        <Text style={styles.title}>
          Client: <Text style={{ fontWeight: "bold" }}>{data}</Text>
        </Text>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.action}
            onPress={() => {
              setIsAdding(true);
              setIsReading(false);
            }}
          >
            <MaterialCommunityIcons name="hand-coin" size={22} color="white" />
            <Text style={styles.actionText}>Ajouter des points</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.action,
              {
                backgroundColor: "white",
                borderColor: primary,
                shadowColor: primary,
              },
            ]}
            onPress={() => {
              setIsAdding(false);
              setIsReading(true);
            }}
          >
            <FontAwesome6 name="coins" size={22} color="black" />
            <Text style={[styles.actionText, { color: "black" }]}>
              Utiliser des points
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <StatusBar style="dark" animated />
    </View>
  );
};

export default ActionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
    width: "100%",
  },
  title: {
    fontSize: TextSize.lg,
  },
  actions: {
    width: "100%",
    gap: 20,
  },
  action: {
    backgroundColor: primary,
    padding: 15,
    borderRadius: 5,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: primary,
    gap: 20,
    flexDirection: "row",
    elevation: 2,
  },
  actionText: {
    fontSize: TextSize.md,
    color: "white",
  },
});
