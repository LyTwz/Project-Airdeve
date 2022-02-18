import { initializeApp  } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { getDatabase, ref, child, get, onValue } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-database.js";
import {} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-analytics.js"

const firebaseConfig = initializeApp({
    apiKey: "AIzaSyCw3-_TdAnW-d-i6YqfMk3de80ivuDKQXQ",
    authDomain: "airdeve-2e590.firebaseapp.com",
    databaseURL: "https://airdeve-2e590-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "airdeve-2e590",
    storageBucket: "airdeve-2e590.appspot.com",
    messagingSenderId: "332313335576",
    appId: "1:332313335576:web:a38ec72ce9d630159f706d",
    measurementId: "G-ZHCS7DCJWZ"
  });

const db = getDatabase(); 

const dbRef = ref(db);

var eventList = { // Contient les evenements dans la BDD (à ajouter si de nouveaux evenements sont crées)
  'Soirée du nouvel an' :  {},
  "Soirée de noel" : {},
  "Concert BTS" : {}
};

var userList = {};
document.getElementById("suggestions").style.display = "";
var keyWords = [];


for(let i in eventList){
  var z = 0;
  let save = "Soirée du nouvel an"; 
  await get(child(dbRef, String(i))) // await permet d'attendre que les données soit récupérées avant de creer les blocs HTML
  .then((snapshot) => { // .then() Si la promesse est validée, alors le bloc est executé
      snapshot.forEach(childSnapshot => { // snapshot contient les données de la BDD, qu'on parcourt pour les insérer dans eventList
          if (String(i) != save) {
            z = 0;
            keyWords.push(String(i));
          }
          if (!keyWords.includes(String(i))) keyWords.push(String(i));
          eventList[String(i)][String(z)] = childSnapshot.val(); // Récupère les données de la BDD et les mets dans le dictionnaire eventList
          
          save = String(i);
          z += 1;
      });
  });
}

let i = 0;
let save = "Users"; 
await get(child(dbRef, save)) // await permet d'attendre que les données soit récupérées avant de creer les blocs HTML
  .then((snapshot) => { // .then() Si la promesse est validée, alors le bloc est executé
    snapshot.forEach(childSnapshot => { // snapshot contient les données de la BDD, qu'on parcourt pour les insérer dans eventList
      userList[String(i)] = childSnapshot.val(); // Récupère les données de la BDD et les mets dans le dictionnaire eventList
      if (!keyWords.includes(childSnapshot.val()["pseudo"])) keyWords.push(childSnapshot.val()["pseudo"]);
      i += 1;
  });
});

var userName = {};

for(let a = 0; a < Object.keys(userList).length; a++){
  userName[a] = userList[a]["pseudo"];
}

const entetes = ["Identifiant","Prénom","Nom","Prix","Type","Commande","Rembourser","Date de création","Date de mise à jour"];
const ordre = ["id", "firstName", "lastName", "cost", "type", "order", "refund", "createdAt", "updatedAt"];
const detailsEntete = ["Identifiant", "Date", "Titre Evenement", "Description Evenement", "Status Evenement", "Status campagne"];
const detailsOrdre = ["id", "date", "name", "desc", "status", "campStatus"];

var ticketCount = 0;
var refundCount = 0;
var noRefundCount = 0;

function createEventHTMLTable(data){

  var section = document.getElementById('eventList');
  var event = document.createElement("div");
  event.classList.add("event");
  event.style.display = "flex";
  event.id = "eventBloc";
  var div1 = document.createElement("div");
  div1.classList.add("table-responsive");
  var h = document.createElement("h7");
  var table = document.createElement("table");
  let thead = document.createElement("thead");
  h.innerHTML= data["name"];
  for (const entete of detailsEntete){ // Parcours des entetes
    let th = document.createElement("th");
    th.innerHTML = entete;
    thead.appendChild(th);
  }

  var tbody = document.createElement("tbody");
  table.appendChild(thead);
  div1.appendChild(h);
  div1.appendChild(table);
  event.appendChild(div1);
  section.appendChild(event);
  
  let trow = document.createElement('tr');

  for(const nom of detailsOrdre){
    let td = document.createElement("td");
    td.innerHTML = data[nom];
    trow.appendChild(td);
  }

  tbody.appendChild(trow);
  table.appendChild(tbody);

}

function createHTMLTable(data){

let events = Object.keys(data); // Récupère les clés de data 

  var divButton = document.createElement("div");
  divButton.id = "divButton";
  var button = document.createElement("button");
  button.id = "btn";
  button.innerHTML = "Retour";
  button.style.display = "none";
  divButton.appendChild(button);

for (let i = 0 ; i < events.length; i++) { // Parcours des 2 évenements (event2 et tickets) et creation de la structure HTML
  var section = document.getElementById('eventList');
  var event = document.createElement("div");
  event.classList.add("event");
  event.style.display = "flex";
  var div1 = document.createElement("div");
  div1.classList.add("table-responsive");
  var h = document.createElement("h7");
  h.classList.add("eventName");
  h.id = "eventName"+i;
  var table = document.createElement("table");
  let thead = document.createElement("thead");
  h.innerHTML= events[i];
  for (const entete of entetes){ // Parcours des entetes
    let th = document.createElement("th");
    th.innerHTML = entete;
    thead.appendChild(th);
  }
  
  var tbody = document.createElement("tbody");
  table.appendChild(thead);
  div1.appendChild(h);
  div1.appendChild(table);
  event.appendChild(div1);
  section.appendChild(event);
  
  for(let j = 0; j < Object.keys(data[events[i]]).length;j++){ // Parcours de chaque tickets d'un evenement
    let trow = document.createElement('tr');
    if(Object.keys(data[events[i]][j]).length == 9){
      ticketCount += 1;
      for (const nom of ordre){  // Creation de chaque ligne par rapport aux nombres de tickets
        let td = document.createElement("td");
        td.innerHTML = data[events[i]][String(j)][nom];
        trow.appendChild(td);
        if(data[events[i]][String(j)][nom] == "Oui"){
          refundCount += 1;
        }
        if(data[events[i]][String(j)][nom] == "Non"){
          noRefundCount += 1;
        }
      }
    }
    main.appendChild(divButton);
    tbody.appendChild(trow);
    table.appendChild(tbody);
  }  
}
    
}

function createList(data){
  var list = {};
  let events = Object.keys(data); // Récupère les clés de data 
  let user = userList;
  for(let a = 0; a < Object.keys(user).length; a++){
    list[a] = user[a]["pseudo"];
  }

  for(let k = 0; k < Object.keys(list).length; k++){ // Parcours des utilisateurs
    var section = document.getElementById('eventList');
    var event = document.createElement("div");
    event.classList.add("list");
    event.style.display = "none";
    var div1 = document.createElement("div");
    div1.classList.add("table-responsive");
    var h = document.createElement("h7");
    h.classList.add("user");
    h.id = "user"+k;
    var table = document.createElement("table");
    let thead = document.createElement("thead");
    h.innerHTML= list[k];
    for (const entete of entetes){ // Parcours des entetes
      let th = document.createElement("th");
      th.innerHTML = entete;
      thead.appendChild(th);
    }
    for (let i = 0 ; i < events.length; i++) { // Parcours des 2 évenements (event2 et tickets) et creation de la structure HTML
      var tbody = document.createElement("tbody");
      table.appendChild(thead);
      div1.appendChild(h);
      div1.appendChild(table);
      event.appendChild(div1);
      section.appendChild(event);
        let trow = document.createElement('tr');
          for(let j = 0; j < Object.keys(data[events[i]]).length;j++){ // Parcours de chaque tickets d'un evenement
            if(list[k].includes(data[events[i]][j]["firstName"])){
              if(Object.keys(data[events[i]][j]).length == 9){
                for (const nom of ordre){  // Creation de chaque ligne par rapport aux nombres de tickets
                  let td = document.createElement("td");
                  td.innerHTML = data[events[i]][String(j)][nom];
                  trow.appendChild(td);
                }
              } 
            }
          }
    tbody.appendChild(trow);
    table.appendChild(tbody);
    }  
  }
}




const searchBar = document.getElementById("searchBar");
var event = document.getElementsByClassName('event');
var nbTicket = document.getElementById("nbTicket");
var nbTicketRefund = document.getElementById("refundTickets");
var nbTicketValid = document.getElementById("nbTicketValid")
var h1 = document.createElement("h4");
h1.setAttribute("id", 'total');
var h2 = document.createElement("h4");
h2.setAttribute("id", 'rembourser');
var h3 = document.createElement("h4");
h3.setAttribute("id", 'valides');

function afficherToutEvent(){
  for (let i = 0;i<event.length;i++){
    event[i].style.display = "flex";
  }
}

function afficherEvent(name){
  afficherToutEvent();
  for (let i = 0;i<event.length;i++){
    let toCompare = event[i].children[0].children[0].innerHTML.toLowerCase();
    if (name.toLowerCase() != toCompare){
      event[i].style.display = "none";
    }
  }
  let userTicket = document.getElementsByClassName("list");
  for(let j = 0; j < userTicket.length; j++){
    if(userTicket[j].innerText.includes(name)){
      userTicket[j].style.display = "flex";
    }
  }

}

searchBar.addEventListener("keyup" , (e) => {
  const searchString = e.target.value.toLowerCase();

  if(e.key == 'Enter'){

    afficherEvent(searchString);
    ticketCount = 0;
    noRefundCount = 0;
    refundCount = 0;
    for(let i in eventList){
      for(let j = 0; j < Object.keys(eventList[i]).length; j++){
      if(Object.keys(eventList[i][j]).length == 9 && searchString == i.toLowerCase()){
        ticketCount += 1;
        if(eventList[i][j]["refund"] == "Non"){
          noRefundCount += 1;
        }
        else {
          refundCount += 1;
        }
        }
      }
    }
    document.getElementById("total").innerHTML = ticketCount;
    document.getElementById("rembourser").innerHTML = refundCount;
    document.getElementById("valides").innerHTML = noRefundCount;
  }
  else { // Si rien n'est écrit et qu'on appuie sur entrer
    afficherToutEvent();
  }
  if (e.key == 'Backspace' ||  searchString == ""){ //Si on enleve tout avec la touche retour
    afficherToutEvent();
    let userTicket = document.getElementsByClassName("list");
    for(let j = 0; j < userTicket.length; j++){
      userTicket[j].style.display="none";
  }
  
    ticketCount = 0;
    noRefundCount = 0;
    refundCount = 0;
    for(let i in eventList){ 
      for(let j = 0; j < Object.keys(eventList[i]).length; j++){
        if(Object.keys(eventList[i][j]).length == 9){
          ticketCount += 1;
          if(eventList[i][j]["refund"] == "Non"){
            noRefundCount += 1;
        }
        else {
          refundCount += 1;
        }
        }
      }
    }
    document.getElementById("total").innerHTML = ticketCount;
    document.getElementById("rembourser").innerHTML = refundCount;
    document.getElementById("valides").innerHTML = noRefundCount;
    
  }

  let suggestion = document.getElementById("suggestions");
  suggestion.innerHTML = "";
  keyWords.forEach(words => {
    if (searchString != "" && words.toLowerCase().indexOf(searchString) > -1){ // Si la barre de recherche n'est pas vide et que le contenu de la barre de recherche existe dans les mots de keyWords
      let li = document.createElement("li");
      li.innerHTML = words; // Creer les lignes des suggestions
      suggestion.appendChild(li);
    }
  })

  if (suggestion.innerHTML != ""){ // Si le contenu des suggestions n'est pas vide, on l'affiche
    suggestion.style.display = "";
  } else {  // Sinon on affiche rien
    suggestion.style.display = "none";
  }

});
let ul = document.getElementById("suggestions");
ul.addEventListener("mousedown",function(e){ // Dès qu'on clique sur l'une des suggestions
  let suggestion = document.getElementById("suggestions");
  let content = e.target; // Contenu de la balise ciblé par la souris
  if (content.tagName.toLowerCase() == "li"){ // Regarde si la balise qui est ciblée par la souris vaut "li"
    searchBar.value = content.innerHTML;  // Modifie le contenu de la barre par le contenu de la balise qu'est ciblée
    suggestion.innerHTML = ""; // Contenu de suggestion vide
    suggestion.style.display = "none"; // Enleve l'affichage
    afficherEvent(content.innerHTML); // Affiche l'evenement ou la liste des tickets d'un utilisateur correspondant
  }
});

createHTMLTable(eventList);
createList(eventList);

h1.innerHTML= ticketCount;
h2.innerHTML= refundCount;
h3.innerHTML= noRefundCount;
nbTicket.appendChild(h1) 
nbTicketRefund.appendChild(h2);
nbTicketValid.appendChild(h3);

const eventName = document.getElementsByClassName("eventName");
const card = document.getElementsByClassName("dash-cards");
const title = document.getElementsByClassName("dash-title");

for(let i = 0; i<eventName.length; i++){ // Parcours des blocs ayant comme class EventName -> les div regroupant un evenement
  eventName[i].addEventListener("click", e =>{
      card[0].style.display= "none";
      title[0].textContent = "Événement";
      for (let i = 0;i<event.length;i++){ // Parcours des blocs ayant comme class event -> la main div qui regroupe tout
        event[i].style.display = "none";
      }
      let value = eventList[eventName[i].innerHTML];
      for(let j = 0; j<Object.keys(value).length;j++){
        if(Object.keys(value[j]).length != 9){
            createEventHTMLTable(value[j]);
        }
        const button = document.getElementById("divButton");
        const btn = document.getElementById("btn");
        btn.style.display ="flex";
        button.style.display ="flex";
      }

      const button = document.getElementById("divButton");
      const bloc = document.getElementsByClassName("bloc");
      const eventBloc = document.getElementById("eventBloc");

      button.addEventListener("click", e => {
        card[0].style.display ="flex";
        bloc[0].style.display = "block";
        title[0].textContent = "Tickets";
        eventBloc.remove();
        for (let i = 0;i<event.length;i++){ // Parcours des blocs ayant comme class event -> la main div qui regroupe tout
          event[i].style.display = "flex";
        }
        button.style.display = "none";
      })
      
    }
  )
}

