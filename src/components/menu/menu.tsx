import React, {useEffect, createContext } from 'react';
import './styles.scss';

import img from "../../teste/homeBackground4.png";

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

import LoginPage from '../../pages/login/login';
import Profile from '../../pages/profile/profile'

import DevicesPage from '../../pages/devices/devices';
import EventsPage from '../../pages/events/events';

import ActionsPage from '../../pages/actions/actions';
import UploadCode from '../../pages/uploadCode/uploadCode';
import UserParameters from '../../pages/userParameters/UserParameters';

export const AuthContext = React.createContext({ "codToken": "", "expiresAt": 0, "userName": "", "sucess": false });

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs() {
  const [value, setValue] = React.useState(0);
  const [logged, setLogged] = React.useState<boolean>(false);
  let [authObj, setAuthObj] = React.useState({ "codToken": "", "expiresAt": 0, "userName": "", "sucess": false });


  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const successCallBackData = (data: { "codToken": string, "expiresAt": number, "userName": string, "sucess": boolean }) => {
    setAuthObj({"codToken": data.codToken, "expiresAt": data.expiresAt, "userName": data.userName, "sucess": data.sucess});
    if (data.sucess) {
      setLogged(data.sucess);
    }
  }

  let ShowLoggedMenu = () => {
    if (!logged) {
      return (
        <div>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs className="menuNav" onChange={handleChange} aria-label="basic tabs example">
                <Tab label="Home"    {...a11yProps(0)} />
                <Tab label="Parâmetros"    {...a11yProps(1)} />
                <Tab label="Códigos"  {...a11yProps(2)} />
                <Tab label="Ações"  {...a11yProps(3)} />
                <Tab label="Dispositivos" {...a11yProps(4)} />
                <Tab label="Eventos"  {...a11yProps(5)} />
                <Tab label={String(authObj.userName)} {...a11yProps(6)} />
              </Tabs>
            </Box>

            <TabPanel value={value} index={0}>
              <div id="imgBackground" style={{ backgroundImage: `url(${img})` }}/>
            </TabPanel>
            
            <TabPanel value={value} index={1}>
              <UserParameters/>
            </TabPanel>

            <TabPanel value={value} index={2}>
              <UploadCode/>
            </TabPanel>

            <TabPanel value={value} index={3}>
              <ActionsPage/>
            </TabPanel>

            <TabPanel  value={value} index={4}>
              <DevicesPage/>
            </TabPanel>
            
            <TabPanel value={value} index={5}>
              <EventsPage/>
            </TabPanel>
            
            <TabPanel value={value} index={6}>
              <Profile/>
            </TabPanel>
        </div>
      )
    } else {
      return (
        <div>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs className="menuNav" onChange={handleChange} aria-label="basic tabs example">
              <Tab label="Home"    {...a11yProps(0)} />
              <Tab label="Login"   {...a11yProps(1)} />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            <div id="imgBackground" style={{ backgroundImage: `url(${img})` }}/>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <LoginPage callBack={successCallBackData} />
          </TabPanel>
        </div>
      )
    }
  };

  return (
    <AuthContext.Provider value={authObj}>
      <Box id="boxMenu" sx={{ width: '100%' }}>
        <ShowLoggedMenu/>
      </Box>
    </AuthContext.Provider>
  );
}