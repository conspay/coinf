import axios from 'axios'
import i18n from './common/i18n'
import Config from "./contract/config";

const seropp= require("sero-pp")


class Service {

    id:number

    constructor(){
        this.id = 0;
    }

    async rpc(method:string, args:any){
        let host:any = localStorage.getItem("host");
        if(!host){
            host = await this.initDApp();
        }
        const data: any = {
            id: this.id++,
            method: method,
            params: args
        }
        return new Promise((resolve, reject) => {
            if(host){
                axios.post(host, data).then((resp: any) => {
                    if(resp.data && resp.data.error){
                        reject(resp.data.error.message)
                    }else if(resp.data && resp.data.result){
                        resolve(resp.data.result)
                    }
                }).catch(e => {
                    reject(e)
                })
            }else{
                reject()
            }
        })
    }

    async initDApp(){
        const dapp = {
            name: i18n.t("title"),
            contractAddress: new Config().address,
            github: "https://github.com/conspay/coinf",
            author: "conspay",
            url: window.location.origin+window.location.pathname,
            logo: window.location.origin+window.location.pathname +"assets/icon/icon.png",

            barColor:"#5260ff",
            navColor:"#5260ff",
            barMode:"dark",
            navMode:"light"
        }

        seropp.init(dapp,function (rest:any,err:any) {

            return new Promise((resolve,reject)=>{
                if(err){
                    reject(err)
                }else{
                    seropp.getInfo(function (data:any) {
                        if(data){
                            localStorage.setItem("language",data.language);
                            localStorage.setItem("host",data.rpc)
                            i18n.changeLanguage(data.language).then(() => {
                            });
                        }

                        resolve(data.rpc)
                    })
                }
            })
        });

    }

}
const service = new Service();


export default service