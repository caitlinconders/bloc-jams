   var buildCollectionItemTemplate = function() {
       var template =

       return $(template);
   };


   $(window).load(function() {
       var $collectionContainer = $('.album-covers');

       $collectionContainer.empty();

       for (var i = 0; i < 12; i++) {
           var $newThumbnail = buildCollectionItemTemplate();
           $collectionContainer.append($newThumbnail);
       }
   });
