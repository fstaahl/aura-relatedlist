/**
 * Created by takei on 5.7.2018.
 */
({
    openDetails : function(cmp, evt, hel){
        if(cmp.get("v.detailsOpen") === false){
            hel.createComponent(cmp);
        } else{
            hel.deleteComponent(cmp);
        }
    },
    download : function(cmp, evt, helper){
        var downloadUrl = '';
        if(cmp.get("v.sobj") === 'Attachment'){
            downloadUrl = '/servlet/servlet.FileDownload?file=';
        } else{
            downloadUrl = '/sfc/servlet.shepherd/version/download/';
        }
        if(cmp.get("v.environment") === 'Community'){
            var pagePrefix = $A.get("$Site.siteUrlPrefix").slice(0,-2);
            window.location.replace(pagePrefix+downloadUrl+cmp.get("v.row.recordId"));
        } else{
            window.location = downloadUrl+cmp.get("v.row.recordId");
        }
    },
})