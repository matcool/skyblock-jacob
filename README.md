a tracker for hypixel skyblock jacob contests

## Usage
First build the client
```bash
# on the client/ folder
npm i
npm run build
```
Then make a `.env` file on the `server` folder
```
PORT=5000
SECRET=some random string of characters
```
Then run the server
```bash
# on the server/ folder
npm i
npm run start
```

## Collecting the data
*very messy and was never meant to be used by someone else*

copy the `ct-module` folder (rename it if you want to) to your chattriggers modules folder `.minecraft/config/ChatTriggers/modules/`

after doing so and having it loaded in, to scan contest data open the detailed calendar (by clicking on the clock), press h, go to next page and repeat until you're on the last page

after that the data is now collected and to upload it to the api run `/uploadjacobdata` (make sure to edit lines 106 and 109 on `main.js`)