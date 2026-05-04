import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { API_V1_BASE } from "@/config/apiBase";
import { BadgeDollarSign, BookOpen, CreditCard, Users } from "lucide-react";

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const PaymentManagement = () => {
  const { loggedinUser } = useSelector((state) => state.auth);
  const token = loggedinUser?.token;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState({
    totalTransactions: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    coursesWithSales: 0,
  });
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const loadPayments = async () => {
      if (!token) return;
      setLoading(true);
      setError("");
      try {
        const { data } = await axios.get(`${API_V1_BASE}/payment/admin/overview`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSummary(data?.summary || {});
        setTransactions(data?.recentTransactions || []);
      } catch (err) {
        setError(
          err?.response?.data?.error ||
            err?.message ||
            "Failed to load payment overview."
        );
      } finally {
        setLoading(false);
      }
    };
    loadPayments();
  }, [token]);

  const topTransactions = useMemo(() => transactions.slice(0, 12), [transactions]);

  return (
    <div className="w-full max-w-7xl space-y-5">
      <section className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-cyan-50/60 p-5 shadow-sm sm:p-6">
        <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Payment Management
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Revenue and enrollment transaction overview from current course records.
        </p>
      </section>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
              <CreditCard className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Transactions
              </p>
              <p className="text-xl font-bold text-gray-900">
                {loading ? "..." : summary.totalTransactions || 0}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <BadgeDollarSign className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500">Revenue</p>
              <p className="text-xl font-bold text-gray-900">
                {loading ? "..." : usd.format(summary.totalRevenue || 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
              <Users className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500">Avg order</p>
              <p className="text-xl font-bold text-gray-900">
                {loading ? "..." : usd.format(summary.averageOrderValue || 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
              <BookOpen className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Courses with sales
              </p>
              <p className="text-xl font-bold text-gray-900">
                {loading ? "..." : summary.coursesWithSales || 0}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
        <h3 className="mb-3 text-lg font-semibold text-gray-900">Recent transactions</h3>
        {loading ? (
          <p className="py-10 text-center text-sm text-gray-500">
            Loading payment activity...
          </p>
        ) : topTransactions.length === 0 ? (
          <p className="py-10 text-center text-sm text-gray-500">
            No payment records found yet.
          </p>
        ) : (
          <>
            <div className="hidden overflow-x-auto rounded-xl border border-gray-200 lg:block">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">
                      Student
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">
                      Course
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">
                      Instructor
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {topTransactions.map((txn) => (
                    <tr key={txn.id} className="border-t border-gray-100">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">{txn.studentName}</p>
                        <p className="text-xs text-gray-500">{txn.studentEmail}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-700">{txn.courseName}</td>
                      <td className="px-4 py-3 text-gray-600">{txn.instructorName}</td>
                      <td className="px-4 py-3 font-semibold text-emerald-700">
                        {usd.format(txn.amount || 0)}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {new Date(txn.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-3 lg:hidden">
              {topTransactions.map((txn) => (
                <article
                  key={txn.id}
                  className="rounded-xl border border-gray-200 bg-gray-50 p-4"
                >
                  <p className="font-semibold text-gray-900 break-words">
                    {txn.studentName}
                  </p>
                  <p className="text-xs text-gray-500 break-all">{txn.studentEmail}</p>
                  <p className="mt-2 text-sm text-gray-700 break-words">
                    Course: {txn.courseName}
                  </p>
                  <p className="text-sm text-gray-600 break-words">
                    Instructor: {txn.instructorName}
                  </p>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <span className="font-semibold text-emerald-700">
                      {usd.format(txn.amount || 0)}
                    </span>
                    <span className="text-xs text-gray-500 text-right">
                      {new Date(txn.createdAt).toLocaleString()}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default PaymentManagement;