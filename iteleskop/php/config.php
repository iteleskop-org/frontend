<?php

// Global variables used in all PHP files.
$photon_catcher_host = 'localhost';
$photon_catcher_user = 'iteleskop';
$photon_catcher_pass = 'Vox0OhMa';
$photon_catcher_db   = 'iteleskop';

$photon_catcher_debug = false;

 function get_extdirect_api() {

    $API = array(
        'QueryUsers' => array(
            'methods' => array(
                'getResults' => array(
                    'len' => 1
                    )
                )
            ),
        'Tasks' => array(
            'methods' => array(
                'getResults' => array(
                    'len' => 1
                    ),
                'update' => array(
                    'params' => array(
                        'user_id',
                        'task_id',
                        'new_state'
                        )
                    ),
                'deleteTask' => array(
                    'params' => array(
                        'user_id',
                        'task_id'
                        )
                    )
                )
            ),
        'QueryObjects' => array(
            'methods' => array(
                'getResults' => array(
                    'len' => 1
                    )
                )
            ),
        'AddTask' => array(
            'methods' => array(
                'cloneTask' => array(
                    'params' => array (
                        'user_id',
                        'state',
                        'object',
                        'ra',
                        'decl',
                        'exposure',
                        'descr',
                        'filter',
                        'binning',
                        'guiding',
                        'dither',
                        'defocus',
                        'calibrate',
                        'solve',
                        'min_alt',
                        'max_sun_alt',
                        'moon_distance',
                        'max_moon_phase',
                        'min_interval',
                        'skip_before',
                        'skip_after',
                        'scope_id',
                        'auto_center',
                        'vphot'
                        )
                    )
                )
            ),
        'Login' => array(
            'methods' => array(
                'verify' => array(
                    'params' => array(
                        'user',
                        'md5pass'
                        )
                    )
                )
            )
        );

    return $API;
 }

?>
