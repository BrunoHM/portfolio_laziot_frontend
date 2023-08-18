import React, {useRef, useEffect } from 'react';
import { OnLoadUtils, CheckAuthValidity, getUserToken} from "../../components/helpers/helpers";

import './styles.scss';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

export default function UploadCode() {

  function getCodeDevice(e, typeDevice){
    fetch("http://localhost:8081/code/"+typeDevice, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "hash":getUserToken()
      }
    }).then(response => {
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }
        return response.json()
      }).then(data => {
        copyContent(data.textCode);
      })
      .catch(error => alert("Ocorreu um erro ao buscar os dados!"+error));
  }

  const copyContent = async (text) => {
    
    let codeText = text.replaceAll("@@","\\\"");
    
    try {
      await navigator.clipboard.writeText(codeText);
      alert('Código copiado para a área de transferência!');
    } catch (err) {
      alert('Failed to copy: ', err);
    }
  }

  return (
    <Container>
      <Box>
        <Button className="btnCopyCodes" id="btnCopyEmissor" onClick={(e) => getCodeDevice(e, "emissor")}> Copiar Código(Emissor)</Button>
        <Box className="composicaoDevicesCode">
          <span>Composição: </span>
          <span>Esp01 + Sensor Ultrasônico(hc-sr04)</span>
        </Box>
      </Box>
      
      <Box>
        <Button className="btnCopyCodes" id="btnCopyReceptor" onClick={(e) => getCodeDevice(e, "receptor")}> Copiar Código(Receptor)</Button>
        <Box className="composicaoDevicesCode">
          <span>Composição: </span>
          <span>Esp01 + Módulo Relé (2 canais)</span>
        </Box>
      </Box>

    </Container>
  );
}
