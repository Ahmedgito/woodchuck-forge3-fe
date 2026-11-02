import React from 'react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { Modal } from 'antd'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'

const push = vi.fn()
vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }))

import SettingsActionRow from './index'

afterEach(() => {
  Modal.destroyAll()
  cleanup()
  document.body.innerHTML = ''
  push.mockClear()
})

describe('SettingsActionRow leave confirmation', () => {
  it('asks for confirmation before leaving when there are unsaved changes', async () => {
    render(<SettingsActionRow isDirty={true} />)
    const home = screen.getByRole('link', { name: 'Home page' })
    const notPrevented = fireEvent.click(home)
    expect(notPrevented).toBe(false)
    expect(await screen.findByText('Leave without saving?')).toBeTruthy()
    expect(push).not.toHaveBeenCalled()
    fireEvent.click(screen.getByText('Leave and discard changes'))
    expect(push).toHaveBeenCalledWith('/')
  })

  it('does not intercept a modified click (open in new tab) when dirty', () => {
    render(<SettingsActionRow isDirty={true} />)
    const home = screen.getByRole('link', { name: 'Home page' })
    const notPrevented = fireEvent.click(home, { ctrlKey: true })
    expect(notPrevented).toBe(true)
    expect(screen.queryByText('Leave without saving?')).toBeNull()
  })

  it('keeps "Home page" visible and enabled when dirty', () => {
    render(<SettingsActionRow isDirty={true} />)
    const home = screen.getByRole('link', { name: 'Home page' })
    expect(home.getAttribute('aria-disabled')).toBeNull()
    expect(home.getAttribute('href')).toBe('/')
  })
})
