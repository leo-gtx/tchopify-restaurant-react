import FullCalendar from '@fullcalendar/react'; // => request placed at the top
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Icon } from '@iconify/react';
import { useSnackbar } from 'notistack5';
import clockFill from '@iconify/icons-eva/clock-fill';
import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
// material
import { useTheme } from '@material-ui/core/styles';
import { Card, Container, DialogTitle, useMediaQuery } from '@material-ui/core';
import { LoadingButton} from '@material-ui/lab';
// redux
import { useDispatch, useSelector } from 'react-redux';

// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import { DialogAnimate } from '../../components/animate';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { CalendarForm, CalendarStyle, CalendarToolbar } from '../../components/_dashboard/calendar';
// Utils
import {getDay} from '../../utils/utils';
// actions
import { handleUpdateBusinessHours } from '../../redux/actions/restaurant';
// ----------------------------------------------------------------------


export default function Calendar() {
  const {t} = useTranslation();
  const { themeStretch, setColor } = useSettings();
  const [isOpenModal, setOpenModal] = useState(false);
  const dispatch = useDispatch();
  const { restaurantId } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const calendarRef = useRef(null);
  const { enqueueSnackbar } = useSnackbar();
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState(isMobile ? 'listWeek' : 'timeGridWeek');
  const [selectedEvent, setSelectedEvent]  = useState();
  const restaurant = useSelector(state=>state.restaurants[restaurantId])
  const [events, setEvents] = useState(restaurant.businessHours)
  const [isSubmitting, setSubmitting] = useState(false)
  const navigate = useNavigate();

  useEffect(() => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      const newView = isMobile ? 'listWeek' : 'timeGridWeek';
      calendarApi.changeView(newView);
      setView(newView);
    }
  }, [isMobile]);

  const handleClickToday = () => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.today();
      setDate(calendarApi.getDate());
    }
  };

  const handleChangeView = (newView) => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.changeView(newView);
      setView(newView);
    }
  };

  const handleClickDatePrev = () => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.prev();
      setDate(calendarApi.getDate());
    }
  };

  const handleClickDateNext = () => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.next();
      setDate(calendarApi.getDate());
    }
  };

  const handleUpdateEvent = (event) =>{
    setEvents((prevState)=>{
      prevState[event.id] = event
      return [...prevState]
    })
  }

  const handleSelectEvent = (arg) => {
    setSelectedEvent(events[arg.event.id])
    handleOpenModal()
  };

  const handleOpenModal = () => {
    setOpenModal(true)
  }
  const handleCloseModal = () => {
    setOpenModal(false)
  };

  const handleSaveChanges = () =>{
    setSubmitting(true)
    const data = {
      restaurantId,
      businessHours: events
    }
    dispatch(handleUpdateBusinessHours(
      data,
      ()=>{
        enqueueSnackbar(t('flash.businessHoursSuccess'), { variant: 'success' })
        setSubmitting(false)
        navigate(PATH_DASHBOARD.store.stores)
      },
      (err)=>console.error(err)
       ))
  }

  return (
    <Page title="Store: Business Hours | Tchopify">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading={t('businessHours.title')}
          links={[
            { name: t('links.dashboard'), href: PATH_DASHBOARD.root },
            { name: t('links.restaurant'), href: PATH_DASHBOARD.store.root },
            { name: restaurant.name, href: PATH_DASHBOARD.store.stores },
           { name: t('links.businessHours') }
          ]}
          action={
            <LoadingButton
              variant="contained"
              startIcon={<Icon icon={clockFill} width={20} height={20} />}
              onClick={handleSaveChanges}
              loading={isSubmitting}
            >
              {t('actions.saveChanges')}
            </LoadingButton>
          }
        />

        <Card>
          <CalendarStyle>
            <CalendarToolbar
              date={date}
              view={view}
              onNextDate={handleClickDateNext}
              onPrevDate={handleClickDatePrev}
              onToday={handleClickToday}
              onChangeView={handleChangeView}
            />
            <FullCalendar
              weekends
              selectable
              businessHours
              events={events}
              eventClick={handleSelectEvent}
              ref={calendarRef}
              eventColor={setColor.main}
              rerenderDelay={10}
              initialDate={date}
              initialView={view}
              headerToolbar
              eventResizableFromStart
              nowIndicator
              height={isMobile ? 'auto' : 720}
              plugins={[listPlugin,  timeGridPlugin, interactionPlugin]}
            />
          </CalendarStyle>
        </Card>

        <DialogAnimate open={isOpenModal} onClose={handleCloseModal}>
          <DialogTitle>{selectedEvent && `${t('businessHours.titleModal')} ${getDay(selectedEvent.id)}` }</DialogTitle>

          <CalendarForm 
          event={selectedEvent} 
          onSave={handleUpdateEvent} 
          onCancel={handleCloseModal} />
        </DialogAnimate>
      </Container>
    </Page>
  );
}