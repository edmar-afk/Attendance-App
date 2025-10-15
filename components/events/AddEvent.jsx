import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  Alert,
  Animated,
  TouchableWithoutFeedback,
  Platform,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import api from "../../assets/api";

const AddEvent = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [eventName, setEventName] = useState("");
  const [description, setDescription] = useState("");
  const [dateStarted, setDateStarted] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  const scaleAnim = useRef(new Animated.Value(0)).current;

  const handleAddEvent = async () => {
    if (!eventName || !description || !dateStarted) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }
    try {
      await api.post("/events/", {
        event_name: eventName,
        description,
        date_started: dateStarted,
      });
      Alert.alert("Success", "Event added successfully");
      closeModal();
    } catch (error) {
      Alert.alert("Error", "Failed to add event");
      console.log(error);
    }
  };

  const openModal = () => {
    setModalVisible(true);
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(scaleAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
      setEventName("");
      setDescription("");
      setDateStarted("");
    });
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      const date = selectedDate.toISOString().split("T")[0];
      setDateStarted(date);
    }
  };

  return (
    <>
      <Modal
        transparent
        visible={modalVisible}
        animationType="none"
        onRequestClose={closeModal}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View className="flex-1 justify-center items-center bg-black/50">
            <TouchableWithoutFeedback>
              <Animated.View
                style={{
                  transform: [{ scale: scaleAnim }],
                  width: "90%",
                }}
                className="bg-white p-6 rounded-lg shadow-lg"
              >
                <Text className="text-lg font-bold mb-4">New Event</Text>
                <TextInput
                  placeholder="Event Name"
                  className="border border-gray-300 rounded p-2 mb-3"
                  value={eventName}
                  onChangeText={setEventName}
                />
                <TextInput
                  placeholder="Description"
                  className="border border-gray-300 rounded p-2 mb-3"
                  value={description}
                  onChangeText={setDescription}
                />
                <TouchableOpacity
                  className="border border-gray-300 rounded p-2 mb-3"
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text className={dateStarted ? "text-black" : "text-gray-400"}>
                    {dateStarted || "Select Date"}
                  </Text>
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={dateStarted ? new Date(dateStarted) : new Date()}
                    mode="date"
                    display="calendar"
                    onChange={onDateChange}
                  />
                )}
                <View className="flex-row justify-end space-x-3 mt-2">
                  <TouchableOpacity
                    className="bg-gray-400 px-4 py-2 rounded"
                    onPress={closeModal}
                  >
                    <Text className="text-white">Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="bg-blue-600 px-4 py-2 rounded"
                    onPress={handleAddEvent}
                  >
                    <Text className="text-white">Add</Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <TouchableOpacity
        className="bg-blue-600 w-16 h-16 rounded-full justify-center items-center shadow-lg"
        style={{
          position: "absolute",
          bottom: 24,
          left: "50%",
          transform: [{ translateX: -32 }],
          zIndex: 999,
        }}
        onPress={openModal}
      >
        <Text className="text-white text-3xl">+</Text>
      </TouchableOpacity>
    </>
  );
};

export default AddEvent;
