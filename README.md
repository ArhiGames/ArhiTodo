# Arhi Todo
Free and Open Source Kanban Style Todo App, perfect for your projects!
<img width="3809" height="1803" alt="grafik" src="https://github.com/user-attachments/assets/83b3bd4b-854e-4f7b-83a6-58c89599f543" />
<img width="3788" height="1813" alt="grafik" src="https://github.com/user-attachments/assets/7507a269-e67d-4ea7-aa9e-767712ae5954" />

# Features
- Kanban Boards: Create projects, boards, cardlists & cards. Design your cards by adding labels, description and subtasks!
- Realtime Updates: Work with your colleges together on a single project / board and see what the other's are doing without refreshing
- Multiple boards in a single project! Enhance your workflow by further categoryzing projects!
- Needed features directly built-in: Urgency, card members, labels, descriptions, checklists. But no unnecessary features which only make the app complexer but don't add any value to it 
- Excellent management tools for admins: Specify exactly what other's user may do and what not
- Invitations: Invitate other user's to use the app just by generating a simple invitation link!
- Easy to-deploy via docker-compose
There are a lot more features planned, which I'm going to add later in the development of the App, some of those features are: Image uploading, due dates & some QOL stuff (keyboard shortcuts, quick actions...)

# Why?
Altough there are a lot of Kanban-Projects, no one really fitted for me. Either it lacked some features I wanted to use or it was just to overwhelming. Because of that (and to further practice my coding skills) I decided to make my own Kanban-Todo Applicaction for the Web.

# The experience
Firstly, I mainly develop games with Unreal Engine 5 and C++ [(Download Ultima Nex for free)](https://store.steampowered.com/app/3608430/Ultima_Nex/), I rarely touch the Web Development Space, but already did several times for small projects. But what I always think when programming for the web, especially when using React, I just remember how much I hate it sometimes. My game-dev-performance heart dies if I only think a bit further into how React works, that it rerenders almost everything when changing state variables, that I have to completely reinstantiate a complex object for React to even know that the object has changed... is just bad...

For me, working in the backend is a lot more fun & really enjoyable. Writing an Authentication system, writing the permission system is a lot of fun! The best part: You can you any programming language you want! In the backend you have to think a lot more over how to implement a specific feature so that the server isn't overloaded as quickly, performance is important (like in Video Games ;))

# Deploy
The packages still contain the name `closed-alpha` altough it now really is almost full-release, but there are still some important features missing (image uploading, due dates)
Additionally, I only tested the app working with the NGINX Proxy Manager, not sure if it will work for other Reverse Proxies?...
Unfortunatly there is no documentation yet...
```.yaml
services:
  arhitodo.frontend:
    image: ghcr.io/arhigames/arhitodo.frontend:closedalpha
    container_name: arhitodo.frontend
    restart: unless-stopped
    ports:
      - "5123:5123"
    depends_on:
      - arhitodo.api

  arhitodo.api:
    image: ghcr.io/arhigames/arhitodo.backend:closedalpha
    container_name: arhitodo.api
    restart: unless-stopped
    environment:
      - ASPNETCORE_HTTP_PORTS=5000;5001
      - ConnectionStrings__DefaultConnection=Host=arhitodo.database;Database=${DB_NAME};Username=${DB_USER};Password=${DB_PASSWORD}
      - FrontendSettings__BaseUrl=${BASE_URL}
      - JWT__Issuer=${BASE_URL}
      - JWT__Audience=${BASE_URL}
      - JWT__SigningKey=${JWT_KEY}
    ports:
      - "8080:5000"
      - "8081:5001"
    depends_on:
      arhitodo.database:
        condition: service_healthy

  arhitodo.database:
    image: postgres:18
    container_name: arhitodo.database
    restart: unless-stopped
    environment:
      - POSTGRES_DB=${DB_NAME}
      - POSTGRES_USER=${DB_USER}
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER} -d ${DB_NAME}"]
      interval: 5s
      timeout: 5s
      retries: 5
    volumes:
      - ./db:/var/lib/postgresql
```
In your installation folder also create a .env file, in my instances I use the following .env file:
```.env
BASE_URL=
JWT_KEY=
DB_NAME=
DB_USER=
DB_PASSWORD=
```
