import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

export function useGetAllSummaries() {
  const query = useQuery({ queryKey: ['summaries'], queryFn: window.api.getAllSummaries })
  return query
}

export function useGetSummaryById(id: string) {
  const query = useQuery({
    queryKey: ['summary', id],
    queryFn: async () => {
      return (await window.api.getSummaryById(id)) ?? null
    }
  })
  return query
}

export function useInstallSummaryInvalidation() {
  const queryClient = useQueryClient()

  useEffect(() => {
    window.api.onSummaryUpdate(() => {
      queryClient.invalidateQueries({ queryKey: ['summaries'] })
      queryClient.invalidateQueries({ queryKey: ['summary'] })
    })
  }, [])
}
