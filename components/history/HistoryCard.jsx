import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons, Feather } from "@expo/vector-icons";

const HistoryCard = () => {
  return (
    <View className="flex-1">
      <View className="w-full mx-auto bg-indigo-600 rounded-xl shadow-lg p-5">
        <View className="flex flex-row">
          <View className="flex-1">
            {/* Header */}
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-2xl font-extrabold text-gray-50 flex-1 mr-2">
                Simple Design Tips
              </Text>

              <View className="flex-row space-x-4">
                <TouchableOpacity className="flex-row items-center">
                  <Ionicons name="heart" size={16} color="#e5e7eb" />
                  <Text className="text-indigo-100 text-sm ml-1">
                    Date Here
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Body */}
            <View className="flex-row justify-between items-end">
              <View className="max-w-md">
                <Text className="text-indigo-100 mb-2">
                  Lorem ipsum dolor sit amet, consecte adipiscing elit sed do
                  eiusmod tempor incididunt ut labore.
                </Text>
              </View>

              {/* Read More */}
              <TouchableOpacity className="w-10 h-10 rounded-full bg-indigo-100 items-center justify-center">
                <Feather name="arrow-right" size={20} color="#4f46e5" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default HistoryCard;
