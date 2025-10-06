import { View, Text } from "react-native";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import FingerPrint from "../component/Fingerprint";
import GenerateFingerprint from "../component/GenerateFingerprint";

const Profile = () => {
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
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center">
        <Text>Profile</Text>
        <FingerPrint />
        <GenerateFingerprint />
      </View>
    </SafeAreaView>
  );
};

export default Profile;
