import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import StudentsLists from "../../components/students/StudentsLists";
import api from "../../assets/api";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/students/");
      setStudents(response.data);
    } catch (error) {
      console.log("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

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
      {students.map((student) => (
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
          schoolId={student.schoolId}
          status={student.status}
          face_id={student.face_id}
          onUpdateStudent={handleUpdateStudent}
        />
      ))}
    </ScrollView>
  );
};

export default Students;
