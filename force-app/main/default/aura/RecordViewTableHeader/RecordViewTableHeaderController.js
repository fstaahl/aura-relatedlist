/**
 * Created by takei on 15.6.2018.
 */
({
    onInit : function(cmp, evt, hel){
        hel.setLabel(cmp);
        cmp.set("v.after", null);
        cmp.set("v.before", null);
    },
    sortTable : function(cmp, evt, hel){
        cmp.set("v.sortDESC", !cmp.get("v.sortDESC"));
        cmp.set("v.sortIndex", cmp.get("v.index"));
    },
    doFilter : function(cmp, evt, hel){
        hel.doFilter(cmp);
    },
    showHideDates : function(cmp, evt, hel){
        cmp.set("v.showDates", !cmp.get("v.showDates"));
    },
    changeComparator : function(cmp, evt, hel){
        var comp = cmp.get("v.filterComparator");
        if(comp === 'equal') cmp.set("v.filterComparator", 'gt');
        else if(comp === 'gt') cmp.set("v.filterComparator", 'lt');
        else if(comp === 'lt') cmp.set("v.filterComparator", 'goet');
        else if(comp === 'goet') cmp.set("v.filterComparator", 'loet');
        else if(comp === 'loet') cmp.set("v.filterComparator", 'equal');
        if(cmp.get("v.filterText") !== ''){
            hel.doFilter(cmp);
        }
    },
    clearDates : function(cmp, evt, hel){
        cmp.set("v.after", null);
        cmp.set("v.before", null);
    },
})