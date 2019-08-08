/**
 * Created by takei on 15.6.2018.
 */
({
    setLabel : function(cmp){
        var headers = cmp.get("v.headers");
        for(var header in headers){
            if(headers[header].apiName === cmp.get("v.field")){
                cmp.set("v.header",headers[header]);
            }
        }
    },

    doFilter : function(cmp){
        let cmpEvt = cmp.getEvent("RecordViewTableFilterEvent");
        cmpEvt.setParams({
            "gid" : cmp.getGlobalId(),
            "type" : cmp.get("v.header").type,
            "field" : cmp.get("v.field"),
            "filterText" : cmp.get("v.filterText"),
            "filterComparator" : cmp.get("v.filterComparator"),
            "after" : cmp.get("v.after"),
            "before" : cmp.get("v.before")
        });
        cmpEvt.fire();
    },
})