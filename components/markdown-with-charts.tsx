"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import type { Components } from "react-markdown"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { Download, FileSpreadsheet, BarChart3 } from "lucide-react"
import { Card } from "@/components/ui/card"

interface ChartConfig {
  type: "bar" | "line" | "pie"
  title: string
  data: Record<string, unknown>[]
  config: Record<string, { label: string; color: string }>
  showExport?: boolean
}

function parseChartConfig(code: string): ChartConfig | null {
  try {
    return JSON.parse(code)
  } catch {
    return null
  }
}

function exportToCSV(data: Record<string, unknown>[], filename: string) {
  if (!data.length) return
  const headers = Object.keys(data[0])
  const rows = data.map((row) => headers.map((h) => row[h]))
  const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n")

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  link.href = URL.createObjectURL(blob)
  link.download = `${filename}.csv`
  link.click()
}

function ChartRenderer({ config }: { config: ChartConfig }) {
  const { type, title, data, config: chartConfig, showExport } = config
  const colors = Object.values(chartConfig).map((c) => c.color)

  return (
    <Card className="my-4 overflow-hidden border-border bg-card/50">
      <div className="border-b border-border bg-muted/30 px-4 py-2">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-foreground">{title}</span>
        </div>
      </div>
      <div className="p-4">
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            {type === "bar" ? (
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                {Object.keys(chartConfig).map((key, index) => (
                  <Bar
                    key={key}
                    dataKey={key}
                    fill={chartConfig[key].color}
                    radius={[4, 4, 0, 0]}
                    name={chartConfig[key].label}
                  />
                ))}
              </BarChart>
            ) : type === "line" ? (
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                {Object.keys(chartConfig).map((key) => (
                  <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={chartConfig[key].color}
                    strokeWidth={2}
                    dot={{ fill: chartConfig[key].color, strokeWidth: 2 }}
                    name={chartConfig[key].label}
                  />
                ))}
              </LineChart>
            ) : (
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {data.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            )}
          </ResponsiveContainer>
        </div>

        {showExport && (
          <div className="flex items-center justify-end gap-2 pt-3 mt-3 border-t border-border">
            <button
              onClick={() => exportToCSV(data, title.toLowerCase().replace(/\s+/g, "-"))}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground bg-muted/50 hover:bg-muted rounded-md transition-colors"
            >
              <FileSpreadsheet className="h-3.5 w-3.5" />
              Exportar CSV
            </button>
            <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-md transition-colors">
              <Download className="h-3.5 w-3.5" />
              Baixar
            </button>
          </div>
        )}
      </div>
    </Card>
  )
}

interface MarkdownWithChartsProps {
  content: string
}

export function MarkdownWithCharts({ content }: MarkdownWithChartsProps) {
  const components: Components = {
    table: ({ children }) => (
      <div className="my-4 overflow-x-auto rounded-lg border border-border">
        <table className="w-full border-collapse text-sm">{children}</table>
      </div>
    ),
    thead: ({ children }) => <thead className="bg-muted/50">{children}</thead>,
    tbody: ({ children }) => <tbody className="divide-y divide-border">{children}</tbody>,
    tr: ({ children }) => <tr className="transition-colors hover:bg-muted/30">{children}</tr>,
    th: ({ children }) => <th className="px-4 py-3 text-left font-semibold text-foreground">{children}</th>,
    td: ({ children }) => <td className="px-4 py-3 text-muted-foreground">{children}</td>,
    p: ({ children }) => <p className="mb-3 leading-relaxed text-foreground">{children}</p>,
    h1: ({ children }) => <h1 className="mb-4 text-2xl font-bold text-foreground">{children}</h1>,
    h2: ({ children }) => <h2 className="mb-3 text-xl font-semibold text-foreground">{children}</h2>,
    h3: ({ children }) => <h3 className="mb-2 text-lg font-semibold text-foreground">{children}</h3>,
    ul: ({ children }) => <ul className="mb-3 ml-4 list-disc space-y-1 text-foreground">{children}</ul>,
    ol: ({ children }) => <ol className="mb-3 ml-4 list-decimal space-y-1 text-foreground">{children}</ol>,
    li: ({ children }) => <li className="text-foreground">{children}</li>,
    blockquote: ({ children }) => (
      <blockquote className="my-4 border-l-4 border-primary pl-4 italic text-muted-foreground">{children}</blockquote>
    ),
    strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    code: ({ children, className }) => {
      const isChart = className === "language-chart"

      if (isChart && typeof children === "string") {
        const config = parseChartConfig(children)
        if (config) {
          return <ChartRenderer config={config} />
        }
      }

      const isInline = !className
      if (isInline) {
        return <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm text-foreground">{children}</code>
      }
      return <code className="block overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">{children}</code>
    },
    pre: ({ children }) => {
      // @ts-expect-error - accessing nested children
      const codeProps = children?.props
      if (codeProps?.className === "language-chart") {
        return <>{children}</>
      }
      return <pre className="my-4 overflow-x-auto rounded-lg bg-muted p-4">{children}</pre>
    },
  }

  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {content}
    </ReactMarkdown>
  )
}
