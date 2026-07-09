import type { ReactNode } from 'react'
import { CloseIcon } from './Icons'

interface ModalProps {
  open: boolean
  title: string
  children: ReactNode
  onClose?: () => void
  dismissLabel?: string
}

export function Modal({ open, title, children, onClose, dismissLabel = 'Cerrar' }: ModalProps) {
  if (!open) return null

  return (
    <div className="modal-layer" role="presentation">
      <div className="modal-backdrop" onClick={onClose} aria-hidden="true" />
      <section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <header className="modal-card__header">
          <h2 id="modal-title">{title}</h2>
          {onClose ? (
            <button className="icon-button" type="button" onClick={onClose} aria-label={dismissLabel}>
              <CloseIcon />
            </button>
          ) : null}
        </header>
        {children}
      </section>
    </div>
  )
}
