import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  Pressable,
  Animated,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import Header from "../components/profile/Header";
import fingerprintImg from "../assets/image/fingerprint.png";
import faceImg from "../assets/image/face-recognition.png";
import profileImg from "../assets/image/profile.png";
import eventsImg from "../assets/image/events.png";
import GenerateFingerprint from "../components/GenerateFingerprint";

const Profile = () => {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const scaleValue = new Animated.Value(0);

  const openModal = () => {
    setModalVisible(true);
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(scaleValue, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  useEffect(() => {
    const getUserData = async () => {
      const storedUser = await AsyncStorage.getItem("userData");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        console.log("User Data:", user);
      }
    };
    getUserData();
  }, []);

  return (
    <View className="flex-1 bg-gray-100">
      <Header />
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
      >
        <TouchableOpacity
          className="bg-white p-3 rounded-xl shadow-xl mt-4"
          onPress={() => router.push("/face-register/FaceAttendance")}
        >
          <View className="flex flex-row items-start">
            <View className="flex flex-col items-center">
              <Image source={faceImg} className="w-28 h-28 self-center" />
              <Text className="font-font text-blue-600 text-xs">
                Tap to View
              </Text>
            </View>
            <View className="flex-1 flex flex-col ml-2 mt-4">
              <Text className="font-semibold mb-1">Face Registration</Text>
              <Text className="leading-6">
                Face registration records your face for automatic time-in and
                time-out.
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-white p-3 rounded-xl shadow-xl mt-8"
          onPress={openModal}
        >
          <View className="flex flex-row items-start">
            <View className="flex flex-col items-center">
              <Image
                source={fingerprintImg}
                className="w-28 h-28 self-center"
              />
              <Text className="font-font text-blue-600 text-xs">
                Tap to View
              </Text>
            </View>
            <View className="flex-1 flex flex-col ml-2 mt-4">
              <Text className="font-semibold mb-1">
                Fingerprint Registration
              </Text>
              <Text className="leading-6">
                Fingerprint registration saves your print for automatic time-in
                and time-out.
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-white p-3 rounded-xl shadow-xl mt-8"
          onPress={() => router.push("/events/Events")}
        >
          <View className="flex flex-row items-start">
            <View className="flex flex-col items-center">
              <Image source={eventsImg} className="w-28 h-28 self-center" />
              <Text className="font-font text-blue-600 text-xs">
                Tap to View
              </Text>
            </View>
            <View className="flex-1 flex flex-col ml-2 mt-4">
              <Text className="font-semibold mb-1">Upcoming Events</Text>
              <Text className="leading-6">
                Stay updated with your scheduled activities, meetings, and
                important deadlines at the School of JHCSC.
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-white p-3 rounded-xl shadow-xl mt-8"
          onPress={() => router.push("/profile/ProfileSettings")}
        >
          <View className="flex flex-row items-start">
            <View className="flex flex-col items-center">
              <Image source={profileImg} className="w-28 h-28 self-center" />
              <Text className="font-font text-blue-600 text-xs">
                Tap to View
              </Text>
            </View>
            <View className="flex-1 flex flex-col ml-2 mt-4">
              <Text className="font-semibold mb-1">Profile Settings</Text>
              <Text className="leading-6">
                Update your personal information, change your password, and
                manage your account preferences here.
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        transparent
        visible={modalVisible}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <Pressable
          className="flex-1 bg-black/50 justify-center items-center"
          onPress={closeModal}
        >
          <Animated.View
            style={{
              transform: [{ scale: scaleValue }],
            }}
            className="bg-white p-6 rounded-2xl w-80"
          >
            <Text className="text-lg font-semibold mb-3 text-center">
              Fingerprint Registration
            </Text>
            <View className="text-center mb-5">
              <GenerateFingerprint />
            </View>
            <TouchableOpacity
              className="bg-blue-600 p-3 rounded-xl"
              onPress={closeModal}
            >
              <Text className="text-white text-center">Close</Text>
            </TouchableOpacity>
          </Animated.View>
        </Pressable>
      </Modal>
    </View>
  );
};

export default Profile;
