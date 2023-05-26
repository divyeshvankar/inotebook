import NoteContext from "./noteContext";
// import { useState } from "react";


const NoteState = (props)=>{
   
//    const [state, setState]= useState();
    return (
     <NoteContext.Provider value={{state:"state",update: "update"}}>
        {props.children}
     </NoteContext.Provider>
   )


    
}

export default NoteState;