import moment from 'moment';
import MergeVehicleStatuses from '../class/MergeVehicleStatuses';

var rp = require('request-promise');

if(process.env.VOLVO_HTTP_PROXY != undefined) {

    rp = rp.defaults({'proxy':'http://proxy.vtec.volvo.se:8080'});
}

export default class  {

    constructor(login, password) {

        this.login = login;
        this.password = password;
        this.apiUrl = "https://api.volvotrucks.com/";
        this.gaidoUrl = "https://vtf.spv.gaido.fr/";

        this.vehicleData = {};
        this.isVehicleDone = false;

        this.driverData = {};
        this.isDriverDone = false;
    }

    async loginToGaido() {

        try {
            const user = await rp({
                method: 'POST',
                url: this.gaidoUrl + 'user',
                headers: {
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify({
                    login: this.login,
                    password: this.password
                })
            });

            return JSON.parse(user);

        } catch(err) {

            throw err;
        }
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
            return res;
            
        } catch (err) {

            return false;
        }

    }

    async getVehiclesDataGaido(dateDebut, dateFin, store, groupby) {

        var isDebutToday = moment(dateDebut).isSame(new Date(), "day");
        var isFinToday = moment(dateFin).isSame(new Date(), "day");

        dateDebut = new Date(dateDebut);
        dateDebut.setHours(dateDebut.getHours() - 1);

        dateFin = new Date(dateFin);
        dateFin.setHours(dateFin.getHours() + 23);
        dateFin.setSeconds(dateFin.getSeconds() + 1);

        var brutData = {
            debut : {

            },
            fin: {

            }
        };

        //Si les 2 dates pas aujourd'hui alors utilise v2 du serv gaido
        if(!isDebutToday && !isFinToday) {

            try {

                let allData = await rp({
                    method: 'GET',
                    url: this.gaidoUrl + 'api/v2/vehicle/vehiclestatuses',
                    auth: {
                        user: this.login,
                        password: this.password
                    },
                    headers: {
                        "Content-Type": 'application/json'
                    },
                    qs: {
                        starttime: dateDebut.toISOString(),
                        stoptime: dateFin.toISOString(),
                        groupby: groupby
                    }
                });

                allData = JSON.parse(allData);

                for(var i = 0; i < allData.old.length - 1; i++) {

                    if(brutData.debut[allData.old[i][groupby]] != undefined) {


                        const myMerge = new MergeVehicleStatuses(brutData.debut[allData.old[i][groupby]], allData.old[i]);
                        myMerge.makeSum();
                        brutData.debut[allData.old[i][groupby]] = myMerge.getSummedStatuses();

                    } else {

                        brutData.debut[allData.old[i][groupby]] = allData.old[i];
                    }
                }

                for(var i in allData.recent) {

                    if(brutData.fin[allData.recent[i][groupby]] != undefined) {

                        const myMerge = new MergeVehicleStatuses(brutData.fin[allData.recent[i][groupby]], allData.recent[i]);
                        myMerge.makeSum();
                        brutData.fin[allData.recent[i][groupby]] = myMerge.getSummedStatuses();

                    } else {

                        brutData.fin[allData.recent[i][groupby]] = allData.recent[i];
                    }
                }

                return brutData;

            } catch(err) {

                console.log(err);
                return false;
            }
        //on recup le debut sur gaido et la suite sur Volvo Connect
        } else if(!isDebutToday && isFinToday) {

            try {
                //debut data
                let debutData = await rp({
                    method: 'GET',
                    url: this.gaidoUrl + 'api/vehicle/vehiclestatusesbydate',
                    auth: {
                        user: this.login,
                        password: this.password
                    },
                    headers: {
                        "Content-Type": 'application/json'
                    },
                    qs: {
                        starttime: dateDebut.toISOString(),
                        groupby: groupby
                    }
                });

                debutData = JSON.parse(debutData);

                for(var i = 0; i < debutData.length - 1; i++) {

                    if(brutData.debut[debutData[i][groupby]] != undefined) {

                        const myMerge = new MergeVehicleStatuses(brutData.debut[debutData[i][groupby]], debutData[i]);
                        myMerge.makeSum();
                        brutData.debut[debutData[i][groupby]] = myMerge.getSummedStatuses();

                    } else {

                        brutData.debut[debutData[i][groupby]] = debutData[i];
                    }
                }
        
                const lastData = await this.getVehiclesDataLatest();
                for(var i = 0; i < lastData.length - 1; i++) {

                    if(groupby == 'driverID' && lastData[i].driver1Id != undefined) {

                        //si ca existe au debut alors on ajoute la fin
                        if(brutData.debut[this._getDriverID(lastData[i].driver1Id)] != undefined) {

                            //Si la données existe on additione
                            if(brutData.fin[this._getDriverID(lastData[i].driver1Id)] != undefined) {

                                const myMerge = new MergeVehicleStatuses(brutData.fin[this._getDriverID(lastData[i].driver1Id)], lastData[i]);
                                myMerge.makeSum();
                                brutData.fin[this._getDriverID(lastData[i].driver1Id)] = myMerge.getSummedStatuses();
        
                            } else {
        
                                brutData.fin[this._getDriverID(lastData[i].driver1Id)] = lastData[i];
                            }
                        }

                    } else {

                        if(brutData.debut[lastData[i][groupby]] != undefined) {

                            brutData.fin[lastData[i][groupby]] = lastData[i];
                        }
                    }
                }
                return brutData;
            } catch(err) {

                console.log(err);
                return false;
            }

        //on recup tout sur Volvo Connect
        } else {

            return await this.getVehiclesData(dateDebut, dateFin, store, groupby);
        }

    }

    _getDriverID(driverData) {

        return driverData != undefined ? 
                (driverData.tachoDriverIdentification != undefined ? driverData.tachoDriverIdentification.cardIssuingMemberState
                    + driverData.tachoDriverIdentification.driverIdentification : null)
            : null;
    }

    async getVehiclesDataLatest() {

        try {

            await this.sleep(10000);
            var listData = [];

            const endUrl = 'vehiclestatuses';

            var moreData = false;
            var lastVin;
            /* do { */

                let latestData = await rp({
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
                        latestOnly: true,
                        lastVin: lastVin,
                        additionalContent: 'VOLVOGROUPACCUMULATED',
                        contentFilter: 'ACCUMULATED'
                    }
                });
                latestData = JSON.parse(latestData);

                const tabLength = latestData.vehicleStatusResponse.vehicleStatuses.length;
                moreData = latestData.moreDataAvailable;
                lastVin = latestData.vehicleStatusResponse.vehicleStatuses[tabLength - 1].vin;

                //listData.push(latestData.vehicleStatusResponse.vehicleStatuses);

            /* } while(moreData); */

            return latestData.vehicleStatusResponse.vehicleStatuses;

            
        } catch(err) {

            console.log('err API', err);
        }
    }


    async getVehiclesData(dateDebut, dateFin, store, groupeby) {

        if(groupeby == 'vin' && this.isVehicleDone == true) {

            return this.vehicleData;
        } else if(groupeby == 'driverID' && this.isDriverDone == true) {

            return this.driverData;
        }

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

            var tabDriverBrut = {};

            for(var i in listDate) {


                var shouldFetchMore = false;
                var lastVin;

                var tmpStartTime = listDate[i].debut;

                do {

                    const perc = this.dateToPourcentage(realStart, tmpStartTime, realEnd);
                    console.log(perc);

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
                            lastVin: lastVin
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

                        const tmpDriverID = this._getDriverID(tabData[k].driver1Id);

                        if(tmpDriverID != null) {
    
                            if(tabDriverBrut[tmpDriverID] == undefined) {

                                tabDriverBrut[tmpDriverID] = [tabData[k]];
                            } else {

                                tabDriverBrut[tmpDriverID].push(tabData[k]);
                            }
                        }
                    }

                    this.vehicleData = brutData;
                    this.isVehicleDone = true;

                    await this.sleep(10000);

                } while(shouldFetchMore);
            }

            const listDrivers = Object.keys(tabDriverBrut);
            brutData = {
                debut : {
    
                },
                fin: {
    
                }
            };

            for(var k in listDrivers) {

                const myTmpDriverID = listDrivers[k];

                for(var i = 0; i < tabDriverBrut[myTmpDriverID].length - 1; i++) {

                    const status = tabDriverBrut[myTmpDriverID][i];
                    const currentVin = status.vin;

                    //skip until last statuses
                    while(tabDriverBrut[myTmpDriverID][i+1].vin == currentVin && i < tabDriverBrut[myTmpDriverID].length - 2) {

                        i++;
                    }

                    //si 2 données sur 1 meme camions
                    if(status.vin == tabDriverBrut[myTmpDriverID][i].vin) {

                        if(brutData.debut[myTmpDriverID] != undefined) {

                            const myMerge = new MergeVehicleStatuses(brutData.debut[myTmpDriverID], tabDriverBrut[myTmpDriverID][i]);
                            myMerge.makeSum();
                            brutData.debut[myTmpDriverID] = myMerge.getSummedStatuses();

                            const myMergeFin = new MergeVehicleStatuses(brutData.fin[myTmpDriverID], tabDriverBrut[myTmpDriverID][i]);
                            myMergeFin.makeSum();
                            brutData.fin[myTmpDriverID] = myMergeFin.getSummedStatuses();
    
                        } else {
    
                            brutData.debut[myTmpDriverID] = status;
                            brutData.fin[myTmpDriverID] = tabDriverBrut[myTmpDriverID][i];
                        }
                        i++;
                    }
                }

                this.driverData = brutData;
                this.isDriverDone = true;

            }

            if(groupeby == 'driverID') {

                return this.driverData;
            } else {

                return this.vehicleData;  
            }

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