import {NavLink} from "react-router-dom"

function Nav({status}){
  return(
    <div className="container">
      <div className="row">
        <div className="col-12">
          <nav className="navbar navbar-expand-lg navbar-dark bg-success">
            <div className="container-fluid">
              <span className="navbar-brand">FundMe</span>
              <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                  <span className="navbar-toggler-icon"></span>
             </button>
              <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                <div className="navbar-nav">
                <NavLink to="/" end className={({isActive}) => isActive ? 'nav-item nav-link active' : "nav-item nav-link"}>Pradžia</NavLink>
                <NavLink to="/create" className={({isActive}) => isActive ? 'nav-item nav-link active' : "nav-item nav-link"}>Sukurti idėją</NavLink>
                {/* {/* {status === 3 ?  <NavLink to="/movies" className={({isActive}) => isActive ? 'nav-item nav-link active' : "nav-item nav-link"}>Movies</NavLink> : null} */}
                {status === 3 ?  <NavLink to="/offers" className={({isActive}) => isActive ? 'nav-item nav-link active' : "nav-item nav-link"}>Idėjos</NavLink> : null} 
                {status === 1 ? <NavLink to="/login" className="nav-link">Login</NavLink> : null}
                {status !== 1 ? <NavLink to="/logout" className="nav-link">Logout</NavLink> : null}
                {/* {status === 1 ? <NavLink to="/register" className="nav-link">Register</NavLink> : null} */}
                </div>
              </div>
              </div>
          </nav>
        </div>
      </div>

    </div>
  );
}

export default Nav;