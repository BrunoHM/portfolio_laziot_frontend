import React, {useRef, useEffect } from 'react';
import { OnLoadUtils, CheckAuthValidity, getUserToken} from "../../components/helpers/helpers";

import './styles.scss';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

import TextField from '@mui/material/TextField';

import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';


export default function Events() {

    const [dataInicial, setDataInicial] = React.useState("");
    const [dataFinal, setDataFinal]     = React.useState("");

    const [executed, setExecuted]       = React.useState([true, false]);
    const [manual, setManual]           = React.useState([true, false]);
    
    const [dataTable, setDataTable]     = React.useState([{}]);
    const [page, setPage]               = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(20);
    const [totalRecordsTable, setTotalRecordsTable] = React.useState(0);
    
    let pageRecords = 0;
    let recordsPerPage = 0;

    useEffect(() => {
        //Executa no render do componente
        CheckAuthValidity();
        getEvents();
    },[]);

    const handleChangeManual1 = (event) => {
        setManual([event.target.checked, manual[1]]);
    };

    const handleChangeManual2 = (event) => {
        setManual([manual[0], event.target.checked]);
    };

    const handleChangeExecuted1 = (event) => {
        setExecuted([event.target.checked, executed[1]]);
    };

    const handleChangeExecuted2 = (event) => {
        setExecuted([executed[0], event.target.checked]);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        pageRecords = newPage;
        //getEvents();
    };
    
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
        pageRecords = 0;
        recordsPerPage = +event.target.value;
        //getEvents();
    };

    function setStatusCheckboxValues(){

        let checkFilterManual = "";
        let checkFilterExecuted = "";

        if(executed[0]){
            checkFilterExecuted = "0";
        }

        if(executed[1]){
            checkFilterExecuted = checkFilterExecuted + "1";
        }

        if(manual[0]){
            checkFilterManual = "0";
        }

        if(manual[1]){
            checkFilterManual = checkFilterManual + "1";
        }

        let convertToNum = num => Number(num);
        const newArray = Array.from(String(checkFilterExecuted), convertToNum);
        const newArray2 = Array.from(String(checkFilterManual), convertToNum);

        const filtersCheck = new Array();
        filtersCheck.push(newArray);
        filtersCheck.push(newArray2);

        return filtersCheck;
    }

    function formataData(date){
        if(date > 0){
            let dataFull = date.$y+"-";

            const month = date.$M+1;
            if(month < 10){
                dataFull += "0";
            }
            dataFull += (month)+"-"

            const day = date.$D;
            if(day < 10){
                dataFull += "0";
            }
            dataFull += (day)

            return dataFull;
        }
    }

    function getEvents() {

        const filtersCheck = setStatusCheckboxValues();
        const checkFilterExecuted = "&executed="+filtersCheck[0];
        const checkFilterManual = "&manual="+filtersCheck[1];

        let dateInit = "";
        let dateEnd  = "";

        if(Number(dataInicial) > 0){
            dateInit ="&dateInit="+formataData(dataInicial);
        }
        if(Number(dataFinal) > 0){
            dateEnd  ="&dateEnd="+formataData(dataFinal);
        }

        if(recordsPerPage === 0) recordsPerPage = 20;
  
        fetch("http://localhost:8081/event?page="+pageRecords+"&size="+recordsPerPage+dateInit+dateEnd+checkFilterExecuted+checkFilterManual, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "token":getUserToken()
            }
          }
          ).then(response => {
            // indicates whether the response is successful (status code 200-299) or not
            if (!response.ok) {
              throw new Error(`Request failed with status ${response.status}`)
            }
            return response.json()
          }).then(data => {
            setTotalRecordsTable(data.length);
            setDataRowsOnTable(data);
          })
          .catch(error => console.log(error))

    }

    function setDataRowsOnTable(deviceDataRows) {
        let qtdDataRows = deviceDataRows.length;
        let dataRows = [{}];

        if(qtdDataRows > 0){
            for(var x = 0; x < qtdDataRows; x++){
                let isManual = "Não";
                let isExecuted = "Não";

                if(deviceDataRows[x].manual[0]){ isManual = "Sim"; }
                if(deviceDataRows[x].executed[0]){ isExecuted = "Sim"; }

                dataRows[x] = {
                    id : deviceDataRows[x].id,
                    action : deviceDataRows[x].actions[0],
                    date : deviceDataRows[x].date,
                    time : deviceDataRows[x].time,
                    manual : isManual,
                    executed : isExecuted
                };
            }
        }

        setDataTable(dataRows);
        
    }


    const columns = [
        { id: 'id', label: 'Id', minWidth: 100 },
        { id: 'action', label: 'Ação', minWidth: 150 },
        { id: 'date', label: 'Data', minWidth: 150},
        { id: 'time', label: 'Horário', minWidth: 150},
        { id: 'manual', label: 'Manual', minWidth: 100, },
        { id: 'executed', label: 'Executado', minWidth: 100, }
    ];

    return (
        <Container>
            <FormGroup id="filters">
                <Box id="boxDates">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            inputFormat="DD/MM/YYYY"
                            label="Data Inicial"
                            value={dataInicial}
                            onChange={(newValue) => {
                                setDataInicial(newValue);
                            }}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            inputFormat="DD/MM/YYYY"
                            label="Data Final"
                            value={dataFinal}
                            onChange={(newValue) => {
                                setDataFinal(newValue);
                            }}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>
                </Box>

                <Box id="checks">
                    <Box sx={{ width: '100%'}}>
                        <FormControlLabel control={<Checkbox checked={manual[0]} onChange={handleChangeManual1}/>} label="automáticos" />
                        <FormControlLabel control={<Checkbox checked={manual[1]} onChange={handleChangeManual2}/>} label="manuais"/>
                    </Box>

                    <Box sx={{ width: '100%'}}>
                        <FormControlLabel control={<Checkbox checked={executed[0]} onChange={handleChangeExecuted1}/>} label="pendentes" />
                        <FormControlLabel control={<Checkbox checked={executed[1]} onChange={handleChangeExecuted2}/>} label="executados"/>
                    </Box>
                </Box>

                <OnLoadUtils />
            </FormGroup>

            <Box id="search">
                <Button onClick={getEvents} variant="outlined">
                    Buscar
                </Button>
            </Box>
            { dataTable[0].id !== undefined ? (
                <Paper id="paperTable" sx={{ width: '100%', overflow: 'hidden' }}>
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
                                <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                                    {columns.map((column) => {
                                    const value = row[column.id];
                                    return (
                                        <TableCell key={column.id} align={column.align}>
                                            <span>
                                                {column.format && typeof value === 'number'
                                                    ? column.format(value)
                                                    : value}
                                            </span>
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
                        id="footerTable"
                        rowsPerPageOptions={[10, 20, 50]}
                        component="div"
                        count={totalRecordsTable}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
            ) : (
                <Paper id="noDevices" className="paperTable noRecords">
                    <span>Eventos não encontrados com os filtros aplicados!</span>
                </Paper>
            )}
        </Container>
    );
}
