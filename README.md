# Grand_Hotel_Web-App

## Overview
The Grand Hotel Management System is a Node.js-based application designed to facilitate the management and operation of a hotel. It includes features for user authentication, room and facility management, booking management, and financial transactions. The system utilizes MongoDB for database management and integrates with external services like Razorpay for payment processing.

## Key Features
### User Authentication
&nbsp;&nbsp;&nbsp;&nbsp;* Register and login functionality for both hotel administrators and customers.<br>
&nbsp;&nbsp;&nbsp;&nbsp;* Password hashing for secure storage.<br>
* **Hotel Management**<br>
&nbsp;&nbsp;&nbsp;&nbsp;* Hotel administrators can block/unblock users, manage hotel-specific data, and view analytics.<br>
* **Room Management**<br>
&nbsp;&nbsp;&nbsp;&nbsp;* CRUD operations for managing hotel rooms, including adding, editing, and deleting rooms.<br>
&nbsp;&nbsp;&nbsp;&nbsp;* Ability to view available rooms, detailed room information, and handle room bookings.<br>
**Facility Management**<br>
&nbsp;&nbsp;&nbsp;&nbsp;*Manage hotel facilities, including adding new facilities, editing existing ones, and marking facilities as unavailable.<br>
**Booking Management**<br>
&nbsp;&nbsp;&nbsp;&nbsp;* Handle user bookings, including checking room availability, processing bookings, and calculating booking prices based on room rates and duration.<br>
**Financial Transactions**<br>
&nbsp;&nbsp;&nbsp;&nbsp;* Integration with Razorpay for handling payments securely.<br>
&nbsp;&nbsp;&nbsp;&nbsp;* View transaction details and manage payment statuses.<br>
**Dashboard and Analytics**<br>
&nbsp;&nbsp;&nbsp;&nbsp;* Generate reports on hotel occupancy, booking trends, customer statistics, and financial metrics.<br>
&nbsp;&nbsp;&nbsp;&nbsp;* Real-time data updates on room availability and customer bookings.<br>
**Technologies Used**<br>
&nbsp;&nbsp;&nbsp;&nbsp;* Backend: Node.js, Express.js<br>
&nbsp;&nbsp;&nbsp;&nbsp;* Database: MongoDB<br>
&nbsp;&nbsp;&nbsp;&nbsp;* Authentication: JWT (JSON Web Tokens)<br>
&nbsp;&nbsp;&nbsp;&nbsp;* Payment Integration: Razorpay<br>
&nbsp;&nbsp;&nbsp;&nbsp;* External Libraries: bcrypt (for password hashing), nodemailer (for email communication)<br>
**Installation and Setup**<br>
1. Clone the repository from GitHub - EstroTech-Robotics.<br>
2. Install dependencies using npm: npm install<br>
3. Set up environment variables:<br>
&nbsp;&nbsp;&nbsp;&nbsp;* Create a .env file in the root directory.<br>
&nbsp;&nbsp;&nbsp;&nbsp;* Define the following variables in the .env file:<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;MONGODB_URI=your_mongodb_connection_string<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;EMAIL=your_admin_email<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;PASSWORD=your_admin_password<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Replace your_mongodb_connection_string, your_admin_email, and your_admin_password with appropriate values.<br>
4. Start the application: npm start
5.Access the application:<br>
Open your web browser and go to http://localhost:3000.<br>

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
