import React, { useRef, useEffect, useState } from "react";
import { View, ActivityIndicator, Text } from "react-native";
import { WebView } from "react-native-webview";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";

const FaceRegistration = () => {
  const webviewRef = useRef(null);
  const isFocused = useIsFocused();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    let intervalId;

    const fetchUserData = async () => {
      try {
        const data = await AsyncStorage.getItem("userData");
        if (data) {
          setUserData(data);
          console.log("Refreshed userData:", data);
        }
      } catch (error) {
        console.error("Error fetching userData:", error);
      }
    };

    fetchUserData();
    intervalId = setInterval(fetchUserData, 2000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (isFocused && webviewRef.current && userData) {
      const escapedData = userData.replace(/'/g, "\\'");
      webviewRef.current.injectJavaScript(`
        window.dispatchEvent(new MessageEvent('message', { data: '${escapedData}' }));
        true;
      `);
    }
  }, [isFocused, userData]);

  if (!isFocused) return null;

  return (
    <View style={{ flex: 1 }}>
      <WebView
        ref={webviewRef}
        source={{ uri: "https://attendance-checker-frontend.vercel.app/" }}
        startInLoadingState
        renderLoading={() => (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator size="large" color="#0000ff" />
            <Text>Loading Attendance...</Text>
          </View>
        )}
      />
      <Text>This is registering</Text>
    </View>
  );
};

export default FaceRegistration;
