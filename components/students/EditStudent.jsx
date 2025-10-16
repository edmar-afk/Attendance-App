import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  TouchableWithoutFeedback,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";

const { width, height } = Dimensions.get("window");

const EditStudent = ({
  visible,
  onClose,
  username: initialUsername,
  first_name: initialFirstName,
  last_name: initialLastName,
  year_lvl: initialYearLvl,
  course: initialCourse,
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;

  const [username, setUsername] = useState(initialUsername);
  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);
  const [yearLvl, setYearLvl] = useState(initialYearLvl);
  const [course, setCourse] = useState(initialCourse);

  useEffect(() => {
    if (visible) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 5,
        tension: 40,
      }).start();
    } else {
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  useEffect(() => {
    setUsername(initialUsername);
    setFirstName(initialFirstName);
    setLastName(initialLastName);
    setYearLvl(initialYearLvl);
    setCourse(initialCourse);
  }, [
    initialUsername,
    initialFirstName,
    initialLastName,
    initialYearLvl,
    initialCourse,
  ]);

  if (!visible) return null;

  return (
    <TouchableWithoutFeedback onPress={onClose}>
      <View className="absolute inset-0 bg-black/50 flex items-center justify-center">
        <TouchableWithoutFeedback>
          <Animated.View
            style={{ transform: [{ scale: scaleAnim }] }}
            className="bg-white w-11/12 max-w-md rounded-xl p-6 shadow-lg"
          >
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold text-gray-800">
                Edit Student
              </Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={24} color="#4B5563" />
              </TouchableOpacity>
            </View>

            <Text className="text-gray-700 mb-1">Username:</Text>
            <TextInput
              value={username}
              onChangeText={setUsername}
              className="border border-gray-300 rounded-md p-2 mb-3"
            />

            <Text className="text-gray-700 mb-1">First Name:</Text>
            <TextInput
              value={firstName}
              onChangeText={setFirstName}
              className="border border-gray-300 rounded-md p-2 mb-3"
            />

            <Text className="text-gray-700 mb-1">Last Name:</Text>
            <TextInput
              value={lastName}
              onChangeText={setLastName}
              className="border border-gray-300 rounded-md p-2 mb-3"
            />

            <Text className="text-gray-700 mb-1">Year Level:</Text>
            <View className="border border-gray-300 rounded-md mb-3">
              <Picker
                selectedValue={yearLvl}
                onValueChange={(value) => setYearLvl(value)}
              >
                <Picker.Item label="Select Year Level" value="" />
                <Picker.Item label="1st Year" value="1st Year" />
                <Picker.Item label="2nd Year" value="2nd Year" />
                <Picker.Item label="3rd Year" value="3rd Year" />
                <Picker.Item label="4th Year" value="4th Year" />
              </Picker>
            </View>

            <Text className="text-gray-700 mb-1">Course:</Text>
            <View className="border border-gray-300 rounded-md mb-3">
              <Picker
                selectedValue={course}
                onValueChange={(value) => setCourse(value)}
              >
                <Picker.Item label="Select Course" value="" />
                <Picker.Item label="BSIT" value="BSIT" />
                <Picker.Item label="BSCS" value="BSCS" />
                <Picker.Item label="BSECE" value="BSECE" />
                <Picker.Item label="BSCE" value="BSCE" />
                <Picker.Item label="SET DEPT." value="SET DEPT." />
                <Picker.Item label="BIT" value="BIT" />
                <Picker.Item label="SCS DEPT." value="SCS DEPT." />
                <Picker.Item label="STE DEPT." value="STE DEPT." />
                <Picker.Item label="BTVTED FSM" value="BTVTED FSM" />
                <Picker.Item label="BTLED HE" value="BTLED HE" />
                <Picker.Item label="BTLED AP" value="BTLED AP" />
              </Picker>
            </View>
          </Animated.View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default EditStudent;
