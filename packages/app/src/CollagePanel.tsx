import parse from 'html-react-parser';

interface PanelProps {
  id: number,
  picture: string,
}

const CollagePanel = ({ id, picture }: PanelProps) => {

  return (
    <div className="rounded-lg border-slate-900 border-4 m-1" >
      {parse(picture)}
      <p>{id}</p>
    </div>
  )
}

export default CollagePanel;