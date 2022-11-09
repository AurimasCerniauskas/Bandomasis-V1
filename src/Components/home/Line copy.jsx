import axios from "axios";
import { useContext, useEffect } from "react";
import { useState } from "react";
import Home from "../../Context/Home";

function Line({line}){
  const {setUpdateOffer} = useContext(Home);
  const [donSum, setDonSum] = useState('');
  const [donName, setDonName] = useState('');
  const [donate, setDonate] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [showDonate, setShowDonate] = useState(null);

  useEffect(()=>{
    axios.get("http://localhost:3003/server/donate")
    .then(res=>
      setShowDonate(res.data.map(a=> ({...a, show: true})))
    )
  }, [lastUpdate])


  const doDonate = (id) =>{
      console.log(id)
      setDonate({
        name: donName,
        suma: parseInt(donSum),
        offer_id: id
      });
      setUpdateOffer({
        id,
        d_suma: donSum
      });
    setDonName('');
    setDonSum('');
  }

  useEffect(()=>{
    if(donate === null){
      return
    }
    axios.post("http://localhost:3003/server/donate", donate)
    .then(res=>
      setLastUpdate(Date.now())
      )
  }, [donate])

  return(
    <li className="list-group-item">
    <div className="home">
        <div className="home__content">
            <div className="home__content__info flex-grow-1">
                <h2>{line.title}</h2>
                {line.image ? <div className='img-bin'>
                    <img src={line.image} alt={line.title} style={{width: '100px', height: '100px'}}>
                    </img>
                </div> : <span className="red-image">No image</span>}
            </div>
            <div className="home__content__info">
              {line.idea}
            </div>
            <div className="home__content__price">
               <p>Reikalinga suma: {line.goal_sum} &euro; </p>
               <p className="text-dark">suaukota: {line.d_suma} &euro;</p>
               <p className="text-info">liko: {line.goal_sum - line.d_suma} &euro;</p>
            </div>
            <div className="home__content__info">
                <div className="mb-3">
                  <label className="form-label">Geradaris</label>
                  <input className="form-control" type='text' value={donName} onChange={e=> setDonName(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Suma</label>
                  <input className="form-control" type='text' value={donSum} onChange={e=> setDonSum(e.target.value)} />
                </div>
                <button onClick={()=>doDonate(line.id)} type="button" className="btn btn-outline-success m-3">Donate</button>
            </div>
        </div>
    </div>

    <div className="comments">

        <ul className="list-group">
            {
                showDonate?.map(c => c.offer_id === line.id ? <li key={c.id} className="list-group-item col-4 d-flex/"><p>{c.name}</p> <b>{c.suma} &euro;</b></li> : null)
            }
        </ul>
    </div>
</li>
  )
}

export default Line;