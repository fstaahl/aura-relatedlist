/**
 * Created by takei on 14.6.2018.
 */
({
    doInit : function(cmp){
        cmp.set("v.isRunning", true);
        let action = cmp.get("c.getData");
        action.setParams({
            "sobj" : cmp.get("v.sobj"),
            "fields" : cmp.get("v.fields"),
            "fieldsToLabel" : cmp.get("v.fieldsToLabel"),
            "clause" : cmp.get("v.clause"),
            "soqlOrder" : cmp.get("v.soqlOrder"),
            "sortDESC" : cmp.get("v.sortDESC") ? 'DESC' : 'ASC',
            "referenceFields" : cmp.get("v.referenceFields"),
            "referenceFieldsIndices" : cmp.get("v.referenceFieldsIndices"),
            "referenceUrlPrefixes" : cmp.get("v.referenceURLPrefixes"),
            "lookup" : cmp.get("v.lookupName"),
            "lookupType" : cmp.get("v.lookupType"),
            "xRefLookupName" : cmp.get("v.xRefLookupName"),
            "xRefSobj" : cmp.get("v.sObjectName"),
            "recordId" : cmp.get("v.recordId"),
            "limitRecords" : cmp.get("v.limitRecords"),
            "currencyFromRecord" : cmp.get("v.currencyFromRecord")
        });
        action.setCallback(this, function(a){
            let state = a.getState();

            if(state === 'SUCCESS'){
                if(a.getReturnValue()){
                    cmp.set("v.data", a.getReturnValue().rows);
                    cmp.set("v.total", a.getReturnValue().rows.length);
                    cmp.set("v.headers", a.getReturnValue().headers);
                    this.sortTable(cmp, a.getReturnValue().rows);
                }

            } else if(state === 'ERROR'){
                let errors = a.getError();
                if(errors) {
                    if(errors[0] && errors[0].message) {
                       console.log("Error message: " + errors[0].message);
                    }
                } else{
                    console.log("Unknown error");
                }
            } else{
                console.log('Unknown error!');
            }

            cmp.set("v.isRunning", false);
        });
        $A.enqueueAction(action);
    },

    sortTable : function(cmp, data){
        let helpTable = data.slice();
        helpTable.sort(this.dynamicSort(cmp));

        let returnTable=[];
        cmp.set("v.numOfPages", Math.ceil(helpTable.length/cmp.get("v.recPerPage")));

        for(let i=0;i<cmp.get("v.numOfPages");i++)
        {
            let tempTable=[];
            for(let j=0;j<cmp.get("v.recPerPage");j++)
            {
                if(helpTable.length>0)
                tempTable.push(helpTable.shift());
            }
            returnTable.push(tempTable);
        }

        cmp.set("v.pagedData", returnTable);
        cmp.set("v.page", returnTable[0]);
        cmp.set("v.currentPage", 1);
    },

    dynamicSort : function(cmp) {
        var index = cmp.get("v.sortIndex");
        var reverse = cmp.get("v.sortDESC");
        var sortOrder = 1;
        if(reverse) {
            sortOrder = -1;
        }

        return function (a,b) {
            if(a.cells[index].fieldType === 'CURRENCY' || a.cells[index].fieldType === 'PERCENT' || a.cells[index].fieldType === 'DOUBLE' || a.cells[index].fieldType === 'INTEGER'){
                var result = (parseFloat(a.cells[index].value).toFixed(2) < parseFloat(b.cells[index].value).toFixed(2)) ? -1 : (parseFloat(a.cells[index].value).toFixed(2) > parseFloat(b.cells[index].value).toFixed(2)) ? 1 : 0;
                return result * sortOrder;
            } else if(a.cells[index].fieldType === 'REFERENCE' && a.cells[index].referenceUrlPrefix != ''){
                var result = (a.cells[index].referenceField < b.cells[index].referenceField) ? -1 : (a.cells[index].referenceField > b.cells[index].referenceField) ? 1 : 0;
                return result * sortOrder;
            } else if(a.cells[index].fieldType === 'DATE' || a.cells[index].fieldType === 'DATETIME'){
                var da = new Date(a.cells[index].value);
                var db = new Date(b.cells[index].value);
                var result = (da < db) ? -1 : (da > db) ? 1 : 0;
                return result * sortOrder;
            } else{
                var result = (a.cells[index].value.toLowerCase() < b.cells[index].value.toLowerCase()) ? -1 : (a.cells[index].value.toLowerCase() > b.cells[index].value.toLowerCase()) ? 1 : 0;
                return result * sortOrder;
            }
        }
    },

    doFilter : function(cmp){
        let helpTable = cmp.get("v.data").slice();
        let filters = cmp.get("v.activeFilters");
        let filterIds = cmp.get("v.activeFiltersIds");

        function filterTable(item){

            let filtersMet = 0;

            for(var fid in filterIds){
                for(var cell in item.cells){
                    if(filters[filterIds[fid]].field === item.cells[cell].apiName){
                        if(filters[filterIds[fid]].type === 'REFERENCE'){
                            if(item.cells[cell].referenceField.toLowerCase().includes(filters[filterIds[fid]].filterText.toLowerCase())){
                                filtersMet += 1;
                            }
                        } else if(filters[filterIds[fid]].type === 'CURRENCY' || filters[filterIds[fid]].type === 'PERCENT' || filters[filterIds[fid]].type === 'DOUBLE' || filters[filterIds[fid]].type === 'INTEGER'){
                            var comparator = filters[filterIds[fid]].filterComparator;
                            if(comparator === 'equal'){
                                if(parseFloat(item.cells[cell].value) === parseFloat(filters[filterIds[fid]].filterText)){
                                    filtersMet += 1;
                                }
                            } else if(comparator === 'gt'){
                                if(parseFloat(item.cells[cell].value) > parseFloat(filters[filterIds[fid]].filterText)){
                                    filtersMet += 1;
                                }
                            } else if(comparator === 'lt'){
                                if(parseFloat(item.cells[cell].value) < parseFloat(filters[filterIds[fid]].filterText)){
                                    filtersMet += 1;
                                }
                            } else if(comparator === 'goet'){
                                if(parseFloat(item.cells[cell].value) >= parseFloat(filters[filterIds[fid]].filterText)){
                                    filtersMet += 1;
                                }
                            } else if(comparator === 'loet'){
                                if(parseFloat(item.cells[cell].value) <= parseFloat(filters[filterIds[fid]].filterText)){
                                    filtersMet += 1;
                                }
                            }
                        } else if(filters[filterIds[fid]].type === 'DATE' || filters[filterIds[fid]].type === 'DATETIME'){
                            var d = new Date(item.cells[cell].value);
                            var dString = d.getFullYear() + "-" + ('0'+(d.getMonth() + 1)).slice(-2) + "-" + ('0'+d.getDate()).slice(-2);
                            var dd = new Date(dString);
                            if(filters[filterIds[fid]].after && filters[filterIds[fid]].before){
                                var before = new Date(filters[filterIds[fid]].before);
                                var after = new Date(filters[filterIds[fid]].after);
                                if(dd > after && dd < before){
                                    filtersMet += 1;
                                }
                            } else if(filters[filterIds[fid]].after){
                                var after = new Date(filters[filterIds[fid]].after);
                                if(dd > after){
                                    filtersMet += 1;
                                }
                            } else if(filters[filterIds[fid]].before){
                                var before = new Date(filters[filterIds[fid]].before);
                                if(dd < before){
                                    filtersMet += 1;
                                }
                            }
                        } else{
                            if(item.cells[cell].value.toLowerCase().includes(filters[filterIds[fid]].filterText.toLowerCase())){
                                filtersMet += 1;
                            }
                        }
                    }
                }
            }

            if(filtersMet === filterIds.length){
                return item;
            }
        }

        this.sortTable(cmp, helpTable.filter(filterTable));
    },

    splitFields : function(cmp){
        cmp.set("v.fieldsList", cmp.get("v.fields").split(','));
    },

    splitColWidths : function(cmp){
        if(cmp.get("v.columnWidths")){
            cmp.set("v.columnWidthsList", cmp.get("v.columnWidths").split(','));
        }
    },
})