const cheerio = require("cheerio")
const request = require("request-promise")


var serviceAccount = require('./firebase/server-r-firebase-adminsdk-d7x0j-fd0b0062a8.json');
var admin = require("firebase-admin");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://server-r.firebaseio.com",
    storageBucket: "gs://server-r.appspot.com"
});
var crustDB = admin.database();

module.exports = function mantalRevolve() {
    // instagram("https://www.instagram.com/p/B2WmfNfo-Y9/")
    //     .then(data => {
    //         console.log(data)
    //         process.exit()
    //     })
    //     .catch(e => {
    //         // Error will trigger if the account link provided is false.
    //         console.error(e)
    //         process.exit()
    //     })
   warlock()
    //getUserData("https://www.instagram.com/p/B2WmfNfo-Y9")
    // crustDB.ref('/mantel-temp/336930604').remove(function(){
    //     console.log("Deleted")
    // })
}

var stack
var index = 0
var length
async function warlock() {
    console.log("Warloak")
    crustDB.ref('/crust/').orderByKey().limitToLast(1)
        .once('value', function (snapshot) {
            stack =  snapshot.val()
            console.log(stack)
            completeCycle()
        })
}



function completeCycle(status){
    console.log("Status line48",status)
    index = index + 1
    let key = Object.keys(stack)[0]
    console.log("Cycle Details -> ",key,index)
    if(index === 0){
        getUserData(stack[key][0])    
    }
    if(index >= stack[key].length){
        console.log("&&&&&&&&&&&&&&&&&  E N D - P O I N T   &&&&&&&&&&&&&&&&&&&&&&")
        crustDB.ref('/crust/'+key).remove(function(){
            console.log("Deleted -> ",key)
            index = 0
            warlock()
            return 
        })
    }
    getUserData(stack[key][index])
}

function getUserData(url) {
    return new Promise(function(resolve,reject){
        if (url.charAt(26) !== "p") {
            console.error("Not usable  line 70", url)
            console.log("::::::::::::::::::::::::::LINE 71 -false")
            completeCycle(false)
            return
        }
        console.log("Url ", url)
        getUserrname(url).then(username => {
            scrapeUserData("https://www.instagram.com/" + username)
                .then(data => {
                    console.log("Line 77")
                    upload(data)
                    //console.log(data.id)
                    //console.log("- - - - - - - - - - - - - - - - -")
                   // process.exit()
                })
                .catch(e => {
                    // Error will trigger if the account link provided is false.
                    console.error("URL wrong ", e)
                    console.log("line 87")
                    console.log("::::::::::::::::::::::::::LINE 89 -false")
                    completeCycle(false)
                   // process.exit()
                })
        })
    })
}
var counter  = 0

function upload(data) {
    console.log("Uploading . . .")
    var crust = crustDB.ref("mantel/" + data.id);
    crust.set(data, function (err) {
        if (err) {
            db.get('stack')
                .push(Array.from({[data.id]:data}))
                .write()
                
            console.log("Cycle  -- lowDb ", new Date())
            completeCycle(true)
        } else {
            counter = counter + 1
            console.log("Data saved on Mantel ",counter)
            console.log("- - - - - - - - - - - - - - - - - - - - - - -")
            completeCycle(true)
        }
    })
}



// ****************************************************************************************************
var shortcode_media

function getUserrname(url) {
    return new Promise((resolve, reject) => {
        request(url).then(body => {
            var $ = cheerio.load(body)
            var scripts = $("script[type='text/javascript']")
            var sharedData = JSON.parse(
                scripts[3].children[0].data
                    .replace("window._sharedData = ", "")
                    .replace("};", "}")
            )
            shortcode_media = sharedData.entry_data.PostPage[0].graphql.shortcode_media
            var username = sharedData.entry_data.PostPage[0].graphql.shortcode_media.owner.username
            console.log("Username ",username)
            resolve(username)
        })
        .catch(e => {
            if (e.StatusCodeError === 404) {
                console.log("Url Does not exit anymore")
            } else {
                console.log("Unhandle Error -URL ")
            }
            console.log("::::::::::::::::::::::::::LINE 144 -false")
            completeCycle(false)
        })
    })
}

function scrapeUserData(url) {
    console.log(" Scrapping data from username line 148")
    return new Promise((resolve, reject) => {
        request(url).then(body => {
            var $ = cheerio.load(body)
            var scripts = $("script[type='text/javascript']")
            var sharedData = JSON.parse(
                scripts[3].children[0].data
                    .replace("window._sharedData = ", "")
                    .replace("};", "}")
            )
            console.log("got data line 161")
            console.log( "Data of graphQL ",sharedData.entry_data.LoginAndSignupPage)
            console.log( Object.keys(sharedData).length,)
            console.log( Object.keys(sharedData.entry_data).length,)
            console.log( Object.keys(sharedData.entry_data.ProfilePage[0]).length,)
            console.log( Object.keys(sharedData.entry_data.ProfilePage[0].graphql).length,)
            console.log( Object.keys(sharedData.entry_data.ProfilePage[0].graphql.user).length
            )
            var graphql = sharedData.entry_data.ProfilePage[0].graphql.user || "888"
            console.log("got data line 159")
            resolve(formatData(graphql))
        }).catch(e => {
            console.log("::::::::::::::::::::::::::LINE 162 -false")
            completeCycle(false)
        })
    })
}

function formatData(graphql) {
    console.log("Format data",formatData)
    return {
        "profileLink": "https://www.instagram.com/".concat(graphql.username),
        "subscriberCount": graphql.edge_followed_by.count,
        "subscribtions": graphql.edge_follow.count,
        "postCount": graphql.edge_owner_to_timeline_media.count,
        "username": graphql.username,
        "isPrivate": graphql.is_private,
        "isVerified": graphql.is_verified,
        "fullName": graphql.full_name,
        "bio": graphql.biography,
        "id": graphql.id,
        "postCount": graphql.edge_owner_to_timeline_media.count,
        "avatar": graphql.profile_pic_url,
        "avatarHD": graphql.profile_pic_url_hd,
        "posts": graphql.edge_owner_to_timeline_media.edges.map(edge => {
            return {
                "id": edge.node.id,
                "captionText": edge.node.edge_media_to_caption.edges.length === 0 ? null : edge.node.edge_media_to_caption.edges[0].node.text,
                "shortcode": edge.node.shortcode,
                "link": `https://www.instagram.com/p/${edge.node.shortcode}`,
                "commentsCount": edge.node.edge_media_to_comment.count,
                "timestamp": edge.node.taken_at_timestamp,
                "likes": edge.node.edge_liked_by.count,
                "location": edge.node.location || null,
                "picture": {
                    "url": edge.node.thumbnail_src,
                    "thumbnail_150": edge.node.thumbnail_resources[0].src,
                    "thumbnail_240": edge.node.thumbnail_resources[1].src,
                    "thumbnail_320": edge.node.thumbnail_resources[2].src,
                    "thumbnail_480": edge.node.thumbnail_resources[3].src,
                    "thumbnail_640": edge.node.thumbnail_resources[4].src
                },
                "isVideo": edge.node.is_video
            }
        }),
        "shortcode_media": shortcode_media
    }
}



    //global.dispatchEvent(new CustomEvent("done", {detail: status}))