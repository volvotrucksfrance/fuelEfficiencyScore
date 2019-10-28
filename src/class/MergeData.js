export default class MergeData {

    

    constructor() {

        this.mergedData = {};
        this.mergedDataTrucks = {};
    }

    getDataTrucks() {

        return this.mergedDataTrucks;
    }

    getFormatedData(data) {

        let formatData = [];

        const listVin = Object.keys(data);

        for(var i in listVin) {

            const vin = listVin[i];

            const tmpData = data[vin];
            const dist = tmpData.distance;
            const time = tmpData.time;
            const cruiseDist = tmpData.cruise.meters;

            if(dist != NaN && time != NaN) {

            formatData.push({
                coasting: (tmpData.coasting.meters/(dist-cruiseDist))*100,
                ratioFreinage: tmpData.brakeCount
                                /tmpData.stopCount,
                auto: (tmpData.transmissionModeSeconds[0].value/time)*100,
                manual: (tmpData.transmissionModeSeconds[1].value/time)*100,
                power: (tmpData.transmissionModeSeconds[2].value/time)*100,
                topGear: (tmpData.topGear.meters/dist)*100,
                inEco: (tmpData.engineWithinGreenArea.meters/dist)*100,
                outEco: (tmpData.engineOutOfGreenArea.meters/dist)*100,
                overrev: (tmpData.engineOverrev.meters/dist)*100,
                engineload: (tmpData.engineOverload.meters/dist)*100,
                overspeed: (tmpData.roadOverspeed.meters/dist)*100,
                cruise: (tmpData.cruise.meters/dist)*100,
                idling: (tmpData.idle/dist)*100,
                vin: vin
            });
            }
        }

        return formatData;
    }

    byTrucks(brut_data) {

        const debut = brut_data.debut;
        const fin = brut_data.fin;

        const listVin = Object.keys(debut);

        for(var i in listVin) {

            const tmpVin = listVin[i];

            //Si Debut et Fin
            if(fin[tmpVin] && this.hasVolvoGroup(debut[tmpVin]) && this.hasVolvoGroup(fin[tmpVin])) {

                this.mergedDataTrucks[tmpVin] = this.makeDiffObj(debut[tmpVin], fin[tmpVin]);
            }
        }

        return this.mergedDataTrucks;
    }

    hasVolvoGroup(data) {

        return Object.entries(data.accumulatedData.volvoGroupAccumulated).length != 0;
    }

    makeDiff(a, b, property, type) {

        if(property == undefined) {

            return a - b;

        } else if(a != undefined && b != undefined && a[property] != undefined && b[property] != undefined) {

            if(type == 'array' && a[property].value != undefined && b[property].value != undefined) {

                return a[property].value - b[property].value;
    
            } else if(type != 'array') {

                return a[property] - b[property];
            } else {

                return 0;
            }
            

        } else {

            return 0;
        }
    }

    makeDiffObj(a, b) {
 
        const bVolvoData = b.accumulatedData.volvoGroupAccumulated;
        const aVolvoData =  a.accumulatedData.volvoGroupAccumulated;

        return {
            "idle": this.makeDiff(b.accumulatedData.durationWheelbaseSpeedOverZero,  a.accumulatedData.durationWheelbaseSpeedOverZero),
            "time": this.makeDiff(b.totalEngineHours*60*60,  a.totalEngineHours*60*60),
            "distance": this.makeDiff(b.hrTotalVehicleDistance, a.hrTotalVehicleDistance),
            "cruise": {
                "seconds": this.makeDiff(b.accumulatedData.durationCruiseControlActive, a.accumulatedData.durationCruiseControlActive),
                "meters": this.makeDiff(b.accumulatedData.distanceCruiseControlActive, a.accumulatedData.distanceCruiseControlActive),
            },
            "brakeCount": this.makeDiff(bVolvoData.brakeCount, aVolvoData.brakeCount),
            "coasting": {
                "seconds": this.makeDiff(bVolvoData.coasting, aVolvoData.coasting, 'seconds'),
                "meters": this.makeDiff(bVolvoData.coasting, aVolvoData.coasting, 'meters')
            },
            "engineOverload": {
                "seconds": this.makeDiff(bVolvoData.engineOverload, aVolvoData.engineOverload, 'seconds'),
                "meters": this.makeDiff(bVolvoData.engineOverload, aVolvoData.engineOverload, 'meters')
            },
            "engineOverrev": {
                "seconds": this.makeDiff(bVolvoData.engineOverrev, aVolvoData.engineOverrev, 'seconds'),
                "meters": this.makeDiff(bVolvoData.engineOverrev, aVolvoData.engineOverrev, 'meters')
            },
            "engineWithinGreenArea": {
                "seconds": this.makeDiff(bVolvoData.engineWithinGreenArea, aVolvoData.engineWithinGreenArea, 'seconds'),
                "meters": this.makeDiff(bVolvoData.engineWithinGreenArea, aVolvoData.engineWithinGreenArea, 'meters')
            },
            "engineOutOfGreenArea": {
                "seconds": this.makeDiff(bVolvoData.engineOutOfGreenArea, aVolvoData.engineOutOfGreenArea, 'seconds'),
                "meters": this.makeDiff(bVolvoData.engineOutOfGreenArea, aVolvoData.engineOutOfGreenArea, 'meters')
            },
            "transmissionModeSeconds": [
                {
                    "label": "AUTO",
                    "value": this.makeDiff(bVolvoData.transmissionModeSeconds, aVolvoData.transmissionModeSeconds, 0, 'array')
                },
                {
                    "label": "MANUAL",
                    "value": this.makeDiff(bVolvoData.transmissionModeSeconds, aVolvoData.transmissionModeSeconds, 1, 'array')
                },
                {
                    "label": "POWER",
                    "value": this.makeDiff(bVolvoData.transmissionModeSeconds, aVolvoData.transmissionModeSeconds, 2, 'array')
                }
            ],
            "convoyWeightMeters": [
                {
                    "label": "LIGHT",
                    "value": this.makeDiff(bVolvoData.convoyWeightMeters, aVolvoData.convoyWeightMeters, 0, 'array')
                },
                {
                    "label": "MEDIUM",
                    "value": this.makeDiff(bVolvoData.convoyWeightMeters, aVolvoData.convoyWeightMeters, 1, 'array')
                },
                {
                    "label": "FULL",
                    "value": this.makeDiff(bVolvoData.convoyWeightMeters, aVolvoData.convoyWeightMeters, 2, 'array')
                }
            ],
            "roadOverspeed": {
                "seconds": this.makeDiff(bVolvoData.roadOverspeed, aVolvoData.roadOverspeed, 'seconds'),
                "meters": this.makeDiff(bVolvoData.roadOverspeed, aVolvoData.roadOverspeed, 'meters')
            },
            "stopCount": this.makeDiff(bVolvoData.stopCount, aVolvoData.stopCount),
            "topGear": {
                "seconds": this.makeDiff(bVolvoData.topGear, aVolvoData.topGear, 'seconds'),
                "meters": this.makeDiff(bVolvoData.topGear, aVolvoData.topGear, 'meters')
            },
            "engineTotalCatalystUsed": this.makeDiff(bVolvoData.engineTotalCatalystUsed, aVolvoData.engineTotalCatalystUsed),
            "withoutCatalyst": {
                "seconds": this.makeDiff(bVolvoData.withoutCatalyst, aVolvoData.withoutCatalyst, 'seconds'),
                "meters": this.makeDiff(bVolvoData.withoutCatalyst, aVolvoData.withoutCatalyst, 'meters')
            }
        }
    }

    byDriver(brut_data) {

        for(var i in brut_data) {

            const tmpData = brut_data[i];

            const driverID = this._getDriverID(tmpData);

            if(driverID != null) {

                if(this.mergedData[driverID] == undefined) {

                    this.mergedData[driverID] = this._newTemplate();
                }
    
                for (var i in this.mergedData[driverID]) {
    
                    if(i == 'cruise') {
    
                        const valueSec = tmpData.accumulatedData.durationCruiseControlActive || 0;
                        const valueMet = tmpData.accumulatedData.distanceCruiseControlActive || 0;
    
                        this.mergedData[driverID][i].seconds += valueSec;
                        this.mergedData[driverID][i].meters += valueMet;
                    } else if(i == 'distance') {
    
                        const value = tmpData.hrTotalVehicleDistance || 0;
    
                        this.mergedData[driverID][i] += value;
                    } else if(i == 'time') {
    
                        const value = tmpData.totalEngineHours*60*60 || 0;
    
                        this.mergedData[driverID][i] += value;
                    } else {
    
                        this._addVolvoGroupValue(driverID, i, tmpData);
                    }
    
                }
            }

            
        }

        console.log(this.mergedData);

        return this.mergedData;
    }

    _addVolvoGroupValue(driverID, ref, data) {

        try {

            switch (typeof data.accumulatedData.volvoGroupAccumulated[ref]) {
                case 'object':

                    if(Array.isArray(data.accumulatedData.volvoGroupAccumulated[ref])) {

                        const value0 = data.accumulatedData.volvoGroupAccumulated[ref][0].value || 0;
                        const value1 = data.accumulatedData.volvoGroupAccumulated[ref][1].value || 0;
                        const value2 = data.accumulatedData.volvoGroupAccumulated[ref][2].value || 0;
                        
                        this.mergedData[driverID][ref][0].value += value0;
                        this.mergedData[driverID][ref][1].value += value1;
                        this.mergedData[driverID][ref][2].value += value2;
                    } else {

                        const valueSec = data.accumulatedData.volvoGroupAccumulated[ref].seconds || 0;
                        const valueMet = data.accumulatedData.volvoGroupAccumulated[ref].meters || 0;
            
                        this.mergedData[driverID][ref].seconds += valueSec;
                        this.mergedData[driverID][ref].meters += valueMet;
                    }
                    
                    break;
                case 'number':
                    const value = data.accumulatedData.volvoGroupAccumulated[ref] || 0;
                    this.mergedData[driverID][ref] += value;
                    break;
            }

        } catch (err) {

            console.log("err", err);
        }
    }

    _getDriverID(data) {

        return data.driver1Id ? data.driver1Id.tachoDriverIdentification.driverIdentification : null;
    }

    _newTemplate() {

        return {
            "time": 0,
            "distance": 0,
            "cruise": {
                "seconds": 0,
                "meters": 0
            },
            "brakeCount": 0,
            "coasting": {
                "seconds": 0,
                "meters": 0
            },
            "engineOverload": {
                "seconds": 0,
                "meters": 0
            },
            "engineOverrev": {
                "seconds": 0,
                "meters": 0
            },
            "engineWithinGreenArea": {
                "seconds": 0,
                "meters": 0
            },
            "engineOutOfGreenArea": {
                "seconds": 0,
                "meters": 0
            },
            "transmissionModeSeconds": [
                {
                    "label": "AUTO",
                    "value": 0
                },
                {
                    "label": "MANUAL",
                    "value": 0
                },
                {
                    "label": "POWER",
                    "value": 0
                }
            ],
            "convoyWeightMeters": [
                {
                    "label": "LIGHT",
                    "value": 0
                },
                {
                    "label": "MEDIUM",
                    "value": 0
                },
                {
                    "label": "FULL",
                    "value": 0
                }
            ],
            "roadOverspeed": {
                "seconds": 0,
                "meters": 0
            },
            "stopCount": 0,
            "topGear": {
                "seconds": 0,
                "meters": 0
            },
            "engineTotalCatalystUsed": 0,
            "withoutCatalyst": {
                "seconds": 0,
                "meters": 0
            }
        };
    }
}