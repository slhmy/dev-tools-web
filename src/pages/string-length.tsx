import { useState } from "react"

import { Textarea } from "@/components/ui/textarea"

function countBytes(str: string): number {
  return new TextEncoder().encode(str).length
}

function countWords(str: string): number {
  const trimmed = str.trim()
  return trimmed === "" ? 0 : trimmed.split(/\s+/).length
}

function countLines(str: string): number {
  return str === "" ? 0 : str.split("\n").length
}

export function StringLengthPage() {
  const [input, setInput] = useState("")

  const charCount = input.length
  const charNoSpaceCount = input.replace(/\s/g, "").length
  const byteCount = countBytes(input)
  const wordCount = countWords(input)
  const lineCount = countLines(input)

  const stats: { label: string; value: number }[] = [
    { label: "Characters", value: charCount },
    { label: "Characters (no spaces)", value: charNoSpaceCount },
    { label: "Bytes (UTF-8)", value: byteCount },
    { label: "Words", value: wordCount },
    { label: "Lines", value: lineCount },
  ]

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">String Length</h1>
        <p className="text-muted-foreground">
          Count characters, bytes, words, and lines in a string.
        </p>
      </div>
      <div className="flex flex-col gap-3">
        <label className="text-sm font-medium">Input</label>
        <Textarea
          rows={8}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type or paste text here..."
        />
      </div>
      <div className="flex flex-wrap gap-3">
        {stats.map(({ label, value }) => (
          <div
            key={label}
            className="flex min-w-36 flex-col gap-1 rounded-lg border bg-muted px-4 py-3"
          >
            <span className="text-xs text-muted-foreground">{label}</span>
            <span className="font-mono text-2xl font-semibold">{value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
