import axios from "axios";
import { useContext, useEffect } from "react";
import { useState } from "react";
import Home from "../../Context/Home";

function Line({line}){
  const {setUpdateOffer, setLastUpdate} = useContext(Home);
  const [donSum, setDonSum] = useState('');
  const [donName, setDonName] = useState('');
  const [donate, setDonate] = useState(null);
  // const [showDonate, setShowDonate] = useState(null);

  // useEffect(()=>{
  //   axios.get("http://localhost:3003/server/donate")
  //   .then(res=>
  //     setShowDonate(res.data.map(a=> ({...a, show: true})))
  //   )
  // }, [lastUpdate])


  const doDonate = (id) =>{
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
  }, [donate, setLastUpdate])

  return(
    <li className="list-group-item" style={line[1][0].d_suma >= line[1][0].goal_sum ? {backgroundColor: 'cornsilk'} : {backgroundColor: 'white'}}>
        <div className="home__content">
            <div className="home__content__info">
                {line[1][0].image ? <div className='img-bin'>
                    <img src={line[1][0].image} alt={line[1][0].title} style={{width: '150px', height: '150px'}}>
                    </img>
                </div> : <span className="red-image">No image</span>}
            </div>
            <div className="home__content__info flex-column">
              <h2>{line[1][0].title}</h2>
              <p className="m-3">{line[1][0].idea}</p>
            </div>
            <div className="home__content__price">
               <p>Reikalinga suma: {line[1][0].goal_sum} &euro; </p>
               <p className="text-dark">suaukota: {line[1][0].d_suma} &euro;</p>
               <p className="text-info">liko: {line[1][0].goal_sum - line[1][0].d_suma} &euro;</p>
            </div>

        </div>
    <div className="home__content__info" style={line[1][0].d_suma >= line[1][0].goal_sum ? {display: 'none'} : {display: 'flex'}}>
        <div className="mb-3">
          <label className="form-label">Aukotojas</label>
          <input className="form-control" type='text' value={donName} onChange={e=> setDonName(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label">Suma</label>
          <input className="form-control" type='text' value={donSum} onChange={e=> setDonSum(e.target.value.replace(/[^\d]/, ''))} />
        </div>
        <button onClick={()=>doDonate(line[1][0].id)} type="button" className="btn btn-outline-success m-3">Donate</button>
    </div>
    <div className="comments">
        <h5>Aukotojai:</h5>
        <ul className="list-group d-flex flex-row flex-wrap">
            {
                line[1]?.map((c, i) => c.offer_id === line[1][0].id ? <li key={i} className="list-group-item col-4 border-0"><p className="d-inline">{c.name}</p> <b>{c.suma} &euro;</b></li> : null)
            }
        </ul>
    </div>
</li>
  )
}

export default Line;