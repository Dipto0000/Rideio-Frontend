"use client"

import { useState, useRef } from "react"
import { Camera, X } from "lucide-react"

interface ImageUploadProps {
  name: string
  required?: boolean
  error?: string
  onFileChange?: (file: File | null) => void
  defaultValue?: string
}

export function ImageUpload({ name, required, error, onFileChange, defaultValue }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(defaultValue ?? null)
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileSelection = (file: File | null) => {
    if (!file) {
      setPreview(defaultValue ?? null)
      onFileChange?.(null)
      return
    }

    if (!file.type.startsWith("image/")) return

    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
    onFileChange?.(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith("image/")) {
      const dt = new DataTransfer()
      dt.items.add(file)
      if (inputRef.current) {
        inputRef.current.files = dt.files
      }
      handleFileSelection(file)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelection(file)
    }
  }

  const handleRemove = () => {
    setPreview(defaultValue ?? null)
    if (inputRef.current) {
      inputRef.current.value = ""
    }
    onFileChange?.(null)
  }

  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-foreground">
        Profile Picture
        {required && <span className="text-destructive ml-1">*</span>}
        {!required && <span className="text-muted-foreground font-normal ml-1">(optional)</span>}
      </label>
      <div
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") inputRef.current?.click() }}
        className={`
          relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6
          transition-all duration-200 cursor-pointer outline-none
          ${isDragging
            ? "border-secondary bg-secondary/10 scale-[1.02] shadow-md"
            : "border-border hover:border-secondary/50 hover:bg-muted/30 hover:shadow-sm"
          }
          ${error ? "!border-destructive !bg-destructive/5" : ""}
          ${preview ? "p-3" : "min-h-[150px]"}
        `}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          name={name}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={handleChange}
          required={required}
        />

        {preview ? (
          <div className="relative group w-full flex flex-col items-center">
            <div className="relative">
              <img
                src={preview}
                alt="Profile preview"
                className="w-28 h-28 object-cover rounded-full border-4 border-border shadow-sm transition-transform duration-200 group-hover:scale-105"
              />
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); handleRemove() }}
                className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-1.5 shadow-md opacity-0 group-hover:opacity-100 hover:scale-110 transition-all duration-200"
                aria-label="Remove image"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 hover:text-foreground transition-colors">
              Click to change photo
            </p>
          </div>
        ) : (
          <>
            <div className="rounded-full bg-muted p-3.5 mb-2.5 transition-colors duration-200 group-hover:bg-muted/80">
              <Camera className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">
              Upload profile picture
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Drag & drop or click to browse
            </p>
            <p className="text-xs text-muted-foreground/70 mt-0.5">
              PNG, JPG or WEBP (max 5MB)
            </p>
          </>
        )}
      </div>
      {error && <p className="text-xs text-destructive flex items-center gap-1 mt-1">{error}</p>}
    </div>
  )
}
