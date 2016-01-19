// Funkcja konwertuje rektascencje z formatu H:M:S do zapisu zmiennoprzecinkowego.
function RAhmsToFloat(h, m, s) {
    var ra = parseFloat(h) + parseFloat(m)/60 + parseFloat(s)/3600;
    return (ra.toFixed(8));
}

// Funkcja konwertuje rektascencje z formatu zmiennoprzecinkowego do stringa
// w postaci H:M:S, np. 12h34m56s
function RAfloatToHMS(ra) {
    if (ra == 0) {
        return ("-");
    }

    var h = Math.floor(ra); // Hours
    var tmp = (ra - h)*60; //
    var m = Math.floor(tmp);
    tmp = (tmp - m)*60;
    var s = Math.floor(tmp);

    return (h + "h" + m + "m" + s + "s");
}

// Fukcja konwertuje deklinacje z formatu zmiennoprzecinkowego na
// stopnie, minuty, sekundy
function DeclinationFloatToDMS(dec, superscript) {
    if (dec == 0) {
        return ("-");
    }

    var superscript = typeof superscript !== 'undefined' ? superscript : true;

    var negative = false;
    if (dec < 0) {
        negative = true;
        dec = -dec;
    }

    var deg = Math.floor(dec);
    var tmp = (dec - deg)*60;
    var m = Math.floor(tmp);
    tmp = (tmp - m)*600;
    var s = Math.round(tmp)/10;

    if (negative) {
        deg = -deg;
    }

    if (superscript) {
        return (deg + "<sup>o</sup> " + m + "\'" + s + "\"");
    } else {
        return (deg + "deg. " + m + "m " + s + "s ");
    }
}


function DeclinationDMSToFloat(d, m, s) {
    var ra = parseFloat(d) + parseFloat(m)/60 + parseFloat(s)/3600;
    return (ra.toFixed(8));
}
