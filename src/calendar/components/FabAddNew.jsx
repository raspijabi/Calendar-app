import { addHours } from "date-fns";
import { useCalendarStore, useUiStore } from "../../hooks"

export const FabAddNew = () => {

    const {openDateModal} = useUiStore();

    const { setActiveEvent } = useCalendarStore();
    
    const handleClickEvent = () => {
        setActiveEvent({
            title: '',
            notes: '',
            start: new Date(),
            end: addHours( new Date(), 2),
            bgColor: '#fafafa',
            user: {
                _id: '123',
                name: 'Daniel'
            }
        });
        openDateModal();
    }

  return (
    <button
        className="btn btn-primary fab"
        onClick={handleClickEvent}
    >
        <i className="fas fa-plus"></i>
    </button>
  )
}
