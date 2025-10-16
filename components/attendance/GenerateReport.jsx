import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Linking,
  Modal,
  Pressable,
  Animated,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import api from "../../assets/api";

const GenerateReport = ({ attendanceId, eventName, course, year_lvl }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [downloadReady, setDownloadReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const handleGenerate = async () => {
    try {
      setLoading(true);
      const response = await api.get(
        `/api/export-attendance/${attendanceId}/`,
        {
          responseType: "blob",
        }
      );

      if (response.status === 200) {
        setDownloadReady(true);
        fadeIn();
        Alert.alert("Success", "Excel report is ready to download.");
      } else {
        Alert.alert("Error", "Failed to generate report.");
      }
    } catch (error) {
      console.log("Generate error:", error);
      Alert.alert("Error", "Something went wrong while generating the report.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const downloadUrl = `${api.defaults.baseURL}/api/export-attendance/${attendanceId}/`;
    Linking.openURL(downloadUrl);
  };

  const fadeIn = () => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.delay(2500),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <View className="flex-1">
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          className="flex-1 bg-black/50 justify-center items-center"
          onPressOut={() => setModalVisible(false)}
        >
          <Pressable
            className="bg-white w-11/12 rounded-2xl p-6 items-center"
            onPress={() => {}}
          >
            <Text className="text-lg font-bold mb-4">
              Generate Attendance Report for {eventName}
            </Text>

            {!downloadReady ? (
              <TouchableOpacity
                disabled={loading}
                onPress={handleGenerate}
                className={`${
                  loading ? "bg-gray-400" : "bg-blue-600"
                } rounded-xl px-6 py-3`}
              >
                <Text className="text-white font-bold text-base">
                  {loading ? "Generating..." : "Generate Report"}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={handleDownload}
                className="bg-green-600 rounded-xl px-6 py-3"
              >
                <Text className="text-white font-bold text-base">
                  Download Excel
                </Text>
              </TouchableOpacity>
            )}
          </Pressable>

          {downloadReady && (
            <Animated.View
              style={{
                opacity: fadeAnim,
                position: "absolute",
                bottom: 100,
              }}
            >
              <Text className="text-white text-sm">
                Generate complete, tap to download file
              </Text>
            </Animated.View>
          )}
        </Pressable>
      </Modal>

      <TouchableOpacity
        onPress={() => setModalVisible(!modalVisible)}
        disabled={loading}
        className={`absolute bottom-8 right-8 rounded-full p-4 ${
          downloadReady ? "bg-green-600" : "bg-blue-600"
        }`}
      >
        <Feather name="file-text" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default GenerateReport;
