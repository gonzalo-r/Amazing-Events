let data;
let soloEventos = [];
let eventospasados = [];
let eventosfuturos = [];
let fechaActual = "";
let tabla1 = document.querySelector("#tabla1");
let tablaFuturos = document.querySelector("#tablafuturos");
let tablaPasados = document.querySelector("#tablapasados");

getData();
async function getData() {
    await fetch("https://amazing-events.herokuapp.com/api/events")
        .then(response => response.json())
        .then(json => data = json);

     soloEventos = data.events;
     fechaActual = data.currentDate;
     
     function mayorMenorAsistencia (){
        var val = []
        val.push(...soloEventos.filter(item => item.assistance !== undefined))    
        val.map(item => item.porcentaje = (item.assistance * 100) / item.capacity)  
        val.sort((a,b) => b.porcentaje - a.porcentaje)
        
        mayorA = val[0].name 
        menorA = val[val.length-1].name 
        arrayA = [mayorA, menorA]
        return arrayA
     }
     
     function capacidadMayor(){
        var val = []
        val.push(...soloEventos)
        val.sort((a,b) => b.capacity - a.capacity)
        mayorc = val[0].name 
        return mayorc
     }
 
     let mayorAsistencia = mayorMenorAsistencia (eventospasados)[0];      
     let menorAsistencia = mayorMenorAsistencia (eventospasados)[1];     
     let mayorCapacidad = capacidadMayor(soloEventos); 
     
     eventospasados = Pasados(soloEventos);
     eventosfuturos = Futuros(soloEventos);

    function Futuros(array) {
        let arrayFuturo = [];
        for (elemento of array) {
            if (elemento.date > fechaActual) {
                arrayFuturo.push(elemento);
            }
        }
        return arrayFuturo;
    }

    function Pasados(array) {
        let arrayPasado = [];
        for (elemento of array) {
            if (elemento.date < fechaActual) {
                arrayPasado.push(elemento);
            }
        }
        return arrayPasado;
    }

 function categorias(array) {
    let categoriasFiltradas = array.map(elemento => elemento.category);
    return [...new Set(categoriasFiltradas)];
}
let categoriasFuturas = categorias(eventosfuturos);
let categoriasPasadas = categorias(eventospasados);
let eFuturas = estadisticas(categoriasFuturas, eventosfuturos);
let ePasadas = estadisticas(categoriasPasadas, eventospasados);

 function estadisticas(arrayCategorias, arraysoloEventos) {
        let categorias = [];
        let ingresos = 0;
        let asistencia = 0;
        let elementosEnCategoria = 0;      

        for (categoria of arrayCategorias) {
            ingresos = 0;         
            asistencia = 0;
            elementosEnCategoria = 0;
            for (elemento of arraysoloEventos) {
                if (elemento.category == categoria) {
                    if (elemento.date > fechaActual) {
                        ingresos += Number(elemento.price) * Number(elemento.estimate);
                        asistencia += Number(elemento.estimate) / Number(elemento.capacity) * 100;
                        elementosEnCategoria++;
                    } else {
                        ingresos += Number(elemento.price) * Number(elemento.assistance);
                        asistencia += Number(elemento.assistance) / Number(elemento.capacity) * 100;
                        elementosEnCategoria++;
                    }
                }
            }
            categorias.push(              
                {
                    category: categoria,
                    revenue: ingresos / elementosEnCategoria,
                    attendance: asistencia / elementosEnCategoria
                }
            )
        }
        return categorias;    
    }

      verTabla1()
    function verTabla1() {
        let fila = document.createElement('tr')
        fila.innerHTML = `    
                <td class="text-center">${mayorAsistencia} </td>
                <td class="text-center">${menorAsistencia} </td>
                <td class="text-center">${mayorCapacidad} </td>
                `
        tabla1.appendChild(fila);
    }

      verTabla2y3(eFuturas, ePasadas)
    function verTabla2y3(arrayFuturo, arrayPasado) {      
        for (elemento of arrayFuturo) {
            tablaFuturos.appendChild(crearFila(elemento));
        }
        for (elemento of arrayPasado) {
            tablaPasados.appendChild(crearFila(elemento));
        }
    }

    function crearFila(elemento){
        let fila = document.createElement('tr')
        fila.innerHTML = `    
                <td>${elemento.category} </td>
                <td class="text-center">$${elemento.revenue.toFixed(2)} </td>
                <td class="text-center">%${elemento.attendance.toFixed(2)} </td>
                `
        return fila;
    }
}