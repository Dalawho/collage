import parse from 'html-react-parser';
import { useRef,useState } from 'react';

interface PanelProps {
  id: number,
  picture: string,
  description: string,
  onClick: (id: number, layer: number) => void,
}

const Panel = ({ id, picture, description, onClick }: PanelProps) => {
  const [showOverlay, setShowOverlay] = useState(false)
  const [overlayX, setOverlayX] = useState(0)
  const [overlayY, setOverlayY] = useState(0)
  const overlayRef = useRef<HTMLDivElement>(null)

  const handleClick = (event: React.MouseEvent) => {
    setOverlayX(event.pageX)
    setOverlayY(event.pageY)
    setShowOverlay(true)
  }

  const handleSelect = (layer: number) => {
    onClick(id, layer)
    setShowOverlay(false)
  }

  const handleMouseLeave = () => {
    if (overlayRef.current) {
      setShowOverlay(false)
    }
  }

  const layerNr = Array.from({length: 16}, (_, index) => index + 1)

  return (
    <div onClick={handleClick} className="rounded-lg border-slate-900 border-4 m-1" >
      {parse(picture)}
      <p>{description}</p>
      {showOverlay && (
        <div
          ref={overlayRef}
          style={{
            position: 'absolute',
            left: overlayX,
            top: overlayY,
          }}
          onClick={event => event.stopPropagation()}
          onMouseLeave={handleMouseLeave}
          className="border-1 p-1 border-slate-700 bg-slate-100 rounded-2xl"
        >
          <p>Select a layer:</p>
          <div className='space-x-2'>
          {
            layerNr.map(layer => (
              <button key={layer} onClick={() => handleSelect(layer)} className="border-2 rounded-lg border-zinc-600 mx-auto px-1 my-auto">
                Layer {layer}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Panel;