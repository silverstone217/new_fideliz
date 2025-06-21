import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useMemo } from "react";
import { useTransactionState } from "../lib/store";
import { StatusBar } from "expo-status-bar";
import {
  convertToFCD,
  convertToUSD,
  getAmountByCurrency,
  getAmountByCurrencyAndDate,
} from "../utils/functions";
import { primary } from "../constants/Colors";
import { TextSize } from "../constants/Size";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";

const Transactions = () => {
  const { setTransactions, transactions } = useTransactionState();
  const TotalGeneralUSD = useMemo(
    () => getAmountByCurrency("USD", transactions),
    [transactions]
  );

  const TotalGeneralFCD = useMemo(
    () => getAmountByCurrency("FCD", transactions),
    [transactions]
  );

  const TotalUSDByDay = useMemo(
    () => getAmountByCurrencyAndDate("USD", transactions, "d"),
    [transactions]
  );

  const TotalUSDByMonth = useMemo(
    () => getAmountByCurrencyAndDate("USD", transactions, "m"),
    [transactions]
  );
  const TotalUSDByYear = useMemo(
    () => getAmountByCurrencyAndDate("USD", transactions, "y"),
    [transactions]
  );

  const TotalFCDByDay = useMemo(
    () => getAmountByCurrencyAndDate("FCD", transactions, "d"),
    [transactions]
  );

  const TotalFCDByMonth = useMemo(
    () => getAmountByCurrencyAndDate("FCD", transactions, "m"),
    [transactions]
  );
  const TotalFCDByYear = useMemo(
    () => getAmountByCurrencyAndDate("FCD", transactions, "y"),
    [transactions]
  );

  const amountsUSD = useMemo(
    () => [TotalGeneralUSD, TotalUSDByDay, TotalUSDByMonth, TotalUSDByYear],
    [TotalUSDByDay, TotalUSDByYear, TotalUSDByMonth, TotalGeneralUSD]
  );

  const amountsFCD = [
    TotalGeneralFCD,
    TotalFCDByDay,
    TotalFCDByMonth,
    TotalFCDByYear,
  ];

  const dates = ["Total general", "Quotidien", "Mensuel", "Annuel"];

  const currencies = ["USD", "FCD"];

  // Format des données pour VictoryLine
  const chartDataUSD = dates.map((date, index) => ({
    date: date,
    revenu: amountsUSD[index],
  }));

  const chartDataFCD = dates.map((date, index) => ({
    date: date,
    revenus: amountsFCD[index],
  }));

  const router = useRouter();

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        {/* USD */}
        <View
          style={{
            padding: 10,
            width: "100%",
            backgroundColor: primary,
            borderRadius: 15,
            gap: 20,
          }}
        >
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: TextSize.md,
                fontWeight: "600",
              }}
            >
              Transactions en USD
            </Text>
            <FontAwesome6 name="hand-holding-dollar" size={20} color="white" />
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
            {/* today */}
            <View
              style={{
                padding: 10,
                gap: 2.5,
                flex: 1,
                borderRadius: 10,
                backgroundColor: "rgba(255, 255, 255, 0.3)",
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: TextSize.sm,
                  fontWeight: "600",
                }}
              >
                {convertToUSD(TotalUSDByDay)}
              </Text>
              <Text
                style={{
                  color: "gainsboro",
                  fontSize: TextSize.xs,
                }}
              >
                Quotidien
              </Text>
            </View>

            {/* moth */}
            <View
              style={{
                padding: 10,
                gap: 2.5,
                flex: 1,
                borderRadius: 10,
                backgroundColor: "rgba(255, 255, 255, 0.4)",
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: TextSize.sm,
                  fontWeight: "600",
                }}
              >
                {convertToUSD(TotalUSDByMonth)}
              </Text>
              <Text
                style={{
                  color: "gainsboro",
                  fontSize: TextSize.xs,
                }}
              >
                Mensuel
              </Text>
            </View>

            {/* Annuel */}
            <View
              style={{
                padding: 10,
                gap: 2.5,
                flex: 1,
                borderRadius: 10,
                backgroundColor: "rgba(255, 255, 255, 0.5)",
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: TextSize.sm,
                  fontWeight: "600",
                }}
              >
                {convertToUSD(TotalUSDByYear)}
              </Text>
              <Text
                style={{
                  color: "gainsboro",
                  fontSize: TextSize.xs,
                }}
              >
                Annuel
              </Text>
            </View>
          </View>
        </View>

        {/* FCD */}

        <View
          style={{
            padding: 10,
            width: "100%",
            backgroundColor: "darkgray",
            borderRadius: 15,
            gap: 20,
          }}
        >
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: TextSize.md,
                fontWeight: "600",
              }}
            >
              Transactions en Franc
            </Text>
            <FontAwesome6 name="money-bill-transfer" size={20} color="white" />
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
            {/* today */}
            <View
              style={{
                padding: 10,
                gap: 2.5,
                flex: 1,
                borderRadius: 10,
                backgroundColor: "rgba(255, 255, 255, 0.3)",
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: TextSize.sm,
                  fontWeight: "600",
                }}
              >
                {convertToFCD(TotalFCDByDay)}
              </Text>
              <Text
                style={{
                  color: "white",
                  fontSize: TextSize.xs,
                }}
              >
                Quotidien
              </Text>
            </View>

            {/* moth */}
            <View
              style={{
                padding: 10,
                gap: 2.5,
                flex: 1,
                borderRadius: 10,
                backgroundColor: "rgba(255, 255, 255, 0.4)",
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: TextSize.sm,
                  fontWeight: "600",
                }}
              >
                {convertToFCD(TotalFCDByMonth)}
              </Text>
              <Text
                style={{
                  color: "white",
                  fontSize: TextSize.xs,
                }}
              >
                Mensuel
              </Text>
            </View>

            {/* Annuel */}
            <View
              style={{
                padding: 10,
                gap: 2.5,
                flex: 1,
                borderRadius: 10,
                backgroundColor: "rgba(255, 255, 255, 0.5)",
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: TextSize.sm,
                  fontWeight: "600",
                }}
              >
                {convertToFCD(TotalFCDByYear)}
              </Text>
              <Text
                style={{
                  color: "white",
                  fontSize: TextSize.xs,
                }}
              >
                Annuel
              </Text>
            </View>
          </View>
        </View>

        {/* last transactions */}
        <View style={{ width: "100%", gap: 10 }}>
          <View
            style={{
              width: "100%",
              gap: 10,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottomWidth: 2,
              paddingBottom: 5,
            }}
          >
            <Text style={{ fontSize: TextSize.xxl, fontWeight: "600" }}>
              Dernière transactions
            </Text>
            <Pressable onPress={() => router.push("/list")}>
              <MaterialIcons name="read-more" size={30} color="black" />
            </Pressable>
          </View>

          {/* list */}
          <View
            style={{
              gap: 15,
            }}
          >
            {transactions.length > 0 ? (
              transactions
                .sort((a, b) => {
                  if (a.createdAt < b.createdAt) return 1;
                  if (a.createdAt > b.createdAt) return -1;
                  return 0;
                })
                .slice(0, 5)
                .map((item, idx) => (
                  <View
                    style={{
                      gap: 5,
                      backgroundColor: idx % 2 === 0 ? "#C7D2E7" : "#eef",
                      padding: 10,
                      borderRadius: 5,
                      shadowColor: "#000000",
                      shadowOffset: {
                        width: 0,
                        height: 1,
                      },
                      shadowOpacity: 0.16,
                      shadowRadius: 1.51,
                      elevation: 2,
                    }}
                    key={idx}
                  >
                    <Text>+(243)-{item.number}</Text>
                    <View
                      style={{
                        width: "100%",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 20,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: TextSize.md,
                          fontWeight: "600",
                          color: item.amount > 1 ? "green" : "tomato",
                        }}
                      >
                        {item.points}{" "}
                        <Text>Pt{item.points > 1 ? "s" : ""}</Text>
                      </Text>
                      <Text
                        style={{
                          fontSize: TextSize.md,
                          fontWeight: "600",
                        }}
                      >
                        {item.currency === "USD"
                          ? convertToUSD(item.amount)
                          : convertToFCD(item.amount)}
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontSize: 10,
                        opacity: 0.6,
                      }}
                    >
                      {new Date(item.createdAt).toLocaleDateString("fr-FR")}
                    </Text>
                  </View>
                ))
            ) : (
              <View
                style={{ paddingTop: 20, width: "100%", alignItems: "center" }}
              >
                <Text style={{ color: "dimgray" }}>
                  Aucune transaction disponible
                </Text>
              </View>
            )}
          </View>
        </View>

        <StatusBar
          style={Platform.OS === "android" ? "dark" : "light"}
          animated
        />
      </View>
    </ScrollView>
  );
};

export default Transactions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 30,
  },
});
