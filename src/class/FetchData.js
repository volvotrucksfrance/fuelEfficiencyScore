import moment from 'moment';

var rp = require('request-promise');

if(process.env.VOLVO_HTTP_PROXY != undefined) {

    rp = rp.defaults({'proxy':'http://proxy.vtec.volvo.se:8080'});
}

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

                var dataDriverChunk = await rp({
                    method: 'GET',
                    url: this.apiUrl + 'driver/' + endUrl,
                    auth: {
                        user: this.login,
                        password: this.password
                    },
                    headers: {
                        Accept: this._getAcceptHeader(endUrl),
                        lastDriverId: lastDriverId
                    },
                    qs: {
                        lastDriverId: lastDriverId
                    }
                });

                dataDriverChunk = JSON.parse(dataDriverChunk);

                shouldFetchMore = dataDriverChunk.moreDataAvailable;

                var tabDrivers = dataDriverChunk.driverResponse.drivers;
                lastDriverId = tabDrivers[tabDrivers.length - 1].tachoDriverIdentification.cardIssuingMemberState 
                                    .concat(tabDrivers[tabDrivers.length - 1].tachoDriverIdentification.driverIdentification);

                res = res.concat(tabDrivers);

            } while(shouldFetchMore);

            console.log(res);
            return true;
            
        } catch (err) {

            console.log(err);
            return false;
        }

    }


    async getVehiclesData(dateDebut, dateFin, store, vue) {

        dateDebut = new Date(dateDebut);
        dateDebut.setHours(dateDebut.getHours() - 2);

        dateFin = new Date(dateFin);
        dateFin.setHours(dateFin.getHours() + 22);
        dateFin.setSeconds(dateFin.getSeconds() + 1);

        const realStart = dateDebut;
        const realEnd = dateFin;

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

                    const perc = this.dateToPourcentage(realStart, tmpStartTime, realEnd);

                    store.commit('setPourcentage', `${perc}%`);
                    var tabData = await rp({
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
                            triggerFilter: this.optimalTriggerFilter(perc)
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
                    console.log('another one');
                    await this.sleep(10000);

                } while(shouldFetchMore);
            }

            console.log(brutData);
            return brutData;

        } catch (err) {

            console.log(err);
            store.commit('setPourcentage', 'Une erreur est survenue !');
            return err;
        }
    
    }

    optimalTriggerFilter(perc) {

        if(perc < 25 || perc > 75) {

            return;
        } else {

            return 'IGNITION_ON,IGNITION_OFF,DRIVER_LOGIN,DRIVER_LOGOUT';
        }
    }

    dateToPourcentage(start, a, end) {

        var res =  start == new Date(a) ? 0 : ((new Date(a) - start)/(end - start)*100).toFixed(1);
        return res;
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