/* eslint-disable react/no-unescaped-entities */
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import logo from "../../assets/images/logo.jpg";
import api from "../../assets/api";
import { Picker } from "@react-native-picker/picker";
const { width } = Dimensions.get("window");

export default function StudentsLists({
  userId,
  username,
  first_name,

  year_lvl,
  course,
  onDeletePress,
  onUpdateStudent,
}) {
  const [modalVisible, setModalVisible] = useState(false);
  const scaleAnim = useState(new Animated.Value(0))[0];
  const [formData, setFormData] = useState({
    username,
    first_name,

    year_lvl,
    course,
  });

  useEffect(() => {
    setFormData({ username, first_name, year_lvl, course });
  }, [username, first_name, year_lvl, course]);

  const openModal = () => {
    setModalVisible(true);
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(scaleAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleUpdate = async () => {
    try {
      const response = await api.patch(
        `/api/students/manage/${userId}/`,
        formData
      );
      onUpdateStudent(userId, response.data);
      Alert.alert("Success", "Student data updated successfully!");
      closeModal();
    } catch (error) {
      Alert.alert("Error", "Failed to update student data.");
    }
  };

  return (
    <>
      <View className="overflow-hidden mb-2 bg-white rounded-lg shadow-md">
        <View className="flex-row items-center py-4 px-6 border-b border-gray-200">
          <Image source={logo} className="w-12 h-12 rounded-full mr-4" />
          <View className="flex-1">
            <Text className="text-lg font-medium text-gray-800">
              {formData.first_name} ({formData.username})
            </Text>
            <View className="flex flex-row items-center justify-between">
              <Text className="text-gray-600 text-base">
                {formData.year_lvl} - {formData.course}
              </Text>
              <View className="flex flex-row items-center gap-2">
                <TouchableOpacity onPress={openModal}>
                  <Ionicons name="create-outline" size={20} color="#4B5563" />
                </TouchableOpacity>
                <TouchableOpacity onPress={onDeletePress}>
                  <Ionicons name="trash-outline" size={20} color="#EF4444" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>

      <Modal transparent visible={modalVisible} animationType="none">
        <TouchableWithoutFeedback onPress={closeModal}>
          <View className="flex-1 justify-center items-center bg-black/50">
            <TouchableWithoutFeedback>
              <Animated.View
                style={{
                  transform: [{ scale: scaleAnim }],
                  width: width * 0.9,
                }}
                className="bg-white rounded-xl p-6"
              >
                <View className="flex-row justify-between items-center mb-4">
                  <Text
                    className="text-xl font-bold text-gray-800"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    Edit {formData.first_name}'s Info
                  </Text>
                  <TouchableOpacity onPress={closeModal}>
                    <Ionicons name="close" size={24} color="#4B5563" />
                  </TouchableOpacity>
                </View>

                <Text className="text-gray-700 mb-1">School Id</Text>
                <TextInput
                  value={formData.username}
                  onChangeText={(text) => handleInputChange("username", text)}
                  className="border border-gray-300 rounded-md p-2 mb-3"
                />

                <Text className="text-gray-700 mb-1">First Name</Text>
                <TextInput
                  value={formData.first_name}
                  onChangeText={(text) => handleInputChange("first_name", text)}
                  className="border border-gray-300 rounded-md p-2 mb-3"
                />

                <Text className="text-gray-700 mb-1">Year Level</Text>
                <View className="border border-gray-300 rounded-md mb-3">
                  <Picker
                    selectedValue={formData.year_lvl}
                    onValueChange={(value) =>
                      handleInputChange("year_lvl", value)
                    }
                    className="p-2"
                  >
                    <Picker.Item label={formData.year_lvl} value={formData.year_lvl} />
                    <Picker.Item label="1st Year" value="1st Year" />
                    <Picker.Item label="2nd Year" value="2nd Year" />
                    <Picker.Item label="3rd Year" value="3rd Year" />
                    <Picker.Item label="4th Year" value="4th Year" />
                  </Picker>
                </View>

                <Text className="text-gray-700 mb-1">Course</Text>
                <View className="border border-gray-300 rounded-md mb-3">
                  <Picker
                    selectedValue={formData.course}
                    onValueChange={(value) =>
                      handleInputChange("course", value)
                    }
                    className="p-2"
                  >
                    <Picker.Item label={formData.course} value={formData.course} />
                    <Picker.Item label="BSCS" value="BSCS" />
                    <Picker.Item label="BSIT" value="BSIT" />
                    <Picker.Item label="BSA" value="BSA" />
                    <Picker.Item label="BSBA" value="BSBA" />
                  </Picker>
                </View>

                <Text className="text-gray-700 mb-1">Password</Text>
                <TextInput
                  value={formData.password || ""}
                  onChangeText={(text) => handleInputChange("password", text)}
                  placeholder="Leave blank to keep current password"
                  secureTextEntry
                  className="border border-gray-300 rounded-md p-2 mb-3"
                />

                <TouchableOpacity
                  onPress={handleUpdate}
                  className="bg-blue-600 rounded-md py-2 mt-3"
                >
                  <Text className="text-white text-center font-medium">
                    Update
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}
