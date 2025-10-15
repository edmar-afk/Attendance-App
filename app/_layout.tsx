import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 80,
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderColor: "#e5e7eb",
          paddingTop: 20,
        },
        tabBarActiveTintColor: "#2563eb",
        tabBarInactiveTintColor: "#6b7280",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          href: null, // removes from the tab bar
          tabBarStyle: { display: "none" }, // hides tab bar
        }}
      />
      <Tabs.Screen
        name="Login"
        options={{
          href: null, // removes from the tab bar
          tabBarStyle: { display: "none" }, // hides tab bar
        }}
      />
      <Tabs.Screen
        name="Register"
        options={{
          href: null, // removes from the tab bar
          tabBarStyle: { display: "none" }, // hides tab bar
        }}
      />
      <Tabs.Screen
        name="Attendance"
        options={{
          title: "Attendance",
          tabBarIcon: ({ color, size }) => (
            <View className="items-center">
              <Ionicons name="settings" size={size} color={color} />
              <Text className="text-[10px] -mt-4"></Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="FaceAttendance"
        options={{
          href: null, // removes from the tab bar
          tabBarStyle: { display: "none" }, // hides tab bar
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <View className="items-center">
              <Ionicons name="person" size={size} color={color} />
              <Text className="text-[10px] -mt-4"></Text>
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="face-register"
        options={{
          href: null, // completely hides it from the navbar
          tabBarStyle: { display: "none" }, // ensures no bar shows when visited
        }}
      />

      <Tabs.Screen
        name="attendance-table"
        options={{
          href: null, // completely hides it from the navbar
          tabBarStyle: { display: "none" }, // ensures no bar shows when visited
        }}
      />
      <Tabs.Screen
        name="face-attendance-out"
        options={{
          href: null, // completely hides it from the navbar
          tabBarStyle: { display: "none" }, // ensures no bar shows when visited
        }}
      />
       <Tabs.Screen
        name="profile"
        options={{
          href: null, // completely hides it from the navbar
          tabBarStyle: { display: "none" }, // ensures no bar shows when visited
        }}
      />
       <Tabs.Screen
        name="events"
        options={{
          href: null, // completely hides it from the navbar
          tabBarStyle: { display: "none" }, // ensures no bar shows when visited
        }}
      />
      <Tabs.Screen
        name="face-attendance"
        options={{
          href: null, // completely hides it from the navbar
          tabBarStyle: { display: "none" }, // ensures no bar shows when visited
        }}
      />
    </Tabs>
  );
}
