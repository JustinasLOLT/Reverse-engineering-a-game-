/*
// initiall from: http://jsfiddle.net/rfBuL/191/

Copyright 2011 : Simone Gianni <simoneg@apache.org>

-- update by tcuttrissweb --
   adds in title besdie thumbs in carousel.
   adjusted css from the original to make room for this
     allows resizing
       to adjust size of the player adjust the css for:
       .youtube iframe.player width / height accordingly.

-- update by oomlaut --
   isolated function in its own scope, preventing $ collisions
   converted to jQuery plugin pattern.
      allows for chainability
   added link to YouTube Channel (optional)
   refactored callback functionality
   adjusted css:
      visual representation of currently viewing item

Released under The Apache License 2.0
http://www.apache.org/licenses/LICENSE-2.0
*/
(function($) {
    $(document).ready(function() {
        $.fn.extend({
            youTubeChannel: function(usrArgsObj, callback) {
                var create = {
                    feed: function() {
                        this.player(settings.videos[settings.loadItem], settings.autoplay);
                        this.carousel();
                        if ($.isFunction(callback)) callback();
                        return true;
                        },
                    carousel: function() {
                        var scope = this;
                        var $car = $('ul.carousel', settings.container);
                        if ($car.length === 0) {
                            $car = $('<ul>', {
                                "class": "playlist"
                            });
                            settings.container.append($car);
                        }
                        $.each(settings.videos, function(i, video) {
                            if (i < settings.showMax) {
                                $car.append(create.thumbnail(video, i == settings.loadItem));
                            }
                        });
                        return $car;
                    },
                    thumbnail: function(video, selected) {
                        var scope = this;
                        var imgurl = video.thumbnails[0].url;
                        var img = $('img[src="' + imgurl + '"]');
                        var desc;
                        var container;
                        if (img.length !== 0) return;
                        var item = $('<li>', {
                            "class": "item",
                            click: function() {
                                var $this = $(this);
                                if (!$this.hasClass('nowPlaying')) {
                                    $(this).addClass('nowPlaying').siblings('.nowPlaying').removeClass('nowPlaying');
                                    scope.player(video, true);
                                }
                            }
                        });
                        if (selected) item.addClass('nowPlaying');
                        img = $('<img>', {
                            "class": "youtube-thumbnail",
                            src: imgurl,
                            title: video.title
                        }).appendTo(item);
                        desc = $('<p>', {
                            "class": "description",
                            text: video.title
                        }).appendTo(item);
                        return item;
                    },
                    player: function(video, autoplay) {
                        var scope = this;
                        var opts = settings;
                        if (arguments.length > 1 && autoplay) {
                            opts.playopts.autoplay = 1;
                        }

                        var src = 'http://www.youtube.com/embed/' + video.id;
                        if (opts.playopts) {
                            src += '?';
                            $.each(opts.playopts, function(i, v) {
                                src += i + '=' + v + '&';
                            })
                            src += '_a=b';
                        }

                        var ifr = $('iframe', settings.container);
                        if (ifr.length === 0) {
                            ifr = $('<iframe>', {
                                "class": "player",
                                scrolling: "no",
                            }).appendTo(settings.container);
                        }
                        ifr.attr('src', src);
                    }
                };

                var defaults = {
                    autoplay: false,
                    user: null,
                    container: null,
                    videos: [],
                    loadItem: 0,
                    showMax: 200,
                    channelText: null,
                    playopts: {
                        autoplay: 0,        // don't autoplay video
                        autohide: 1,        // autohide controls if mouse isn't in window
                        fs: 1,              // display fullscreen button
                        showinfo: 0,        // don't show uploader and video title in video
                        cc_load_policy: 0,  // disable autoload of closed captions (since player is so small)
                        modestbranding: 1,  // removes some youtube branding
                        rel: 0              // disable related videos
                    }
                };
                var settings = $.extend(true, {}, defaults, usrArgsObj);

                return this.each(function(i, v) {
                    settings.container = $(this).addClass('youtube-channel');
                    $.getJSON('http://gdata.youtube.com/feeds/api/playlists/' + settings.playlist + '?v=2&alt=json&callback=?', null, function(data) {
                        $.each(data.feed.entry, function(i, entry) {
                            settings.videos.push({
                                title: entry.title.$t,
                                id: entry.link[2].href.match('[^=]*$'),
                                link: entry.link[0],
                                thumbnails: entry.media$group.media$thumbnail
                            });
                        });
                        create.feed();
                    });
                });
            }
        }); //end plugin
    });
})(jQuery);
