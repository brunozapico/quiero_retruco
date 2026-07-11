import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

const baseProps: IconProps = {
  width: 22,
  height: 22,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

export function VolumeIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <path d="M11 5 6.8 8.4H3.5v7.2h3.3L11 19V5Z" />
      <path d="M15.2 8.2a5.4 5.4 0 0 1 0 7.6" />
      <path d="M17.8 5.8a8.8 8.8 0 0 1 0 12.4" />
    </svg>
  )
}

export function VolumeOffIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <path d="M11 5 6.8 8.4H3.5v7.2h3.3L11 19V5Z" />
      <path d="m16 9 5 5" />
      <path d="m21 9-5 5" />
    </svg>
  )
}

export function RefreshIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <path d="M20 6v5h-5" />
      <path d="M18.2 16.8A8 8 0 1 1 20 11" />
    </svg>
  )
}

export function InfoIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 10.8v5" />
      <path d="M12 7.5h.01" />
    </svg>
  )
}

export function HistoryIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <path d="M12 7v5l3 2" />
      <path d="M5.2 8.2A8 8 0 1 1 4 12" />
      <path d="M3.5 5.5v4h4" />
    </svg>
  )
}

export function ShareIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <path d="M12 16V3" />
      <path d="m7.5 7.5 4.5-4.5 4.5 4.5" />
      <path d="M5 11v8h14v-8" />
    </svg>
  )
}

export function HomeIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <path d="m3.5 10 8.5-7 8.5 7" />
      <path d="M5.5 9v11h13V9" />
      <path d="M9.5 20v-6h5v6" />
    </svg>
  )
}

export function CloseIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <path d="m6 6 12 12" />
      <path d="M18 6 6 18" />
    </svg>
  )
}
