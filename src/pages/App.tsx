import React, {useRef, useEffect } from 'react';
import '../commonStyles.scss';
import Menu from '../components/menu/menu'

import {setStatusServer} from "../components/helpers/helpers";

import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';

import Paper from '@mui/material/Paper';

function App() {

  /*
  const [statusServerDiv, setstatusServerDiv] = React.useState(false);

  useEffect(() => {
    getStatusServer();

    setInterval(function(){ 
      getStatusServer();
    }, 2500);
    
  },[]);

  function getStatusServer() {
    fetch("http://localhost:8081/status", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    }).then(response => {
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }
        return response.json()
      }).then(data => {
        //setstatusServerDiv(true);
        setStatusServer(true);
      }).catch(error => {
        //setstatusServerDiv(false);
        setStatusServer(false);
      });

  }

  let ShowStatusServer = () => {
    if (statusServerDiv) {
      return (
        <div className="divStatus">
          <Paper id="serverok" className="paperStatus">
            <DoneIcon/>
            <span>Servidor On</span>
          </Paper>
        </div>
      )
    }else{
      return (
        <div className="divStatus">
          <Paper id="servernok" className="paperStatus">
            <CloseIcon/>
              <span>Servidor Off</span>
          </Paper>
        </div>
      )
    }
  }
*/
  return (
    <div className="App">
      <Menu/>
    </div>
  );
}

export default App;
