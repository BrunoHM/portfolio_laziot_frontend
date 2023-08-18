import React, {useRef, useEffect } from 'react';
import { OnLoadUtils, CheckAuthValidity, getUserToken} from "../../components/helpers/helpers";
import './styles.scss';

import LinkDevice from '../../pages/linkDevice/linkDevice';

import Switch from '@mui/material/Switch';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';

import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

export default function Devices() {
    
    const [description, setDescription] = React.useState('');
    const [place, setPlace]             = React.useState('');
    const [type, setType]               = React.useState('');
    const [status, setStatus]           = React.useState([true, false]);
    
    const [switchDevice, setSwitchDevice] = React.useState([]);
    const [dataTable, setDataTable]       = React.useState([{}]);
    const [page, setPage]                 = React.useState(0);
    const [rowsPerPage, setRowsPerPage]   = React.useState(10);
    
    let recordsPerPage = 0;

    let filters = [];
        
    useEffect(() => {
        //Executa no render do componente
        CheckAuthValidity();
        getDevices();
    },[]);

    const handleChange1 = (event) => {
        setStatus([event.target.checked, status[1]]);
    };

    const handleChange2 = (event) => {
        setStatus([status[0], event.target.checked]);
    };

    const handleChangeDescription = (event) => {
        setDescription(event.target.value);
    };

    const handleChangePlace = (event) => {
        setPlace(event.target.value);
    };
    
    const handleChangeType = (event) => {
        setType(event.target.value);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
        recordsPerPage = +event.target.value;
        getDevices();
    };

    const handleSwitchDeviceActive = (event, idDevice) => {
        let copySwitchs = [...switchDevice];
        copySwitchs[idDevice] = !copySwitchs[idDevice];
        setSwitchDevice(copySwitchs);
        

        fetch("http://localhost:8081/device", {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              "token":getUserToken()
            },
            body: JSON.stringify({
                "id": idDevice,
                "state": copySwitchs[idDevice]
            })
          }
          ).then(response => {
            if (!response.ok) {
              throw new Error(`Request failed with status ${response.status}`)
            }
            setTimeout(function(){
                getDevices()
            }, 250);
            return response.json()
          }).then(resp => {
            if(!resp) alert("Ocorreu um erro ao atualizar o estado do dispositivo!");
          })
          .catch(error => alert("Ocorreu um erro ao atualizar o estado do dispositivo!"))

    };

    function setStatusCheckboxValues(){
        let statusChecks = new Array();
        filters[3] = [];

        if(status[0]){
            statusChecks = [1];
        }

        if(status[1]){
            statusChecks = statusChecks + [0];
        }

        let myFunc = num => Number(num);
        
        filters[3] = Array.from(String(statusChecks), myFunc);
        
        return filters[3];
    }

    function getDevices() {
        let filterType = "&type=";
        if(type !== "all") filterType = filterType+type.toLowerCase();

        const filterDescription = "&description="+description;
        const filterPlace = "&place="+place;
        const filterStatus = "&active="+setStatusCheckboxValues();

        fetch("http://localhost:8081/device?page=0&size="+recordsPerPage+filterDescription+filterPlace+filterType+filterStatus, {
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
            setDataRowsOnTable(data.content);
          })
          .catch(error => alert("Ocorreu um erro ao buscar os dados!"+error))
    }

    function setDataRowsOnTable(deviceDataRows) {

        let qtdDataRows = deviceDataRows.length;
        let dataRows = [{}];
        let arraySwitch = [{}];
        
        if(qtdDataRows > 0){
            for(var x = 0; x < qtdDataRows; x++){
                let activeValue = "Não";
                if(deviceDataRows[x].active){ activeValue = "Sim"; }

                dataRows[x] = {
                    id : deviceDataRows[x].id,
                    description : deviceDataRows[x].description,
                    place : deviceDataRows[x].place,
                    type : deviceDataRows[x].type,
                    active : activeValue
                };
                arraySwitch[deviceDataRows[x].id] = deviceDataRows[x].active;
            }
        }
        setSwitchDevice(
            arraySwitch
        );

        setDataTable(
            dataRows
        );
    }

    const columns = [
        { id: 'id', label: 'Id', minWidth: 100 },
        { id: 'description', label: 'Descrição', minWidth: 150 },
        { id: 'place', label: 'Localização', minWidth: 150},
        { id: 'type', label: 'Tipo', minWidth: 150},
        { id: 'active', label: 'Ativo', minWidth: 100, },
        { id: 'actions', label: 'Ações', minWidth: 150, }
    ];

    return (
        <Container>
            <OnLoadUtils/>
            <FormGroup id="filters">
                <Box id="boxTexts">
                    <TextField value={description} onChange={handleChangeDescription} className="texts" label="Descrição" variant="outlined" />
                    <TextField value={place} onChange={handleChangePlace} className="texts" label="Local" variant="outlined" />
                </Box>

                <Box id="type">
                    <FormControl fullWidth>
                        <InputLabel variant="standard" htmlFor="uncontrolled-native">
                        Tipo do dispositivo:
                        </InputLabel>
                        <NativeSelect value={type} onChange={handleChangeType} >
                            <option value={"all"}>Todos</option>
                            <option value={"Emissor"}>Emissor</option>
                            <option value={"Receptor"}>Receptor</option>
                        </NativeSelect>
                    </FormControl>
                </Box>

                <Box id="status">
                    <FormControlLabel control={<Checkbox checked={status[0]} onChange={handleChange1}/>} label="ativos"/>
                    <FormControlLabel control={<Checkbox checked={status[1]} onChange={handleChange2}/>} label="inativos" />
                </Box>
            </FormGroup>

            <Box id="search">
                <Button onClick={getDevices} variant="outlined">
                    Buscar
                </Button>
            </Box>

            { dataTable[0].id !== undefined ? (
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
                            {dataTable
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
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
                                                    <Switch className='switchDeviceActive'
                                                        checked={switchDevice[row.id]}
                                                        onChange={(e) => handleSwitchDeviceActive(e, row.id)}
                                                        inputProps={{ 'aria-label': 'controlled' }}
                                                    />
                                                    <LinkDevice props={row}/>
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
                        rowsPerPageOptions={[10, 25, 50]}
                        component="div"
                        count={dataTable.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
            ) : (
                <Paper id="noDevices" className="paperTable noRecords">
                    <span>Dispositivos não encontrados com os filtros aplicados!</span>
                </Paper>
            )}
        </Container>
    );
}
