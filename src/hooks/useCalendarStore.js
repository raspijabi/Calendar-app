import { useSelector, useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import { calendarApi } from '../api';
import { convertEventToDateEvents } from '../helpers';
import { onAddNewEvent, onDeleteEvent, onLoadEvents, onSetActiveEvent, onUpdateEvent } from '../store/calendar/calendarSlice';

export const useCalendarStore = () => {
  
    const dispatch = useDispatch();
  
    const { events, activeEvent } = useSelector(state => state.calendar);
    const { user } = useSelector(state => state.auth);

    const setActiveEvent = (calendarEvent) => {
        dispatch(onSetActiveEvent(calendarEvent));
    }
    
    const startSavingEvent = async( calendarEvent ) => {
        
        try {
            if(calendarEvent.id){
                await calendarApi.put(`/events/${calendarEvent.id}`, calendarEvent);
                dispatch(onUpdateEvent({...calendarEvent, user}));
                return
    
            }
            
            const { data } = await calendarApi.post('/events', calendarEvent);
            dispatch(onAddNewEvent({ ...calendarEvent, id: data.evento.id, user }));
        } catch (error) {
            console.log(error);
            Swal.fire('Error al guardar', error.response.data.msg, 'error');
        }
    }

    const startDeletingEvent = async() => {
        
        try {
            await calendarApi.delete(`/events/${activeEvent.id}`);
            Swal.fire('Borrado con éxito','','success');
            dispatch(onDeleteEvent());
        } catch (error) {
            console.log(error);
            Swal.fire('Error al borrar',error.response.data.msg, 'error');
        }
    }

    const startLoadingEvents = async() => {
        try {
            const { data } = await calendarApi.get('/events');
            const events = convertEventToDateEvents(data.eventos);
            dispatch(onLoadEvents(events));
            console.log(events);
        } catch (error) {
            console.log('Error cargando eventos');
            console.log(error);
        }
    }
  
    return {
        //Propiedades
        events,
        activeEvent,
        //doble negacion por si es null regresa falso
        hasEventSelected: !!activeEvent,

        //Metodos
        setActiveEvent,
        startSavingEvent,
        startDeletingEvent,
        startLoadingEvents,
    }
}
