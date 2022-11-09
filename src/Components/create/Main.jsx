import { useState,  useEffect } from "react";
import CreateStory from "../../Context/CreateStory";
import Create from "./Create";
import axios from 'axios';
// import {authConfig} from '../../Functions/auth';

function Main(){
  const [createData, setCreateData] = useState(null);

//create
  useEffect(()=>{
    if (createData === null){
      return;
    }
    axios.post("http://localhost:3003/server/create", createData)
    .then(res =>
      {
  })
  }, [createData])


  return(
    <CreateStory.Provider value={{
      setCreateData,
    }}>
      <div className="container">
        <div className="row">
        <div className="col-sm-12 col-md-12 col-lg-8 offset-lg-2">
            <Create />
          </div>
        </div>
      </div>
    </CreateStory.Provider>
  )
}

export default Main;