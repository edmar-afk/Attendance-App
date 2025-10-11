import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import api from "../../assets/api";
import { useRouter } from "expo-router";

const AttendanceList = () => {
  const router = useRouter();
  const [attendances, setAttendances] = useState([]);
  const [countdowns, setCountdowns] = useState({});
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("All");
  const [userLocation, setUserLocation] = useState(null);
  const [locationEnabled, setLocationEnabled] = useState(false);

  const fetchAttendances = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/attendances/");
      setAttendances(res.data);
    } catch (error) {
      console.error("Error fetching attendances:", error);
    } finally {
      setLoading(false);
    }
  };

  const getUserLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location permission is required.");
        setLocationEnabled(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      setLocationEnabled(true);
      Alert.alert("Location Set!", "Your location has been updated.");
    } catch (error) {
      Alert.alert("Error", "Unable to get location.");
    }
  };

  const getDistanceKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // distance in km
  };

  useEffect(() => {
    fetchAttendances();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const newCountdowns = {};
      attendances.forEach((item) => {
        const limit = new Date(item.time_limit).getTime();
        const diff = Math.max(0, limit - now);
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        newCountdowns[item.id] = { minutes, seconds };
      });
      setCountdowns(newCountdowns);
    }, 1000);

    return () => clearInterval(interval);
  }, [attendances]);

  const filteredAttendances =
    filter === "All"
      ? attendances
      : attendances.filter((item) =>
          filter === "Active" ? item.is_active : !item.is_active
        );

  const nearbyAttendances =
    userLocation && locationEnabled
      ? filteredAttendances.filter((item) => {
          if (item.location) {
            const [latStr, lonStr] = item.location
              .split(",")
              .map((v) => v.trim());
            const lat = parseFloat(latStr);
            const lon = parseFloat(lonStr);
            if (!isNaN(lat) && !isNaN(lon)) {
              const distance = getDistanceKm(
                userLocation.latitude,
                userLocation.longitude,
                lat,
                lon
              );
              return distance <= 0.02; // 20 meters
            }
          }
          return false;
        })
      : filteredAttendances;

  return (
    <SafeAreaView className="flex-1 p-4">
      <View className="mb-2 flex flex-row items-center justify-between">
        <View className="flex flex-row gap-4">
          <TouchableOpacity onPress={() => setFilter("Active")}>
            <Text
              className={`font-bold ${
                filter === "Active" ? "text-green-600" : "text-blue-500"
              }`}
            >
              Active
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setFilter("Inactive")}>
            <Text
              className={`font-bold ${
                filter === "Inactive" ? "text-red-500" : "text-blue-500"
              }`}
            >
              Inactive
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={getUserLocation}>
            <Text className="font-bold text-blue-500">
              {locationEnabled ? "Location Set!" : "Turn on Location"}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={fetchAttendances}>
          <Text className="text-right font-bold text-blue-500">Refresh</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#2563EB" className="mt-10" />
      ) : (
        <ScrollView contentContainerStyle={{ alignItems: "center" }}>
          {nearbyAttendances.length > 0 ? (
            nearbyAttendances.map((item) => {
              const countdown = countdowns[item.id];
              const min = countdown ? countdown.minutes : 0;
              const sec = countdown ? countdown.seconds : 0;
              const formatted = `${min}:${sec
                .toString()
                .padStart(2, "0")} mins left`;

              return (
                <TouchableOpacity
                  key={item.id}
                  className="w-full rounded-xl bg-white shadow-lg m-2 p-5 mb-4"
                  onPress={() =>
                    router.push({
                      pathname: `/attendance-table/${item.id}`,
                      params: {
                        event_name: item.event_name,
                        time_limit: item.time_limit,
                      },
                    })
                  }
                >
                  <View className="flex flex-col gap-2">
                    <View className="flex flex-row items-end justify-between">
                      <Text className="text-base text-gray-600 font-bold">
                        Event Name: {item.event_name}
                      </Text>
                      {min === 0 && sec === 0 && (
                        <Text className="text-xs text-red-500 font-bold">
                          Time expired
                        </Text>
                      )}
                    </View>

                    <Text className="text-xs text-gray-400">
                      Date Created:{" "}
                      {new Date(item.date_created).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </Text>

                    {locationEnabled && item.location && (
                      <Text className="text-xs text-blue-500">
                        Within 20m from you ✅
                      </Text>
                    )}

                    <Text className="text-xs text-green-600 font-semibold">
                      {formatted}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })
          ) : (
            <Text className="text-gray-500 mt-10 text-center">
              {locationEnabled
                ? "No Active Attendance within 20m radius."
                : "No attendance records found."}
            </Text>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default AttendanceList;
