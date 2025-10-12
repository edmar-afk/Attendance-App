import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Animated,
  TouchableWithoutFeedback,
  Easing,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as LocalAuthentication from "expo-local-authentication";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Device from "expo-device";
import * as Crypto from "expo-crypto";
import api from "../../assets/api";
import { useRouter } from "expo-router";

const TimeOutAttendanceModal = ({ attendanceoutId }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();

  useEffect(() => {
    if (modalVisible) {
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    } else {
      scaleAnim.setValue(0);
    }
  }, [modalVisible]);

  const getDeviceId = async () => {
    let deviceId = await AsyncStorage.getItem("deviceId");
    if (!deviceId) {
      deviceId = Crypto.randomUUID
        ? Crypto.randomUUID()
        : `${Date.now()}-${Math.random()}`;
      await AsyncStorage.setItem("deviceId", deviceId);
    }
    return deviceId;
  };

  const handleFingerprintTimeOut = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      if (!compatible)
        return Alert.alert("Error", "Fingerprint not supported.");

      const enrolled = await LocalAuthentication.isEnrolledAsync();
      if (!enrolled) return Alert.alert("Error", "No fingerprints enrolled.");

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Scan your fingerprint to time Out",
        fallbackLabel: "Use Passcode",
      });

      if (!result.success)
        return Alert.alert("Failed", "Authentication failed.");

      setLoading(true);

      const userDataJson = await AsyncStorage.getItem("userData");
      if (!userDataJson) return Alert.alert("Error", "User not found.");
      const userData = JSON.parse(userDataJson);

      const deviceId = await getDeviceId();

      const verify = await api.get(
        `/api/fingerprints/check/${userData.id}/${deviceId}/`
      );
      if (!verify.data.valid) {
        Alert.alert("Error", "Unauthorized fingerprint or device.");
        return;
      }

      await api.post(
        `/api/attendance/timeout/${attendanceoutId}/${userData.id}/`,
        {
          device_id: deviceId,
          device_name: Device.deviceName || "Unknown Device",
        }
      );

      Alert.alert("Success", "You have successfully timed in!");
      closeModal();
    } catch (error) {
      console.error(error.response?.data);
      Alert.alert(
        "Error",
        error.response?.data?.error ||
          JSON.stringify(error.response?.data?.debug_raw_data) ||
          "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => setModalVisible(false);

  return (
    <View>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Text className="text-blue-600 font-bold">Time Out Attendance</Text>
      </TouchableOpacity>

      <Modal
        transparent
        visible={modalVisible}
        animationType="none"
        onRequestClose={closeModal}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View className="flex-1 bg-black/50 justify-center items-center">
            <TouchableWithoutFeedback>
              <Animated.View
                style={{
                  transform: [{ scale: scaleAnim }],
                  width: "80%",
                  backgroundColor: "white",
                  borderRadius: 20,
                  padding: 24,
                  alignItems: "center",
                }}
              >
                {loading ? (
                  <>
                    <ActivityIndicator size="large" color="#000" />
                    <Text className="mt-3 text-gray-600">Processing...</Text>
                  </>
                ) : (
                  <>
                    <Text className="text-xl font-bold mb-3 text-center">
                      Time Out Attendance
                    </Text>

                    <TouchableOpacity
                      className="bg-green-600 px-6 py-3 rounded-lg mt-3"
                      onPress={handleFingerprintTimeOut}
                    >
                      <Text className="text-white font-bold text-base">
                        Time Out with Fingerprint
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="bg-blue-600 px-6 py-3 rounded-lg mt-3"
                      onPress={() =>
                        router.push(`/face-attendance-out/${attendanceoutId}`)
                      }
                    >
                      <Text className="text-white font-bold text-base">
                        Time Out with Face Recognition
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="bg-gray-400 px-5 py-3 rounded-lg mt-3"
                      onPress={closeModal}
                    >
                      <Text className="text-white font-bold text-base">
                        Close
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default TimeOutAttendanceModal;
