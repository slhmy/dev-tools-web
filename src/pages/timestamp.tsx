import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function TimestampPage() {
  const [tsInput, setTsInput] = useState("")
  const [dateInput, setDateInput] = useState("")
  const [tsResult, setTsResult] = useState("")
  const [dateResult, setDateResult] = useState("")
  const [tsError, setTsError] = useState("")
  const [dateError, setDateError] = useState("")

  function convertTimestamp() {
    const num = Number(tsInput.trim())
    if (!tsInput.trim() || isNaN(num)) {
      setTsError("Enter a valid Unix timestamp (seconds or milliseconds).")
      setTsResult("")
      return
    }
    // Detect seconds vs milliseconds
    const ms = String(num).length <= 10 ? num * 1000 : num
    const date = new Date(ms)
    if (isNaN(date.getTime())) {
      setTsError("Invalid timestamp.")
      setTsResult("")
      return
    }
    setTsResult(date.toISOString())
    setTsError("")
  }

  function convertDate() {
    const date = new Date(dateInput.trim())
    if (isNaN(date.getTime())) {
      setDateError("Enter a valid date string (e.g. 2024-01-01 or ISO 8601).")
      setDateResult("")
      return
    }
    setDateResult(String(Math.floor(date.getTime() / 1000)))
    setDateError("")
  }

  function useNow() {
    const now = Math.floor(Date.now() / 1000)
    setTsInput(String(now))
    setTsResult(new Date(now * 1000).toISOString())
    setTsError("")
  }

  return (
    <div className="flex flex-col gap-8 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Timestamp Converter</h1>
        <p className="text-muted-foreground">
          Convert Unix timestamps to dates and vice versa.
        </p>
      </div>

      {/* Timestamp → Date */}
      <div className="flex flex-col gap-3">
        <h2 className="text-base font-medium">Unix Timestamp → Date</h2>
        <div className="flex gap-2">
          <Input
            value={tsInput}
            onChange={(e) => setTsInput(e.target.value)}
            placeholder="e.g. 1700000000"
          />
          <Button onClick={convertTimestamp}>Convert</Button>
          <Button variant="outline" onClick={useNow}>
            Now
          </Button>
        </div>
        {tsError && <p className="text-sm text-destructive">{tsError}</p>}
        {tsResult && (
          <div className="flex items-center gap-2">
            <div className="rounded-md border bg-muted px-3 py-2 font-mono text-sm">
              {tsResult}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigator.clipboard.writeText(tsResult)}
            >
              Copy
            </Button>
          </div>
        )}
      </div>

      {/* Date → Timestamp */}
      <div className="flex flex-col gap-3">
        <h2 className="text-base font-medium">Date → Unix Timestamp</h2>
        <div className="flex gap-2">
          <Input
            value={dateInput}
            onChange={(e) => setDateInput(e.target.value)}
            placeholder="e.g. 2024-01-01T00:00:00Z"
          />
          <Button onClick={convertDate}>Convert</Button>
        </div>
        {dateError && <p className="text-sm text-destructive">{dateError}</p>}
        {dateResult && (
          <div className="flex items-center gap-2">
            <div className="rounded-md border bg-muted px-3 py-2 font-mono text-sm">
              {dateResult}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigator.clipboard.writeText(dateResult)}
            >
              Copy
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
