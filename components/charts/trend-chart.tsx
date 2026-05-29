"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

const data = [
  { mes: "Jan", receita: 12500, custos: 8200 },
  { mes: "Fev", receita: 11800, custos: 7900 },
  { mes: "Mar", receita: 15200, custos: 9100 },
  { mes: "Abr", receita: 14100, custos: 8800 },
  { mes: "Mai", receita: 17400, custos: 10200 },
  { mes: "Jun", receita: 18600, custos: 10800 },
]

export function TrendChart() {
  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
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
          <Line
            type="monotone"
            dataKey="receita"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={{ fill: "hsl(var(--primary))", strokeWidth: 2 }}
            name="Receita"
          />
          <Line
            type="monotone"
            dataKey="custos"
            stroke="hsl(220, 70%, 50%)"
            strokeWidth={2}
            dot={{ fill: "hsl(220, 70%, 50%)", strokeWidth: 2 }}
            name="Custos"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
