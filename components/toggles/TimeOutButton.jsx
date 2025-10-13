import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import api from "../../assets/api";

const TimeOutButton = ({ attendanceId, time, onTimeOutSuccess }) => {
  const [timeLimit, setTimeLimit] = useState("");
  const [visible, setVisible] = useState(false);

  const handleTimeOut = async () => {
    if (!timeLimit) {
      Alert.alert("Missing Input", "Please enter the time limit in minutes.");
      return;
    }

    try {
      await api.post(`/api/attendance/timeout-toggle/${attendanceId}/`, {
        time_limit_minutes: parseInt(timeLimit),
      });

      Alert.alert("Success", "You have successfully timed Out!");
      setVisible(false);
      setTimeLimit("");

      if (onTimeOutSuccess) {
        onTimeOutSuccess(); // ✅ Trigger parent refresh
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to time in. Please try again.");
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={() => setVisible(true)}>
        <Text className="text-blue-600 text-xs">Open Time Out</Text>
      </TouchableOpacity>

      <Modal
        transparent
        visible={visible}
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setVisible(false)}>
          <View className="flex-1 bg-black/40 justify-center items-center">
            <TouchableWithoutFeedback>
              <View className="bg-white w-72 rounded-2xl p-5 items-center">
                <Text className="text-lg font-semibold mb-3">
                  Enter Time Limit
                </Text>
                <TextInput
                  className="border border-gray-400 rounded-lg w-32 text-center p-2 mb-4"
                  placeholder="Minutes"
                  keyboardType="numeric"
                  value={timeLimit}
                  onChangeText={setTimeLimit}
                />
                <TouchableOpacity
                  onPress={handleTimeOut}
                  className="bg-blue-600 px-4 py-2 rounded-xl"
                >
                  <Text className="text-white text-base font-semibold">
                    Time Out
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default TimeOutButton;
