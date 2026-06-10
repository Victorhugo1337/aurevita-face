export function ProductVisual({ product, className = '' }) {
  const imageUrl = product.images?.[0]?.url

  if (imageUrl) {
    return (
      <img src={imageUrl} alt={product.name} className={`object-cover ${className}`} />
    )
  }

  const palette = {
    'em-po':              { bg: '#e3ebde', shape: '#48683e', accent: '#c8896a' },
    'chas':               { bg: '#f5f2e9', shape: '#5d8350', accent: '#7a9d6c' },
    'capsulas':           { bg: '#ece7d4', shape: '#30432b', accent: '#b06f4e' },
    'bebida-energetica':  { bg: '#c6d6bd', shape: '#293826', accent: '#945636' },
  }[product.category] || { bg: '#f5f2e9', shape: '#48683e', accent: '#b06f4e' }

  const shapes = {
    'em-po':              <circle cx="100" cy="120" r="48" fill={palette.shape} />,
    'chas':               <ellipse cx="100" cy="120" rx="42" ry="58" fill={palette.shape} />,
    'capsulas':           <rect x="62" y="80" width="76" height="80" rx="38" fill={palette.shape} />,
    'bebida-energetica':  <rect x="70" y="55" width="60" height="120" rx="6" fill={palette.shape} />,
  }

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ backgroundColor: palette.bg }}>
      <svg viewBox="0 0 200 220" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        {/* Folha decorativa atrás */}
        <path
          d="M 30 180 Q 60 100 100 90 Q 140 100 170 180 Z"
          fill={palette.accent}
          opacity="0.18"
        />
        {shapes[product.category] || <ellipse cx="100" cy="120" rx="42" ry="58" fill={palette.shape} />}
        {/* Reflexo sutil */}
        <ellipse cx="88" cy="100" rx="6" ry="22" fill="white" opacity="0.18" />
      </svg>
    </div>
  )
}
