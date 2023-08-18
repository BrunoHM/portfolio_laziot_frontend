import React, {useRef, useEffect } from 'react';
import { OnLoadUtils, getUserToken} from "../../components/helpers/helpers";

import './styles.scss';

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';



export default function UserParameters() {

  const [ssidName, setSsidName] = React.useState("");
  const [ssidPassword, setSsidPassword] = React.useState("");
  const [distanceSensorHcsr04, setDistanceSensorHcsr04] = React.useState("");

  const [paramsList, setParamsList] = React.useState([{}]);

  const handleChangeSsidName = (event) => {
    setSsidName(event.target.value);
  };
  const handleChangeSsidPassword = (event) => {
    setSsidPassword(event.target.value);
  };

  const handleChangeDistanceSensorHcsr04 = (event) => {
    setDistanceSensorHcsr04(event.target.value);
  };

  useEffect(() => {
      //Executa no render do componente
      getParams();
  },[]);

  function getParams(){
    fetch("http://localhost:8081/parameters", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "token":getUserToken()
      }
    }
    ).then(response => {
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
      }
      return response.json()
    }).then(data => {
      setParametersOnObject(data);
    }).catch(error => {alert("Ocorreu um erro ao buscar os dados!"+error)});
  }

  function setParametersOnObject(arrayData){
    
    let qtdDataRows = arrayData.length;
    let dataRows = [{}];

    if(qtdDataRows > 0){

        for(var x = 0; x < qtdDataRows; x++){
            const descriptionParam = arrayData[x].description;
            const valueParam = arrayData[x].value;

            dataRows[x] = {
                id : arrayData[x].id,
                description : descriptionParam,
                value : valueParam,
                active : arrayData[x].active
            };

            if(descriptionParam === "SSID_NAME"){
              setSsidName(valueParam);
            }else if(descriptionParam === "SSID_PASS"){
              setSsidPassword(valueParam);
            }else if(descriptionParam === "SENSOR_DIST_HC-SR04"){
              setDistanceSensorHcsr04(valueParam);
            }              
        }
    }
    setParamsList(dataRows);
  }

  function updateParams() {

    const dataArray = [{}, {}, {}];
    let listJson = "";

    if(paramsList.length >= 3) {
      paramsList[0].value = ssidName;
      paramsList[1].value = ssidPassword;
      paramsList[2].value = distanceSensorHcsr04;
      listJson = JSON.stringify(paramsList);
    } else {      
      dataArray[0].description = "SSID_NAME";
      dataArray[0].value = ssidName;
      
      dataArray[1].description = "SSID_PASS";
      dataArray[1].value = ssidPassword;

      dataArray[2].description = "SENSOR_DIST_HC-SR04";
      dataArray[2].value = distanceSensorHcsr04;

      setParamsList(dataArray);
      listJson = JSON.stringify(dataArray);
    }


    fetch("http://localhost:8081/parameters", {
      method: "PUT",
      headers: {
          "Content-Type": "application/json",
          "token":getUserToken()
      },
      body: listJson
    }).then(response => {
    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
    }
        return response.json()
    }).then(resp => {
        getParams();
        if(!resp) alert("Ocorreu um erro ao atualizar os parâmetros!");
    }).catch(error => {alert("Ocorreu um erro ao atualizar os parâmetros!")});

  }


  return (
    <Container>
      <OnLoadUtils/>

        <Box id="boxSsidParams" className="boxParam">
          <Box>
            <TextField id="outlined-name" label="Nome Rede Wifi (ssid)" value={ssidName} onChange={handleChangeSsidName} />
          </Box>
          
          <Box>
            <TextField id="outlined-name" type="password" label="Senha Rede Wifi" value={ssidPassword} onChange={handleChangeSsidPassword} />
          </Box>
        </Box>

        <Box id="boxSensorsParams" className="boxParam">
          <Box>
            <TextField id="outlined-name" label="Distancia limite (sensor hc-sr04)" value={distanceSensorHcsr04} onChange={handleChangeDistanceSensorHcsr04} />
          </Box>
        </Box>

        <Box id="boxActionsParams" className="boxParam">
          <Box>
            <Button onClick={updateParams} variant="outlined">
                Atualizar Parâmetros
            </Button>
          </Box>
        </Box>

    </Container>
  );
}
