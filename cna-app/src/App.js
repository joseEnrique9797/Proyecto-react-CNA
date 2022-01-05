import logo from './logo.svg';
import './App.css';
import React, { useRef, useState, useEffect } from "react";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {Inject,ScheduleComponent, Day, Week, WorkWeek, Month, Agenda} from '@syncfusion/ej2-react-schedule';
import { extend, L10n } from '@syncfusion/ej2-base';


import {createElement } from '@syncfusion/ej2-base';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
// import { scheduleData } from './datasource';


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

function getfetche() {
  fetch (`/calendar/data`).then(res => res.json()).then(res => {
    console.log('peticion al backend======================>',res )
    return res
  }).catch(function(error) {
    console.log('paso ooooooooooooooooooooooooooo',error)
    alert("Can't connect to backend try latter", error);
  });
}



class App extends React.Component {
  // peticion get al backend 
  getfetche = () => {  
    fetch (`/calendar/data`).then(res => res.json()).then(res => {
      console.log('peticion al backend=======2222222222===============>',res )
      // this.scheduleData = 
      // console.log('asigno scheduleData 2222222222===============>',this.scheduleData )
      
      var array = []
      var count = 0
      for (var property in res) {
        console.log('forrrrrrrrrrrrrrrrrrrr===============>', res[property]['Subject'])
        array.push({
          Id: count,
          Subject:  res[property]['Subject'],
          StartTime: new Date( res[property]['StartTime']['year'],  res[property]['StartTime']['month'],  res[property]['StartTime']['day'],  res[property]['StartTime']['hour'],  res[property]['StartTime']['minute']),
          EndTime: new Date( res[property]['EndTime']['year'],  res[property]['StartTime']['month'],  res[property]['StartTime']['day'],  res[property]['StartTime']['hour'],  res[property]['StartTime']['minute']),
        })

        count += 1
      }


      this.setState({
        scheduleData: array,
        // DataisLoaded: true
      });
      // return res
    }).catch(function(error) {
      console.log('paso ooooooooooooooooooooooooooo',error)
      alert("Can't connect to backend try latter", error);
    });
  }

  // peticion post al backend
  setfetche(arg) {  
    
    console.log('onchange=======2222222222===============>',arg.data[0]['Subject'] )
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({'subject':arg.data[0]['Subject']})
    };

    
    
    fetch (`/calendar/set_data`, requestOptions).then(res => res.json()).then(res => {
      // console.log('onchange=======2222222222===============>',arg.addedRecords )
      // this.scheduleData = 
      // console.log('asigno scheduleData 2222222222===============>',this.scheduleData )
      
      // var array = []
      // var count = 0
      // for (var property in res) {
      //   console.log('forrrrrrrrrrrrrrrrrrrr===============>', res[property]['Subject'])
      //   array.push({
      //     Id: count,
      //     Subject:  res[property]['Subject'],
      //     StartTime: new Date( res[property]['StartTime']['year'],  res[property]['StartTime']['month'],  res[property]['StartTime']['day'],  res[property]['StartTime']['hour'],  res[property]['StartTime']['minute']),
      //     EndTime: new Date( res[property]['EndTime']['year'],  res[property]['StartTime']['month'],  res[property]['StartTime']['day'],  res[property]['StartTime']['hour'],  res[property]['StartTime']['minute']),
      //   })

      //   count += 1
      // }


      // this.setState({
      //   scheduleData: array,
      //   // DataisLoaded: true
      // });
      // return res
    }).catch(function(error) {
      console.log('onchange=======error===============>',error)
      alert("onchange", error);
    });
  }
  

  constructor(props) {
    super(props);
    // this.data = extend([], scheduleData, null, true);
    this.state = {
      fecha: new Date(),
      scheduleData: [],
      DataisLoaded: false
    };
  }

  // registra eventos nuevos
  onActionBegin(args){
    if (args.requestType === 'eventCreate') {
      console.log('=========================setfetche',args.data[0]);
      this.setfetche(args);  
    }
  }
  

  // fetch al recargar el doom
  componentDidMount() {
    console.log('ejecuto ================>componentDidMount')
    this.getfetche();
  };

  
  componentDidUpdate() {
    const csrfToken = getCookie('CSRF-TOKEN');
    const headers = new Headers({
      'Content-Type': 'x-www-form-urlencoded',
      // 'csrf-token': csrfToken
    });

    fetch (`/calendar/data`)
    .then(res => res.json())
    .then(res => {
      if (res.success) {
        console.log('paso ooooooooooooooooooooooooooo', res)
        //mensaje correcto
      }else{
        console.log('NOOOO ooooooooooooooooooooooooooo', res)
      //mensaje de error
      }
    })
    .catch(function(error) {
      console.log('paso ooooooooooooooooooooooooooo',error)
      alert("Can't connect to backend try latter", error);
    });
  };

  
  onPopupOpen(args) {
    if (args.type === 'Editor') {
        if (!args.element.querySelector('.custom-field-row')) {
            let row = createElement('div', { className: 'custom-field-row' });
            let formElement = args.element.querySelector('.e-schedule-form');
            formElement.firstChild.insertBefore(row, formElement.firstChild.firstChild);
            let container = createElement('div', { className: 'custom-field-container' });
            let inputEle = createElement('input', {
                className: 'e-field', attrs: { name: 'EventType' }
            });
            container.appendChild(inputEle);
            row.appendChild(container);
            let drowDownList = new DropDownList({
                dataSource: [
                    { text: 'Public Event', value: 'public-event' },
                    { text: 'Maintenance', value: 'maintenance' },
                    { text: 'Commercial Event', value: 'commercial-event' },
                    { text: 'Family Event', value: 'family-event' }
                ],
                fields: { text: 'text', value: 'value' },
                value: args.data.EventType,
                floatLabelType: 'Always', placeholder: 'Event Type'
            });
            drowDownList.appendTo(inputEle);
            inputEle.setAttribute('name', 'EventType');
        }
    }
  }

  // main========================]
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          {/* <p>
            Edit <code>src/App.js</code> and save to reload.
          </p> */}
          <a
            className="App-link"
            href="http://cna.catics.online:8069/calendar/frontend"
            target="_blank"
            rel="noopener noreferrer"
          >
            comunicar con el backend
          </a>
          
          {/* <DatePicker selected = {this.state.fecha}  onChange = {this.onChangeDate}/> */}
          <ScheduleComponent currentView = 'Month' selectedDate = {new Date()} eventSettings={{ dataSource: this.state.scheduleData ,
            fields: {
              id: 'Id',
              detail: { name: 'detail', title: 'detalle', validation: { required: true } },
              subject: { name: 'name', title: 'Nombre evento' },
              location: { name: 'Location', title: 'Event Location' },
              description: { name: 'Description', title: 'Event Description' },
              startTime: { name: 'StartTime', title: 'Start Duration' },
              endTime: { name: 'EndTime', title: 'End Duration' }
          }}}  actionBegin={this.onActionBegin.bind(this)}  popupOpen={this.onPopupOpen.bind(this)}>
             <Inject services = {[Day, Week, WorkWeek, Month, Agenda]}/>
          </ScheduleComponent>
        </header>
      </div>
    );
  }
}

export default App;
