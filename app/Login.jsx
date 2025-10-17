/* eslint-disable react/no-unescaped-entities */
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ImageBackground,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import api from "../assets/api";
import bgImage from "../assets/images/bg-teal-waves.png";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (name, value) =>
    setFormData({ ...formData, [name]: value });

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await api.post("/api/login/", formData);
      Alert.alert("Success", "Login successful!");
      await AsyncStorage.clear();
      await AsyncStorage.setItem("access", res.data.access);
      await AsyncStorage.setItem("refresh", res.data.refresh);
      await AsyncStorage.setItem("userData", JSON.stringify(res.data));
      router.push("/Profile");
    } catch (err) {
      Alert.alert("Error", "Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ImageBackground
          source={bgImage}
          className="flex-1 justify-center px-8"
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
            keyboardShouldPersistTaps="handled"
          >
            <View className="mx-auto w-full px-5" style={{ maxWidth: 400 }}>
              <Image
                source={require("../assets/images/logo.jpg")}
                className="w-16 h-16 rounded-full mb-4"
              />

              <Text className="text-3xl font-bold text-white mb-2">
                Sign In
              </Text>
              <Text className="text-zinc-200 mb-4">
                Enter your School ID and password to sign in
              </Text>

              <Text className="text-white">School ID</Text>
              <TextInput
                value={formData.username}
                onChangeText={(text) => handleChange("username", text)}
                placeholder="Enter your School ID"
                placeholderTextColor="white"
                className="mb-2 h-16 w-full rounded-lg border border-zinc-200 px-4 text-sm text-white"
              />

              <Text className="text-white mt-4">Password</Text>
              <TextInput
                value={formData.password}
                onChangeText={(text) => handleChange("password", text)}
                placeholder="Password"
                placeholderTextColor="white"
                secureTextEntry
                className="mb-2 h-16 w-full rounded-lg border border-zinc-200 px-4 text-sm text-white"
              />

              <TouchableOpacity
                onPress={handleSubmit}
                disabled={loading}
                className={`mt-3 h-11 w-full justify-center items-center rounded-lg ${
                  loading ? "bg-gray-400" : "bg-green-500"
                }`}
              >
                <Text className="text-sm font-medium text-white">
                  {loading ? "Logging in, please wait..." : "Login"}
                </Text>
              </TouchableOpacity>

              <Text className="mt-4 text-white text-center">
                Don't have an account?{" "}
                <Text
                  className="font-bold text-green-200"
                  onPress={() => router.push("/Register")}
                >
                  Register
                </Text>
              </Text>
            </View>
          </ScrollView>
        </ImageBackground>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
