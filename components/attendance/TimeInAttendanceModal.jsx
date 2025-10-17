import React, { useState, useRef, useEffect, useCallback } from "react";
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
import { useFocusEffect } from "expo-router";

const TimeInAttendanceModal = ({ attendanceId }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [deviceId, setDeviceId] = useState(null);
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
      refreshData();
    } else {
      scaleAnim.setValue(0);
    }
  }, [modalVisible]);

  const refreshData = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("userData");
      if (storedUser) setUserData(JSON.parse(storedUser));

      let storedDeviceId = await AsyncStorage.getItem("deviceId");
      if (!storedDeviceId) {
        storedDeviceId = Crypto.randomUUID
          ? Crypto.randomUUID()
          : `${Date.now()}-${Math.random()}`;
        await AsyncStorage.setItem("deviceId", storedDeviceId);
      }
      setDeviceId(storedDeviceId);
      console.log(
        "Refreshed userData and deviceId:",
        storedUser,
        storedDeviceId
      );
    } catch (error) {
      console.error("Error refreshing data:", error);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      await refreshData();
    };
    initialize();
  }, []);

  useEffect(() => {
    if (userData) {
      console.log("User ID after refresh:", userData.id);
    }
  }, [userData]);

  useFocusEffect(
    useCallback(() => {
      if (modalVisible) refreshData();
    }, [modalVisible])
  );

  const handleFingerprintTimeIn = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      if (!compatible)
        return Alert.alert("Error", "Fingerprint not supported.");

      const enrolled = await LocalAuthentication.isEnrolledAsync();
      if (!enrolled) return Alert.alert("Error", "No fingerprints enrolled.");

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Scan your fingerprint to time in",
        fallbackLabel: "Use Passcode",
      });

      if (!result.success)
        return Alert.alert("Failed", "Authentication failed.");

      if (!userData || !deviceId)
        return Alert.alert("Error", "Missing user or device info.");

      setLoading(true);

      const verify = await api.get(
        `/api/fingerprints/check/${userData.id}/${deviceId}/`
      );

      if (!verify.data.valid) {
        Alert.alert("Error", "Unauthorized fingerprint or device.");
        return;
      }

      await api.post(`/api/attendance/timein/${attendanceId}/${userData.id}/`, {
        device_id: deviceId,
        device_name: Device.deviceName || "Unknown Device",
      });

      Alert.alert("Success", "You have successfully timed in!");
      closeModal();
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Error",
        error.response?.data?.error || "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => setModalVisible(false);
  console.log("from timein attendance fingerprint: ", userData.id);
  return (
    <View>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Text className="text-blue-600 font-bold">Time In Attendance</Text>
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
                      Time In Attendance
                    </Text>

                    <TouchableOpacity
                      className="bg-green-600 px-6 py-3 rounded-lg mt-3"
                      onPress={handleFingerprintTimeIn}
                    >
                      <Text className="text-white font-bold text-base">
                        Time In with Fingerprint
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="bg-blue-600 px-6 py-3 rounded-lg mt-3"
                      onPress={() =>
                        router.push(`/face-attendance/${attendanceId}`)
                      }
                    >
                      <Text className="text-white font-bold text-base">
                        Time In with Face Recognition
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

export default TimeInAttendanceModal;
