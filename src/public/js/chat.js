/* eslint-disable no-undef */
Swal.fire({
  title: 'Autheintcation',
  input: 'text',
  text: 'set username for the chat',
  inputValidator: value => { return !value.trim() && 'please write a valid username' },
  allowOutsideClick: false
}).then(result => {
  const user = result.value
  document.getElementById('username').innerHTML = user
  // eslint-disable-next-line prefer-const
  let socketClient = io()

  const chatBox = document.getElementById('chatBox')
  chatBox.addEventListener('keyup', e => {
    if (e.key === 'Enter') {
      if (chatBox.value.trim().length > 0) {
        socketClient.emit('message', {
          user,
          message: chatBox.value
        })
        chatBox.value = ''
      }
    }
  })
})

const socketClient = io()

socketClient.on('history', data => {
  const history = document.getElementById('history')
  let messages = ''
  data.reverse().forEach(message => {
    messages += `<p><a>${message.user}</a>: ${message.message}</p>`
  })
  history.innerHTML = messages
})
