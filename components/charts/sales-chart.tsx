"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { Download, FileSpreadsheet } from "lucide-react"

const data = [
  { mes: "Jan", vendas: 4200, meta: 4000 },
  { mes: "Fev", vendas: 3800, meta: 4000 },
  { mes: "Mar", vendas: 5100, meta: 4500 },
  { mes: "Abr", vendas: 4700, meta: 4500 },
  { mes: "Mai", vendas: 5800, meta: 5000 },
  { mes: "Jun", vendas: 6200, meta: 5500 },
]

function exportToCSV() {
  const headers = ["Mês", "Vendas (R$)", "Meta (R$)"]
  const rows = data.map((row) => [row.mes, row.vendas, row.meta])
  const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n")
  
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  link.href = URL.createObjectURL(blob)
  link.download = "vendas-vs-meta.csv"
  link.click()
}

export function SalesChart() {
  return (
    <div className="space-y-3">
      <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis
            dataKey="mes"
            tick={{ fontSize: 12 }}
            className="text-muted-foreground"
          />
          <YAxis
            tick={{ fontSize: 12 }}
            className="text-muted-foreground"
            tickFormatter={(value) => `R$${value / 1000}k`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              fontSize: "12px",
            }}
            formatter={(value: number) => [`R$ ${value.toLocaleString("pt-BR")}`, ""]}
          />
          <Legend wrapperStyle={{ fontSize: "12px" }} />
          <Bar dataKey="vendas" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Vendas" />
          <Bar dataKey="meta" fill="hsl(var(--muted-foreground))" radius={[4, 4, 0, 0]} name="Meta" opacity={0.5} />
        </BarChart>
      </ResponsiveContainer>
      </div>
      
      <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
        <button
          onClick={exportToCSV}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground bg-muted/50 hover:bg-muted rounded-md transition-colors"
        >
          <FileSpreadsheet className="h-3.5 w-3.5" />
          Exportar CSV
        </button>
        <button
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-md transition-colors"
        >
          <Download className="h-3.5 w-3.5" />
          Baixar Relatório
        </button>
      </div>
    </div>
  )
}
