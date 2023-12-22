<?php 
require_once('./sql.php'); 

class ValidateRequest extends SqlWork {
    public function checkFields($firstname, $secondname, $role){
        $errors = [];

        if (empty($firstname)) {
            $errors[] = ['code' => 1, 'message' => 'You cannot leave the firstname field empty!'];
        }
        if (empty($secondname)) {
            $errors[] = ['code' => 2, 'message' => 'You cannot leave the secondname field empty!'];
        }
        if (empty($role)) {
            $errors[] = ['code' => 3, 'message' => 'You have not selected a role!'];
        }
        if (!empty($errors)) {
            http_response_code(500);
            echo json_encode(['status' => false, 'errors' => $errors]);
            die();
        }
    }

    public function actionCheck($data){
        if($data['action'] === 'checkUser'){
            echo $this->getUser($data['id']);
        }
        if ($data['action'] === 'changeUsers') {
            echo $this->changeAllUsers($data['users']);
        }
        if ($data['action'] === 'deleteUsers') {
            echo $this->deleteAllUsers($data['users']);
        }
        if ($data['action'] === 'deleteUser') {
            echo $this->deleteUser($data['id']);
        }
        die();
    }


    public function updateAdd($data){
        if (empty($data['action'])) {
            $id = htmlspecialchars(trim($data['id']));
            $firstname = htmlspecialchars(trim($data['firstname']));
            $secondname = htmlspecialchars(trim($data['secondname']));
            $role = htmlspecialchars(trim($data['role']));
            
            $this->checkFields($firstname, $secondname, $role); 
        
            if (!empty($id)) {
                $this->updateUser($data);
                echo $this->getUser($id);
            } else {
                $this->addUser($data);
                echo $this->getUser($id);
            }
        }
    }
} 





