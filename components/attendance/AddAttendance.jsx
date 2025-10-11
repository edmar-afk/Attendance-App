import {
  View,
  TouchableOpacity,
  Modal,
  Text,
  Animated,
  Pressable,
  TextInput,
  Alert,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import api from "../../assets/api";

const AddAttendance = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [eventName, setEventName] = useState("");
  const [location, setLocation] = useState("");
  const [permissionRejected, setPermissionRejected] = useState(false);
  const [timeLimit, setTimeLimit] = useState("");
  const scaleAnim = useRef(new Animated.Value(0)).current;

  const openModal = () => setModalVisible(true);

  const closeModal = () => {
    Animated.timing(scaleAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  useEffect(() => {
    if (modalVisible) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  }, [modalVisible]);

  const handleGetLocation = async () => {
    setPermissionRejected(false);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setPermissionRejected(true);
        return;
      }

      const userLocation = await Location.getCurrentPositionAsync({});
      const coords = `${userLocation.coords.latitude}, ${userLocation.coords.longitude}`;
      setLocation(coords);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch location.");
    }
  };

  const handleUpload = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("userData");
      const userData = storedUser ? JSON.parse(storedUser) : null;
      if (!userData?.id) {
        Alert.alert("Error", "User not found.");
        return;
      }

      const minutes = parseInt(timeLimit) || 15;

      const response = await api.post(`/api/attendance/upload/${userData.id}/`, {
        event_name: eventName,
        location: location,
        time_limit: minutes, // backend calculates from now + X minutes
      });

      if (response.status === 201) {
        Alert.alert("Success", "Attendance uploaded successfully!");
        setEventName("");
        setLocation("");
        setTimeLimit("");
        closeModal();
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to upload attendance.");
    }
  };

  return (
    <View className="absolute bottom-8 left-0 right-0 items-center z-50">
      <TouchableOpacity
        className="flex-row items-center bg-green-600 px-4 py-3.5 rounded-full"
        onPress={openModal}
      >
        <Ionicons name="add" size={25} color="white" />
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="none">
        <Pressable
          onPress={closeModal}
          className="flex-1 justify-center items-center bg-black/50"
        >
          <Pressable onPress={() => {}}>
            <Animated.View
              style={{ transform: [{ scale: scaleAnim }] }}
              className="bg-white w-80 p-6 rounded-2xl"
            >
              <Text className="text-lg font-semibold mb-4 text-center">
                Add Attendance
              </Text>

              <TextInput
                placeholder="Event Name"
                value={eventName}
                onChangeText={setEventName}
                className="border border-gray-300 rounded-lg p-3 mb-3"
              />

              <View className="flex-row items-center justify-start gap-3 px-3 py-3 mb-3">
                <TouchableOpacity
                  onPress={handleGetLocation}
                  className="bg-green-600 p-2 rounded-lg"
                >
                  <Ionicons name="location" size={20} color="white" />
                </TouchableOpacity>
                <Text
                  className={`${
                    permissionRejected
                      ? "text-red-500 font-bold"
                      : location
                      ? "text-green-600 font-bold"
                      : "text-red-500 font-bold"
                  }`}
                >
                  {permissionRejected
                    ? "Permission Rejected"
                    : location
                    ? "Location Set!"
                    : "Location not Set"}
                </Text>
              </View>

              <TextInput
                placeholder="Time Limit (in minutes)"
                value={timeLimit}
                onChangeText={setTimeLimit}
                keyboardType="numeric"
                className="border border-gray-300 rounded-lg p-3 mb-4"
              />

              <View className="flex flex-row justify-between">
                <TouchableOpacity
                  className="bg-green-600 px-5 py-3 rounded-full"
                  onPress={handleUpload}
                >
                  <Text className="text-white text-center">Upload</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="bg-gray-300 px-5 py-3 rounded-full"
                  onPress={closeModal}
                >
                  <Text className="text-black text-center">Cancel</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

export default AddAttendance;
