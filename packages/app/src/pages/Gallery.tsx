import type { NextPage } from "next";

import CollagePanel from "../CollagePanel";
//import React from "react";
import { GetAllCollages } from "../GetAllCollages";
import { Nav } from "../Nav";

const Gallery:NextPage = () => {
    
    const collages = GetAllCollages();
    console.log(GetAllCollages);

    return(
      <div className="bg-amber-100">
        <div className="flex flex-col bg-amber-100 text-slate-800 text-2xl font-proggy" >
          <Nav width={0} />
            <div className="flex flex-col gap-4 items-center p-8 mx-auto">
              <div>
                <h1>Gallery</h1>
              </div>
              <div className="grid grid-cols-3">
                {collages?.map(panel => (
                    <CollagePanel
                    key={panel.value}
                    id={panel.value}
                    picture={panel.tokenURI}
                    />
                ))}
              </div>
              
                </div>
                </div>
                </div>
          
    );
};

export default Gallery;