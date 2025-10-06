import React, { useState, useRef, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Button,
  Image,
  ActivityIndicator,
  Alert,
  Platform,
  StatusBar,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import AsyncStorage from "@react-native-async-storage/async-storage";
// Assuming api is an axios instance or similar configured for your backend
import api from "../assets/api"; 

export default function FaceRecognition() {
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    const getUserId = async () => {
      const userData = await AsyncStorage.getItem("userData");
      if (userData) {
        const parsed = JSON.parse(userData);
        setUserId(parsed.id);
      }
    };
    getUserId();
  }, []);

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="mb-4">We need your permission to use the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  const openCamera = () => {
    setCameraOpen(true);
    setCapturedPhoto(null);
  };

  const capturePhoto = async () => {
    if (!cameraRef.current) return;

    const photo = await cameraRef.current.takePictureAsync({
      base64: true,
      quality: 0.5,
    });
    setCapturedPhoto(photo);
    setCameraOpen(false);
  };

  const registerFace = async () => {
    if (!capturedPhoto || !userId) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("face_image", {
      uri: capturedPhoto.uri,
      name: "face.jpg",
      type: "image/jpeg",
    });

    try {
      // Correct URL structure with user ID
      const response = await api.post(`/api/register-face/${userId}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      Alert.alert("Success", `Face registered for ${response.data.name}`);
      setCapturedPhoto(null);
    } catch (error) {
      console.log(error.response?.data || error.message);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to register face"
      );
    } finally {
      setLoading(false);
    }
  };

  const matchFace = async () => {
    if (!capturedPhoto) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("face_image", {
      uri: capturedPhoto.uri,
      name: "face.jpg",
      type: "image/jpeg",
    });

    try {
      // Correct URL structure
      const response = await api.post(`/api/match-face/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.match) {
        Alert.alert(
          "Face Matched",
          `User: ${response.data.name}\nScore: ${response.data.score.toFixed(2)}`
        );
      } else {
        // This handles the "No face detected" and "No match found" responses
        Alert.alert("No Match Found", response.data.message || "Try again");
      }
    } catch (error) {
      console.log(error.response?.data || error.message);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to match face"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white items-center justify-center">
      {Platform.OS === "android" ? <StatusBar hidden /> : null}

      {!cameraOpen && !capturedPhoto && (
        <Button title="Open Camera" onPress={openCamera} />
      )}

      {cameraOpen && (
        <View className="relative w-72 h-72 bg-black">
          <CameraView
            ref={cameraRef}
            className="w-full h-full"
            facing="front"
          />
          <View className="absolute bottom-4 left-0 right-0 items-center">
            <Button title="Capture" onPress={capturePhoto} />
          </View>
        </View>
      )}

      {capturedPhoto && (
        <View className="items-center mt-4">
          <Image
            source={{ uri: capturedPhoto.uri }}
            style={{ width: 300, height: 400, borderRadius: 10 }}
          />
          <View className="mt-2 w-full px-8">
            {/* Disable Register if no user ID is available */}
            <Button 
                title={`Register Face ${userId ? '' : '(Log In)'}`} 
                onPress={registerFace} 
                disabled={!userId} 
            />
            <View className="mt-2" />
            <Button title="Match Face" onPress={matchFace} />
            <View className="mt-2" />
            <Button title="Retake" onPress={openCamera} />
          </View>
        </View>
      )}

      {loading && (
        <View className="absolute inset-0 justify-center items-center bg-black bg-opacity-50">
          <ActivityIndicator size="large" color="#00ff00" />
        </View>
      )}
    </SafeAreaView>
  );
}