import React, { useContext } from "react";
import { FcGoogle } from "react-icons/fc";
import { authContext } from "@/lib/store/auth-context";

function SignIn() {
    const { googleLoginHandler } = useContext(authContext);

    return (
        <main className="container max-w-2xl px-9 mx-auto">
            <h1 className="mb-6 text-3xl  font-bold text-center text-">Welcome To BudgetBot</h1>
            <div className="flex overflow-hidden shadow-md px-12 shadow-slate-500 rounded-2xl">
                <div className="px-20 py-8 items-center text-center">
                    <h3 className="text-2xl px-20 ">Please Sign In</h3>
                    <button onClick={googleLoginHandler} className="flex gap-2 p-4 mt-6 px-20 font-medium text-white bg-gray-700 rounded-lg">
                        <FcGoogle className="text-2xl " /> Sign in with Google
                    </button>
                </div>
            </div>
        </main>
    );
}

export default SignIn;
