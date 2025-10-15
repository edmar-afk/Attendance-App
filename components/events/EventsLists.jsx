import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const EventsLists = () => {
  return (
    <View className="p-4">
      <View className="w-full mx-auto bg-green-600 rounded-lg shadow-lg">
        <View className="px-6 py-5">
          <View className="flex-row items-start">
            <Ionicons name="albums-outline" size={30} color="#C7D2FE" className="mr-5" />
            <View className="flex-1">
              <View className="flex-col justify-start mb-3">
                <Text className="text-2xl font-extrabold text-gray-50 truncate mb-1 sm:mb-0">
                  Simple Design Tips
                </Text>
                <View className="flex-row items-center space-x-3">
                  <TouchableOpacity className="flex-row items-center">
                    <Ionicons name="heart-outline" size={16} color="#D1D5DB" className="mr-2" />
                    <Text className="text-green-100 text-sm">498</Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="flex-row items-center">
                    <Ionicons name="chatbubble-outline" size={16} color="#D1D5DB" className="mr-2" />
                    <Text className="text-green-100 text-sm">64</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View className="flex-row items-end justify-between">
                <View className="max-w-md">
                  <Text className="text-green-100 mb-2">
                    Lorem ipsum dolor sit amet, consecte adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore.
                  </Text>
                </View>
                <TouchableOpacity className="w-10 h-10 rounded-full bg-gradient-to-b from-green-50 to-green-100 justify-center items-center ml-2">
                  <Text className="font-bold">→</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default EventsLists;
