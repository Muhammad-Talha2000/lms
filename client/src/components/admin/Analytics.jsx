import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { getAllUsers } from "@/services/authService";
import { getCourses} from "@/services/courseService";
import { useSelector } from "react-redux";

const Analytics = () => {
 
const [data, setData] = useState([]);

const { loggedinUser } = useSelector((state) => state.auth);

useEffect(() => {
  const fetchAnalyticsData = async () => {
    try {
      const usersResponse = await getAllUsers(loggedinUser.token);
      console.log("Full API Response:", usersResponse); // Debugging
      
      // Check if `data` exists (for Axios)
      const usersResult = usersResponse.data ? usersResponse.data : usersResponse;

      // get data of courses 
      const coursesResponse = await getCourses(loggedinUser.token);
      console.log("Full API Response:", coursesResponse); // Debugging
      const coursesResult = coursesResponse.data ? coursesResponse.data : coursesResponse;


      if (!usersResult || !Array.isArray(usersResult.users)) {
        throw new Error("Invalid API response format");
      }

      // Count users by role
      const instructorsCount = usersResult.users.filter(user => user.role === "instructor").length;
      const learnersCount = usersResult.users.filter(user => user.role === "student").length;
      const coursesCount = coursesResult.length;

      // Set data for the chart and cards
      setData([
        { category: "Instructors", count: instructorsCount },
        { category: "Learners", count: learnersCount },
        { category: "Course", count: coursesCount},
      ]);
    } catch (error) {
      console.error("Error fetching analytics data:", error);
    }
  };

  fetchAnalyticsData();
}, [loggedinUser.token]);





  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      {data.map((item) => (
        <Card key={item.category}>
          <CardHeader>
            <CardTitle>{item.category}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{item.count}</p>
          </CardContent>
        </Card>
      ))}
      <Card className="col-span-1 md:col-span-3">
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#f97316" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

export default Analytics
