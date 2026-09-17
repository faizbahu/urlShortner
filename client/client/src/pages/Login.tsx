import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../features/auth/authSlice";

function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const auth = useSelector((state: any) => state.auth);
    const { isAuthenticated, loading, error } = auth;

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/dashboard", { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = (e: any) => {
        e.preventDefault();
        (dispatch as any)((loginUser as any)({ email, password }));
    };

    return (
        <div className="flex min-h-svh w-full items-center justify-center bg-linear-to-br from-violet-100 via-white to-fuchsia-100 px-4 py-12">
            <div className="w-full max-w-sm">
                <div className="mb-8 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600 text-xl font-semibold text-white shadow-lg shadow-violet-300">
                        🔗
                    </div>
                    <h1 className="text-2xl font-semibold text-gray-900">Welcome back</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Sign in to manage your short links
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-4 rounded-2xl border border-gray-100 bg-white p-8 shadow-xl shadow-gray-200/60"
                >
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
                            placeholder="••••••••"
                            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
                        />
                    </div>

                    {error && (
                        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="cursor-pointer w-full rounded-lg bg-violet-600 py-2.5 text-sm font-medium text-white shadow-md shadow-violet-200 transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? "Signing in..." : "Sign in"}
                    </button>

                    <p className="text-center text-sm text-gray-500">
                        Don't have an account?{" "}
                        <Link to="/register" className="cursor-pointer font-medium text-violet-600 hover:underline">
                            Sign up
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Login;
