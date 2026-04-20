import React, { useEffect, useMemo, useState } from "react";
import { BarChart3, BookOpen, GraduationCap, Layers3, Users } from "lucide-react";
import { getPublicPlatformStats } from "@/services/authService";

const StatCard = ({ icon: Icon, label, value, accent = "text-orange-500" }) => (
  <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
    <div className="flex items-center justify-between">
      <p className="text-sm text-gray-600">{label}</p>
      <Icon className={`h-4 w-4 ${accent}`} />
    </div>
    <p className="mt-2 text-2xl font-bold text-gray-900">
      {Number(value || 0).toLocaleString()}
    </p>
  </div>
);

const PublicStatsDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const loadStats = async () => {
      try {
        const data = await getPublicPlatformStats();
        if (mounted) setStats(data?.stats || null);
      } catch (error) {
        if (mounted) setStats(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    loadStats();
    return () => {
      mounted = false;
    };
  }, []);

  const publicationRatio = useMemo(() => {
    if (!stats?.totalCourses) return 0;
    return Math.min(
      100,
      Math.round((Number(stats.publishedCourses || 0) / Number(stats.totalCourses)) * 100)
    );
  }, [stats]);

  return (
    <section className="py-10 sm:py-14">
      <div className="mx-auto max-w-7xl rounded-3xl border border-orange-100 bg-gradient-to-br from-orange-50 via-white to-blue-50 p-5 sm:p-7">
        <div className="mb-5 flex items-center gap-2 text-sm font-medium text-gray-700">
          <BarChart3 className="h-4 w-4 text-orange-500" />
          Live platform insights
        </div>
        <div className="mb-6 flex flex-col gap-2">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Explore growth metrics before you register
          </h2>
          <p className="text-sm text-gray-600 sm:text-base">
            New visitors can instantly see real LMS activity and learning scale.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-24 animate-pulse rounded-2xl border border-gray-200 bg-white/80"
              />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                icon={Users}
                label="Active learners"
                value={stats?.learners}
                accent="text-sky-600"
              />
              <StatCard
                icon={GraduationCap}
                label="Verified instructors"
                value={stats?.activeInstructors}
                accent="text-indigo-600"
              />
              <StatCard
                icon={BookOpen}
                label="Courses available"
                value={stats?.totalCourses}
              />
              <StatCard
                icon={Layers3}
                label="Classes & subjects"
                value={Number(stats?.totalClasses || 0) + Number(stats?.totalSubjects || 0)}
                accent="text-emerald-600"
              />
            </div>

            <div className="mt-5 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="mb-2 flex items-center justify-between text-sm text-gray-600">
                <span>Published course readiness</span>
                <span className="font-semibold text-gray-900">{publicationRatio}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-orange-500 to-blue-600 transition-all duration-500"
                  style={{ width: `${publicationRatio}%` }}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default PublicStatsDashboard;
