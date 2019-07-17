export default class MergeData {


    byDriver(brut_data) {

        for(var i in brut_data) {

            const tmpTruckData = brut_data[i].vehicleStatuses;

            for(var j in tmpTruckData) {

                console.log(tmpTruckData[j].volvoGroupAccumulated);
            }
        }

        return brut_data;
    }
}