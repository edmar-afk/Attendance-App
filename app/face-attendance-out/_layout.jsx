import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

export default function FaceAttendanceLayout() {
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        title: "Face Recognition Attendance",
        headerLeft: () => (
          <TouchableOpacity onPress={() => router.push("/Attendance")}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
        ),
      }}
    />
  );
}
