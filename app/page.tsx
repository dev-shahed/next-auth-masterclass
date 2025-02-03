import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 to-purple-500 p-4 text-white">
      <Card className="w-96 shadow-xl rounded-2xl border border-gray-200 bg-white text-gray-900">
        <CardHeader className="text-center flex flex-col items-center">
          <Sparkles className="w-8 h-8 text-yellow-500" />
          <CardTitle className="text-2xl font-semibold mt-2">Welcome, Adventurer!</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4 p-6">
          <p className="text-gray-600 text-center">Your journey begins here. Ready to explore?</p>
          <Link href="/login">
            <Button className="bg-blue-600 text-white hover:bg-blue-700 px-6 py-2 text-lg rounded-lg shadow-md">Enter the Portal</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}