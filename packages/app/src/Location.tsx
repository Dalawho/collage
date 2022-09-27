
type LocProps = {
  loc: {[key: string]: number};
  traitName: string;
  onChange: (trait: string, value: string) => void;
}

export const LocationForm = (props: LocProps) => {
    
    return(
        <div>
        <form className="flex flex-row px-4 ">
        <label className="w-16 pl-1">X - Y:  </label>
          <input className="w-10 bg-zinc-900 text-center"
            type="number" 
            value={props.loc[props.traitName+"x"]}
            onChange={(e) => props.onChange(props.traitName+"x", e.target.value)}
            required pattern="\d+"
          />
          <label className="px-2"> - </label>
          <input className="w-10 bg-zinc-900 text-center outline-none focus:outline-none"
            type="number" 
            value={props.loc[props.traitName+"y"]}
            onChange={(e) => props.onChange(props.traitName+"y", e.target.value)}
            required pattern="\d+"
          />
      </form>
      </div>
    )
};