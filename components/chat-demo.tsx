"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { MarkdownWithCharts } from "@/components/markdown-with-charts"
import { Send, Bot, User, BarChart3, Copy, Check, ThumbsUp, ThumbsDown, Sparkles, ChevronDown, ChevronUp } from "lucide-react"

interface ThinkingStep {
  text: string
  duration: number
}

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  feedback?: "up" | "down" | null
  thinkingTime?: number
  thinkingSteps?: ThinkingStep[]
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

// Markdown com árvore de arquivos definida via bloco de código ```tree
const fileTreeResponse = `## Estrutura do Projeto

Aqui está a organização de arquivos recomendada para o seu projeto **Next.js**:

\`\`\`tree
{
  "title": "meu-projeto/",
  "nodes": [
    {
      "name": "app",
      "type": "folder",
      "children": [
        { "name": "layout.tsx", "type": "file" },
        { "name": "page.tsx", "type": "file" },
        { "name": "globals.css", "type": "file" },
        {
          "name": "dashboard",
          "type": "folder",
          "children": [
            { "name": "page.tsx", "type": "file" },
            { "name": "loading.tsx", "type": "file" }
          ]
        }
      ]
    },
    {
      "name": "components",
      "type": "folder",
      "badge": "12",
      "children": [
        { "name": "chat-demo.tsx", "type": "file" },
        { "name": "file-tree.tsx", "type": "file" },
        { "name": "markdown-with-charts.tsx", "type": "file" },
        {
          "name": "ui",
          "type": "folder",
          "children": [
            { "name": "button.tsx", "type": "file" },
            { "name": "card.tsx", "type": "file" },
            { "name": "input.tsx", "type": "file" }
          ]
        }
      ]
    },
    {
      "name": "lib",
      "type": "folder",
      "children": [
        { "name": "utils.ts", "type": "file" }
      ]
    },
    {
      "name": "public",
      "type": "folder",
      "children": [
        { "name": "logo.svg", "type": "file" },
        { "name": "hero.png", "type": "file" }
      ]
    },
    { "name": "package.json", "type": "file" },
    { "name": "tsconfig.json", "type": "file" },
    { "name": "README.md", "type": "file" }
  ]
}
\`\`\`

### Descrição das Pastas

| Pasta | Responsabilidade |
|-------|------------------|
| \`app/\` | Rotas e páginas (App Router) |
| \`components/\` | Componentes reutilizáveis de UI |
| \`lib/\` | Funções utilitárias e helpers |
| \`public/\` | Arquivos estáticos (imagens, ícones) |

> Clique nas pastas para expandir ou recolher a estrutura. Use o botão **Copiar** para exportar a árvore em formato ASCII.

*Estrutura gerada com base nas convenções do Next.js App Router.*`

const thinkingSteps: ThinkingStep[] = [
  { text: "Analisando a consulta do usuário...", duration: 800 },
  { text: "Buscando dados relevantes no banco...", duration: 1200 },
  { text: "Processando métricas de vendas...", duration: 1000 },
  { text: "Gerando visualizações de dados...", duration: 1500 },
  { text: "Calculando tendências e insights...", duration: 1000 },
  { text: "Formatando resposta final...", duration: 500 },
]

function ThinkingIndicator({ 
  steps, 
  currentStep, 
  elapsedTime 
}: { 
  steps: ThinkingStep[]
  currentStep: number
  elapsedTime: number 
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="relative flex h-5 w-5 items-center justify-center">
          <div className="absolute h-5 w-5 animate-ping rounded-full bg-primary/30" />
          <Sparkles className="h-4 w-4 text-primary animate-pulse" />
        </div>
        <span className="text-sm font-medium text-foreground">Pensando...</span>
        <span className="text-xs text-muted-foreground tabular-nums">
          {(elapsedTime / 1000).toFixed(1)}s
        </span>
      </div>
      
      <div className="space-y-1.5 pl-7">
        {steps.slice(0, currentStep + 1).map((step, index) => (
          <div 
            key={index}
            className={`flex items-center gap-2 text-xs transition-opacity ${
              index === currentStep ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            {index < currentStep ? (
              <Check className="h-3 w-3 text-green-500" />
            ) : (
              <div className="h-3 w-3 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            )}
            <span>{step.text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ThinkingSummary({ 
  thinkingTime, 
  steps 
}: { 
  thinkingTime: number
  steps: ThinkingStep[] 
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  return (
    <div className="mb-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <Sparkles className="h-3.5 w-3.5" />
        <span>Pensou por {(thinkingTime / 1000).toFixed(1)} segundos</span>
        {isExpanded ? (
          <ChevronUp className="h-3.5 w-3.5" />
        ) : (
          <ChevronDown className="h-3.5 w-3.5" />
        )}
      </button>
      
      {isExpanded && (
        <div className="mt-2 space-y-1 pl-5 border-l-2 border-muted">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center gap-2 text-xs text-muted-foreground py-0.5">
              <Check className="h-3 w-3 text-green-500 shrink-0" />
              <span>{step.text}</span>
              <span className="text-muted-foreground/60 tabular-nums">
                {(step.duration / 1000).toFixed(1)}s
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function ChatDemo() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [isThinking, setIsThinking] = useState(false)
  const [currentThinkingStep, setCurrentThinkingStep] = useState(0)
  const [thinkingElapsed, setThinkingElapsed] = useState(0)
  const thinkingStartRef = useRef<number>(0)

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

  // Timer para atualizar o tempo decorrido durante thinking
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isThinking) {
      interval = setInterval(() => {
        setThinkingElapsed(Date.now() - thinkingStartRef.current)
      }, 100)
    }
    return () => clearInterval(interval)
  }, [isThinking])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    }

    // Escolhe a resposta com base na pergunta
    const normalized = input.toLowerCase()
    const isTreeQuery =
      normalized.includes("arquivo") ||
      normalized.includes("estrutura") ||
      normalized.includes("pasta") ||
      normalized.includes("projeto") ||
      normalized.includes("árvore") ||
      normalized.includes("arvore") ||
      normalized.includes("tree")
    const responseContent = isTreeQuery ? fileTreeResponse : aiAnalysisResponse

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    setIsThinking(true)
    setCurrentThinkingStep(0)
    setThinkingElapsed(0)
    thinkingStartRef.current = Date.now()

    // Simular os passos de thinking
    let stepIndex = 0
    const runThinkingSteps = () => {
      if (stepIndex < thinkingSteps.length - 1) {
        setTimeout(() => {
          stepIndex++
          setCurrentThinkingStep(stepIndex)
          runThinkingSteps()
        }, thinkingSteps[stepIndex].duration)
      } else {
        // Thinking completo, gerar resposta
        setTimeout(() => {
          const totalThinkingTime = Date.now() - thinkingStartRef.current
          setIsThinking(false)
          
          const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: responseContent,
            thinkingTime: totalThinkingTime,
            thinkingSteps: thinkingSteps,
          }
          setMessages((prev) => [...prev, assistantMessage])
          setIsLoading(false)
        }, thinkingSteps[stepIndex].duration)
      }
    }
    
    runThinkingSteps()
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
                {["Analise as vendas do Q2", "Mostre gráficos de tendência", "Mostre a estrutura de arquivos"].map(
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
                    {message.thinkingTime && message.thinkingSteps && (
                      <ThinkingSummary 
                        thinkingTime={message.thinkingTime} 
                        steps={message.thinkingSteps} 
                      />
                    )}
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
              <Card className="bg-card px-5 py-4 max-w-[90%]">
                {isThinking ? (
                  <ThinkingIndicator 
                    steps={thinkingSteps}
                    currentStep={currentThinkingStep}
                    elapsedTime={thinkingElapsed}
                  />
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
                      <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
                      <div className="h-2 w-2 animate-bounce rounded-full bg-primary" />
                    </div>
                    <span className="text-sm text-muted-foreground">Gerando resposta...</span>
                  </div>
                )}
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
