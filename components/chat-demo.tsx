"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { MarkdownRenderer } from "@/components/markdown-renderer"
import { SalesChart } from "@/components/charts/sales-chart"
import { CategoryChart } from "@/components/charts/category-chart"
import { TrendChart } from "@/components/charts/trend-chart"
import { Send, Bot, User, BarChart3 } from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  charts?: ("sales" | "category" | "trend")[]
}

const aiAnalysisResponse = `## Relatório de Análise de Vendas - Q2 2024

Com base nos dados fornecidos, aqui está uma análise completa do desempenho comercial:

### Resumo Executivo

Os resultados do segundo trimestre mostram um **crescimento consistente** nas vendas, superando as metas estabelecidas em 4 dos 6 meses analisados.

---

### Desempenho Mensal

| Mês | Vendas (R$) | Meta (R$) | Variação | Status |
|-----|-------------|-----------|----------|--------|
| Janeiro | 4.200 | 4.000 | +5,0% | Atingida |
| Fevereiro | 3.800 | 4.000 | -5,0% | Abaixo |
| Março | 5.100 | 4.500 | +13,3% | Atingida |
| Abril | 4.700 | 4.500 | +4,4% | Atingida |
| Maio | 5.800 | 5.000 | +16,0% | Atingida |
| Junho | 6.200 | 5.500 | +12,7% | Atingida |

---

### Distribuição por Categoria

A análise por categoria revela insights importantes sobre o mix de produtos:

| Categoria | Participação | Tendência |
|-----------|--------------|-----------|
| Eletrônicos | 35% | Em alta |
| Vestuário | 25% | Estável |
| Alimentos | 20% | Estável |
| Casa | 12% | Em queda |
| Outros | 8% | Estável |

---

### Análise de Tendências

O gráfico de tendências mostra uma **correlação positiva** entre receita e custos, mantendo margens saudáveis:

- **Margem média**: 38,5%
- **Crescimento receita**: +48,8% (Jan-Jun)
- **Crescimento custos**: +31,7% (Jan-Jun)

---

### Principais Insights

1. **Performance acima da média** - 83% das metas foram atingidas
2. **Eletrônicos lideram** - Categoria com maior crescimento
3. **Margens melhorando** - Receita cresce mais rápido que custos
4. **Sazonalidade positiva** - Tendência de alta no Q2

> "Os dados indicam um momento favorável para expansão do mix de eletrônicos e investimento em campanhas de marketing digital."

### Recomendações

- Aumentar estoque de **eletrônicos** para atender demanda crescente
- Revisar estratégia da categoria **Casa** 
- Manter foco em eficiência operacional

---

*Análise gerada automaticamente com base nos dados de vendas do período.*`

export function ChatDemo() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: aiAnalysisResponse,
        charts: ["sales", "category", "trend"],
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 2000)
  }

  const renderChart = (chartType: "sales" | "category" | "trend", index: number) => {
    const titles = {
      sales: "Vendas vs Meta Mensal",
      category: "Distribuição por Categoria",
      trend: "Tendência de Receita e Custos",
    }

    return (
      <Card key={chartType} className="my-4 overflow-hidden border-border bg-card/50">
        <div className="border-b border-border bg-muted/30 px-4 py-2">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground">{titles[chartType]}</span>
          </div>
        </div>
        <div className="p-4">
          {chartType === "sales" && <SalesChart />}
          {chartType === "category" && <CategoryChart />}
          {chartType === "trend" && <TrendChart />}
        </div>
      </Card>
    )
  }

  const renderMessageContent = (message: Message) => {
    if (message.role === "user") {
      return <p>{message.content}</p>
    }

    const parts = message.content.split("---")

    return (
      <div className="space-y-2">
        {parts.map((part, index) => (
          <div key={index}>
            <MarkdownRenderer content={part.trim()} />
            {message.charts && index === 1 && renderChart("sales", 0)}
            {message.charts && index === 2 && renderChart("category", 1)}
            {message.charts && index === 3 && renderChart("trend", 2)}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      <header className="border-b border-border bg-card px-6 py-4">
        <div className="mx-auto flex max-w-4xl items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
            <Bot className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">Assistente de Análise</h1>
            <p className="text-sm text-muted-foreground">Respostas em Markdown com gráficos interativos</p>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto max-w-4xl space-y-6">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <BarChart3 className="h-8 w-8 text-muted-foreground" />
              </div>
              <h2 className="mb-2 text-xl font-semibold text-foreground">Assistente de Dados</h2>
              <p className="mb-6 max-w-md text-muted-foreground">
                Pergunte sobre vendas, tendências ou performance para receber uma análise completa com gráficos.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {["Analise as vendas do Q2", "Mostre a distribuição de categorias", "Qual a tendência de receita?"].map(
                  (suggestion) => (
                    <Button
                      key={suggestion}
                      variant="outline"
                      size="sm"
                      onClick={() => setInput(suggestion)}
                      className="text-xs"
                    >
                      {suggestion}
                    </Button>
                  )
                )}
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.role === "assistant" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
                  <Bot className="h-4 w-4 text-primary-foreground" />
                </div>
              )}

              <Card
                className={`px-5 py-4 ${
                  message.role === "user"
                    ? "max-w-[70%] bg-primary text-primary-foreground"
                    : "max-w-[90%] bg-card"
                }`}
              >
                {renderMessageContent(message)}
              </Card>

              {message.role === "user" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                  <User className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
                <Bot className="h-4 w-4 text-primary-foreground" />
              </div>
              <Card className="bg-card px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
                    <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
                    <div className="h-2 w-2 animate-bounce rounded-full bg-primary" />
                  </div>
                  <span className="text-sm text-muted-foreground">Analisando dados e gerando gráficos...</span>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-border bg-card px-4 py-4">
        <form onSubmit={handleSubmit} className="mx-auto flex max-w-4xl gap-3">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Pergunte sobre vendas, tendências ou análises..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Enviar</span>
          </Button>
        </form>
      </div>
    </div>
  )
}
