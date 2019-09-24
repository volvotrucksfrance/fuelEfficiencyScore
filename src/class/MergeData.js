export default class MergeData {

    

    constructor() {

        this.mergedData = {};
    }

    getFormatedData() {

        let formatData = [];

        for(var i in this.mergedData) {

            const dist = this.mergedData[i].distance;
            const time = this.mergedData[i].time;

            formatData.push({
                coasting: this.mergedData[i].coasting.meters/dist,
                ratioFreinage: this.mergedData[i].brakeCount
                                /this.mergedData[i].stopCount,
                auto: this.mergedData[i].transmissionModeSeconds[0].value/time,
                manual: this.mergedData[i].transmissionModeSeconds[1].value/time,
                power: this.mergedData[i].transmissionModeSeconds[2].value/time,
                topGear: this.mergedData[i].topGear.meters/dist,
                inEco: this.mergedData[i].engineWithinGreenArea.meters/dist,
                outEco: this.mergedData[i].engineOutOfGreenArea.meters/dist,
                overrev: this.mergedData[i].engineOverrev.meters/dist,
                engineload: this.mergedData[i].engineOverload.meters/dist,
                overspeed: this.mergedData[i].roadOverspeed.meters/dist,
                cruise: this.mergedData[i].cruise.meters/dist,
                idling: 0,
                driverID: i
            });
        }

        return formatData;
    }


    byDriver(brut_data) {

        for(var i in brut_data[0].vehicleStatuses) {

            const tmpData = brut_data[0].vehicleStatuses[i];

            const driverID = this._getDriverID(tmpData);

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