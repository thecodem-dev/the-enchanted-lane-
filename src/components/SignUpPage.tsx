import { useState, type FormEvent } from 'react'
import { ArrowLeft, Eye, EyeOff } from 'lucide-react'
import heroVideo from '@/assets/landing/enchanted-header-vid2.webm'
import { Logo } from '@/components/ui/Logo'
import { useIsMobile, useIsShort } from '@/hooks/useIsMobile'
import { SignUpError, isValidEmail, signUp } from '@/lib/auth'
import { LANDING_PATH, SIGN_IN_PATH, goToLanding, navigate } from '@/lib/navigation'
import { cn } from '@/lib/utils'

type FieldErrors = { firstName?: string; lastName?: string; email?: string; password?: string }

const inputClass = 'w-full rounded-btn border bg-cream px-4 py-3 text-[15px] text-espresso placeholder:text-espresso/40 transition-colors focus:border-brass'

function validate(firstName: string, lastName: string, email: string, password: string): FieldErrors {
  const errors: FieldErrors = {}
  if (!firstName.trim()) errors.firstName = 'Enter your first name.'
  if (!lastName.trim()) errors.lastName = 'Enter your surname.'
  if (!email.trim()) errors.email = 'Enter your email address.'
  else if (!isValidEmail(email)) errors.email = 'Enter a valid email address.'
  if (password.length < 8) errors.password = 'Use at least 8 characters.'
  return errors
}

export function SignUpPage() {
  const isMobile = useIsMobile() || useIsShort()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const errors = validate(firstName, lastName, email, password)
    setFieldErrors(errors)
    setFormError(null)
    setMessage(null)
    if (Object.keys(errors).length) return

    setPending(true)
    try {
      const result = await signUp(firstName, lastName, email, password)
      if (result.needsEmailConfirmation) {
        navigate(SIGN_IN_PATH, { replace: true })
      } else {
        navigate('/board', { replace: true })
      }
    } catch (error) {
      setFormError(error instanceof SignUpError ? error.message : 'Something went wrong. Please try again.')
    } finally {
      setPending(false)
    }
  }

  return (
    <div className={`landing grid min-h-[100svh] bg-cream text-espresso ${isMobile ? '' : 'md:grid-cols-[1.1fr_1fr]'}`}>
      {!isMobile && (
        <aside className="relative isolate flex flex-col justify-between overflow-hidden bg-espresso p-10 text-cream lg:p-14">
          <video className="absolute inset-0 -z-20 h-full w-full object-cover" src={heroVideo} autoPlay muted loop playsInline aria-hidden="true" />
          <div className="absolute inset-0 -z-10" style={{ background: 'linear-gradient(to top, rgb(62 35 24 / 0.9), rgb(62 35 24 / 0.45))' }} />
          <a href={LANDING_PATH} onClick={goToLanding} className="flex w-fit items-center gap-3" aria-label="The Enchanted Lane, home">
            <Logo className="h-10 w-10 ring-1 ring-brass/50" />
            <span className="text-label tracking-[0.04em]">The Enchanted Line</span>
          </a>
          <div>
            <p className="text-eyebrow flex items-center gap-3 text-tan"><span className="h-px w-8 bg-tan/70" aria-hidden="true" />Your ticket to the line</p>
            <p className="text-hero mt-6 max-w-[12ch]">Keep your journey</p>
          </div>
        </aside>
      )}

      <main className="paper flex flex-col px-5 py-6 md:px-12 md:py-10">
        <div className="flex items-center justify-between">
          <a href={LANDING_PATH} onClick={goToLanding} className="text-label inline-flex min-h-11 items-center gap-2 text-espresso/75 hover:text-espresso">
            <ArrowLeft size={16} strokeWidth={1.5} aria-hidden="true" /> Back to home
          </a>
          {isMobile && <Logo className="h-9 w-9 ring-1 ring-brass/50" />}
        </div>
        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-12">
          <p className="text-eyebrow flex items-center gap-3 text-brass"><span className="h-px w-8 bg-brass/60" aria-hidden="true" />Passenger registration</p>
          <h1 className="mt-4 font-display text-[44px] leading-[1.1] font-normal md:text-[52px]">Claim your ticket</h1>
          <p className="mt-3 text-espresso/75">Create an account to keep your passport and progress with you.</p>
          <form noValidate onSubmit={onSubmit} className="mt-8 flex flex-col gap-4 border-t border-dashed border-brass/45 pt-8">
            <div className="grid grid-cols-2 gap-3">
              <label className="text-label">First name<input value={firstName} onChange={e => setFirstName(e.target.value)} autoComplete="given-name" className={cn(inputClass, 'mt-2', fieldErrors.firstName ? 'border-rust' : 'border-espresso/25')} /></label>
              <label className="text-label">Surname<input value={lastName} onChange={e => setLastName(e.target.value)} autoComplete="family-name" className={cn(inputClass, 'mt-2', fieldErrors.lastName ? 'border-rust' : 'border-espresso/25')} /></label>
            </div>
            <label className="text-label">Email address<input type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" placeholder="name@example.com" className={cn(inputClass, 'mt-2', fieldErrors.email ? 'border-rust' : 'border-espresso/25')} /></label>
            <label className="text-label">Password<div className="relative mt-2"><input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} autoComplete="new-password" className={cn(inputClass, 'pr-12', fieldErrors.password ? 'border-rust' : 'border-espresso/25')} /><button type="button" onClick={() => setShowPassword(value => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'} className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-espresso/60">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></label>
            <div aria-live="polite">{formError && <p role="alert" className="rounded-btn border border-rust/35 bg-rust/[0.06] px-4 py-3 text-[14px] text-rust">{formError}</p>}{message && <p role="status" className="rounded-btn border border-brass/35 bg-brass/[0.06] px-4 py-3 text-[14px] text-brass">{message}</p>}</div>
            <button type="submit" disabled={pending} className="text-label rounded-btn bg-rust px-6 py-3.5 text-cream transition-colors hover:bg-espresso disabled:cursor-wait disabled:opacity-70">{pending ? 'Creating account…' : 'Create account'}</button>
            <button type="button" onClick={() => navigate(SIGN_IN_PATH)} className="text-label rounded-btn border border-espresso/20 px-6 py-3.5 text-espresso hover:border-brass">Already have an account? Sign in</button>
          </form>
        </div>
        <p className="text-[12px] tracking-[0.04em] text-espresso/60">© {new Date().getFullYear()} The Enchanted Lane</p>
      </main>
    </div>
  )
}
