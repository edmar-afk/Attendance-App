import React, { useState, useCallback } from "react";
import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import profilebg from "../../assets/image/profilebg.jpg";
import logo from "../../assets/images/logo.jpg";
import api from "../../assets/api.js";

const Header = ({ setUserId }) => {
  const [userData, setUserData] = useState(null);
  const [profile, setProfile] = useState(null);
  const [userDetail, setUserDetail] = useState(null);
  const router = useRouter();

  const fetchUserDataAndProfile = async () => {
    try {
      const storedData = await AsyncStorage.getItem("userData");
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setUserData(parsedData);

        const profileResponse = await api.get(`/api/profile/${parsedData.id}/`);
        setProfile(profileResponse.data);

        const userResponse = await api.get(`/api/user/${parsedData.id}/`);
        setUserDetail(userResponse.data);

        const isSuper = userResponse.data.is_superuser === true;
        await AsyncStorage.setItem("userSuperuser", JSON.stringify(isSuper));

        if (setUserId) setUserId(profileResponse.data.user.id);

        console.log("Stored userSuperuser:", isSuper);
      }
    } catch (error) {
      console.error("Error fetching profile or user data:", error);
    }
  };

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await AsyncStorage.clear();
            setUserData(null);
            setProfile(null);
            setUserDetail(null);
            router.replace("/Login");
          } catch (error) {
            console.error("Error during logout:", error);
          }
        },
      },
    ]);
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserDataAndProfile();
    }, [])
  );

  return (
    <View className="w-full">
      <View className="h-72">
        <Image
          source={profilebg}
          className="absolute w-full h-full rounded-b-3xl top-0"
          resizeMode="cover"
        />
        <Text className="text-white mt-16 -mb-24 text-right mr-4 font-semibold text-xl">SSC Attendance system</Text>
        <View className="flex flex-row items-center px-8 gap-6 mt-32">
          <Image source={logo} className="w-24 h-24 rounded-full" />
          {profile ? (
            <View className="flex flex-col gap-2">
              <Text
                className="text-white text-4xl font-bold"
                numberOfLines={0}
                style={{ flexWrap: "wrap", maxWidth: "90%" }}
              >
                {profile.user.first_name}
              </Text>

              <View className="flex flex-row items-center flex-wrap">
                <Text className="text-white text-lg">
                  {profile.course} - {profile.year_lvl}
                </Text>

                <TouchableOpacity onPress={handleLogout}>
                  <Text className="text-red-400 font-bold text-lg ml-4 underline">
                    Logout
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <Text className="text-white text-lg">Loading profile...</Text>
          )}
        </View>
      </View>

      <View>
        <Text className="text-gray-800 font-bold text-xl px-8 mt-8">
          Browse some information
        </Text>
      </View>
    </View>
  );
};

export default Header;
