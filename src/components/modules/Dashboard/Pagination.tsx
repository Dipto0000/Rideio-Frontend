"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  page: number
  totalPage: number
  onPageChange: (page: number) => void
}

export function Pagination({ page, totalPage, onPageChange }: PaginationProps) {
  if (totalPage <= 1) return null

  return (
    <div className="flex items-center justify-center gap-4 pt-4">
      <Button
        variant="outline"
        size="sm"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Previous
      </Button>
      <span className="text-sm text-muted-foreground">
        Page {page} of {totalPage}
      </span>
      <Button
        variant="outline"
        size="sm"
        disabled={page >= totalPage}
        onClick={() => onPageChange(page + 1)}
      >
        Next
        <ChevronRight className="w-4 h-4 ml-1" />
      </Button>
    </div>
  )
}
