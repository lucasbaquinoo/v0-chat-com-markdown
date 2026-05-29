"use client"

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts"

const data = [
  { name: "Eletrônicos", value: 35, color: "hsl(var(--primary))" },
  { name: "Vestuário", value: 25, color: "hsl(220, 70%, 50%)" },
  { name: "Alimentos", value: 20, color: "hsl(150, 60%, 45%)" },
  { name: "Casa", value: 12, color: "hsl(45, 90%, 50%)" },
  { name: "Outros", value: 8, color: "hsl(var(--muted-foreground))" },
]

export function CategoryChart() {
  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={2}
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              fontSize: "12px",
            }}
            formatter={(value: number) => [`${value}%`, "Participação"]}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
