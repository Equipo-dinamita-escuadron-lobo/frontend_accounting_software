export const environment = {
  production: true,
  API_URL: 'http://contables.unicauca.edu.co/api/',
  myStorageUrl: 'https://api.cloudinary.com/v1_1/dz5pw4p7y/image/upload',
  storageName: 'dz5pw4p7y',
  storageDirectory: 'cloudinary-enterprise',
  keycloak_url: 'http://contables.unicauca.edu.co/keycloak/token/',
  URL: 'http://contables.unicauca.edu.co/',

  //Cambiar la URL y el microservicio que se va a consumir en modo local
<<<<<<< HEAD
  API_ENTERPRISE_URL: 'http://contables.unicauca.edu.co/api/',
  API_PRODUCTS_URL: 'http://contables.unicauca.edu.co/api/',
  API_THIRS_URL: 'http://contables.unicauca.edu.co/api/',
=======
  API_ENTERPRISE_URL: 'http://localhost:8080/api/',
  API_PRODUCTS_URL: 'http://localhost:8081/api/',
  API_THIRS_URL: 'http://localhost:8082/api/',
  API_FEATURES_URL: 'http://localhost:8083/api/',
  API_ACCOUNT_CATALOGE_URL: 'http://localhost:8084/api/',
>>>>>>> products
  API_LOCAL_URL: 'http://localhost:8080/api/',
  microservice: '' // accountCatalogue, enterprise, factureManagment
  //cambiar para desarrollo local 'enterprise', para despliegue se deja vacio
};
