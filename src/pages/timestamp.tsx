import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type TimestampFormats = {
  unix: string
  unixMilli: string
  unixNano: string
  iso: string
}

function detectAndConvert(raw: string): TimestampFormats | null {
  const num = Number(raw.trim())
  if (!raw.trim() || isNaN(num)) return null

  const len = String(Math.trunc(num)).length
  let ms: number
  if (len <= 10) {
    ms = num * 1000
  } else if (len <= 13) {
    ms = num
  } else {
    ms = Math.trunc(num / 1_000_000)
  }

  const date = new Date(ms)
  if (isNaN(date.getTime())) return null

  const unix = String(Math.trunc(ms / 1000))
  const unixMilli = String(ms)
  const unixNano = String(BigInt(ms) * 1_000_000n)
  return { unix, unixMilli, unixNano, iso: date.toISOString() }
}

export function TimestampPage() {
  const [tsInput, setTsInput] = useState("")
  const [dateInput, setDateInput] = useState("")
  const [tsResult, setTsResult] = useState<TimestampFormats | null>(null)
  const [dateResult, setDateResult] = useState<TimestampFormats | null>(null)
  const [tsError, setTsError] = useState("")
  const [dateError, setDateError] = useState("")

  function convertTimestamp() {
    const result = detectAndConvert(tsInput)
    if (!result) {
      setTsError("Enter a valid Unix timestamp (seconds, milliseconds, or nanoseconds).")
      setTsResult(null)
      return
    }
    setTsResult(result)
    setTsError("")
  }

  function convertDate() {
    const date = new Date(dateInput.trim())
    if (isNaN(date.getTime())) {
      setDateError("Enter a valid date string (e.g. 2024-01-01 or ISO 8601).")
      setDateResult(null)
      return
    }
    const ms = date.getTime()
    setDateResult({
      unix: String(Math.trunc(ms / 1000)),
      unixMilli: String(ms),
      unixNano: String(BigInt(ms) * 1_000_000n),
      iso: date.toISOString(),
    })
    setDateError("")
  }

  function useNow() {
    const ms = Date.now()
    const unix = String(Math.trunc(ms / 1000))
    setTsInput(unix)
    setTsResult({
      unix,
      unixMilli: String(ms),
      unixNano: String(BigInt(ms) * 1_000_000n),
      iso: new Date(ms).toISOString(),
    })
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
        {tsResult && <TimestampResultTable result={tsResult} />}
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
        {dateResult && <TimestampResultTable result={dateResult} />}
      </div>
    </div>
  )
}

function TimestampResultTable({ result }: { result: TimestampFormats }) {
  const rows: { label: string; value: string }[] = [
    { label: "ISO 8601", value: result.iso },
    { label: "Unix (s)", value: result.unix },
    { label: "Unix Milli (ms)", value: result.unixMilli },
    { label: "Unix Nano (ns)", value: result.unixNano },
  ]

  return (
    <div className="flex flex-col gap-1">
      {rows.map(({ label, value }) => (
        <div key={label} className="flex items-center gap-2">
          <span className="w-36 shrink-0 text-xs text-muted-foreground">
            {label}
          </span>
          <div className="rounded-md border bg-muted px-3 py-2 font-mono text-sm">
            {value}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigator.clipboard.writeText(value)}
          >
            Copy
          </Button>
        </div>
      ))}
    </div>
  )
}
