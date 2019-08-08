/**
 * Created by takei on 18.6.2018.
 */
({
    calculatePageButtons : function(cmp){
        var pages = cmp.get("v.numOfPages");
        var currentPage = cmp.get("v.currentPage");
        var pageButtons = [];
        if(currentPage <= 3){
            for(var i = 0; i < 5; i++){
                if((i+1)<=pages){
                    pageButtons.push(i+1);
                }
            }
        } else{
            if(currentPage === 4 && currentPage === pages){
                pageButtons.push(currentPage-3);
            }else if(currentPage === pages){
                pageButtons.push(currentPage-4);
                pageButtons.push(currentPage-3);
            }else if((currentPage+1)===pages){
                pageButtons.push(currentPage-3);
            }

            pageButtons.push(currentPage-2);
            pageButtons.push(currentPage-1);
            pageButtons.push(currentPage);

            if((currentPage+1)<=pages){
                pageButtons.push(currentPage+1);
            }
            if((currentPage+2)<=pages){
                pageButtons.push(currentPage+2);
            }
        }
        cmp.set("v.pageButtons", pageButtons);
    },
})