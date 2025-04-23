 // Scene setup
 const scene = new THREE.Scene();
 const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
 const renderer = new THREE.WebGLRenderer({ antialias: true });
 renderer.setSize(window.innerWidth, window.innerHeight);
 renderer.setClearColor(0x000814); // Dark blue background
 document.body.appendChild(renderer.domElement);

 // Variables para el efecto de explosión
 let isExploding = false;
 let explosionTime = 0;
 let explosionDuration = 2; // duración en segundos
 let explosionPower = 15; // fuerza de la explosión
 let currentSection = null;

 // Create a sphere made of small cubes/points
 const sphereRadius = 5;
 const particleSize = 0.08;
 const numRings = 20;
 const particlesPerRing = 50;
 
 // Create a group to hold all particles
 const sphereGroup = new THREE.Group();
 scene.add(sphereGroup);
 
 // Create particle geometry and material
 const particleGeometry = new THREE.BoxGeometry(particleSize, particleSize, particleSize);
 const particleMaterial = new THREE.MeshStandardMaterial({
     color: 0x00ffff,
     emissive: 0x00ffff,
     emissiveIntensity: 0.5,
     metalness: 1,
     roughness: 0.2
 });
 
 // Create particles arranged in rings to form a sphere
 for (let ring = 0; ring < numRings; ring++) {
     const ringRadius = sphereRadius * Math.sin((ring / numRings) * Math.PI);
     const y = sphereRadius * Math.cos((ring / numRings) * Math.PI);
     
     for (let i = 0; i < particlesPerRing; i++) {
         const angle = (i / particlesPerRing) * Math.PI * 2;
         const x = ringRadius * Math.cos(angle);
         const z = ringRadius * Math.sin(angle);
         
         const particle = new THREE.Mesh(particleGeometry, particleMaterial.clone());
         particle.position.set(x, y, z);
         particle.userData = {
             originalPosition: { x, y, z },
             ringIndex: ring,
             particleIndex: i,
             explosionDirection: new THREE.Vector3(
                 Math.random() * 2 - 1,
                 Math.random() * 2 - 1,
                 Math.random() * 2 - 1
             ).normalize(),
             explosionSpeed: 0.5 + Math.random() * 1.5
         };
         sphereGroup.add(particle);
     }
 }
 
 // Create a glowing core at the center
 const coreGeometry = new THREE.SphereGeometry(1, 32, 32);
 const coreMaterial = new THREE.MeshBasicMaterial({
     color: 0x00ffff,
     transparent: true,
     opacity: 0.2
 });
 const core = new THREE.Mesh(coreGeometry, coreMaterial);
 sphereGroup.add(core);
 
 // Add floating particles around the sphere
 const floatingParticlesCount = 200;
 const floatingParticlesGroup = new THREE.Group();
 scene.add(floatingParticlesGroup);
 
 // Camera movement parameters
 const cameraMovementRadius = 2;
 const cameraMovementSpeed = 0.3;
 const initialCameraPosition = {
     x: 0,
     y: 0,
     z: 15
 };
 
 // Mouse interaction variables
 let mouseX = 0;
 let mouseY = 0;
 let targetRotationX = 0;
 let targetRotationY = 0;
 let currentRotationX = 0;
 let currentRotationY = 0;
 
 // Add mouse movement listener
 document.addEventListener('mousemove', (event) => {
     mouseX = (event.clientX - window.innerWidth / 2) / 100;
     mouseY = (event.clientY - window.innerHeight / 2) / 100;
     
     targetRotationX = mouseY * 0.5; // Limit rotation range
     targetRotationY = mouseX * 0.5;
 });
 
 // Contenido para cada sección del panel
 const panelContent = {
     "SOBRE MI": {
         title: "SOBRE MI",
         content: `
         <div class="profile-section">
             <div class="profile-details">
             <p>
             Tengo <strong>9 años de experiencia</strong> en el <strong>sector público y privado</strong>, participando en industrias como 
             <strong>transporte marítimo</strong>, comercial, salud e inmobiliaria. He brindado 
             <strong>soporte tecnológico</strong>, desarrollado sistemas, realizado mantenimiento de plataformas y automatizado procesos.
             Me destaco por mi <strong>capacidad de análisis</strong>, <strong>adaptabilidad</strong> a distintos entornos y 
             <strong>compromiso con la mejora continua</strong>, lo que me ha permitido resolver problemas y aportar valor en cada rol desempeñado.
             </p>
             </div>
             <img src="img/retrato.png" alt="Renzo Manchego" class="profile-image">
         </div>

                        
         <p>Mi enfoque siempre es conseguir los mejores resultados,
         destacando la habilidad para el análisis detallado y la adaptación a diversos entornos
         profesionales, la cual me ha permitido resolver problemas y contribuir en cada rol que he
         desempeñado.</p>
                         
         <div class="skills">
             <div class="skill">
               <i class="fas fa-brain icon"></i>
               <span class="text"><strong>Analítica:</strong> capacidad para resolver problemas complejos.</span>
             </div>
             <div class="skill">
               <i class="fas fa-handshake icon"></i>
               <span class="text"><strong>Colaborativa:</strong> buena comunicación y trabajo en equipo.</span>
             </div>
             <div class="skill">
               <i class="fas fa-project-diagram icon"></i>
               <span class="text"><strong>Adaptable:</strong> facilidad para aprender nuevas tecnologías.</span>
             </div>
             <div class="skill">
               <i class="fas fa-book icon"></i>
               <span class="text"><strong>Autodidacta:</strong> en constante actualización profesional.</span>
             </div>
         </div>
         
         <p>Poseo dominio e Interés en las áreas de TI, Programación, BI, BD y Seguridad de la Información.</p>

         <div class="education-section">
             <h3 class="education-title">FORMACIÓN ACADÉMICA</h3>
             <p><strong>Colegio:</strong> Horacio Patiño Cruzatti (2005-2010)</p>
             <p><strong>Universitario:</strong> Universidad San Ignacio de Loyola (2011-2016)</p>
         </div>
         <div class="contact-info">
             <div class="contact-details">
                 <p><strong>Teléfono:</strong> 945887786 / 4480107</p>
                 <p><strong>Email:</strong> manchego_reyna@hotmail.com</p>
             </div>
         </div>
      `           
     },
     "EXPERIENCIA": {
         title: "EXPERIENCIA",
         content: `           
         <div class="experience-tabs">
             <div class="tab active" data-tab="experience">Experiencia Laboral</div>
             <div class="tab" data-tab="projects">Proyectos</div>
         </div>

         <div class="experience-container tab-content" id="experience-tab" style="display: block;">

             <div class="experience-item scroll-animate">
                 <img src="img/surfplace.png" alt="SurfPlacePeru">
                 <div class="experience-details">
                     <h3>Analista Programador</h3>
                     <h4>SurfPlacePeru - IPMingenieros - Sinerminco (Mayo 2024 – Marzo 2025)</h4>
                     <ul class="task-list">
                         <li><i class="fas fa-check-circle"></i> Automatización de tareas con App.Script de Google y Python con la API de Google</li>
                         <li><i class="fas fa-check-circle"></i> Análisis y revisión de datos de API "Stormglass", Postman</li>
                         <li><i class="fas fa-check-circle"></i> Mantenimiento de la página Reporte de mar (HTML, JS, PHP) y librería (Swiper)</li>
                         <li><i class="fas fa-check-circle"></i> Mantenimiento de tareas automatizadas para generación de archivo Json</li>
                         <li><i class="fas fa-check-circle"></i> Carga de productos al Odoo y soporte en Google Sheet</li>
                     </ul>
                 </div>
             </div>
     
             <div class="experience-item scroll-animate">
                 <img src="img/emilima.png" alt="Emilima">
                 <div class="experience-details">
                     <h3>Analista Programador</h3>
                     <h4>EMILIMA (Setiembre 2023 – Febrero 2024)</h4>
                     <ul class="task-list">
                         <li><i class="fas fa-check-circle"></i> Mantenimiento y soporte del Sistema de Gestión Documentaria (C#)</li>
                         <li><i class="fas fa-check-circle"></i> Mantenimiento y soporte del Sistema Integrado de Gestión Inmobiliaria (JAVA)</li>
                         <li><i class="fas fa-check-circle"></i> Desarrollo de nuevos requerimientos en los sistemas</li>
                         <li><i class="fas fa-check-circle"></i> Migración de los registros de ventas de tesorería a contabilidad</li>
                         <li><i class="fas fa-check-circle"></i> Atención de ticket (Developer nivel 2)</li>
                     </ul>
                 </div>
             </div>
             
             <div class="experience-item scroll-animate">
                 <img src="img/essalud.png" alt="Essalud">
                 <div class="experience-details">
                     <h3>Analista de Sistemas</h3>
                     <h4>ESSALUD (Enero 2020 – Enero 2022)</h4>
                     <ul class="task-list">
                         <li><i class="fas fa-check-circle"></i> Responsable del PROCESO INFORMATICO DE LIQUIDACIONES MASIVAS DE DEUDA (Recaudación)</li>
                         <li><i class="fas fa-check-circle"></i> Encargado en el desarrollo del sistema de REFADENT (PHP)</li>
                         <li><i class="fas fa-check-circle"></i> Realización de la documentación del software</li>
                         <li><i class="fas fa-check-circle"></i> Manejo de FoxPro y Excel (programas, tablas y reportes)</li>
                     </ul>
                 </div>
             </div>
             
             <div class="experience-item scroll-animate">
                 <img src="img/sphereconsulting.jpeg" alt="Sphere Consulting">
                 <div class="experience-details">
                     <h3>Analista de BD</h3>
                     <h4>Sphere Consulting (Agosto 2019 – Diciembre 2019)</h4>
                     <ul class="task-list">
                         <li><i class="fas fa-check-circle"></i> Apoyar en los requerimientos en el sistema ERP Oracle del grupo Falabella</li>
                         <li><i class="fas fa-check-circle"></i> Creación y Desarrollo de reportes en Oracle 6.0 y 12.0</li>
                         <li><i class="fas fa-check-circle"></i> Análisis de los requerimientos funcionales y creación de los requerimientos técnicos</li>
                         <li><i class="fas fa-check-circle"></i> Apoyar en el mantenimiento del sistema Back Office del comercio electrónico de Saga Falabella (PLSQL)</li>
                     </ul>
                 </div>
             </div>
             
             <div class="experience-item scroll-animate">
                 <img src="img/hapaglloyd.png" alt="Hapag-Lloyd">
                 <div class="experience-details">
                     <h3>IT Coordinator</h3>
                     <h4>Hapag-Lloyd (Mayo 2017 – Octubre 2018)</h4>
                     <ul class="task-list">
                         <li><i class="fas fa-check-circle"></i> Coordinador de los servicios informáticos de Hapag Lloyd sede Perú y del Consorcio Naviero Peruano</li>
                         <li><i class="fas fa-check-circle"></i> Coordinar los proyectos informáticos con otras regiones Chile, Alemania, Egipto y otros</li>
                         <li><i class="fas fa-check-circle"></i> Uso de Excel (VBA) y Qlikview (Business Intelligence), desarrollando modelos de análisis</li>
                         <li><i class="fas fa-check-circle"></i> Apoyo en el área de finanzas, en atención al cliente y transacciones en SAP</li>
                     </ul>
                 </div>
             </div>
             
             <div class="experience-item scroll-animate">
                 <img src="img/greamspot.png" alt="GreamSpot">
                 <div class="experience-details">
                     <h3>Desarrollador Web</h3>
                     <h4>GreamSpot (Junio 2016 – Abril 2017)</h4>
                     <ul class="task-list">
                         <li><i class="fas fa-check-circle"></i> Desarrollar y administrar paginas web para MG & Chery, I-complement, Tucupon, Kawsay, Greamspot, Lapanka</li>
                         <li><i class="fas fa-check-circle"></i> Implementar, configurar y manejar servidores locales, entornos de desarrollo y máquinas virtuales</li>
                         <li><i class="fas fa-check-circle"></i> Implementar y administrar plugins, frameworks, cms, dominios, hosting y herramientas web</li>
                         <li><i class="fas fa-check-circle"></i> Optimización para seguridad, velocidad y almacenamiento (Filezilla, CDN, CloudFlare, Sitelock)</li>
                     </ul>
                 </div>
             </div>
         </div>

         <div class="experience-container tab-content" id="projects-tab" style="display: none;">
             <div class="project-item scroll-animate">
                 <a href="https://webpokeapi.netlify.app/" target="_blank" class="project-link">
                     <img src="img/pokeapiView.png" alt="Api de pokemon" class="project-image">
                     <div class="project-overlay">
                         <h3>pokeApi de pokemon</h3>
                         <p>Html • Css • Javascript</p>
                     </div>
                 </a>
             </div>
             
             <div class="project-item scroll-animate">
                 <a href="https://surfplaceperu.com/" target="_blank" class="project-link">
                     <img src="img/surfplaceView.png" alt="Pagina de Surfplaceperu " class="project-image">
                     <div class="project-overlay">
                         <h3>SurplacePeru Web</h3>
                         <p>PHP • Javascript • Highcharts</p>
                     </div>
                 </a>
             </div>
             
             <div class="project-item scroll-animate">
                 <a href="https://greamspot.com/" target="_blank" class="project-link">
                     <img src="img/greamspotView.png" alt="Pagina de Greamspot" class="project-image">
                     <div class="project-overlay">
                         <h3>Greamspot Web</h3>
                         <p>Wordpress • PHP • javascript</p>
                     </div>
                 </a>
             </div>
             
             <div class="project-item scroll-animate">
                 <a href="" target="_blank" class="project-link">
                     <img src="img/storebaseView.png" alt="Dashboard Tienda Virtual" class="project-image">
                     <div class="project-overlay">
                         <h3>Dashboard Tienda</h3>
                         <p>NodeJs • Express • JWT</p>
                     </div>
                 </a>
             </div>
         </div>
     `
 },
 "HABILIDADES": {
     title: "HABILIDADES TÉCNICAS",
     content: `
         <div class="skills-container">

             <div class="skills-block">
                 <h3><i class="fas fa-laptop-code"></i> Frontend</h3>
                 <div class="tech-grid">
                     <div class="tech-item"><img src="img/icons/html5icon.png" alt="HTML5"> HTML5</div>
                     <div class="tech-item"><img src="img/icons/css3icon.png" alt="CSS3"> CSS3</div>
                     <div class="tech-item"><img src="img/icons/jsicon.png" alt="JavaScript"> JavaScript</div>
                     <div class="tech-item"><img src="img/icons/jqueryicon.png" alt="Jquery"> Jquery</div>
                     <div class="tech-item"><img src="img/icons/ajaxicon.png" alt="Ajaxicon"> Ajax</div>
                     <div class="tech-item"><img src="img/icons/es6icon.png" alt="Ecmascript"> Ecmascript</div>
                     <div class="tech-item"><img src="img/icons/bootstrapicon.jpeg" alt="Bootstrap"> Bootstrap</div>
                     <div class="tech-item"><img src="img/icons/jsxicon.jpeg" alt="React"> React/Jsx</div>
                     <div class="tech-item"><img src="img/icons/angularicon.png" alt="Angular"> Angular</div>
                     
                 </div>
             </div>
             
             <div class="skills-block">
                 <h3><i class="fas fa-server"></i> Backend</h3>
                 <div class="tech-grid">
                     <div class="tech-item"><img src="img/icons/expressicon.png" alt="Express"> Express</div>
                     <div class="tech-item"><img src="img/icons/jwticon.png" alt="jwt"> JWT</div>
                     <div class="tech-item"><img src="img/icons/tsicon.png" alt="Typescript"> Typescript</div>
                     <div class="tech-item"><img src="img/icons/nesticon.png" alt="Nestjs"> Nestjs</div>
                     <div class="tech-item"><img src="img/icons/phpicon.jpeg" alt="PHP"> PHP</div>
                     <div class="tech-item"><img src="img/icons/cicon.jpeg" alt="C#"> C#</div>
                     <div class="tech-item"><img src="img/icons/neticon.png" alt="NET"> NET</div>
                     <div class="tech-item"><img src="img/icons/java8icon.png" alt="Java"> Java</div>
                     <div class="tech-item"><img src="img/icons/hibernateicon.jpeg" alt="Hibernate"> Hibernate</div>
                     <div class="tech-item"><img src="img/icons/html5icon.png" alt="HTML5"> PHP/Laravel</div>
                 </div>
             </div>
             
             <div class="skills-block">
                 <h3><i class="fas fa-database"></i> Base de datos</h3>
                 <div class="tech-grid">
                     <div class="tech-item"><img src="img/icons/sqlservericon.jpeg" alt="SQL Server"> SQL Server</div>
                     <div class="tech-item"><img src="img/icons/oracleicon.png" alt="Oracle"> Oracle</div>
                     <div class="tech-item"><img src="img/icons/mysqlicon.png" alt="MySQL"> MySQL</div>
                     <div class="tech-item"><img src="img/icons/postgresqlicon.png" alt="PostgreSQL"> PostgreSQL</div>
                 </div>
             </div>
             
             <div class="skills-block">
                 <h3><i class="fas fa-tools"></i> Tecnologías de desarrollo</h3>
                 <div class="tech-grid">
                     <div class="tech-item"><img src="img/icons/postmanicon.png" alt="Postman"> Postman</div>
                     <div class="tech-item"><img src="img/icons/iiscon.png" alt="ISS"> IIS</div>
                     <div class="tech-item"><img src="img/icons/giticon.png" alt="Git"> Git/GitHub</div>
                     <div class="tech-item"><img src="img/icons/githubicon.png" alt="GitHub"> GitHub</div>
                     <div class="tech-item"><img src="img/icons/tomcaticon.png" alt="Tomcat"> Tomcat</div>
                     <div class="tech-item"><img src="img/icons/xaampicon.png" alt="Xaamp"> Xaamp</div>
                     <div class="tech-item"><img src="img/icons/laragonicon.jpeg" alt="Laragon"> Laragon</div>
                     <div class="tech-item"><img src="img/icons/vsicon.png" alt="Visual Studio"> Visual Studio</div>
                     <div class="tech-item"><img src="img/icons/eclipseicon.jpeg" alt="Eclipse"> Eclipse</div>
                     <div class="tech-item"><img src="img/icons/cloudflareicon.png" alt="Cloudflare"> Cloudflare</div>
                     <div class="tech-item"><img src="img/icons/vultricon.jpeg" alt="Vultr"> Vultr</div>
                     <div class="tech-item"><img src="img/icons/wpicon.png" alt="WordPress"> WordPress</div>
                     <div class="tech-item"><img src="img/icons/figmaicon.png" alt="Figma"> Figma</div>
                     <div class="tech-item"><img src="img/icons/vboxicon.jpeg" alt="Virtual Box"> Virtual Box</div>
                 </div>
             </div>
             
             <div class="skills-block">
                 <h3><i class="fas fa-cogs"></i> Gestión y Servicios</h3>
                 <div class="tech-grid">
                     <div class="tech-item"><img src="img/icons/ciscojicon.jpeg" alt="Cisco Jabber"> Cisco Jabber</div>
                     <div class="tech-item"><img src="img/icons/matrixicon.jpeg" alt="Matrix42"> Matrix42</div>
                     <div class="tech-item"><img src="img/icons/tibcoicon.jpeg" alt="JasperSoft"> JasperSoft</div>
                     <div class="tech-item"><img src="img/icons/qkicon.png" alt="Qlikview"> Qlikview</div>
                     
                 </div>
             </div>
         </div>
     `
 }
 };
 
 // Funciones para manejar el panel informativo
 const infoPanel = document.querySelector('.info-panel');
 const closeButton = document.querySelector('.close-button');
 const panelTitle = document.querySelector('.panel-title');
 const panelContentElement = document.querySelector('.panel-content');
 
 function openPanel(section) {
     // Actualizar contenido del panel
     const content = panelContent[section];
     
     // Reiniciar animaciones del contenido y del encabezado
     const panelHeader = document.querySelector('.panel-header');
     
     // Primero quitamos las transiciones para hacer cambios instantáneos
     panelContentElement.style.transition = 'none';
     panelHeader.style.transition = 'none';
     
     // Establecemos los valores iniciales
     panelContentElement.style.opacity = '0';
     panelContentElement.style.transform = 'translateY(60px)';
     panelHeader.style.opacity = '0';
     panelHeader.style.transform = 'translateY(20px)';
     
     // Forzar un reflow para aplicar los cambios
     void panelContentElement.offsetWidth;
     
     // Actualizar el contenido
     panelTitle.textContent = content.title;
     panelContentElement.innerHTML = content.content;

     const tabs = document.querySelectorAll('.tab');
     const tabContents = document.querySelectorAll('.tab-content');

     tabs.forEach(tab => {
         tab.addEventListener('click', () => {
             // Remove active class from all tabs
             tabs.forEach(t => t.classList.remove('active'));
             
             // Add active class to clicked tab
             tab.classList.add('active');
             
             // Hide all tab contents
             tabContents.forEach(content => {
                 content.style.display = 'none';
             });
             
             // Show the selected tab content
             const tabId = tab.getAttribute('data-tab');
             const tabContent = document.getElementById(tabId + '-tab');
             if (tabContent) {
                 tabContent.style.display = 'block';
                 
                 // Reinitialize scroll observer for the visible content
                 setTimeout(initScrollObserver, 100);
             }
         });
     });
     
     // Preparar elementos para animación con scroll
     const animateElements = ['p', '.skill', '.profile-section', '.education-section', '.contact-info'];
     animateElements.forEach((selector, index) => {
         panelContentElement.querySelectorAll(selector).forEach(el => {
             el.classList.add('scroll-animate');
             // Añadir un pequeño retraso escalonado basado en el índice
             el.style.transitionDelay = `${0.1 * index}s`;
         });
     });
     
     // Restaurar las transiciones
     setTimeout(() => {
         panelContentElement.style.transition = '';
         panelHeader.style.transition = '';
         
         // Aplicar los valores finales para activar las transiciones
         panelContentElement.style.opacity = '1';
         panelContentElement.style.transform = 'translateY(0)';
         panelHeader.style.opacity = '1';
         panelHeader.style.transform = 'translateY(0)';
         
         // Si el panel no está activo, mostrarlo
         if (!infoPanel.classList.contains('active')) {
             infoPanel.classList.add('active');
         }
         
         // Iniciar observador de scroll después de que el panel esté visible
         setTimeout(initScrollObserver, 300);
     }, 50);
 }
 
 // Función para inicializar el observador de scroll
 // Función para inicializar el observador de scroll
 function initScrollObserver() {
     const scrollElements = document.querySelectorAll('.scroll-animate');
     
     // Configurar el Intersection Observer
     const observer = new IntersectionObserver((entries) => {
         entries.forEach(entry => {
             if (entry.isIntersecting) {
                 entry.target.classList.add('visible');
                 // Opcional: dejar de observar después de que se haya mostrado
                 observer.unobserve(entry.target);
             }
         });
     }, {
         root: panelContentElement,
         threshold: 0.1, // Reducido de 0.2 a 0.1 para detectar elementos con menor visibilidad
         rootMargin: '0px 0px 20px 0px' // Cambiado de -50px a 20px para detectar elementos antes de que estén completamente visibles
     });
     
     // Observar todos los elementos animables
     scrollElements.forEach(el => {
         observer.observe(el);
     });
     
     // Asegurarse de que los elementos al final del panel sean visibles
     panelContentElement.addEventListener('scroll', function() {
         // Verificar si el scroll está cerca del final
         if (this.scrollTop + this.clientHeight >= this.scrollHeight - 50) {
             // Hacer visibles todos los elementos que aún no lo son
             document.querySelectorAll('.scroll-animate:not(.visible)').forEach(el => {
                 el.classList.add('visible');
             });
         }
     });
 }
 
 function closePanel() {
     infoPanel.classList.remove('active');
 }
 
 // Event listeners para el panel
 closeButton.addEventListener('click', closePanel);
 
 // Añadir event listeners a los elementos de navegación
 document.querySelectorAll('.nav-item').forEach(item => {
     item.addEventListener('click', () => {
         // Iniciar la explosión
         isExploding = true;
         explosionTime = 0;
         currentSection = item.textContent;
         
         // Ocultar el contenido después de un breve retraso
         setTimeout(() => {
             document.querySelector('.content').style.opacity = '0';
         }, 100);
         
         // Abrir el panel más temprano, durante la explosión
         setTimeout(() => {
             openPanel(currentSection);
         }, 500);
         
         // Mostrar el contenido después de la explosión
         setTimeout(() => {
             document.querySelector('.content').style.opacity = '1';
         }, 1000);
     });
 });
 
 // Smaller particle geometry for floating particles
 const floatingParticleGeometry = new THREE.BoxGeometry(0.05, 0.05, 0.05);
 const floatingParticleMaterial = new THREE.MeshBasicMaterial({
     color: 0x00ffff,
     transparent: true,
     opacity: 0.7
 });
 
 // Create random floating particles
 for (let i = 0; i < floatingParticlesCount; i++) {
     const radius = sphereRadius * 1.5 + Math.random() * 5;
     const theta = Math.random() * Math.PI * 2;
     const phi = Math.random() * Math.PI;
     
     const x = radius * Math.sin(phi) * Math.cos(theta);
     const y = radius * Math.sin(phi) * Math.sin(theta);
     const z = radius * Math.cos(phi);
     
     const particle = new THREE.Mesh(floatingParticleGeometry, floatingParticleMaterial.clone());
     particle.position.set(x, y, z);
     particle.userData = {
         originalPosition: { x, y, z },
         speed: 0.2 + Math.random() * 0.5,
         offset: Math.random() * Math.PI * 2
     };
     floatingParticlesGroup.add(particle);
 }
 
 // Add lights
 const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
 scene.add(ambientLight);

 const pointLight = new THREE.PointLight(0x00ffff, 1, 100);
 pointLight.position.set(10, 10, 10);
 scene.add(pointLight);

 const pointLight2 = new THREE.PointLight(0xffffff, 0.5, 100);
 pointLight2.position.set(-5, 5, -5);
 scene.add(pointLight2);

 // Position camera
 camera.position.z = initialCameraPosition.z;
 
 // Animation loop
 function animate() {
     requestAnimationFrame(animate);
     
     const time = performance.now() * 0.001;
     
     // Actualizar tiempo de explosión si está activa
     if (isExploding) {
         explosionTime += 0.016; // Aproximadamente 60fps
         
         if (explosionTime >= explosionDuration) {
             isExploding = false;
             
             // Restaurar posiciones originales
             sphereGroup.children.forEach((particle) => {
                 if (particle.userData && particle.userData.originalPosition) {
                     const { x, y, z } = particle.userData.originalPosition;
                     const direction = new THREE.Vector3(x, y, z).normalize();
                     particle.position.copy(direction.multiplyScalar(sphereRadius));
                     
                     // Restaurar opacidad y rotación
                     if (particle.material) {
                         particle.material.opacity = 1;
                     }
                     particle.rotation.set(0, 0, 0);
                 }
             });
         }
     }
     
     // Smooth camera rotation based on mouse position
     currentRotationX += (targetRotationX - currentRotationX) * 0.05;
     currentRotationY += (targetRotationY - currentRotationY) * 0.05;
     
     // Move camera in a gentle circular pattern with mouse control
     camera.position.x = initialCameraPosition.x + Math.sin(time * cameraMovementSpeed) * cameraMovementRadius + currentRotationY * 2;
     camera.position.y = initialCameraPosition.y + Math.cos(time * cameraMovementSpeed) * cameraMovementRadius * 0.5 + currentRotationX * 2;
     
     // Keep camera looking at the center of the sphere
     camera.lookAt(0, 0, 0);
     
     // Animate main sphere particles
     sphereGroup.children.forEach((particle, index) => {
         if (particle.userData && particle.userData.originalPosition) {
             const { x, y, z } = particle.userData.originalPosition;
             const ringIndex = particle.userData.ringIndex;
             const particleIndex = particle.userData.particleIndex;
             
             if (isExploding && particle !== core) {
                 // Efecto de explosión
                 const progress = explosionTime / explosionDuration;
                 const easing = Math.pow(progress, 2); // Aceleración cuadrática
                 
                 // Dirección de explosión única para cada partícula
                 const explosionDir = particle.userData.explosionDirection;
                 const explosionSpeed = particle.userData.explosionSpeed;
                 
                 // Calcular nueva posición basada en la dirección de explosión
                 particle.position.x = x + explosionDir.x * explosionPower * easing * explosionSpeed;
                 particle.position.y = y + explosionDir.y * explosionPower * easing * explosionSpeed;
                 particle.position.z = z + explosionDir.z * explosionPower * easing * explosionSpeed;
                 
                 // Rotar partículas mientras explotan
                 particle.rotation.x += 0.1;
                 particle.rotation.y += 0.1;
                 
                 // Reducir opacidad gradualmente
                 if (particle.material) {
                     particle.material.opacity = 1 - easing;
                 }
             } else if (particle !== core) {
                 // Animación normal cuando no está explotando
                 // Pulse effect - particles move slightly in and out
                 const pulseAmplitude = 0.2;
                 const pulseFrequency = 0.5;
                 const ringOffset = ringIndex * 0.1;
                 const pulse = Math.sin(time * pulseFrequency + ringOffset) * pulseAmplitude;
                 
                 const scale = 0.8 + Math.sin(time + particleIndex * 0.1) * 0.2;
                 particle.scale.set(scale, scale, scale);
                 
                 // Calculate new position with pulse effect
                 const direction = new THREE.Vector3(x, y, z).normalize();
                 particle.position.copy(direction.multiplyScalar(sphereRadius + pulse));
                 
                 // Glow effect - change emissive intensity
                 if (particle.material) {
                     particle.material.emissiveIntensity = 0.5 + Math.sin(time * 2 + particleIndex * 0.05) * 0.5;
                 }
             }
         }
     });
     
     // Animar el núcleo durante la explosión
     if (isExploding) {
         const progress = explosionTime / explosionDuration;
         core.scale.set(
             1 - progress * 0.8,
             1 - progress * 0.8,
             1 - progress * 0.8
         );
         core.material.opacity = 0.2 * (1 - progress);
     } else {
         // Animate the core normally
         core.scale.set(
             1 + Math.sin(time) * 0.2,
             1 + Math.sin(time) * 0.2,
             1 + Math.sin(time) * 0.2
         );
         core.material.opacity = 0.2;
     }
     
     // Animate floating particles
     floatingParticlesGroup.children.forEach((particle) => {
         if (particle.userData) {
             const { originalPosition, speed, offset } = particle.userData;
             
             // Move particles in a gentle wave pattern
             particle.position.x = originalPosition.x + Math.sin(time * speed + offset) * 0.3;
             particle.position.y = originalPosition.y + Math.cos(time * speed + offset) * 0.3;
             particle.position.z = originalPosition.z + Math.sin(time * speed * 0.5 + offset) * 0.3;
             
             // Fade particles in and out
             particle.material.opacity = 0.3 + Math.sin(time + offset) * 0.2;
             
             // Scale particles
             const particleScale = 0.5 + Math.sin(time * 0.5 + offset) * 0.2;
             particle.scale.set(particleScale, particleScale, particleScale);
         }
     });
     
     // Rotate the entire sphere
     sphereGroup.rotation.y += 0.005;
     
     renderer.render(scene, camera);
 }

 // Handle window resize
 window.addEventListener('resize', () => {
     camera.aspect = window.innerWidth / window.innerHeight;
     camera.updateProjectionMatrix();
     renderer.setSize(window.innerWidth, window.innerHeight);
 });

 // Start animation
 animate();