import { useMemo, useState } from "react"
import { toast } from "sonner"
import {
  CopyIcon,
  PencilIcon,
  PlusIcon,
  SearchIcon,
  Trash2Icon,
} from "lucide-react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useGists } from "@/hooks/use-gists"
import type { Gist } from "@/types/gist"

const LANGUAGES = [
  { value: "plaintext", label: "Plain Text" },
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "jsx", label: "JSX" },
  { value: "tsx", label: "TSX" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "c", label: "C" },
  { value: "cpp", label: "C++" },
  { value: "csharp", label: "C#" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "ruby", label: "Ruby" },
  { value: "php", label: "PHP" },
  { value: "swift", label: "Swift" },
  { value: "kotlin", label: "Kotlin" },
  { value: "css", label: "CSS" },
  { value: "html", label: "HTML" },
  { value: "sql", label: "SQL" },
  { value: "bash", label: "Bash/Shell" },
  { value: "json", label: "JSON" },
  { value: "yaml", label: "YAML" },
  { value: "markdown", label: "Markdown" },
]

function getLanguageLabel(value: string) {
  return LANGUAGES.find((l) => l.value === value)?.label ?? value
}

type FormState = {
  title: string
  language: string
  content: string
}

const DEFAULT_FORM: FormState = {
  title: "",
  language: "plaintext",
  content: "",
}

export function GistPage() {
  const { gists, createGist, updateGist, deleteGist, deleteGists } = useGists()
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Gist | null>(null)
  const [form, setForm] = useState<FormState>(DEFAULT_FORM)
  const [deleteConfirmIds, setDeleteConfirmIds] = useState<string[] | null>(null)

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    if (!q) return gists
    return gists.filter(
      (g) =>
        g.title.toLowerCase().includes(q) ||
        g.content.toLowerCase().includes(q) ||
        g.language.toLowerCase().includes(q)
    )
  }, [gists, search])

  const allFilteredSelected =
    filtered.length > 0 && filtered.every((g) => selected.has(g.id))

  function openCreate() {
    setEditTarget(null)
    setForm(DEFAULT_FORM)
    setDialogOpen(true)
  }

  function openEdit(gist: Gist) {
    setEditTarget(gist)
    setForm({ title: gist.title, language: gist.language, content: gist.content })
    setDialogOpen(true)
  }

  function handleSave() {
    if (!form.content.trim()) {
      toast.error("Content is required.")
      return
    }
    if (editTarget) {
      updateGist(editTarget.id, form)
      toast.success("Gist updated.")
    } else {
      createGist(form)
      toast.success("Gist created.")
    }
    setDialogOpen(false)
  }

  function handleDelete(ids: string[]) {
    setDeleteConfirmIds(ids)
  }

  function confirmDelete() {
    if (!deleteConfirmIds) return
    if (deleteConfirmIds.length === 1) {
      deleteGist(deleteConfirmIds[0])
    } else {
      deleteGists(deleteConfirmIds)
    }
    setSelected((prev) => {
      const next = new Set(prev)
      deleteConfirmIds.forEach((id) => next.delete(id))
      return next
    })
    toast.success(
      deleteConfirmIds.length === 1 ? "Gist deleted." : `${deleteConfirmIds.length} gists deleted.`
    )
    setDeleteConfirmIds(null)
  }

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleSelectAll() {
    if (allFilteredSelected) {
      setSelected((prev) => {
        const next = new Set(prev)
        filtered.forEach((g) => next.delete(g.id))
        return next
      })
    } else {
      setSelected((prev) => {
        const next = new Set(prev)
        filtered.forEach((g) => next.add(g.id))
        return next
      })
    }
  }

  function handleCopy(content: string) {
    navigator.clipboard.writeText(content)
    toast.success("Copied to clipboard.")
  }

  const selectedInView = filtered.filter((g) => selected.has(g.id))

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Gist</h1>
          <p className="text-muted-foreground">
            Save and manage code snippets with syntax highlighting.
          </p>
        </div>
        <Button onClick={openCreate} className="shrink-0">
          <PlusIcon />
          New Gist
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-8"
            placeholder="Search by title, content, or language..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {selectedInView.length > 0 && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDelete(selectedInView.map((g) => g.id))}
          >
            <Trash2Icon />
            Delete {selectedInView.length} selected
          </Button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-16 text-center text-muted-foreground">
          {gists.length === 0 ? (
            <>
              <p className="text-sm font-medium">No gists yet</p>
              <p className="text-xs">Click "New Gist" to create your first snippet.</p>
            </>
          ) : (
            <>
              <p className="text-sm font-medium">No results</p>
              <p className="text-xs">Try a different search term.</p>
            </>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 px-1 pb-1">
            <Checkbox
              checked={allFilteredSelected}
              onCheckedChange={toggleSelectAll}
              aria-label="Select all"
            />
            <span className="text-xs text-muted-foreground">
              {filtered.length} snippet{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>
          {filtered.map((gist) => (
            <GistCard
              key={gist.id}
              gist={gist}
              selected={selected.has(gist.id)}
              onSelect={toggleSelect}
              onEdit={openEdit}
              onDelete={(id) => handleDelete([id])}
              onCopy={handleCopy}
            />
          ))}
        </div>
      )}

      {/* Create / Edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editTarget ? "Edit Gist" : "New Gist"}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 px-4 pb-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="gist-title">Title (optional)</Label>
              <Input
                id="gist-title"
                placeholder="Untitled"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="gist-language">Language</Label>
              <Select
                value={form.language}
                onValueChange={(v) => setForm((f) => ({ ...f, language: v }))}
              >
                <SelectTrigger id="gist-language">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {LANGUAGES.map((l) => (
                    <SelectItem key={l.value} value={l.value}>
                      {l.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="gist-content">Content</Label>
              <Textarea
                id="gist-content"
                rows={12}
                className="font-mono"
                placeholder="Paste your code here..."
                value={form.content}
                onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editTarget ? "Save changes" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteConfirmIds !== null}
        onOpenChange={(open) => { if (!open) setDeleteConfirmIds(null) }}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirm deletion</DialogTitle>
          </DialogHeader>
          <p className="px-4 pb-2 text-xs text-muted-foreground">
            {deleteConfirmIds && deleteConfirmIds.length === 1
              ? "Are you sure you want to delete this gist? This action cannot be undone."
              : `Are you sure you want to delete ${deleteConfirmIds?.length} gists? This action cannot be undone.`}
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmIds(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

type GistCardProps = {
  gist: Gist
  selected: boolean
  onSelect: (id: string) => void
  onEdit: (gist: Gist) => void
  onDelete: (id: string) => void
  onCopy: (content: string) => void
}

function GistCard({ gist, selected, onSelect, onEdit, onDelete, onCopy }: GistCardProps) {
  const [expanded, setExpanded] = useState(false)
  const displayTitle = gist.title || "Untitled"

  return (
    <div className="flex flex-col border border-input bg-background">
      <div
        className="flex cursor-pointer items-center gap-3 px-3 py-2 hover:bg-muted/50"
        onClick={() => setExpanded((v) => !v)}
      >
        <Checkbox
          checked={selected}
          onCheckedChange={() => onSelect(gist.id)}
          onClick={(e) => e.stopPropagation()}
          aria-label={`Select ${displayTitle}`}
        />
        <span className="flex-1 truncate text-xs font-medium">{displayTitle}</span>
        <Badge variant="outline">{getLanguageLabel(gist.language)}</Badge>
        <span className="shrink-0 text-[10px] text-muted-foreground">
          {new Date(gist.updatedAt).toLocaleDateString()}
        </span>
        <div
          className="flex items-center gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onCopy(gist.content)}
            title="Copy content"
          >
            <CopyIcon />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onEdit(gist)}
            title="Edit gist"
          >
            <PencilIcon />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onDelete(gist.id)}
            title="Delete gist"
            className="text-destructive hover:text-destructive"
          >
            <Trash2Icon />
          </Button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-input">
          <SyntaxHighlighter
            language={gist.language === "plaintext" ? "text" : gist.language}
            style={oneDark}
            customStyle={{
              margin: 0,
              borderRadius: 0,
              fontSize: "0.75rem",
              maxHeight: "400px",
            }}
            showLineNumbers
          >
            {gist.content}
          </SyntaxHighlighter>
        </div>
      )}
    </div>
  )
}
