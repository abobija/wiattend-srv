# wiattend-srv
[NodeJS](https://nodejs.org) server for RFID attendance system [wiattend](https://github.com/abobija/wiattend).

Server uses [MySQL](https://www.mysql.com) database management system.

## Usage

Run next commands for install dependencies and start the server

```
npm install
npm start
```

## Abstraction

![](doc/img/idea.png)

## HTTP Routes

All routes returns response in `JSON` format.

- `GET /logs`

  **Returns** 
  
  Last 20 logs from database.

- `GET /tags`

  **Returns**
  
  All tags from database.
 
- `POST /log`

  **Accept**
  
  This route requires next HTTP headers:
  
  | Header name | Header value |
  | --- | --- |
  | `sguid` | **2ce81521-c42f-4556-8c28-c69d7e3a3a47** |
  | `rfid-tag` | _Serial number of tag_ |
  
  **Returns**
  
  Logged tag.
