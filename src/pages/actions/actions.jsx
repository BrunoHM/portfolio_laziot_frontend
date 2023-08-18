import React, {useRef, useEffect } from 'react';
import { OnLoadUtils, CheckAuthValidity, getUserToken} from "../../components/helpers/helpers";
import './styles.scss';

import Switch from '@mui/material/Switch';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';

import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

import { styled } from "@mui/material/styles";

import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";

let descriptionNewAction = "";

const DescriptionNewActionLocalComponent = () => {
    const [description, setDescription] = React.useState('');

    useEffect(() => {
        setDescription(descriptionNewAction);
    },[]);

    const handleChangeDescriptionNewAction = (event) => {
        setDescription(event.target.value);
        descriptionNewAction = event.target.value;  
    };

    return(
        <FormControl className='formDataNewAction'>
            <TextField id="descriptionAction2" value={description} onChange={handleChangeDescriptionNewAction} className="texts" label="Descrição da nova ação" variant="outlined" />
        </FormControl>
    )
}

export default function Actions() {

    const columns = [
        { id: 'id', label: 'Id', minWidth: 100},
        { id: 'description', label: 'Descrição', minWidth: 150},
        { id: 'doubleAction', label: 'Dupla Ação', minWidth: 150},
        { id: 'delay', label: 'Delay', minWidth: 150},        
        { id: 'deviceTriggered', label: 'Dispositivo Alvo', minWidth: 100},
        { id: 'active', label: 'Ativo', minWidth: 100},
        { id: 'actions', label: 'Ações', minWidth: 100},
    ];

    const FireNav = styled(List)({
        "& .MuiListItemButton-root": {
          paddingLeft: 24,
          paddingRight: 24
        },
        "& .MuiListItemIcon-root": {
          minWidth: 0,
          marginRight: 16
        },
        "& .MuiSvgIcon-root": {
          fontSize: 20
        }
      });

    const [open, setOpen] = React.useState(false);
    
    const [doubleActionNewAction, setDoubleActionNewAction] = React.useState(false);
    const [delayNewAction, setDelayNewAction] = React.useState(0);
    const [triggerIOPin, setTriggerIOPin] = React.useState(0);
    const [dispositivoAlvoNewAction, setDispositivoAlvoNewAction] = React.useState(0);

    const [deviceDataRows, setdeviceDataRows] = React.useState([]);
    
    const [description, setDescription] = React.useState('');
    const [doubleAction, setDoubleAction] = React.useState([true, false]);
    const [status, setStatus] = React.useState([true, false]);
    
    const [switchAction, setSwitchAction] = React.useState([]);
    const [dataTable, setDataTable] = React.useState([{}]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    let recordsPerPage = 0;

    useEffect(() => {
        //Executa no render do componente
        CheckAuthValidity();
        getActions();
        getDevices();
    },[]);

    const handleChangeStatus1 = (event) => {
        setStatus([event.target.checked, status[1]]);
    };

    const handleChangeStatus2 = (event) => {
        setStatus([status[0], event.target.checked]);
    };

    const handleChangeDoubleAction1 = (event) => {
        setDoubleAction([event.target.checked, doubleAction[1]]);
    };

    const handleChangeDoubleAction2 = (event) => {
        setDoubleAction([doubleAction[0], event.target.checked]);
    };

    const handleChangeDescription = (event) => {
        setDescription(event.target.value);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
        recordsPerPage = +event.target.value;
    };
    
    const handleDelayNewAction = (event) => {
        setDelayNewAction(+event.target.value);
    };

    const handleDispositivoAlvoNewAction = (event) => {
        setDispositivoAlvoNewAction(+event.target.value);
    };
    
    const handleTriggerIOPin = (event) => {
        setTriggerIOPin(+event.target.value);
    };

    const handleSwitchActionActive = (event, idDevice) => {

        let copySwitchs = [...switchAction];
        copySwitchs[idDevice] = !copySwitchs[idDevice];
        setSwitchAction(copySwitchs);
        
        fetch("http://localhost:8081/action", {
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
                getActions()
            }, 250);
            return response.json()
          }).then(resp => {
            if(!resp) alert("Ocorreu um erro ao atualizar o estado da ação!");
          })
          .catch(error => alert("Ocorreu um erro ao atualizar o estado da ação!"))

    };

    function handleDoubleAction(bolDelay) {
        if(!bolDelay){
            setDelayNewAction(0); 
        }
        setDoubleActionNewAction(bolDelay);
    }

    function setStatusCheckboxValues(){
        let statusChecks = new Array();
        let doubleActionChecks = new Array();

        if(status[0]){
            statusChecks = [1];
        }

        if(status[1]){
            statusChecks = statusChecks + [0];
        }

        if(doubleAction[0]){
            doubleActionChecks = [0];
        }

        if(doubleAction[1]){
            doubleActionChecks = doubleActionChecks + [1];
        }

        let myFunc = num => Number(num);
        
        const filtersCheck = new Array();
        filtersCheck.push(Array.from(String(statusChecks), myFunc));
        filtersCheck.push(Array.from(String(doubleActionChecks), myFunc));

        return filtersCheck;
    }

    function getActions(){
        const filterChecks      = setStatusCheckboxValues();
        const checkStatus       = "&active="+filterChecks[0];
        const checkDoubleAction = "&doubleAction="+filterChecks[1];

        fetch("http://localhost:8081/action?page=0&size="+recordsPerPage+description+checkStatus+checkDoubleAction, {
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
        .catch(error => alert("Ocorreu um erro ao buscar os dados!"+error))

    }
    
    function getDevices(){
        fetch("http://localhost:8081/device/simplified", {
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
            setDeviceData(data);
        })
        .catch(error => alert("Ocorreu um erro ao buscar os dados!"+error))

    }

    function setDeviceData(deviceDataRows) {

        let qtdDataRows = deviceDataRows.length;
        let dataRows = [{}];

        if(qtdDataRows > 0){
            for(var x = 0; x < qtdDataRows; x++){
                dataRows[x] = {
                    id : deviceDataRows[x].id,
                    description : deviceDataRows[x].description
                };
            }
        }
        
        setdeviceDataRows(
            dataRows
        );

    }

    function setDataRowsOnTable(actionDataRows) {

        let qtdDataRows = actionDataRows.length;
        let dataRows = [{}];
        let arraySwitch = [{}];

        if(qtdDataRows > 0){
            for(var x = 0; x < qtdDataRows; x++){
                let isDoubleAction = "Não";
                let isActive = "Não";

                if(actionDataRows[x].doubleAction){ isDoubleAction = "Sim"; }
                if(actionDataRows[x].active){ isActive = "Sim"; }

                dataRows[x] = {
                    id : actionDataRows[x].id,
                    description : actionDataRows[x].description,
                    doubleAction : isDoubleAction,
                    delay : actionDataRows[x].delay,
                    deviceTriggered : actionDataRows[x].deviceDescription,
                    active : isActive
                };
                
                arraySwitch[actionDataRows[x].id] = actionDataRows[x].active;
            }
        }
        
        setSwitchAction(
            arraySwitch
        );

        setDataTable(
            dataRows
        );

    }

    function postAction(){
        fetch("http://localhost:8081/action", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "token":getUserToken()
        },
        body: JSON.stringify({
            "description" : descriptionNewAction,
            "doubleAction" : doubleActionNewAction,
            "triggerIOPin": triggerIOPin,
            "delay": delayNewAction,
            "deviceId": dispositivoAlvoNewAction,
            "active" : true
        })
        }).then(response => {
        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`)
        }
            return response.json()
        }).then(resp => {
            descriptionNewAction = "";
            setDoubleActionNewAction(false);
            setDelayNewAction(0);
            setTriggerIOPin(0);
            setDispositivoAlvoNewAction(0);
            
            getActions();
            if(!resp) alert("Ocorreu um erro ao criar a ação!");
        }) .catch(error => {
            alert("Ocorreu um erro ao criar a ação!")
        });

    }

    return (
        <Container>
            <OnLoadUtils/>

            <FormGroup id="filters">
                <Box id="boxTextsActions">
                    <TextField id="descriptionAction" value={description} onChange={handleChangeDescription} className="texts" label="Descrição" variant="outlined" />
                </Box>

                <Box id="checksAction">
                    <div className="spacer"/>
                    <Box id="doubleAction">
                        <FormControlLabel control={<Checkbox checked={doubleAction[0]} onChange={handleChangeDoubleAction1}/>} label="Simples"/>
                        <FormControlLabel control={<Checkbox checked={doubleAction[1]} onChange={handleChangeDoubleAction2}/>} label="Dupla" />
                    </Box>
                    <div className="spacer"/>
                    <Box id="statusAction">
                        <FormControlLabel control={<Checkbox checked={status[0]} onChange={handleChangeStatus1}/>} label="ativos"/>
                        <FormControlLabel control={<Checkbox checked={status[1]} onChange={handleChangeStatus2}/>} label="inativos" />
                    </Box>
                </Box>
            </FormGroup>


            <Box id="search">
                <Button onClick={getActions} variant="outlined">
                    Buscar
                </Button>
            </Box>



            <Box>
                <Paper id="paperNewAction" elevation={0}>
                    <FireNav component="nav" disablePadding>
                        
                        <Box sx={{ pb: open ? 2 : 0 }} >
                            
                            <ListItemButton
                                alignItems="flex-start"
                                onClick={() => setOpen(!open)}
                                sx={{ px: 3, pt: 2.5, pb: open ? 0 : 2.5, "&:hover, &:focus": { "& svg": { opacity: open ? 1 : 0 } } }}
                            >
                                <ListItemText
                                    primary="Adicionar nova ação"
                                    primaryTypographyProps={{ fontSize: 15, fontWeight: "medium", lineHeight: "20px", mb: "2px" }}
                                    secondaryTypographyProps={{ noWrap: true, fontSize: 12, lineHeight: "16px" }}
                                    sx={{ my: 0 }}
                                />
                            </ListItemButton>
                        {open ? (
                            <Box id="newActionBox">
                                <DescriptionNewActionLocalComponent/>
                                
                                <FormControl className='formDataNewAction'>
                                    <FormLabel id="demo-controlled-radio-buttons-group">Acionamento Duplo</FormLabel>
                                    <RadioGroup
                                        aria-labelledby="demo-controlled-radio-buttons-group"
                                        name="controlled-radio-buttons-group"
                                        value={doubleActionNewAction}
                                    >
                                        <FormControlLabel value={false} onClick={() => { handleDoubleAction(false); }} control={<Radio />} label="Não" />
                                        <FormControlLabel value={true} onClick={() => { handleDoubleAction(true); }} control={<Radio />} label="Sim" />
                                    </RadioGroup>
                                </FormControl>
            
                                <FormControl className='formDataNewAction'>
                                    <TextField disabled={!doubleActionNewAction} id="outlined-number" label="Delay(segundos)" type="number" value={delayNewAction} onChange={handleDelayNewAction} InputLabelProps={{ shrink: true }}/>
                                </FormControl>

                                <FormControl className='formDataNewAction' InputLabelProps={{ shrink: true }} sx={{minWidth: 200 }}>
                                    <InputLabel id="inputTriggerDevice" >Dispositivo Alvo</InputLabel>
                                    <Select labelId="demo-simple-select-filled-label" id="demo-simple-select-filled" value={dispositivoAlvoNewAction} onChange={handleDispositivoAlvoNewAction} >
                                        {
                                            deviceDataRows.map((row) => {
                                                return (
                                                    <MenuItem value={row.id}>{row.description}</MenuItem>
                                                )
                                            }
                                        )}
                                        
                                    </Select>
                                </FormControl>
                
                                <FormControl className='formDataNewAction' variant="filled" sx={{ m: 1, minWidth: 120 }}>
                                    <InputLabel id="demo-simple-select-filled-label">Porta IO Acionada</InputLabel>
                                    <Select labelId="demo-simple-select-filled-label" id="demo-simple-select-filled" value={triggerIOPin} onChange={handleTriggerIOPin} >
                                        <MenuItem value={0}>0</MenuItem>
                                        <MenuItem value={2}>2</MenuItem>
                                    </Select>
                                </FormControl>

                                <Box id="search">
                                    <Button onClick={postAction} variant="outlined">
                                        Criar Ação
                                    </Button>
                                </Box>
                            </Box>
                        ) : (<div/>) }
                        </Box>
                    </FireNav>
                </Paper>
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
                                                        checked={switchAction[row.id]}
                                                        onChange={(e) => handleSwitchActionActive(e, row.id)}
                                                        inputProps={{ 'aria-label': 'controlled' }}
                                                    />
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
                    <span>Ações não encontradas com os filtros aplicados!</span>
                </Paper>
            )}
        </Container>
    )
}