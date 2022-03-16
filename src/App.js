import logo from './cna.png';
import './App.css';
import React from "react";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {Inject,ScheduleComponent, Day, Week, WorkWeek, Month, Agenda, ResourcesDirective, ResourceDirective} from '@syncfusion/ej2-react-schedule';
import { extend,loadCldr ,L10n } from '@syncfusion/ej2-base';

import { DialogUtility } from '@syncfusion/ej2-popups';

import 'bootstrap/dist/css/bootstrap.css';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';


import {createElement } from '@syncfusion/ej2-base';
import { DropDownList } from '@syncfusion/ej2-dropdowns';

import { ListView } from '@syncfusion/ej2-lists';
import { TextBox } from '@syncfusion/ej2-inputs'
// import { scheduleData } from './datasource';

// diccionario de idioma para botones 
import * as numberingSystems from "./culture-files/numberingSystems.json";
import * as gregorian from "./culture-files/ca-gregorian.json";
import * as numbers from "./culture-files/numbers.json";
import * as timeZoneNames from "./culture-files/timeZoneNames.json";

loadCldr(numberingSystems, gregorian, numbers, timeZoneNames);
L10n.load({
  
  es: {
    schedule: {
      day: "Día",
      week: "Semana",
      workWeek: "Semana de trabajo",
      month: "Mes",
      agenda: "Agenda",
      weekAgenda: "Agenda de la semana",
      workWeekAgenda: "Agenda de la semana laboral",
      monthAgenda: "Agenda del mes",
      today: "Hoy",
      noEvents: "No hay eventos",
      emptyContainer: "No hay eventos programados para este día.",
      allDay: "Todo el dia",
      start: "comienzo",
      end: "Final",
      more: "más",
      close: "Cerca",
      cancel: "Cancelar",
      noTitle: "(Sin título)",
      delete: "Eliminar",
      deleteEvent: "Este evento",
      deleteMultipleEvent: "Eliminar múltiples eventos",
      selectedItems: "Artículos seleccionados",
      deleteSeries: "Serie completa",
      edit: "Editar",
      editSeries: "Serie completa",
      editEvent: "Este evento",
      createEvent: "Crear",
      subject: "Tema",
      addTitle: "Añadir título",
      moreDetails: "Más detalles",
      save: "Salvar",
      editContent: "¿Cómo le gustaría cambiar la cita en la serie?",
      deleteContent: "¿Seguro que quieres eliminar este evento?",
      deleteMultipleContent:
        "¿Estás seguro de que deseas eliminar los eventos seleccionados?",
      newEvent: "Nuevo evento",
      title: "Título",
      location: "Ubicación",
      description: "Descripción",
      timezone: "Zona horaria",
      startTimezone: "Zona horaria de inicio",
      endTimezone: "Zona horaria final",
      repeat: "Repetir",
      saveButton: "Salvar",
      cancelButton: "Cancelar",
      deleteButton: "Eliminar",
      recurrence: "Reaparición",
      wrongPattern: "El patrón de recurrencia no es válido.",
      seriesChangeAlert:
        "¿Desea cancelar los cambios realizados en instancias específicas de esta serie y volver a vincularlos con toda la serie?",
      createError:
        "La duración del evento debe ser más corta que la frecuencia con la que ocurre. Acorte la duración o cambie el patrón de recurrencia en el editor de eventos de recurrencia.",
      sameDayAlert:
        "Dos ocurrencias del mismo evento no pueden ocurrir en el mismo día.",
      editRecurrence: "Editar recurrencia",
      repeats: "Repite",
      alert: "Alerta",
      startEndError:
        "La fecha de finalización seleccionada ocurre antes de la fecha de inicio.",
      invalidDateError: "El valor de la fecha ingresada no es válido.",
      blockAlert:
        "Los eventos no se pueden programar dentro del rango de tiempo bloqueado.",
      ok: "Okay",
      yes: "si",
      no: "No",
      occurrence: "Ocurrencia",
      series: "Serie",
      previous: "Anterior",
      next: "próximo",
      timelineDay: "Día de la línea de tiempo",
      timelineWeek: "Semana de la línea de tiempo",
      timelineWorkWeek: "Semana laboral cronológica",
      timelineMonth: "Mes de la línea de tiempo",
      timelineYear: "Cronología Año",
      editFollowingEvent: "Eventos siguientes",
      deleteTitle: "Eliminar evento",
      editTitle: "Editar evento",
      beginFrom: "Comience desde",
      endAt: "Termina en"
    },
    recurrenceeditor: {
      none: "Ninguna",
      daily: "Diario",
      weekly: "Semanal",
      monthly: "Mensual",
      month: "Mes",
      yearly: "Anual",
      never: "Nunca",
      until: "Hasta",
      count: "Contar",
      first: "primero",
      second: "Segundo",
      third: "Tercero",
      fourth: "Cuarto",
      last: "Último",
      repeat: "Repetir",
      repeatEvery: "Repite cada",
      on: "Repetir en",
      end: "Final",
      onDay: "Día",
      days: "Dias)",
      weeks: "Semanas)",
      months: "Meses)",
      years: "Años)",
      every: "cada",
      summaryTimes: "veces)",
      summaryOn: "en",
      summaryUntil: "hasta",
      summaryRepeat: "Repite",
      summaryDay: "dias)",
      summaryWeek: "semanas)",
      summaryMonth: "meses)",
      summaryYear: "años)",
      monthWeek: "Mes Semana",
      monthPosition: "Posición del mes",
      monthExpander: "Expansor de mes",
      yearExpander: "Expansor de año",
      repeatInterval: "Intervalo de repetición"
    },
    calendar: {
      today: "Hoy"
    }
  }
});


// funcion para cookie token
function getCookie(name) {
  if (!document.cookie) {
     return null;
  }

  const xsrfCookies = document.cookie.split(';')
     .map(c => c.trim())
     .filter(c => c.startsWith(name + '='));

  if (xsrfCookies.length === 0) {
     return null;
  }
  return decodeURIComponent(xsrfCookies[0].split('=')[1]);
}

class App extends React.Component {
  
  constructor(props) {
    super(props);
    
    // const [updateDone, setUpdateDone] = useState(true);
    // const [update, setUpdate] = useState(true);
    // this.data = extend([], scheduleData, null, true);
    this.state = {
      fecha: new Date(),
      scheduleData: null,
      romsData: [],
      employeeData: [],
      inventoryData: [],
      DataisLoaded: null
    };
  }

  onRenderCell(event) {
    var backgroundColor = '#' + event.hexColor;
    var style = {
        backgroundColor: backgroundColor,
        borderRadius: '0px',
        opacity: 0.8,
        color: 'black',
        border: '0px',
        display: 'block'
    };
    return {
        style: style
    };
  }

  get_validate_required_fields(letra){
    // onClick=escribe('0')
    if ( (document.getElementById("cnaToken").value === ''  &&  document.getElementById("cnaToken").style.display !== 'none'  )   || document.getElementById("cnaRoom").value === ''  || document.getElementById('confirmSend').getElementsByClassName("e-list-item e-level-1 e-checklist")[0].ariaSelected === 'false' || document.getElementById("cnaEmployee").value === '') {
      document.getElementsByClassName("e-control e-btn e-lib e-primary e-event-save e-flat")[0].setAttribute('style', 'display:None;')
    }
    else{
      document.getElementsByClassName("e-control e-btn e-lib e-primary e-event-save e-flat")[0].setAttribute('style', '')
    }
  }


  get_confirmation(letra){
    // onClick=escribe('0')
    if ( (document.getElementById("cnaToken").value === ''  &&  document.getElementById("cnaToken").style.display !== 'none'  )   || document.getElementById("cnaRoom").value === '' || document.getElementById("cnaEmployee").value === '') {
      DialogUtility.alert( {
        content:"Faltan campos obligatorios.",
        title : 'Información'
      })
      document.getElementById('confirmSend').getElementsByClassName("e-checkbox-wrapper e-css e-listview-checkbox e-checkbox-left")[0].setAttribute('aria-selected', false)
      document.getElementById('confirmSend').getElementsByClassName("e-checkbox-wrapper e-css e-listview-checkbox e-checkbox-left")[0].setAttribute('aria-checked', false)
      document.getElementById('confirmSend').getElementsByClassName("e-checkbox-wrapper e-css e-listview-checkbox e-checkbox-left")[0].getElementsByClassName("e-frame e-icons")[0].setAttribute('class', 'e-frame e-icons')
      document.getElementById('confirmSend').getElementsByClassName("e-list-item e-level-1 e-checklist")[0].setAttribute('aria-selected', false)
    }
    else{
      //pass
    }

    if ( (document.getElementById("cnaToken").value === ''  &&  document.getElementById("cnaToken").style.display !== 'none'  )   || document.getElementById("cnaRoom").value === ''  || document.getElementById('confirmSend').getElementsByClassName("e-list-item e-level-1 e-checklist")[0].ariaSelected === 'false' || document.getElementById("cnaEmployee").value === '') {
      document.getElementsByClassName("e-control e-btn e-lib e-primary e-event-save e-flat")[0].setAttribute('style', 'display:None;')
    }
    else{
      document.getElementsByClassName("e-control e-btn e-lib e-primary e-event-save e-flat")[0].setAttribute('style', '')
    }

  }

  // peticion get al backend para citas
  // Trae las citas disponibles en el sistema del backend previamente almacenadas
  getfetche = () => {  
    fetch (`https://sig.cna.hn/calendar/data`).then(res => res.json()).then(res => {
      var array = []
      // var count = 0
      if (res) {
        for (var property in res) {
          array.push({
            // external_id: res[property]['external_id'],
            // DataColor: '#cb6bb2' ,
            Id: res[property]['external_id'],
            CategoryColor:  res[property]['CategoryColor'],
            name:  res[property]['Subject'],
            cnaEmployee :  res[property]['cnaEmployee'],
            Locacion :  res[property]['Locacion'],
            Description :  res[property]['Description'],
            cnaInventory :  res[property]['check_box'],
            cnaRoom :  res[property]['cnaroom'],
            StartTime: new Date( res[property]['StartTime']['year'],  res[property]['StartTime']['month'],  res[property]['StartTime']['day'],  res[property]['StartTime']['hour'],  res[property]['StartTime']['minute']),
            EndTime: new Date( res[property]['EndTime']['year'],  res[property]['EndTime']['month'],  res[property]['EndTime']['day'],  res[property]['EndTime']['hour'],  res[property]['EndTime']['minute']),
          })
        }
      }
      // else{
      //   array.push({
      //     // external_id: res[property]['external_id'],
      //     // DataColor: '#cb6bb2' ,
      //     Id: 0,
      //     name:  '',
      //     cnaToken :  '',
      //     cnaEmployee :  '',
      //     Locacion :  '',
      //     Description :  '',
      //     cnaInventory :  [],
      //     cnaRoom :  '',
      //     StartTime: '',
      //     EndTime: '',
      //   })
      // }

      this.setState({
        scheduleData: array,
        // DataisLoaded: true
      });
      // }
      
      // return res
    }).catch(function(error) {
      DialogUtility.alert( {
        content:"No se puede conectar con el backend. Contacte con el administrador.",
        title : 'Información'
      })
    });
  }

  // peticion get al backend para salas
  // almacena todas las salas disponibles en el sistema para luego dejarlas disponible al agregar un evento desde el frontend
  getRoomfetche = () => {  
    fetch (`https://sig.cna.hn/room/data`).then(res => res.json()).then(res => {
      this.setState({
        romsData: res,
      });
    }).catch(function(error) {
      DialogUtility.alert( {
        content:"Ocurrio un error al traer las salas disponibles. Contacte con el administrador.",
        title : 'Información'
      })
    });
  }


  // peticion get al backend para empleados
  // almacena todos los empleados disponibles en el sistema para luego mostrarlos en el frontend
  getEmployeefetche = () => {  
    fetch (`https://sig.cna.hn/employee/data`).then(res => res.json()).then(res => {
      this.setState({
        employeeData: res,
      });
    }).catch(function(error) {
      DialogUtility.alert( {
        content:"Ocurrio un error al traer los empleados disponibles. Contacte con el administrador.",
        title : 'Información'
      })
    });
  }

  // peticion get al backend para el equipo que se puede utilizar
  getInventoryfetche = () => {  
    fetch (`https://sig.cna.hn/inventory/data`).then(res => res.json()).then(res => {
      this.setState({
        inventoryData: res,
      });
    }).catch(function(error) {
      DialogUtility.alert( {
        content:"Ocurrio un error al traer los requerimientos. Contacte con el administrador.",
        title : 'Información'
      })
    });
  }

  // get_dialog(){
  //   return DialogUtility.alert({
  //     title: 'Alert Dialog',
  //     content: "This is an Alert Dialog!",
  //     okButton: {  text: 'OK', click: okClick.bind(this) },
  //     showCloseIcon: true,
  //     closeOnEscape: true,
  //     animationSettings: { effect: 'Zoom' }
  //   });
  // }
  
  
  // peticion post al backend
  async setfetche(arg) {  
    
    
    var s = this
    
    let data_check_box = []
    let data_check_box_scheduleData = []
    
    // bloque de codigo para obtener los elementos seleccionados y los guardados del check box
    for (var select_var in document.getElementById('cnaInventory').getElementsByClassName("e-list-item e-level-1 e-checklist e-active")) {
      if (document.getElementById('cnaInventory').getElementsByClassName("e-list-item e-level-1 e-checklist e-active")[select_var].id  != undefined) {
        data_check_box.push( parseInt(document.getElementById('cnaInventory').getElementsByClassName("e-list-item e-level-1 e-checklist e-active")[select_var].id.replace('cnaInventory_', ''), 10)   )
      }
    }
    for (var obj_i in this.state.scheduleData) {
      if (this.state.scheduleData[obj_i]['Id']  === arg.data.Id ) {
        for (var indice in this.state.scheduleData[obj_i]['cnaInventory']) {
          data_check_box_scheduleData.push(this.state.scheduleData[obj_i]['cnaInventory'][indice])
        }
      }
    }
    // calcula la diferencia en el checkBox (si existen cambios a registrar)
    const diff_data_check_box_scheduleData = data_check_box_scheduleData.filter(e => !data_check_box.includes(e))
    const diff_data_check_box = data_check_box.filter(e => !data_check_box_scheduleData.includes(e))
    
    // fin bloque-=========================================


    // create ================================
    if (arg.requestType === 'eventCreate') {
      // let data_check_box = []
      // for (var select_var in document.getElementById('cnaInventory').getElementsByClassName("e-list-item e-level-1 e-checklist e-active")) {
      //   if (document.getElementById('cnaInventory').getElementsByClassName("e-list-item e-level-1 e-checklist e-active")[select_var].id  != undefined) {
      //     data_check_box.push(document.getElementById('cnaInventory').getElementsByClassName("e-list-item e-level-1 e-checklist e-active")[select_var].id)
      //   }
      // }
      let data_post = {
        data:arg.data[0],
        data_check_box:data_check_box
      }
      
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data_post)
      };
      const response =  fetch (`https://sig.cna.hn/calendar/set_data`, requestOptions).then(res => res.json()).then(res => {
        
        if (JSON.parse(res['result'])['error'] === true) {
          if (JSON.parse(res['result'])['type'] === 'before_today') {
            DialogUtility.alert( {
              content:"No se puede editar o crear actividades anteriores a la fecha actual.",
              title : 'Información'
            })
          }

          else if (JSON.parse(res['result'])['type'] === 'date_overlap') {
            DialogUtility.alert( {
              content:"Existe un traslape de horas con un evento anterior.",
              title : 'Información'
            })
          }
          s.scheduleObj.deleteEvent(arg.addedRecords[0].Id);
        }
        else if (JSON.parse(res['result'])['error'] === false) {
          DialogUtility.alert( {
            content:"El código para la actividad "+ arg.data[0].name +' es: '+ JSON.parse(res['result'])['token'] + ". \n\n Un mensaje de confirmación se ha enviado a su correo electrónico.",
            title : 'Información'
          })
        }

        for (var obj_i in s.state.scheduleData) {
          if (s.state.scheduleData[obj_i]['Id']  === arg.data[0].Id ) {
            s.state.scheduleData[obj_i]['cnaInventory'] = data_check_box
          }
        }

      }).catch(function(error) {
        return false
      });
    }
    
    // write ================================
    
    if (arg.requestType === 'eventChange' && (  diff_data_check_box_scheduleData.length > 0  || diff_data_check_box.length > 0  ||  s.scheduleObj.activeEventData.event.Description != arg.data.Description ||  s.scheduleObj.activeEventData.event.cnaEmployee != arg.data.cnaEmployee ||  s.scheduleObj.activeEventData.event.cnaRoom != arg.data.cnaRoom ||   s.scheduleObj.activeEventData.event.name != arg.data.name || s.scheduleObj.activeEventData.event.StartTime != arg.data.StartTime  || s.scheduleObj.activeEventData.event.EndTime != arg.data.EndTime   )  ) {
      let data_post_write = {
        data:arg.data,
        data_check_box:data_check_box
      }

      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data_post_write)
      };
      const response =  fetch (`https://sig.cna.hn/calendar/write_data`, requestOptions).then(res => res.json()).then(res => {
        if (JSON.parse(res['result'])['error'] === true) {
          
          if (JSON.parse(res['result'])['type'] === 'token_undefined') {
            DialogUtility.alert( {
              content:"Para editar la actividad ingrese el código asociado.",
              title : 'Información'
            })
          }

          else if (JSON.parse(res['result'])['type'] === 'date_overlap') {
            DialogUtility.alert( {
              content:"Existe un traslape de horas con un evento anterior.",
              title : 'Información'
            })
          }

          else if (JSON.parse(res['result'])['type'] === 'before_today') {
            DialogUtility.alert( {
              content:"No se puede editar o crear actividades anteriores a la fecha actual.",
              title : 'Información'
            })
          }

          else if (JSON.parse(res['result'])['type'] === 'token_format') {
            DialogUtility.alert( {
              content:"El código debe de estar compuesto por 4 números comprendidos entre 0-9 eje: 0000, 0101, 9999.",
              title : 'Información'
            })
          }

          else if (JSON.parse(res['result'])['type'] === 'token_invalid') {
            DialogUtility.alert( {
              content:"El código ingresado es incorrecto, contacte con el administrador para que le proporcione el código válido para la actividad.",
              title : 'Información'
            })
          }
          
          let Data = {
            Id: s.scheduleObj.activeEventData.event.Id,
            Subject: s.scheduleObj.activeEventData.event.Subject,
            StartTime: s.scheduleObj.activeEventData.event.StartTime,
            EndTime: s.scheduleObj.activeEventData.event.EndTime,
            cnaRoom: s.scheduleObj.activeEventData.event.cnaRoom,
            cnaEmployee: s.scheduleObj.activeEventData.event.cnaEmployee,
            name: s.scheduleObj.activeEventData.event.name,
            Description: s.scheduleObj.activeEventData.event.Description,
            Locacion : s.scheduleObj.activeEventData.event.Locacion,
          };
          
          
          // resetear a nivel visual el check box a los valores previos 
          for (var obj_i in s.state.scheduleData) {
            for (var select_var in document.getElementById('cnaInventory').getElementsByClassName("e-list-item e-level-1 e-checklist")) {
              if (s.state.scheduleData[obj_i]['Id'] === s.scheduleObj.activeEventData.event.Id ) {
                if (document.getElementById('cnaInventory').getElementsByClassName("e-list-item e-level-1 e-checklist")[select_var].id  != undefined) {
                  if ( s.state.scheduleData[obj_i]['cnaInventory'] &&  s.state.scheduleData[obj_i]['cnaInventory'].includes(  parseInt(document.getElementById('cnaInventory').getElementsByClassName("e-list-item e-level-1 e-checklist")[select_var].id.replace('cnaInventory_', ''), 10)  ) ) {
                    document.getElementById('cnaInventory').getElementsByClassName("e-list-item e-level-1 e-checklist")[select_var].setAttribute('class', 'e-list-item e-level-1 e-checklist e-active')
                    document.getElementById('cnaInventory').getElementsByClassName("e-checkbox-wrapper e-css e-listview-checkbox e-checkbox-left")[select_var].setAttribute('aria-selected', true)
                    document.getElementById('cnaInventory').getElementsByClassName("e-checkbox-wrapper e-css e-listview-checkbox e-checkbox-left")[select_var].setAttribute('aria-checked', true)
                    document.getElementById('cnaInventory').getElementsByClassName("e-checkbox-wrapper e-css e-listview-checkbox e-checkbox-left")[select_var].getElementsByClassName("e-frame e-icons")[0].setAttribute('class', 'e-frame e-icons e-check')
                    document.getElementById('cnaInventory').getElementsByClassName("e-list-item e-level-1 e-checklist")[select_var].setAttribute('aria-selected', true)
                  }
                  else{
                    document.getElementById('cnaInventory').getElementsByClassName("e-list-item e-level-1 e-checklist")[select_var].setAttribute('class', 'e-list-item e-level-1 e-checklist')
                    document.getElementById('cnaInventory').getElementsByClassName("e-checkbox-wrapper e-css e-listview-checkbox e-checkbox-left")[select_var].setAttribute('aria-selected', false)
                    document.getElementById('cnaInventory').getElementsByClassName("e-checkbox-wrapper e-css e-listview-checkbox e-checkbox-left")[select_var].setAttribute('aria-checked', false)
                    document.getElementById('cnaInventory').getElementsByClassName("e-checkbox-wrapper e-css e-listview-checkbox e-checkbox-left")[select_var].getElementsByClassName("e-frame e-icons")[0].setAttribute('class', 'e-frame e-icons')
                    document.getElementById('cnaInventory').getElementsByClassName("e-list-item e-level-1 e-checklist")[select_var].setAttribute('aria-selected', false)
                  }
  
                }


              }
              
            }
          }

          s.scheduleObj.saveEvent(Data);
        }

        else{
          for (var obj_i in this.state.scheduleData) {
            if (this.state.scheduleData[obj_i]['Id']  === arg.data.Id ) {
              this.state.scheduleData[obj_i]['cnaInventory'] = data_check_box
            }
          }
        }
        
      }).catch(function(error) {
        s.scheduleObj.activeEventData.cancel = true
        return false
      });
    }
    // else{
    //   arg.data.cnaInventory = data_check_box
    // }
    

    // unlink ======================================
    if (arg.requestType === 'eventRemove') {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(arg.data[0])
      };
      const response =  fetch (`https://sig.cna.hn/calendar/delete_data`, requestOptions).then(res => res.json()).then(res => {
        // arg.deletedRecords = []
        // s.scheduleObj.addEvent(arg.deletedRecords[0]);
        if (res['result'] === true) {
          return
          // alert("Se eliminara el evento");
          // s.scheduleObj.deleteEvent(arg.addedRecords[0].Id);
        }
      }).catch(function(error) {
        return false
      });
    }
  }
  
  // funcion para modificar los colores por salas
  onEventRendered(args) {
    let name_employe
    
    for ( var index in  this.state.employeeData) {
      if (args.data.cnaEmployee === this.state.employeeData[index].value) {
        name_employe = this.state.employeeData[index].text
      }
    }

    args.element.innerHTML =  "<div class=\"e-appointment-details\"><div class=\"e-subject\">" + name_employe + "</div> <div class=\"e-subject\">" + args.data.name + "</div><div class=\"e-time\">" +  args.element.innerText.replace(args.data.name, "") + "</div></div>"
    
    if (args.data.CategoryColor === undefined ) {
      for ( var index in  this.state.romsData) {
        if (args.data.cnaRoom === this.state.romsData[index].value) {
          args.data.CategoryColor = this.state.romsData[index].RoomColor
        }
      }
    }
    args.element.style.backgroundColor = args.data.CategoryColor;
    

    // args.element.style.height = '300'+'px';
  }
  
  // registra eventos nuevos
  onActionBegin(args){
    if (args.requestType === 'eventCreate' || args['requestType'] === "eventChange"  || args['requestType'] === "eventRemove"){
      this.setfetche(args)
    }
  }
  
  // fetch al recargar el doom
  componentDidMount(prevProps) {
    this.getfetche();
    this.getRoomfetche();
    this.getEmployeefetche();
    this.getInventoryfetche();

  };

  onPopupOpen(args) {
    // opcion para editar la ventana, agregar campos nuevos a la modal de registro
    if (args.type === 'Editor') {
      document.getElementsByClassName("e-control e-btn e-lib e-primary e-event-save e-flat")[0].setAttribute('style', 'display:None;')
      
      if (!args.element.querySelector('.custom-field-row')) {
          let row = createElement('div', { className: 'custom-field-row' });
          let formElement = args.element.querySelector('.e-schedule-form').querySelector('.e-description-row');
          formElement.firstChild.insertBefore(row, formElement.firstChild.firstChild.nextSibling);
          let container = createElement('div', { className: 'custom-field-container' });
          
          
          let rowBefore = createElement('div', { className: 'custom-field-row' });
          let formElementBefore = args.element.querySelector('.e-schedule-form');
          formElementBefore.firstChild.insertBefore(rowBefore, formElementBefore.firstChild.firstChild);
          let container_before = createElement('div', { className: 'custom-field-container' });
          
          // declaracion de la variable cnaEmployee
          let inputEmployee = createElement('input', {
            className: 'e-field', attrs: { name: 'cnaEmployee' , id: 'cnaEmployee'}
          });

          // array para cnaEmployee
          var arrayEmployee = []
          arrayEmployee = this.state.employeeData
          container_before.appendChild(inputEmployee);
          rowBefore.appendChild(container_before);

          
          
          // declaracion de la variable cnaRoom
          let inputEle = createElement('input', {
              className: 'e-field', attrs: { name: 'cnaRoom' , id: 'cnaRoom' }
          });

          // declaracion de la variable Inventory
          let inputInventory = createElement('input3', {
            className: 'e-list-content', attrs: { name: 'cnaInventory', id: 'cnaInventory'}
          });
          

          // declaracion de la variable cnaToken
          let inputCnaToken = createElement('input', {
            className: 'e-field e-input', attrs: { name: 'cnaToken', id: 'cnaToken', required: true}
          });


          // declaracion de inputConfirmSend
          let inputConfirmSend = createElement('input5', {
            className: 'e-list-content', attrs: { name: 'confirmSend', id: 'confirmSend', required: true}
          });
          
          
          // array para cnaRoom
          var array = []
          array = this.state.romsData
          container.appendChild(inputEle);

          
          let drowDownList = new DropDownList({
            // rellenar la data
            dataSource: array,
            fields: { text: 'text', value: 'value'},
            value: args.data.cnaRoom,
            // nombre del campo padre, definido en la lista
            floatLabelType: 'Always', placeholder: 'Sala'
          });

          let drowDownEmployee = new DropDownList({
            // rellenar la data
            dataSource: arrayEmployee,
            fields: { text: 'text', value: 'value' , validation: { required: true }},
            value: args.data.cnaEmployee,
            // nombre del campo padre, definido en la lista
            floatLabelType: 'Always', placeholder: 'Responsable'
          });


          let d = [
            { text: 'Estoy de acuerdo con la Información registrada.', id:1 },
          ];

          container.appendChild(inputInventory);
          container.appendChild(inputCnaToken);
          container.appendChild(inputConfirmSend);
          row.appendChild(container);

          
          
          let ListViewInventory = new ListView({
              //Set the data to datasource property
              dataSource: this.state.inventoryData,
              headerTitle: 'Requerimientos',
              showHeader: true,
              value: args.data.cnaInventory,
              //Enable checkbox
              showCheckBox: true,
          });

          
          
          let ConfirmSend = new ListView({
            //Set the data to datasource property
            dataSource: d,
            showCheckBox: true,
        });

          let TextCnaToken = new TextBox ({
            //Set the data to datasource property
            placeholder: 'Token',
            value: args.data.cnaToken,
            required : true
          });
          
          // let ListViewInventory = new ListView({
          //   // rellenar la data
          //   dataSource: d,
          //   fields: { text: 'text', value: 'value' , validation: { required: true }},
          //   value: d,
          //   // nombre del campo padre, definido en la lista
          //   floatLabelType: 'Always', placeholder: 'Lista inventario'
          // });

          // cnaRoom===========================
          drowDownList.appendTo(inputEle);
          inputEle.setAttribute('name', 'cnaRoom');
          inputEle.setAttribute('validation', { required: true });

          // cnaEmployee=====================================
          drowDownEmployee.appendTo(inputEmployee);
          inputEmployee.setAttribute('name', 'cnaEmployee');
          inputEmployee.setAttribute('validation', { required: true });

          // cnaInventory=====================================

          // inputInventory.getElementsByClassName("e-list-item e-level-1 e-checklist").setAttribute('className', 'e-field');
          ListViewInventory.appendTo(inputInventory);
          inputInventory.setAttribute('name', 'cnaInventory');


          TextCnaToken.appendTo(inputCnaToken);
          inputCnaToken.setAttribute('name', 'cnaToken');

          ConfirmSend.appendTo(inputConfirmSend);
          inputConfirmSend.setAttribute('name', 'ConfirmSend');
      
          
          
      }
      else{
        document.getElementById('cnaToken').setAttribute('style', 'display:block;')
        // document.getElementById('cnaToken').setAttribute('aria-required', 'true')
      }
      
      for (var obj_i in this.state.scheduleData) {
        if (this.state.scheduleData[obj_i]['Id']  === args.data.Id) {
          for (var select_var in document.getElementById('cnaInventory').getElementsByClassName("e-list-item e-level-1 e-checklist")) {
            
            if (document.getElementById('cnaInventory').getElementsByClassName("e-list-item e-level-1 e-checklist")[select_var].id  != undefined) {
              if ( this.state.scheduleData[obj_i]['cnaInventory'] &&  this.state.scheduleData[obj_i]['cnaInventory'].includes(  parseInt(document.getElementById('cnaInventory').getElementsByClassName("e-list-item e-level-1 e-checklist")[select_var].id.replace('cnaInventory_', ''), 10)  ) ) {
                document.getElementById('cnaInventory').getElementsByClassName("e-list-item e-level-1 e-checklist")[select_var].setAttribute('class', 'e-list-item e-level-1 e-checklist e-active')
                document.getElementById('cnaInventory').getElementsByClassName("e-checkbox-wrapper e-css e-listview-checkbox e-checkbox-left")[select_var].setAttribute('aria-selected', true)
                document.getElementById('cnaInventory').getElementsByClassName("e-checkbox-wrapper e-css e-listview-checkbox e-checkbox-left")[select_var].setAttribute('aria-checked', true)
                document.getElementById('cnaInventory').getElementsByClassName("e-checkbox-wrapper e-css e-listview-checkbox e-checkbox-left")[select_var].getElementsByClassName("e-frame e-icons")[0].setAttribute('class', 'e-frame e-icons e-check')
                document.getElementById('cnaInventory').getElementsByClassName("e-list-item e-level-1 e-checklist")[select_var].setAttribute('aria-selected', true)
              }
              else{
                document.getElementById('cnaInventory').getElementsByClassName("e-list-item e-level-1 e-checklist")[select_var].setAttribute('class', 'e-list-item e-level-1 e-checklist')
                document.getElementById('cnaInventory').getElementsByClassName("e-checkbox-wrapper e-css e-listview-checkbox e-checkbox-left")[select_var].setAttribute('aria-selected', false)
                document.getElementById('cnaInventory').getElementsByClassName("e-checkbox-wrapper e-css e-listview-checkbox e-checkbox-left")[select_var].setAttribute('aria-checked', false)
                document.getElementById('cnaInventory').getElementsByClassName("e-checkbox-wrapper e-css e-listview-checkbox e-checkbox-left")[select_var].getElementsByClassName("e-frame e-icons")[0].setAttribute('class', 'e-frame e-icons')
                document.getElementById('cnaInventory').getElementsByClassName("e-list-item e-level-1 e-checklist")[select_var].setAttribute('aria-selected', false)
              }

            }
          }
        }
      }
      
      //ventana de eventos nueva 
      // resetea los check box
      if ( args.data.Id === undefined ) {
        // resetea los elementos seleccionados en el checBox
        for (var select_var in document.getElementById('cnaInventory').getElementsByClassName("e-list-item e-level-1 e-checklist")) {
          if (document.getElementById('cnaInventory').getElementsByClassName("e-list-item e-level-1 e-checklist")[select_var].id  != undefined) {
            document.getElementById('cnaInventory').getElementsByClassName("e-list-item e-level-1 e-checklist")[select_var].setAttribute('class', 'e-list-item e-level-1 e-checklist')
            document.getElementById('cnaInventory').getElementsByClassName("e-checkbox-wrapper e-css e-listview-checkbox e-checkbox-left")[select_var].setAttribute('aria-selected', false)
            document.getElementById('cnaInventory').getElementsByClassName("e-checkbox-wrapper e-css e-listview-checkbox e-checkbox-left")[select_var].setAttribute('aria-checked', false)
            document.getElementById('cnaInventory').getElementsByClassName("e-checkbox-wrapper e-css e-listview-checkbox e-checkbox-left")[select_var].getElementsByClassName("e-frame e-icons")[0].setAttribute('class', 'e-frame e-icons')
            document.getElementById('cnaInventory').getElementsByClassName("e-list-item e-level-1 e-checklist")[select_var].setAttribute('aria-selected', false)
          }
        }
        
        // oculta elemento de token
        document.getElementById('cnaToken').setAttribute('style', 'display:None;')


      }

      document.getElementById('cnaToken').onchange = this.get_validate_required_fields  
      document.getElementById('cnaRoom_hidden').onchange = this.get_validate_required_fields  
      document.getElementById('cnaEmployee_hidden').onchange = this.get_validate_required_fields 
      
      document.getElementById('confirmSend').onclick = this.get_confirmation 
      
      
      


      // elimina campos no necesarios zona horaria, duracion todo el dia etc
      document.getElementsByClassName("e-all-day-time-zone-row")[0].setAttribute('style', 'display:None;')
      document.getElementsByClassName("e-input-wrapper e-form-left")[0].setAttribute('style', 'display:None;')

      // elimina el boton delete
      document.getElementsByClassName("e-control e-btn e-lib e-event-delete e-flat")[0].setAttribute('style', 'display:None;')
      // oculta description_location
      document.getElementsByClassName("e-location-container")[0].setAttribute('style', 'display:None;')
      document.getElementsByClassName("e-subject-container")[0].setAttribute('style', 'width:100%;')
      
      
      // resetea a false el check de confirmacion
      document.getElementById('confirmSend').getElementsByClassName("e-checkbox-wrapper e-css e-listview-checkbox e-checkbox-left")[0].setAttribute('aria-selected', false)
      document.getElementById('confirmSend').getElementsByClassName("e-checkbox-wrapper e-css e-listview-checkbox e-checkbox-left")[0].setAttribute('aria-checked', false)
      document.getElementById('confirmSend').getElementsByClassName("e-checkbox-wrapper e-css e-listview-checkbox e-checkbox-left")[0].getElementsByClassName("e-frame e-icons")[0].setAttribute('class', 'e-frame e-icons')
      document.getElementById('confirmSend').getElementsByClassName("e-list-item e-level-1 e-checklist")[0].setAttribute('aria-selected', false)
      
    }
    
    this.scheduleObj.activeCellsData.isAllDay = false
    if (args['type'] === 'QuickInfo') {
      args.cancel = true;
    }
  }
  // MAIN
  // renderiza el componente principal
  render() {
    return (
      // fallback={<Loading />}
      // eventStyleGetter={this.eventStyleGetter.bind(this)}
      
      <div className="App">
        <header  style={{ height: 130, display: 'flex', flexDirection: 'column', fontSize:25, color: 'black'}}>
          <div style={{ width: 'auto'}} >
            <Row>
              <Col xs={3}><img src={logo} alt="logo" style={{ width: 214}} /></Col>
              
              {window.screen.width >= 900 ?   <Col xs={7} style={{ textAlign: "center"}}><text style={{ fontWeight: 600}} >CONSEJO NACIONAL ANTICORRUPCIÓN</text> <br></br>    <text>ADMINISTRACIÓN Y RECURSOS HUMANOS</text> <br></br>  <text>Reserva de salas</text> <br></br> </Col>          :       <text></text> }

              
              
              
              <Col xs={2} style={{ textAlign: "left"}}> </Col>
            </Row>
          </div>
        </header>
        <ScheduleComponent locale = 'es' timezone='America/Tegucigalpa'    height='600' width='auto'  ref={t => this.scheduleObj = t}  currentView = 'Week' selectedDate = {new Date()} eventSettings={{ dataSource: this.state.scheduleData ,
            fields: {
              id: 'Id',
              // cnaRoom: { validation: { required: true } },
              cnaToken: { name: 'cnaToken', title: 'Token', validation: { required: true } },
              subject: { name: 'name', title: 'Nombre evento' , validation: { required: true }},
              location: { name: 'Locacion', title: 'Descripcion de la locación' },
              description: { name: 'Description', title: 'Descripcion del evento' },
              startTime: { name: 'StartTime', title: 'Desde' },
              endTime: { name: 'EndTime', title: 'Hasta' },
              IsAllDay: { default: false}
            }}
          
          
          }actionBegin={this.onActionBegin.bind(this)     }  popupOpen={this.onPopupOpen.bind(this)}  eventRendered={this.onEventRendered.bind(this)}>
            <Inject services = {[Week ,Day, WorkWeek, Month, Agenda]}/>
          </ScheduleComponent>
      </div>
    
    );
  }
}

export default App;

