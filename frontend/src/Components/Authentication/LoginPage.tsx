import type {FormEvent} from "react";

const LoginPage = () => {

    const onFormSubmit = (e: FormEvent<HTMLFormElement>) => {

        e.preventDefault();

    }

    return (
        <div className="login-page">
            <div className="login">
                <h2>Login</h2>
                <form onSubmit={onFormSubmit}>
                    <label>Username</label>
                    <input required type="text" placeholder="Enter your username..."></input>
                    <label>Password</label>
                    <input required minLength={8} type="password" placeholder="Enter your password..."></input>
                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    )

}

export default LoginPage;