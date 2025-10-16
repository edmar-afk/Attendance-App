/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import api from "../../assets/api";
import { useLocalSearchParams } from "expo-router";
import TimeInAttendanceModal from "../../components/attendance/TimeInAttendanceModal";
import TimeOutAttendanceModal from "../../components/attendance/TimeOutAttendanceModal";
import { useFocusEffect } from "@react-navigation/native";
import GenerateReport from "../../components/attendance/GenerateReport";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AttendanceTable = () => {
  const { tableId, event_name, time_limit } = useLocalSearchParams();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [remaining, setRemaining] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [attendanceStatus, setAttendanceStatus] = useState({
    is_time_in: false,
    is_time_out: false,
  });
  const [userSuperuser, setUserSuperuser] = useState(null);
  console.log("from generate: ", userSuperuser);
  // Filters
  const [searchText, setSearchText] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  useFocusEffect(
    React.useCallback(() => {
      let intervalId;

      const loadUserSuperuser = async () => {
        try {
          const storedData = await AsyncStorage.getItem("userSuperuser");
          if (storedData) {
            const parsed = JSON.parse(storedData);
            setUserSuperuser(parsed);
            console.log("Updated userSuperuser:", parsed);
          } else {
            setUserSuperuser(null);
            console.log("No userSuperuser found");
          }
        } catch (error) {
          console.error("Error loading userSuperuser:", error);
        }
      };

      loadUserSuperuser();
      intervalId = setInterval(loadUserSuperuser, 3000);

      return () => clearInterval(intervalId);
    }, [])
  );
  useFocusEffect(
    useCallback(() => {
      fetchAttendanceStatus();
    }, [tableId])
  );

  useEffect(() => {
    fetchAttendanceRecords();
    fetchAttendanceStatus();
  }, [tableId, selectedCourse, selectedYear]);

  useEffect(() => {
    if (!time_limit) return;
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const limit = new Date(time_limit).getTime();
      const diff = Math.max(0, limit - now);
      if (diff <= 0) {
        setRemaining("Time expired");
        clearInterval(interval);
        return;
      }
      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setRemaining(
        `${minutes}:${seconds.toString().padStart(2, "0")} mins left`
      );
    }, 1000);
    return () => clearInterval(interval);
  }, [time_limit]);

  const fetchAttendanceRecords = async () => {
    try {
      if (!refreshing) setLoading(true);
      const response = await api.get(
        `/api/attendance-filter/${tableId}/records/`,
        {
          params: {
            year_lvl: selectedYear || undefined,
            course: selectedCourse || undefined,
            search: searchText || undefined,
          },
        }
      );
      setRecords(response.data);
    } catch (error) {
      Alert.alert("Error", "Failed to load attendance records.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchAttendanceStatus = async () => {
    try {
      const response = await api.get(`/api/attendance/status/${tableId}/`);
      setAttendanceStatus({
        is_time_in: response.data.is_time_in,
        is_time_out: response.data.is_time_out,
      });
    } catch (error) {
      console.log("Error fetching attendance status:", error);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAttendanceRecords();
    fetchAttendanceStatus();
  };

  const handleSearchChange = (text) => {
    setSearchText(text);
    fetchAttendanceRecords();
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#000" />
        <Text className="mt-2 text-gray-600">Loading records...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 p-4 mt-8">
      <View className="flex flex-row items-center justify-between">
        <Text className="mb-1 text-gray-800 mx-2 text-2xl font-bold">
          {event_name}
        </Text>
        <Text
          className={`mx-2 text-sm font-semibold ${
            remaining === "Time expired" ? "text-red-500" : "text-green-600"
          }`}
        >
          {remaining}
        </Text>
      </View>

      <View className="flex flex-row items-center justify-between p-4">
        <View>
          {remaining !== "Time expired" && (
            <>
              {attendanceStatus.is_time_in && (
                <TimeInAttendanceModal attendanceId={tableId} />
              )}
              {attendanceStatus.is_time_out && (
                <TimeOutAttendanceModal attendanceoutId={tableId} />
              )}
            </>
          )}
        </View>

        <TouchableOpacity onPress={handleRefresh} disabled={refreshing}>
          {refreshing ? (
            <ActivityIndicator size="small" color="#000" />
          ) : (
            <Text>
              <Ionicons name="refresh" size={24} color="#000" /> Refresh
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Filters Section */}
      <View className="mb-4 mx-2">
        <Text className="mb-1 font-semibold text-gray-700">Filters</Text>

        {/* Search Text
        <TextInput
          placeholder="Search student..."
          value={searchText}
          onChangeText={handleSearchChange}
          className="border border-gray-300 rounded-lg px-3 py-2 mb-2 bg-white"
        /> */}

        {/* Dropdowns */}
        <View className="flex flex-row justify-between">
          <View className="flex-1 mr-2">
            <Text className="text-gray-700 mb-1">Course</Text>
            <View className="border border-gray-300 rounded-lg bg-white">
              <Picker
                selectedValue={selectedCourse}
                onValueChange={(value) => setSelectedCourse(value)}
              >
                <Picker.Item label="All" value="" />
                <Picker.Item label="BSIT" value="BSIT" />
                <Picker.Item label="BSCS" value="BSCS" />
                <Picker.Item label="BSECE" value="BSECE" />
                <Picker.Item label="BSCE" value="BSCE" />
              </Picker>
            </View>
          </View>

          <View className="flex-1">
            <Text className="text-gray-700 mb-1">Year Level</Text>
            <View className="border border-gray-300 rounded-lg bg-white">
              <Picker
                selectedValue={selectedYear}
                onValueChange={(value) => setSelectedYear(value)}
              >
                <Picker.Item label="All" value="" />
                <Picker.Item label="1st Year" value="1st Year" />
                <Picker.Item label="2nd Year" value="2nd Year" />
                <Picker.Item label="3rd Year" value="3rd Year" />
                <Picker.Item label="4th Year" value="4th Year" />
              </Picker>
            </View>
          </View>
        </View>
      </View>

      <ScrollView horizontal>
        <View>
          {/* Header */}
          <View className="bg-white border-b border-gray-200 flex-row">
            <Text className="text-sm font-medium text-gray-900 px-6 py-4 w-40">
              Student Name
            </Text>
            <Text className="text-sm font-medium text-gray-900 px-6 py-4 w-32">
              Time In
            </Text>
            <Text className="text-sm font-medium text-gray-900 px-6 py-4 w-32">
              Time Out
            </Text>
          </View>

          {/* Body */}
          {records.length === 0 ? (
            <View className="py-10">
              <Text className="text-center text-gray-500 text-base">
                No student record found.
              </Text>
            </View>
          ) : (
            records.map((item, index) => (
              <View
                key={item.id}
                className={`flex-row border-b border-gray-200 ${
                  index % 2 === 0 ? "bg-gray-100" : "bg-white"
                }`}
              >
                <Text className="text-sm text-gray-900 font-light px-6 py-4 w-40">
                  {item.user_first_name || "N/A"}
                </Text>
                <Text
                  className={`text-sm px-6 py-4 w-32 ${
                    item.time_in
                      ? "text-gray-900 font-light"
                      : "text-red-500 font-bold"
                  }`}
                >
                  {item.time_in || "Absent"}
                </Text>
                <Text
                  className={`text-sm px-6 py-4 w-32 ${
                    item.time_out
                      ? "text-gray-900 font-light"
                      : "text-red-500 font-bold"
                  }`}
                >
                  {item.time_out || "Absent"}
                </Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {userSuperuser && (
        <GenerateReport
          attendanceId={tableId}
          eventName={event_name}
          course={selectedCourse || "All"}
          year_lvl={selectedYear || "All"}
        />
      )}
    </View>
  );
};

export default AttendanceTable;
