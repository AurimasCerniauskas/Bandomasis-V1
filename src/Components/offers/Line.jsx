import { useContext } from "react";
import Offers from "../../Context/Offers";

function Line({line}){
const {setDeleteOffer, setOffer} = useContext(Offers);


const changeSt = () =>{
  setOffer({
    id: line.id,
    isShow: 1
  })
}

  return(
    <li className="list-group-item border-0">
      <div className="line">
        <div className="line__content">
        {line.image ? <div className='img-bin'>
                            <img src={line.image} alt={line.title}>
                            </img>
                        </div> : <span className="red-image">No image</span>}
        </div>
        <div className="line__content flex-grow-1">
          <div className="line__content__info m-2 w-100">
          <p className="line__content__title m-0">{line.title}</p>
          <span className="m-0">{line.idea}</span>
          </div>
        </div>
        <div className="line__content__info">
          <div className="mb-2">
          <p className="m-0">Suma {line.goal_sum} &euro;</p>
          </div>

        </div>
        <div className="line__buttons">
          <button type="button" className="btn btn-outline-primary" onClick={changeSt} style={{display: line.isShow ? "none" : "inline-block"}}>Patvirtinti</button>
          <button type="button" className="btn btn-outline-danger" onClick={()=> setDeleteOffer(line.id)}>Ištrinti</button>
        </div>
      </div>
    </li>
  )
}

export default Line;