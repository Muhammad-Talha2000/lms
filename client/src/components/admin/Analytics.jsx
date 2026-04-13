import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  CartesianGrid,
} from "recharts";
import { getAllUsers } from "@/services/authService";
import { getCourses } from "@/services/courseService";
import { useSelector } from "react-redux";
import {
  Users,
  GraduationCap,
  BookOpen,
  TrendingUp,
  UserCheck,
  Wallet,
} from "lucide-react";

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { loggedinUser } = useSelector((state) => state.auth);

  const PIE_COLORS = ["#f97316", "#3b82f6", "#10b981", "#8b5cf6", "#ef4444"];

  const toMonthKey = (dateInput) => {
    const date = new Date(dateInput);
    if (Number.isNaN(date.getTime())) return "Unknown";
    return date.toLocaleString("en-US", { month: "short", year: "2-digit" });
  };

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        setError("");

        const [usersResponse, coursesResponse] = await Promise.all([
          getAllUsers(loggedinUser.token),
          getCourses(),
        ]);

        const users = Array.isArray(usersResponse?.users)
          ? usersResponse.users
          : [];
        const courses = Array.isArray(coursesResponse) ? coursesResponse : [];

        const instructors = users.filter((user) => user.role === "instructor");
        const students = users.filter((user) => user.role === "student");
        const guardians = users.filter((user) => user.role === "guardian");
        const admins = users.filter((user) => user.role === "admin");

        const publishedCourses = courses.filter((course) => course.published);
        const totalRevenue = courses.reduce(
          (sum, course) =>
            sum + (Number(course.price) || 0) * (course.enrolledStudents?.length || 0),
          0
        );

        const userRoleData = [
          { name: "Students", value: students.length },
          { name: "Instructors", value: instructors.length },
          { name: "Guardians", value: guardians.length },
          { name: "Admins", value: admins.length },
        ].filter((item) => item.value > 0);

        const courseTypeMap = courses.reduce((acc, course) => {
          const type = course.courseType || "Unknown";
          acc[type] = (acc[type] || 0) + 1;
          return acc;
        }, {});
        const courseTypeData = Object.entries(courseTypeMap).map(([name, value]) => ({
          name,
          value,
        }));

        const monthlyUsersMap = users.reduce((acc, user) => {
          const key = toMonthKey(user.createdAt);
          acc[key] = (acc[key] || 0) + 1;
          return acc;
        }, {});
        const monthlyCoursesMap = courses.reduce((acc, course) => {
          const key = toMonthKey(course.createdAt);
          acc[key] = (acc[key] || 0) + 1;
          return acc;
        }, {});
        const monthKeys = Array.from(
          new Set([...Object.keys(monthlyUsersMap), ...Object.keys(monthlyCoursesMap)])
        );
        const growthData = monthKeys.map((month) => ({
          month,
          users: monthlyUsersMap[month] || 0,
          courses: monthlyCoursesMap[month] || 0,
        }));

        const instructorPerformance = instructors
          .map((instructor) => {
            const instructorCourses = courses.filter((course) => {
              const instructorId =
                typeof course.instructor === "string"
                  ? course.instructor
                  : course.instructor?._id;
              return instructorId?.toString() === instructor._id?.toString();
            });

            const totalStudentsTaught = instructorCourses.reduce(
              (sum, course) => sum + (course.enrolledStudents?.length || 0),
              0
            );

            return {
              name: instructor.name || "Unknown",
              students: totalStudentsTaught,
              courses: instructorCourses.length,
            };
          })
          .sort((a, b) => b.students - a.students)
          .slice(0, 6);

        const enrollmentByType = Object.entries(
          courses.reduce((acc, course) => {
            const type = course.courseType || "Unknown";
            acc[type] = (acc[type] || 0) + (course.enrolledStudents?.length || 0);
            return acc;
          }, {})
        ).map(([name, enrollments]) => ({ name, enrollments }));

        setAnalytics({
          kpis: {
            totalUsers: users.length,
            totalStudents: students.length,
            totalInstructors: instructors.length,
            totalCourses: courses.length,
            publishedCourses: publishedCourses.length,
            totalRevenue,
          },
          userRoleData,
          courseTypeData,
          growthData,
          instructorPerformance,
          enrollmentByType,
        });
      } catch (err) {
        console.error("Error fetching analytics data:", err);
        setError("Failed to load analytics data.");
      } finally {
        setLoading(false);
      }
    };

    if (loggedinUser?.token) {
      fetchAnalyticsData();
    }
  }, [loggedinUser?.token]);

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Loading analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!analytics) return null;

  const { kpis } = analytics;

  return (
    <div className="p-4 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Users</p>
              <p className="text-3xl font-bold">{kpis.totalUsers}</p>
            </div>
            <Users className="w-8 h-8" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Instructors</p>
              <p className="text-3xl font-bold">{kpis.totalInstructors}</p>
            </div>
            <GraduationCap className="w-8 h-8" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Students</p>
              <p className="text-3xl font-bold">{kpis.totalStudents}</p>
            </div>
            <UserCheck className="w-8 h-8" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Courses</p>
              <p className="text-3xl font-bold text-gray-900">{kpis.totalCourses}</p>
              <p className="text-xs text-gray-500 mt-1">
                {kpis.publishedCourses} published
              </p>
            </div>
            <BookOpen className="w-8 h-8 text-orange-500" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Revenue Potential</p>
              <p className="text-3xl font-bold text-gray-900">
                {new Intl.NumberFormat("en-PK", {
                  style: "currency",
                  currency: "PKR",
                  maximumFractionDigits: 0,
                }).format(kpis.totalRevenue)}
              </p>
            </div>
            <Wallet className="w-8 h-8 text-emerald-600" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Growth Signals</p>
              <p className="text-3xl font-bold text-gray-900">
                {analytics.growthData.reduce((sum, m) => sum + m.users, 0)}
              </p>
              <p className="text-xs text-gray-500 mt-1">Total user signups (tracked)</p>
            </div>
            <TrendingUp className="w-8 h-8 text-violet-600" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Role Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.userRoleData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={110}
                  innerRadius={55}
                  paddingAngle={3}
                >
                  {analytics.userRoleData.map((entry, index) => (
                    <Cell
                      key={`role-${entry.name}`}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Course Type Split</CardTitle>
          </CardHeader>
          <CardContent className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.courseTypeData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={110}
                  innerRadius={55}
                  paddingAngle={3}
                >
                  {analytics.courseTypeData.map((entry, index) => (
                    <Cell
                      key={`type-${entry.name}`}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Users & Courses Growth</CardTitle>
          </CardHeader>
          <CardContent className="h-[340px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.growthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#f97316"
                  strokeWidth={3}
                  name="Users Joined"
                />
                <Line
                  type="monotone"
                  dataKey="courses"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  name="Courses Created"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Enrollments by Course Type</CardTitle>
          </CardHeader>
          <CardContent className="h-[340px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.enrollmentByType}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="enrollments"
                  stroke="#10b981"
                  fill="#a7f3d0"
                  name="Enrollments"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Instructor Performance</CardTitle>
        </CardHeader>
        <CardContent className="h-[360px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analytics.instructorPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="students" fill="#f97316" name="Students Taught" />
              <Bar dataKey="courses" fill="#3b82f6" name="Courses" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
