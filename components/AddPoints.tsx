import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useMemo, useState } from "react";
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
  calculatePoints,
  isEmptyString,
  setData,
  validateAndFormatAmount,
} from "../utils/functions";

type Props = {
  userInfo: string;
};

const CURRENCIES = ["USD", "FCD"];

const AddPoints = ({ userInfo }: Props) => {
  const { shop, setShop } = useShopState();
  const { clients, setClients } = useClientsState();
  const { setTransactions, transactions } = useTransactionState();
  const CurrencyFiltered = CURRENCIES.filter((cu) =>
    cu === "USD" ? shop?.usd !== 0 : cu === "FCD" ? shop?.fcd !== 0 : true
  );

  const [currency, setCurrency] = useState<"USD" | "FCD" | string>(
    CurrencyFiltered.length > 0 ? CurrencyFiltered[0] : "USD"
  );
  const [amount, setAmount] = useState("0");

  const AmountPoints = useMemo(
    () =>
      shop
        ? calculatePoints(
            Number(amount),
            currency,
            shop?.pointUsd,
            shop?.pointFcd,
            shop?.usd,
            shop?.fcd
          )
        : 0,
    [currency, shop, amount]
  );

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const client = clients.find((c) => c.number === userInfo);

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

  const handleAddPoints = async () => {
    if (isEmptyString(amount) || Number(amount) <= 0) {
      setError("Veuillez entrer une somme positive.");
      return;
    }

    if (currency === "USD" && shop?.usd === 0) {
      setError("Aucune conversion USD disponible pour cette boutique.");
      return;
    }

    if (currency === "FCD" && shop?.fcd === 0) {
      setError("Aucune conversion FCD disponible pour cette boutique.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const client = clients.find((c) => c.number === userInfo);

      if (!client) {
        setError("Client non trouvé!");
        return;
      }

      client.points += AmountPoints;
      setClients([...clients]);
      const updateClients = await setData("clients", clients);

      const formTrans: TransactionType = {
        amount: Number(amount),
        number: client.number,
        points: AmountPoints,
        currency: currency as "FCD" | "USD",
        createdAt: Date.now(),
      };

      let transData = [...transactions];
      transData.push(formTrans);

      const updateTransactions = await setData("transactions", transData);
      setTransactions([...transData]);

      if (updateClients && updateTransactions) {
        setTimeout(() => router.push("/"), 2000);
        setAmount("0");
      }
    } catch (error) {
      setError("Impossible de continuer réessayez plus tard!");
    } finally {
      setTimeout(() => setLoading(false), 2000);
    }
  };

  const handleAmountChange = (text: string) => {
    const validatedAmount = validateAndFormatAmount(text);
    if (validatedAmount !== null) {
      setAmount(validatedAmount);
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
          <Text style={styles.title}>Transactions en cours</Text>

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

          <Text style={[styles.subTitle, { marginTop: 20 }]}>
            Veuillez entrer la somme dépensée pour calculer des points à ajouter
          </Text>

          {/* form */}
          <View style={{ width: "100%", gap: 20 }}>
            {/* input amounts*/}
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: "gray",
                padding: 15,
                borderRadius: 5,
                width: "100%",
              }}
              placeholder="Entrez la somme dépensée par le client"
              onChangeText={handleAmountChange}
              keyboardType="number-pad"
              value={amount}
            />
            {/* select currency */}
            <View
              style={{
                gap: 10,
                width: "100%",
              }}
            >
              <Text>Devise</Text>
              {CurrencyFiltered.length > 0 ? (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    gap: 20,
                  }}
                >
                  {CurrencyFiltered.map((curr, index) => (
                    <TouchableOpacity
                      key={index}
                      style={{
                        backgroundColor:
                          currency === curr ? primary : "gainsboro",
                        padding: 10,
                        borderRadius: 5,
                        paddingHorizontal: 20,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      onPress={() => setCurrency(curr as "USD" | "FCD")}
                    >
                      <Text
                        style={{
                          color: curr === currency ? "white" : "black",
                          fontSize: TextSize.md,
                        }}
                      >
                        {curr}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <Text>
                  Aucune devise disponible pour cette transaction. Modifier
                  votre boutique avant de continuer
                </Text>
              )}
            </View>
            {/* Totals amounts */}
            {AmountPoints ? (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ fontSize: TextSize.lg, fontWeight: "bold" }}>
                  Points obtenus: {AmountPoints}
                </Text>
              </View>
            ) : null}

            {/* error and success messages */}
            {error && (
              <Text
                style={{
                  color: "red",
                  fontSize: TextSize.md,
                  marginBottom: 10,
                }}
              >
                {error}
              </Text>
            )}

            {success && (
              <Text
                style={{
                  color: "green",
                  fontSize: TextSize.md,
                  marginBottom: 10,
                }}
              >
                {success}
              </Text>
            )}

            {/* buttons */}
            <View style={{ gap: 20, width: "100%", marginTop: 10 }}>
              <TouchableOpacity
                style={{
                  backgroundColor:
                    CurrencyFiltered.length < 1 ||
                    isEmptyString(amount) ||
                    !currency ||
                    loading ||
                    Number(amount) <= 0.001
                      ? "gainsboro"
                      : primary,
                  padding: 15,
                  borderRadius: 5,
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  borderWidth: 2,
                  borderColor:
                    CurrencyFiltered.length < 1 ||
                    isEmptyString(amount) ||
                    !currency ||
                    loading ||
                    Number(amount) <= 0
                      ? "gainsboro"
                      : primary,
                  elevation: 2,
                }}
                disabled={
                  CurrencyFiltered.length < 1 ||
                  isEmptyString(amount) ||
                  !currency ||
                  loading ||
                  Number(amount) <= 0.001
                }
                onPress={handleAddPoints}
              >
                <Text style={{ color: "white", fontSize: TextSize.md }}>
                  {loading ? "En cours..." : "Ajouter"}
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

export default AddPoints;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    gap: 10,
  },
  title: {
    fontSize: TextSize.xxl2,
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
