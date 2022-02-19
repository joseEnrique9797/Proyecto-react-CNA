import logo from './cna.png';
import './App.css';
import React from "react";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {Inject,ScheduleComponent, Day, Week, WorkWeek, Month, Agenda, ResourcesDirective, ResourceDirective} from '@syncfusion/ej2-react-schedule';
import { extend, L10n } from '@syncfusion/ej2-base';

import 'bootstrap/dist/css/bootstrap.css';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';


import {createElement } from '@syncfusion/ej2-base';
import { DropDownList } from '@syncfusion/ej2-dropdowns';

import { ListView } from '@syncfusion/ej2-lists';
import { TextBox } from '@syncfusion/ej2-inputs'
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


  // peticion get al backend para citas
  // Trae las citas disponibles en el sistema del backend previamente almacenadas
  getfetche = () => {  
    fetch (`http://cna.catics.online:8069/calendar/data`).then(res => res.json()).then(res => {
      var array = []
      // var count = 0
      for (var property in res) {
        array.push({
          // external_id: res[property]['external_id'],
          // DataColor: '#cb6bb2' ,
          Id: res[property]['external_id'],
          name:  res[property]['Subject'],
          cnaInventory :  res[property]['check_box'],
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
      alert("No se puede conectar con el backend", error);
    });
  }

  // peticion get al backend para salas
  // almacena todas las salas disponibles en el sistema para luego dejarlas disponible al agregar un evento desde el frontend
  getRoomfetche = () => {  
    fetch (`http://cna.catics.online:8069/room/data`).then(res => res.json()).then(res => {
      this.setState({
        romsData: res,
      });
    }).catch(function(error) {
      alert("Ocurrio un error al traer las salas disponibles", error);
    });
  }


  // peticion get al backend para empleados
  // almacena todos los empleados disponibles en el sistema para luego mostrarlos en el frontend
  getEmployeefetche = () => {  
    fetch (`http://cna.catics.online:8069/employee/data`).then(res => res.json()).then(res => {
      this.setState({
        employeeData: res,
      });
    }).catch(function(error) {
      alert("Ocurrio un error al traer los empleados disponibles", error);
    });
  }

  // peticion get al backend para el equipo que se puede utilizar
  getInventoryfetche = () => {  
    fetch (`http://cna.catics.online:8069/inventory/data`).then(res => res.json()).then(res => {
      this.setState({
        inventoryData: res,
      });
    }).catch(function(error) {
      alert("Ocurrio un error al traer los requerimientos", error);
    });
  }

  // peticion post al backend
  async setfetche(arg) {  
    var s = this
    // create ================================
    if (arg.requestType === 'eventCreate') {
      let data_check_box = []
      for (var select_var in document.getElementById('cnaInventory').getElementsByClassName("e-list-item e-level-1 e-checklist e-active")) {
        if (document.getElementById('cnaInventory').getElementsByClassName("e-list-item e-level-1 e-checklist e-active")[select_var].id  != undefined) {
          data_check_box.push(document.getElementById('cnaInventory').getElementsByClassName("e-list-item e-level-1 e-checklist e-active")[select_var].id)
        }
      }
      

      let data_post = {
        data:arg.data[0],
        data_check_box:data_check_box
      }
      
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data_post)
      };
      const response =  fetch (`http://cna.catics.online:8069/calendar/set_data`, requestOptions).then(res => res.json()).then(res => {
        
        if (JSON.parse(res['result'])['error'] === true) {
          alert("Existe un traslape de horas con un evento anterior");
          s.scheduleObj.deleteEvent(arg.addedRecords[0].Id);
        }
        else if (JSON.parse(res['result'])['error'] === false) {
          alert("El token de acceso para el evento "+ arg.data[0].name +' es: '+ JSON.parse(res['result'])['token'] );
        }

      }).catch(function(error) {
        return false
      });
    }
    
    // write ================================
    if (arg.requestType === 'eventChange' && ( s.scheduleObj.activeEventData.event.name != arg.data.name || s.scheduleObj.activeEventData.event.StartTime != arg.data.StartTime  || s.scheduleObj.activeEventData.event.EndTime != arg.data.EndTime   )  ) {
      
      let data_check_box = []
      for (var select_var in document.getElementById('cnaInventory').getElementsByClassName("e-list-item e-level-1 e-checklist e-active")) {
        if (document.getElementById('cnaInventory').getElementsByClassName("e-list-item e-level-1 e-checklist e-active")[select_var].id  != undefined) {
          data_check_box.push( parseInt(document.getElementById('cnaInventory').getElementsByClassName("e-list-item e-level-1 e-checklist e-active")[select_var].id.replace('cnaInventory_', ''), 10)   )
        }
      }
      let data_post_write = {
        data:arg.data,
        data_check_box:data_check_box
      }

      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data_post_write)
      };
      const response =  fetch (`http://cna.catics.online:8069/calendar/write_data`, requestOptions).then(res => res.json()).then(res => {
        s.scheduleObj.activeEventData.cancel = true
        if (JSON.parse(res['result'])['error'] === true) {
          if (JSON.parse(res['result'])['type'] === 'token_undefined') {
            alert("Para editar un evento ingrese un token");
          }

          else if (JSON.parse(res['result'])['type'] === 'token_format') {
            alert("El token debe de estar compuesto por 4 numeros comprendidos entre 0-9 eje: 0000, 0101, 9999 ");
          }
          
          let Data = {
            Id: s.scheduleObj.activeEventData.event.Id,
            Subject: s.scheduleObj.activeEventData.event.Subject,
            StartTime: s.scheduleObj.activeEventData.event.StartTime,
            EndTime: s.scheduleObj.activeEventData.event.EndTime,
            cnaRoom: s.scheduleObj.activeEventData.event.cnaRoom,
            name: s.scheduleObj.activeEventData.event.name,
            Description: s.scheduleObj.activeEventData.event.Description,
          };
          
          for (var obj_i in this.state.scheduleData) {
            if (this.state.scheduleData[obj_i]['Id']  === arg.data.Id ) {
              this.state.scheduleData[obj_i]['cnaInventory'] = data_check_box
            }
          }
          
          s.scheduleObj.saveEvent(Data);
          arg.requestType = false
          return
        }
      }).catch(function(error) {
        s.scheduleObj.activeEventData.cancel = true
        return false
      });
    }


    if (arg.requestType === 'eventRemove') {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({data:arg.data[0]['Id']} )
      };
      const response =  fetch (`http://cna.catics.online:8069/calendar/delete_data`, requestOptions).then(res => res.json()).then(res => {
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
    if (args.requestType === 'eventCreate' || args['requestType'] === "eventChange"  || args['requestType'] === "eventRemove"){
      this.setfetche(args)
    }
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
    this.getEmployeefetche();
    this.getInventoryfetche();
  };

  onPopupOpen(args) {
    // opcion para editar la ventana, agregar campos nuevos a la modal de registro
    
    if (args.type === 'Editor') {
      if (!args.element.querySelector('.custom-field-row')) {
          let row = createElement('div', { className: 'custom-field-row' });
          let formElement = args.element.querySelector('.e-schedule-form');
          formElement.firstChild.insertBefore(row, formElement.firstChild.firstChild);
          let container = createElement('div', { className: 'custom-field-container' });
          
          // declaracion de la variable cnaRoom
          let inputEle = createElement('input1', {
              className: 'e-field', attrs: { name: 'cnaRoom' , validation: { required: true }}
          });

          // declaracion de la variable cnaEmployee
          let inputEmployee = createElement('input2', {
              className: 'e-field', attrs: { name: 'cnaEmployee' , validation: { required: true }}
          });

          // declaracion de la variable Inventory
          let inputInventory = createElement('input3', {
            className: 'e-list-content', attrs: { name: 'cnaInventory', id: 'cnaInventory'}
          });
          

          // declaracion de la variable cnaToken
          let inputCnaToken = createElement('input', {
            className: 'e-field e-input', attrs: { name: 'cnaToken', id: 'cnaToken'}
          });
          
          container.appendChild(inputCnaToken);
          // array para cnaRoom
          var array = []
          array = this.state.romsData
          container.appendChild(inputEle);

          // array para cnaEmployee
          var arrayEmployee = []
          arrayEmployee = this.state.employeeData
          container.appendChild(inputEmployee);

          let drowDownList = new DropDownList({
            // rellenar la data
            dataSource: array,
            fields: { text: 'text', value: 'value' , validation: { required: true }},
            value: args.data.cnaRoom,
            // nombre del campo padre, definido en la lista
            floatLabelType: 'Always', placeholder: 'Salas'
          });

          let drowDownEmployee = new DropDownList({
            // rellenar la data
            dataSource: arrayEmployee,
            fields: { tooltip: 'text',text:'text',id:'id'},
            value: args.data.cnaEmployee,
            // nombre del campo padre, definido en la lista
            floatLabelType: 'Always', placeholder: 'Empleados'
          });


          // let d = [
          //   { text: 'Camaras' },
          //   { text: 'Carpa' },
          //   { text: 'Mesa' },
          //   { text: 'Sillas' },
          //   { text: 'Manteles' },
          // ];

          container.appendChild(inputInventory);
          row.appendChild(container);

          
          let ListViewInventory = new ListView({
              //Set the data to datasource property
              dataSource: this.state.inventoryData,
              headerTitle: 'Equipo a utilizar',
              showHeader: true,
              value: args.data.cnaInventory,
              //Enable checkbox
              showCheckBox: true,
          });

          let TextCnaToken = new TextBox ({
            //Set the data to datasource property
            placeholder: 'Token',
            value: args.data.cnaToken,
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

              // para true
              
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

      // elimina campos no necesarios zona horaria, duracion todo el dia etc
      document.getElementsByClassName("e-all-day-time-zone-row")[0].setAttribute('style', 'display:None;')
      document.getElementsByClassName("e-input-wrapper e-form-left")[0].setAttribute('style', 'display:None;')
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
              <Col xs={4}><img src={logo} alt="logo" style={{ width: 214}} /></Col>
              <Col xs={4} style={{ textAlign: "center"}}><text>Reserva de sala</text></Col>
              <Col xs={4} style={{ textAlign: "left"}}> </Col>
            </Row>
          </div>
        </header>
        <ScheduleComponent height='600' width='auto'  ref={t => this.scheduleObj = t}  currentView = 'Month' selectedDate = {new Date()} eventSettings={{ dataSource: this.state.scheduleData ,
            fields: {
              id: 'Id',
              // cnaRoom: { validation: { required: true } },
              // cnaToken: { name: 'name', title: 'Token' },
              subject: { name: 'name', title: 'Nombre evento' , validation: { required: true }},
              location: { name: 'Locacion', title: 'Descripcion de la locación' },
              description: { name: 'Description', title: 'Event Description' },
              startTime: { name: 'StartTime', title: 'Desde' },
              endTime: { name: 'EndTime', title: 'Hasta' },
              IsAllDay: { default: false}
            }}
          
          
          }actionBegin={this.onActionBegin.bind(this)     }  popupOpen={this.onPopupOpen.bind(this)}>
            <Inject services = {[Day, Week, WorkWeek, Month, Agenda]}/>
          </ScheduleComponent>
      </div>
    
    );
  }
}

export default App;

