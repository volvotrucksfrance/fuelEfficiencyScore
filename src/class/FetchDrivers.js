import axios from 'axios';

export default class FetchDrivers {

    //TODO HANDLE REFRESH TIMER

    constructor(login, password) {

        this.login = login;
        this.password = password;
        this.apiUrl = "https://api.volvotrucks.com/";
    }

    async getDrivers()  {

        const endUrl = 'drivers';

        try {
            const res = await axios({
                method:'get',
                url: this.apiUrl + 'driver/' + endUrl,
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
        dateFin = new Date(dateFin);

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

        dateFin.setHours(23, 59, 59, 999);

        listDate.push({
            debut: dateDebut.toISOString(),
            fin: dateFin.toISOString()
        });

        const endUrl = 'vehiclestatuses';
        const brutData = [];

        try {

            for(var i in listDate) {
                    
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
                        starttime: listDate[i].debut,
                        stoptime: listDate[i].fin,
                        contentFilter: "ACCUMULATED",
                        additionalContent: "VOLVOGROUPACCUMULATED"
                    }
                });
                await this.sleep(10000);
                
                const myRes = res.data.vehicleStatusResponse;
                brutData.push(myRes);
            }

            return brutData;
        } catch (err) {

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