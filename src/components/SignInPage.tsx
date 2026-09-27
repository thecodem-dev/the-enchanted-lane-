import { useState, type FormEvent } from 'react'
import { ArrowLeft, Eye, EyeOff } from 'lucide-react'
import heroVideo from '@/assets/landing/enchanted-header-vid2.webm'
import { Logo } from '@/components/ui/Logo'
import { useIsMobile, useIsShort } from '@/hooks/useIsMobile'
import { SignInError, isValidEmail, signIn } from '@/lib/auth'
import { BOARD_PATH, LANDING_PATH, goToLanding, navigate } from '@/lib/navigation'
import { cn } from '@/lib/utils'

type FieldErrors = { email?: string; password?: string }

function validate(email: string, password: string): FieldErrors {
  const errors: FieldErrors = {}
  if (!email.trim()) errors.email = 'Enter your email address.'
  else if (!isValidEmail(email)) errors.email = 'Enter a valid email address, like name@example.com.'
  if (!password) errors.password = 'Enter your password.'
  return errors
}

const inputClass =
  'w-full rounded-btn border bg-cream px-4 py-3 text-[15px] text-espresso placeholder:text-espresso/40 transition-colors focus:border-brass'

/**
 * SignInPage — passengers sign in before boarding. Sign-in only: there is no
 * self-service registration. Styled as part of the landing page, whose hero
 * footage fills the left half on larger screens.
 */
export function SignInPage() {
  const isShort = useIsShort()
  // Phones, and phones held sideways, get the form alone
  const isMobile = useIsMobile() || isShort
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const errors = validate(email, password)
    setFieldErrors(errors)
    setFormError(null)
    if (errors.email || errors.password) return

    setPending(true)
    try {
      await signIn(email, password)
      // Replace /sign-in so Back from the journey returns to the landing page.
      navigate(BOARD_PATH, { replace: true })
    } catch (err) {
      setFormError(err instanceof SignInError ? err.message : 'Something went wrong. Please try again in a moment.')
      setPending(false)
    }
  }

  return (
    <div className={`landing grid min-h-[100svh] bg-cream text-espresso ${isMobile ? '' : 'md:grid-cols-[1.1fr_1fr]'}`}>
      {/* ── Left: the hero footage, continuing the landing page ── */}
      {!isMobile && (
        <aside className="relative isolate flex flex-col justify-between overflow-hidden bg-espresso p-10 text-cream lg:p-14">
          <video
            className="absolute inset-0 -z-20 h-full w-full object-cover"
            src={heroVideo}
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 -z-10"
            style={{
              background:
                'linear-gradient(to top, rgb(62 35 24 / 0.9) 0%, rgb(62 35 24 / 0.5) 50%, rgb(62 35 24 / 0.4) 100%)',
            }}
          />

          <a href={LANDING_PATH} onClick={goToLanding} className="flex w-fit items-center gap-3" aria-label="The Enchanted Lane, home">
            <Logo className="h-10 w-10 ring-1 ring-brass/50" />
            <span className="text-label tracking-[0.04em]">The Enchanted Lane</span>
          </a>

          <div>
            <p className="text-eyebrow flex items-center gap-3 text-tan">
              <span className="h-px w-8 bg-tan/70" aria-hidden="true" />
              Pretoria to Cape Town · Nine stations
            </p>
            <p className="text-hero mt-6 max-w-[12ch]">Your seat is waiting</p>
          </div>
        </aside>
      )}

      {/* ── Right: the form ── */}
      <main className="paper flex flex-col px-5 py-6 md:px-12 md:py-10">
        <div className="flex items-center justify-between">
          <a
            href={LANDING_PATH}
            onClick={goToLanding}
            className="text-label inline-flex min-h-11 items-center gap-2 text-espresso/75 underline-offset-[6px] decoration-brass hover:text-espresso hover:underline"
          >
            <ArrowLeft size={16} strokeWidth={1.5} aria-hidden="true" />
            Back to home
          </a>
          {isMobile && <Logo className="h-9 w-9 ring-1 ring-brass/50" />}
        </div>

        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-12">
          <p className="text-eyebrow flex items-center gap-3 text-brass">
            <span className="h-px w-8 bg-brass/60" aria-hidden="true" />
            Passenger sign-in
          </p>
          <h1 className="mt-4 font-display text-[44px] leading-[1.1] font-normal md:text-[52px]">Welcome aboard</h1>
          <p className="mt-3 text-espresso/75">Sign in to continue your journey.</p>

          <form noValidate onSubmit={onSubmit} className="mt-8 flex flex-col gap-5 border-t border-dashed border-brass/45 pt-8">
            <div>
              <label htmlFor="email" className="text-label mb-2 block">
                Email address
              </label>
              <input
                id="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@example.com"
                aria-invalid={fieldErrors.email ? true : undefined}
                aria-describedby={fieldErrors.email ? 'email-error' : undefined}
                className={cn(inputClass, fieldErrors.email ? 'border-rust' : 'border-espresso/25')}
              />
              {fieldErrors.email && (
                <p id="email-error" className="mt-2 text-[13px] text-rust">
                  {fieldErrors.email}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="text-label mb-2 block">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  aria-invalid={fieldErrors.password ? true : undefined}
                  aria-describedby={fieldErrors.password ? 'password-error' : undefined}
                  className={cn(inputClass, 'pr-12', fieldErrors.password ? 'border-rust' : 'border-espresso/25')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                  className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-espresso/60 hover:text-espresso"
                >
                  {showPassword ? <EyeOff size={18} strokeWidth={1.5} /> : <Eye size={18} strokeWidth={1.5} />}
                </button>
              </div>
              {fieldErrors.password && (
                <p id="password-error" className="mt-2 text-[13px] text-rust">
                  {fieldErrors.password}
                </p>
              )}
            </div>

            <div aria-live="polite">
              {formError && (
                <p role="alert" className="rounded-btn border border-rust/35 bg-rust/[0.06] px-4 py-3 text-[14px] text-rust">
                  {formError}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={pending}
              className="text-label rounded-btn bg-rust px-6 py-3.5 text-cream transition-colors hover:bg-espresso disabled:cursor-wait disabled:opacity-70"
            >
              {pending ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-[12px] tracking-[0.04em] text-espresso/60">© {new Date().getFullYear()} The Enchanted Lane</p>
      </main>
    </div>
  )
}
