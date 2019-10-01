import axios from 'axios';
import moment from 'moment';

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
            const res = await axios({
                method:'get',
                url: this.apiUrl + 'vehicle/' + endUrl,
                auth: {
                    username: this.login,
                    password: this.password
                },
                headers: {
                    Accept: this._getAcceptHeader(endUrl)
                }
            });

            return res;
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

            for(var i in listDate) {


                var shouldFetchMore = false;
                var lastVin;

                var tmpStartTime = listDate[i].debut;

                do {

                    var resDataChunck = await axios({
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
                            starttime: tmpStartTime,
                            stoptime: listDate[i].fin,
                            contentFilter: "ACCUMULATED",
                            additionalContent: "VOLVOGROUPACCUMULATED",
                            datetype: 'created'
                            /* lastVin: lastVin */
                        }
                    });

                    var tabData = resDataChunck.data.vehicleStatusResponse.vehicleStatuses;

                    if(tabData.length > 0 ) {

                        lastVin = tabData[tabData.length - 1].vin;
                        tmpStartTime = moment(tabData[tabData.length - 1].createdDateTime);
                        tmpStartTime = tmpStartTime.add(1, 'seconds').toISOString();
                    }
                    
                    shouldFetchMore = resDataChunck.data.moreDataAvailable;                    

                    for(var k in tabData) {

                        //trucks data 
                        if(brutData.debut[tabData[k].vin] == undefined) {

                            brutData.debut[tabData[k].vin] = tabData[k];
                        } else {
    
                            brutData.fin[tabData[k].vin] = tabData[k];
                        }

                        //Si driver ID attaché
                        /* if(tabData[k].driver1Id != undefined) {

                            var driverID = tabData[k].driver1Id.tachoDriverIdentification.driverIdentification;

                            if(brutData.debut[driverID] == undefined) {
    
                                brutData.debut[driverID] = tabData[k];
                            } else {
    
                                brutData.fin[driverID] = tabData[k];
                            }
                        } */
                        
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