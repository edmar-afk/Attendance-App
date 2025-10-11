import React from "react";
import { View, Text, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import attendancebg from "../assets/image/attendancebg.png";
import AttendanceLists from "../components/attendance/AttendanceLists";
import AddAttendance from "../components/attendance/AddAttendance";
const Attendance = () => {
  return (
    <SafeAreaView className="flex-1 bg-white p-4">
      <View className="rounded-2xl overflow-hidden shadow">
        <LinearGradient
          colors={["#a8e6cf", "#006400"]}
          start={{ x: 1, y: 5 }}
          end={{ x: 0, y: 1 }}
          className="flex-row items-center justify-between p-8"
        >
          <View className="mr-44">
            <Text className="text-3xl font-extrabold text-white">Welcome!</Text>
            <Text className="text-white text-lg">
              Hey there! Just a quick reminder to clock in your attendance
              before time runs out.
            </Text>
          </View>
          <Image
            source={attendancebg}
            className="w-44 h-44 rounded-xl absolute right-4"
            resizeMode="contain"
          />
        </LinearGradient>
      </View>

      <AttendanceLists />
      <AddAttendance />
    </SafeAreaView>
  );
};

export default Attendance;
