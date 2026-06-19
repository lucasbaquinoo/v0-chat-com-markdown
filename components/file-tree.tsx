"use client"

import { useState } from "react"
import {
  Folder,
  FolderOpen,
  File,
  FileCode,
  FileJson,
  FileText,
  FileImage,
  FileCog,
  ChevronRight,
  Copy,
  Check,
} from "lucide-react"

export interface TreeNode {
  name: string
  type: "file" | "folder"
  children?: TreeNode[]
  badge?: string
}

function getFileIcon(name: string) {
  const ext = name.split(".").pop()?.toLowerCase()
  const iconClass = "h-4 w-4 shrink-0"

  switch (ext) {
    case "ts":
    case "tsx":
    case "js":
    case "jsx":
      return <FileCode className={`${iconClass} text-blue-500`} />
    case "json":
      return <FileJson className={`${iconClass} text-yellow-500`} />
    case "md":
    case "mdx":
    case "txt":
      return <FileText className={`${iconClass} text-muted-foreground`} />
    case "png":
    case "jpg":
    case "jpeg":
    case "svg":
    case "webp":
      return <FileImage className={`${iconClass} text-green-500`} />
    case "css":
    case "scss":
      return <FileCog className={`${iconClass} text-pink-500`} />
    default:
      return <File className={`${iconClass} text-muted-foreground`} />
  }
}

function TreeItem({ node, depth, defaultOpen }: { node: TreeNode; depth: number; defaultOpen: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const isFolder = node.type === "folder"

  return (
    <div>
      <button
        onClick={() => isFolder && setIsOpen(!isOpen)}
        className={`flex w-full items-center gap-1.5 rounded-md px-2 py-1 text-left text-sm transition-colors hover:bg-muted/60 ${
          isFolder ? "cursor-pointer" : "cursor-default"
        }`}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
      >
        {isFolder ? (
          <ChevronRight
            className={`h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform ${isOpen ? "rotate-90" : ""}`}
          />
        ) : (
          <span className="w-3.5 shrink-0" />
        )}
        {isFolder ? (
          isOpen ? (
            <FolderOpen className="h-4 w-4 shrink-0 text-primary" />
          ) : (
            <Folder className="h-4 w-4 shrink-0 text-primary" />
          )
        ) : (
          getFileIcon(node.name)
        )}
        <span className={`truncate ${isFolder ? "font-medium text-foreground" : "text-muted-foreground"}`}>
          {node.name}
        </span>
        {node.badge && (
          <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">{node.badge}</span>
        )}
      </button>

      {isFolder && isOpen && node.children && (
        <div>
          {node.children.map((child, index) => (
            <TreeItem key={`${child.name}-${index}`} node={child} depth={depth + 1} defaultOpen={defaultOpen} />
          ))}
        </div>
      )}
    </div>
  )
}

function flattenTree(nodes: TreeNode[], prefix = ""): string {
  let result = ""
  nodes.forEach((node, index) => {
    const isLast = index === nodes.length - 1
    const connector = isLast ? "└── " : "├── "
    result += `${prefix}${connector}${node.name}\n`
    if (node.children) {
      const childPrefix = prefix + (isLast ? "    " : "│   ")
      result += flattenTree(node.children, childPrefix)
    }
  })
  return result
}

export function FileTree({ nodes, title }: { nodes: TreeNode[]; title?: string }) {
  const [copied, setCopied] = useState(false)

  const countFiles = (items: TreeNode[]): { files: number; folders: number } => {
    return items.reduce(
      (acc, item) => {
        if (item.type === "file") acc.files++
        else {
          acc.folders++
          if (item.children) {
            const sub = countFiles(item.children)
            acc.files += sub.files
            acc.folders += sub.folders
          }
        }
        return acc
      },
      { files: 0, folders: 0 },
    )
  }

  const { files, folders } = countFiles(nodes)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(flattenTree(nodes))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="my-4 overflow-hidden rounded-lg border border-border bg-card/50">
      <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-2">
        <div className="flex items-center gap-2">
          <Folder className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-foreground">{title ?? "Estrutura de Arquivos"}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">
            {folders} pastas, {files} arquivos
          </span>
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            title="Copiar estrutura"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-green-500" />
                <span className="text-green-500">Copiado</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copiar</span>
              </>
            )}
          </button>
        </div>
      </div>
      <div className="p-2 font-mono">
        {nodes.map((node, index) => (
          <TreeItem key={`${node.name}-${index}`} node={node} depth={0} defaultOpen />
        ))}
      </div>
    </div>
  )
}

export function parseTreeConfig(code: string): { nodes: TreeNode[]; title?: string } | null {
  try {
    const parsed = JSON.parse(code)
    if (Array.isArray(parsed)) return { nodes: parsed }
    if (parsed.nodes) return { nodes: parsed.nodes, title: parsed.title }
    return null
  } catch {
    return null
  }
}
