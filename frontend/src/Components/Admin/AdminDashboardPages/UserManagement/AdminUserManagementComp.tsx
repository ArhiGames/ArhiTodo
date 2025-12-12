import {useEffect, useState} from "react";
import {useAuth} from "../../../../Contexts/useAuth.ts";
import type {UserWithClaims} from "../../../../Models/Administration/UserWithClaims.ts";
import EditableUserComp from "../EditableUserComp.tsx";

const AdminUserManagementComp = () => {

    const { token } = useAuth();
    const [users, setUsers] = useState<UserWithClaims[]>([]);

    useEffect(() => {

        fetch('https://localhost:7069/api/account/admin/accountmanagement',
            {
                method: 'GET',
                headers: { "Authorization": `Bearer ${token}` },
            })
            .then(res => {
                if (!res.ok) {
                    throw new Error("Failed to fetch accounts with claims")
                }

                return res.json();
            })
            .then((res: UserWithClaims[]) => {

                setUsers(res);

            })

    }, [token]);

    return (
        <div className="admin-settings-content admin-usermanagement-page">
            <h2>User management</h2>
            <p>Manage user permissions, delete & add users</p>
            {users.map((user: UserWithClaims) => (
                <EditableUserComp user={user}></EditableUserComp>
            ))}
        </div>
    )

}

export default AdminUserManagementComp;