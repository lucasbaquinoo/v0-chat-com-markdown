"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { MarkdownWithCharts } from "@/components/markdown-with-charts"
import { Send, Bot, User, BarChart3, Copy, Check, ThumbsUp, ThumbsDown } from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  feedback?: "up" | "down" | null
}

// Markdown com gráficos definidos via blocos de código ```chart
const aiAnalysisResponse = `## Relatório de Análise de Vendas - Q2 2024

Com base nos dados fornecidos, aqui está uma análise completa do desempenho comercial:

### Resumo Executivo

Os resultados do segundo trimestre mostram um **crescimento consistente** nas vendas, superando as metas estabelecidas em 4 dos 6 meses analisados.

### Desempenho Mensal

| Mês | Vendas (R$) | Meta (R$) | Variação | Status |
|-----|-------------|-----------|----------|--------|
| Janeiro | 4.200 | 4.000 | +5,0% | Atingida |
| Fevereiro | 3.800 | 4.000 | -5,0% | Abaixo |
| Março | 5.100 | 4.500 | +13,3% | Atingida |
| Abril | 4.700 | 4.500 | +4,4% | Atingida |
| Maio | 5.800 | 5.000 | +16,0% | Atingida |
| Junho | 6.200 | 5.500 | +12,7% | Atingida |

\`\`\`chart
{
  "type": "bar",
  "title": "Vendas vs Meta Mensal",
  "data": [
    { "name": "Jan", "vendas": 4200, "meta": 4000 },
    { "name": "Fev", "vendas": 3800, "meta": 4000 },
    { "name": "Mar", "vendas": 5100, "meta": 4500 },
    { "name": "Abr", "vendas": 4700, "meta": 4500 },
    { "name": "Mai", "vendas": 5800, "meta": 5000 },
    { "name": "Jun", "vendas": 6200, "meta": 5500 }
  ],
  "config": {
    "vendas": { "label": "Vendas", "color": "hsl(142, 76%, 36%)" },
    "meta": { "label": "Meta", "color": "hsl(215, 20%, 65%)" }
  },
  "showExport": true
}
\`\`\`

### Distribuição por Categoria

A análise por categoria revela insights importantes sobre o mix de produtos:

\`\`\`chart
{
  "type": "pie",
  "title": "Participação por Categoria",
  "data": [
    { "name": "Eletrônicos", "value": 35 },
    { "name": "Vestuário", "value": 25 },
    { "name": "Alimentos", "value": 20 },
    { "name": "Casa", "value": 12 },
    { "name": "Outros", "value": 8 }
  ],
  "config": {
    "eletronicos": { "label": "Eletrônicos", "color": "hsl(142, 76%, 36%)" },
    "vestuario": { "label": "Vestuário", "color": "hsl(215, 70%, 50%)" },
    "alimentos": { "label": "Alimentos", "color": "hsl(280, 65%, 60%)" },
    "casa": { "label": "Casa", "color": "hsl(35, 90%, 55%)" },
    "outros": { "label": "Outros", "color": "hsl(215, 20%, 65%)" }
  },
  "showExport": false
}
\`\`\`

### Análise de Tendências

O gráfico de tendências mostra uma **correlação positiva** entre receita e custos, mantendo margens saudáveis:

\`\`\`chart
{
  "type": "line",
  "title": "Tendência de Receita e Custos",
  "data": [
    { "name": "Jan", "receita": 12500, "custos": 8200 },
    { "name": "Fev", "receita": 11800, "custos": 7900 },
    { "name": "Mar", "receita": 15200, "custos": 9100 },
    { "name": "Abr", "receita": 14100, "custos": 8800 },
    { "name": "Mai", "receita": 17400, "custos": 10200 },
    { "name": "Jun", "receita": 18600, "custos": 10800 }
  ],
  "config": {
    "receita": { "label": "Receita", "color": "hsl(142, 76%, 36%)" },
    "custos": { "label": "Custos", "color": "hsl(215, 70%, 50%)" }
  },
  "showExport": true
}
\`\`\`

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

*Análise gerada automaticamente com base nos dados de vendas do período.*`

export function ChatDemo() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleCopy = async (content: string, messageId: string) => {
    await navigator.clipboard.writeText(content)
    setCopiedId(messageId)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleFeedback = (messageId: string, feedback: "up" | "down") => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? { ...msg, feedback: msg.feedback === feedback ? null : feedback }
          : msg
      )
    )
  }

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
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 2000)
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
            <p className="text-sm text-muted-foreground">Gráficos definidos diretamente no Markdown</p>
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
              <h2 className="mb-2 text-xl font-semibold text-foreground">Charts via Markdown</h2>
              <p className="mb-4 max-w-md text-muted-foreground">
                Os gráficos são definidos usando blocos de código <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">```chart</code> diretamente no markdown.
              </p>
              <pre className="mb-6 rounded-lg bg-muted p-4 text-left text-xs overflow-x-auto max-w-lg">
{`\`\`\`chart
{
  "type": "bar",
  "title": "Meu Gráfico",
  "data": [...],
  "config": {...},
  "showExport": true
}
\`\`\``}
              </pre>
              <div className="flex flex-wrap justify-center gap-2">
                {["Analise as vendas do Q2", "Mostre gráficos de tendência", "Relatório completo"].map(
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
                {message.role === "user" ? (
                  <p>{message.content}</p>
                ) : (
                  <div className="space-y-3">
                    <MarkdownWithCharts content={message.content} />
                    
                    <div className="flex items-center gap-1 pt-3 border-t border-border">
                      <button
                        onClick={() => handleCopy(message.content, message.id)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                        title="Copiar resposta"
                      >
                        {copiedId === message.id ? (
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
                      
                      <div className="w-px h-4 bg-border mx-1" />
                      
                      <button
                        onClick={() => handleFeedback(message.id, "up")}
                        className={`inline-flex items-center gap-1 px-2 py-1.5 text-xs rounded-md transition-colors ${
                          message.feedback === "up"
                            ? "text-green-500 bg-green-500/10"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        }`}
                        title="Resposta util"
                      >
                        <ThumbsUp className="h-3.5 w-3.5" />
                      </button>
                      
                      <button
                        onClick={() => handleFeedback(message.id, "down")}
                        className={`inline-flex items-center gap-1 px-2 py-1.5 text-xs rounded-md transition-colors ${
                          message.feedback === "down"
                            ? "text-red-500 bg-red-500/10"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        }`}
                        title="Resposta nao util"
                      >
                        <ThumbsDown className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                )}
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
                  <span className="text-sm text-muted-foreground">Gerando análise com gráficos...</span>
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
