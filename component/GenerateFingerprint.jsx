import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import * as LocalAuthentication from "expo-local-authentication";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Device from "expo-device";
import * as Crypto from "expo-crypto";
import api from "../assets/api";

const GenerateFingerprint = () => {
  const [loading, setLoading] = useState(false);

  const getDeviceId = async () => {
    let deviceId = await AsyncStorage.getItem("deviceId");
    if (!deviceId) {
      if (Crypto.randomUUID) {
        deviceId = Crypto.randomUUID();
      } else {
        deviceId = `${Date.now()}-${Math.random()}`;
      }
      await AsyncStorage.setItem("deviceId", deviceId);
    }
    return deviceId; 
  };

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

      const userId = await AsyncStorage.getItem("userId");
      if (!userId) {
        Alert.alert("Error", "No user ID found.");
        return;
      }

      const deviceId = await getDeviceId();

      const deviceInfo = {
        device_name: Device.deviceName || "Unknown Device",
        device_id: deviceId,
      };

      await api.post(`/api/fingerprints/${userId}/`, deviceInfo);

      Alert.alert("Success", "Fingerprint saved successfully.");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <TouchableOpacity
        onPress={handleFingerprint}
        disabled={loading}
        className="px-6 py-3 bg-blue-500 rounded-xl"
      >
        <Text className="text-gray-800 text-lg">
          {loading ? "Saving..." : "Generate Fingerprint"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default GenerateFingerprint;
