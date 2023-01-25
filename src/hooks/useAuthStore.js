//realizar cualquier interaccion con la parte del auth de nuestro store

import { useDispatch, useSelector } from "react-redux";
import { calendarApi } from "../api";
import { onLogoutCalendar } from "../store";
import { clearErrorMessage, onChecking, onLogin, onLogout } from "../store/auth/authSlice";

export const useAuthStore = () => {

    const { status, user, errorMessage } = useSelector( state => state.auth );
    const dispatch = useDispatch();

    const startLogin = async({ email, password }) => {
        
        dispatch( onChecking() );

        try {
            
            const { data } = await calendarApi.post('/auth',{
                email, 
                password
            });
            localStorage.setItem('token', data.token);
            localStorage.setItem('token-init-date', new Date().getTime());
            dispatch( onLogin({ name: data.name, uid: data.uid}) );

        } catch (error) {
            dispatch(onLogout('Credenciales incorrectas'));
            setTimeout(() => {
                dispatch(clearErrorMessage());
            }, 10);
        }
    }

    //startRegister
    const startRegister = async({ name, email, password}) => {
        dispatch( onChecking() );

        try {
            const { data } = await calendarApi.post('/auth/new',{
                name,
                email,
                password
            });
            localStorage.setItem('token', data.token);
            localStorage.setItem('token-init-date', new Date().getTime());
            dispatch( onLogin({name: data.name, uid: data.uid}));

        } catch (error) {
            //si viene la data coge msg
            dispatch(onLogout(error.response.data?.msg || ''));
            setTimeout(() => {
                dispatch(clearErrorMessage());
            }, 10);
        }
    }

    //checkAuthToken
    const checkAuthToken = async(  ) => {
        const token = localStorage.getItem('token');
        if(!token) return dispatch( onLogout() );

        try {
            const { data } = await calendarApi.get('/auth/renew');
            localStorage.setItem('token', data.token);
            localStorage.setItem('token-init-date', new Date().getTime());
            dispatch( onLogin({name: data.name, uid: data.uid}));
        } catch (error) {
            localStorage.clear();
            dispatch( onLogout() );
        }
    }

    const startLogout = () => {
        //limpiar el store
        dispatch( onLogoutCalendar() );
        //como forzar el relogeo de pagina
        localStorage.clear();
        dispatch( onLogout() );
    }

    return{
        //Propiedades
        status, 
        user, 
        errorMessage,
        //Metodos
        startLogin,
        startRegister,
        checkAuthToken,
        startLogout,
    }
}