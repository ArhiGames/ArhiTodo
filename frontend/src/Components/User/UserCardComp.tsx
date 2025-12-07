import type {AppUser} from "../../Models/AppUser.ts";

const UserCardComp = (props: { appUser: AppUser }) => {

    return (
        <div className="app-user">
            <p>{props.appUser.unique_name}</p>
        </div>
    )

}

export default UserCardComp;