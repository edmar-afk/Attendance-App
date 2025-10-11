import { View } from "react-native";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../components/profile/Header";

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
    <View>
      <Header />
     
    </View>
  );
};

export default Profile;
