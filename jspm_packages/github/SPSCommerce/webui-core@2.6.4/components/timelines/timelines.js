var $ = require('jquery');
var angular = require('angular');
var template = require('./timelines.html!text');

module.exports = angular
    .module('sps.components.timelines', [])
    .directive('spsTimelines', function() {

    return {
        scope: {
            timelines: '=spsTimelines',
            selected: '=selectedTimeline',
            sideBar: '=sideBar'
        },
        template: template,
        compile: function compile() {
            return {
                pre: function preLink() { //scope, iElement, iAttrs, controller

                },
                post: function postLink(scope, iElement) {
                    var todaysDate = new Date();

                    scope.$watch('selected.timeline', function(timeline){
                        if(timeline){

                            // this isn't a great way to do this, but for now:
                            if(!scope.sideBar) {
                                var $lineElement = $(iElement).find('.timeline-wrap');
                                var lineWidth = $lineElement.width();

                                // TODO: Use fancier math to space these out based on days between
                                timeline.commitLeft = lineWidth*0.25;
                                timeline.certLeft = lineWidth*0.5;
                                timeline.liveLeft = lineWidth*0.75;

                                var kickOffDate = new Date(Date.parse(timeline.kick_off_date.rfc_2822));
                                var certificationDate = new Date(Date.parse(timeline.cert_date.rfc_2822));
                                var commitmentDate = new Date(Date.parse(timeline.commit_date.rfc_2822));
                                var goLiveDate = new Date(Date.parse(timeline.live_date.rfc_2822));

                                if (todaysDate <= kickOffDate){
                                    timeline.todaysLeft = -6;

                                } else if(todaysDate < commitmentDate){
                                    timeline.todaysLeft = getTodaysLeft(kickOffDate, commitmentDate,
                                        $('#kick_off_date').position().left, timeline.commitLeft);

                                } else if(todaysDate < certificationDate){
                                    timeline.todaysLeft = getTodaysLeft(commitmentDate, certificationDate,
                                        timeline.commitLeft, timeline.certLeft);


                                } else if(todaysDate < goLiveDate){
                                    timeline.todaysLeft = getTodaysLeft(certificationDate, goLiveDate,
                                        timeline.certLeft, timeline.liveLeft);
                                } else {
                                    timeline.todaysLeft = lineWidth - 6;
                                }


                                // this is ugly, but I think it works alright
                                scope.selected.timeline.todaysMarginTop = 15;
                                if (((timeline.todaysLeft > timeline.commitLeft-20) &&
                                    (timeline.todaysLeft < timeline.certLeft-20)) ||
                                    (timeline.todaysLeft > timeline.liveLeft-20)){
                                    timeline.todaysMarginTop = -25;
                                }
                            }

                        }
                    });

                    function getTodaysLeft(lowDate, highDate, lowLeft, highLeft){
                        var numerator = daysBetween(lowDate, todaysDate),
                            denominator = daysBetween(lowDate, highDate),
                            quotient = numerator/denominator,
                            maxLeft = highLeft-lowLeft;

                        return lowLeft+(maxLeft*quotient);
                    }

                    function daysBetween(date1, date2) {

                        // The number of milliseconds in one day
                        var ONE_DAY = 1000 * 60 * 60 * 24;

                        // Convert both dates to milliseconds
                        var date1_ms = date1.getTime();
                        var date2_ms = date2.getTime();

                        // Calculate the difference in milliseconds
                        var difference_ms = Math.abs(date1_ms - date2_ms);

                        // Convert back to days and return
                        return Math.round(difference_ms/ONE_DAY);

                    }
                }
            };//return
        }
    };

});


