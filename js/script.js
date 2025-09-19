function enviar() {

    var name = document.getElementById("nameid");

    if (name.value != "") {
        alert('SHAZAAAAAM, ' + name.value + '. Sua mensagem foi enviada. Obrigado pelo contato!');
    }
    else {
        alert('HOUSTON WE HAVE A PROBLEM, ' + name.value + 'sua mensagem não foi enviada. Tente novamente, se não se importar!')
    }
}