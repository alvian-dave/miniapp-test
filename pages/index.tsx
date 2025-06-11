import { Card, CardContent } from "@/components/ui/card";
import WorldIDLoginButton from "@/components/WorldIDLoginButton";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-cyan-200 via-blue-100 to-indigo-200 px-2">
      <Card className="rounded-2xl shadow-xl p-8 max-w-xs w-full flex flex-col items-center">
        <CardContent className="flex flex-col items-center p-0 w-full">
          <span className="text-5xl mb-3">🌐</span>
          <h1 className="font-bold text-2xl text-center mb-2 text-gray-800">World Reward Coin</h1>
          <p className="text-center text-gray-600 mb-5 text-sm">
            Hubungkan World ID kamu untuk masuk ke dashboard MiniApp.
          </p>
          <WorldIDLoginButton />
        </CardContent>
      </Card>
      <div className="text-xs text-gray-400 mt-8">© {new Date().getFullYear()} World Reward Coin</div>
    </div>
  );
}