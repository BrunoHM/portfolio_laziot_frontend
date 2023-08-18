import React, {useRef, useEffect } from 'react';
import { OnLoadUtils, CheckAuthValidity, getUserToken} from "../../components/helpers/helpers";
import './styles.scss';

import { Button } from '@mui/material';

import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

import LinkIcon from '@mui/icons-material/Link';
import LinkOffIcon from '@mui/icons-material/LinkOff';

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const style2 = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function LinkDevice(props) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(3);
  const [dataList, setDataList] = React.useState([{}]);
  
  const [pageItemsAvailable, setPageItemsAvailable] = React.useState(0);
  const [rowsPerPageItemsAvailable, setRowsPerPageItemsAvailable] = React.useState(3);
  const [dataListItemsAvailable, setDataListItemsAvailable] = React.useState([{}]);

  const [openModalLink, setOpenModalLink] = React.useState(false);

  const handleOpenModalLink  = () =>  {
    getListAvailableDevicesToLink(props);
    getListLinkedDevices(props);
    setOpenModalLink(true);
  }

  const handleCloseModalLink = () => {
    setOpenModalLink(false);
  }

  useEffect(() => {
    CheckAuthValidity();
  },[]);

  const handleChangePage = (event, newPage) => {
      setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
  };

  const handleChangePageItemsAvailable = (event, newPage) => {
    setPageItemsAvailable(newPage);
  };

  const handleChangeRowsPerPageItemsAvailable = (event) => {
      setRowsPerPageItemsAvailable(+event.target.value);
      setPageItemsAvailable(0);
  };

  function getListAvailableDevicesToLink() {
    const id = "id="+props.props.id;
    const type = "&type="+props.props.type;

    fetch("http://localhost:8081/device/getAvailableToLink?"+id+type, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "token":getUserToken()
      }
    }).then(response => {
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }
        return response.json()
      }).then(data => {
        setDataRowsOnTable(data);
      })
      .catch(error => alert("Ocorreu um erro ao buscar os dados!"+error));
  }

  function setDataRowsOnTable(deviceDataRows) {
    let qtdDataRows = deviceDataRows.length;
    let dataRows = [{}];
    
    if(qtdDataRows > 0){
        for(var x = 0; x < qtdDataRows; x++){
            dataRows[x] = {
                id : deviceDataRows[x].id,
                description : deviceDataRows[x].description,
                place : deviceDataRows[x].place,
                type : deviceDataRows[x].type
            };
        }
    }

    setDataList(
        dataRows
    );
  }

  function getListLinkedDevices() {
    const id = "id="+props.props.id;

    fetch("http://localhost:8081/device/getLinked?"+id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "token":getUserToken()
      }
    }).then(response => {
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }
        return response.json()
      }).then(data => {
        setDataListItemsAvailableOnTable(data);
      })
      .catch(error => alert("Ocorreu um erro ao buscar os dados!"+error));
  }

  function setDataListItemsAvailableOnTable(deviceDataRows) {
    let qtdDataRows = deviceDataRows.length;
    let dataRows = [{}];
    
    if(qtdDataRows > 0){
        for(var x = 0; x < qtdDataRows; x++){
            dataRows[x] = {
                id : deviceDataRows[x].id,
                description : deviceDataRows[x].description,
                place : deviceDataRows[x].place,
                type : deviceDataRows[x].type
            };
        }
    }

    setDataListItemsAvailable(
        dataRows
    );
  }

  function linkDevice(event, dataRow){
    
    const idDevice   = props.props.id;
    let idEmitter  = 0;
    let idReceptor = 0;
    
    if(dataRow.type.toLowerCase() === "emissor"){
      idEmitter = dataRow.id
      idReceptor = idDevice;
    }else{
      idEmitter = idDevice;
      idReceptor = dataRow.id
    }

    fetch("http://localhost:8081/device/linkTo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "token":getUserToken()
      },
      body: JSON.stringify({
          "idEmitter": idEmitter,
          "idReceptor": idReceptor
      })
    }).then(response => {
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
      }
      getListAvailableDevicesToLink();
      getListLinkedDevices();
      return response.json()
    }).then(resp => {
      if(!resp) alert("Ocorreu um erro ao vincular o dispositivo!");
    })
    .catch(error => alert("Ocorreu um erro ao vincular o dispositivo!"))

  }
  
  function removeLinkDevice(event, dataRow){
    const idDevice   = props.props.id;
    let idEmitter  = 0;
    let idReceptor = 0;

    if(dataRow.type.toLowerCase() === "emissor"){
      idEmitter = dataRow.id
      idReceptor = idDevice;
    }else{
      idEmitter = idDevice;
      idReceptor = dataRow.id
    }

    fetch("http://localhost:8081/device/unlinkTo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "token":getUserToken()
      },
      body: JSON.stringify({
          "idEmitter": idEmitter,
          "idReceptor": idReceptor
      })
    }).then(response => {
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
      }
      getListAvailableDevicesToLink();
      getListLinkedDevices();

      return response.json()
    }).then(resp => {
      if(!resp) alert("Ocorreu um erro ao desvincular o dispositivo!");
    })
    .catch(error => alert("Ocorreu um erro ao desvincular o dispositivo!"))
    
  }

  const columns = [
    { id: 'id', label: 'Id', minWidth: 100 },
    { id: 'description', label: 'Descrição', minWidth: 150 },
    { id: 'place', label: 'Localização', minWidth: 150},
    { id: 'type', label: 'Tipo', minWidth: 100},
    { id: 'actions', label: 'Ações', minWidth: 100, }
  ];

  return (
    <Container className='containerLD'>
        <Button onClick={handleOpenModalLink}>
          <LinkIcon />
        </Button>

        <Modal
            open={openModalLink}
            onClose={handleCloseModalLink}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
          <Box id="boxModalLinkDevice" sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
                Dispositivos disponíveis para vínculo:
            </Typography>

            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                { dataList[0].id !== undefined ? (
                <Paper className="paperTable" sx={{ width: '100%', overflow: 'hidden' }}>
                  <TableContainer sx={{ maxHeight: 440 }}>
                      <Table stickyHeader aria-label="sticky table">
                      <TableHead>
                          <TableRow>
                          {columns.map((column) => (
                              <TableCell
                              key={column.id}
                              align={column.align}
                              style={{ minWidth: column.minWidth }}
                              >
                              {column.label}
                              </TableCell>
                          ))}
                          </TableRow>
                      </TableHead>
                      <TableBody>
                          {dataList
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((row) => {
                                return (
                                  <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                                      {columns.map((column) => {
                                        const value = row[column.id];
                                        return (
                                            <TableCell key={column.id} align={column.align}>
                                                {column.id === "actions" && row.id > 0 ? (
                                                    <Box className='boxActions'>
                                                      <Button onClick={(e) => linkDevice(e, row)}>
                                                        <LinkIcon />
                                                      </Button>
                                                    </Box>
                                                ) : (
                                                <span className={"col_"+column.id}>
                                                    {column.format && typeof value === 'number'
                                                        ? column.format(value)
                                                        : value}
                                                </span>)}
                                            </TableCell>
                                        );
                                    }
                                  )}
                                  </TableRow>
                              );
                          })}
                      </TableBody>
                      </Table>
                  </TableContainer>
                  <TablePagination
                      className="footerTable"
                      rowsPerPageOptions={[3, 5]}
                      component="div"
                      count={dataList.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </Paper>
              ) : (
                <Paper className="paperTable noRecords">
                  <span>Não há dispositivos disponíveis!</span>
                  <p/>
                  <span>Verifique se os dispositivos estão ativos.</span>
                </Paper>
              )} 
            </Typography>

              <Typography id="modal-modal-title2" variant="h6" component="h2">
                  Dispositivos vínculados:
              </Typography>
              <Typography id="modal-modal-description2" sx={{ mt: 2 }}>
                { dataListItemsAvailable[0].id !== undefined ? (
                  <Paper className="paperTable" sx={{ width: '100%', overflow: 'hidden' }}>
                    <TableContainer sx={{ maxHeight: 440 }}>
                        <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                key={column.id}
                                align={column.align}
                                style={{ minWidth: column.minWidth }}
                                >
                                {column.label}
                                </TableCell>
                            ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {dataListItemsAvailable
                            .slice(pageItemsAvailable * rowsPerPageItemsAvailable, pageItemsAvailable * rowsPerPageItemsAvailable + rowsPerPageItemsAvailable)
                            .map((row) => {
                                return (
                                <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                                    {columns.map((column) => {
                                    const value = row[column.id];
                                    return (
                                        <TableCell key={column.id} align={column.align}>
                                            {column.id === "actions" && row.id > 0 ? 
                                            (
                                                <Box className='boxActions'>
                                                  <Button onClick={(e) => removeLinkDevice(e, row)}>
                                                    <LinkOffIcon />
                                                  </Button>
                                                </Box>
                                            )  : (
                                            <span className={"col_"+column.id}>
                                                {column.format && typeof value === 'number'
                                                    ? column.format(value)
                                                    : value}
                                            </span>)}
                                        </TableCell>
                                    );
                                    })}
                                </TableRow>
                                );
                            })}
                        </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        className="footerTable"
                        rowsPerPageOptions={[3, 5]}
                        component="div"
                        count={dataListItemsAvailable.length}
                        rowsPerPage={rowsPerPageItemsAvailable}
                        page={pageItemsAvailable}
                        onPageChange={handleChangePageItemsAvailable}
                        onRowsPerPageChange={handleChangeRowsPerPageItemsAvailable}
                    />
                  </Paper>
                ) : (
                  <Paper className="paperTable noRecords">
                    <span>Não há dispositivos vínculados!</span>
                  </Paper>
                )}
              </Typography>
            </Box>
        </Modal>
      <OnLoadUtils />
    </Container>
  );
}
