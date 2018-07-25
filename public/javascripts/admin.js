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
                url: '/back/competence/get',
                data: { id: id },
                type: 'POST',
                success: function (data) {
                    $.ajax({
                        url: '/back/categorie/get',
                        data: { id: data.id_categorie },
                        type: 'POST',
                        success: function (data2) {
                            $competence.find('input[name="nom"]').val(data.nom_competence);
                            $competence.find('select[name="categorie"] option[value="' + data.id_categorie + '"]').prop('selected', true);
                            $competence.find('input[name="catfr"]').val(data2.nom_francais);
                            $competence.find('input[name="caten"]').val(data2.nom_anglais);
                            $competence.find('input[name="pourcent"]').val(data.pourcent);
                            $('#apercu-logo').attr('src', '/images/competences/' + data.lien);
                            $competence.find(':radio[value="' + data.activated + '"]').prop('checked', true);
                        }
                    });
                }
            });
        }
    });
    //Récupérer une catégorie en AJAX
    $competence.find('select[name="categorie"]').change(function () {
        var id = $(this).val();
        if (id === 'add') {
            $competence.find('input[name="catfr"],input[name="caten"]').val('');
        } else {
            $.ajax({
                url: '/back/categorie/get',
                data: { id: id },
                type: 'POST',
                success: function (data) {
                    $competence.find('input[name="catfr"]').val(data.nom_francais);
                    $competence.find('input[name="caten"]').val(data.nom_anglais);
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
                url: '/back/playlist/get',
                data: { id: id },
                type: 'POST',
                success: function (data) {
                    $playlist.find('input[name="nom"]').val(data.nom_playlist);
                    $playlist.find('select[name="hebergeur"] option[value="' + data.hebergeur + '"]').prop('selected', true);
                    $playlist.find('input[name="code"]').val(data.code);
                    $playlist.find(':radio[value="' + data.activated + '"]').prop('checked', true);
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
                url: '/back/picture/get',
                data: { id: id },
                type: 'POST',
                success: function (data) {
                    $image.find('input[name="titre"]').val(data.titre);
                    $('#apercu-img').attr('src', '/images/pictures/' + data.lien);
                    $image.find(':radio[value="' + data.activated + '"]').prop('checked', true);
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
                url: '/back/partner/get',
                data: { id: id },
                type: 'POST',
                success: function (data) {
                    $partner.find('input[name="nom"]').val(data.nom);
                    $partner.find('input[name="prenom"]').val(data.prenom);
                    $partner.find('input[name="url"]').val(data.url);
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
                url: '/back/game/get',
                data: { id: id },
                type: 'POST',
                success: function (data) {
                    $game.find('input[name="nom"]').val(data.nom);
                    $("#apercu-game").attr('src', '/images/games/' + data.image);
                    $game.find('textarea[name="french_description"]').html(data.french_description);
                    $game.find('textarea[name="english_description"]').html(data.english_description);
                    $game.find('input[name="date_debut"]').val(data.date_debut);
                    $game.find('input[name="date_fin"]').val(data.date_fin);
                    $game.find('input[name="lien"]').val(data.lien);

                    $.ajax({
                        url: '/back/gamePartners/get',
                        data: { id: id },
                        type: 'POST',
                        success: function (data2) {
                            $.each(data2, function () {
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