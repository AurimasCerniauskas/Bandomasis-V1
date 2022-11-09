import { useEffect, useState } from "react";
import Home from "../../Context/Home";
import List from "./List";
import axios from 'axios';

function Main(){
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [readOffer, setReadOffer] = useState(null);
  const [updateOffer, setUpdateOffer] = useState(null);
  const [tempOff, setTempOff] = useState(null);

  const reList = (data) =>{
    const d = new Map();
    data.forEach(line => {
        if(d.has(line.title)){
            d.set(line.title, [...d.get(line.title), line]);
        }else{
            d.set(line.title, [line]);
        }
    })
    return [...d];
  }

  useEffect(()=>{
    axios.get("http://localhost:3003/server/offer")
    .then(res=>{
      setReadOffer(res.data)
    })
  }, [lastUpdate])


  useEffect(()=>{
    axios.get("http://localhost:3003/home/offer")
    .then(res=>{
        console.log(res.data)
        setTempOff(reList(res.data))
  })
  }, [lastUpdate])

    console.log(tempOff)
    tempOff?.map(a=> console.log(a[1][0]))

  useEffect(()=>{
    if(updateOffer=== null){
        return
    }
    console.log(updateOffer)
    axios.put("http://localhost:3003/server/offer2/"+updateOffer.id, updateOffer)
    .then(res=>{
        // console.log(res)
        setLastUpdate(Date.now())
  })
  }, [updateOffer])


  return(
    <Home.Provider value={{
      readOffer,
      setReadOffer,
      setUpdateOffer
    }}>
      <div className="container">
        <div className="row">
            <div className="col-12">
                <List />
            </div>
        </div>
    </div>


    </Home.Provider>
  )
}

export default Main;