const{IgApiClient}=require("instagram-private-api"),fs=require("fs"),moment=require("moment"),chalk=require("chalk"),read=require("readline-sync"),waktu=read.question(chalk.blueBright(`[ ${moment().format("HH:mm:ss")} ] delay per views (second) : `));async function sleep(){return new Promise(a=>{setTimeout(a,1e3*waktu)})}(async()=>{let a=read.question(chalk.blueBright(`[ ${moment().format("HH:mm:ss")} ] username (ex:ryn.andri) : `));if(!fs.existsSync(`./datas/${a}.json`)){const b=read.question(chalk.green(`[ ${moment().format("HH:mm:ss")} ] password : `));try{const c=new IgApiClient;c.state.generateDevice(a),c.simulate.preLoginFlow();const d=await c.account.login(a,b);if(d.username==a){console.log(chalk.yellowBright(`[ ${moment().format("HH:mm:ss")} ] login success ${d.full_name} `));const b=await c.state.serialize();delete b.constants;const e=JSON.stringify(b);fs.writeFileSync(`./datas/${a}.json`,e),console.log(chalk.yellowBright(`[ ${moment().format("HH:mm:ss")} ] ${d.full_name} Success saving state`))}else console.log(chalk.red(`[ ${moment().format("HH:mm:ss")} ] login failed! `)),process.exit()}catch(a){console.log(a.message)}}try{const b=fs.readFileSync(`./datas/${a}.json`,"utf-8"),c=new IgApiClient;c.state.generateDevice(a),c.simulate.preLoginFlow();for(await c.state.deserialize(b);;){let b=1;console.log(chalk.blue(`[ ${moment().format("HH:mm:ss")} ] Memulai MassLooking to timeline`));const d=await c.feed.reelsTray(),e=await d.items();if(0==e.length){console.log(`Story not found`);continue}for(let d=0;d<e.length;d++){const f=e[d],g=await c.feed.reelsMedia({userIds:[f.id]}),h=await g.items();for(let d=0;d<h.length;d++){const e=h[d],g=await c.story.seen([e]);"ok"==g.status?(console.log(chalk.green(`[ ${moment().format("HH:mm:ss")} ] ${a} Success views story target ${f.user.username}`)),await sleep()):console.log(chalk.red(`[ ${moment().format("HH:mm:ss")} ] ${a} Failed views story`)),console.log(chalk.white(`[ ${moment().format("HH:mm:ss")} ] total seen story : ${b++}`))}}console.log(chalk.whiteBright(`[ ${moment().format("HH:mm:ss")} ] Looping : ${b++}`))}}catch(a){console.log(a.message)}})();