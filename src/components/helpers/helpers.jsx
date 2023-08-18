import React, {useContext } from "react";
import {AuthContext} from "../menu/menu";

let authObj = { "codToken": "", "expiresAt": 0, "userName": "", "sucess": false };
let statusServer = false;

export function setStatusServer(status) {
    statusServer = status;
}

export const getStatusServer = () => {
    return statusServer;
}

export const CheckAuthValidity = () => {
    const timestampExpiresAtAuth = authObj.expiresAt;
    const timestampNow = new Date().getTime();
    if(timestampNow > timestampExpiresAtAuth){
        document.location.reload();
    }
}

export const getUserToken = () => {
    if(authObj.codToken <= 0){
        InitilizeAuthObject();
    }

    return authObj.codToken;
}

const InitilizeAuthObject = () => {
    const value = useContext(AuthContext);
    authObj = value;
}


export const OnLoadUtils = () => {
    InitilizeAuthObject();
}