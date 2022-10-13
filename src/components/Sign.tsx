import { useState } from "react";
import { supabase } from "@/lib/client";

type SignType = "signin" | "signup";

export const Sign = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (type: SignType) => {
    try {
      const { error } =
        type === "signin"
          ? await supabase.auth.signIn({ email, password })
          : await supabase.auth.signUp({ email, password });

      if (error) {
        setErrorMessage(error.message);
        return;
      }
    } catch (error) {
      setErrorMessage(error?.error_description ?? "");
    }
  };

  return (
    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
      <form className="space-y-6">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email address
          </label>
          <div className="mt-1">
            <input
              name="email"
              type="email"
              required
              className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <div className="mt-1">
            <input
              name="password"
              type="password"
              required
              className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        {errorMessage ? (
          <div className="text-xs text-red-500">{errorMessage}</div>
        ) : null}

        <div className="flex flex-col gap-2">
          <button
            type="submit"
            className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            onClick={(e) => {
              e.preventDefault();
              handleSubmit("signup");
            }}
          >
            Sign up
          </button>

          <button
            type="submit"
            className="flex w-full justify-center rounded-md border border-transparent text-indigo-600 border-indigo-600 py-2 px-4 text-sm font-medium shadow-sm hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            onClick={(e) => {
              e.preventDefault();
              handleSubmit("signin");
            }}
          >
            Sign in
          </button>
        </div>
      </form>
    </div>
  );
};
