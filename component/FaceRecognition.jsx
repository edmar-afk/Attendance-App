import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Button,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Camera } from "expo-camera";

import * as ImagePicker from "expo-image-picker";
import api from "../assets/api";

const FaceRecognition = () => {
  const [permission, setPermission] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [image, setImage] = useState(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setPermission(status === "granted");
    })();
  }, []);

  const uploadFace = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImage(uri);

      const formData = new FormData();
      formData.append("face_image", {
        uri,
        name: "face.jpg",
        type: "image/jpeg",
      });

      try {
        setLoading(true);
        await api.post("/register-face/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        Alert.alert("✅ Face uploaded successfully!");
      } catch (error) {
        console.log(error);
        Alert.alert("❌ Upload failed");
      } finally {
        setLoading(false);
      }
    }
  };

  const recognizeFace = async (photoUri) => {
    const formData = new FormData();
    formData.append("face_image", {
      uri: photoUri,
      name: "face.jpg",
      type: "image/jpeg",
    });

    try {
      setLoading(true);
      setUserInfo(null);

      const response = await api.post("/match-face/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.match) {
        setUserInfo(response.data);
        Alert.alert("✅ Match Found!", `User ID: ${response.data.user_id}`);
      } else {
        Alert.alert("No match found");
      }
    } catch (error) {
      console.log(error);
      Alert.alert("❌ Error processing image");
    } finally {
      setLoading(false);
    }
  };

  const captureAndRecognize = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.6,
        });
        recognizeFace(photo.uri);
      } catch (error) {
        console.log(error);
        Alert.alert("❌ Camera error");
      }
    }
  };

  if (permission === null)
    return <Text className="text-lg">Requesting camera permission...</Text>;
  if (!permission)
    return (
      <Text className="text-lg text-red-500">Camera permission denied</Text>
    );

  return (
    <View className="flex-1 justify-center items-center bg-white p-5">
      <Text className="text-2xl font-bold mb-5">Face Recognition</Text>

      <Button title="📸 Upload Face (Register)" onPress={uploadFace} />

      <View className="w-full h-96 mt-7 rounded-lg overflow-hidden">
        <Camera ref={cameraRef} style={{ flex: 1 }} type="front" />
      </View>

      <View className="mt-5 w-full">
        <Button title="📷 Capture & Recognize" onPress={captureAndRecognize} />
      </View>

      {loading && (
        <View className="mt-7 items-center">
          <ActivityIndicator size="large" />
          <Text className="mt-2">Processing...</Text>
        </View>
      )}

      {image && (
        <Image source={{ uri: image }} className="w-48 h-48 rounded-lg mt-5" />
      )}

      {userInfo && (
        <View className="mt-5 items-center">
          <Text className="text-lg font-semibold">✅ Match Found!</Text>
          <Text>User ID: {userInfo.user_id}</Text>
          <Text>Name: {userInfo.name}</Text>
        </View>
      )}
    </View>
  );
};

export default FaceRecognition;
