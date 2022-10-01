
type LocProps = {
  loc: {[key: string]: number};
  onChange: (trait: string, value: string) => void;
}

export const LocationForm = (props: LocProps) => {
    
    return(
        <div>
        <form className="flex flex-row px-4 ">
        <label className="w-16 pl-1">X - Y:  </label>
          <input className="w-10  text-center bg-amber-100"
            type="number" 
            value={props.loc.x}
            onChange={(e) => props.onChange("x", e.target.value)}
            required pattern="\d+"
          />
          <label className="px-2"> - </label>
          <input className="w-10 text-center bg-amber-100 outline-none focus:outline-none"
            type="number" 
            value={props.loc.y}
            onChange={(e) => props.onChange("y", e.target.value)}
            required pattern="\d+"
          />
      </form>
      </div>
    )
};