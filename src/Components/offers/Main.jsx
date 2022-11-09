import { useEffect, useState } from "react";
import Offers from "../../Context/Offers";
import List from "./List";
import axios from 'axios';

function Main(){
  const [deleteOffer, setDeleteOffer] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [showOffer, setShowOffer] = useState('0');
  const [offer, setOffer] = useState(null);
  const [readOffer, setReadOffer] = useState(null);

  useEffect(()=>{
    axios.get("http://localhost:3003/server/offer")
    .then(res=>{
      setReadOffer(res.data.map(b=> ({...b, show: true})))
    })
  }, [lastUpdate])

  useEffect(()=>{
    showOffer === '0' ? setReadOffer(a=> a?.map(b=> ({...b, show: true}))) :  setReadOffer(a=> a.map(b=> !b.isShow ? {...b, show: true} : {...b, show: false}))
  }, [showOffer])


  useEffect(()=>{
    if(offer === null){
      return
    }
    axios.put("http://localhost:3003/server/offer/"+offer.id, offer)
    .then(res=>
      setLastUpdate(Date.now())
  )
  }, [offer])

  useEffect(()=>{
    if(deleteOffer===null){
      return
    }
    axios.delete("http://localhost:3003/server/offer/"+deleteOffer)
    .then(res=>{
      setLastUpdate(Date.now())
    })
  }, [deleteOffer])

  return(
    <Offers.Provider value={{
      readOffer,
      setDeleteOffer,
      setOffer
    }}>
      <div className="container">
      <div className="row">
        <div className="col-12">
            <h2 style={{textAlign: 'center'}}>Vartotojų idėjos, pasiūlymai</h2>
            <div className="filter__block d-flex mt-3 offset-sm-1 offset-md-0 justify-content-center flex-wrap">
              <div className="col-6 col-md-3 m-2 offset-md-4">
                <label className="form-label"><h4>Pasiūlymų filtras</h4></label>
              </div>
              <div className="col-6 col-md-3 m-2">
                <select className="form-select" value={showOffer} onChange={e => setShowOffer(e.target.value)}>
                  <option value={0}>Visi</option>
                  <option value={1}>Nepatvirtinti</option>
                </select>
              </div>
            </div>
            <List />
        </div>
      </div>
    </div>


    </Offers.Provider>
  )
}

export default Main;