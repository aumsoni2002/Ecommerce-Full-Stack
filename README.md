# E-Commerce Full Stack Application

This full-stack e-commerce platform is built using Angular, Spring Boot, MySQL, Okta, and Stripe, offering a comprehensive suite of features for seamless online shopping experiences.

## Features

- **CRUD Operations:** Perform Create, Read, Update, and Delete operations for products and orders.
- **Authentication:** Secure user login/logout functionality using Okta authentication services.
- **Payment Processing:** Integration with Stripe payment gateway for secure and reliable transaction processing.
- **Dynamic Search:** Filter products by category and keyword for enhanced product discovery.
- **Pagination:** Efficiently manage large datasets with pagination for smoother navigation.
- **Shopping Cart:** Add, remove, and update item quantities in the shopping cart for a seamless shopping experience.
- **Secure Checkout:** Secure and validated checkout form for accurate and secure order submissions.
- **HTTPS Communication:** Encryption of data transmission between frontend and backend for enhanced security.
- **Email Receipts:** Integration with Stripe for email receipts to provide customers with confirmation of their purchases.

---

## Video Demonstration
https://github.com/aumsoni2002/Ecommerce-Full-Stack/assets/96745193/1dbd81f9-263f-46d9-bc9e-320f8418b295

---

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js and npm installed**
    - [Download and install Node.js and npm](https://nodejs.org/)

- **Java JDK 8 or higher installed**
    - [Download and install Java JDK](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html)

- **MySQL Server and MySQL Workbench installed**
    - [Download and install MySQL Server and MySQL Workbench](https://dev.mysql.com/downloads/)

- **Okta Developer Account**
    - Sign up for a free [Okta Developer Account](https://developer.okta.com/signup/)
    - Create a new application in Okta and note down the `Client ID`, `Client Secret`, and `Issuer` URL

- **Stripe Account**
    - Sign up for a free [Stripe Account](https://stripe.com/)
    - Retrieve the `Publishable Key` and `Secret Key` from the Stripe Dashboard

---

## Setting Up the Development Environment

### Frontend (Angular)

1. **Clone the Repository**
    ```bash
    git clone https://github.com/aumsoni2002/PRJ666ProjectGrp6.git
    cd PRJ666ProjectGrp6/ecommerceFE
    ```

2. **Install Dependencies**
    ```bash
    npm install
    ```

3. **Environment Configuration**
    - Create a `src/enviornments/enviornment.ts` file in the `frontend` directory.
    - Add the following configuration:
    ```env
    eCommerceApiUrl=https://localhost:8443/api
    stripePublishableKey=YOUR_STRIPE_PUBLISHABLE_KEY
    production=false
    ```

4. **Run the Application**
    ```bash
    npm start
    ```

---

### Backend (Spring Boot)

1. **Import the Project**
    - Open Spring Tool Suite or your preferred IDE.
    - Import the `backend` directory as an existing Maven project.

2. **Database Configuration**
    - Open `src/main/resources/application.properties`.
    - Configure the MySQL database connection:
    ```properties
    spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
    spring.datasource.url=jdbc:mysql://localhost:3306/YOUR_DATABASE_NAME?useSSL=false&useUnicode=yes&characterEncoding=UTF-8&allowPublicKeyRetrieval=true&serverTimezone=UTC
    spring.datasource.username=root
    spring.datasource.password=root_password
    spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
    spring.data.rest.base-path=/api
    allowed.origins=https://localhost:4200
    spring.data.rest.detection-strategy=ANNOTATED
    okta.oauth2.client-id=YOUR_OKTA_CLIENT_ID
    okta.oauth2.issuer=YOUR_OKTA_ISSUER_URL
    #####
    # HTTPS configuration
    #####

    # Server web port
    server.port=8443

    # Enable HTTPS support (only accept HTTPS requests)
    server.ssl.enabled=true

    # Alias that identifies the key in the key store
    server.ssl.key-alias=ecommerce

    # Keystore location
    server.ssl.key-store=classpath:ecommerce-keystore.p12

    # Keystore password
    server.ssl.key-store-password=secret

    # Keystore format
    server.ssl.key-store-type=PKCS12

    #####
    # Payment Processing with Stripe
    #####

    stripe.key.secret=YOUR_STRIPE_SECRET_KEY
    ```

3. **Run the Application**
    - Run the `EcommerceApplication.java` to start the Spring Boot application.

---

### Database (MySQL)

1. **Create Database**
    ```sql
    CREATE DATABASE ecommerce_db;
    ```

2. **Import Database Schema**
    - Navigate to `PRJ666ProjectGrp6/MySQL Database/db-scripts` and run the MySQL scripts one by one in the following order:
        1. `01-create-user.sql`
        2. `03-refresh-database-with-100-products.sql`
        3. `04-countries-and-states.sql`
        4. `05-create-order-tables.sql`
        5. `06-refactor-database-to-add-unique-email.sql`
    - You can execute the scripts using MySQL Workbench or any MySQL command-line tool.

---

## Generating Key and Self-Signed Certificate with OpenSSL: Frontend (Angular)

### MS Windows

#### Install OpenSSL

1. Download and install [Win64 OpenSSL v1.1.x Light](https://slproweb.com/products/Win32OpenSSL.html).

2. During installation, choose the default settings.

3. Add OpenSSL to your system path:
    - Open MS Windows Control Panel > System > Advanced System Settings > Environment Variables.
    - Add `c:\Program Files\OpenSSL-Win64\bin;` to the beginning of the `Path` variable.

#### Verify Installation

1. Open a new command prompt.

2. Run:
    ```bash
    openssl help
    ```

#### Generate Key and Certificate

1. Navigate to your Angular ecommerce project directory:
    ```bash
    cd ecommerceFE
    ```

2. Create a directory for output files:
    ```bash
    mkdir ssl-localhost
    ```

3. Create `localhost.conf` in `angular-ecommerce` with:
    ```conf
    [req]
    prompt = no
    distinguished_name = dn
    [dn]
    C = US
    ST = Pennsylvania
    L = Philadelphia
    O = ecommerce
    OU = Training
    CN = localhost
    ```

4. Generate key and certificate:
    ```bash
    openssl req -x509 -out ssl-localhost\localhost.crt -keyout ssl-localhost\localhost.key -newkey rsa:2048 -nodes -sha256 -days 365 -config localhost.conf
    ```

5. Verify the generated files:
    ```bash
    dir ssl-localhost
    ```

    You should see `localhost.crt` and `localhost.key`.

6. View the certificate details:
    ```bash
    openssl x509 -noout -text -in ssl-localhost/localhost.crt
    ```

---

## Keytool - Generate Key and Self-Signed Certificate: Backend (Springboot)

### Generate Key and Self-Signed Certificate

1. Navigate to your Spring Boot ecommerce project directory:
    ```bash
    cd ecommerceBE
    ```

2. Run the following command to generate the key and certificate:
    ```bash
    keytool -genkeypair -alias ecommerce -keystore src/main/resources/ecommerce-keystore.p12 -keypass secret -storeType PKCS12 -storepass secret -keyalg RSA -keysize 2048 -validity 365 -dname "C=US, ST=Pennsylvania, L=Philadelphia, O=ecommerce, OU=Training Backend, CN=localhost" -ext "SAN=dns:localhost"
    ```

    | Argument | Description |
    | --- | --- |
    | -genkeypair | Generates a key pair |
    | -alias | Alias name of the entry |
    | -keystore | Output keystore file |
    | -keypass | Key password |
    | -storeType | Keystore type |
    | -storepass | Keystore password |
    | -keyalg | Key algorithm |
    | -keysize | Key bit size |
    | -validity | Validity in days |
    | -dname | Distinguished name |
    | -ext | X.509 extension |

3. Verify the generated files:
    ```bash
    keytool -list -v -alias ecommerce -keystore src/main/resources/ecommerce-keystore.p12 -storepass secret
    ```

---

### Spring Boot HTTPS Configuration

1. Edit `application.properties` and add:
    ```properties
    #####
    # HTTPS configuration
    #####
    
    # Server web port
    server.port=8443
    
    # Enable HTTPS
    server.ssl.enabled=true
    
    # Key alias
    server.ssl.key-alias=ecommerce
    
    # Keystore location
    server.ssl.key-store=classpath:ecommerce-keystore.p12
    
    # Keystore password
    server.ssl.key-store-password=secret
    
    # Keystore format
    server.ssl.key-store-type=PKCS12
    ```

---

## Running the Application

1. **Start the Backend Server**
    - Navigate to the `backend` directory and run the Spring Boot application.

2. **Start the Frontend Server**
    - Navigate to the `frontend` directory and run the Angular application.

3. **Access the Application**
    - Open a web browser and go to `https://localhost:4200` to access the ECommerce application.

---

Congratulations! You've configured our E-Commerce Full Stack Application!!
