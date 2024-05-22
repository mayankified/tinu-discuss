import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

const loading = () => {
  return (
    <>
    <div className="w-full flex flex-col-reverse sm:flex-row justify-between gap-4">
      <Skeleton className="h1-bold h-[36px] w-[200px]" />
      <Skeleton className="primary-gradient min-h-[46px] w-[175px] px-4 py-3" />
    </div>
    <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
      <Skeleton className="flex-1 h-[46px] w-[100%]" />
      <Skeleton className="min-h-[56px] sm:min-w-[170px] w-[170px]" />
    </div>
    <Skeleton className="w-full h-[56px] mt-6" />
    <div className="mt-10 flex flex-col w-full gap-6">
      {[...Array(5)].map((_, index) => (
        <Skeleton key={index} className="h-[100px] w-full" />
      ))}
    </div>
    <div className="mt-10">
      <Skeleton className="h-[40px] w-[300px]" />
    </div>
  </>
  )
}

export default loading