$(document).ready(function () {

    //Zoombox pour les images
    $('#images a.zoombox').zoombox({
        theme: 'portfolio'
    });

    var realScroll = false;
    var cvScroll = false;

    //JSON -> vidéos
    $.ajax({
        url: '/fr/playlists',
        data: { check: 1 },
        type: 'POST',
        success: function (data) {
            var $real = $('#real .inside');

            $.each(data, function () {
                if (!this.activated) {
                    return true;
                }
                var id = this.nom_playlist.toLowerCase();
                var $ul = $('<ul id="' + id + '"></ul>');
                var playlist = this.code;

                switch (this.hebergeur) {
                    case 'youtube':
                        console.log(playlist);
                        $.getJSON("https://www.googleapis.com/youtube/v3/playlistItems?playlistId=" + playlist + "&part=snippet&key=AIzaSyCfZVLw2qQQsMj9UU4wg6ebnOEiduMH4t0", function (data) {
                            $.each(data.items, function () {
                                var $a = $('<a class="zoombox overimg" href="https://www.youtube.com/watch?v=' + this.snippet.resourceId.videoId + '" title="' + this.snippet.description + '"><p>' + this.snippet.title + '</p></a>').zoombox({
                                    //Zoombox
                                    theme: 'portfolio',
                                    gallery: false,
                                    autoplay: true
                                });
                                var $img = $('<img src="' + this.snippet.thumbnails.medium.url + '" height="180" width="320" alt="' + this.snippet.title + '" />');
                                var $li = $('<li class="video"></li>');
                                $li.append($img).append($a);
                                $ul.append($li);
                            });
                        });
                        break;

                    case 'daily':
                        $.getJSON("https://api.dailymotion.com/playlist/" + playlist + "/videos?fields=id,title,thumbnail_120_url", function (data) {
                            $.each(data.list, function () {
                                var $a = $('<a class="zoombox overimg" href="https://www.dailymotion.com/video/' + this.id + '" title="' + this.title + '"><p>' + this.title + '</p></a>').zoombox({
                                    //Zoombox
                                    theme: 'portfolio',
                                    gallery: false,
                                    autoplay: true
                                });
                                var $img = $('<img src="../images/' + this.title.$t.toLowerCase().replace(/é/g, 'e').replace(/ /g, '-') + '.jpg" alt="' + this.title + '" width="275" height="120" />');
                                var $li = $('<li class="video"></li>');
                                $li.append($img).append($a);
                                $ul.append($li);
                            });
                        });
                        break;

                    case 'vimeo':
                        $.getJSON("http://vimeo.com/api/v2/album/" + playlist + "/videos.json", function (data) {
                            $.each(data, function () {
                                var $a = $('<a class="zoombox overimg" href="http://vimeo.com/' + this.id + '" title="' + this.title + '"><p>' + this.title + '</p></a>').zoombox({
                                    //Zoombox
                                    theme: 'portfolio',
                                    gallery: false,
                                    autoplay: true
                                });
                                var $img = $('<img src="../images/' + this.title.$t.toLowerCase().replace(/é/g, 'e').replace(/ /g, '-') + '.jpg" alt="' + this.title + '" width="200" height="150" />');
                                var $li = $('<li class="video"></li>');
                                $li.append($img).append($a);
                                $ul.append($li);
                            });
                        });
                        break;
                }
                var $label = $('<label>' + this.nom_playlist + '</label>');
                $real.append($label).append($ul);
            });
            $(window).scroll(theScroll);
            $('a[href^="#"]').click(scrollFluide);
        },
        error: function () {
            $(window).scroll(theScroll);
            $('a[href^="#"]').click(scrollFluide);
        }
    });

    //Parallaxe
    $('#accueil').parallax("center", 0, 0.1, false);
    $('#competences').parallax("center", 1728, 0.1, false);
    $('#real').parallax("center", 3700, 0.1, true);
    $('#cv').parallax("center", 3900, 0.05, false);
    $('#contact').parallax("center", 5000, 0.1, false);

    //Opérations en fonction du scroll
    var theScroll = function () {
        var accueil = $("#accueil").offset().top; // 0
        var competences = $("#competences").offset().top;
        var real = $("#real").offset().top;
        var cv = $("#cv").offset().top;
        var contact = $("#contact").offset().top;

        var topDist = $(this).scrollTop();

        //Classe 'active'
        if (topDist < competences) {
            $("#menu li").removeClass("active");
            $("#mn_accueil").addClass("active");
        }
        else if (topDist < real) {
            $("#menu li").removeClass("active");
            $("#mn_competences").addClass("active");
        }
        else if (topDist < cv) {
            $("#menu li").removeClass("active");
            $("#mn_real").addClass("active");
        }
        else if (topDist < contact) {
            $("#menu li").removeClass("active");
            $("#mn_cv").addClass("active");
        }
        else {
            $("#menu li").removeClass("active");
            $("#mn_contact").addClass("active");
        }

        //Transformations
        //Animation Bienvenue
        if (topDist < competences / 2) {
            var nb = parseInt(topDist * 75 / (competences / 2));
            var img = nb < 10 ? '0000' + nb : '000' + nb;
            $('.bienvenue').hide();
            $('.start_' + img).show();
        } else {
            $('.bienvenue').hide();
            $('.start_00075').show();
        }

        //Fond Réal
        /*if (topDist < 2230) {//1740
            var opacity1 = (topDist - 1740) * 7 / 4900;
            $("#real .inside").css('background-color', 'rgba(255,255,255,' + opacity1 + ')');
        } else {
            $("#real .inside").css('background-color', 'rgba(255,255,255,0.7)');
        }*/

        //Taille images et vidéos
        var heightReal = $("#real").height() * 3 / 4;
        if (topDist < real && !realScroll) {
            $('li.video, #images li').css('transform', 'scale(0)');
        }
        else if (topDist < real + heightReal && !realScroll) {
            $('li.video, #images li').css('transform', 'scale(' + ((topDist - real) / heightReal) + ')');
        }
        else {
            $('li.video, #images li').css('transform', 'scale(1)');
            realScroll = true;
        }

        //Opacité CV
        if (topDist < 3690 && !cvScroll) {
            $("#cv span:eq(1)").css('opacity', (topDist - 3350) / 340);
        }
        else {
            $("#cv span:eq(1)").css('opacity', 1);
            cvScroll = true;
        }

        //Apparition Formulaire
        if (topDist < 3980) {
            $("p:has(#email)").css('margin-left', 3 * (topDist - 3980));
        } else {
            $("p:has(#email)").css('margin-left', 0);
        }
        if (topDist < 4060) {
            $("p:has(#objet)").css('margin-left', 3 * (topDist - 4060));
        } else {
            $("p:has(#objet)").css('margin-left', 0);
        }
        if (topDist < 4075) {
            $("p:has(#message)").css('margin-left', 3 * (topDist - 4075));
        } else {
            $("p:has(#message)").css('margin-left', 0);
        }
        if (topDist < 4090) {
            $("p:has(#verif)").css('margin-left', 3 * (topDist - 4090));
            var opacity2 = 0.7 * (topDist - 3690) / 400;
            $("#contact .inside").css('background-color', 'rgba(255,255,255,' + opacity2 + ')');
            var button = (topDist - 3890) / 200;
            $("#envoyer").css('transform', 'scale(' + button + ')');
        } else {
            $("p:has(#verif)").css('margin-left', 0);
            $("#envoyer").css('transform', 'scale(1)');
            $("#contact .inside").css('background-color', 'rgba(255,255,255,0.7)');
        }
    };

    var scrollFluide = function () {
        var the_id = $(this).attr("href");
        $('html, body').animate({
            scrollTop: $(the_id).offset().top + $('#menu').parent().height()
        }, 'slow');
        return false;
    };

    //Vérif
    var a = parseInt(Math.random() * 10 + 1);
    var b = parseInt(Math.random() * 10 + 1);
    $('label[for="verif"]').text('Combien font ' + a + ' + ' + b + ' ?');

    //Envoi des données de contact en AJAX
    var $send = $('#envoyer');
    $send.click(function (e) {
        e.preventDefault();
        var email = $("#email").val(),
            objet = $("#objet").val(),
            message = $("#message").val(),
            verif = parseInt($("#verif").val()),
            $result = $("#result");
        if (email && objet && message && verif === (a + b)) {
            $.ajax({
                url: '../manage.php?mode=mail',
                data: {
                    from: email,
                    object: objet,
                    message: message
                },
                type: 'POST',
                success: function (data) {
                    switch (data) {
                        case '0':
                            $result.text("Désolé, une erreur s'est produite. Veuillez recommencer.");
                            break;
                        case 'mail':
                            $result.text("Votre adresse mail n'est pas valide.");
                            break;
                        default:
                            $result.text('Merci. Votre mail a bien été envoyé.');
                            $send.remove();
                            break;
                    }
                },
                error: function () {
                    $result.text("Désolé, une erreur s'est produite. Veuillez recommencer.");
                }
            });
        } else {
            $result.text("Désolé, vous n'avez pas rempli tous les champs, ou la vérification est incorrecte.");
        }
    });
});