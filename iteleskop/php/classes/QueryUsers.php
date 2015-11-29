<?php

 class QueryUsers {

    private $_db;
    protected $_result;
    public $results;

    public function __construct() {
        global $photon_catcher_host;
        global $photon_catcher_user;
        global $photon_catcher_pass;
        global $photon_catcher_db;

        $this->_db = new mysqli($photon_catcher_host, $photon_catcher_user,
                                $photon_catcher_pass, $photon_catcher_db);

        $_db = $this->_db;

        if ($_db->connect_error) {
            die('Connection Error: ' . $_db->connect_error);
        }

        return $_db;
    }

    public function getResults($params) {
        $_db = $this->_db;

        $_result = $_db->query("SELECT user_id, login, firstname, lastname, share, phone, email FROM users") or
            die('Connection Error: ' . $_db->connect_error);

        $results = array();

        while ($row = $_result->fetch_assoc()) {
            array_push($results, $row);
        }

        $this->_db->close();

        return $results;
    }

 }

/* COMMENTED OUT: Prints the data returned by MySQL
 $x = new QueryUsers();
 $y = $x->getResults("");
 print_r($y);
 echo 'Hello world'; */
?>
