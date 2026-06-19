"use client"

import {
  Play,
  Search,
  Gauge,
  GitBranch,
  XCircle,
  CheckCircle2,
  Users,
  ArrowDown,
  Check,
  X,
} from "lucide-react"

type Result = "continue" | "deny" | "approve" | "review"

interface Branch {
  answer: string
  outcome?: string
  result: Result
}

interface FlowStep {
  type: "start" | "process" | "decision" | "end"
  label: string
  icon?: string
  result?: Result
  branches?: Branch[]
}

export interface DecisionFlowConfig {
  title?: string
  steps: FlowStep[]
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  start: Play,
  search: Search,
  gauge: Gauge,
  decision: GitBranch,
  users: Users,
}

function getStepIcon(step: FlowStep) {
  if (step.icon && iconMap[step.icon]) return iconMap[step.icon]
  if (step.type === "start") return Play
  if (step.type === "decision") return GitBranch
  if (step.type === "end") return Users
  return Search
}

const resultStyles: Record<
  Exclude<Result, "continue">,
  { wrap: string; icon: React.ComponentType<{ className?: string }>; dot: string }
> = {
  deny: {
    wrap: "border-red-500/40 bg-red-500/10 text-red-500",
    icon: XCircle,
    dot: "bg-red-500",
  },
  approve: {
    wrap: "border-green-500/40 bg-green-500/10 text-green-500",
    icon: CheckCircle2,
    dot: "bg-green-500",
  },
  review: {
    wrap: "border-amber-500/40 bg-amber-500/10 text-amber-500",
    icon: Users,
    dot: "bg-amber-500",
  },
}

function Connector() {
  return (
    <div className="flex justify-center py-1.5" aria-hidden="true">
      <ArrowDown className="h-4 w-4 text-muted-foreground/50" />
    </div>
  )
}

function OutcomeChip({ branch }: { branch: Branch }) {
  const isPositive = branch.answer.toLowerCase() === "sim"
  const styles = branch.result !== "continue" ? resultStyles[branch.result] : null

  return (
    <div className="flex items-center gap-2">
      <span
        className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium ${
          isPositive
            ? "border-border bg-muted text-foreground"
            : "border-border bg-muted text-foreground"
        }`}
      >
        {isPositive ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
        {branch.answer}
      </span>

      {branch.outcome && styles && (
        <>
          <span className="text-muted-foreground">&rarr;</span>
          <span
            className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-semibold ${styles.wrap}`}
          >
            <styles.icon className="h-3 w-3" />
            {branch.outcome}
          </span>
        </>
      )}

      {branch.result === "continue" && (
        <span className="text-xs text-muted-foreground">continua a análise</span>
      )}
    </div>
  )
}

function StepNode({ step }: { step: FlowStep }) {
  const Icon = getStepIcon(step)

  if (step.type === "decision") {
    return (
      <div className="rounded-lg border border-border bg-card px-4 py-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10">
            <Icon className="h-4 w-4 text-primary" />
          </span>
          <span className="text-sm font-semibold text-foreground">{step.label}</span>
        </div>
        <div className="mt-3 ml-9 flex flex-col gap-2 border-l border-dashed border-border pl-4">
          {step.branches?.map((branch, i) => (
            <OutcomeChip key={i} branch={branch} />
          ))}
        </div>
      </div>
    )
  }

  if (step.type === "end" && step.result && step.result !== "continue") {
    const styles = resultStyles[step.result]
    return (
      <div
        className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-3 ${styles.wrap}`}
      >
        <styles.icon className="h-4 w-4" />
        <span className="text-sm font-semibold">{step.label}</span>
      </div>
    )
  }

  // start / process / generic end
  const isStart = step.type === "start"
  return (
    <div
      className={`flex items-center gap-2.5 rounded-lg border px-4 py-3 ${
        isStart ? "border-primary/40 bg-primary/5" : "border-border bg-card"
      }`}
    >
      <span
        className={`flex h-7 w-7 items-center justify-center rounded-md ${
          isStart ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
        }`}
      >
        <Icon className="h-4 w-4" />
      </span>
      <span className="text-sm font-medium text-foreground">{step.label}</span>
    </div>
  )
}

export function DecisionFlow({ config }: { config: DecisionFlowConfig }) {
  return (
    <div className="my-4 overflow-hidden rounded-lg border border-border bg-card/40">
      <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-2">
        <div className="flex items-center gap-2">
          <GitBranch className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-foreground">
            {config.title ?? "Fluxo de Decisão"}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {(["approve", "review", "deny"] as const).map((r) => (
            <span key={r} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className={`h-2 w-2 rounded-full ${resultStyles[r].dot}`} />
              {r === "approve" ? "Aprovado" : r === "review" ? "Análise" : "Negado"}
            </span>
          ))}
        </div>
      </div>

      <div className="p-4">
        {config.steps.map((step, index) => (
          <div key={index}>
            <StepNode step={step} />
            {index < config.steps.length - 1 && <Connector />}
          </div>
        ))}
      </div>
    </div>
  )
}

export function parseFlowConfig(code: string): DecisionFlowConfig | null {
  try {
    const parsed = JSON.parse(code)
    if (parsed.steps && Array.isArray(parsed.steps)) return parsed
    return null
  } catch {
    return null
  }
}
