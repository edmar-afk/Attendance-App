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

const EditEvent = ({ eventId, modalVisible, setModalVisible }) => {
  const [eventName, setEventName] = useState("");
  const [description, setDescription] = useState("");
  const [dateStarted, setDateStarted] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (modalVisible) {
      fetchEventDetails();
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
    } else {
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setEventName("");
        setDescription("");
        setDateStarted(null);
      });
    }
  }, [modalVisible]);

  const fetchEventDetails = async () => {
    try {
      const response = await api.get(`/api/edit-events/${eventId}/`);
      const data = response.data;
      setEventName(data.event_name);
      setDescription(data.description);

      // ensure proper date parsing
      const date = new Date(data.date_started + "T00:00:00");
      if (!isNaN(date)) {
        setDateStarted(date);
      } else {
        setDateStarted(null); // fallback
      }
    } catch (error) {
      Alert.alert("Error", "Failed to fetch event details");
      console.log(error);
    }
  };

  const handleEditEvent = async () => {
    if (!eventName || !description || !dateStarted) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }
    try {
      await api.put(`/api/edit-events/${eventId}/`, {
        event_name: eventName,
        description,
        date_started: dateStarted.toISOString().split("T")[0],
      });
      Alert.alert("Success", "Event updated successfully");
      setModalVisible(false);
    } catch (error) {
      Alert.alert("Error", "Failed to update event");
      console.log(error);
    }
  };

  const formatDate = (date) =>
    date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setDateStarted(selectedDate);
    }
  };

  return (
    <Modal
      transparent
      visible={modalVisible}
      animationType="none"
      onRequestClose={() => setModalVisible(false)}
    >
      <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
        <View className="flex-1 justify-center items-center bg-black/50">
          <TouchableWithoutFeedback>
            <Animated.View
              style={{ transform: [{ scale: scaleAnim }], width: "90%" }}
              className="bg-white p-6 rounded-lg shadow-lg"
            >
              <Text className="text-lg font-bold mb-4">Edit Event</Text>
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
                  {dateStarted ? formatDate(dateStarted) : "Select Date"}
                </Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={dateStarted || new Date()}
                  mode="date"
                  display="calendar"
                  onChange={onDateChange}
                />
              )}
              <View className="flex-row justify-end space-x-3 mt-2">
                <TouchableOpacity
                  className="bg-gray-400 px-4 py-2 rounded"
                  onPress={() => setModalVisible(false)}
                >
                  <Text className="text-white">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="bg-blue-600 px-4 py-2 rounded"
                  onPress={handleEditEvent}
                >
                  <Text className="text-white">Save</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default EditEvent;
