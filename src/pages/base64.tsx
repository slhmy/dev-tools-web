import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Base64Page() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [error, setError] = useState("")

  function encode() {
    try {
      const bytes = new TextEncoder().encode(input)
      const binary = String.fromCharCode(...bytes)
      setOutput(btoa(binary))
      setError("")
    } catch {
      setError("Encoding failed. Make sure the input is valid text.")
    }
  }

  function decode() {
    try {
      const binary = atob(input)
      const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0))
      setOutput(new TextDecoder().decode(bytes))
      setError("")
    } catch {
      setError("Decoding failed. Make sure the input is valid Base64.")
    }
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Base64 Converter</h1>
        <p className="text-muted-foreground">
          Encode or decode Base64 strings.
        </p>
      </div>
      <div className="flex flex-col gap-3">
        <label className="text-sm font-medium">Input</label>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text or Base64 string..."
        />
        <div className="flex gap-2">
          <Button onClick={encode}>Encode</Button>
          <Button variant="outline" onClick={decode}>
            Decode
          </Button>
        </div>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {output && (
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Output</label>
          <div className="rounded-md border bg-muted px-3 py-2 font-mono text-sm break-all">
            {output}
          </div>
          <Button
            variant="outline"
            size="sm"
            className="self-start"
            onClick={() => navigator.clipboard.writeText(output)}
          >
            Copy
          </Button>
        </div>
      )}
    </div>
  )
}
