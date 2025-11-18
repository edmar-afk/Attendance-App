import { Tabs, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Text, View, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";

export default function Layout() {
  const [isSuperuser, setIsSuperuser] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      let intervalId;

      const loadSuperuserStatus = async () => {
        try {
          const storedSuperuser = await AsyncStorage.getItem("userSuperuser");
          if (storedSuperuser) {
            const parsed = JSON.parse(storedSuperuser);
            setIsSuperuser(parsed);
            console.log("Reloaded userSuperuser:", parsed);
          } else {
            setIsSuperuser(false);
            console.log("No userSuperuser found — defaulting to false");
          }
        } catch (error) {
          console.error("Error loading userSuperuser:", error);
        } finally {
          setIsLoaded(true);
        }
      };

      loadSuperuserStatus();

      intervalId = setInterval(loadSuperuserStatus, 2000);

      return () => {
        if (intervalId) {
          clearInterval(intervalId);
          console.log("Interval cleared for Layout");
        }
      };
    }, [])
  );

  if (!isLoaded) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }
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
      {isSuperuser ? (
        <Tabs.Screen
          name="students"
          options={{
            title: "Students",
            tabBarIcon: ({ color, size }) => (
              <View className="items-center">
                <Ionicons name="person" size={size} color={color} />
              </View>
            ),
          }}
        />
      ) : (
        <Tabs.Screen
          name="students"
          options={{
            href: null,
            tabBarStyle: { display: "none" },
          }}
        />
      )}

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
        name="Logout"
        options={{
          href: null, // completely hides it from the navbar
          tabBarStyle: { display: "none" }, // ensures no bar shows when visited
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
        name="history-logs"
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
