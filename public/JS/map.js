      // Coordenadas del lugar deseado   19.326718292664353, -103.692619608782
      var latitud = 19.326718292664353; // Reemplaza con la latitud de tu ubicación
      var longitud = -103.692619608782; // Reemplaza con la longitud de tu ubicación

      function initMap() {
          // Crear un nuevo mapa
          var map = new google.maps.Map(document.getElementById('map'), {
              center: {lat: latitud, lng: longitud},
              zoom: 50, // Puedes ajustar el nivel de zoom según tus necesidades
              mapTypeId: google.maps.MapTypeId.SATELLITE // Configurar el mapa en modo satélite
          });

          // Crear un marcador en la ubicación especificada
          var marker = new google.maps.Marker({
              position: {lat: latitud, lng: longitud},
              map: map,
              title: 'Sistema de monitoreo ambiental'
          });

           // Crear un InfoWindow con el título
           var infoWindow = new google.maps.InfoWindow({
              content: `<a href="/allDoc"><label>Sistema de monitoreo</label></a>`,
              pixelOffset: new google.maps.Size(0, -30) // Ajusta la posición vertical del InfoWindow
          });
           // Agregar un evento de clic al marcador
           marker.addListener('click', function() {
            // Redirigir a la URL deseada al hacer clic en el marcador
            window.location.href = '/allDoc';
        });

          // Mostrar el InfoWindow cuando se carga el mapa
          infoWindow.open(map, marker);
      }