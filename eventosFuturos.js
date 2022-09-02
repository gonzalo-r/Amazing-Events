  var soloEventos=[];
  var dataSoloEventos=[];
  var categorys="";
  
  async function getData(){
    await fetch ("https://amazing-events.herokuapp.com/api/events")
    .then(response => response.json())
    .then(json => dataSoloEventos=json)
  
    soloEventos=dataSoloEventos.events
  
    var lasCategory=soloEventos.map(e=>e.category)
    const setCategorys = new Set(lasCategory) //nueva variable que contiene las categorias seteadas, no me las repite
    var soloCategorys =[...setCategorys]
  
    soloCategorys.map(categoria => {   
   categorys += `
     <div class="form-check form-check-inline">
     <label>
     <input class="form-check-input" type="checkbox" id="${categoria}" value="${categoria}">${categoria}</label>
     </div> `
    })          
   document.querySelector(".loscheck").innerHTML = categorys;
  
  function mostrarEnPantalla(listado)  {
    let cardDinamica = ""
    
    listado.map(evento =>{
      if(evento.date > dataSoloEventos.currentDate){
    
   cardDinamica += `
   <div class="card" style="width: 15rem;">
              <img src="${evento.image}" class="card-img-top  " alt="...">
              <div class="card-body">
              <h5 class="card-title">${evento.name}</h5>
              <p class="card-text">${evento.description}</p>
              <p class="card-text">Fecha:${evento.date}</p> 
              <a href="./detalle.html?id=${evento._id}" class="btn btn-primary">More..</a>
              </div>
    </div> `
  }})
  
    document.querySelector(".contenedorCards").innerHTML = cardDinamica
    
  }
  mostrarEnPantalla(soloEventos)
  
  //Checkboxes
  var checkboxes1=[]
  var categoryCheck=[]
    for(let categoria of soloCategorys){
     let checkboxes =  document.getElementById(categoria);
      if(checkboxes.value !== ""){
        checkboxes1.push(checkboxes)
      }
  }
  checkboxes1.forEach(check => 
  check.addEventListener("click",(e)=>{
    if(e.target.checked){
      categoryCheck.push(e.target.value)
      filtros(); 
    }else {
      categoryCheck = categoryCheck.filter(noChecked => noChecked !== e.target.value)
      filtros();
    }
  }))
  
  
  //Search
  var search = document.querySelector("#inputBuscar");
  var searching=[];
  search.addEventListener("keyup",(e)=>{
    searching = e.target.value.toLowerCase().trim()
    filtros()
  }) 
  
  valorFiltrado=[];
  function filtros(){
   
  if(searching !== "" &&  categoryCheck.length > 0){
  
    valorFiltrado= soloEventos.filter(evento=>  categoryCheck.includes(evento.category))
    .filter(evento => evento.name.toLowerCase().includes(searching))
      console.log(valorFiltrado)
  
   }else if(searching == "" &&  categoryCheck.length>0){
      valorFiltrado= soloEventos.filter(evento=>  categoryCheck.includes(evento.category))
       console.log(valorFiltrado) 
       
   }else if(searching !== "" && categoryCheck.length ==0){
      valorFiltrado = soloEventos.filter(evento => evento.name.toLowerCase().includes(searching))
  
   }
   else{
    valorFiltrado = soloEventos
   }
  mostrarEnPantalla(valorFiltrado);
  }
  }
  getData()