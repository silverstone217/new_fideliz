import { Redirect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { primary } from "../constants/Colors";
import { TextSize } from "../constants/Size";
import { useShopState } from "../lib/store";
import {
  isEmptyString,
  setData,
  validateAndFormatAmount,
} from "../utils/functions";

const ModalScreen = () => {
  const { shop, setShop } = useShopState();

  const [name, setName] = useState(shop ? shop.name : "");
  const [usd, setUsd] = useState(shop ? shop.usd.toString() : "0");
  const [fcd, setFCD] = useState(shop ? shop.fcd.toString() : "0");
  const [pointFcd, setPointFcd] = useState(
    shop ? shop.pointFcd.toString() : "0"
  );
  const [pointUsd, setPointUsd] = useState(
    shop ? shop.pointUsd.toString() : "0"
  );

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

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

  const isButtonDisabled = useMemo(() => {
    if (
      isEmptyString(name) ||
      loading ||
      isEmptyString(usd) ||
      isEmptyString(fcd) ||
      isEmptyString(pointUsd) ||
      isEmptyString(pointFcd) ||
      (name === shop?.name &&
        usd === shop?.usd.toString() &&
        fcd === shop?.fcd.toString() &&
        pointFcd === shop?.pointFcd.toString() &&
        pointUsd === shop?.pointUsd.toString()) // check if the fields are the same as the current shop.
    ) {
      return true;
    }
    return false;
  }, [name, usd, fcd, pointUsd, pointFcd, shop, loading]);

  if (!shop) {
    return null; // return null if shop is not defined.
  }

  // handle submit
  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const formData = {
        id: shop.id,
        name: name.trim(),
        // address,
        fcd: fcd ? Number(fcd) : 0,
        usd: usd ? Number(usd) : 0,
        pointUsd: pointUsd ? Number(pointUsd) : 0,
        pointFcd: pointFcd ? Number(pointFcd) : 0,
      };

      const saveShop = await setData("shop", formData);

      if (!saveShop) {
        setError("Impossible de sauvegarder la boutique!");
        return;
      }
      setTimeout(() => {
        setSuccess("Votre magasin a été enregistré avec succès!");
        setShop(formData);
      }, 1500);
    } catch (error) {
      setError("Impossible de continuer réessayez plus tard!");
    } finally {
      setTimeout(() => setLoading(false), 3500);
    }
  };

  const handleUSDChange = (text: string) => {
    const validatedAmount = validateAndFormatAmount(text);
    if (validatedAmount !== null) {
      setUsd(validatedAmount);
    }
  };

  const handleFCDChange = (text: string) => {
    const validatedAmount = validateAndFormatAmount(text);
    if (validatedAmount !== null) {
      setFCD(validatedAmount);
    }
  };

  const handleUSDPointsChange = (text: string) => {
    const validatedAmount = validateAndFormatAmount(text);
    if (validatedAmount !== null) {
      setPointUsd(validatedAmount);
    }
  };

  const handleFCDPointsChange = (text: string) => {
    const validatedAmount = validateAndFormatAmount(text);
    if (validatedAmount !== null) {
      setPointFcd(validatedAmount);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, width: "100%" }}
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
          {/* title and desc */}
          <View style={{ gap: 10, width: "100%" }}>
            <Text style={styles.description}>
              Tous les champs ayant * sont necessaires pour valider votre
              boutique. Laissez à 0 si vous comptez pas utiliser une devise.
            </Text>
          </View>

          {/* form */}
          <View style={styles.form}>
            {/* Name fields */}
            <View style={{ gap: 10, width: "100%" }}>
              <Text style={styles.label}>Nom de la boutique*</Text>
              <TextInput
                defaultValue={name}
                onChangeText={setName}
                placeholder="ex: Maman Mapasa"
                returnKeyType="next"
                placeholderTextColor={"dimgray"}
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.input}
              />
            </View>

            {/* USD and USD POINts */}
            <View
              style={{
                gap: 20,
                width: "100%",
                alignItems: "center",
                justifyContent: "space-between",
                flexDirection: "row",
              }}
            >
              {/* USD fields */}
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Montant USD*</Text>
                <TextInput
                  defaultValue={usd}
                  onChangeText={handleUSDChange}
                  placeholder="ex: 20"
                  returnKeyType="next"
                  placeholderTextColor={"dimgray"}
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={styles.input}
                  keyboardType="number-pad"
                />
              </View>
              {/* USD Points fields */}
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Points par USD*</Text>
                <TextInput
                  defaultValue={pointUsd}
                  onChangeText={handleUSDPointsChange}
                  placeholder="ex: 2"
                  returnKeyType="next"
                  placeholderTextColor={"dimgray"}
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={styles.input}
                  keyboardType="number-pad"
                />
              </View>
            </View>

            {/* FCD and FCD Points */}
            <View
              style={{
                gap: 20,
                width: "100%",
                alignItems: "center",
                justifyContent: "space-between",
                flexDirection: "row",
              }}
            >
              {/* FCD fields */}
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Montant FCD*</Text>
                <TextInput
                  defaultValue={fcd}
                  onChangeText={handleFCDChange}
                  placeholder="ex: 20"
                  returnKeyType="next"
                  placeholderTextColor={"dimgray"}
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={styles.input}
                  keyboardType="number-pad"
                />
              </View>
              {/* FCD Points fields */}
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Points par FCD*</Text>
                <TextInput
                  defaultValue={pointFcd}
                  onChangeText={handleFCDPointsChange}
                  placeholder="ex: 2"
                  returnKeyType="done"
                  placeholderTextColor={"dimgray"}
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={styles.input}
                  keyboardType="number-pad"
                />
              </View>
            </View>

            {/* error message */}

            {error && <Text style={{ color: "red" }}>{error}</Text>}

            {/* success message */}
            {success && (
              <Text style={{ color: "green" }}>
                Boutique mise à jour avec succès.
              </Text>
            )}

            {/* submit button */}
            {/* submit button */}
            <TouchableOpacity
              style={isButtonDisabled ? styles.disableButton : styles.button}
              disabled={isButtonDisabled}
              onPress={handleSubmit}
            >
              <Text
                style={{
                  fontSize: TextSize.lg,
                  fontWeight: "bold",
                  color: "white",
                }}
              >
                {loading ? "En cours..." : "Valider"}
              </Text>
            </TouchableOpacity>
          </View>
          <StatusBar style="dark" />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ModalScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 20,
    width: "100%",
    gap: 25,
  },
  description: {
    fontSize: TextSize.sm,
    color: "#666",
  },
  form: {
    width: "100%",
    gap: 15,
  },
  label: {
    fontSize: TextSize.sm,
    color: "#666",
  },
  input: {
    borderWidth: 1,
    borderColor: "black",
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 5,
    width: "100%",
  },
  disableButton: {
    backgroundColor: "#ccc",
    paddingVertical: 15,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
    opacity: 0.5,
    marginTop: 10,
  },
  button: {
    backgroundColor: primary,
    paddingVertical: 15,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
});
