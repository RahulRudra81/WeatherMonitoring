const http=require("http")
const fs=require("fs")
const requests=require("requests")

const homeFile=fs.readFileSync("home.html","utf-8")

const replaceVal=(tempVal,orgVal)=>{
    let temperature=tempVal.replace("{%tempval%}",orgVal.main.temp)
    temperature=tempVal.replace("{%tempmin%}",orgVal.main.temp_min)
    temperature=tempVal.replace("{%tempmax%}",orgVal.main.temp_max)
    temperature=tempVal.replace("{%location%}",orgVal.name)
    temperature=tempVal.replace("{%country%}",orgVal.sys.country)
    return temperature;
};
const server=http.createServer((req,res)=>{
    if(req.url=="/"){
        requests(
           "https://api.openweathermap.org/data/2.5/weather?q=Bangalore&appid=e41a56c606f47d2415bb50a54190030c"
        )
        .on('data', (chunk)=>{
            const objdata=JSON.parse(chunk)
            const arrData=[objdata]
            const realTimeData=arrData.map((val)=> replaceVal(homeFile,val)).join("");
            // console.log(realTimeData)
            fs.writeFileSync("home.html", realTimeData);
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