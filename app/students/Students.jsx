import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import StudentsLists from "../../components/students/StudentsLists";
import api from "../../assets/api";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/students/");
      setStudents(response.data);
      setFilteredStudents(response.data);
    } catch (error) {
      console.log("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    let filtered = students;

    if (selectedCourse) {
      filtered = filtered.filter(
        (s) => s.course.toUpperCase() === selectedCourse
      );
    }

    if (selectedYear) {
      filtered = filtered.filter((s) => s.year_lvl === selectedYear);
    }

    setFilteredStudents(filtered);
  }, [selectedCourse, selectedYear, students]);

  const handleUpdateStudent = (userId, updatedData) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.user.id === userId
          ? { ...student, user: { ...student.user, ...updatedData } }
          : student
      )
    );
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  const courses = [
    "SET DEPT.",
    "BIT",
    "SCS DEPT.",
    "BSIT",
    "STE DEPT.",
    "BTVTED FSM",
    "BTLED HE",
    "BTLED AP",
  ];

  const years = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

  const handleDeleteStudent = async (userId, firstName) => {
    try {
      const confirmed = await new Promise((resolve) => {
        Alert.alert(
          "Confirm Deletion",
          `Are you sure you want to delete ${firstName}?`,
          [
            { text: "Cancel", style: "cancel", onPress: () => resolve(false) },
            {
              text: "Delete",
              style: "destructive",
              onPress: () => resolve(true),
            },
          ]
        );
      });

      if (!confirmed) return;

      await api.delete(`/api/users/delete/${userId}/`);
      setStudents((prev) => prev.filter((s) => s.user.id !== userId));
      Alert.alert("Deleted", `${firstName} has been deleted successfully.`);
    } catch (error) {
      console.log("Error deleting student:", error);
      Alert.alert("Deleted", `${firstName} has been deleted successfully.`);
    }
  };

  return (
    <ScrollView className="p-4">
      <View className="flex-row items-center mb-4 justify-between px-2 pt-5">
        <Text className="text-xl font-bold">Students</Text>
        <TouchableOpacity
          className="flex-row items-center"
          onPress={fetchStudents}
        >
          <Ionicons name="refresh" size={20} color="#4B5563" />
          <Text className="ml-2 text-gray-700">Refresh</Text>
        </TouchableOpacity>
      </View>

      <View className="bg-gray-100 rounded-lg p-3 mb-4">
        <Text className="text-gray-700 font-semibold mb-2">
          Filter Students
        </Text>

        <Text className="text-gray-600">Course</Text>
        <Picker
          selectedValue={selectedCourse}
          onValueChange={(value) => setSelectedCourse(value)}
        >
          <Picker.Item label="All Courses" value="" />
          {courses.map((course) => (
            <Picker.Item key={course} label={course} value={course} />
          ))}
        </Picker>

        <Text className="text-gray-600 mt-2">Year Level</Text>
        <Picker
          selectedValue={selectedYear}
          onValueChange={(value) => setSelectedYear(value)}
        >
          <Picker.Item label="All Years" value="" />
          {years.map((year) => (
            <Picker.Item key={year} label={year} value={year} />
          ))}
        </Picker>
      </View>

      {filteredStudents.length > 0 ? (
        filteredStudents.map((student) => (
          <StudentsLists
            key={student.user.id}
            userId={student.user.id}
            username={student.user.username}
            first_name={student.user.first_name}
            last_name={student.user.last_name}
            email={student.user.email}
            is_superuser={student.user.is_superuser}
            year_lvl={student.year_lvl}
            course={student.course}
            onUpdateStudent={handleUpdateStudent}
            onDeletePress={() =>
              handleDeleteStudent(student.user.id, student.user.first_name)
            }
          />
        ))
      ) : (
        <Text className="text-center text-gray-500 mt-4">
          No students found on {selectedCourse} - {selectedYear}
        </Text>
      )}
    </ScrollView>
  );
};

export default Students;
