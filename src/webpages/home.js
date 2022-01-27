// import logo from './logo.svg';
import './App.css';
import React, { useRef, useState, useEffect, Suspense} from "react";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {Inject,ScheduleComponent, Day, Week, WorkWeek, Month, Agenda, ResourcesDirective, ResourceDirective} from '@syncfusion/ej2-react-schedule';
import { extend, L10n } from '@syncfusion/ej2-base';


import {createElement } from '@syncfusion/ej2-base';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
// import { scheduleData } from './datasource';

// diccionario de idioma para botones 
L10n.load({
  'en-US': {
      'schedule': {
          'saveButton': 'Guardar',
          'cancelButton': 'Close',
          'deleteButton': 'Remove',
          'newEvent': 'Agregar evento',
      },
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

class Home extends React.Component {
  constructor(props) {
    super(props);
    
    // const [updateDone, setUpdateDone] = useState(true);
    // const [update, setUpdate] = useState(true);
    // this.data = extend([], scheduleData, null, true);
    this.state = {
      fecha: new Date(),
      scheduleData: null,
      romsData: [],
      DataisLoaded: null
    };
  }

  onRenderCell(event) {
    console.log('funcion estilos de evento ==================================>',event );
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


  // peticion get al backend para citas
  // Trae las citas disponibles en el sistema del backend previamente almacenadas
  getfetche = () => {  
    fetch (`/calendar/data`).then(res => res.json()).then(res => {
      console.log('peticion al backend=======2222222222===============>',res )
      var array = []
      // var count = 0
      for (var property in res) {
        console.log('forrrrrrrrrrrrrrrrrrrr===============>', res[property]['external_id'])
        array.push({
          // external_id: res[property]['external_id'],
          // DataColor: '#cb6bb2' ,
          Id: res[property]['external_id'],
          name:  res[property]['Subject'],
          cnaRoom :  res[property]['cnaroom'],
          StartTime: new Date( res[property]['StartTime']['year'],  res[property]['StartTime']['month'],  res[property]['StartTime']['day'],  res[property]['StartTime']['hour'],  res[property]['StartTime']['minute']),
          EndTime: new Date( res[property]['EndTime']['year'],  res[property]['EndTime']['month'],  res[property]['EndTime']['day'],  res[property]['EndTime']['hour'],  res[property]['EndTime']['minute']),
        })

        // count += 1
      }


     
      // if (res != false) {
      this.setState({
        scheduleData: array,
        // DataisLoaded: true
      });
      // }
      
      // return res
    }).catch(function(error) {
      console.log('paso ooooooooooooooooooooooooooo',error)
      alert("Can't connect to backend try latter", error);
    });
  }

  // peticion get al backend para salas
  // almacena todas las salas disponibles en el sistema para luego dejarlas disponible al agregar un evento desde el frontend
  getRoomfetche = () => {  
    fetch (`/room/data`).then(res => res.json()).then(res => {
      this.setState({
        romsData: res,
      });
    }).catch(function(error) {
      alert("Ocurrio un error al traer las salas disponibles", error);
    });
  }

  // peticion post al backend
  async setfetche(arg) {  
    var s = this
    // create ================================
    if (arg.requestType === 'eventCreate') {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(arg.data[0])
      };
      const response =  fetch (`/calendar/set_data`, requestOptions).then(res => res.json()).then(res => {
        
        if (res['result'] === true) {
          alert("Existe un traslape de horas con un evento anterior");
          s.scheduleObj.deleteEvent(arg.addedRecords[0].Id);
        }
      
      }).catch(function(error) {
        return false
      });
    }
    
    // write ================================
    
    console.log('edito un evento====================111111111111==============================>',arg)
    if (arg.requestType === 'eventChange' && ( s.scheduleObj.activeEventData.event.name != arg.data.name || s.scheduleObj.activeEventData.event.StartTime != arg.data.StartTime  || s.scheduleObj.activeEventData.event.EndTime != arg.data.EndTime   )  ) {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(arg.data)
      };
      const response =  fetch (`/calendar/write_data`, requestOptions).then(res => res.json()).then(res => {
        s.scheduleObj.activeEventData.cancel = true
        if (res['result'] === true) {
          let Data = {
            Id: s.scheduleObj.activeEventData.event.Id,
            Subject: s.scheduleObj.activeEventData.event.Subject,
            StartTime: s.scheduleObj.activeEventData.event.StartTime,
            EndTime: s.scheduleObj.activeEventData.event.EndTime,
            cnaRoom: s.scheduleObj.activeEventData.event.cnaRoom,
            name: s.scheduleObj.activeEventData.event.name,
            Description: s.scheduleObj.activeEventData.event.Description,
          };
          
          s.scheduleObj.saveEvent(Data);
          arg.requestType = false
          return
          // alert("Se eliminara el evento");
          // s.scheduleObj.deleteEvent(arg.addedRecords[0].Id);
        }
      }).catch(function(error) {
        s.scheduleObj.activeEventData.cancel = true
        console.log('edito un evento=======================2222222222222===========================>',s.scheduleObj.activeEventData.cancel = true )
        return false
      });
    }


    if (arg.requestType === 'eventRemove') {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({data:arg.data[0]['Id']} )
      };
      const response =  fetch (`/calendar/delete_data`, requestOptions).then(res => res.json()).then(res => {
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
  
  // registra eventos nuevos
  onActionBegin(args){
    
    // evento create , write, delete=================================
    console.log('tipo de evento delete==============================>',args,  )
    
    if (args.requestType === 'eventCreate' || args['requestType'] === "eventChange"  || args['requestType'] === "eventRemove"){
      this.setfetche(args)
      console.log('final ======666====================>', args.cancel)   
    }

    console.log('final ======777====================>', args)
    // cambiar textos de la barra
    // if (args['requestType'] === "toolbarItemRendering") {
    //   for (var property in args['items']) {
        
    //     console.log('recorre el for============================>', property)
        
    //     if (args['items'][property]['text'] === "Today") {
    //       args['items'][property]['text'] = "Hoy"
    //     }
    //     if (args['items'][property]['text'] === "Day") {
    //       args['items'][property]['text'] = "Dia"
    //     }
    //     if (args['items'][property]['text'] === "Week") {
    //       args['items'][property]['text'] = "Semana"
    //     }
    //     if (args['items'][property]['text'] === "Work Week") {
    //       args['items'][property]['text'] = "Semana de trabajo"
    //     }
    //     if (args['items'][property]['text'] === "Month") {
    //       args['items'][property]['text'] = "Mes"
    //     }
    //   }
    // }
  }
  
  // fetch al recargar el doom
  componentDidMount(prevProps) {
    this.getfetche();
    this.getRoomfetche();
  };

  onPopupOpen(args) {
    if (args.type === 'Editor') {
        if (!args.element.querySelector('.custom-field-row')) {
            let row = createElement('div', { className: 'custom-field-row' });
            let formElement = args.element.querySelector('.e-schedule-form');
            formElement.firstChild.insertBefore(row, formElement.firstChild.firstChild);
            let container = createElement('div', { className: 'custom-field-container' });
            
            // declaracion de la variable
            let inputEle = createElement('input', {
                className: 'e-field', attrs: { name: 'cnaRoom' , validation: { required: true }}
            });
            
            var array = []
            console.log('citas ==============2222222==============>')
            array = this.state.romsData
            console.log('citas ===============333333333=============>', array)

            container.appendChild(inputEle);
            row.appendChild(container);
            
            
            let drowDownList = new DropDownList({
                
                // rellenar la data
                dataSource: array,
                fields: { text: 'text', value: 'value' , validation: { required: true }},
                value: args.data.cnaRoom,
                // nombre del campo padre, definido en la lista
                floatLabelType: 'Always', placeholder: 'Salas'
            });
            drowDownList.appendTo(inputEle);
            inputEle.setAttribute('name', 'cnaRoom');
            inputEle.setAttribute('validation', { required: true });
        }
    }
    console.log('tipo de ventana-============================>', args)
    if (args['type'] === 'QuickInfo') {
      args.cancel = true;
    }
  }



  onMoreEventsClick(args) {
    console.log('onMoreEventsClick=========23333333333333======================>', args)
    // args.cancel = true;
  }

  // MAIN
  // renderiza el componente principal
  render() {
    return (
      // fallback={<Loading />}
      // eventStyleGetter={this.eventStyleGetter.bind(this)}
      <div className="App">
        <header className="App-header">
          <ScheduleComponent ref={t => this.scheduleObj = t}  currentView = 'Month' selectedDate = {new Date()} eventSettings={{ dataSource: this.state.scheduleData ,resourceColorField: 'Owners',
            fields: {
              // id: 'Id',
              // cnaRoom: { validation: { required: true } },
              subject: { name: 'name', title: 'Nombre evento' , validation: { required: true }},
              location: { name: 'Locacion', title: 'Descripcion de la locación' },
              description: { name: 'Description', title: 'Event Description' },
              startTime: { name: 'StartTime', title: 'Desde' },
              endTime: { name: 'EndTime', title: 'Hasta' }
            }}
          
          
          }actionBegin={this.onActionBegin.bind(this)     }  popupOpen={this.onPopupOpen.bind(this)} moreEventsClick={this.onMoreEventsClick.bind(this)}  renderCell={this.onRenderCell.bind(this)}  group={{ resources: ['Rooms'] }}>

            <ResourcesDirective>
                  <ResourceDirective field='RoomId' title='Room' name='Rooms' allowMultiple={false} dataSource={this.state.romsData} textField='text'  groupIDField='RoomGroupId' colorField='RoomColor'>
                  </ResourceDirective>
            </ResourcesDirective> 
            <Inject services = {[Day, Week, WorkWeek, Month, Agenda]}/>
          </ScheduleComponent>
        </header>
      </div>
    
    );
  }
}

export default Home;
