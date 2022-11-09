import { useContext, useState, useRef } from "react";
import CreateStory from "../../Context/CreateStory";
import getBase64 from '../../Functions/getBase64';

function Create(){
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [money, setMoney] = useState('');
  const {setCreateData} = useContext(CreateStory);
  const fileInput = useRef();
  const [photoPrint, setPhotoPrint] = useState(null);

  const doPhoto = () => {
    getBase64(fileInput.current.files[0])
        .then(photo => setPhotoPrint(photo))
        .catch(_ => {
        })
}

  const create = () =>{
    if (title === '' || text=== '' || money === ''){
      return;
    }
    setCreateData({
      title,
      idea: text,
      goal_sum: parseInt(money),
      image: photoPrint
    });
    setTitle('');
    setText('');
    setMoney('');
    setPhotoPrint(null);
    fileInput.current.value = null;
  }
  return(
    <div className="card m-4">
      <h5 className="card-header">Rėmimo idėja</h5>
      <div className="card-body">
        <div className="mb-3">
          <label className="form-label">Pavadinimas</label>
          <input type="text" className="form-control" value={title} onChange={e=> setTitle(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label">Aprašymas</label>
          <textarea type="text" className="form-control" value={text} onChange={e=> setText(e.target.value)} />
        </div>
        <div className="mb-3 col-4">
          <label className="form-label">Reikalinga suma &euro;</label>
          <input type="text" className="form-control" value={money} onChange={e=> setMoney(e.target.value.replace(/[^\d]/, ''))} />
        </div>
        <div className="mb-3">
          <label className="form-label">Paveiksliukas</label>
          <input ref={fileInput} type="file" className="form-control" onChange={doPhoto} />
        </div>
        {photoPrint ? <div className='img-bin'><img src={photoPrint} alt="upload"></img></div> : null}
        <button type="button" className="btn btn-outline-success" onClick={create}>Sukurti</button>
      </div>
    </div>
  )
}

export default Create;