import { useMemo, useState } from 'react'
import { CheckCircle2, Lightbulb, Sparkles, Target } from 'lucide-react'

const questions = [
  {
    prompt: '“Your SBI account will be blocked tonight. Verify via link below immediately.”',
    choices: ['Safe', 'Scam', 'Not sure'],
    correct: 'Scam',
    explanation: 'The sender creates urgency and impersonates a bank, which is a classic phishing pattern. Legitimate institutions do not ask users to verify through a random link.',
  },
  {
    prompt: '“We are running a company survey. Please confirm your details on this form.”',
    choices: ['Safe', 'Scam', 'Not sure'],
    correct: 'Not sure',
    explanation: 'It could be legitimate, but no brand or official contact is provided. SafeGuard AI would recommend checking the organization’s real contact method rather than trusting the message itself.',
  },
  {
    prompt: '“Congratulations! You have won a prize. Pay ₹199 to unlock it.”',
    choices: ['Safe', 'Scam', 'Not sure'],
    correct: 'Scam',
    explanation: 'Prize scams seek a small upfront fee and rely on excitement. Real lotteries do not require payment to claim a win.',
  },
] as const

export function LearnModeScreen() {
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)

  const question = useMemo(() => questions[index], [index])

  const handleNext = () => {
    if (index < questions.length - 1) {
      setIndex((current) => current + 1)
      setSelected(null)
      return
    }
    setIndex(0)
    setSelected(null)
  }

  return (
    <div className="space-y-4">
      <div className="rise-in">
        <div className="label-caps mb-1">security education</div>
        <h2 className="text-xl font-semibold">Learn Mode</h2>
        <p className="mt-1 text-[13px] text-[var(--text-2)]">
          Practice scam spotting before a fraud message reaches your inbox or phone app.
        </p>
      </div>

      <div className="panel rise-in p-4" style={{ animationDelay: '0.05s' }}>
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-[var(--cyan)]" />
            <span className="font-mono2 text-[11px] tracking-[0.18em] text-[var(--cyan)]">CASE {index + 1}/{questions.length}</span>
          </div>
          <span className="rounded-full border border-[var(--border)] px-2 py-1 font-mono2 text-[9px] text-[var(--text-2)]">SCAM SPOTTER</span>
        </div>

        <p className="text-[17px] font-medium leading-relaxed text-[var(--text-1)]">{question.prompt}</p>

        <div className="mt-4 space-y-2">
          {question.choices.map((choice) => {
            const correct = choice === question.correct
            const active = selected === choice

            return (
              <button
                key={choice}
                onClick={() => setSelected(choice)}
                className={`flex w-full items-center justify-between rounded-lg border p-3 text-left transition-colors ${
                  selected !== null && correct
                    ? 'border-[var(--mint)] bg-[var(--mint)]/10 text-[var(--text-1)]'
                    : active
                      ? 'border-[var(--amber)] bg-[var(--amber)]/10 text-[var(--text-1)]'
                      : 'border-[var(--border)] text-[var(--text-2)] hover:border-[var(--cyan)]'
                }`}
              >
                <span className="font-mono2 text-[11px] tracking-[0.14em]">{choice}</span>
                {selected !== null && correct && <CheckCircle2 className="h-4 w-4 text-[var(--mint)]" />}
              </button>
            )
          })}
        </div>

        {selected && (
          <div className="mt-4 rounded-lg border border-[var(--border)] bg-black/20 p-3">
            <div className="mb-2 flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-[var(--amber)]" />
              <span className="font-mono2 text-[10px] font-bold tracking-[0.18em] text-[var(--amber)]">EXPLANATION</span>
            </div>
            <p className="text-[13px] text-[var(--text-2)]">{question.explanation}</p>
            <div className="mt-3 flex items-center gap-2 text-[12px] text-[var(--text-1)]">
              <Sparkles className="h-4 w-4 text-[var(--cyan)]" />
              <span>Correct answer: {question.correct}</span>
            </div>
          </div>
        )}

        <button
          onClick={handleNext}
          className="mt-4 flex min-h-[48px] w-full items-center justify-center rounded-xl bg-[var(--cyan)] font-mono2 text-[12px] font-bold tracking-[0.14em] text-[#04121a]"
        >
          {index === questions.length - 1 ? 'RESET LESSON' : 'NEXT CASE'}
        </button>
      </div>
    </div>
  )
}
