import {useContext} from "react";
import {PermissionContext} from "./PermissionContext.ts";

export const usePermissions = () => useContext(PermissionContext);