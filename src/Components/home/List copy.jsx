import { useContext } from "react";
import Home from "../../Context/Home";
import Line from "./Line";

function List(){
  const { readOffer } = useContext(Home);
  return(
    <div className="card m-4">
    <h5 className="card-header">Pasiūlymų/idėjų sąrašas</h5>
    <div className="card-body">
        <ul className="list-group">
            {
                readOffer?.map(m => <Line key={m.id} line={m} />)
            }
        </ul>
    </div>
</div>
  )
}

export default List;