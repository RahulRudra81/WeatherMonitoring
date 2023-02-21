const http=require("http")
const fs=require("fs")
const requests=require("requests")

const homeFile=fs.readFileSync("home.html","utf-8")

const replaceVal=(tempVal,orgVal)=>{
    var temps=Math.ceil(orgVal.main.temp-273);
    var tempsmax=Math.ceil(orgVal.main.temp_max-273);
    var tempsmin=Math.ceil(orgVal.main.temp_min-273);
    var temperature=tempVal.replace("{%tempval%}",temps)
    .replace("{%tempmin%}",tempsmin)
    .replace("{%tempmax%}",tempsmax)
    .replace("{%location%}",orgVal.name)
    .replace("{%country%}",orgVal.sys.country)
    .replace("{%tempStatus%}",orgVal.weather[0].main)
    return temperature;
}; 
const server=http.createServer((req,res)=>{
    if(req.url=="/"){
        requests(
           "https://api.openweathermap.org/data/2.5/weather?q=Bangalore&appid=e41a56c606f47d2415bb50a54190030c"
        )
        .on("data", (chunk)=>{
            const objdata=JSON.parse(chunk)
            const arrData=[objdata];
            const realTimeData=arrData.map((val)=> replaceVal(homeFile,val)).join("");
            // console.log(objdata)
            res.write(realTimeData)
        })
         .on('end',(err) => {
          if (err) return console.log('connection closed due to errors', err);
          res.end();
          console.log('end');
        });
    }
    else{
        res.end("File not found");
    }
})

server.listen(8000,"127.0.0.1");
