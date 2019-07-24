console.log("sp13 || Level: Crust ");

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const puppeteer = require('puppeteer');
var admin = require("firebase-admin");
var serviceAccount = require('./firebase/server-r-firebase-adminsdk-d7x0j-fd0b0062a8.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://server-r.firebaseio.com"
});

const adapter = new FileSync('db.json')
const db = low(adapter)
db.defaults({ stack: [] })
    .write()

var serverRdb = admin.database();
var crust = serverRdb.ref("crust/");

var dataToPush

puppeteer.launch({ 
    headless: false,
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
    await page.goto("https://instagram.com/zero.shutter");
    await page.waitFor("._0mzm-.sqdOP.L3NKy.ZIAjV")
    await page.click("._0mzm-.sqdOP.L3NKy.ZIAjV")
    await page.waitFor(".Igw0E.IwRSH.eGOV_._4EzTm.bkEs3.CovQj.jKUp7.DhRcB")
    await page.type("input[type='text']", "zero.shutter")
    await page.type("input[type='password']", "zeroshutter")
    await page.waitFor(4000)
    await page.click("._0mzm-.sqdOP.L3NKy")
    await page.waitFor('.glyphsSpriteCompass__outline__24__grey_9.u-__7')

    const warlock  = async function() {
        await page.goto("https://www.instagram.com/explore/")
        await page.waitFor(".eLAPa")
        const list = await page.evaluate(async() => {
            var temp = []
            var stack = new Set()
            return await new Promise(function(resolve, reject) {
                Array.from(document.getElementsByTagName('a')).map(a => stack.add(a.href));
                setInterval(function() {
                    window.scrollTo(0, document.body.scrollHeight)
                    Array.from(document.getElementsByTagName('a')).map(a => stack.add(a.href));
                    console.log("|| ", stack.size)
                    if (stack.size > 450) { //500 limit
                        console.log("Stack size: ", stack.size, temp)
                        temp = Array.from(stack)
                        resolve(temp)
                    }
                }, 4000)
            })
        });
        console.log("This is", await list.length)
        dataToPush = list
        crust.push(dataToPush, function(err) {
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

    }

    while (true) {
       await warlock()
    }

    await browser.close()


})