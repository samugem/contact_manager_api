# Contact Manager API

A REST API is made with NodeJS, Express, MongoDB Atlas database.

API can store name, birthday, email, phone, address to the database.


## Table of Contents

- [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
- [Usage](#usage)
- [Endpoints](#endpoints)
- [Project Structure](#project-structure)


## Getting Started

### Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js v18**: This project requires Node.js version 18. If you don't have it installed, you can download and install it from the official [Node.js website](https://nodejs.org/).

- **MongoDB Atlas Database**: This project uses MongoDB Atlas Database. You can create it on the official [MongoDB website](https://www.mongodb.com/).

### Installation

1. Clone this repository:

   ```shell
   git clone https://github.com/samu20108/contact-manager-api
   
2. Install dependencies with npm:
   ```shell
   cd contact-manager-api
   npm install

3.  Copy or rename `example.env` to a new file named `.env`. Add your Atlas connection string and Database name to the file.

5. Run the application:
    ```shell
    npm run dev-start

## Usage

### Examples

Add a new contact:

`POST localhost:5050/contacts/add`
```shell
body:
    {
        "_id": "65453e71538ab1b158a33246",
        "first_name": "John",
        "last_name": "Doe",
        "birthday": {
            "year": 1990,
            "month": 6,
            "day": 15
        },
        "email": "johndoe@example.com",
        "phone": "+1 123-456-7890",
        "address": {
            "street_address": "123 Main Street",
            "city": "City",
            "country": "Country"
        },
    }
```

Fetch all contacts:

`GET localhost:5050/contacts`
```shell
[
    {
        "_id": "65453e71538ab1b158a33246",
        "first_name": "John",
        "last_name": "Doe",
        "birthday": {
            "year": 1990,
            "month": 6,
            "day": 15
        },
        "email": "johndoe@example.com",
        "phone": "+1 123-456-7890",
        "address": {
            "street_address": "123 Main Street",
            "city": "City",
            "country": "Country"
        },
        "age": 33
    },
]
```

## Endpoints

*`GET /contacts`: Retrieve all contacts.

*`GET /contacts/id/{id}`: Retrieve contact by id.

*`GET /contacts/birthdays-next-month`: Retrieve contacts whose birthday is next month

*`GET /contacts/next-birthday`: Retrieve contact whose birthday is coming next

*`GET /contacts/add-age-fields`: Calculate ages and add age fields if no exist

*`POST /contacts/add`: Create a new contact.

*`DELETE /contacts/{id}`: Delete a contact by ID.

*`PUT /contacts/edit`: Edit a contact by ID.


## Project Structure
```shell
src/
|-- db/
|   |-- conn.mjs
|-- routes/
|   |-- contacts.mjs
|-- sample-data
|   |-- sample-contacts-data.json
|-- example.env
|-- index.mjs
|-- loadEnv.mjs
|-- package-lock.json
|-- package.json
|-- README.md
```