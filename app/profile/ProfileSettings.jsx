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
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../assets/api";
import profileImg from "../../assets/image/profile.png";
import { Picker } from "@react-native-picker/picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const ProfileSettings = () => {
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [profile, setProfile] = useState({
    first_name: "",
    year_lvl: "",
    course: "",
    username: "",
    new_password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSuperuser, setIsSuperuser] = useState(false);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const storedUser = await AsyncStorage.getItem("userData");
      if (!storedUser) return;
      const user = JSON.parse(storedUser);
      setUserId(user.id);
      setIsSuperuser(user.is_superuser); // ← store superuser status here
      const res = await api.get(`/api/profileUpdate/${user.id}/`);
      setProfile({
        first_name: res.data.user.first_name || "",
        username: res.data.username || res.data.user.username || "",
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

  useFocusEffect(
    React.useCallback(() => {
      fetchProfile();
    }, [])
  );

  console.log("From profile settings: ", userId);
  const handleUpdate = async () => {
    try {
      setLoading(true);
      await api.put(`/api/profileUpdate/${userId}/`, {
        user: {
          first_name: profile.first_name,
          username: profile.username,
        },
        year_lvl: profile.year_lvl,
        course: profile.course,
        username: profile.username,
        new_password: profile.new_password || undefined,
      });
      Alert.alert("Success", "Profile updated successfully!");
    } catch (error) {
      Alert.alert("Error", "Failed to update profile: use longer password");
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
    <KeyboardAwareScrollView
      contentContainerStyle={{ padding: 20 }}
      keyboardShouldPersistTaps="handled"
      enableOnAndroid
      extraScrollHeight={100}
    >
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

      {isSuperuser && (
        <>
          <Text className="text-gray-700 mb-1">First Name</Text>
          <TextInput
            value={profile.first_name}
            onChangeText={(text) =>
              setProfile({ ...profile, first_name: text })
            }
            className="border border-gray-300 rounded-lg p-3 mb-4"
          />

          <Text className="text-gray-700 mb-1">School ID</Text>
          <TextInput
            value={profile.username}
            onChangeText={(text) => setProfile({ ...profile, username: text })}
            className="border border-gray-300 rounded-lg p-3 mb-4"
          />
        </>
      )}

      <Text className="text-gray-700 mb-1">Year Level</Text>
      <View className="border border-gray-300 rounded-lg mb-4">
        <Picker
          selectedValue={profile.year_lvl}
          onValueChange={(value) => setProfile({ ...profile, year_lvl: value })}
        >
          <Picker.Item label="Select Year Level" value="" />
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
          <Picker.Item label="Select Course" value="" />
          <Picker.Item label="SET DEPT." value="SET DEPT." />
          <Picker.Item label="BIT" value="BIT" />
          <Picker.Item label="SCS DEPT." value="SCS DEPT." />
          <Picker.Item label="BSIT" value="BSIT" />
          <Picker.Item label="STE DEPT." value="STE DEPT." />
          <Picker.Item label="BTVTED FSM" value="BTVTED FSM" />
          <Picker.Item label="BTLED HE" value="BTLED HE" />
          <Picker.Item label="BTLED AP" value="BTLED AP" />
        </Picker>
      </View>

      <Text className="text-gray-700 mb-1">New Password</Text>
      <View className="mb-6 flex-row items-center border border-gray-300 rounded-lg px-3">
        <TextInput
          value={profile.new_password}
          onChangeText={(text) =>
            setProfile({ ...profile, new_password: text })
          }
          secureTextEntry={!showPassword}
          placeholder="New Password"
          className="flex-1 p-3 text-gray-700"
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons
            name={showPassword ? "eye-off" : "eye"}
            size={24}
            color="gray"
          />
        </TouchableOpacity>
      </View>
      <Text className="mb-6 text-orange-500 text-xs font-semibold mt-1">
        If you don't want to change password, leave this as it is.
      </Text>

      <TouchableOpacity
        onPress={handleUpdate}
        className="py-3 rounded-lg bg-blue-600 mb-10"
      >
        <Text className="text-white text-center font-semibold text-lg">
          Save Changes
        </Text>
      </TouchableOpacity>
    </KeyboardAwareScrollView>
  );
};

export default ProfileSettings;
