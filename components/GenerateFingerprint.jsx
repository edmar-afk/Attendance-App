/* eslint-disable react/no-unescaped-entities */
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import * as LocalAuthentication from "expo-local-authentication";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Device from "expo-device";
import * as Crypto from "expo-crypto";
import api from "../assets/api";
import fingerprintIcon from "../assets/image/fingerprintIcon.png";

const GenerateFingerprint = () => {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [refreshing, setRefreshing] = useState(true);

  const refreshUserData = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("userData");
      if (storedUser) {
        setUserData(JSON.parse(storedUser));
        console.log("User data refreshed:", JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Error refreshing user data:", error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    refreshUserData();
  }, []);

  const handleFingerprint = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      if (!compatible) {
        Alert.alert(
          "Error",
          "Fingerprint scanner not supported on this device."
        );
        return;
      }

      const enrolled = await LocalAuthentication.isEnrolledAsync();
      if (!enrolled) {
        Alert.alert(
          "Error",
          "No fingerprints enrolled. Please add one in phone settings."
        );
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Scan your fingerprint",
        fallbackLabel: "Enter Passcode",
      });

      if (!result.success) {
        Alert.alert("Failed", "Fingerprint authentication failed.");
        return;
      }

      setLoading(true);

      if (!userData || !userData.id) {
        Alert.alert("Error", "User data not found or invalid.");
        return;
      }

      const deviceId = Crypto.randomUUID
        ? Crypto.randomUUID()
        : `${Date.now()}-${Math.random()}`;
      const deviceInfo = {
        device_name: Device.deviceName || "Unknown Device",
        device_id: deviceId,
      };

      await api.post(`/api/fingerprints/${userData.id}/`, deviceInfo);
      await AsyncStorage.setItem("deviceId", deviceId);

      // Save history log
      const historyLogData = {
        title: "Fingerprint Registration",
        subtitle: "You registered your fingerprint",
      };
      await api.post(
        `/api/history-logs/${userData.id}/create/`,
        historyLogData
      );

      Alert.alert(
        "Success",
        "Fingerprint saved, device registered, and history log recorded successfully."
      );
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "You already registered your fingerprint.");
    } finally {
      setLoading(false);
    }
  };

  if (refreshing) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#34D399" />
        <Text className="mt-4 text-gray-700 font-semibold">
          Refreshing user data...
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-center bg-white mt-24 mb-72">
      <TouchableOpacity
        onPress={handleFingerprint}
        disabled={loading}
        className="items-center"
      >
        <Text className="text-xs font-extralight text-gray-500">
          User id detected: jhcscstudent{userData.id}
        </Text>
        <Image
          source={fingerprintIcon}
          className="w-44 h-44"
          resizeMode="contain"
        />
        <Text className="text-green-700 font-bold text-lg mt-4">
          {loading ? "Saving..." : "Generate Fingerprint"}
        </Text>
        <Text className="mt-4 text-center text-orange-600 font-bold">
          NOTE: By registering this account, you will not be able to register
          another fingerprint on this app on your phone to prevent attendance
          cheating - This is one time register per device.
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default GenerateFingerprint;
