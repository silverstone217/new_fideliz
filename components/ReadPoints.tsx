import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { primary } from "../constants/Colors";
import { TextSize } from "../constants/Size";
import {
  useClientsState,
  useShopState,
  useTransactionState,
} from "../lib/store";
import { TransactionType } from "../types";
import {
  isEmptyString,
  setData,
  validateAndFormatAmount,
} from "../utils/functions";

type Props = {
  userInfo: string;
};

const ReadPoints = ({ userInfo }: Props) => {
  const { shop, setShop } = useShopState();
  const { clients, setClients } = useClientsState();
  const client = clients.find((c) => c.number === userInfo);
  const date = client
    ? new Date(client?.createdAt).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "25-May-2015";

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setTransactions, transactions } = useTransactionState();

  const [points, setPoints] = useState("0");

  useEffect(() => {
    if (error) {
      setTimeout(() => setError(""), 3000); // clear error after 3 seconds.
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      setTimeout(() => setSuccess(""), 3000); // clear success after 3 seconds.
    }
  }, [success]);

  if (!client) {
    // setError("Client non trouvé.");
    return null;
  }

  const handlePointsChange = (text: string) => {
    const validatedAmount = validateAndFormatAmount(text);
    if (validatedAmount !== null) {
      setPoints(validatedAmount);
    }
  };

  const handleReadPoints = async () => {
    if (isEmptyString(points) || Number(points) <= 0) {
      setError("Veuillez entrer une somme positive.");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const newPoints = client.points - Number(points);
      if (newPoints < 0) {
        setError("Le client ne possède pas assez de points.");
        return;
      }

      client.points = newPoints;
      setClients([...clients]);
      setSuccess("Points utilisés avec succès!");
      setPoints("");

      const updateClients = await setData("clients", clients);

      const formTrans: TransactionType = {
        amount: 0,
        number: client.number,
        points: -Number(points),
        currency: "USD",
        createdAt: Date.now(),
      };

      let transData = [...transactions];
      transData.push(formTrans);

      const updateTransactions = await setData("transactions", transData);
      setTransactions([...transData]);

      if (updateClients && updateTransactions)
        setTimeout(() => router.push("/"), 2000);
    } catch (error) {
      setError("Impossible de continuer réessayez plus tard!");
    } finally {
      setTimeout(() => setLoading(false), 2000);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={100}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{ flex: 1 }}>
        <View style={styles.container}>
          <Text style={styles.title}>Lecture des points</Text>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              padding: 20,
              gap: 10,
              backgroundColor: "dodgerblue",
              width: "100%",
              borderRadius: 15,
            }}
          >
            <Text style={{ color: "white", fontSize: TextSize.md }}>
              Client: {client?.number}
            </Text>
            <Text style={{ color: "white", fontSize: TextSize.xxl2 }}>
              {client?.points} <Text style={{ fontSize: 11 }}>pts</Text>
            </Text>
          </View>
          <Text style={[styles.subTitle, { marginVertical: 10 }]}>
            Veuillez entrer le nombre de points de fidélité du client à
            utiliser.
          </Text>

          {/* <Text style={styles.subTitle}>A rejoint le {date}</Text> */}

          {/* form */}
          <View style={{ gap: 10, width: "100%" }}>
            {/* points */}
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: "gray",
                padding: 15,
                borderRadius: 5,
                width: "100%",
              }}
              placeholder="Nombre de points à utiliser..."
              onChangeText={handlePointsChange}
              value={points}
              keyboardType="number-pad"
              returnKeyType="done"
            />

            {/* error msg */}
            {error && (
              <Text style={{ color: "red", marginBottom: 10 }}>{error}</Text>
            )}

            {/* success message */}
            {success && (
              <Text style={{ color: "green", marginBottom: 10 }}>
                {success}
              </Text>
            )}

            {/* submit button */}
            {/* buttons */}
            <View style={{ gap: 20, width: "100%", marginTop: 10 }}>
              <TouchableOpacity
                style={{
                  backgroundColor:
                    isEmptyString(points) ||
                    loading ||
                    Number(points) > client?.points ||
                    Number(points) <= 0
                      ? "gainsboro"
                      : primary,
                  padding: 15,
                  borderRadius: 5,
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  borderWidth: 2,
                  borderColor:
                    isEmptyString(points) ||
                    loading ||
                    Number(points) > client?.points ||
                    Number(points) <= 0
                      ? "gainsboro"
                      : primary,
                  elevation: 2,
                }}
                disabled={
                  isEmptyString(points) ||
                  loading ||
                  Number(points) > client?.points ||
                  Number(points) <= 0
                }
                onPress={handleReadPoints}
              >
                <Text style={{ color: "white", fontSize: TextSize.md }}>
                  {loading ? "En cours..." : "Utiliser"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  padding: 10,
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={() => router.push("/")}
              >
                <Text style={{ color: "black", fontSize: TextSize.md }}>
                  Annuler
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <StatusBar style="dark" animated />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default ReadPoints;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    gap: 5,
  },
  title: {
    fontSize: TextSize.xxl2,
    marginBottom: 15,
  },
  subTitle: {
    fontSize: TextSize.sm,
    color: "dimgray",
    width: "100%",
  },
  userInfo: {
    fontSize: TextSize.sm,
    color: "black",
  },
});
