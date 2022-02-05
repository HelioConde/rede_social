$(document).ready(function () {
    if (localStorage.getItem('button-left') == null) {
        localStorage.setItem('button-left', '1')
    }
    if (localStorage.getItem('button-right') == null) {
        localStorage.setItem('button-right', '1')
    }
    if (localStorage.getItem('button-left') == 0) {
        $('#nav-left').hide(500);
        $('#buttonPRF2').show(500);
        $('#navCenter').animate({ left: '5%' }, 500)
    } else {
        $('#nav-left').show(500);
        $('#buttonPRF2').hide(500)
        $('#navCenter').animate({ left: '20%' }, 500)
    }
    if (localStorage.getItem('button-right') == 1) {
        $('#nav-right').show(500);
        $('#buttonAMG2').hide(500)
        $('#navCenter').animate({ right: '23%' }, 500)
    } else {
        $('#nav-right').hide(500)
        $('#buttonAMG2').show(500);
        $('#navCenter').animate({ right: '5%' }, 500)
    }
    if ($("#addAmigo").html == "Adicionar aos amigos?") {
        $("#addAmigo").html("")
    }
    setTimeout(function () {
        $("#mouseout").mouseout(function () {
            var arquivo = $('#selecao-arquivo').val()
            if (arquivo == "") {
            } else {
                $('#nomeImgPoster').html("Imagem selecionada")
            }
        })

        $(".btn").click(function () {
            $(this).next('ul').toggle();
        });
        $("#buttonPRF").click(function () {
            if (localStorage.getItem('button-left') == 1) {
                localStorage.setItem('button-left', '0')
                $('#nav-left').hide(1000)
                $('#buttonPRF2').show(1000);
                $('#navCenter').animate({ left: '5%' }, 1000)
            } else {
                localStorage.setItem('button-left', '1')
                $('#nav-left').show(1000);
                $('#buttonPRF2').hide(1000)
                $('#navCenter').animate({ left: '20%' }, 1000)
            }
        });
        $("#buttonPRF2").click(function () {
            if (localStorage.getItem('button-left') == 1) {
                localStorage.setItem('button-left', '0')
                $('#nav-left').hide(1000)
                $('#buttonPRF2').show(1000);
                $('#navCenter').animate({ left: '5%' }, 1000)
            } else {
                localStorage.setItem('button-left', '1')
                $('#nav-left').show(1000);
                $('#buttonPRF2').hide(1000)
                $('#navCenter').animate({ left: '20%' }, 1000)
            }
        });
        $("#buttonAMG").click(function () {
            if (localStorage.getItem('button-right') == 1) {
                localStorage.setItem('button-right', '0')
                $('#nav-right').hide(1000)
                $('#buttonAMG2').show(1000);
                $('#navCenter').animate({ right: '5%' }, 1000)
            } else {
                localStorage.setItem('button-right', '1')
                $('#nav-right').show(1000);
                $('#buttonAMG2').hide(1000)
                $('#navCenter').animate({ right: '23%' }, 1000)
            }
        });
        $("#buttonAMG2").click(function () {
            if (localStorage.getItem('button-right') == 1) {
                localStorage.setItem('button-right', '0')
                $('#nav-right').hide(1000)
                $('#buttonAMG2').show(1000);
                $('#navCenter').animate({ right: '5%' }, 1000)
            } else {
                localStorage.setItem('button-right', '1')
                $('#nav-right').show(1000);
                $('#buttonAMG2').hide(1000)
                $('#navCenter').animate({ right: '23%' }, 1000)
            }
        });
    }, 200);
    setTimeout(function () {
        $("#mouseout").mouseout(function () {
            var arquivo = $('#selecao-arquivo').val()
            if (arquivo == "") {
            } else {
                $('#nomeImgPoster').html("Imagem selecionada")
            }
        })
    }, 2000);
    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $(input).next()
                    .attr('src', e.target.result)
            };
            reader.readAsDataURL(input.files[0]);
        }
        else {
            var img = input.value;
            $(input).next().attr('src', img);
        }
    }

    function verificaMostraBotao() {
        $('input[type=file]').each(function (index) {
            if ($('input[type=file]').eq(index).val() != "") {
                readURL(this);
                $('.hide').show();
            }
        });
    }
    $(".openIMG").append($('<input />', { type: "file" }).change(verificaMostraBotao));
    $(".openIMG").append($('<img />'));

    $('body').on('mousemove', function () {
        $(function () {
            $.ajax({
                method: "post",
                url: "online.php",
                data: $("#form").serialize(),
                success: function (data) {
                    console.log(data);
                    $.ajax({
                        method: "post",
                        url: "status.php",
                        data: $("#form").serialize(),
                        success: function (data2) {
                        }
                    });
                }
            });
        });
    });
    $.ajax({
        method: "post",
        url: "status.php",
        data: $("#form").serialize(),
        success: function (data) {
            $(".status2").html(data);
        }
    });
    setInterval(function () {
        $.ajax({
            method: "post",
            url: "amigostatus.php",
            data: $("#form").serialize(),
            success: function (amigo) {
                $(".sAmigos").html(amigo);
            }
        });
    }, 2000);
    $.ajax({
        method: "post",
        url: "amigostatus.php",
        data: $("#form").serialize(),
        success: function (amigo) {
            $(".sAmigos").html(amigo);
        }
    });
    $(".message").mouseover(function () {
        $(".like", this).html('<3, comentario')
    })
    $(".message").mouseout(function () {
        $(".like", this).html('')
    })
});