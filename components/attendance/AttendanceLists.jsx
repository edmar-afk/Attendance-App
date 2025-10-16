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
import TimeInButton from "../toggles/TimeInButton";
import TimeOutButton from "../toggles/TimeOutButton";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AttendanceList = () => {
  const router = useRouter();
  const [attendances, setAttendances] = useState([]);
  const [countdowns, setCountdowns] = useState({});
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("All");
  const [userLocation, setUserLocation] = useState(null);
  const [locationEnabled, setLocationEnabled] = useState(false);

  const [userData, setUserData] = useState(null);
  console.log("UserData:", userData?.is_superuser);

  useEffect(() => {
    let subscription;

    const startWatchingLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location permission is required.");
        setLocationEnabled(false);
        return;
      }

      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 1,
        },
        (location) => {
          setUserLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            accuracy: location.coords.accuracy,
          });
          setLocationEnabled(true);
        }
      );
    };

    startWatchingLocation();

    return () => {
      if (subscription) subscription.remove();
    };
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      const storedData = await AsyncStorage.getItem("userData");
      if (storedData) setUserData(JSON.parse(storedData));
    };
    fetchUserData();
  }, []);

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

  // const getUserLocation = async () => {
  //   try {
  //     const { status } = await Location.requestForegroundPermissionsAsync();
  //     if (status !== "granted") {
  //       Alert.alert("Permission Denied", "Location permission is required.");
  //       setLocationEnabled(false);
  //       return;
  //     }

  //     const location = await Location.getCurrentPositionAsync({});
  //     setUserLocation({
  //       latitude: location.coords.latitude,
  //       longitude: location.coords.longitude,
  //     });
  //     console.log("User Location:", location.coords);
  //     console.log("Lists of Attendance: ", attendances);
  //     setLocationEnabled(true);
  //     Alert.alert("Location Set!", "Your location has been updated.");
  //   } catch (error) {
  //     Alert.alert("Error", "Unable to get location.");
  //   }
  // };

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
      ? filteredAttendances.map((item) => {
          if (!item.location) return { ...item, isNearby: false };
          const [latStr, lonStr] = item.location
            .split(",")
            .map((v) => v.trim());
          const lat = parseFloat(latStr);
          const lon = parseFloat(lonStr);
          if (isNaN(lat) || isNaN(lon)) return { ...item, isNearby: false };

          const distance = getDistanceKm(
            userLocation.latitude,
            userLocation.longitude,
            lat,
            lon
          );

          const radius = 0.6; // 20 meters
          const accuracyKm = (userLocation.accuracy || 10) / 1000;

          const isNearby = distance <= Math.max(radius, accuracyKm);

          return { ...item, isNearby };
        })
      : filteredAttendances.map((item) => ({ ...item, isNearby: false }));

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
                  onPress={() => {
                    if (item.isNearby) {
                      router.push({
                        pathname: `/attendance-table/${item.id}`,
                        params: {
                          event_name: item.event_name,
                          time_limit: item.time_limit,
                        },
                      });
                    } else {
                      Alert.alert(
                        "Outside Classroom",
                        "You are outside the classroom. You cannot access this attendance."
                      );
                    }
                  }}
                >
                  <View className="flex flex-col gap-2">
                    <View className="flex flex-row items-end justify-between">
                      <Text className="text-base text-gray-600 font-bold">
                        Event Name: {item.event_name}
                      </Text>
                      {min === 0 && sec === 0 ? (
                        <Text className="text-xs text-red-500 font-bold">
                          Time expired
                        </Text>
                      ) : (
                        <Text className="text-xs text-green-500 font-bold">
                          Active
                        </Text>
                      )}
                    </View>

                    <Text className="text-sm text-gray-400">
                      Date Created:{" "}
                      {new Date(item.date_created).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </Text>

                    {locationEnabled && item.location && (
                      <Text
                        className={`text-sm ${
                          item.isNearby ? "text-blue-500" : "text-red-500"
                        }`}
                      >
                        {item.isNearby
                          ? "You're Within classroom ✅"
                          : "You're Outside classroom ❌"}
                      </Text>
                    )}

                    <View className="flex flex-row items-center justify-between">
                      <Text className="text-sm text-green-600 font-semibold">
                        {formatted}
                      </Text>
                      {userData?.is_superuser == true && (
                        <>
                          <TimeInButton
                            attendanceId={item.id}
                            time={formatted}
                            onTimeInSuccess={fetchAttendances}
                          />
                          <TimeOutButton
                            attendanceId={item.id}
                            time={formatted}
                            onTimeOutSuccess={fetchAttendances}
                          />
                        </>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          ) : (
            <Text className="text-gray-500 mt-10 text-center">
              {locationEnabled
                ? "No Active Attendance within 70m radius."
                : "No attendance records found."}
            </Text>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default AttendanceList;
