/// <reference types="../CTAutocomplete" />
/// <reference lib="es2015" />
module.exports = {};
import request from '../requestV2';

// good luck using this lmao
// open the calendar, press h, go to next page and repeat until you get to the last page
// then /uploadjacobdata or whatever you want to do with the data

const itemsEnum = {
    'Cactus': 0,
    'Carrot': 1,
    'Cocoa Beans': 2,
    'Melon': 3,
    'Mushroom': 4,
    'Nether Wart': 5,
    'Potato': 6,
    'Pumpkin': 7,
    'Sugar Cane': 8,
    'Wheat': 9,
}

function unformat(name) {
    return name.replace(/[§&]./gi, '').trim();
}

function parseTime(timeStr) {
    return timeStr.split(' ').reduce((prev, cur) => {
        let t = cur.charAt(cur.length - 1);
        let s = parseInt(cur.slice(0, -1), 10);
        switch (t) {
            case 'h':
                s *= 60;
            case 'm':
                s *= 60;
        }
        return prev + s;
    }, 0);
}

let jacobs = [];
let foundToday = false;

function scanCalendar(inventory) {
    for (let item of inventory.getItems()) {
        if (foundToday) {
            let lore;
            try {
                lore = item.getLore();
            } catch (error) {
                continue;
            }
            for (let i = 0; i < lore.length; ++i) {
                let match = unformat(lore[i]).match(/Jacob's Farming Contest \((.+)\)/);
                if (match) {
                    let time;
					console.log(jacobs);
					console.log(jacobs.length);
					console.log(jacobs[0]);
                    if (jacobs.length && jacobs[jacobs.length - 1] && jacobs[jacobs.length - 1].time) {
                        time = jacobs[jacobs.length - 1].time + 60 * 60 * 1000;
                    } else {
                        time = parseTime(match[1]) * 1000 + Date.now();
						console.log(time);
                        if (jacobs[0] && jacobs[0].time === null) {
                            jacobs[0].time = time - 60 * 60 * 1000;
                        }
                    }
                    jacobs.push({
                        time,
                        crops: lore.slice(i + 1, i + 4).map(i => unformat(i).slice(2))
                    });
                    break;
                }
            }
        } else if (item.getID() === 351 && item.getMetadata() === 10) {
            foundToday = true;
            let lore = item.getLore();
            if (lore.length > 1) {
                if (unformat(lore[1]).includes('Jacob\'s Farming Contest')) {
                    jacobs.push({
                        time: null,
                        active: true,
                        crops: lore.slice(2, 5).map(i => unformat(i).slice(2))
                    });
                }
            }
        }
    }
}

register('guiKey', (char, keyCode, gui, event) => {
    // h
    if (keyCode === 35) {
        let inv = Player.getOpenedInventory();
        if (inv.getName().match(/(?:Early )?(?:Summer|Winter|Spring|Autumn), Year \d+/)) {
            ChatLib.chat('scanning...');
            scanCalendar(inv);
            ChatLib.chat('done');
        }
    }
});

register("command", () => {
    request({
        url: 'http://localhost:5000/api/events', // change this too
        method: 'POST',
        body: {
            secret: 'the secret on the server .env file',
            events: jacobs.map(i => {
                return {
                    timestamp: Math.floor(i.time),
                    crops: i.crops.map(c => itemsEnum[c])
                };
            })
        }
    }).then(response => {
        console.log(response);
        ChatLib.chat(JSON.stringify(response));
    });
}).setName("uploadjacobdata");
