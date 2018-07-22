function readImg(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#apercu-' + input.name).attr('src', e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
    }
}

$(document).ready(function () {
    //Scroll fluide sur la page
    $('a[href^="#"]').click(function () {
        var the_id = $(this).attr("href");
        $('html, body').animate({
            scrollTop: $(the_id).offset().top
        }, 'slow');
        return false;
    });

    //Champ pourcent
    $('input[name="pourcent"]').after('<output></output>');
    $('input[name="pourcent"]').live('change', function () {
        var valof = $(this).val();
        $('output').text(valof);
    });

    //Récupérer les infos d'une compétence en AJAX
    var $competence = $('#competence');
    $competence.find('select[name="competence"]').change(function () {
        var id = $(this).val();
        if (id === 'add') {
            $competence.find(':text').val('');
            $competence.find('select[name="categorie"] option[value="add"]').prop('selected', true);
            $competence.find('input[name="pourcent"]').val(0);
            $competence.find(':radio[value="0"]').prop('checked', true);
            $('#apercu-logo').removeAttr('src');
            $(':file').show();
            $competence.find('button i').removeClass('icon-edit').addClass('icon-plus');
        } else {
            $competence.find('button i').removeClass('icon-plus').addClass('icon-edit');
            $(':file').hide();
            $.ajax({
                url: '../manage.php?mode=getCompetence',
                data: { id: id },
                type: 'POST',
                success: function (data) {
                    var $infos = $.parseJSON(data);
                    $competence.find('input[name="nom"]').val($infos.nom_competence);
                    $competence.find('select[name="categorie"] option[value="' + $infos.categorie_francais + '"]').prop('selected', true);
                    $competence.find('input[name="catfr"]').val($infos.categorie_francais);
                    $competence.find('input[name="caten"]').val($infos.categorie_anglais);
                    $competence.find('input[name="pourcent"]').val($infos.pourcent);
                    $('#apercu-logo').attr('src', '../logos/' + $infos.lien);
                    $competence.find(':radio[value="' + $infos.activated + '"]').prop('checked', true);
                }
            });
        }
    });
    //Récupérer une catégorie en AJAX
    $competence.find('select[name="categorie"]').change(function () {
        var nom = $(this).val();
        if (nom === 'add') {
            $competence.find('input[name="catfr"],input[name="caten"]').val('');
        } else {
            $.ajax({
                url: '../manage.php?mode=getCategorie',
                data: { nom: nom },
                type: 'POST',
                success: function (data) {
                    var $infos = $.parseJSON(data);
                    $competence.find('input[name="catfr"]').val($infos.categorie_francais);
                    $competence.find('input[name="caten"]').val($infos.categorie_anglais);
                }
            });
        }
    });

    //Récupérer les infos d'une playlist en AJAX
    var $playlist = $('#playlist');
    $playlist.find('select[name="playlist"]').change(function () {
        var id = $(this).val();
        if (id === 'add') {
            $playlist.find(':text').val('');
            $playlist.find(':radio[value="0"]').prop('checked', true);
            $playlist.find('button i').removeClass('icon-edit').addClass('icon-plus');
        } else {
            $playlist.find('button i').removeClass('icon-plus').addClass('icon-edit');
            $.ajax({
                url: '../manage.php?mode=getPlaylist',
                data: { id: id },
                type: 'POST',
                success: function (data) {
                    var $infos = $.parseJSON(data);
                    $playlist.find('input[name="nom"]').val($infos.nom_playlist);
                    $playlist.find('select[name="hebergeur"] option[value="' + $infos.hebergeur + '"]').prop('selected', true);
                    $playlist.find('input[name="code"]').val($infos.code);
                    $playlist.find(':radio[value="' + $infos.activated + '"]').prop('checked', true);
                }
            });
        }
    });

    //Récupérer les infos d'une image en AJAX
    var $image = $('#image');
    $image.find('select[name="image"]').change(function () {
        var id = $(this).val();
        if (id === 'add') {
            $image.find(':text').val('');
            $image.find(':radio[value="0"]').prop('checked', true);
            $('#apercu-img').removeAttr('src');
            $image.find(':file').show();
            $image.find('button i').removeClass('icon-edit').addClass('icon-plus');
        } else {
            $image.find('button i').removeClass('icon-plus').addClass('icon-edit');
            $image.find(':file').hide();
            $.ajax({
                url: '../manage.php?mode=getImage',
                data: { id: id },
                type: 'POST',
                success: function (data) {
                    var $infos = $.parseJSON(data);
                    $image.find('input[name="titre"]').val($infos.titre);
                    $('#apercu-img').attr('src', '../images/' + $infos.lien);
                    $image.find(':radio[value="' + $infos.activated + '"]').prop('checked', true);
                }
            });
        }
    });

    //Récupérer les infos d'un partenaire en AJAX
    var $partner = $("#partner");
    $partner.find('select[name="partner"]').change(function () {
        var id = $(this).val();
        if (id === 'add') {
            $partner.find(':text').val('');
            $partner.find('button i').removeClass('icon-edit').addClass('icon-plus');
        } else {
            $partner.find('button i').removeClass('icon-plus').addClass('icon-edit');
            $.ajax({
                url: '../manage.php?mode=getPartner',
                data: { id: id },
                type: 'POST',
                success: function (data) {
                    var $infos = $.parseJSON(data);
                    $partner.find('input[name="nom"]').val($infos.nom);
                    $partner.find('input[name="prenom"]').val($infos.prenom);
                    $partner.find('input[name="url"]').val($infos.url);
                }
            });
        }
    });

    //Datepicker
    $('.datepicker').datepicker({
        dateFormat: "dd/mm/yy",
        firstDay: 1,
        dayNames: ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
        dayNamesShort: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
        dayNamesMin: ["Di", "Lu", "Ma", "Me", "Je", "Ve", "Sa"],
        monthNames: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
        monthNamesShort: ["Jan", "Fév", "Mar", "Avr", "Mai", "Jui", "Jui", "Aoû", "Sep", "Oct", "Nov", "Déc"]
    });

    //Récupérer les infos d'un jeu en AJAX
    var $game = $("#game");
    $("#reset-game").click(function (e) {
        e.preventDefault();
        $game.find(':file').val('');
        $('#apercu-game').removeAttr('src');
    });

    $game.find('select[name="game"]').change(function () {
        $game.find(':checkbox').prop('checked', false);

        var id = $(this).val();
        if (id === 'add') {
            $game.find(':text').val('');
            $game.find('textarea').html('');
            $('#apercu-game').removeAttr('src');
            $game.find('button i').removeClass('icon-edit').addClass('icon-plus');
        } else {
            $game.find('button i').removeClass('icon-plus').addClass('icon-edit');
            $.ajax({
                url: '../manage.php?mode=getGame',
                data: { id: id },
                type: 'POST',
                success: function (data) {
                    var $infos = $.parseJSON(data);
                    $game.find('input[name="nom"]').val($infos.nom);
                    $("#apercu-game").attr('src', '../jeux/' + $infos.image);
                    $game.find('textarea[name="french_description"]').html($infos.french_description);
                    $game.find('textarea[name="english_description"]').html($infos.english_description);
                    $game.find('input[name="date_debut"]').val($infos.date_debut);
                    $game.find('input[name="date_fin"]').val($infos.date_fin);
                    $game.find('input[name="lien"]').val($infos.lien);

                    $.ajax({
                        url: '../manage.php?mode=getGamePartners',
                        data: { id: id },
                        type: 'POST',
                        success: function (data2) {
                            var infos2 = $.parseJSON(data2);
                            $.each(infos2, function () {
                                $game.find(':checkbox[name="partner[' + this.id_partner + ']"]').prop('checked', true);
                                $game.find('select[name="fonction[' + this.id_partner + ']"] option[value="' + this.fonction + '"]').prop('selected', true);
                            });
                        }
                    });
                }
            });
        }
    });
});