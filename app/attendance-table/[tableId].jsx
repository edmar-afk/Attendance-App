import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import api from "../../assets/api";
import { useLocalSearchParams } from "expo-router";
import TimeInAttendanceModal from "../../components/attendance/TimeInAttendanceModal";
import TimeInFaceAttendance from "../../components/attendance/TimeInFaceAttendance";

const AttendanceTable = () => {
  const { tableId, event_name, time_limit } = useLocalSearchParams();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [remaining, setRemaining] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchAttendanceRecords();
  }, [tableId]);

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
      const response = await api.get(`/api/attendance/${tableId}/records/`);
      setRecords(response.data);
    } catch (error) {
      Alert.alert("Error", "Failed to load attendance records.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
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
          <TimeInAttendanceModal attendanceId={tableId} />
          <TimeInFaceAttendance />
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

      <ScrollView horizontal>
        <View className="min-w-full">
          <View className="bg-white border-b border-gray-200">
            <View className="flex-row">
              <Text className="text-sm font-medium text-gray-900 px-6 py-4 flex-1">
                Student Name
              </Text>
              <Text className="text-sm font-medium text-gray-900 px-6 py-4 flex-1">
                Time In
              </Text>
              <Text className="text-sm font-medium text-gray-900 px-6 py-4 flex-1">
                Time Out
              </Text>
            </View>
          </View>

          {records.length === 0 ? (
            <View className="py-10">
              <Text className="text-center text-gray-500 text-base">
                No student record found. Be the first one to log in!
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
                <Text className="text-sm text-gray-900 font-light px-6 py-4 flex-1">
                  {item.user_first_name || "N/A"}
                </Text>
                <Text className="text-sm text-gray-900 font-light px-6 py-4 flex-1">
                  {item.time_in || "-"}
                </Text>
                <Text className="text-sm text-gray-900 font-light px-6 py-4 flex-1">
                  {item.time_out || "-"}
                </Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default AttendanceTable;
