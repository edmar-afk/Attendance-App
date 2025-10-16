import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ImageBackground,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import api from "../assets/api";
import bgImage from "../assets/images/bg-teal-waves.png";

export default function Register() {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    first_name: "",
    username: "",
    password: "",
    year_lvl: "",
    course: "",
  });

  const [repeatPassword, setRepeatPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    if (formData.password !== repeatPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await api.post("/api/register/", formData);

      Alert.alert(
        "Success",
        "Registered Successfully! Redirecting to login...",
        [{ text: "OK", onPress: () => navigation.navigate("Login") }]
      );
    } catch (err) {
      if (err.response && err.response.data) {
        if (err.response.data.username) {
          Alert.alert("Error", "School ID Already Exists");
        } else {
          const msg = Object.values(err.response.data).join(" ");
          Alert.alert("Error", msg);
        }
      } else {
        Alert.alert("Error", "Registration failed!");
      }
    } finally {
      setLoading(false);
    }
  };

  const passwordsMatch =
    formData.password.length > 0 &&
    repeatPassword.length > 0 &&
    formData.password === repeatPassword;

  return (
    <ImageBackground source={bgImage} className="flex-1 px-8 bg-cover">
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        enableOnAndroid={true}
        extraScrollHeight={Platform.OS === "ios" ? 100 : 120}
        keyboardShouldPersistTaps="handled"
      >
        <View className="mb-8">
          <Text className="text-3xl font-bold text-white mb-2">Register</Text>
          <Text className="text-white text-xs mb-6">
            Enter your credentials to get started!
          </Text>

          <Text className="text-white">Full Name</Text>
          <TextInput
            placeholder="Juan Dela Cruz"
            placeholderTextColor="white"
            value={formData.first_name}
            onChangeText={(text) => handleChange("first_name", text)}
            className="mb-2 h-16 w-full rounded-lg border border-white px-4 text-sm text-white"
          />

          <Text className="text-white mt-4">Year Level</Text>
          <View className="mb-2 h-17 w-full rounded-lg border border-white">
            <Picker
              selectedValue={formData.year_lvl}
              onValueChange={(itemValue) => handleChange("year_lvl", itemValue)}
              dropdownIconColor="white"
              style={{ color: "white" }}
            >
              <Picker.Item label="Select Year" value="" />
              <Picker.Item label="1st Year" value="1st Year" />
              <Picker.Item label="2nd Year" value="2nd Year" />
              <Picker.Item label="3rd Year" value="3rd Year" />
              <Picker.Item label="4th Year" value="4th Year" />
            </Picker>
          </View>

          <Text className="text-white mt-4">Course</Text>
          <View className="mb-2 h-17 w-full rounded-lg border border-white">
            <Picker
              selectedValue={formData.course}
              onValueChange={(itemValue) => handleChange("course", itemValue)}
              dropdownIconColor="white"
              style={{ color: "white" }}
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

          <Text className="text-white mt-4">School ID</Text>
          <TextInput
            placeholder="2023123456"
            placeholderTextColor="white"
            value={formData.username}
            onChangeText={(text) => handleChange("username", text)}
            className="mb-2 h-16 w-full rounded-lg border border-white px-4 text-sm text-white"
          />

          <Text className="text-white mt-4">Password</Text>
          <TextInput
            placeholder="********"
            placeholderTextColor="white"
            secureTextEntry
            value={formData.password}
            onChangeText={(text) => handleChange("password", text)}
            className="mb-2 h-16 w-full rounded-lg border border-white px-4 text-sm text-white"
          />

          <Text className="text-white mt-4">Repeat Password</Text>
          <TextInput
            placeholder="********"
            placeholderTextColor="white"
            secureTextEntry
            value={repeatPassword}
            onChangeText={setRepeatPassword}
            className={`mb-2 h-16 w-full rounded-lg border px-4 text-sm text-white ${
              repeatPassword && !passwordsMatch
                ? "border-red-500"
                : "border-white"
            }`}
          />
          {!passwordsMatch && repeatPassword.length > 0 && (
            <Text className="text-red-400 text-sm">Passwords do not match</Text>
          )}

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={!passwordsMatch || loading}
            className={`mt-2 w-full rounded-lg px-4 py-3 text-sm font-medium ${
              passwordsMatch && !loading ? "bg-white" : "bg-gray-400"
            }`}
          >
            <Text
              className={`text-center ${
                passwordsMatch && !loading ? "text-green-700" : "text-gray-700"
              }`}
            >
              {loading ? "Registering, please wait..." : "Register"}
            </Text>
          </TouchableOpacity>

          <Text className="mt-4 text-white text-center">
            Already have an account?{" "}
            <Text
              className="font-bold text-green-200"
              onPress={() => navigation.navigate("Login")}
            >
              Login
            </Text>
          </Text>
        </View>
      </KeyboardAwareScrollView>
    </ImageBackground>
  );
}
