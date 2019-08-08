/**
 * Created by takei on 18.6.2018.
 */
({
    onInit : function(cmp, evt, hel){
        if(cmp.get("v.cell").fieldType === 'DATE'){
            var d = new Date(cmp.get("v.cell").value);
            cmp.set("v.cell.value", d);
        }else if(cmp.get("v.cell").fieldType === 'DATETIME'){
            try{
                var d = new Date(cmp.get("v.cell").value.replace(/-/g,"/"));
                cmp.set("v.cell.value", d);
            } catch(a){
            }
        }
    },
    nav : function(cmp, evt, helper){
        var urlEvent = $A.get("e.force:navigateToURL");
        var url;

        if(cmp.get("v.cell.referenceUrlPrefix") === ''){
            url = cmp.get("v.urlPrefix")+cmp.get("v.cell.recordId");
        } else{
            url = cmp.get("v.cell.referenceUrlPrefix")+cmp.get("v.cell.value");
        }

        if(cmp.get("v.environment") === 'Lightning Experience') url += '/view';

        urlEvent.setParams({
          "url": url
        });
        urlEvent.fire();
    },
})