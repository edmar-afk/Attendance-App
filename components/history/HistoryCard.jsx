import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons, Feather } from "@expo/vector-icons";

const HistoryCard = ({ title, subtitle, date }) => {
  const formattedDate = new Date(date)
    .toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    .replace(",", " -");

  const getRelativeTime = (dateString) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHrs = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHrs / 24);

    const minutes = diffMins % 60;
    const hours = diffHrs % 24;

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHrs < 24) return `${diffHrs}h ${minutes}m ago`;
    return `${diffDays}d ${hours}h ${minutes}m ago`;
  };

  const relativeTime = getRelativeTime(date);

  return (
    <View className="mb-4">
      <View className="w-full mx-auto bg-green-600 rounded-xl shadow-lg p-5">
        <View className="flex flex-row">
          <View className="flex-1">
            {/* Relative time and calendar */}
            <View className="flex flex-row items-center justify-between mb-4 space-x-4">
              <View className="flex-row items-center">
                <Ionicons name="time" size={16} color="#e5e7eb" />
                <Text className="text-white text-sm ml-1">{relativeTime}</Text>
              </View>

              <TouchableOpacity className="flex-row items-center">
                <Ionicons name="calendar" size={16} color="#e5e7eb" />
                <Text className="text-green-100 text-sm ml-1">
                  {formattedDate}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Title */}
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-2xl font-extrabold text-gray-50 flex-1 mr-2">
                {title}
              </Text>
            </View>

            {/* Body and bookmark */}
            <View className="flex-row justify-between items-end">
              <View className="max-w-md">
                <Text className="text-green-100 mb-2">{subtitle}</Text>
              </View>

              <TouchableOpacity className="w-10 h-10 rounded-full bg-green-100 items-center justify-center">
                <Feather name="bookmark" size={20} color="#4f46e5" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default HistoryCard;
