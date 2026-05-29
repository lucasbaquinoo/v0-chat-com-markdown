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

const data = [
  { mes: "Jan", vendas: 4200, meta: 4000 },
  { mes: "Fev", vendas: 3800, meta: 4000 },
  { mes: "Mar", vendas: 5100, meta: 4500 },
  { mes: "Abr", vendas: 4700, meta: 4500 },
  { mes: "Mai", vendas: 5800, meta: 5000 },
  { mes: "Jun", vendas: 6200, meta: 5500 },
]

export function SalesChart() {
  return (
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
  )
}
