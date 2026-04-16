import { useCallback, useEffect, useState } from "react"

import type { Gist } from "@/types/gist"

const STORAGE_KEY = "dev-tools-gists"

function loadGists(): Gist[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as Gist[]
  } catch {
    return []
  }
}

function saveGists(gists: Gist[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(gists))
}

export function useGists() {
  const [gists, setGists] = useState<Gist[]>(loadGists)

  useEffect(() => {
    saveGists(gists)
  }, [gists])

  const createGist = useCallback(
    (data: { title: string; language: string; content: string }) => {
      const now = Date.now()
      const gist: Gist = {
        id: crypto.randomUUID(),
        title: data.title,
        language: data.language,
        content: data.content,
        createdAt: now,
        updatedAt: now,
      }
      setGists((prev) => [gist, ...prev])
      return gist
    },
    []
  )

  const updateGist = useCallback(
    (id: string, data: { title: string; language: string; content: string }) => {
      setGists((prev) =>
        prev.map((g) =>
          g.id === id
            ? { ...g, ...data, updatedAt: Date.now() }
            : g
        )
      )
    },
    []
  )

  const deleteGist = useCallback((id: string) => {
    setGists((prev) => prev.filter((g) => g.id !== id))
  }, [])

  const deleteGists = useCallback((ids: string[]) => {
    const idSet = new Set(ids)
    setGists((prev) => prev.filter((g) => !idSet.has(g.id)))
  }, [])

  return { gists, createGist, updateGist, deleteGist, deleteGists }
}
