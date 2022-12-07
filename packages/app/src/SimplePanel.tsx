import parse from 'html-react-parser';

interface PanelProps {
  id: number,
  picture: string,
  description: string,
  onClick: (id: number) => void,
}

const SimplePanel = ({ id, picture, description, onClick }: PanelProps) => {

  const handleClick = () => {
    onClick(id)
  }

  return (
    <div onClick={handleClick} className="rounded-lg border-slate-900 border-4 m-1" >
      {parse(picture)}
      <p>{description}</p>
    </div>
  )
}

export default SimplePanel;