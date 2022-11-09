import { useContext } from "react";
import Home from "../../Context/Home";
import Line from "./Line";

function List(){
  const { tempOff } = useContext(Home);
  return(
    <div className="card m-4">
    <h5 className="card-header">Pasiūlymų/idėjų sąrašas</h5>
    <div className="card-body">
        <ul className="list-group">
            {
                tempOff?.map(m => m[1][0].isShow ? <Line key={m[1][0].id} line={m} /> : null)
            }
        </ul>
    </div>
</div>
  )
}

export default List;