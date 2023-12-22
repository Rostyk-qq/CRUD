<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');


require_once('./validate.php');
$validate = new ValidateRequest();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $req = file_get_contents('php://input');
    $data = json_decode($req, true);     

    if(isset($data)){
        if (isset($data['action'])) {
            $validate->actionCheck($data);
        }   
        else{
            $validate->updateAdd($data);
        }
    }
    else{
        http_response_code(500);
        echo json_encode(['status' => false, 'error' => ['code' => 500, 'message' => 'Data cannot exists!']]);
        die();
    }
}
if($_SERVER['REQUEST_METHOD'] === 'GET'){
    echo $validate->getAllUsers();
}  
