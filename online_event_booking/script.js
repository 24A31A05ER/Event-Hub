/* ================= AUTH PROTECTION ================= */

function protectPage(role){
    const loggedIn = localStorage.getItem("loggedIn");
    const userRole = localStorage.getItem("role") || "user";

    if (role === "user" && loggedIn !== "true") {
        alert("Please login first");
        window.location.href = "login.html";
        return;
    }

    if (role === "admin" && (loggedIn !== "true" || userRole !== "admin")) {
        alert("Admin access required. Please login as admin.");
        window.location.href = "login.html";
    }
}


/* ================= NAVBAR ================= */

const navbar = document.getElementById("navbar-links");

const loggedIn = localStorage.getItem("loggedIn");
const locationName = localStorage.getItem("location");
const flag = localStorage.getItem("flag");

function renderNavbar() {
    const navbar = document.getElementById("navbar-links");
    if (!navbar) return;

    const loggedIn = localStorage.getItem("loggedIn");
    const role = localStorage.getItem("role") || "user";
    const locationName = localStorage.getItem("location");
    const flag = localStorage.getItem("flag");

    if (loggedIn === "true" && role === "admin") {
        navbar.innerHTML = `
            <a href="home.html">Home</a>
            <a href="admin.html">Admin</a>
            <a href="#" onclick="logout()">Logout</a>
        `;
        return;
    }

    if (loggedIn === "true") {
        navbar.innerHTML = `
            <a href="home.html">Home</a>
            <a href="events.html">Events</a>
            <a href="booking_history.html">Bookings</a>
            <a href="profile.html">Profile</a>
            <div class="location-box">
                <img src="${flag || ''}" class="flag-img">
                <span>${locationName || 'Unknown'}</span>
            </div>
            <a href="#" onclick="logout()">Logout</a>
        `;
    } else {
        navbar.innerHTML = `
            <a href="login.html">Login</a>
            <a href="register.html">Register</a>
        `;
    }
}

if (navbar) {
    renderNavbar();
}


/* ================= LOGOUT ================= */

function logout(){

localStorage.removeItem("loggedIn");
window.location.href="home.html";

}


/* ================= REGISTER ================= */

function register(e){

e.preventDefault();

const name=document.getElementById("regName").value;
const email=document.getElementById("regEmail").value;
const password=document.getElementById("regPassword").value;
const confirm=document.getElementById("regConfirm").value;
const location=document.getElementById("regLocation").value;

if(location===""){
alert("Please select your country");
return;
}

if(password!==confirm){
alert("Passwords do not match");
return;
}

localStorage.setItem("userName",name);
localStorage.setItem("userEmail",email);
localStorage.setItem("userPassword",password);
localStorage.setItem("location",location);

const flagMap={
India:"images/flags/india.png",
USA:"images/flags/usa.png",
UK:"images/flags/uk.png",
Australia:"images/flags/australia.png"
};

localStorage.setItem("flag",flagMap[location]);

alert("Registration successful");

window.location.href="login.html";

}


/* ================= LOGIN ================= */

function login(){
    const email = document.getElementById("loginEmail").value.trim().toLowerCase();
    const password = document.getElementById("loginPassword").value;
    const role = document.getElementById("loginRole")?.value || "user";

    const savedEmail = localStorage.getItem("userEmail") || "";
    const savedPassword = localStorage.getItem("userPassword") || "";

    if (role === "admin") {
        if (email === "admin@eventhub.com" && password === "admin123") {
            localStorage.setItem("loggedIn","true");
            localStorage.setItem("role","admin");
            window.location.href="admin.html";
            return;
        }
        alert("Invalid admin credentials");
        return;
    }

    if (email === savedEmail.toLowerCase() && password === savedPassword) {
        localStorage.setItem("loggedIn","true");
        localStorage.setItem("role","user");
        localStorage.setItem("userName", localStorage.getItem("userName") || "User");
        window.location.href="home.html";
    } else {
        alert("Invalid user credentials");
    }
}




/* ================= FORGOT PASSWORD ================= */

function forgotPassword(){

const email=prompt("Enter your registered email:");
const savedEmail=localStorage.getItem("userEmail");

if(email===savedEmail){

alert("Your password is: "+localStorage.getItem("userPassword"));

}else{

alert("Email not found");

}

}


/* ================= SELECT EVENT ================= */

function selectEvent(eventOrTitle, date, location, price) {
    let event;
    if (typeof eventOrTitle === "string") {
        event = {
            title: eventOrTitle,
            date: date || "",
            location: location || "",
            price: Number(price) || 0,
            category: ""
        };
    } else if (eventOrTitle && typeof eventOrTitle === "object") {
        event = eventOrTitle;
    } else {
        return;
    }

    const selected = {
        title: String(event.title || event.name || "Untitled Event"),
        date: String(event.date || event.eventDate || ""),
        location: String(event.city || event.location || event.venue || ""),
        price: Number(event.price || 0),
        category: event.category || "",
        description: event.description || "",
        image: event.image || event.img || "",
        link: event.link || "event_details.html",
        time: event.time || ""
    };

    sessionStorage.setItem("selectedEvent", JSON.stringify(selected));
    window.location.href = "booking.html";
}

function getPublicEvents(){
    const events = getAdminEvents();
    if(events && events.length) return events;
    return [
        {id:1,title:"Concert Booking",category:"Music Concert",date:"March 25, 2026",city:"City Convention Center",price:1500,description:"Live music performance",image:"https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2?auto=format&fit=crop&w=800&q=80",link:"concert.html"},
        {id:2,title:"Tech Conference 2026",category:"Conference",date:"April 5, 2026",city:"Mumbai Tech Park",price:2000,description:"Industry conference",image:"https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80",link:"conference.html"},
        {id:3,title:"Web Development Workshop",category:"Workshop",date:"March 28, 2026",city:"Online Platform",price:800,description:"Hands-on coding workshop",image:"https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80",link:"workshop.html"}
    ];
}

function renderEventsPage(){
    const container = document.getElementById('eventsContainer');
    if(!container) return;
    const events = getPublicEvents();

    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q') || '';
    const categoryQuery = urlParams.get('category') || 'all';

    const searchEl = document.getElementById('searchInput');
    const catEl = document.getElementById('categoryFilter');
    if (searchEl && query) searchEl.value = query;
    if (catEl && categoryQuery) catEl.value = categoryQuery;

    container.innerHTML = '';
    events.forEach(evt => {
        const card = document.createElement('div');
        card.className = 'event-card';
        card.dataset.category = (evt.category || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        const detailsLink = evt.link || 'event_details.html';
        card.innerHTML = `
            <img src="${evt.image || 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80'}" alt="${evt.title}">
            <div class="event-body" style="padding: 15px;">
              <h3>${evt.title}</h3>
              <p>${evt.description || 'Event details coming soon.'}</p>
              <p style="font-weight:600;">${evt.date || ''} · ${evt.city || ''}</p>
              <p style="font-weight:700; color:#02457A;">₹${evt.price || 0}</p>
              <div class="buttons">
                <button type="button" class="details-btn">Book Now</button>
                <a href="event_details.html" class="details-btn details-link">View Details</a>
              </div>
            </div>
        `;
        const btn = card.querySelector('button');
        if(btn){ btn.addEventListener('click', ()=>selectEvent(evt)); }
        const detailsLinkEl = card.querySelector('.details-link');
        if (detailsLinkEl) {
          detailsLinkEl.addEventListener('click', (e) => {
             e.preventDefault();
             const selected = {
               title: evt.title || evt.name || 'Untitled Event',
               date: evt.date || evt.eventDate || '',
               location: evt.city || evt.location || evt.venue || '',
               price: Number(evt.price || 0),
               category: evt.category || '',
               description: evt.description || '',
               image: evt.image || evt.img || '',
               link: evt.link || 'event_details.html',
             };
             sessionStorage.setItem('selectedEvent', JSON.stringify(selected));
             window.location.href = 'event_details.html';
          });
        }
        container.appendChild(card);
    });
    filterEvents();
}

function searchEvents(){
    const q = document.getElementById('searchInput')?.value.trim() || '';
    const cat = document.getElementById('categorySelect')?.value || 'all';
    const params = new URLSearchParams();
    if(q) params.set('q', q);
    if(cat && cat !== 'all') params.set('category', cat);
    window.location.href = 'events.html' + (params.toString() ? '?' + params.toString() : '');
}

function showSuggestions(){
    const value = document.getElementById('searchInput')?.value.trim().toLowerCase();
    const suggestions = document.getElementById('suggestions');
    if(!suggestions) return;
    if(!value){ suggestions.innerHTML = ''; return; }
    const events = getPublicEvents();
    const matches = events.filter(e => e.title.toLowerCase().includes(value) || (e.description || '').toLowerCase().includes(value));
    suggestions.innerHTML = matches.slice(0,5).map(e => `<li onclick="document.getElementById('searchInput').value='${e.title.replace(/'/g, "\\'")}'; searchEvents();">${e.title}</li>`).join('');
}


/* ================= EVENTS FILTER ================= */

const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");

function filterEvents(){
    const searchValue = searchInput?.value.toLowerCase().trim() || "";
    const selectedCategory = categoryFilter?.value || "all";
    const cards = document.querySelectorAll(".event-card");

    cards.forEach(card=>{
      const title = card.querySelector("h3")?.textContent.toLowerCase() || "";
      const category = (card.dataset.category || '').toLowerCase().replace(/[^a-z0-9]/g,"");
      const categoryFilterValue = selectedCategory.toLowerCase().replace(/[^a-z0-9]/g,"");
      const matchesSearch = searchValue === "" || title.includes(searchValue);
      const matchesCategory = selectedCategory === "all" || category.includes(categoryFilterValue);
      card.style.display = (matchesSearch && matchesCategory) ? "block" : "none";
    });
}

if(searchInput){
  searchInput.addEventListener("input", filterEvents);
}
if(categoryFilter){
  categoryFilter.addEventListener("change", filterEvents);
}

// auto-run filtering on render if controls exist
filterEvents();


/* ================= BOOKING PAGE ================= */

function initBookingPage(){
    const eventData = sessionStorage.getItem("selectedEvent");
    
    if (!eventData) {
        const bookingLayout = document.getElementById("bookingLayout");
        const noEvent = document.getElementById("noEvent");
        
        if (bookingLayout) bookingLayout.classList.add("hidden");
        if (noEvent) noEvent.classList.remove("hidden");
        return;
    }
    
    try {
        const event = JSON.parse(eventData);
        const eventBox = document.getElementById("bookingEventInfo");
        
        if (eventBox) {
            eventBox.innerHTML = `
                <h2>${event.title}</h2>
                <p><strong>Date:</strong> ${event.date}</p>
                <p><strong>Location:</strong> ${event.location}</p>
                <p><strong>Price:</strong> ₹${event.price}</p>
            `;
        }
        
        const pricePerTicket = document.getElementById("pricePerTicket");
        if (pricePerTicket) {
            pricePerTicket.textContent = `₹${event.price}`;
        }
        
        updateTotal();
    } catch (error) {
        console.error("Error loading event:", error);
        const bookingLayout = document.getElementById("bookingLayout");
        const noEvent = document.getElementById("noEvent");
        
        if (bookingLayout) bookingLayout.classList.add("hidden");
        if (noEvent) noEvent.classList.remove("hidden");
    }
}


/* ================= UPDATE TOTAL ================= */

function updateTotal(){
    const eventData = sessionStorage.getItem("selectedEvent");
    
    if (!eventData) return;
    
    try {
        const event = JSON.parse(eventData);
        const ticketsInput = document.getElementById("bookTickets");
        
        if (!ticketsInput) return;
        
        let tickets = parseInt(ticketsInput.value) || 1;
        if (tickets < 1) tickets = 1;
        if (tickets > 10) tickets = 10;
        
        const total = tickets * event.price;
        const totalPrice = document.getElementById("totalPrice");
        
        if (totalPrice) {
            totalPrice.textContent = `₹${total}`;
        }
    } catch (error) {
        console.error("Error updating total:", error);
    }
}


/* ================= HANDLE BOOKING ================= */

function handleBooking(e){
    e.preventDefault();

    const isLoggedIn = localStorage.getItem("loggedIn") === "true";
    if (!isLoggedIn) {
        alert("Please login before booking tickets.");
        window.location.href = "login.html";
        return;
    }

    const name = document.getElementById("bookName").value.trim();
    const email = document.getElementById("bookEmail").value.trim().toLowerCase();
    const ticketsInput = document.getElementById("bookTickets");
    let tickets = parseInt(ticketsInput.value) || 1;

    // Validation
    if (!name || name.length < 2) {
        alert("Please enter a valid name");
        return;
    }

    if (!email || !email.includes("@")) {
        alert("Please enter a valid email");
        return;
    }

    if (tickets < 1 || tickets > 10) {
        alert("Please enter valid number of tickets (1-10)");
        return;
    }

    const eventData = sessionStorage.getItem("selectedEvent");
    if (!eventData) {
        alert("Event data not found. Please select an event again.");
        return;
    }

    try {
        const event = JSON.parse(eventData);

        let bookings = JSON.parse(sessionStorage.getItem("bookings")) || [];

        const booking = {
            title: event.title,
            date: event.date,
            location: event.location,
            price: event.price,
            tickets: tickets,
            name: name,
            email: email,
            time: new Date().toLocaleString()
        };

        bookings.push(booking);
        sessionStorage.setItem("bookings", JSON.stringify(bookings));

        const bookingMsg = document.getElementById("bookingMsg");
        if (bookingMsg) {
            bookingMsg.classList.remove("hidden");
            bookingMsg.textContent = "Booking confirmed successfully! 🎉";
        }

        setTimeout(() => {
            window.location.href = "booking_history.html";
        }, 1500);
    } catch (error) {
        console.error("Error processing booking:", error);
        alert("Error processing your booking. Please try again.");
    }
}

/* ================= ADMIN PAGE ================= */

function getAdminEvents(){
    let events;
    try {
      events = JSON.parse(localStorage.getItem("adminEvents")) || [];
    } catch {
      events = [];
    }
    if (!events || !events.length) {
        events = [
            {id:1,title:"Concert Booking",category:"Music Concert",date:"March 25, 2026",city:"City Convention Center",price:1500,description:"Enjoy live music and unforgettable performances.",image:"https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2?auto=format&fit=crop&w=800&q=80",link:"concert.html"},
            {id:2,title:"Tech Conference 2026",category:"Conference",date:"April 5, 2026",city:"Mumbai Tech Park",price:2000,description:"Attend industry-leading professional conferences.",image:"https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80",link:"conference.html"},
            {id:3,title:"Web Development Workshop",category:"Workshop",date:"March 28, 2026",city:"Online Platform",price:800,description:"Upgrade your skills with hands-on sessions.",image:"https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80",link:"workshop.html"},
            {id:4,title:"Business Growth Seminar",category:"Seminar",date:"April 10, 2026",city:"New Delhi Auditorium",price:1200,description:"Gain knowledge from experts and speakers.",image:"https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80",link:"seminar.html"},
            {id:5,title:"Wedding Exhibition 2026",category:"Wedding",date:"April 15, 2026",city:"Grand Palace Hall",price:500,description:"Plan and book beautiful wedding venues.",image:"https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",link:"wedding.html"},
            {id:6,title:"Cricket Championship 2026",category:"Sport",date:"March 30, 2026",city:"Arun Jaitley Stadium",price:3000,description:"Reserve seats for thrilling sports matches.",image:"https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80",link:"sport.html"},
            {id:7,title:"Movie Marathon Weekend",category:"Movies",date:"April 1, 2026",city:"PVR Cinemas",price:350,description:"Book tickets for the latest blockbusters.",image:"https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80",link:"movies.html"},
            {id:8,title:"Comedy Night Show",category:"Live Performance",date:"March 27, 2026",city:"Laugh Factory",price:900,description:"Experience theatre, comedy and stage shows.",image:"https://images.unsplash.com/photo-1497032205916-ac775f0649ae?auto=format&fit=crop&w=800&q=80",link:"live-performance.html"},
            {id:9,title:"Blockbuster Pre-Release",category:"Movie Pre-Release",date:"April 20, 2026",city:"IMAX Premium Screen",price:600,description:"Watch upcoming movies before their official release.",image:"https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80",link:"prerelease.html"}
        ];
        localStorage.setItem("adminEvents", JSON.stringify(events));
    }
    return events;
}

function saveAdminEvents(events){
    localStorage.setItem("adminEvents", JSON.stringify(events));
}

function initAdminPage(){
    renderNavbar();
    renderAdminStats();
    renderAdminEvents();
    renderAdminBookings();
    filterAdmin();
}

function renderAdminStats(){
    const events = getAdminEvents();
    const bookings = JSON.parse(sessionStorage.getItem("bookings")) || [];
    document.getElementById("adminTotalEvents").textContent = events.length;
    document.getElementById("adminTotalBookings").textContent = bookings.length;
    const revenue = bookings.reduce((sum, b) => sum + (Number(b.price || 0) * Number(b.tickets || 0)), 0);
    document.getElementById("adminRevenue").textContent = `₹${revenue}`;
    document.getElementById("adminUsers").textContent = localStorage.getItem("userName") ? 1 : 0;
}

function renderAdminEvents(){
    const events = getAdminEvents();
    const body = document.getElementById("adminEventsBody");
    if(!body) return;
    body.innerHTML = "";
    events.forEach(evt => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${evt.title}</td>
            <td>${evt.category}</td>
            <td>${evt.date}</td>
            <td>${evt.city}</td>
            <td>₹${evt.price}</td>
            <td><button class="btn btn-outline btn-small" onclick="editEvent(${evt.id})">Edit</button>
                <button class="btn btn-danger btn-small" onclick="deleteEvent(${evt.id})">Delete</button></td>
        `;
        body.appendChild(row);
    });
}

function renderAdminBookings(){
    const bookings = JSON.parse(sessionStorage.getItem("bookings")) || [];
    const body = document.getElementById("adminBookingsBody");
    if(!body) return;
    body.innerHTML = "";
    bookings.forEach((b, i) => {
        const row = document.createElement("tr");
        const total = (Number(b.price)||0) * (Number(b.tickets)||0);
        row.innerHTML = `
            <td>${b.name}</td>
            <td>${b.title}</td>
            <td>${b.category || "-"}</td>
            <td>${b.date || "-"}</td>
            <td>${b.tickets || 1}</td>
            <td>₹${total}</td>
            <td>${b.status || "Confirmed"}</td>
            <td><button class="btn btn-outline btn-small" onclick="viewBooking(${i})">View</button></td>
        `;
        body.appendChild(row);
    });
    document.getElementById("noAdminBookings").classList.toggle("hidden", bookings.length > 0);
}

function switchAdminTab(tab){
    document.getElementById("adminEventsTab").classList.toggle("hidden", tab !== "events");
    document.getElementById("adminBookingsTab").classList.toggle("hidden", tab !== "bookings");
    document.querySelectorAll(".tab").forEach(btn => btn.classList.remove("active"));
    const activeTab = document.querySelector(`.tab[onclick="switchAdminTab('${tab}')"]`);
    if(activeTab) activeTab.classList.add("active");
}

function showEventForm(){
    document.getElementById("eventFormCard").classList.remove("hidden");
    document.getElementById("eventFormTitle").textContent = "Add New Event";
    document.getElementById("eventFormBtn").textContent = "Add Event";
    document.getElementById("editEventId").value = "";
    document.getElementById("eventForm").reset();
    document.getElementById("evtImagePreview").innerHTML = "";
}

function hideEventForm(){
    document.getElementById("eventFormCard").classList.add("hidden");
}

function handleEventSubmit(e){
    e.preventDefault();
    const id = Number(document.getElementById("editEventId").value) || null;
    const title = document.getElementById("evtName").value.trim();
    const category = document.getElementById("evtCategory").value;
    const desc = document.getElementById("evtDesc").value.trim();
    const date = document.getElementById("evtDate").value;
    const time = document.getElementById("evtTime").value;
    const venue = document.getElementById("evtVenue").value.trim();
    const city = document.getElementById("evtCity").value.trim();
    const price = Number(document.getElementById("evtPrice").value);
    const seats = Number(document.getElementById("evtTotalSeats").value);
    const image = document.getElementById("evtImage").value.trim();
    const link = document.getElementById("evtLink").value.trim() || "event_details.html";
    if(!title||!category||!date||!time||!venue||!city||!price){
        alert("Please fill in all required fields.");
        return;
    }
    const events = getAdminEvents();
    if(id){
        const idx = events.findIndex(e=>e.id===id);
        if(idx > -1) {
            events[idx] = { ...events[idx], title, category, description: desc, date, time, venue, city, price, seats, image, link };
        }
    } else {
        const nextId = (events.reduce((max,e)=>Math.max(max,e.id),0) || 0) + 1;
        events.push({ id: nextId, title, category, description: desc, date, time, venue, city, price, seats, image, link});
    }
    saveAdminEvents(events);
    renderAdminEvents();
    renderAdminStats();
    hideEventForm();
    alert("Event saved successfully.");
}

function editEvent(eventId){
    const events = getAdminEvents();
    const evt = events.find(e=>e.id===eventId);
    if(!evt) return;
    showEventForm();
    document.getElementById("eventFormTitle").textContent = "Edit Event";
    document.getElementById("eventFormBtn").textContent = "Save Changes";
    document.getElementById("editEventId").value = evt.id;
    document.getElementById("evtName").value = evt.title;
    document.getElementById("evtCategory").value = evt.category;
    document.getElementById("evtDesc").value = evt.description;
    document.getElementById("evtDate").value = evt.date;
    document.getElementById("evtTime").value = evt.time;
    document.getElementById("evtVenue").value = evt.venue;
    document.getElementById("evtCity").value = evt.city;
    document.getElementById("evtPrice").value = evt.price;
    document.getElementById("evtTotalSeats").value = evt.seats || 1;
    document.getElementById("evtImage").value = evt.image || "";
    document.getElementById("evtLink").value = evt.link || "";
    previewEventImage();
}

function deleteEvent(eventId){
    if(!confirm("Delete this event?")) return;
    let events = getAdminEvents();
    events = events.filter(e=>e.id!==eventId);
    saveAdminEvents(events);
    renderAdminEvents();
    renderAdminStats();
}

function viewBooking(index){
    const bookings = JSON.parse(sessionStorage.getItem("bookings")) || [];
    const b = bookings[index];
    if(!b) return;
    alert(`Booking: ${b.title}\nUser: ${b.name}\nDate: ${b.date}\nTickets: ${b.tickets}\nTotal: ₹${Number(b.price||0)*Number(b.tickets||0)}`);
}

function previewEventImage(){
    const url = document.getElementById('evtImage')?.value;
    const preview = document.getElementById('evtImagePreview');
    if (preview) {
      preview.innerHTML = url ? `<img src="${url}" alt="Event Image" style="max-width:120px;max-height:80px;border-radius:8px;margin-top:8px;" />` : '';
    }
}

function exportAdminBookings(){
    let bookings = JSON.parse(sessionStorage.getItem('bookings')) || [];
    if (!bookings.length) { alert('No bookings to export!'); return; }
    let csv = 'User,Event,Category,Date,Tickets,Total,Status\n';
    bookings.forEach(b => {
      csv += `${b.name},${b.title},${b.category || ''},${b.date},${b.tickets},${Number(b.price||0)*Number(b.tickets||0)},${b.status || 'Confirmed'}\n`;
    });
    let blob = new Blob([csv], { type: 'text/csv' });
    let link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'bookings.csv';
    link.click();
}

function filterAdmin() {
    const search = document.getElementById('adminSearchInput')?.value.toLowerCase() || '';
    const cat = document.getElementById('adminCategoryFilter')?.value || 'all';
    const events = getAdminEvents();
    const bookings = JSON.parse(sessionStorage.getItem('bookings')) || [];
    const filteredEvents = events.filter(e => {
      const matchText = e.title.toLowerCase().includes(search) || (e.description || '').toLowerCase().includes(search) || e.city.toLowerCase().includes(search);
      const matchCat = cat === 'all' || e.category === cat;
      return matchText && matchCat;
    });
    const body = document.getElementById('adminEventsBody');
    if(body){
      body.innerHTML = '';
      filteredEvents.forEach(evt => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${evt.title}</td><td>${evt.category}</td><td>${evt.date}</td><td>${evt.city}</td><td>₹${evt.price}</td><td><button class="btn btn-outline btn-small" onclick="editEvent(${evt.id})">Edit</button> <button class="btn btn-danger btn-small" onclick="deleteEvent(${evt.id})">Delete</button></td>`;
        body.appendChild(row);
      });
    }
    const tbodyBookings = document.getElementById('adminBookingsBody');
    if(tbodyBookings){
      tbodyBookings.innerHTML = '';
      bookings.filter(b => {
         const text = `${b.name} ${b.title} ${b.category || ''}`.toLowerCase();
         const mS = search === '' || text.includes(search);
         const mC = cat === 'all' || b.category === cat;
         return mS && mC;
      }).forEach((b,i) => {
         const total = Number(b.price||0)*Number(b.tickets||0);
         const row = document.createElement('tr');
         row.innerHTML = `<td>${b.name}</td><td>${b.title}</td><td>${b.category||'-'}</td><td>${b.date||'-'}</td><td>${b.tickets||1}</td><td>₹${total}</td><td>${b.status||'Confirmed'}</td><td><button class="btn btn-outline btn-small" onclick="viewBooking(${i})">View</button></td>`;
         tbodyBookings.appendChild(row);
      });
    }
}

function openAdminModal(title, bodyHtml, footerHtml) {
    const modal = document.getElementById('adminModal');
    if(!modal) return;
    document.getElementById('adminModalTitle').textContent = title;
    document.getElementById('adminModalBody').innerHTML = bodyHtml;
    document.getElementById('adminModalFooter').innerHTML = footerHtml;
    modal.classList.remove('hidden');
}

function closeAdminModal() {
    const modal = document.getElementById('adminModal');
    if(modal) modal.classList.add('hidden');
}

/* ================= PROFILE PAGE ================= */

if(document.getElementById("userName")){

const name = localStorage.getItem("userName") || "User";
const email = localStorage.getItem("userEmail");
const location = localStorage.getItem("location");
const flagImg = localStorage.getItem("flag");

if(!email){
alert("Please login first");
window.location.href="login.html";
}

document.getElementById("userName").textContent = name;
document.getElementById("userEmail").textContent = email;
document.getElementById("userLocation").textContent = location;
document.getElementById("userFlag").src = flagImg;

document.getElementById("avatar").textContent =
name.charAt(0).toUpperCase();

const bookings =
JSON.parse(localStorage.getItem("bookings")) || [];

document.getElementById("bookingCount").textContent =
bookings.length;

}


/* ================= EDIT PROFILE ================= */

function openEdit(){

document.getElementById("editModal").style.display="flex";

document.getElementById("editName").value =
localStorage.getItem("userName");

document.getElementById("editLocation").value =
localStorage.getItem("location");

}

function closeEdit(){

document.getElementById("editModal").style.display="none";

}

function saveProfile(){

const newName =
document.getElementById("editName").value;

const newLocation =
document.getElementById("editLocation").value;

localStorage.setItem("userName",newName);
localStorage.setItem("location",newLocation);

alert("Profile updated successfully");

location.reload();

}