import Card from "@/components/Card";
import { createClient } from "@/utils/supabase/component";

export default function LoginPage() {
  const supabase = createClient();
  function loginWithGoogle() {
    supabase.auth.signInWithOAuth({
      provider: "google",
    });
  }
  return (
    <div className="w-full h-screen flex items-center">
      <div className="grow max-w-xs mx-auto -mt-24">
        <h1 className="text-6xl text-gray-300 mb-4 text-center">Login</h1>
        <Card noPadding={true}>
          <button
            onClick={loginWithGoogle}
            className="flex w-full p-4 gap-4 justify-center items-center hover:bg-socialBlue hover:text-white hover:scale-105 transition-all"
          >
            <svg
              className="h-8 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 488 512"
            >
              <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
            </svg>
            Login with Google
          </button>
        </Card>
      </div>
    </div>
  );
}
