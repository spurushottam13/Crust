console.log("sp13 || Level: Crust ");

//+++++======{ MODULE IMPORTS  }============================================================||

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const puppeteer = require('puppeteer');
var admin = require("firebase-admin");
var serviceAccount = require('./firebase/server-r-firebase-adminsdk-d7x0j-fd0b0062a8.json');
//const batteryLevel = require('battery-level');


//+++++======{ MODULE INIT  }================================================================||

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://server-r.firebaseio.com",
    storageBucket: "gs://server-r.appspot.com"
});
var crustDB = admin.database();
var bucket = admin.storage().bucket();

const adapter = new FileSync('db.json')
const db = low(adapter)
db.defaults({ stack: [] })
    .write()
var dataToPush

//+++++======{ CRUST REVOLVE  }=============================================================||
var crustRevolve = function(){ puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    env: {
      TZ: 'Asia/Kolkata',
      ...process.env
    }
  }).then(async browser => {
    const page = await browser.newPage();
    page.setViewport({
        width: 635,
        height: 635
    })
    console.log("Crust Revolving")
    await page.goto("https://instagram.com/zero.shutter");
    // page.content().then( e => {
    //     console.log(typeof(e))
    //     var timeStamp = new Date().getTime()
    //     var crust = crustDB.ref("crust10/" + timeStamp)
    //     crust.set(e,function(e){
    //         console.log(e)
    //     })

    // })
    await page.waitFor(4000)
    page.screenshot({path: 'iop.png'}).then(()  => {
        // var ref = storage.ref();
        // ref.put("load.png").then(() => {
        //     console.log("Doone")
        // })
        bucket.upload("iop.png").then(() => console.log("Done"))
    })
    await page.waitFor(".Igw0E.IwRSH.eGOV_._4EzTm.bkEs3.CovQj.jKUp7.DhRcB")
    page.screenshot({path: 'iop.png'}).then(()  => {
        // var ref = storage.ref();
        // ref.put("load.png").then(() => {
        //     console.log("Doone")
        // })
        bucket.upload("iop.png").then(() => console.log("Done"))
    })
    await page.type("input[type='text']", "zero.shutter")
    await page.type("input[type='password']", "zeroshutter")
    await page.waitFor(4000)
    await page.click("._0mzm-.sqdOP.L3NKy")
    await page.waitFor('.glyphsSpriteCompass__outline__24__grey_9.u-__7')

    const warlock  = async function() {
        console.log("Warlock called")
        await page.goto("https://www.instagram.com/explore/")
        await page.waitFor(".eLAPa")
        const list = await page.evaluate(async() => {
            var temp = []
            var stack = new Set()
            var counter = 0
            return await new Promise(function(resolve, reject) {
                Array.from(document.getElementsByTagName('a')).map(a => stack.add(a.href));
                setInterval(function() {
                    counter = counter + 1 
                    window.scrollTo(0, document.body.scrollHeight)
                    Array.from(document.getElementsByTagName('a')).map(a => stack.add(a.href));
                    console.log("|| ", stack.size)
                    if (counter > 10) {  // Time = counter x 4 sec
                        console.log("Stack size: ", stack.size, temp)
                        temp = Array.from(stack)
                        resolve(temp)
                    }
                }, 4000)
            })
        });
        console.log("Scrapped ", await list.length)
        var timeStamp = new Date().getTime()
        dataToPush = list
        var crust = crustDB.ref("crust/" + timeStamp);
        crust.set(dataToPush, function(err) {
            if (err) {
                db.get('stack')
                    .push(Array.from(dataToPush))
                    .write()
                return console.log("Cycle  -- lowDb ", new Date())
            } else {
                console.log("Data saved on Crust")
                return console.log("Cycle  -- Crust ", new Date())
            }
        })

        // You only requrie when it's month-end or you dating a Gold digger!!
        // batteryLevel().then(level => { 
        //     var BLevel = level * 100;
        //     crustDB.ref("/batt/").set(BLevel,function(err){
        //         if(err){
        //             console.log("Battery level not stored")
        //         }else{
        //             console.log("not",BLevel)
        //         }
        //     })
        // });

        
    }

    while (true) {
       await warlock()
    }

    await browser.close()


})
}


module.exports = crustRevolve