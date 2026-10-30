import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)
const USERS_KEY = 'ecomart_users'
const SESSION_KEY = 'ecomart_session'

function readStorage(storageName, key) {
  try {
    if (typeof window === 'undefined') return null
    return window[storageName].getItem(key)
  } catch {
    return null
  }
}

function writeStorage(storageName, key, value) {
  try {
    if (typeof window === 'undefined') return
    window[storageName].setItem(key, value)
  } catch {
    // Storage can be unavailable; keep the current session in memory.
  }
}

function removeStorage(storageName, key) {
  try {
    if (typeof window === 'undefined') return
    window[storageName].removeItem(key)
  } catch {
    // Storage can be unavailable.
  }
}

function loadUsers() {
  try {
    const parsed = JSON.parse(readStorage('localStorage', USERS_KEY) || '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function parseSession(raw) {
  try {
    const value = JSON.parse(raw || 'null')
    if (typeof value?.name !== 'string' || typeof value?.email !== 'string') return null
    return { name: value.name, email: value.email }
  } catch {
    return null
  }
}

function loadSession() {
  return (
    parseSession(readStorage('localStorage', SESSION_KEY)) ||
    parseSession(readStorage('sessionStorage', SESSION_KEY))
  )
}

function bytesToHex(bytes) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

async function hashPassword(salt, password) {
  if (!globalThis.crypto?.subtle) {
    throw new Error('Secure password hashing is not available in this browser.')
  }
  const data = new TextEncoder().encode(salt + password)
  const digest = await globalThis.crypto.subtle.digest('SHA-256', data)
  return bytesToHex(new Uint8Array(digest))
}

function createSalt() {
  if (!globalThis.crypto?.getRandomValues) {
    throw new Error('Secure password hashing is not available in this browser.')
  }
  return bytesToHex(globalThis.crypto.getRandomValues(new Uint8Array(16)))
}

function saveSession(user, remember) {
  const serialized = JSON.stringify(user)
  const destination = remember ? 'localStorage' : 'sessionStorage'
  const other = remember ? 'sessionStorage' : 'localStorage'
  writeStorage(destination, SESSION_KEY, serialized)
  removeStorage(other, SESSION_KEY)
}

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(loadUsers)
  const [user, setUser] = useState(loadSession)

  const login = async (email, password, remember) => {
    const normalizedEmail = email.trim().toLowerCase()
    const savedUsers = loadUsers()
    const accounts = savedUsers.length ? savedUsers : users
    const account = accounts.find((entry) => entry.email === normalizedEmail)
    if (!account) throw new Error('Email or password is incorrect.')

    const hash = await hashPassword(account.salt, password)
    if (hash !== account.hash) throw new Error('Email or password is incorrect.')

    const session = { name: account.name, email: account.email }
    setUser(session)
    saveSession(session, remember)
    return session
  }

  const signup = async (name, email, password, remember) => {
    const normalizedEmail = email.trim().toLowerCase()
    const savedUsers = loadUsers()
    const accounts = savedUsers.length ? savedUsers : users
    if (accounts.some((entry) => entry.email === normalizedEmail)) {
      throw new Error('This email is already registered.')
    }

    const salt = createSalt()
    const hash = await hashPassword(salt, password)
    const account = { name: name.trim(), email: normalizedEmail, salt, hash }
    const nextUsers = [...accounts, account]
    setUsers(nextUsers)
    writeStorage('localStorage', USERS_KEY, JSON.stringify(nextUsers))

    const session = { name: account.name, email: account.email }
    setUser(session)
    saveSession(session, remember)
    return session
  }

  const logout = () => {
    setUser(null)
    removeStorage('localStorage', SESSION_KEY)
    removeStorage('sessionStorage', SESSION_KEY)
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
