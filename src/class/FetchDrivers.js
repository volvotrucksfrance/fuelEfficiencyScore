import axios from 'axios';
import * as tunnel from 'tunnel';
const agent = tunnel.httpsOverHttp({
    proxy: {
        host: 'http://proxy.vtec.volvo.se',
        port: 8080,
    },
});
import moment from 'moment';
import rp from 'request-promise';
const rpp = rp.defaults({'proxy':'http://proxy.vtec.volvo.se:8080'});
var qs = require('querystring');

export default class  {

    constructor(login, password) {

        this.login = login;
        this.password = password;
        this.apiUrl = "https://api.volvotrucks.com/";
    }

    async getDrivers()  {

        const endUrl = 'drivers';

        try {

            var lastDriverId;
            var res = [];
            var shouldFetchMore = false;

            do {

                var dataDriverChunk = await axios({
                    method:'get',
                    url: this.apiUrl + 'driver/' + endUrl,
                    auth: {
                        username: this.login,
                        password: this.password
                    },
                    headers: {
                        Accept: this._getAcceptHeader(endUrl),
                        lastDriverId: lastDriverId
                    },
                    params: {
                        lastDriverId: lastDriverId
                    }
                });

                shouldFetchMore = dataDriverChunk.data.moreDataAvailable;

                var tabDrivers = dataDriverChunk.data.driverResponse.drivers;
                lastDriverId = tabDrivers[tabDrivers.length - 1].tachoDriverIdentification.cardIssuingMemberState 
                                    .concat(tabDrivers[tabDrivers.length - 1].tachoDriverIdentification.driverIdentification);

                res = res.concat(tabDrivers);

            } while(shouldFetchMore);

            return res;
            
        } catch (err) {

            return false;
        }

    }

    async getVehicles()  {

        const endUrl = 'vehicles';

        try {


            var shouldFetchMore = false;
            var lastVin;
            var listTrucks = [];

            do {

                const res = await axios({
                    method:'get',
                    url: this.apiUrl + 'vehicle/' + endUrl,
                    auth: {
                        username: this.login,
                        password: this.password
                    },
                    headers: {
                        Accept: this._getAcceptHeader(endUrl)
                    },
                    params: {
                        lastVin: lastVin,
                        additionalContent: 'VOLVOGROUPVEHICLE'
                    }
                });

                lastVin = res.data.vehicleResponse.vehicles[res.data.vehicleResponse.vehicles.length - 1].vin;
                shouldFetchMore = res.data.moreDataAvailable;
                listTrucks = listTrucks.concat(res.data.vehicleResponse.vehicles);
                
            } while(shouldFetchMore);
            

            return listTrucks;
        } catch (err) {

            return false;
        }
    }

    

    async getVehiclesData(dateDebut, dateFin) {

        dateDebut = new Date(dateDebut);
        dateDebut.setHours(dateDebut.getHours() - 2);

        dateFin = new Date(dateFin);
        dateFin.setHours(dateFin.getHours() + 22);
        dateFin.setSeconds(dateFin.getSeconds() + 1);

        var listDate = [];

        while(dateDebut.addDays(14) < dateFin) {


            let tmpDebut = dateDebut;
            dateDebut = dateDebut.addDays(14);
            let tmpFin = dateDebut;

            listDate.push({
                debut: tmpDebut.toISOString(),
                fin: tmpFin.toISOString()
            });
        }

        listDate.push({
            debut: dateDebut.toISOString(),
            fin: dateFin.toISOString()
        });

        try {

            const endUrl = 'vehiclestatuses';
            var brutData = {
                debut : {
    
                },
                fin: {
    
                }
            };

            var brutDataDriver = {
                debut : {
    
                },
                fin: {
    
                }
            };

            for(var i in listDate) {


                var shouldFetchMore = false;
                var lastVin;

                var tmpStartTime = listDate[i].debut;

                do {

                    var tabData = await rpp({
                        method: 'GET',
                        url: this.apiUrl + 'vehicle/' + endUrl,
                        auth: {
                            user: this.login,
                            password: this.password
                        },
                        headers: {
                            Accept: this._getAcceptHeader(endUrl)
                        },
                        qs: {
                            starttime: tmpStartTime,
                            stoptime: listDate[i].fin,
                            contentFilter: "ACCUMULATED",
                            additionalContent: "VOLVOGROUPACCUMULATED",
                            datetype: 'created',
                            lastVin: lastVin,
                            triggerFilter: 'TIMER,DRIVER_LOGIN,DRIVER_LOGOUT,IGNITION_ON,IGNITION_OFF'
                        }
                    });
                    const data = JSON.parse(tabData);

                    tabData = data.vehicleStatusResponse.vehicleStatuses;

                    if(tabData.length > 0 ) {

                        lastVin = tabData[tabData.length - 1].vin;
                        tmpStartTime = moment(tabData[tabData.length - 1].createdDateTime);
                        tmpStartTime = tmpStartTime.add(1, 'seconds').toISOString();
                    }
                    
                    shouldFetchMore = data.moreDataAvailable;                    

                    for(var k in tabData) { 

                        //trucks data 
                        if(brutData.debut[tabData[k].vin] == undefined) {

                            brutData.debut[tabData[k].vin] = tabData[k];
                        } else {
    
                            brutData.fin[tabData[k].vin] = tabData[k];
                        }
                        
                    }

                    await this.sleep(10000);

                } while(shouldFetchMore);
            }

            return brutData;

        } catch (err) {

            console.log(err);
            return err;
        }
    
    }

    _getAcceptHeader(dataType) {

        return `application/x.volvogroup.com.${dataType}.v1.0+json; UTF-8`
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}