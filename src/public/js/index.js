// eslint-disable-next-line no-undef
const socketClient = io()

const table = document.getElementById('table-realTime')
const btn = document.getElementById('createBtn')

btn.addEventListener('click', () => {
  const body = {
    title: document.getElementById('title').value,
    description: document.getElementById('description').value,
    code: document.getElementById('code').value,
    price: parseFloat(document.getElementById('price').value),
    status: document.getElementById('status').value.toLowerCase() === 'true',
    stock: parseInt(document.getElementById('stock').value),
    category: document.getElementById('category').value
  }

  fetch('/api/products', {
    method: 'post',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(result => result.json())
    .then(result => {
      // eslint-disable-next-line no-undef
      if (result.error) throw new Error(result.error.issues)
      socketClient.emit('productList', result)
      // eslint-disable-next-line no-undef
      alert('todo salio bien!')
      document.getElementById('title').value = ''
      document.getElementById('description').value = ''
      document.getElementById('code').value = ''
      document.getElementById('price').value = ''
      document.getElementById('status').value = ''
      document.getElementById('stock').value = ''
      document.getElementById('category').value = ''
    })
    .catch(err => console.log(`error: ${JSON.stringify(err)}`))
})

socketClient.on('updatedProducts', data => {
  document.getElementById('tbody').innerHTML = ''
  for (const product of data) {
    const tr = document.createElement('tr')
    tr.innerHTML = `
    <td>${product.id}</td>
    <td>${product.title}</td>
    <td>${product.description}</td>
    <td>${product.code}</td>
    <td>${product.price}</td>
    <td>${product.status}</td>
    <td>${product.stock}</td>
    <td>${product.category}</td>
    `
    table.getElementsByTagName('tbody')[0].appendChild(tr)
  }
})
