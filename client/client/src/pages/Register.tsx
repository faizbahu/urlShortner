import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { clearRegisterStatus, registerUser } from "../features/auth/authSlice";

function Register() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const auth = useSelector((state: any) => state.auth);
    const { registering, registerError, registerSuccess, isAuthenticated } = auth;

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/dashboard", { replace: true });
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        return () => {
            (dispatch as any)(clearRegisterStatus());
        };
    }, [dispatch]);

    useEffect(() => {
        if (registerSuccess) {
            const timeout = setTimeout(() => navigate("/", { replace: true }), 1200);
            return () => clearTimeout(timeout);
        }
    }, [registerSuccess, navigate]);

    const handleSubmit = (e: any) => {
        e.preventDefault();
        (dispatch as any)((registerUser as any)({ username, email, password }));
    };

    return (
        <div className="flex min-h-svh w-full items-center justify-center bg-linear-to-br from-violet-100 via-white to-fuchsia-100 px-4 py-12">
            <div className="w-full max-w-sm">
                <div className="mb-8 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600 text-xl font-semibold text-white shadow-lg shadow-violet-300">
                        🔗
                    </div>
                    <h1 className="text-2xl font-semibold text-gray-900">Create account</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Sign up to start shortening links
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-4 rounded-2xl border border-gray-100 bg-white p-8 shadow-xl shadow-gray-200/60"
                >
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Username
                        </label>
                        <input
                            type="text"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="yourname"
                            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="At least 6 characters"
                            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
                        />
                    </div>

                    {registerError && (
                        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                            {registerError}
                        </p>
                    )}

                    {registerSuccess && (
                        <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-600">
                            Account created! Redirecting to sign in...
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={registering}
                        className="w-full rounded-lg bg-violet-600 py-2.5 text-sm font-medium text-white shadow-md shadow-violet-200 transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {registering ? "Creating account..." : "Sign up"}
                    </button>

                    <p className="text-center text-sm text-gray-500">
                        Already have an account?{" "}
                        <Link to="/" className="font-medium text-violet-600 hover:underline">
                            Sign in
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Register;
