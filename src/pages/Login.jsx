import { useRef, useState } from 'react'
import { Navigate, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

function validate(mode, fields) {
  const errors = {}
  if (mode === 'signup' && !fields.name.trim()) errors.name = 'Full name is required.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())) {
    errors.email = 'Enter a valid email address.'
  }
  if (fields.password.length < 8) errors.password = 'Password must be at least 8 characters.'
  if (mode === 'signup' && fields.confirmPassword !== fields.password) {
    errors.confirmPassword = 'Passwords do not match.'
  }
  return errors
}

function Field({ id, label, type = 'text', error, onBlur, action, ...inputProps }) {
  const inputType = type
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-forest">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={inputType}
          onBlur={onBlur}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-forest outline-none transition-colors focus:ring-2 focus:ring-forest/30 ${
            action ? 'pr-12' : ''
          } ${error ? 'border-terracotta' : 'border-forest/20 hover:border-forest/40'}`}
          {...inputProps}
        />
        {action}
      </div>
      {error && (
        <p id={`${id}-error`} className="text-xs text-walnut" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

function PasswordField({ id, label, visible, onToggle, error, onBlur, ...props }) {
  return (
    <Field
      id={id}
      label={label}
      type={visible ? 'text' : 'password'}
      error={error}
      onBlur={onBlur}
      autoComplete={id.includes('confirm') ? 'new-password' : undefined}
      action={(
        <button
          type="button"
          onClick={onToggle}
          aria-label={visible ? 'Hide password' : 'Show password'}
          className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-forest/70 hover:text-forest cursor-pointer btn-minor"
        >
          {visible ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
        </button>
      )}
      {...props}
    />
  )
}

export default function Login() {
  const { user, login, signup } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [mode, setMode] = useState('login')
  const [fields, setFields] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [remember, setRemember] = useState(false)
  const [touched, setTouched] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [serverError, setServerError] = useState('')
  const [forgotOpen, setForgotOpen] = useState(false)
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [confirmVisible, setConfirmVisible] = useState(false)
  const [heroImageFailed, setHeroImageFailed] = useState(false)
  const loginTabRef = useRef(null)
  const signupTabRef = useRef(null)

  if (user) return <Navigate to="/" replace />

  const validationErrors = validate(mode, fields)
  const showError = (field) => {
    if (!submitted && !touched[field]) return ''
    if (validationErrors[field]) return validationErrors[field]
    if (mode === 'login' && field === 'password') return serverError
    if (mode === 'signup' && field === 'email') return serverError
    return ''
  }

  const changeField = (field) => (event) => {
    setFields((previous) => ({ ...previous, [field]: event.target.value }))
    setServerError('')
  }

  const blurField = (field) => () => setTouched((previous) => ({ ...previous, [field]: true }))

  const changeMode = (nextMode) => {
    setMode(nextMode)
    setTouched({})
    setSubmitted(false)
    setServerError('')
    setForgotOpen(false)
  }

  const onTabKeyDown = (event) => {
    let nextMode
    if (event.key === 'ArrowRight') nextMode = mode === 'login' ? 'signup' : 'login'
    if (event.key === 'ArrowLeft') nextMode = mode === 'login' ? 'signup' : 'login'
    if (event.key === 'Home') nextMode = 'login'
    if (event.key === 'End') nextMode = 'signup'
    if (!nextMode) return
    event.preventDefault()
    changeMode(nextMode)
    const targetTabRef = nextMode === 'login' ? loginTabRef : signupTabRef
    targetTabRef.current?.focus()
  }

  const focusFirstError = (errors) => {
    const order = mode === 'signup'
      ? ['name', 'email', 'password', 'confirmPassword']
      : ['email', 'password']
    const first = order.find((field) => errors[field])
    if (first) document.getElementById(`${mode}-${first}`)?.focus()
  }

  const destination = () => {
    const stateFrom = location.state?.from
    const next = typeof stateFrom === 'string'
      ? stateFrom
      : stateFrom?.pathname || searchParams.get('next') || '/'
    return next.startsWith('/') && !next.startsWith('//') ? next : '/'
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitted(true)
    setServerError('')
    const errors = validate(mode, fields)
    if (Object.keys(errors).length) {
      focusFirstError(errors)
      return
    }

    try {
      if (mode === 'login') {
        await login(fields.email, fields.password, remember)
      } else {
        await signup(fields.name, fields.email, fields.password, remember)
      }
      navigate(destination(), { replace: true })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to sign in. Please try again.'
      setServerError(message)
      const field = mode === 'login' ? 'password' : 'email'
      requestAnimationFrame(() => document.getElementById(`${mode}-${field}`)?.focus())
    }
  }

  const notice = location.state?.notice

  return (
    <div className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-8 px-6 py-8">
      <section
        className="relative min-h-[640px] overflow-hidden rounded-3xl bg-sage"
        aria-label="EcoMart welcome"
      >
        {!heroImageFailed && (
          <img
            src="/images/hero.png"
            alt=""
            aria-hidden="true"
            onError={() => setHeroImageFailed(true)}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-[rgba(20,19,15,0.45)]" />
        <div className="absolute inset-x-0 bottom-0 z-10 p-10 lg:p-14">
          <h1 className="font-heading text-4xl font-semibold leading-tight text-cream lg:text-5xl">
            Every swap counts.
          </h1>
        </div>
      </section>

      <section className="login-form-card flex items-center justify-center rounded-3xl border border-forest/10 bg-cream p-8 shadow-sm lg:p-12">
        <div className="w-full max-w-md">
          <div className="mb-7 grid grid-cols-2 rounded-full border border-forest/15 bg-white/70 p-1" role="tablist" aria-label="Account access">
            <button
              ref={loginTabRef}
              id="login-tab"
              type="button"
              role="tab"
              aria-selected={mode === 'login'}
              aria-controls="account-form-panel"
              tabIndex={mode === 'login' ? 0 : -1}
              onClick={() => changeMode('login')}
              onKeyDown={onTabKeyDown}
              className={`rounded-full px-4 py-2.5 text-sm font-semibold transition-colors cursor-pointer ${mode === 'login' ? 'bg-forest text-cream' : 'text-forest hover:bg-sage'}`}
            >
              Log in
            </button>
            <button
              ref={signupTabRef}
              id="signup-tab"
              type="button"
              role="tab"
              aria-selected={mode === 'signup'}
              aria-controls="account-form-panel"
              tabIndex={mode === 'signup' ? 0 : -1}
              onClick={() => changeMode('signup')}
              onKeyDown={onTabKeyDown}
              className={`rounded-full px-4 py-2.5 text-sm font-semibold transition-colors cursor-pointer ${mode === 'signup' ? 'bg-forest text-cream' : 'text-forest hover:bg-sage'}`}
            >
              Sign up
            </button>
          </div>

          <div
            id="account-form-panel"
            role="tabpanel"
            aria-labelledby={mode === 'login' ? 'login-tab' : 'signup-tab'}
          >
            {notice && (
              <p className="notice-panel mb-5 rounded-xl px-4 py-3 text-sm" role="status">
                {notice}
              </p>
            )}

            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
              {mode === 'signup' && (
                <Field
                  id="signup-name"
                  label="Full name"
                  value={fields.name}
                  onChange={changeField('name')}
                  onBlur={blurField('name')}
                  error={showError('name')}
                  autoComplete="name"
                />
              )}

              <Field
                id={`${mode}-email`}
                label="Email"
                type="email"
                value={fields.email}
                onChange={changeField('email')}
                onBlur={blurField('email')}
                error={showError('email')}
                autoComplete="email"
              />

              <PasswordField
                id={`${mode}-password`}
                label="Password"
                value={fields.password}
                onChange={changeField('password')}
                onBlur={blurField('password')}
                error={showError('password')}
                visible={passwordVisible}
                onToggle={() => setPasswordVisible((visible) => !visible)}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              />

              {mode === 'signup' && (
                <PasswordField
                  id="signup-confirmPassword"
                  label="Confirm password"
                  value={fields.confirmPassword}
                  onChange={changeField('confirmPassword')}
                  onBlur={blurField('confirmPassword')}
                  error={showError('confirmPassword')}
                  visible={confirmVisible}
                  onToggle={() => setConfirmVisible((visible) => !visible)}
                />
              )}

              <label className="flex items-center gap-2 text-sm text-forest">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(event) => setRemember(event.target.checked)}
                  className="h-4 w-4 accent-forest"
                />
                Remember me
              </label>

              {mode === 'login' && (
                <div>
                  <button
                    type="button"
                    onClick={() => setForgotOpen((open) => !open)}
                    className="text-sm font-medium text-walnut underline underline-offset-2 hover:text-forest cursor-pointer btn-minor"
                  >
                    Forgot password?
                  </button>
                  {forgotOpen && (
                    <p className="mt-2 text-sm text-forest" role="status">
                      Password reset is not available in this demo.
                    </p>
                  )}
                </div>
              )}

              <button
                type="submit"
                className="mt-1 w-full rounded-full bg-forest px-5 py-3.5 text-sm font-semibold text-cream transition-colors hover:bg-forest/90 cursor-pointer btn-major"
              >
                {mode === 'login' ? 'Log in' : 'Create account'}
              </button>
            </form>

            <p className="mt-5 text-center text-xs leading-relaxed text-charcoal/70">
              Demo account, saved only in this browser. Please don't use a real password.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
