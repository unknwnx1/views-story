'use strict';
var _require = require("instagram-private-api");
var IgApiClient = _require.IgApiClient;
var fs = require("fs");
var child = require("child_process");
var moment = require("moment");
var chalk = require("chalk");
var delay = require("delay");
var delayRandom = require("delay-random");
require('dotenv').config();



async function updater() {
    const pullReq = child.spawnSync("git", ['pull'], {
        encoding: "utf-8"
    })
    console.log(pullReq.stdout);
}


(async function () {
    await updater()

    var username = process.env.USERNAME_IG
    var pwh = process.env.PASSWORD_IG
    var first = parseInt(process.env.BEFORE_DELAY)
    var second = parseInt(process.env.AFTER_DELAY)
    const random = await delayRandom(first, second)
    if (!fs.existsSync("./datas/" + username + ".json")) {
        try {
            var tokobj = new IgApiClient;
            tokobj.state.generateDevice(username);
            tokobj.simulate.preLoginFlow();
            var $scope = await tokobj.account.login(username, pwh);
            if ($scope.username == username) {
                console.log(chalk.yellowBright("[ " + moment().format("HH:mm:ss") + " ] login success " + $scope.full_name + " "));
                var savedScripts = await tokobj.state.serialize();
                delete savedScripts.constants;
                var envContent = JSON.stringify(savedScripts);
                fs.writeFileSync("./datas/" + username + ".json", envContent);
                console.log(chalk.yellowBright("[ " + moment().format("HH:mm:ss") + " ] " + $scope.full_name + " Success saving state"));
            } else {
                console.log(chalk.red("[ " + moment().format("HH:mm:ss") + " ] login failed! "));
                process.exit();
            }
        } catch (a) {
            console.log(a.message);
        }
    }
    while (true) {

        //}
        try {
            var keystoreStr = fs.readFileSync("./datas/" + username + ".json", "utf-8");
            var $scope = new IgApiClient;
            $scope.state.generateDevice(username);
            // $scope.simulate.preLoginFlow();
            await $scope.state.deserialize(keystoreStr);
            for (;;) {
                var _b3 = 1;
                console.log(chalk.blue("[ " + moment().format("HH:mm:ss") + " ] Memulai MassLooking to timeline"));
                var linkLevelDetails = await $scope.feed.reelsTray();
                var crossfilterable_layers = await linkLevelDetails.items();
                if (0 == crossfilterable_layers.length) {
                    console.log("Story not found");
                    continue;
                }
                var layer_i = 0;
                for (; layer_i < crossfilterable_layers.length; layer_i++) {
                    var layer = crossfilterable_layers[layer_i];
                    var linkLevelDetails = await $scope.feed.reelsMedia({
                        userIds: [layer.id]
                    });
                    var visible_indexes = await linkLevelDetails.items();
                    var i = 0;
                    for (; i < visible_indexes.length; i++) {
                        var beforeTab = visible_indexes[i];
                        var data = await $scope.story.seen([beforeTab]);
                        if ("ok" == data.status) {
                            console.log(chalk.green("[ " + moment().format("HH:mm:ss") + " ] " + username + " Success views story target " + layer.user.username));
                            await delay(random);
                        } else {
                            console.log(chalk.red("[ " + moment().format("HH:mm:ss") + " ] " + username + " Failed views story"));
                        }
                        console.log(chalk.white("[ " + moment().format("HH:mm:ss") + " ] total seen story : " + _b3++));
                    }
                }
                console.log(chalk.whiteBright("[ " + moment().format("HH:mm:ss") + " ] Looping : " + _b3++));
            }
        } catch (a) {
            console.log(a.message);
            console.log(a);
            continue;
        }
    }
})();