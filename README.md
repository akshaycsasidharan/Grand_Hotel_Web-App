# Grand_Hotel_Web-App
Developement stage of grand hotel webapp 
## Table of contents
- [How to setup project](#swagger-API-definition)
  - [Setup](#setup)
  - 
- [Swagger API definition](#swagger-API-definition)

## How to setup project
### setup
## Swagger API definition 
```Copy
openapi: 3.0.3
info:
  title: Hotel App API Documentation
  license:
    name: Apache 2.0
    url: http://www.apache.org/licenses/LICENSE-2.0.html
  version: 1.0.11

tags:
  - name: Hotels
    description: Everything about Hotels
  - name: admin
    description: Everything about admin
  - name: user
    description: Everything about user

paths:

  /Hotels/metrics:
    get:
      tags:
        - Hotels
      responses:
        '200':
          description: successful operation
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/empty'
     
  /Hotels/room:

    get:
      tags:
        - Hotels
      responses:
        '200':
          description: Successful operation
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/empty'
     
  
    patch:
      tags:
        - Hotels
      requestBody:
        description: edit existing component status
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/empty'
        required: true
      responses:
        '200':
          description: Successful operation
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/empty'
      

  /Hotels/rooms:

    post:
      tags:
        - Hotels
      requestBody:
        description: Create new components
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/empty'
        required: true
      responses:
        '200':
          description: Successful operation
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/empty'
                
  
  /Hotels/roomsid:
    delete:
      tags:
        - Hotels
      responses:
        '200':
          description: Successful operation
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/empty'


  /Hotels/facilities:

    get:
      tags:
        - Hotels
      responses:
        '200':
          description: Successful operation
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/empty'
             
    patch:
      tags:
        - Hotels
      requestBody:
        description: edit existing component status
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/empty'
        required: true
      responses:
        '200':
          description: Successful operation
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/empty'            
  
  
  /Hotels/facilityyy:
    post:
      tags:
        - Hotels
      requestBody:
        description: Create new components
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/empty'
        required: true
      responses:
        '200':
          description: Successful operation
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/empty'
                
  
  /Hotels/facilitiesid:
    delete:
      tags:
        - Hotels
      responses:
        '200':
          description: Successful operation
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/empty'
                
                
  /Hotels/vaccantroom:
    get:
      tags:
        - Hotels
      responses:
        '200':
          description: Successful operation
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/empty'             
              
              
              
              
                
     
  /admin:

    get:
      tags:
        - admin
      responses:
        '200':
          description: successful operation
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/empty'
                
  /admin/login:
    post:
      tags:
        - admin
      responses:
        '200':
          description: successful operation
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/empty'              
                
  
  /admin/hotels:

    get:
      tags:
        - admin
      responses:
        '200':
          description: successful operation
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/empty'              
  
  /admin/customers:
    get:
      tags:
        - admin
      responses:
        '200':
          description: successful operation
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/empty'
                
  /admin/roomavailabilty:
    get:
      tags:
        - admin
      responses:
        '200':
          description: successful operation
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/empty'
                  
    


    
  
  /user:

    get:
      tags:
        - user
      parameters:
        - name: state
          in: query
          schema:
            type: string
        - name: deviceId
          in: query
          schema:
            type: string
      responses:
        '200':
          description: successful operation
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/empty'
     
    post:
      tags:
        - user
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/empty'
        required: true

      responses:
        default:
          description: successful operation
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/empty'
                
                
  /user/allhotels:

    get:
      tags:
        - user
      responses:
        '200':
          description: successful operation
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/empty'  
                  
                  
  /user/hotels:
    post:
      tags:
        - user
      responses:
        '200':
          description: successful operation
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/empty'                 
    
    
  /user/metrics:
    get:
      tags:
        - user
      responses:
        '200':
          description: successful operation
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/empty'


  /user/facilities/{userId}:
    get:
      tags:
        - user
      parameters:
        - name: userId
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: successful operation
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/empty'
                
                
  /user/rooms/{userId}:
    get:
      tags:
        - user
      parameters:
        - name: userId
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: successful operation
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/empty'              
                
                
  /user/payments/{userId}:
    get:
      tags:
        - user
      parameters:
        - name: userId
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: successful operation
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/empty' 
                
                
  /user/contactus/{userId}:
    get:
      tags:
        - user
      parameters:
        - name: userId
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: successful operation
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/empty' 

components:
  

  schemas:
    empty:
      type: object
      title: empty schema
    
  
```


#
