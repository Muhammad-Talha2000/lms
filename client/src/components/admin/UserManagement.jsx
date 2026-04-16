import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pagination } from "@/components/ui/pagination";
import { getAllUsers, toggleStatus } from "@/services/authService";
import { useSelector } from "react-redux";
import { useToast } from "@/hooks/use-toast";
import { UsersRound } from "lucide-react";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { loggedinUser } = useSelector((state) => state.auth);
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers(loggedinUser.token);
      console.log("Fetched Users:", data);
      setUsers(data.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleActivate = async (userId) => {
    try {
      await toggleStatus(loggedinUser.token, userId);
      await fetchUsers(loggedinUser.token);
      toast({
        title: "Success!",
        description: "User status updated successfully",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Activation failed",
        description:
          error?.message || "Could not update user status.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ✅ Fix: Define filteredData before paginatedData
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPageOptions = [5, 10, 25, 50]; // Include 5 as default
  const [rowsPerPage, setRowsPerPage] = useState(5); // Default to 5 rows per page
  const [activeTab, setActiveTab] = useState("All");
  const [filterText, setFilterText] = useState("");
  const isInstructorUser = (user) =>
    user?.role?.toLowerCase() === "instructor" || user?.__t === "Instructor";
  const isLearnerUser = (user) => user?.role?.toLowerCase() === "student";
  const canToggleStatus = (user) => isInstructorUser(user) || isLearnerUser(user);
  const isUserActive = (user) => user?.status !== false;

  // Ensure users is initialized before filtering
  const filteredData = users.filter((user) => {
    let backendRole = user.role?.toLowerCase(); // Convert to lowercase
    let backendType = user.__t; // Check `__t` field

    const isInstructor =
      backendRole === "instructor" || backendType === "Instructor";
    const isStudent = backendRole === "student";

    const matchesTab =
      (activeTab === "All" && (isInstructor || isStudent)) ||
      (activeTab === "Instructor" && isInstructor) ||
      (activeTab === "Learner" && isStudent);

    const matchesFilter =
      filterText === "" ||
      Object.values(user).some((value) =>
        value?.toString().toLowerCase().includes(filterText.toLowerCase())
      );

    return matchesTab && matchesFilter;
  });

  // ✅ Fix: Define paginatedData AFTER filteredData is initialized
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  if (loading)
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500 shadow-sm">
        Loading users...
      </div>
    );

  return (
    <div className="w-full rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-6 flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Admin panel
        </p>
        <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          User management
        </h2>
        <p className="text-sm text-gray-600">
          Review instructors and learners, then activate pending accounts.
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap gap-1 rounded-xl border border-gray-200 bg-gray-50 p-1">
          {["All", "Instructor", "Learner"].map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? "default" : "ghost"}
              className={
                activeTab === tab
                  ? "h-9 rounded-lg bg-orange-500 px-4 text-white hover:bg-orange-600"
                  : "h-9 rounded-lg px-4 text-gray-600 hover:bg-white"
              }
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </Button>
          ))}
        </div>
      </div>

      {/* Search & Filter */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Input
          type="search"
          placeholder="Filter by name, email, role, or status"
          className="w-full sm:max-w-md"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
        <p className="text-sm text-gray-500">
          {filteredData.length} user{filteredData.length === 1 ? "" : "s"} found
        </p>
      </div>

      {/* Desktop table */}
      <div className="hidden rounded-xl border border-gray-200 lg:block">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Mobile</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((user) => (
                <TableRow key={user._id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.mobile || "N/A"}</TableCell>
                  <TableCell className="max-w-[14rem] break-all">
                    {user.email}
                  </TableCell>
                  <TableCell className="capitalize">{user.role || "Unknown"}</TableCell>
                  <TableCell className="max-w-[16rem] truncate">
                    {user.address || "N/A"}
                  </TableCell>
                  <TableCell>
                    {canToggleStatus(user) ? (
                      isUserActive(user) ? (
                        <span className="inline-flex rounded-lg bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-700">
                          Active
                        </span>
                      ) : (
                        <Button
                          onClick={() => handleActivate(user._id)}
                          className="bg-red-100 text-red-500 hover:bg-red-200 py-1 px-3 rounded-lg text-xs font-bold text-center"
                        >
                          Activate
                        </Button>
                      )
                    ) : isUserActive(user) ? (
                      <span className="inline-flex rounded-lg bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-700">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-600">
                        Inactive
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan="6" className="text-center py-10 text-gray-500">
                  No users found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile cards */}
      <div className="space-y-3 lg:hidden">
        {paginatedData.length > 0 ? (
          paginatedData.map((user) => (
            <article
              key={user._id}
              className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 break-words">
                    {user.name}
                  </p>
                  <p className="mt-0.5 text-xs capitalize text-orange-600">
                    {user.role || "Unknown"}
                  </p>
                </div>
                {canToggleStatus(user) ? (
                  isUserActive(user) ? (
                    <span className="inline-flex shrink-0 rounded-lg bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700">
                      Active
                    </span>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => handleActivate(user._id)}
                      className="shrink-0 bg-red-100 text-red-600 hover:bg-red-200"
                    >
                      Activate
                    </Button>
                  )
                ) : isUserActive(user) ? (
                  <span className="inline-flex shrink-0 rounded-lg bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700">
                    Active
                  </span>
                ) : (
                  <span className="inline-flex shrink-0 rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">
                    Inactive
                  </span>
                )}
              </div>
              <dl className="mt-3 space-y-2 text-sm text-gray-600">
                <div className="flex gap-2">
                  <dt className="w-16 shrink-0 text-gray-500">Email</dt>
                  <dd className="break-all">{user.email}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="w-16 shrink-0 text-gray-500">Mobile</dt>
                  <dd>{user.mobile || "N/A"}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="w-16 shrink-0 text-gray-500">Address</dt>
                  <dd className="break-words">{user.address || "N/A"}</dd>
                </div>
              </dl>
            </article>
          ))
        ) : (
          <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center text-sm text-gray-500">
            <UsersRound className="mx-auto mb-2 h-5 w-5 text-gray-400" />
            No users found
          </div>
        )}
      </div>

      {/* Pagination */}

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <p>Show</p>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="outline">{rowsPerPage}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {rowsPerPageOptions.map((option) => (
                <DropdownMenuItem
                  key={option}
                  onClick={() => {
                    setRowsPerPage(option);
                    setCurrentPage(1); // Reset to first page when changing rows per page
                  }}
                >
                  {option}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <p>Rows</p>
        </div>

        {/* Pagination Component */}
        <Pagination
          total={totalPages}
          currentPage={currentPage}
          onChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
};

export default UserManagement;
