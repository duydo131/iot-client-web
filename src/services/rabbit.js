import Stomp from 'stompjs'

export function connectRabbit(){

let stompClient

    var ws = new WebSocket('ws://localhost:15674/ws')

    const headers = {
        'login': 'guest',
        'passcode': 'guest',
        'durable': 'true',
        'auto-delete': 'false'
    }
    stompClient = Stomp.over(ws)

    stompClient.connect(headers , function(frame){
                console.log('Connected')
               const subscription = stompClient.subscribe('/queue/myQueue', function(message){
                   console.log(message)
               })
    })

}