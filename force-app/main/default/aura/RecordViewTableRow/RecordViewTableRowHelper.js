/**
 * Created by takei on 5.7.2018.
 */
({
    createComponent : function(cmp){
        $A.createComponent(
            'c:'+cmp.get("v.customComponentName"),
            {
                row : cmp.get("v.row")
            },
            function(newCmp, status, errorMessage){
                if (status === "SUCCESS") {
                    var body = cmp.get("v.details");
                    if(body.length>0){
                        var destroyCmp = body.shift();
                        destroyCmp.destroy();
                    }
                    body.push(newCmp);
                    cmp.set("v.details", body);
                    cmp.set("v.detailsOpen", true);
                } else if(state === 'ERROR'){
                    var errors = a.getError();
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
            }
        );
    },

    deleteComponent : function(cmp){
        var cmpContainer = cmp.get("v.details");
        var destroyCmp = cmpContainer.shift();
        if(!$A.util.isUndefinedOrNull(destroyCmp)){
            destroyCmp.destroy();
            cmp.set("v.details", cmpContainer);
            cmp.set("v.detailsOpen", false);
        }
    },
})