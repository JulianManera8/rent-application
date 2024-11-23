import { Skeleton } from "../ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

export function SkeletonDeptoSelected() {
  return (
    <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <Skeleton className="h-8 w-64 sm:w-96 bg-zinc-200" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-24 bg-zinc-200" />
          <Skeleton className="h-10 w-24 bg-zinc-200" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* INFO GENERAL */}
        <Card className="lg:col-span-2">
          <CardHeader className='flex-col sm:flex-row items-start sm:items-center justify-between'>
            <CardTitle className='text-2xl sm:text-3xl mb-2 sm:mb-0'>
              <Skeleton className="h-8 w-48 bg-zinc-200" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Array(16).fill(0).map((_, index) => (
                <div key={index} className='mb-2'>
                  <Skeleton className="h-6 w-32 mb-1 bg-zinc-200" />
                  <Skeleton className="h-8 w-full bg-zinc-200" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* DOCUMENTOS Y ACCESO DEL DEPTO */}
        <div className='lg:col-span-1 flex flex-col gap-6'>
          <Card className="flex-grow">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl">
                <Skeleton className="h-7 w-48 bg-zinc-200" />
              </CardTitle>
              <Skeleton className="h-5 w-56 bg-zinc-200" />
            </CardHeader>
            <CardContent className="overflow-y-auto max-h-[300px]">
              {Array(5).fill(0).map((_, index) => (
                <Skeleton key={index} className="h-10 w-full mb-2 bg-zinc-200" />
              ))}
            </CardContent>
          </Card>

          <Card className="flex-grow">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl">
                <Skeleton className="h-7 w-48 bg-zinc-200" />
              </CardTitle>
              <Skeleton className="h-5 w-56 bg-zinc-200" />
            </CardHeader>
            <CardContent className="overflow-y-auto max-h-[300px]">
              {Array(5).fill(0).map((_, index) => (
                <Skeleton key={index} className="h-6 w-full mb-2 bg-zinc-200" />
              ))}
            </CardContent>
          </Card>
        </div>

        {/* FOTOS DEL DEPTO */}
        <Card className='col-span-full'>
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl">
              <Skeleton className="h-7 w-48 bg-zinc-200" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative mb-6 sm:mb-10">
                <Skeleton className="w-full h-48 sm:h-96 rounded-md bg-zinc-200" />
                <Skeleton className="absolute top-2 right-2 h-8 w-8 rounded-full bg-zinc-200" />
                <Skeleton className="absolute bottom-2 right-2 h-8 w-24 bg-zinc-200" />
                <Skeleton className="absolute bottom-2 left-2 h-6 w-16 bg-zinc-200" />
              </div>
              <div className="flex gap-2 sm:gap-4 justify-center overflow-x-auto p-2">
                {Array(5).fill(0).map((_, index) => (
                  <Skeleton key={index} className="h-20 w-20 rounded-md bg-zinc-200" />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

