import React from 'react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'

const push = vi.fn()
vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }))

import SettingsActionRow from './index'

afterEach(() => {
  cleanup()
  push.mockClear()
})

describe('SettingsActionRow', () => {
  it('[AC-1] shows "Home page" in the same row, before "Save changes"', () => {
    render(<SettingsActionRow isDirty={false} />)
    const row = screen.getByTestId('settings-action-row')
    const home = screen.getByRole('link', { name: 'Home page' })
    const save = screen.getByRole('button', { name: /save changes/i })
    expect(row.contains(home)).toBe(true)
    expect(row.contains(save)).toBe(true)
    expect(
      home.compareDocumentPosition(save) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy()
  })

  it('[AC-2] with no unsaved changes "Home page" is enabled and navigates to /', () => {
    render(<SettingsActionRow isDirty={false} />)
    const home = screen.getByRole('link', { name: 'Home page' })
    expect(home.getAttribute('href')).toBe('/')
    expect(home.getAttribute('aria-disabled')).toBeNull()
    // the click is not intercepted, so the link navigates to /; no dialog
    const notPrevented = fireEvent.click(home)
    expect(notPrevented).toBe(true)
    expect(screen.queryByText('Leave without saving?')).toBeNull()
  })
})
