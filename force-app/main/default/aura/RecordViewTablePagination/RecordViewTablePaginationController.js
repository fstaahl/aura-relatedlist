/**
 * Created by takei on 15.6.2018.
 */
({
    onInit : function(cmp, evt, hel){
        hel.calculatePageButtons(cmp);
    },
    prev : function(cmp, evt, hel){
        cmp.set("v.currentPage", cmp.get("v.currentPage")-1);
        if(cmp.get("v.paginationType") === 'Numeric'){
            hel.calculatePageButtons(cmp);
        }
    },
    next : function(cmp, evt, hel){
        cmp.set("v.currentPage", cmp.get("v.currentPage")+1);
        if(cmp.get("v.paginationType") === 'Numeric'){
            hel.calculatePageButtons(cmp);
        }
    },
    changePage : function(cmp, evt, hel){
        var newPage = evt.getSource().get("v.label");
        if(newPage !== cmp.get("v.currentPage")){
            cmp.set("v.currentPage", newPage);
            hel.calculatePageButtons(cmp);
        }
    },
})