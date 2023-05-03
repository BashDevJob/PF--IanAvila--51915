let contenedorCarro = document.getElementById("contenedorCarro")
let botonComprar = document.getElementById("comprar")
botonComprar.addEventListener("click", finalizarCompra)
let inputs = document.getElementsByClassName("form-check-input")
fetch("data.json")
  .then(respuesta => respuesta.json())
  .then(semillas=> {
    armarTarjetas(semillas)
    for (const input of inputs) {
      input.addEventListener("click", () => {
        filtrarPorTemporada(semillas)
      })
    }
  })

function finalizarCompra() {
  swal.fire({
    title: "Gracias por escogernos, su compra fue satisfactoria",
    showConfirmButton: false,
    timer: 1350
  })
  localStorage.removeItem("carrito")
  carrito = []
  armarTarjetasCarro(carrito)
}

let carrito = []
if (localStorage.getItem("carrito")) {
  carrito = JSON.parse(localStorage.getItem("carrito"))
  armarTarjetasCarro(carrito)
}

let registroInicio = document.getElementById("registroInicio")
let mostrarCarro = document.getElementById("mostrarCarro")

// REGISTRARSE
let usuario = document.getElementById("usuario")
let contrasenia = document.getElementById("contrasenia")
let registrarse = document.getElementById("registrar")

registrarse.addEventListener("click", () => {
  let infoUsuario = { usuario: usuario.value, contrasenia: contrasenia.value}
  localStorage.setItem("infoUsuario", JSON.stringify(infoUsuario))
})

// INICIAR SESION
function alertaIS(titulo, icon){
  swal.fire({
    title: titulo,
    icon: icon,
    showConfirmButton: false,
    timer: 1350
  })
}

let usuarioLogn = document.getElementById("usuarioLogn")
let contraseniaLong = document.getElementById("contraseniaLogn")
let iniciarSesion = document.getElementById("iniciarSesion")

iniciarSesion.addEventListener("click", () => {
  let infoUsuario = JSON.parse(localStorage.getItem("infoUsuario"))
  if (infoUsuario.usuario == usuarioLogn.value && infoUsuario.contrasenia == contraseniaLong.value) {
    alertaIS("todo correcto", "success")
    registroInicio.classList.remove("mostrar")
    registroInicio.classList.add("ocultar")
    mostrarCarro.classList.remove("ocultar")
  } else {
    alertaIS("hubo un error", "error")
  }
})

//"PAG PRINCIPAL"
let contenedorProductos = document.getElementById("contenedorDeProductos")


let verCarro = document.getElementById("verCarrito")
verCarro.addEventListener("click", () => {
  registroInicio.classList.add("ocultar")
  mostrarCarro.classList.add("ocultar")
  carro.classList.remove("ocultar")
})


function filtrarPorTemporada(semillas) {
  let filtros = []
  for (const input of inputs) {
    if (input.checked) {
      filtros.push(input.id)
    }
  }
  let arrayFiltrado = semillas.filter(semillas => filtros.includes(semillas.temporada))
  armarTarjetas(arrayFiltrado.length > 0 ? arrayFiltrado : semillas)
}

function armarTarjetas(semillas) {
  contenedorProductos.innerHTML = ""
  semillas.forEach(({nombre, id, imagen, precio, temporada}) => {
    let tarjeta = document.createElement("div")
    tarjeta.className = "productoSemillas"
    tarjeta.innerHTML = `
      <div class="card" style="width: 18rem;">
        <img src="${imagen}" class="card-img-top" alt="...">
        <div class="card-body">
          <h5 class="card-title">${nombre}</h5>
          <p class="card-text">Temporada: ${temporada} </p>
          <p>Precio: $${precio}</p>
          <button type="button" id=${id} class="btn btn-outline-secondary">Agregar al carrito</button>
        </div>
      </div>
    `
    contenedorProductos.append(tarjeta)
    let botonIdCompra = document.getElementById(id)
    botonIdCompra.addEventListener("click", (e) => {
      agregarAlCarro(e, semillas)
    })
  })
}

function lanzarTostada(){
  Toastify({
    text: "Producto agregado al carro",
    duration: 3000,
    newWindow: true,
    close: false,
    gravity: "top",
    position: "right",
    stopOnFocus: false,
    style: {
      background: "linear-gradient(to right, #83e783, #c9e783)",
    },
  }).showToast();
}

function agregarAlCarro(e, semillas){
  lanzarTostada()
  let semillaBuscada = semillas.find(semillas => semillas.id === Number(e.target.id))
  if(carrito.some(semillas => semillas.id == semillaBuscada.id)) {
    let posicion = carrito.findIndex(semilla => semilla.id == semillaBuscada.id)
    carrito[posicion].unidades++
    carrito[posicion].precioTotal = carrito[posicion].precio * carrito[posicion].unidades 
  } else {
    carrito.push({
      id: semillaBuscada.id,
      nombre: semillaBuscada.nombre,
      precio: semillaBuscada.precio,
      unidades: 1,
      precioTotal: semillaBuscada.precio,
      imagen: semillaBuscada.imagen
    })
  }
  localStorage.setItem("carrito", JSON.stringify(carrito))
  armarTarjetasCarro(carrito)
}

function armarTarjetasCarro(carrito) {
  contenedorCarro.innerHTML = ""
  carrito.forEach(({nombre, imagen, precio, unidades, precioTotal}) => {
    let tarjeta = document.createElement("div")
    tarjeta.className = "productoSemillas"
    tarjeta.innerHTML = `
      <div class="card" style="width: 18rem;">
      <img src="${imagen}" class="card-img-top" alt="...">
      <div class="card-body">
        <h5 class="card-title">${nombre}</h5>
        <p>Unidades: ${unidades}</p>
        <p>Precio: $${precio}</p>
        <p class="card-text">Precio Total: $${precioTotal}</p>
      </div>
    </div>
    `
    contenedorCarro.append(tarjeta)
  })
}

//carrito
let carro = document.getElementById("carro")
let seguirComprando = document.getElementById("inicio")

seguirComprando.addEventListener("click", () => {
  registroInicio.classList.add("ocultar")
  mostrarCarro.classList.remove("ocultar")
  carro.classList.add("ocultar")
})