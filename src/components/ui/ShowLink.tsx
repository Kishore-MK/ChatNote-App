"use client";
import { useEffect, useState } from "react";
import VerifiedLink from "./VerifiedLink";

var Meta = require('html-metadata-parser');
interface linkprops{
    value:string
}
function ShowLink({value}:linkprops) {
    const [metadata, setMetadata] = useState<string | null>(null);
    const [title,setTitle] =useState("")
    const [render,setRender]=useState(false)
    
    const fetchMetadata = async () => {
      try {
        
        const data = await Meta.parse(value); 
        const response =  JSON.stringify(data, null, 3);
        setMetadata(data.og.site_name);
        setTitle(data.meta.title)
        
      } catch (err) {
        console.error(err);
      }
    };
    useEffect(() => {
    if (value) {
     fetchMetadata();
    }
  }, [value]);
  
  console.log(metadata);
  return (
    <div>
    {  metadata!==null ?
    <VerifiedLink value={value} metadata={metadata??""} title={title}/>
    :
    <p></p>
    }
    </div>
  )
}

export default ShowLink