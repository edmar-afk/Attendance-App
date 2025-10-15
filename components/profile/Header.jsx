import React, { useState, useCallback } from "react";
import { View, Text, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import profilebg from "../../assets/image/profilebg.jpg";
import logo from "../../assets/images/logo.jpg";
import api from "../../assets/api.js";

const Header = () => {
  const [userData, setUserData] = useState(null);
  const [profile, setProfile] = useState(null);

  const fetchUserDataAndProfile = async () => {
    try {
      const storedData = await AsyncStorage.getItem("userData");
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setUserData(parsedData);

        const response = await api.get(`/api/profile/${parsedData.id}/`);
        setProfile(response.data);
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserDataAndProfile();
    }, [])
  );

  return (
    <View className="w-full ">
      <View className="h-72">
        <Image
          source={profilebg}
          className="absolute w-full h-full rounded-b-3xl top-0"
          resizeMode="cover"
        />
        <View className="flex flex-row items-center px-8 gap-6 mt-32">
          <Image source={logo} className="w-24 h-24 rounded-full" />
          {profile ? (
            <View className="flex flex-col gap-2">
              <Text className="text-white text-4xl font-bold">
                {profile.user.first_name}
              </Text>
              <Text className="text-white text-lg">
                {profile.course} - {profile.year_lvl}
              </Text>
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
