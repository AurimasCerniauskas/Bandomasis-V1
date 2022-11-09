import { useContext } from "react";
import Offers from '../../Context/Offers';
import Line from "./Line";


function List(){
  const {readOffer} = useContext(Offers);
  return(
    <div className="card-block">
    <div className="card m-4 col-11 offset-md-1">
      <div className="card-body">
        <ul className="list-group">
      {
        readOffer?.map(line => line.show ? <Line line={line} key={line.id} /> : null)
      }
      </ul>
      </div>
    </div>
  </div>
  )
}

export default List;