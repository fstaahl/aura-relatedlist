/**
 * Created by takei on 14.6.2018.
 */
({
    onInit : function(cmp, evt, hel){
        hel.doInit(cmp);
        hel.splitFields(cmp);
        hel.splitColWidths(cmp);
    },

    changePage : function(cmp, evt, hel){
        cmp.set("v.page", cmp.get("v.pagedData")[cmp.get("v.currentPage")-1]);
    },

    sortTable : function(cmp, evt, hel){
        hel.doFilter(cmp);
    },
    onFilter : function(cmp ,evt, hel){
        let filters = cmp.get("v.activeFilters");
        let filterIds = cmp.get("v.activeFiltersIds");
        if(evt.getParam("filterText") || ((evt.getParam("type")==='DATE'||evt.getParam("type")==='DATETIME') && (evt.getParam("before") || evt.getParam("after")))){
            filters[evt.getParam("gid")] =
            {
                "type" : evt.getParam("type"),
                "field" : evt.getParam("field"),
                "filterText" : evt.getParam("filterText"),
                "filterComparator" : evt.getParam("filterComparator"),
                "after" : evt.getParam("after"),
                "before" : evt.getParam("before")
            };
            let exists = false;
            for(var gid in filterIds){
                if(filterIds[gid] === evt.getParam("gid")) exists = true;
            }
            if(!exists){
                filterIds.push(evt.getParam("gid"));
            }
        } else{
            delete filters[evt.getParam("gid")];

            let idToRemove;
            for(var gid in filterIds){
                if(filterIds[gid] === evt.getParam("gid")) idToRemove = gid;
            }
            filterIds.splice(idToRemove, 1);
        }
        cmp.set("v.activeFilters", filters);
        cmp.set("v.activeFiltersIds", filterIds);
        hel.doFilter(cmp);
    },
})