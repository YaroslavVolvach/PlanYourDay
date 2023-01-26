

const HOURS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

const PARTSOFDAY = ['AM', 'PM'];

const currentDate = moment().format("YYYY-MM-DD");

const dataHourString = dataHourFormat()

function dataHourFormat(){
  let dateString = moment().format('LT')
  let point = 2
  let point2 = 5
  if(dateString.length === 7){
        point = 1
        point2 = 4
    }
  
  return dateString.substring(0, point) + dateString.substring(point2);
  }
  
function hourCompare(fiirst, second){
    let fAMPM = fiirst.slice(-2);
    let sAMPM = second.slice(-2);
    let fINT = parseInt(fiirst)
    let sINT = parseInt(second)
    if((fAMPM === sAMPM && fINT > sINT) || (fAMPM === 'PM' && sAMPM === 'AM')){
      return 1;
     }
    if(fAMPM === sAMPM && fINT === sINT){
      return 0;
    }
    return -1;
      
      
  }
function checkperiod(myEvent){
  let myDate = myEvent.date
  let myHour = myEvent.hour
  let hCompare = hourCompare(myHour, dataHourString)
  
  if(moment(myDate).isSame(currentDate) && hCompare === 0){
      return 'present'
  }
  
  if(moment(myDate).isAfter(currentDate) || moment(myDate).isSame(currentDate) && hCompare === 1){
     return 'future'
  }
  
  return 'past'
  }
  
function sortEvents(event, event2){
   let result = moment(event.date).toDate() - moment(event2.date).toDate()
   if(result === 0){
      return result + hourCompare(event.hour, event2.hour)
    }
    return result
  }
  
function setUpdateEvents(){
    let events = JSON.parse(localStorage.getItem('events'))
    let div = this.closest('div') 
    let event = events.find(myEvent => myEvent.id === div.id);
    events = events.filter(myEvent => myEvent.id !== event.id);
    event.text = div.querySelector('textarea').value
    events.push(event)
    localStorage.setItem('events', JSON.stringify(events))
  }
  
function setDeleteEvents(){
    let events = JSON.parse(localStorage.getItem('events'))
    let div = this.closest('.row')
    events = events.filter(myEvent => myEvent.id !== div.id);
    localStorage.setItem('events', JSON.stringify(events))
    eventsList()
  }
  
  
  
function eventsList(){
    let events = JSON.parse(localStorage.getItem('events')) || []
    events = events.filter(event => moment(event.date).add(1, 'day').toDate() >= moment().toDate())
    if(events !== []){
        events.sort(sortEvents)
        $(".container-fluid").empty();
        let date = ''
        for(myEvent of events) {
            let myDate = myEvent.date
            if (myDate != date){
              $('.container-fluid').append(`<h3>${moment(myDate).format("MMM Do YYYY")}</h3>`);
               date = myDate
            }
            var template = 
                `<div id="${myEvent.id}" class="row time-block ${checkperiod(myEvent)}">` +
                    `<div class="col-2 col-md-1 hour text-center py-3">${myEvent.hour} <h5 onclick="setDeleteEvents.call(this)">x</h5></div>` +
                    `<textarea class="col-8 col-md-10 description" rows="3">${myEvent.text}</textarea>` +
                    `<button onclick="setUpdateEvents.call(this)" type="submit" class="btn saveBtn col-2 col-md-1" aria-label="save">` +
                        '<i class="fas fa-save" aria-hidden="true"></i>' +
                    '</button>' +
                '</div>'
            $('.container-fluid').append(template);
      }
      localStorage.setItem('events', JSON.stringify(events))
    }
  }
  
  
function dataValid(massage, check_data, massage_error){
    let data = prompt(massage)
    if(data){
      data = data.toUpperCase()
    }
    while(!check_data.includes(data)){
        data = prompt(massage_error);
    }
    return data
  }
  
function formValid(date, text=''){
    let events = JSON.parse(localStorage.getItem('events'))
  
    if(!events){
      events = [];
    }
    let hour = dataValid('Enter hours(number) from 1 to 12', HOURS, 'Try again. You have too submit just number from 1 to 12')
    let partOfDay = dataValid('Enter part of day(AM or PM)', PARTSOFDAY, 'Try again. Just submit - AM or PM')
  
    let eventTime = `${hour} ${partOfDay}`
    let id = date + hour + partOfDay
    let is_exist = !events.find(myevent => (myevent.hour === eventTime && myevent.date === date))
    let period = checkperiod({date: date, hour: eventTime})
  
    if(date && is_exist && ['present', 'future'].includes(period)){
      $('#already-exists').text('')
      createEvent(id=id,date=date, events=events, eventTime=eventTime, text='')
    } else{
       $('#already-exists').text('This date is already booked or does not exist')
    }
    eventsList()
  }
  
function createEvent(id, date, events, eventTime, text){
    events.push({id: id, date: date, text: text, hour: eventTime})
    localStorage.setItem('events', JSON.stringify(events))
  }
  
function updateEvent(div, events){
   let event = events.find(myEvent => myEvent.id === div.id);
   events = events.filter(myEvent => myEvent.id !== event.id);
   event.text = div.querySelector('textarea').value
   events.push(event)
   return events
}
  
  
$("#field").attr("min", moment().format('L'))
  
eventsList()
  
const form = document.querySelector('form')
  
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const date = new FormData(form);
    formValid(date.get('calendar')); 
});



