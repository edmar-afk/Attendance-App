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
import * as Device from "expo-device";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../assets/api";
import { useRouter } from "expo-router";

const TimeOutAttendanceModal = ({ attendanceoutId }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [deviceData, setDeviceData] = useState(null);
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

      // Refresh userData and deviceData once
      refreshDataOnce();
    } else {
      scaleAnim.setValue(0);
    }
  }, [modalVisible]);

  const refreshDataOnce = async () => {
    setLoading(true);
    try {
      const userDataJson = await AsyncStorage.getItem("userData");
      if (!userDataJson) {
        Alert.alert("Error", "User data not found.");
        return;
      }

      const currentUser = JSON.parse(userDataJson);
      setUserData(currentUser);

      const deviceResponse = await api.get(
        `/api/user-device/${currentUser.id}/`
      );
      if (deviceResponse.data.length > 0) {
        setDeviceData(deviceResponse.data[0]);
      } else {
        Alert.alert("No device found for this user.");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to fetch user or device data.");
    } finally {
      setLoading(false);
    }
  };

  const handleFingerprintTimeOut = async () => {
    if (!userData || !deviceData) return;

    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      if (!compatible)
        return Alert.alert("Error", "Fingerprint not supported.");

      const enrolled = await LocalAuthentication.isEnrolledAsync();
      if (!enrolled) return Alert.alert("Error", "No fingerprints enrolled.");

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Scan your fingerprint to time out",
        fallbackLabel: "Use Passcode",
      });

      if (!result.success)
        return Alert.alert("Failed", "Authentication failed.");

      setLoading(true);

      const verify = await api.get(
        `/api/fingerprints/check/${userData.id}/${deviceData.device_id}/`
      );

      if (!verify.data.valid) {
        Alert.alert("Error", "Unauthorized fingerprint or device.");
        return;
      }

      await api.post(
        `/api/attendance/timeout/${attendanceoutId}/${userData.id}/`,
        {
          device_id: deviceData.device_id,
          device_name: Device.deviceName || "Unknown Device",
        }
      );

      // Fetch attendance data to get event_name
      const { data: attendanceData } = await api.get(
        `/api/attendance/${attendanceoutId}/`
      );

      // Create history log
      await api.post(`/api/history-logs/${userData.id}/create/`, {
        title: "Fingerprint Time Out",
        subtitle: `You successfully timed out of the event ${attendanceData?.event_name}`,
      });

      Alert.alert("Success", "You have successfully timed out!");
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
                    <Text className="mt-3 text-gray-600">Loading...</Text>
                  </>
                ) : (
                  <>
                    <Text className="text-xl font-bold mb-3 text-center">
                      Time Out Attendance
                    </Text>
                    <Text className="text-xs font-extralight text-gray-500 text-center">
                      Device ID: {deviceData?.device_id} - User ID:{" "}
                      {userData?.id}
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
