import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Skeleton } from "./ui/skeleton";

export default function SkeCard() {
  const repeat = [1, 2, 3];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-20 gap-y-6">
      {repeat.map((_, i) => (
        <Card
          key={i}
          className="bg-gray-50 shadow-lg my-5 hover:border-gray-300 transition-all border-2 border-gray-100 cursor-pointer min-w-[310px] min-h-[430px] max-h-[420px]"
        >
          <CardHeader className="h-1/4">
            <CardTitle className="flex gap-x-3">
                <Skeleton className="w-1/4 h-5 bg-gray-300"/>
                <Skeleton className="w-1/2 h-5 bg-gray-300"/>
            </CardTitle>
            <CardDescription className="pt-1">
                <Skeleton className="w-1/2 h-3 bg-gray-300"/>
            </CardDescription>
          </CardHeader>
          <CardContent className="relative h-3/4">
            <div className="h-[50%] mt-5">
              <p className="mb-2 text-lg font-extrabold text-gray-400 underline-offset-custom">
                <Skeleton className="w-1/2 h-4 bg-gray-300"/>
              </p>
                <Skeleton className="w-2/3 ml-5 h-2 mt-5 bg-gray-300"/>
                <Skeleton className="w-2/3 ml-5 h-2  my-3 bg-gray-300"/>
                <Skeleton className="w-2/3 ml-5 h-2  bg-gray-300"/>
            </div>

            <div className="h-[50%] mt-5">
              <p className="mb-2 text-lg font-extrabold text-gray-400 underline-offset-custom">
                <Skeleton className="w-1/2 h-4 bg-gray-300"/>
              </p>
                <Skeleton className="w-2/3 ml-5 h-2 mt-5 bg-gray-300"/>
                <Skeleton className="w-2/3 ml-5 h-2  my-3 bg-gray-300"/>
                <Skeleton className="w-2/3 ml-5 h-2  bg-gray-300"/>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
