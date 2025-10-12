import { View, Text, Button } from "react-native";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import Header from "../components/profile/Header";

const Profile = () => {
  const router = useRouter();

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
    <View>
      <Header />
      <Text>Face Attendance</Text>
      <Button
        title="Go to Face Attendance"
        onPress={() => router.push("/FaceAttendance")}
      />
    </View>
  );
};

export default Profile;
