<?php

require_once("../config.php");

class AddTask {

    private $_db;

    // Konstruktor, tworzy polaczenia do MySQL i wola metody odpowiedzialne
    // za pobranie danych z wywolania POST, weryfikacje, a potem stawienie
    // do bazy i wygenerowanie odpowiedzi.
    public function __construct() {
        global $photon_catcher_host;
        global $photon_catcher_user;
        global $photon_catcher_pass;
        global $photon_catcher_db;

        $this->_db = new mysqli($photon_catcher_host, $photon_catcher_user,
                                $photon_catcher_pass, $photon_catcher_db);

        $_db = $this->_db;

        if ($_db->connect_errno) {
            die('Connection Error: ' . $_db->connect_error);
        }

        return $_db;
    }

    function validate($data) {
        if (!isset($data) || !is_array($data)) {
            $this->failure("Validation failed: passed data is not an array");
        }
    }

    function quoted($data, $name, $comma) {
        $txt = '"'.$data[$name].'"';
        if ($comma) {
            return $txt.", ";
        } else {
            return $txt;
        }
    }
    
    function insert($data) {
        $q = 'INSERT INTO tasks(user_id, scope_id, object, ra, decl, exposure, descr, '.
             'filter, binning, defocus, calibrate, solve, vphot, other_cmd, min_alt, '.
             'moon_distance, skip_before, skip_after, skip_interval, '.
             'skip_period_seconds, skip_period_count, comment, state, created)'.
            'SELECT '.
            $this->quoted($data, 'user_id', true).
            $this->quoted($data, 'scope_id', true).
            $this->quoted($data, 'object', true).
            $this->quoted($data, 'ra', true).
            $this->quoted($data, 'decl', true).
            $this->quoted($data, 'exposure', true).
            $this->quoted($data, 'descr', true).
            $this->quoted($data, 'filter', true).
            $this->quoted($data, 'binning', true).
            $this->quoted($data, 'defocus', true).
            $this->quoted($data, 'calibrate', true).
            $this->quoted($data, 'solve', true).
            $this->quoted($data, 'vphot', true).
            $this->quoted($data, 'other_cmd', true).
            $this->quoted($data, 'min_alt', true).
            $this->quoted($data, 'moon_distance', true).
            $this->quoted($data, 'skip_before', true).
            $this->quoted($data, 'skip_after', true).
            $this->quoted($data, 'skip_interval', true).
            $this->quoted($data, 'skip_period_seconds', true).
            $this->quoted($data, 'skip_period_count', true).
            $this->quoted($data, 'comment', true).
            "ts.state, ". // new task state = 0 (NEW)
            "now() ".     // created
            " FROM task_states ts WHERE ts.name='NEW'";

        $_db = $this->_db;

        $_result = $_db->query($q) or
            $this->failure("<b>Błąd podłączenia do bazy</b><br/>".
                           "Informacje debugowe: DB error=". $_db->error."<br/>".
                "DB connection error=". $_db->connect_error);
        
        $last_id = $_db->insert_id;

        $txt = "Dodano zadanie obserwacji <b>".$data['object'].
            "</b>, id zadania <b>".$last_id."</b>";

        $this->success($txt);
    }

    function success($txt) {
        printf('{ "success": true, "msg": "%s" }', $txt);
    }

    function failure($txt) {
        printf('{ "failure": true, "msg": "%s" }', $txt);
        die();
    }

    function getParam($name) {
        if (isset($_POST[$name])) {
            $this->data[$name] = $_POST[$name];
            return;
        }
        if (!isset($_GET[$name])) {
            $this->failure("Brak obowiazkowego parametru ".$name);
        }
        $this->data[$name] = $_GET[$name];
        return;
    }

    function getBoolParam($name) {
        if (isset($_POST[$name])) {
            if ($_POST[$name] == "on") {
                $this->data[$name] = 1;
            } else {
                $this->data[$name] = 0;
            }
            return;
        }
        if (isset($_GET[$name])) {
            if ($_GET[$name] == "on") {
                $this->data[$name] = 1;
            } else {
                $this->data[$name] = 0;
            }
            return;
        }
        $this->data[$name] = 0;
    }
    
    // Czas odebrac wszystkie dane
    function getData() {
        $this->data = array();

        $this->getParam("user_id");
        $this->getParam("scope_id");
        $this->getParam("object");
        $this->getParam("ra");
        $this->getParam("decl");
        $this->getParam("exposure");
        $this->getParam("descr");
        $this->getParam("filter");
        $this->getParam("binning");
        $this->getBoolParam("defocus");
        $this->getBoolParam("calibrate");
        $this->getBoolParam("solve");
        $this->getBoolParam("vphot");
        $this->getParam("other_cmd");
        $this->getParam("min_alt");
        $this->getParam("moon_distance");
        $this->getParam("skip_before");
        $this->getParam("skip_after");
        $this->getParam("skip_interval");
        $this->getParam("skip_period_seconds");
        $this->getParam("skip_period_count");
        $this->getParam("comment");

        return ($this->data);
    }

    // Konwertuje otrzymane dane do jednego stringa
    // Uzyteczne glownie w celach debugowych.
    function dataToText($x) {
        $str = "";
        foreach ($x as $key => $value) {
            $str .= $key."=".$value." ";
        }
        return $str;
    }
};

// Stworz instancje klasy AddTask
$x = new AddTask();

// Pobierz dane przekazane przez POST lub GET. Jezeli brakuje jakiejs
// danej, zostanie zawolane failure() z odpowiednimi parametrami i
// skrypt przerwie dzialanie.
$data = $x->getData();

// Sprawdz, czy dane sa poprawne.
$x->validate($data);

// Wstaw dane do bazy.
$x->insert($data);

?>
