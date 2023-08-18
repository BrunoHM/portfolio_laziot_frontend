import React, {useRef, useEffect } from 'react';
import './styles.scss';
import {getStatusServer} from "../../components/helpers/helpers";

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';


export default function LoginPage(props) {
    let auth2;
    let btnRef = React.createRef(HTMLInputElement);
    //const [status, setStatus] = React.useState(false);

    let PrepareLoginButton = () => {
        const objBtn = document.getElementById("btnLoggin");

        auth2.attachClickHandler(
            objBtn,
            {},
            (googleUser) => {
                validateUserLogin(googleUser);
            },
            (error) => {
                alert(JSON.stringify(error, undefined, 2));
                return false;
            }
        );
    };

    let GoogleSDK = () => {
        window["googleSDKLoaded"] = () => {
            window["gapi"].load("auth2", () => {
                auth2 = window["gapi"].auth2.init({
                    client_id: "123456789000-32LetrasENumerosRandomicos.apps.googleusercontent.com",
                    cookiepolicy: "single_host_origin",
                    scope: "profile email",
                });
                PrepareLoginButton();
            });
        };
        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {
                return;
            }
            js = d.createElement(s);
            js.id = id;
            js.src = "https://apis.google.com/js/platform.js?onload=googleSDKLoaded";
            fjs.parentNode.insertBefore(js, fjs);
        })(document, "script", "google-jssdk");
    };

    useEffect(() => {
        GoogleSDK();
        //setStatus(getStatusServer());
    },[]);

    const validateUserLogin = (respGoogle) => {
        let userTokenJWT = respGoogle.getAuthResponse();
        userTokenJWT = userTokenJWT.id_token;

        let userEmail = respGoogle.getBasicProfile();
        userEmail = userEmail.ix;
        
        console.log(userTokenJWT);
        console.log(userEmail);

        fetch("http://localhost:8081/user/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "userTokenJWT": userTokenJWT
            })
        }).then(response => {
            if (!response.ok) {
                throw new Error(`Request failed with status ${response.status}`)
            }
            getHashUniqueCodeUser(respGoogle, userEmail);
        }).then(resp => {
            if(!resp && resp !== undefined) alert("Ocorreu um erro ao logar no sistema 1!");
        }).catch(error => alert("Ocorreu um erro ao logar no sistema 2!"))

    }

    const getHashUniqueCodeUser = (respGoogle, email) => {
        
        fetch("http://localhost:8081/user/getHashIOT", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "email":email
            }
        }).then(response => {
            if (!response.ok) {
                throw new Error(`Request failed with status ${response.status}`)
            }
            return response.json();
        }).then(data => {
            const authObject = {
                "codToken" : data.userUniqueHashCode,
                "expiresAt" : respGoogle.getAuthResponse().expires_at, //horário de expiração do token
                "userName" : respGoogle.getBasicProfile().JZ, //nome do usuário
                "sucess" : true
            };            
            goBack(authObject);
        })
        .catch(error => alert("Ocorreu um erro ao buscar os dados!"+error));
    }

    const goBack = (resp) => {
        props.callBack(resp);
    }

    return (
        <Container>
            <Box className='loginBox'>
                <Button id="btnLoggin" variant="outlined"
                    className="loginBtn loginBtn--google"
                    ref={btnRef}
                >
                    Acessar com Google
                </Button>
            </Box>
        </Container>
    );
}