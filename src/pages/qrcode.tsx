import { useRef, useState, useCallback } from "react"
import { QRCodeSVG } from "qrcode.react"
import jsQR from "jsqr"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export function QRCodePage() {
  // Generate section
  const [genInput, setGenInput] = useState("")

  // Decode section
  const [decodeResult, setDecodeResult] = useState("")
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function downloadQR() {
    const svg = document.getElementById("qrcode-svg")
    if (!svg) return
    const serializer = new XMLSerializer()
    const svgStr = serializer.serializeToString(svg)
    const blob = new Blob([svgStr], { type: "image/svg+xml" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "qrcode.svg"
    a.click()
    URL.revokeObjectURL(url)
  }

  const decodeFile = useCallback((file: File) => {
    const reader = new FileReader()
    reader.onload = (ev) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement("canvas")
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext("2d")
        if (!ctx) return
        ctx.drawImage(img, 0, 0)
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const code = jsQR(imageData.data, imageData.width, imageData.height)
        if (code) {
          setDecodeResult(code.data)
        } else {
          toast.error("No QR code found in the image.")
          setDecodeResult("")
        }
      }
      img.src = ev.target?.result as string
    }
    reader.readAsDataURL(file)
  }, [])

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    decodeFile(file)
    // Reset so re-uploading same file fires change event
    e.target.value = ""
  }

  return (
    <div className="flex flex-col gap-10 p-6">
      <div>
        <h1 className="text-2xl font-semibold">QR Code</h1>
        <p className="text-muted-foreground">
          Generate a QR code from text, or decode a QR code image to text.
        </p>
      </div>

      {/* Generate */}
      <div className="flex flex-col gap-4">
        <h2 className="text-base font-medium">Text → QR Code</h2>
        <Textarea
          rows={4}
          value={genInput}
          onChange={(e) => setGenInput(e.target.value)}
          placeholder="Enter text or URL to generate a QR code..."
        />
        {genInput.trim() && (
          <div className="flex flex-col gap-3">
            <div className="w-fit rounded-lg border bg-white p-4">
              <QRCodeSVG
                id="qrcode-svg"
                value={genInput}
                size={200}
                level="M"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              className="self-start"
              onClick={downloadQR}
            >
              Download SVG
            </Button>
          </div>
        )}
      </div>

      {/* Decode */}
      <div className="flex flex-col gap-4">
        <h2 className="text-base font-medium">QR Code → Text</h2>
        <div
          className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-8 transition-colors ${isDragOver ? "border-primary bg-primary/5" : "border-muted-foreground/30 hover:border-primary/50"}`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragOver(true)
          }}
          onDragLeave={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node)) {
              setIsDragOver(false)
            }
          }}
          onDrop={(e) => {
            e.preventDefault()
            setIsDragOver(false)
            const file = e.dataTransfer.files?.[0]
            if (file) decodeFile(file)
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
          <p className="text-sm text-muted-foreground">
            Drag &amp; drop a QR code image here, or{" "}
            <span className="text-foreground underline underline-offset-2">
              click to upload
            </span>
          </p>
        </div>
        {decodeResult && (
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Decoded Text</label>
            <Textarea
              rows={4}
              readOnly
              value={decodeResult}
              className="font-mono"
            />
            <Button
              variant="outline"
              size="sm"
              className="self-start"
              onClick={() =>
                navigator.clipboard
                  .writeText(decodeResult)
                  .then(() => toast.success("Copied to clipboard."))
                  .catch(() => toast.error("Failed to copy to clipboard."))
              }
            >
              Copy
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
