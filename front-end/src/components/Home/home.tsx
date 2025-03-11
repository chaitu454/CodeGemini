import { useEffect, useState } from "react";
import "./home.css";
import { useNavigate } from "react-router-dom";
import {
    getUserList,
    deleteUser,
    editUserDetails,
} from "../../services/userServices";
import { EditUserReqType } from "../../services/types";

const HomeScreen = () => {
    const navigate = useNavigate();
    const [userList, setUserList] = useState<EditUserReqType[]>([]);
    const [loggedUserDetails, setLoggedUserDetails] = useState<EditUserReqType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingUser, setEditingUser] = useState<EditUserReqType | null>(null);
    const [updatedFirstName, setUpdatedFirstName] = useState("");
    const [updatedLastName, setUpdatedLastName] = useState("");
    const [updatedRole, setUpdatedRole] = useState("");
    const loggedUserEmail = localStorage.getItem("email");

    useEffect(() => {
        const fetchLoggedInUser = async () => {
            try {
                const response = await getUserList(loggedUserEmail!);
                const filteredUsers = response.users.filter((user:any): user is EditUserReqType => user !== undefined);
                setLoggedUserDetails(filteredUsers);
            } catch (err) {
                setError("Failed to fetch user details. Please try again.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchLoggedInUser();
    }, [loggedUserEmail]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await getUserList();
                const filteredUsers = response.users.filter((user:any): user is EditUserReqType => user !== undefined);
                setUserList(filteredUsers);
            } catch (err) {
                setError("Failed to fetch users. Please try again.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const handleEditClick = (user: EditUserReqType) => {
        setEditingUser(user);
        setUpdatedFirstName(user.first_name || "");
        setUpdatedLastName(user.last_name || "");
        setUpdatedRole(user.user_role || "");
    };

    const handleSaveEdit = async () => {
        if (!editingUser) return;
        const updatedUser: EditUserReqType = {
            email: editingUser.email,
            first_name: updatedFirstName.trim(),
            last_name: updatedLastName.trim(),
            user_role: updatedRole.trim(),
        };
        try {
            await editUserDetails(
                updatedUser.email,
                updatedUser.first_name,
                updatedUser.last_name,
                updatedUser.user_role
            );
            setUserList((prevUserList) =>
                prevUserList.map((user) =>
                    user.email === editingUser.email ? updatedUser : user
                )
            );
            alert("User details updated successfully.");
        } catch (error: any) {
            console.error(error);
            alert(error.message);
        } finally {
            setEditingUser(null);
        }
    };


    const handleDelete = async (email: string) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await deleteUser(email);
                setUserList((prev) => prev.filter((user) => user.email !== email));
                alert("User deleted successfully.");
                if (email === loggedUserEmail) {
                    handleLogout();
                }
            } catch (error: any) {
                console.error(error);
                alert(error.message || "Failed to delete user.");
            }
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        sessionStorage.clear();
        navigate("/");
    };

    const isAdmin = loggedUserDetails[0]?.user_role === "admin";

    return (
        <div>
            <div className="profile">
                <span>{loggedUserDetails[0]?.email}</span>
                <button onClick={handleLogout} className="logout-button">Logout</button>
            </div>
            <h3>User List</h3>
            {isLoading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>{error}</p>
            ) : userList && userList.length ? (
                <table className="user-table">
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>User Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userList.map((user) => (
                            <tr key={user.email}>
                                <td>{user.email}</td>
                                <td>
                                    {editingUser?.email === user.email ? (
                                        <input
                                            type="text"
                                            value={updatedFirstName}
                                            onChange={(e) => setUpdatedFirstName(e.target.value)}
                                        />
                                    ) : (
                                        user.first_name || "N/A"
                                    )}
                                </td>
                                <td>
                                    {editingUser?.email === user.email ? (
                                        <input
                                            type="text"
                                            value={updatedLastName}
                                            onChange={(e) => setUpdatedLastName(e.target.value)}
                                        />
                                    ) : (
                                        user.last_name || "N/A"
                                    )}
                                </td>
                                <td>
                                    {editingUser?.email === user.email ? (
                                        <input
                                            type="text"
                                            value={updatedRole}
                                            onChange={(e) => setUpdatedRole(e.target.value)}
                                        />
                                    ) : (
                                        user.user_role || "N/A"
                                    )}
                                </td>
                                <td>
                                    {isAdmin || user.email === loggedUserEmail ? (
                                        editingUser?.email === user.email ? (
                                            <>
                                                <button onClick={handleSaveEdit} className="save-button">
                                                    Save
                                                </button>
                                                <button
                                                    onClick={() => setEditingUser(null)}
                                                    className="cancel-button"
                                                >
                                                    Cancel
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => handleEditClick(user)}
                                                    className="edit-button"
                                                >
                                                    Edit
                                                </button>
                                                {isAdmin && user.email !== loggedUserEmail && (
                                                    <button
                                                        onClick={() => handleDelete(user.email)}
                                                        className="delete-button"
                                                    >
                                                        Delete
                                                    </button>
                                                )}
                                            </>
                                        )
                                    ) : (
                                        "N/A"
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No users found.</p>
            )}
        </div>
    );
};

export default HomeScreen;


