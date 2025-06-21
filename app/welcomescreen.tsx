import {
  StyleSheet,
  Image,
  TouchableOpacity,
  Pressable,
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { StatusBar } from "expo-status-bar";
import { useShopState } from "../lib/store";
import { setData, isEmptyString } from "../utils/functions";
import { primary } from "../constants/Colors";
import uuid from "react-native-uuid";
import { TextSize } from "../constants/Size";

const IMAGE1 = require("../assets/images/woman1.jpg");
const IMAGE2 = require("../assets/images/woman2.jpg");
const IMAGE3 = require("../assets/images/woman3.jpg");

const IMAGES = [IMAGE1, IMAGE2, IMAGE3];

const WelcomeScreen = () => {
  const [index, setIndex] = useState(0);
  const router = useRouter();

  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [loading, setLoading] = useState(false);

  const { setShop } = useShopState();

  const handleNext = () => {
    setIndex((prevIndex) => (prevIndex + 1) % IMAGES.length);
  };
  const handlePrevious = () => {
    setIndex((prevIndex) =>
      prevIndex === 0 ? IMAGES.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    const interval = setInterval(handleNext, 8000);
    return () => clearInterval(interval);
  }, [index]);

  const handleSubmit = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const formData = {
        id: uuid.v4().toString(),
        name: name.trim(),
        // address,
        fcd: 0,
        usd: 0,
        pointUsd: 0,
        pointFcd: 0,
      };

      const saveShop = await setData("shop", formData);

      if (!saveShop) {
        setError("Impossible de sauvegarder la boutique!");
        return;
      }

      setTimeout(async () => {
        setSuccess("Votre magasin a été enregistré avec succès!");
        setShop(formData);
        // const isDone = await setData("firstTime", false);
        // setFirstTime(false);
        setName("");
        router.replace("/");
      }, 1500);
    } catch (error) {
      setError("Impossible de continuer réessayez plus tard!");
    } finally {
      setTimeout(() => setLoading(false), 3500);
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
          {/* image */}
          <View style={{ flex: 1, width: "100%", position: "relative" }}>
            <Image
              source={IMAGES[index]}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              key={index}
            />
            {/* navigation buttons */}
            <View style={styles.navigationButtons}>
              {IMAGES.map((_, idx) => (
                <Pressable
                  style={{
                    width: 10,
                    height: 10,
                    backgroundColor: idx === index ? primary : "darkgray",
                    borderRadius: 5,
                  }}
                  key={idx}
                />
              ))}
            </View>
          </View>
          <View style={styles.group2}>
            {/* title */}
            <Text style={styles.title} numberOfLines={2}>
              Bienvenue dans <Text style={{ color: primary }}>Fideliz!</Text>
            </Text>

            {/* description */}
            <Text style={styles.description}>
              Améliorer votre manière de commercer avec vos clients, en
              fournissant un système de fidélisation facile à utiliser.
            </Text>

            {/* form */}
            <View style={styles.form}>
              {/* name input */}
              <TextInput
                style={styles.input}
                placeholder="Entrez le nom de votre Boutique..."
                onChangeText={(text) => setName(text)}
                value={name}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
                placeholderTextColor={"dimgray"}
              />

              {/* error message */}
              {error && (
                <Text
                  style={{
                    color: "red",
                    textAlign: "center",
                    fontSize: TextSize.sm,
                  }}
                >
                  {error}
                </Text>
              )}

              {/* success message */}
              {success && (
                <Text
                  style={{
                    color: "green",
                    textAlign: "center",
                    fontSize: TextSize.sm,
                  }}
                >
                  {success}
                </Text>
              )}

              {/* button */}
              <TouchableOpacity
                style={
                  isEmptyString(name) || loading
                    ? styles.disableButton
                    : styles.button
                }
                onPress={handleSubmit}
                disabled={loading || isEmptyString(name)}
              >
                <Text style={styles.buttonText}>
                  {loading ? "En cours..." : "Commencer"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <StatusBar style="auto" animated />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: TextSize.xxl3,
    fontWeight: "900",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  group2: {
    width: "100%",
    gap: 20,
    padding: 20,
    paddingBottom: 30,
  },
  description: {
    fontSize: TextSize.sm,
    lineHeight: 20,
  },
  buttonText: {
    fontSize: TextSize.lg,
    fontWeight: "bold",
    color: "#fff",
  },
  form: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    gap: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 15,
    width: "100%",
    fontSize: TextSize.md,
  },
  button: {
    backgroundColor: primary,
    paddingVertical: 15,
    borderRadius: 15,
    width: "100%",
    alignItems: "center",
  },
  disableButton: {
    backgroundColor: "gray",
    paddingVertical: 15,
    borderRadius: 15,
    width: "100%",
    alignItems: "center",
  },
  navigationButtons: {
    flexDirection: "row",
    justifyContent: "center",
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    gap: 5,
    zIndex: 1,
    backgroundColor: "transparent",
  },
});
