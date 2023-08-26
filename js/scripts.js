/* PROYECTO: Es una calculadora para el pago de honorarios a profesores 

 - En la línea 152 hay una aclaración respecto a la ruta del fetch porque tiraba error al ejecutarlo con la ruta correcta*/

const listaAlumnos = [];
let clasesTomadas = 0;

let btnVerPases = document.getElementById('verPases');
let btnCerrarPases = document.getElementById('cerrarPases');   
let btnCargarAlumno = document.getElementById("cargarAlumno");
let btnCalcularPago = document.getElementById("calcularPago");
let btnListarAlfabetica = document.getElementById("listarAlfabetica");

let valoresPases = document.getElementById("valoresPases");
let tablaAlumnos = document.getElementById("tablaAlumnos");
let pagoProfesor = document.getElementById("pagoProfesor");
let listaAlumnosAlfabetica = document.getElementById("listaAlumnosAlfabetica");

let clasesDictadas
let idAlumno = 0;
let idCheckbox = 0;
let resultadoSueldo = 0;

class Alumno {
	constructor(idAlumno, nombreAlumno, apellidoAlumno, tipoDePase, clasesTomadas) {
		this.idAlumno = idAlumno;
		this.nombreAlumno = nombreAlumno;
		this.apellidoAlumno = apellidoAlumno;
		this.tipoDePase = tipoDePase;
		this.clasesTomadas = clasesTomadas;
	}
}

// Inicia cuando se hace click en el botón Crear Alumno
function crearAlumno() {
	clasesDictadas = document.getElementById("clasesDictadas").valueAsNumber;
	// console.log(clasesDictadas, " clases dictadas en el mes");
	if (clasesDictadas > 0) {
		idAlumno++;
		let nombreAlumno = document.getElementById("nombreAlumno").value;
		let apellidoAlumno = document.getElementById("apellidoAlumno").value;
		let tipoDePase = Number(
			document.querySelector("input[name=tipoDePase]:checked").value
		);
		let alumno = new Alumno(
			idAlumno,
			nombreAlumno,
			apellidoAlumno,
			tipoDePase,
			clasesTomadas,
		);
		listaAlumnos.push(alumno);
		document.getElementById("nombreAlumno").value = "";
		document.getElementById("apellidoAlumno").value = "";
		Toastify({
			text: "Alumno cargado!",
			duration: 3000,
		}).showToast();
		mostrarAlumno();
		// console.log(listaAlumnos);
	}else {Swal.fire({
        icon: 'error',
        title: 'Chanfles...',
        text: 'Por favor, ingrese un número válido en clases dictadas',
        footer: '<i>Sólo números enteros positivos</i>'
        })}
};

// Inicia cuando se le da click al botón Pasar asistencia
function tomarAsistencia (id) {
	const buscado = listaAlumnos.find(alumno => alumno.idAlumno === id)
	// console.log(buscado.nombreAlumno, " es el alumno buscado")
	const checkboxes = document.querySelectorAll(`input[type="checkbox"]`);

	for (let i = 0; i < checkboxes.length; i++) {
		if (checkboxes[i].checked) {
			buscado.clasesTomadas++;
		}
	}

	Toastify({
		text: "Asistencia registrada",
		duration: 3000,
	}).showToast();

	mostrarAlumno(); 
	// console.log(buscado.nombreAlumno + " tomó " + buscado.clasesTomadas, "clases, y su id es: " + buscado.idAlumno); 
};

const mostrarAlumno = () => {
	tablaAlumnos.innerHTML = "";
	localStorage.setItem("alumnos", JSON.stringify(listaAlumnos));
	
	listaAlumnos.forEach((alumno, index) => {
		tablaAlumnos.innerHTML += `
			<div>
				<h4>Alumno ${index + 1}</h4>
				<span>${alumno.nombreAlumno} ${alumno.apellidoAlumno} </span>
				<button onclick="eliminarAlumno(${index})">Eliminar Alumno</button>
				<p>Selecciona las clases a las que asistió</p>			
			</div>`;
		for (let i = 0; i <clasesDictadas; i++) {
			idCheckbox++;
			const asistenciaCheckbox = document.createElement('input');
			asistenciaCheckbox.type = 'checkbox';
			asistenciaCheckbox.id = `asistencia-${idCheckbox}`;
			asistenciaCheckbox.value = 1;
			const etiquetaCheckbox = document.createElement('label');
			etiquetaCheckbox.textContent = `Clase ${i + 1}`;
			tablaAlumnos.appendChild(etiquetaCheckbox);
			etiquetaCheckbox.appendChild(asistenciaCheckbox);
		};
		tablaAlumnos.innerHTML += `
			<button onclick="tomarAsistencia(${alumno.idAlumno})">Pasar Asistencia</button>`
		
		if (alumno.clasesTomadas > 1) {
			tablaAlumnos.innerHTML += `
				<p>${alumno.nombreAlumno} asistió a ${alumno.clasesTomadas} clases</p>`;
		}else if(alumno.clasesTomadas == 1) {
				tablaAlumnos.innerHTML += `
					<p>${alumno.nombreAlumno} asistió a ${alumno.clasesTomadas} clase</p>`;
			} else {
				tablaAlumnos.innerHTML += `
					<p>${alumno.nombreAlumno} aún no asistió a clases</p>`;
			}
	});
};
// Botón de eliminar alumno con validación de SweetAlert
const eliminarAlumno = (index) => {
    Swal.fire({
        title: 'Está seguro que quiere eliminar al alumno?',
        text: "No podrá revertirlo si acepta",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Sí, eliminar alumno'
    }).then((result) => {
        if (result.isConfirmed) {
            listaAlumnos.splice(index, 1);
            mostrarAlumno();
            Swal.fire(
                'Eliminado',
                'Su alumno ha sido eliminado de la lista',
                'success'
            )
        }
    })
    // console.log(listaAlumnos);
};
// Utilización de AJAX con un .json
const pedirPases = async () => {
    const resp = await fetch ('http://127.0.0.1:5500/Javascript-Com43155/Amarillo-ProyectoFinalJS/js/valoresPases.json');
	/* La ruta correcta sería fetch ('./valoresPases.json')
	pero como me salta un error de Syntax y de CORS lo pude resolver colocando la ruta del servidor local generada por el Live Server del VSC */ 
    const data = await resp.json();

    btnCerrarPases.className = 'btn';
    btnVerPases.className = 'btn-close';

    data.forEach((pase) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <h4>${pase.nombre}</h4>
            <p>$ ${pase.valor}</p>
        `
        valoresPases.append(li)
    });
};
const cerrarPases = () => {
    valoresPases.innerHTML ="";
    btnVerPases.className ="btn";
    btnCerrarPases.className ="btn-close";
}

// Calculo de pago para el profesor
const calcularPago = () => {
	resultadoSueldo = 0;
	listaAlumnos.forEach((alum) => {
		switch(alum.tipoDePase) {
			case 5600:
				plataXalumno = (alum.tipoDePase / 8) * alum.clasesTomadas;
				break;
				case 3000:
					plataXalumno = (alum.tipoDePase / 4) * alum.clasesTomadas;
					break;
					default:
						plataXalumno = alum.tipoDePase * alum.clasesTomadas;
						break;
		}
		// console.log(plataXalumno, " pesos por alumno");
		resultadoSueldo += plataXalumno;
	});
	// console.log(resultadoSueldo, "total recaudado");
	mostrarSueldo();
}

const mostrarSueldo = () => {
	pagoProfesor.innerHTML = `
	<h2>Al profesor le corresponden $${resultadoSueldo} pesos</h2>
	`
}
const mostrarListaAlumnos = () => {
	const alumnosAlfabetica = JSON.parse(localStorage.getItem("alumnos"));
	alumnosAlfabetica.sort((a,b) => {
		if (a.nombreAlumno > b.nombreAlumno) {
			return 1;
		}
		if (a.nombreAlumno < b.nombreAlumno) {
			return -1;
		}
		return 0;
	});
	// console.log(alumnosAlfabetica);
	listaAlumnosAlfabetica.innerHTML = "";
	listaAlumnosAlfabetica.innerHTML +=`
	<h5>Listado de Alumnos</h5>`;

	alumnosAlfabetica.forEach((alumno) => {
		
		listaAlumnosAlfabetica.innerHTML +=`
		<li style="">
		${alumno.nombreAlumno}
		</li>
		`;
	});	
}

btnVerPases.addEventListener("click", pedirPases);
btnCerrarPases.addEventListener("click", cerrarPases);
btnCargarAlumno.addEventListener("click", crearAlumno);
btnCalcularPago.addEventListener("click", calcularPago);
btnListarAlfabetica.addEventListener("click", mostrarListaAlumnos);
