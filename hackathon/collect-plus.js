
if (!window.sdg) {
    sdg = {};
}

if (!window.sdg.collectplus) {
    sdg.collectplus = {};
}

$sd(function () {
    
    sdg.collectplus.map_init = function () {
    
        var map,
            mapOptions,
            mapElementId = "map_canvas",
            infowindow = null,
            data = sdg.collectPlus.points || {},
            maxLoops = data.payPointArray.length,
            maxResults = data.payPointArray.length,
            markers = [],
            funcs = {},
            bounds = new google.maps.LatLngBounds(),
            $collectPlusSelectForm = $sd('#collectPlusSelectForm'),
            radioButtons = $sd('#nearestLocationsList').find('.radio'),
            selectedIndex = radioButtons.index(radioButtons.filter(':checked'));
        
        /* set map options */
        mapOptions = { mapTypeId: google.maps.MapTypeId.ROADMAP };

        /* initialise map */
        map = new google.maps.Map(document.getElementById(mapElementId), mapOptions);    

        /* point pop up info window initial content */
        infowindow = new google.maps.InfoWindow({
            content: "Loading..."
        });

        if (maxLoops < maxResults) {
            maxResults = maxLoops;
        }

        /* add points to the map */
        if (maxLoops != 0){
            for (var i = 0; i < maxResults; i++) {

                funcs[i] = (function(index) {
                    return function() {
                    
                        var point = data.payPointArray[index];
                    
                        addPointToMap(index, point.gridX, point.gridY, point.siteName, point.letter);
                    }
                })(i);
            }
            for (var j = 0; j < maxResults; j++) {
                funcs[j]();
            }
        }
        
        /* Fit these bounds to the map */
        map.setCenter(bounds.getCenter());
        map.fitBounds(bounds);
        
        
        function addPointToMap(index, gridX, gridY, siteName, letter) {
        
            var osgb,
                wgs84,
                image,
                shadow,
                marker;
        
            /* create a osgb coordinate */
            osgb = new GT_OSGB();
            osgb.setGridCoordinates(gridX, gridY);

            /* convert to a wgs84 coordinate */
            wgs84 = osgb.getWGS84();
            
            /* set image including icon letter */
            image = new google.maps.MarkerImage(
                '//www.google.com/mapfiles/marker'+ letter + '.png',
                new google.maps.Size(32, 32),   /* size */
                new google.maps.Point(0,0),     /* origin */
                new google.maps.Point(16, 32)   /* anchor */
            );

            /* set shadow */
            shadow = new google.maps.MarkerImage(
                '//maps.google.com/mapfiles/ms/micons/msmarker.shadow.png',
                new google.maps.Size(59, 32),   /* size */
                new google.maps.Point(0,0),     /* origin */
                new google.maps.Point(20, 32)   /* anchor */
            );

            /* create and add teh marker to the map */
            marker = new google.maps.Marker({
                  position: new google.maps.LatLng(wgs84.latitude, wgs84.longitude),
                  map: map,
                  title: letter + ': ' + siteName,
                  icon: image,
                  id: index,
                  shadow: shadow,
                  html: $sd('#pointItem' + index).find('.moreInfoContainer').html()
            });
            
            /* add marker to markers for later use if necessary */
            markers.push(marker);

            /* open info window on click of marker */
            google.maps.event.addListener(marker, 'click', function (target) {

                var scrollToHeight = 0,
                    pointIndex = this.id,
                    $pointItem = $sd('#pointItem' + pointIndex),
                    scrollDiv = document.getElementById("nearestLocationsList");

                /* set content of window and open */
                infowindow.setContent(this.html);
                infowindow.open(map, this);

                /* if clicking in the map and not from the list */
                if (target !== 'radio') {

                    /* check appropriate radio button */
                    $pointItem.find('.radio').attr('checked', true);

                    /* add the heights of the preceeding li's to calculate offset */
                    for(var i=0; i < pointIndex; i++) {
                        scrollToHeight += $sd('#pointItem' + i).outerHeight();
                    }

                    /* scroll to offset */
                    scrollDiv.scrollTop = scrollToHeight;
                
                }

            });

            /* extend the bounds to include the new marker*/
            bounds.extend(marker.position);

            /* open info window on click of external view more info link */
            $sd('#pointItem' + index).find('.viewMoreInfo').on('click', function(){
                google.maps.event.trigger(marker, 'click');
                return false;
            });
            
            /* on click of radio button deslect all others, select this one and animate the associated marker */
            $sd('#pointItem' + index).find('.radio').on('click', function(){
            
                var $this = $sd(this)
            
                $this.closest('#nearestLocations').removeClass('error');
                $this.closest('ul').find('li').removeClass('selected');
                $this.closest('li').addClass('selected');
                google.maps.event.trigger(marker, 'click', 'radio');
                marker.setAnimation(google.maps.Animation.BOUNCE);
                setTimeout(function(){ marker.setAnimation(null); }, 750);
                
            });

        }

        /* on page load (return to page), if a point has previously been selected, click the relevant marker to select it on the map and scroll teh list to it */
        if (selectedIndex !== -1) {
        
            google.maps.event.trigger(markers[selectedIndex], 'click');
            
        }

    };

});