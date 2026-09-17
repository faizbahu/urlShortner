import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../features/auth/authSlice";
import { createShortUrl, fetchUrls } from "../features/urls/urlSlice";

const API_BASE = "http://localhost:5000";

function toShortLink(item: any) {
    if (item.shortUrl && item.shortUrl.startsWith("http")) {
        return item.shortUrl;
    }
    return `${API_BASE}/${item.shortUrl}`;
}

function Dashboard() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [originalUrl, setOriginalUrl] = useState("");
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const auth = useSelector((state: any) => state.auth);
    const { user, isAuthenticated } = auth;
    const { urls, loading, creating, error } = useSelector((state: any) => state.urls);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/", { replace: true });
            return;
        }
        (dispatch as any)(fetchUrls());
    }, [isAuthenticated, navigate, dispatch]);

    const handleCreate = (e: any) => {
        e.preventDefault();
        if (!originalUrl.trim()) return;
        (dispatch as any)(createShortUrl(originalUrl.trim())).then((res: any) => {
            if (!res.error) setOriginalUrl("");
        });
    };

    const handleCopy = (item: any) => {
        navigator.clipboard.writeText(toShortLink(item));
        setCopiedId(item._id || item.id);
        setTimeout(() => setCopiedId(null), 1500);
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate("/", { replace: true });
    };

    return (
        <div className="min-h-svh w-full bg-gray-50">
            <header className="border-b border-gray-200 bg-white">
                <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 text-sm text-white">
                            🔗
                        </div>
                        <span className="font-semibold text-gray-900">Url Shortner</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500">
                            {user?.username ? `Hi, ${user.username}` : ""}
                        </span>
                        <button
                            onClick={handleLogout}
                            className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 transition hover:bg-gray-100"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-3xl px-4 py-10">
                <h1 className="mb-1 text-xl font-semibold text-gray-900">Shorten a URL</h1>
                <p className="mb-6 text-sm text-gray-500">
                    Paste a long link below to generate a short one.
                </p>

                <form
                    onSubmit={handleCreate}
                    className="mb-10 flex gap-2 rounded-2xl border border-gray-100 bg-white p-2 shadow-sm"
                >
                    <input
                        type="url"
                        required
                        value={originalUrl}
                        onChange={(e) => setOriginalUrl(e.target.value)}
                        placeholder="https://example.com/very/long/url"
                        className="flex-1 rounded-xl border-none px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-violet-200"
                    />
                    <button
                        type="submit"
                        disabled={creating}
                        className="rounded-xl bg-violet-600 px-5 py-2 text-sm font-medium text-white shadow-md shadow-violet-200 transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {creating ? "Shortening..." : "Shorten"}
                    </button>
                </form>

                {error && (
                    <p className="mb-6 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                        {typeof error === "string" ? error : "Something went wrong"}
                    </p>
                )}

                <h2 className="mb-3 text-sm font-semibold text-gray-700">Your links</h2>

                {loading ? (
                    <p className="text-sm text-gray-400">Loading...</p>
                ) : urls.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-4 py-10 text-center text-sm text-gray-400">
                        No links yet. Create your first short link above.
                    </div>
                ) : (
                    <ul className="space-y-3">
                        {urls.map((item: any) => (
                            <li
                                key={item._id || item.id}
                                className="flex items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-sm"
                            >
                                <div className="min-w-0 flex-1">
                                    <a
                                        href={toShortLink(item)}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="block truncate text-sm font-medium text-violet-600 hover:underline"
                                    >
                                        {toShortLink(item)}
                                    </a>
                                    <p className="truncate text-xs text-gray-400">
                                        {item.originalUrl}
                                    </p>
                                </div>
                                <div className="flex shrink-0 items-center gap-3">
                                    <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-500">
                                        {item.clicks ?? 0} clicks
                                    </span>
                                    <button
                                        onClick={() => handleCopy(item)}
                                        className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-100"
                                    >
                                        {copiedId === (item._id || item.id) ? "Copied!" : "Copy"}
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </main>
        </div>
    );
}

export default Dashboard;
