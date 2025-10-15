/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../assets/api";
import profileImg from "../../assets/image/profile.png";
import { Picker } from "@react-native-picker/picker";

const ProfileSettings = () => {
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [profile, setProfile] = useState({
    first_name: "",
    year_lvl: "",
    course: "",
    schoolId: "",
    new_password: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("userData");
        if (!storedUser) return;
        const user = JSON.parse(storedUser);
        setUserId(user.id);

        const res = await api.get(`/api/profileUpdate/${user.id}/`);
        setProfile({
          first_name: res.data.user.first_name || "",
          schoolId: res.data.schoolId || res.data.user.username || "",
          year_lvl: res.data.year_lvl || "",
          course: res.data.course || "",
          new_password: "",
        });
      } catch (error) {
        Alert.alert("Error", "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleUpdate = async () => {
    try {
      setLoading(true);
      await api.put(`/api/profileUpdate/${userId}/`, {
        user: {
          first_name: profile.first_name,
          username: profile.schoolId,
        },
        year_lvl: profile.year_lvl,
        course: profile.course,
        schoolId: profile.schoolId,
        new_password: profile.new_password || undefined,
      });
      Alert.alert("Success", "Profile updated successfully!");
    } catch (error) {
      Alert.alert("Error", "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View className="flex-1 p-5 bg-white">
      <View className="rounded-2xl overflow-hidden shadow mb-12">
        <View className="flex-row items-center justify-between p-12 bg-green-300">
          <View className="mr-32">
            <Text className="text-md font-extrabold text-gray-600">
              This is your Profile Info
            </Text>
            <Text className="text-gray-600 text-sm">
              Manage and update your personal details to keep your profile up to
              date.
            </Text>
          </View>
          <Image
            source={profileImg}
            className="w-32 h-32 rounded-xl absolute right-12"
            resizeMode="contain"
          />
        </View>
      </View>

      <Text className="text-gray-700 mb-1">First Name</Text>
      <TextInput
        value={profile.first_name}
        onChangeText={(text) => setProfile({ ...profile, first_name: text })}
        className="border border-gray-300 rounded-lg p-3 mb-4"
      />

      <Text className="text-gray-700 mb-1">School ID</Text>
      <TextInput
        value={profile.schoolId}
        onChangeText={(text) => setProfile({ ...profile, schoolId: text })}
        className="border border-gray-300 rounded-lg p-3 mb-4"
      />

      <Text className="text-gray-700 mb-1">Year Level</Text>
      <View className="border border-gray-300 rounded-lg mb-4">
        <Picker
          selectedValue={profile.year_lvl}
          onValueChange={(value) => setProfile({ ...profile, year_lvl: value })}
        >
          <Picker.Item label={profile.year_lvl} value={profile.year_lvl} />
          <Picker.Item label="1st Year" value="1st Year" />
          <Picker.Item label="2nd Year" value="2nd Year" />
          <Picker.Item label="3rd Year" value="3rd Year" />
          <Picker.Item label="4th Year" value="4th Year" />
        </Picker>
      </View>

      <Text className="text-gray-700 mb-1">Course</Text>
      <View className="border border-gray-300 rounded-lg mb-6">
        <Picker
          selectedValue={profile.course}
          onValueChange={(value) => setProfile({ ...profile, course: value })}
        >
          <Picker.Item label={profile.course} value={profile.course} />
          <Picker.Item label="BSIT" value="BSIT" />
          <Picker.Item label="BSCS" value="BSCS" />
          <Picker.Item label="BSIS" value="BSIS" />
        </Picker>
      </View>

      <Text className="text-gray-700 mb-1">New Password</Text>
      <TextInput
        secureTextEntry
        value={profile.new_password}
        onChangeText={(text) => setProfile({ ...profile, new_password: text })}
        className="border border-gray-300 rounded-lg p-3"
      />
      <Text className="mb-6 text-orange-500 text-xs font-semibold mt-1">
        If you don't want to change password, leave this as it is.
      </Text>

      <TouchableOpacity
        onPress={handleUpdate}
        className="py-3 rounded-lg bg-blue-600"
      >
        <Text className="text-white text-center font-semibold text-lg">
          Save Changes
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileSettings;
