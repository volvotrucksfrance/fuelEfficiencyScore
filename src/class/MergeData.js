export default class MergeData {

    constructor() {

        this.mergedData = {};
        this.mergedDataTrucks = {};
        this.mergedFleet = this.getTemplate();
    }

    getDataFleet() {

        return this.mergedFleet;
    }

    getDataTrucks() {

        return this.mergedDataTrucks;
    }

    getFormatedData(data) {

        let formatData = [];

        const listKey = Object.keys(data);

        for(var i in listKey) {

            const id = listKey[i];
            formatData.push(this.convertData(id, data[id]));
        }

        return formatData;
    }

    convertData(key, data) {

        const dist = data.distance;
        const time = data.time;
        const fuel = data.fuel*1000;

        if(dist != NaN && time != NaN) {

            const auto = data.transmissionModeSeconds[0].value;
            const manual = data.transmissionModeSeconds[1].value;
            const power = data.transmissionModeSeconds[2].value;
            const ishiftTotal = auto + manual + power;

            return {
                coasting: (data.coasting.meters/(dist))*100,
                freinage: data.brakeCount,
                arret: data.stopCount,
                ratioFreinage: data.brakeCount
                                /data.stopCount,
                auto: (auto/ishiftTotal)*100,
                manual: (manual/ishiftTotal)*100,
                power: (power/ishiftTotal)*100,
                topGear: (data.topGear.meters/dist)*100,
                inEco: ((data.engineWithinGreenArea.milliLitres)/fuel)*100,
                outEco: ((data.engineOutOfGreenArea.milliLitres)/fuel)*100,
                overrev: (data.engineOverrev.seconds/time)*100,
                engineload: (data.engineOverload.meters/dist)*100,
                overspeed: ((data.roadOverspeed.milliLitres)/fuel)*100,
                cruise: (data.cruise.meters/dist)*100,
                idling: (data.idle/time)*100,
                time: time,
                dist: dist,
                fuel: fuel,
                id: key
            };
        }

        return null;
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
                this.addToFleet(this.mergedDataTrucks[tmpVin]);
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
        const aVolvoData = a.accumulatedData.volvoGroupAccumulated;

        return {
            "fuel": this.makeDiff(b.engineTotalFuelUsed, a.engineTotalFuelUsed),
            "idle": this.makeDiff(b.accumulatedData.durationWheelbaseSpeedZero, a.accumulatedData.durationWheelbaseSpeedZero),
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
                "meters": this.makeDiff(bVolvoData.engineWithinGreenArea, aVolvoData.engineWithinGreenArea, 'meters'),
                "milliLitres": this.makeDiff(bVolvoData.engineWithinGreenArea, aVolvoData.engineWithinGreenArea, 'milliLitres')
            },
            "engineOutOfGreenArea": {
                "seconds": this.makeDiff(bVolvoData.engineOutOfGreenArea, aVolvoData.engineOutOfGreenArea, 'seconds'),
                "meters": this.makeDiff(bVolvoData.engineOutOfGreenArea, aVolvoData.engineOutOfGreenArea, 'meters'),
                "milliLitres": this.makeDiff(bVolvoData.engineOutOfGreenArea, aVolvoData.engineOutOfGreenArea, 'milliLitres')
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
                "meters": this.makeDiff(bVolvoData.roadOverspeed, aVolvoData.roadOverspeed, 'meters'),
                "milliLitres": this.makeDiff(bVolvoData.roadOverspeed, aVolvoData.roadOverspeed, 'milliLitres')
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

    convertNaNToZero(a) {
        if(isNaN(a)) {

            return 0;
        }
        return a;
    }

    isAllNotNaN(obj) {

        const keys = Object.keys(obj);

        for(var i in keys) {

            const tmp = obj[keys[i]];

            if(typeof tmp == 'object') {

                const subKeys = Object.keys(tmp);

                for(var j in subKeys) {

                    if(isNaN(tmp[subKeys[j]])) {

                        return true;
                    }
                }

            } else if(isNaN(tmp)) {

                return false;
            }
        }

        return true;
    }

    makeSum(a, b) {

        a = this.convertNaNToZero(a);
        b = this.convertNaNToZero(b);

        return a + b;
    }

    addToFleet(a) {

        if(!this.isAllNotNaN(a)) {

            return;
        }

        this.mergedFleet = {
            "fuel": this.makeSum(this.mergedFleet.fuel, a.fuel),
            "idle": this.makeSum(this.mergedFleet.idle, a.idle),
            "time": this.makeSum(this.mergedFleet.time,  a.time),
            "distance": this.makeSum(this.mergedFleet.distance, a.distance),
            "cruise": {
                "seconds": this.makeSum(this.mergedFleet.cruise.seconds, a.cruise.seconds),
                "meters": this.makeSum(this.mergedFleet.cruise.meters, a.cruise.meters),
            },
            "brakeCount": this.makeSum(this.mergedFleet.brakeCount, a.brakeCount),
            "coasting": {
                "seconds": this.makeSum(this.mergedFleet.coasting.seconds, a.coasting.seconds, 'seconds'),
                "meters": this.makeSum(this.mergedFleet.coasting.meters, a.coasting.meters, 'meters')
            },
            "engineOverload": {
                "seconds": this.makeSum(this.mergedFleet.engineOverload.seconds, a.engineOverload.seconds, 'seconds'),
                "meters": this.makeSum(this.mergedFleet.engineOverload.meters, a.engineOverload.meters, 'meters')
            },
            "engineOverrev": {
                "seconds": this.makeSum(this.mergedFleet.engineOverrev.seconds, a.engineOverrev.seconds, 'seconds'),
                "meters": this.makeSum(this.mergedFleet.engineOverrev.meters, a.engineOverrev.meters, 'meters')
            },
            "engineWithinGreenArea": {
                "seconds": this.makeSum(this.mergedFleet.engineWithinGreenArea.seconds, a.engineWithinGreenArea.seconds, 'seconds'),
                "meters": this.makeSum(this.mergedFleet.engineWithinGreenArea.meters, a.engineWithinGreenArea.meters, 'meters'),
                "milliLitres": this.makeSum(this.mergedFleet.engineWithinGreenArea.milliLitres, a.engineWithinGreenArea.milliLitres, 'milliLitres')
            },
            "engineOutOfGreenArea": {
                "seconds": this.makeSum(this.mergedFleet.engineOutOfGreenArea.seconds, a.engineOutOfGreenArea.seconds, 'seconds'),
                "meters": this.makeSum(this.mergedFleet.engineOutOfGreenArea.meters, a.engineOutOfGreenArea.meters, 'meters'),
                "milliLitres": this.makeSum(this.mergedFleet.engineOutOfGreenArea.milliLitres, a.engineOutOfGreenArea.milliLitres, 'milliLitres')
            },
            "transmissionModeSeconds": [
                {
                    "label": "AUTO",
                    "value": this.makeSum(this.mergedFleet.transmissionModeSeconds[0].value, a.transmissionModeSeconds[0].value, 0, 'array')
                },
                {
                    "label": "MANUAL",
                    "value": this.makeSum(this.mergedFleet.transmissionModeSeconds[1].value, a.transmissionModeSeconds[1].value, 1, 'array')
                },
                {
                    "label": "POWER",
                    "value": this.makeSum(this.mergedFleet.transmissionModeSeconds[2].value, a.transmissionModeSeconds[2].value, 2, 'array')
                }
            ],
            "convoyWeightMeters": [
                {
                    "label": "LIGHT",
                    "value": this.makeSum(this.mergedFleet.convoyWeightMeters[0].value, a.convoyWeightMeters[0].value, 0, 'array')
                },
                {
                    "label": "MEDIUM",
                    "value": this.makeSum(this.mergedFleet.convoyWeightMeters[1].value, a.convoyWeightMeters[1].value, 1, 'array')
                },
                {
                    "label": "FULL",
                    "value": this.makeSum(this.mergedFleet.convoyWeightMeters[2].value, a.convoyWeightMeters[2].value, 2, 'array')
                }
            ],
            "roadOverspeed": {
                "seconds": this.makeSum(this.mergedFleet.roadOverspeed.seconds, a.roadOverspeed.seconds, 'seconds'),
                "meters": this.makeSum(this.mergedFleet.roadOverspeed.meters, a.roadOverspeed.meters, 'meters'),
                "milliLitres": this.makeSum(this.mergedFleet.roadOverspeed.milliLitres, a.roadOverspeed.milliLitres, 'milliLitres')
            },
            "stopCount": this.makeSum(this.mergedFleet.stopCount, a.stopCount),
            "topGear": {
                "seconds": this.makeSum(this.mergedFleet.topGear.seconds, a.topGear.seconds, 'seconds'),
                "meters": this.makeSum(this.mergedFleet.topGear.meters, a.topGear.meters, 'meters')
            },
            "engineTotalCatalystUsed": this.makeSum(this.mergedFleet.engineTotalCatalystUsed, a.engineTotalCatalystUsed),
            "withoutCatalyst": {
                "seconds": this.makeSum(this.mergedFleet.withoutCatalyst.seconds, a.withoutCatalyst.seconds, 'seconds'),
                "meters": this.makeSum(this.mergedFleet.withoutCatalyst.meters, a.withoutCatalyst.meters, 'meters')
            }
        }
    }

    getTemplate() {

        return {
            "fuel": 0,
            "idle": 0,
            "time": 0,
            "distance": 0,
            "cruise": {
                "seconds": 0,
                "meters": 0,
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
                "meters": 0,
                "milliLitres": 0
            },
            "engineOutOfGreenArea": {
                "seconds": 0,
                "meters": 0,
                "milliLitres": 0
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
                "meters": 0,
                "milliLitres": 0
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
        }
    }

    makeSumObj(obj) {


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