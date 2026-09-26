import { useState, useCallback } from 'react'
import { STATIONS } from '@/data/stations'
import { QUIZ_QUESTIONS, MAX_QUIZ_QUESTIONS } from '@/data/quiz'
import { useIsMobile } from '@/hooks/useIsMobile'
import { V, S, T, A, D, R, DISPLAY, SANS, MONO } from '@/styles/tokens'
import type { Language } from '@/types'

interface QuizPanelProps {
  awoken: Set<string>
  lang: Language
}

type AnswerState = 'unanswered' | 'correct' | 'wrong'

interface QuestionResult {
  questionId: string
  chosen: number
  correct: boolean
}

/** Station order index used to sort questions by route position */
const STATION_ORDER = STATIONS.reduce<Record<string, number>>((acc, s, i) => {
  acc[s.id] = i
  return acc
}, {})

/** Build the active question set: only awoken stations, capped at MAX_QUIZ_QUESTIONS */
function buildQuestions(awoken: Set<string>) {
  return QUIZ_QUESTIONS
    .filter(q => awoken.has(q.stationId))
    .sort((a, b) => (STATION_ORDER[a.stationId] ?? 0) - (STATION_ORDER[b.stationId] ?? 0))
    .slice(0, MAX_QUIZ_QUESTIONS)
}

const MIN_STATIONS = 1

const CORRECT = '#4E6B45' // the palette's olive (also the 'nature' category hue)

/** Page body: main column + a 320px aside (stacked on phones), matching the other sidebar pages' padding */
function twoColumn(isMobile: boolean): React.CSSProperties {
  return isMobile
    ? { padding: '20px 16px 32px', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 24 }
    : { padding: '28px 36px 56px', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 320px', gap: 32, alignItems: 'start' }
}

/**
 * One row per question: its station and how it went. `currentIdx` marks the
 * question in progress; pass -1 once the quiz is finished.
 */
function QuestionList({
  title,
  questions,
  results,
  currentIdx,
}: {
  title: string
  questions: ReturnType<typeof buildQuestions>
  results: QuestionResult[]
  currentIdx: number
}) {
  const isMobile = useIsMobile()
  const correctSoFar = results.filter(r => r.correct).length
  return (
    <aside style={{ background: S, borderRadius: 6, padding: '22px 22px 18px', position: isMobile ? 'static' : 'sticky', top: 24, alignSelf: 'start' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
        <h3 style={{ fontFamily: DISPLAY, fontSize: 26, fontWeight: 400, color: T, margin: 0, lineHeight: 1 }}>{title}</h3>
        <span style={{ fontFamily: MONO, fontSize: 10, fontWeight: 500, letterSpacing: '0.08em', color: D }}>
          {correctSoFar} / {results.length} correct
        </span>
      </div>
      <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column' }}>
        {questions.map((q, i) => {
          const result = results.find(r => r.questionId === q.id)
          const isCurrent = i === currentIdx && !result
          const station = STATIONS.find(s => s.id === q.stationId)
          const status = result ? (result.correct ? 'Correct' : 'Missed') : isCurrent ? 'Now' : 'To come'
          const colour = result ? (result.correct ? CORRECT : R) : isCurrent ? A : D
          return (
            <li key={q.id} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '9px 0',
              borderTop: i === 0 ? 'none' : '1px solid rgba(145,112,67,0.18)',
              opacity: result || isCurrent ? 1 : 0.6,
            }}>
              <span aria-hidden="true" style={{
                width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: `1px solid ${colour}`, background: result ? colour : 'transparent',
                color: V, fontSize: 11, lineHeight: 1,
              }}>
                {result ? (result.correct ? '✓' : '✕') : isCurrent ? <span style={{ width: 6, height: 6, borderRadius: '50%', background: A }} /> : null}
              </span>
              <span style={{ flex: 1, minWidth: 0, fontFamily: SANS, fontSize: 13, color: T, fontWeight: isCurrent ? 600 : 400, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {i + 1}. {station?.name ?? ''}
              </span>
              <span style={{ fontFamily: MONO, fontSize: 8, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: colour }}>
                {status}
              </span>
            </li>
          )
        })}
      </ol>
    </aside>
  )
}

/* ─── Locked screen ───────────────────────────────────────────── */
function LockedScreen({ awoken }: { awoken: Set<string> }) {
  const remaining = MIN_STATIONS - awoken.size
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '56px 16px',
      textAlign: 'center',
    }}>
      {/* Lock icon */}
      <div style={{
        width: 72, height: 72, borderRadius: '50%',
        background: `rgba(145,112,67,0.1)`,
        border: `1px solid rgba(145,112,67,0.3)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 24,
      }}>
        <svg width="28" height="32" viewBox="0 0 28 32" fill="none" aria-hidden="true">
          <rect x="3" y="14" width="22" height="16" rx="3" stroke={A} strokeWidth="1.8" />
          <path d="M8 14v-5a6 6 0 0 1 12 0v5" stroke={A} strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="14" cy="22" r="2.5" fill={A} />
          <line x1="14" y1="24.5" x2="14" y2="27" stroke={A} strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </div>

      <h2 style={{
        fontFamily: DISPLAY, fontSize: 28, fontWeight: 400,
        color: T, marginBottom: 12, lineHeight: 1.15,
      }}>
        Quiz Locked
      </h2>

      {/* Progress pip track */}
      <div style={{
        display: 'flex', gap: 8, marginBottom: 20, alignItems: 'center',
      }}>
        {Array.from({ length: MIN_STATIONS }).map((_, i) => (
          <div key={i} style={{
            width: 10, height: 10,
            borderRadius: '50%',
            background: i < awoken.size ? A : `rgba(145,112,67,0.2)`,
            border: `1px solid ${i < awoken.size ? A : `rgba(145,112,67,0.35)`}`,
            transition: 'background 0.3s',
          }} />
        ))}
      </div>

      <p style={{
        fontFamily: SANS, fontSize: 14, color: D,
        lineHeight: 1.65, maxWidth: 320,
      }}>
        Visit{' '}
        <span style={{ color: T, fontWeight: 600 }}>
          {remaining} more {remaining === 1 ? 'station' : 'stations'}
        </span>{' '}
        to unlock the quiz. Knowledge is earned on the journey, not before it.
      </p>

      {/* Decorative rule */}
      <div style={{
        marginTop: 32, display: 'flex', alignItems: 'center', gap: 10, width: '100%', maxWidth: 280,
      }}>
        <div style={{ flex: 1, height: 1, background: `rgba(145,112,67,0.25)` }} />
        <svg width="6" height="6" viewBox="0 0 6 6" aria-hidden="true">
          <rect x="0" y="0" width="6" height="6" fill={A} opacity="0.5" transform="rotate(45 3 3)" />
        </svg>
        <div style={{ flex: 1, height: 1, background: `rgba(145,112,67,0.25)` }} />
      </div>
    </div>
  )
}

/* ─── Results screen ──────────────────────────────────────────── */
function ResultsScreen({
  questions,
  results,
  total,
  onRetry,
}: {
  questions: ReturnType<typeof buildQuestions>
  results: QuestionResult[]
  total: number
  onRetry: () => void
}) {
  const isMobile = useIsMobile()
  const score = results.filter(r => r.correct).length
  const pct = Math.round((score / total) * 100)

  const grade =
    pct >= 90 ? { label: 'Exceptional', color: A } :
    pct >= 70 ? { label: 'Commendable', color: CORRECT } :
    pct >= 50 ? { label: 'Adequate', color: D } :
                { label: 'Keep Travelling', color: R }

  return (
    <div style={twoColumn(isMobile)}>
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        background: S, borderRadius: 6, padding: isMobile ? '36px 20px' : '48px 32px', textAlign: 'center',
        animation: 'introFadeUp 0.35s ease-out both',
      }}>
        {/* Score ring */}
        <div style={{ position: 'relative', width: 96, height: 96, marginBottom: 24 }}>
          <svg width="96" height="96" viewBox="0 0 96 96" aria-hidden="true">
            <circle cx="48" cy="48" r="40" fill="none" stroke="rgba(145,112,67,0.15)" strokeWidth="6" />
            <circle
              cx="48" cy="48" r="40"
              fill="none"
              stroke={grade.color}
              strokeWidth="6"
              strokeDasharray={`${2 * Math.PI * 40}`}
              strokeDashoffset={`${2 * Math.PI * 40 * (1 - score / total)}`}
              strokeLinecap="round"
              transform="rotate(-90 48 48)"
              style={{ transition: 'stroke-dashoffset 0.8s ease' }}
            />
          </svg>
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontFamily: DISPLAY, fontSize: 26, color: T, lineHeight: 1 }}>{score}</span>
            <span style={{ fontFamily: MONO, fontSize: 9, color: D, letterSpacing: '0.08em' }}>/ {total}</span>
          </div>
        </div>

        <div style={{
          fontFamily: MONO, fontSize: 10, fontWeight: 500,
          letterSpacing: '0.14em', textTransform: 'uppercase',
          color: grade.color, marginBottom: 8,
        }}>
          {grade.label}
        </div>

        <h2 style={{
          fontFamily: DISPLAY, fontSize: 28, fontWeight: 400,
          color: T, marginBottom: 8, lineHeight: 1.15,
        }}>
          {score} / {total} Correct
        </h2>

        <p style={{ fontFamily: SANS, fontSize: 13, color: D, marginBottom: 32, lineHeight: 1.6 }}>
          {pct}% — {pct >= 70
            ? 'Your knowledge of the route is worthy of a seasoned conductor.'
            : 'Every journey teaches something new. The route awaits.'}
        </p>

        <button
          onClick={onRetry}
          style={{
            background: R, color: V,
            border: 'none', borderRadius: 4,
            padding: '10px 28px',
            fontFamily: MONO, fontSize: 10, fontWeight: 500,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            cursor: 'pointer', transition: 'background 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = T }}
          onMouseLeave={e => { e.currentTarget.style.background = R }}
        >
          Retake Quiz
        </button>
      </div>
      <QuestionList title="Your answers" questions={questions} results={results} currentIdx={-1} />
    </div>
  )
}

/* ─── Main QuizPanel ──────────────────────────────────────────── */
export function QuizPanel({ awoken, lang: _lang }: QuizPanelProps) {
  const isMobile = useIsMobile()
  const isLocked = awoken.size < MIN_STATIONS

  const questions = buildQuestions(awoken)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [chosen, setChosen] = useState<number | null>(null)
  const [answerState, setAnswerState] = useState<AnswerState>('unanswered')
  const [results, setResults] = useState<QuestionResult[]>([])
  const [finished, setFinished] = useState(false)

  const currentQuestion = questions[currentIdx]

  const handleAnswer = useCallback((optionIdx: number) => {
    if (answerState !== 'unanswered' || !currentQuestion) return
    const correct = optionIdx === currentQuestion.correctIndex
    setChosen(optionIdx)
    setAnswerState(correct ? 'correct' : 'wrong')
    setResults(prev => [...prev, { questionId: currentQuestion.id, chosen: optionIdx, correct }])
  }, [answerState, currentQuestion])

  const handleNext = useCallback(() => {
    if (currentIdx + 1 >= questions.length) {
      setFinished(true)
    } else {
      setCurrentIdx(i => i + 1)
      setChosen(null)
      setAnswerState('unanswered')
    }
  }, [currentIdx, questions.length])

  const handleRetry = useCallback(() => {
    setCurrentIdx(0)
    setChosen(null)
    setAnswerState('unanswered')
    setResults([])
    setFinished(false)
  }, [])

  if (isLocked) return <LockedScreen awoken={awoken} />

  if (finished) {
    return (
      <ResultsScreen
        questions={questions}
        results={results}
        total={questions.length}
        onRetry={handleRetry}
      />
    )
  }

  if (!currentQuestion) return null

  const stationName = STATIONS.find(s => s.id === currentQuestion.stationId)?.name ?? ''
  const progress = ((currentIdx) / questions.length) * 100

  return (
    <div style={twoColumn(isMobile)}>
      <div style={{ animation: 'chapterSlideIn 0.45s ease-out both' }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16,
          }}>
            <span style={{
              fontFamily: MONO, fontSize: 9, fontWeight: 500,
              letterSpacing: '0.14em', textTransform: 'uppercase', color: D,
            }}>
              Question
            </span>
            <div style={{ flex: 1, height: 1, background: `rgba(145,112,67,0.2)` }} />
            <span style={{
              fontFamily: MONO, fontSize: 9, fontWeight: 500,
              letterSpacing: '0.08em', color: D,
            }}>
              {currentIdx + 1} / {questions.length}
            </span>
          </div>

          {/* Progress bar */}
          <div style={{
            height: 2, background: 'rgba(145,112,67,0.15)', borderRadius: 1, overflow: 'hidden',
          }}>
            <div style={{
              height: '100%', borderRadius: 1,
              background: A,
              width: `${progress}%`,
              transition: 'width 0.4s ease',
            }} />
          </div>
        </div>

        {/* Station eyebrow */}
        <div style={{
          fontFamily: MONO, fontSize: 9, fontWeight: 500,
          letterSpacing: '0.14em', textTransform: 'uppercase',
          color: R, marginBottom: 10,
        }}>
          {stationName}
        </div>

        {/* Question */}
        <h2 style={{
          fontFamily: DISPLAY, fontSize: isMobile ? 26 : 30, fontWeight: 400,
          color: T, lineHeight: 1.15, marginBottom: 28,
        }}>
          {currentQuestion.question}
        </h2>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
          {currentQuestion.options.map((option, idx) => {
            const isChosen = chosen === idx
            const isCorrect = idx === currentQuestion.correctIndex
            const revealed = answerState !== 'unanswered'

            let bg: string = V
            let border: string = `rgba(145,112,67,0.3)`
            let textColor: string = T
            let cursor = 'pointer'

            if (revealed) {
              cursor = 'default'
              if (isCorrect) {
                bg = 'rgba(78,107,69,0.12)'
                border = CORRECT
                textColor = CORRECT
              } else if (isChosen && !isCorrect) {
                bg = 'rgba(136,82,61,0.1)'
                border = R
                textColor = R
              } else {
                bg = V
                border = `rgba(145,112,67,0.15)`
                textColor = D
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                disabled={revealed}
                aria-pressed={isChosen}
                style={{
                  width: '100%', textAlign: 'left',
                  background: bg,
                  border: `1px solid ${border}`,
                  borderRadius: 6, padding: '13px 16px',
                  cursor,
                  display: 'flex', alignItems: 'center', gap: 12,
                  transition: 'background 0.15s, border-color 0.15s',
                  outline: 'none',
                }}
                onMouseEnter={e => {
                  if (!revealed) e.currentTarget.style.background = S
                }}
                onMouseLeave={e => {
                  if (!revealed) e.currentTarget.style.background = V
                }}
              >
                {/* Option letter */}
                <span style={{
                  width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                  border: `1px solid ${revealed ? border : `rgba(145,112,67,0.35)`}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: MONO, fontSize: 9, fontWeight: 600,
                  letterSpacing: '0.06em',
                  color: revealed ? (isCorrect ? CORRECT : isChosen ? R : D) : D,
                  background: revealed && isCorrect ? 'rgba(78,107,69,0.15)' : 'transparent',
                }}>
                  {String.fromCharCode(65 + idx)}
                </span>
                <span style={{
                  fontFamily: SANS, fontSize: 14, color: textColor, lineHeight: 1.4, flex: 1,
                }}>
                  {option}
                </span>
                {/* Tick / cross indicator */}
                {revealed && isCorrect && (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <circle cx="8" cy="8" r="7" fill="rgba(78,107,69,0.2)" />
                    <path d="M4.5 8l2.5 2.5 4.5-4.5" stroke="#4E6B45" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
                {revealed && isChosen && !isCorrect && (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <circle cx="8" cy="8" r="7" fill="rgba(136,82,61,0.15)" />
                    <path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke={R} strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                )}
              </button>
            )
          })}
        </div>

        {/* Explanation — shown after answering */}
        {answerState !== 'unanswered' && (
          <div style={{
            background: `rgba(145,112,67,0.07)`,
            border: `1px solid rgba(145,112,67,0.22)`,
            borderRadius: 6, padding: '14px 16px',
            marginBottom: 24,
            animation: 'introFadeUp 0.35s ease-out both',
          }}>
            <div style={{
              fontFamily: MONO, fontSize: 9, fontWeight: 500,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              color: A, marginBottom: 6,
            }}>
              {answerState === 'correct' ? 'Correct' : 'Not quite'}
            </div>
            <p style={{ fontFamily: SANS, fontSize: 13, color: T, lineHeight: 1.65, margin: 0 }}>
              {currentQuestion.explanation}
            </p>
          </div>
        )}

        {/* Next / Finish button */}
        {answerState !== 'unanswered' && (
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={handleNext}
              style={{
                background: R, color: V,
                border: 'none', borderRadius: 4,
                padding: '10px 24px',
                fontFamily: MONO, fontSize: 10, fontWeight: 500,
                letterSpacing: '0.12em', textTransform: 'uppercase',
                cursor: 'pointer', transition: 'background 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = T }}
              onMouseLeave={e => { e.currentTarget.style.background = R }}
            >
              {currentIdx + 1 >= questions.length ? 'See Results →' : 'Next Question →'}
            </button>
          </div>
        )}
      </div>
      <QuestionList title="Your progress" questions={questions} results={results} currentIdx={currentIdx} />
    </div>
  )
}
