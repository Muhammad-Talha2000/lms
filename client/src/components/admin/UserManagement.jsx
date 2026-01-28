import React, { useEffect, useState } from "react";
import axios from "axios";
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
import { Card } from "@radix-ui/themes";
import { useToast } from "@/hooks/use-toast";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { loggedinUser } = useSelector((state) => state.auth);
  const toast = useToast();

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
      const response = await toggleStatus(loggedinUser.token, userId);
      await fetchUsers(loggedinUser.token);
      toast({
        title: "Success!",
        description: "User activated successfully",
        variant: "success",
      });
    } catch (error) {
      console.log("Error while updating", error);
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
  if (loading) return <p>Loading users...</p>;

  return (
    <div className="w-full py-8 px-8">
      {/* Tabs */}
      <div className="mb-4 flex items-center justify-between">
        <div className="space-x-4">
          {["All", "Instructor", "Learner"].map((tab) => (
            <Button
              key={tab}
              variant="link"
              className={
                activeTab === tab ? "text-orange-500" : "text-gray-400"
              }
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </Button>
          ))}
        </div>
        {/* <p className="text-sm text-gray-500">View and manage your {activeTab.toLowerCase()} details</p> */}
      </div>

      {/* Search & Filter */}
      <div className="mb-4 flex items-center justify-between">
        <Input
          type="search"
          placeholder="Filter by name, email, role, or status"
          className="w-1/3"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
        {/* <Button variant="secondary" className="text-gray-500" onClick={() => setFilterText("")}>
          Clear
        </Button> */}
      </div>

      {/* Table */}
      <Card className="p-4 bg-white shadow-lg rounded-lg">
        <Table>
          <TableHeader>
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
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.mobile || "N/A"}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role || "Unknown"}</TableCell>
                  <TableCell>{user.address || "N/A"}</TableCell>
                  <TableCell>
                    {user.status === true ? (
                      <span className="text-green-500 text-xs font-bold text-center bg-green-100 py-2 px-3 rounded-lg ">
                        Actived
                      </span>
                    ) : (
                      <Button
                        onClick={() => handleActivate(user._id)}
                        className="bg-red-100 text-red-500 hover:bg-red-200 py-1 px-3 rounded-lg text-xs font-bold text-center"
                      >
                        Activate
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan="5" className="text-center">
                  No users found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Pagination */}

      <div className="mt-4 flex items-center justify-between">
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
