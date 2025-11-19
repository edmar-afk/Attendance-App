import { View, Text } from "react-native";
import React, { useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import HistoryCard from "../../components/history/HistoryCard";
import api from "../../assets/api";

const History = () => {
  const [history, setHistory] = useState([]);
  const [userId, setUserId] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;

      const loadHistory = async () => {
        try {
          await new Promise((resolve) => setTimeout(resolve, 500));
          const storedUser = await AsyncStorage.getItem("userData");
          if (!storedUser) return;

          const user = JSON.parse(storedUser);
          console.log("Reloaded user:", user.id);
          setUserId(user.id);

          const res = await api.get(`/api/history/${user.id}/`);
          setHistory(res.data);
        } catch (error) {
          console.error("Error loading history:", error);
        }
      };

      loadHistory();

      return () => {
        isActive = false;
      };
    }, [])
  );

  return (
    <View className="flex-1 px-4 pr-8 mt-8">
      {history.length > 0 ? (
        history.map((item) => (
          <HistoryCard
            key={item.id}
            title={item.title}
            subtitle={item.subtitle}
            date={item.date}
          />
        ))
      ) : (
        <Text className="text-center text-gray-500 mt-4">
          No history shown
          {userId ? `(User ID: ${userId})` : ""}
        </Text>
      )}
    </View>
  );
};

export default History;
