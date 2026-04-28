import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { OrderToggle } from './OrderToggle'

describe('OrderToggle', () => {
  it('shows ascending label when value=asc', () => {
    render(<OrderToggle value="asc" onChange={() => {}} />)
    const button = screen.getByRole('button')
    expect(button).toHaveTextContent('Croissant')
    expect(button).toHaveAccessibleName(/Croissant/)
  })

  it('shows descending label when value=desc', () => {
    render(<OrderToggle value="desc" onChange={() => {}} />)
    const button = screen.getByRole('button')
    expect(button).toHaveTextContent('Décroissant')
    expect(button).toHaveAccessibleName(/Décroissant/)
  })

  it("calls onChange with 'desc' when value=asc and clicked", async () => {
    const onChange = vi.fn()
    render(<OrderToggle value="asc" onChange={onChange} />)
    await userEvent.click(screen.getByRole('button'))
    expect(onChange).toHaveBeenCalledWith('desc')
  })

  it("calls onChange with 'asc' when value=desc and clicked", async () => {
    const onChange = vi.fn()
    render(<OrderToggle value="desc" onChange={onChange} />)
    await userEvent.click(screen.getByRole('button'))
    expect(onChange).toHaveBeenCalledWith('asc')
  })
})
